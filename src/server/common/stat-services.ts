import type { PrismaClient } from "@prisma/client";
import {
  TotalSkillsRs3,
  TestData,
  RunescapeApiBaseUrlRs3,
  SkillIdsElite,
  SkillIds120,
  EliteXp99,
  EliteXp120,
  Xp120,
  Xp99,
  MaxXp,
  xpMaxTotal,
  xpAll120,
  XpAll99,
  dxpStartDate,
  dxpEndDate,
} from "../../utils/constants";
import type {
  Activity,
  Minigame,
  PlayerDataResponse,
  Progress,
  Skill,
} from "../../types/user-types";
import {
  formatActivity,
  officialRuneMetricsApiCall,
  type RuneMetricsResponse,
} from "./activity-services";

type getPlayerGainsProps = {
  username: string;
  ctx: { prisma: PrismaClient };
};

const getSundayOfCurrentWeek = () => {
  // TODO: check if this is correct
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastSunday = new Date(today.setDate(today.getDate() - today.getDay()));
  return lastSunday;
};

const createStatRecord = async (
  prisma: any,
  playerId: number,
  username: string,
  existingData?: string
) => {
  // make api call to get current stats
  // create new stat record with current skills and minigames
  const data = existingData ?? (await officialApiCall(username));
  if (!data) return null;
  const statRecordData = createStatRecordFromData(data.split("\n"));
  const statRecord = await prisma.statRecord.create({
    data: {
      ...statRecordData,
      playerId,
    },
    include: {
      skills: true,
      minigames: true,
    },
  });

  console.log(`Created stat record for ${username}`);
  return statRecord;
};

const createStatRecordFromData = (data: string[]) => {
  const skills = data.slice(0, 29).map((skill: string, index: number) => {
    const skillString: string[] = skill.split(",");
    return {
      skillId: index,
      rank: Number(skillString[0]),
      level: Number(skillString[1]),
      xp: Number(skillString[2]),
    };
  });

  const minigames = data
    .slice(29, -1)
    .map((minigame: string, index: number) => {
      const minigameString: string[] = minigame.split(",");
      return {
        minigameId: index + 29,
        rank: Number(minigameString[0]),
        score: Number(minigameString[1]),
      };
    });

  return {
    skills: {
      create: skills,
    },
    minigames: {
      create: minigames,
    },
  };
};

const officialApiCall = async (username: string): Promise<string | null> => {
  if (username === "test") {
    return TestData.split(" ").join("\n");
  }

  const data = await fetch(`${RunescapeApiBaseUrlRs3}${username}`)
    .then((res) => res.text())
    .catch((err) => {
      console.log(err);
      return null;
    });

  return data;
};

export const getPlayerData = async ({
  username,
  ctx,
}: getPlayerGainsProps): Promise<PlayerDataResponse> => {
  const today = new Date();
  const resp: PlayerDataResponse = {
    success: true,
    message: "",
    skills: [],
    minigames: [],
    activities: [],
    created: false,
    milestoneProgress: [],
  };

  // if username is invalid, return right away
  if (username.length < 1 || username.length > 16) {
    resp.success = false;
    resp.message = "Invalid username";
    return resp;
  }

  let player = await ctx.prisma.player.findFirst({
    where: {
      username,
    },
  });
  const playerRecentlyUpdatedInLast60Seconds = player?.lastChecked
    ? player.lastChecked > new Date(Date.now() - 60000)
    : false;

  const statsApiCall =
    player && playerRecentlyUpdatedInLast60Seconds
      ? Promise.resolve(player.recentStats)
      : officialApiCall(username);
  const activitiesApiCall = officialRuneMetricsApiCall(username);

  const [officialStats, officialActivities] = await Promise.all([
    statsApiCall,
    activitiesApiCall,
  ]);

  // if player doesn't exist return 404
  if (!officialStats || officialStats?.includes("Page not found")) {
    resp.success = false;
    resp.message = "Player not found on official hiscores";
    return resp;
  }

  if (officialActivities) {
    officialActivities.activities.forEach(async (a: Activity) => {
      const activity = await formatActivity(a, true);
      resp.activities.push(activity);
    });
  }

  // if no existing player is found, need to create a new player with baseline stat record
  if (!player) {
    const newPlayer = await ctx.prisma.player.create({
      data: {
        username,
        recentStats: officialStats,
        isTracking: true,
        displayName: officialActivities?.name ?? username,
      },
      include: {
        statRecords: {
          include: {
            skills: true,
            minigames: true,
          },
        },
      },
    });
    const record = await createStatRecord(
      ctx.prisma,
      newPlayer.id,
      newPlayer.username,
      officialStats
    );
    newPlayer.statRecords.push(record);
    player = newPlayer;
    resp.created = true;
    resp.skills = record.skills;
    resp.minigames = record.minigames;
    resp.player = player;
    return resp;
  }
  resp.player = player;

  // if we made an api call, update the player's recent checked date
  if (!playerRecentlyUpdatedInLast60Seconds) {
    await ctx.prisma.player.update({
      where: {
        id: player.id,
      },
      data: {
        lastChecked: today,
        recentStats: officialStats,
        displayName: officialActivities?.name ?? username,
      },
    });
  }

  // most recent Sunday
  const weekStart = getSundayOfCurrentWeek();

  // first day of current month
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // first day of current year
  const yearStart = new Date(today.getFullYear(), 0, 1);

  const statRecordQueries = [weekStart, monthStart, yearStart].map((date) =>
    ctx.prisma.statRecord.findFirst({
      where: {
        playerId: player?.id,
        createdAt: {
          gte: date,
        },
      },
      include: {
        skills: true,
        minigames: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    })
  );

  statRecordQueries.unshift(
    ctx.prisma.statRecord.findFirst({
      where: {
        playerId: player.id,
      },
      include: {
        skills: true,
        minigames: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  );

  // dxp records
  statRecordQueries.push(
    ctx.prisma.statRecord.findFirst({
      where: {
        playerId: player.id,
        createdAt: {
          lte: dxpStartDate,
        },
      },
      include: {
        skills: true,
        minigames: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  );

  const currentDxp = today > dxpEndDate;
  if (currentDxp) {
    statRecordQueries.push(
      ctx.prisma.statRecord.findFirst({
        where: {
          playerId: player.id,
          createdAt: {
            lte: dxpEndDate,
          },
        },
        include: {
          skills: true,
          minigames: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })
    );
  }

  const [
    dayRecord,
    weekRecord,
    monthRecord,
    yearRecord,
    dxpStartRecord,
    dxpEndRecord,
  ] = await Promise.all(statRecordQueries);

  const splitOfficialStats = officialStats.split("\n");

  const skills: Skill[] = [];

  for (let i = 0; i < TotalSkillsRs3; i++) {
    const currentSkillString: string[] = splitOfficialStats[i].split(",");

    const skillId = i;
    const rank: number = parseInt(currentSkillString[0]);
    const level: number = parseInt(currentSkillString[1]);
    const xp: number = parseInt(currentSkillString[2]);

    const skillToAdd: Skill = {
      skillId,
      rank,
      level,
      xp,
    };

    if (!resp.created) {
      const dayRecordSkill = dayRecord?.skills.at(i);
      if (dayRecordSkill?.xp) {
        skillToAdd.dayGain = xp - Math.max(Number(dayRecordSkill.xp), 0);
      }

      const weekRecordSkill = weekRecord?.skills.at(i);
      if (weekRecordSkill?.xp) {
        skillToAdd.weekGain = xp - Math.max(Number(weekRecordSkill.xp), 0);
      }

      const monthRecordSkill = monthRecord?.skills.at(i);
      if (monthRecordSkill?.xp) {
        skillToAdd.monthGain = xp - Math.max(Number(monthRecordSkill.xp), 0);
      }

      const yearRecordSkill = yearRecord?.skills.at(i);
      if (yearRecordSkill?.xp) {
        skillToAdd.yearGain = xp - Math.max(Number(yearRecordSkill.xp), 0);
      }

      if (dxpStartRecord) {
        const dxpStartRecordSkill = dxpStartRecord?.skills.at(i);
        if (yearRecordSkill?.xp) {
          const endXp = dxpEndRecord
            ? Number(dxpEndRecord?.skills.at(i)?.xp)
            : xp;
          skillToAdd.dxpGain =
            endXp - Math.max(Number(dxpStartRecordSkill?.xp), 0);
        }
      }
    }

    skills.push(skillToAdd);
  }

  resp.skills = skills;

  const minigames: Minigame[] = [];

  for (let i = TotalSkillsRs3; i < splitOfficialStats.length; i++) {
    const currentMinigameString: string[] = splitOfficialStats[i].split(",");
    if (splitOfficialStats[i].trim() === "") continue;

    const minigameId = i;
    const rank: number = Math.max(parseInt(currentMinigameString[0]), 0);
    const score: number = Math.max(parseInt(currentMinigameString[1]), 0);

    const minigameToAdd: Minigame = {
      minigameId,
      rank,
      score,
    };

    if (!resp.created) {
      const dayRecordMinigame = dayRecord?.minigames.at(i);
      if (dayRecordMinigame?.score) {
        minigameToAdd.dayGain =
          score - Math.max(Number(dayRecordMinigame.score), 0);
      }

      const weekRecordMinigame = weekRecord?.minigames.at(i);
      if (weekRecordMinigame?.score) {
        minigameToAdd.weekGain =
          score - Math.max(Number(weekRecordMinigame.score), 0);
      }

      const monthRecordMinigame = monthRecord?.minigames.at(i);
      if (monthRecordMinigame?.score) {
        minigameToAdd.monthGain =
          score - Math.max(Number(monthRecordMinigame.score), 0);
      }

      const yearRecordMinigame = yearRecord?.minigames.at(i);
      if (yearRecordMinigame?.score) {
        minigameToAdd.yearGain =
          score - Math.max(Number(yearRecordMinigame.score), 0);
      }
    }

    minigames.push(minigameToAdd);
  }

  resp.minigames = minigames;

  const milestoneProgress = getMilestoneProgress(skills, officialActivities);
  resp.milestoneProgress = milestoneProgress;
  return resp;
};

const getMilestoneProgress = (
  skills: Skill[],
  quests: Pick<
    RuneMetricsResponse,
    "questsStarted" | "questsCompleted" | "questsNotStarted"
  > | null
) => {
  let xpTowardMax = 0;
  let xpTowardMaxTotal = 0;
  let xpTowardAll120 = 0;
  const xpTowardAll200m =
    Number(skills.find((skill) => skill.skillId === 0)?.xp) ?? 0;

  skills.forEach((skill) => {
    if (SkillIdsElite.includes(skill.skillId)) {
      xpTowardMax += Math.min(EliteXp99, Number(skill.xp));
      xpTowardMaxTotal += Math.min(EliteXp120, Number(skill.xp));
      xpTowardAll120 += Math.min(EliteXp120, Number(skill.xp));
    } else if (SkillIds120.includes(skill.skillId)) {
      xpTowardMax += Math.min(Xp99, Number(skill.xp));
      xpTowardMaxTotal += Math.min(Xp120, Number(skill.xp));
      xpTowardAll120 += Math.min(Xp120, Number(skill.xp));
    } else if (skill.skillId > 0) {
      // don't want to include "overall"
      xpTowardMax += Math.min(Xp99, Number(skill.xp));
      xpTowardMaxTotal += Math.min(Xp99, Number(skill.xp));
      xpTowardAll120 += Math.min(Xp120, Number(skill.xp));
    }
  });

  const resp: Progress[] = [
    {
      name: "Max",
      current: xpTowardMax,
      required: XpAll99,
      remaining: XpAll99 - xpTowardMax,
      percent: (xpTowardMax / XpAll99) * 100,
    },
    {
      name: "Max Total",
      current: xpTowardMaxTotal,
      required: xpMaxTotal,
      remaining: xpMaxTotal - xpTowardMaxTotal,
      percent: (xpTowardMaxTotal / xpMaxTotal) * 100,
    },
    {
      name: "120 All",
      current: xpTowardAll120,
      required: xpAll120,
      remaining: xpAll120 - xpTowardAll120,
      percent: (xpTowardAll120 / xpAll120) * 100,
    },
    {
      name: "200m All",
      current: xpTowardAll200m,
      required: MaxXp,
      remaining: MaxXp - xpTowardAll200m,
      percent: (xpTowardAll200m / MaxXp) * 100,
    },
  ];

  if (quests) {
    const totalQuests =
      quests.questsNotStarted + quests.questsStarted + quests.questsCompleted;
    const questCape = {
      name: "Quest Cape",
      current: quests.questsCompleted,
      required: totalQuests,
      remaining: quests.questsNotStarted,
      percent: (quests.questsCompleted / totalQuests) * 100,
      midRange: quests.questsStarted,
    };

    resp.push(questCape);
  }

  return resp;
};
