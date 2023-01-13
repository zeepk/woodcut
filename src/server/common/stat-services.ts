import type { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import {
  TotalSkillsRs3,
  TestData,
  RunescapeApiBaseUrlRs3,
  RunescapeApiPlayerMetricsUrlPre,
  RunescapeApiPlayerMetricsUrlPost,
} from "../../utils/constants";
import type {
  Activity,
  DataResponse,
  Minigame,
  PlayerDataResponse,
  Skill,
} from "../../types/user-types";

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
    return TestData;
  }

  const data = await fetch(`${RunescapeApiBaseUrlRs3}${username}`)
    .then((res) => res.text())
    .catch((err) => {
      console.log(err);
      return null;
    });

  return data;
};

const officialActivitiesApiCall = async (
  username: string
): Promise<Activity[] | null> => {
  const data = await fetch(
    `${RunescapeApiPlayerMetricsUrlPre}${username}${RunescapeApiPlayerMetricsUrlPost}`
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        return null;
      }

      const activities: Activity[] = res.activities.map((a: any) => ({
        date: new Date(a.date),
        text: a.text,
        details: a.details,
      }));

      return activities;
    })
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
  const resp: PlayerDataResponse = {
    success: true,
    message: "",
    skills: [],
    minigames: [],
    activities: [],
    created: false,
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
  const activitiesApiCall = officialActivitiesApiCall(username);

  const [officialStats, officialActivities] = await Promise.all([
    statsApiCall,
    activitiesApiCall,
  ]);

  // if player doesn't exist return 404
  if (!officialStats || officialStats[0]?.includes("Page not found")) {
    resp.success = false;
    resp.message = "Player not found on official hiscores";
    return resp;
  }

  resp.activities =
    officialActivities?.map((a: Activity) => formatActivity(a)) ?? [];

  // if no existing player is found, need to create a new player with baseline stat record
  if (!player) {
    const newPlayer = await ctx.prisma.player.create({
      data: {
        username,
        recentStats: officialStats,
        isTracking: true,
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
        lastChecked: new Date(),
        recentStats: officialStats,
      },
    });
  }

  const dayRecord = await ctx.prisma.statRecord.findFirst({
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
  });

  // most recent Sunday
  const weekStart = getSundayOfCurrentWeek();

  // first day of current month
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  // first day of current year
  const yearStart = new Date(new Date().getFullYear(), 0, 1);

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

  const [weekRecord, monthRecord, yearRecord] = await Promise.all(
    statRecordQueries
  );

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
  return resp;
};

const formatActivity = (activity: Activity) => {
  const response: Activity = {
    occurred: activity.date ?? new Date(),
    text: activity.text,
    details: activity.details,
  };

  if (activity.text.includes("Levelled up ")) {
    const level = activity.details.split("level ")[1].replace(".", "");
    const skill = activity.text.split("up ")[1].replace(".", "");
    response.text = `${skill} level ${level}`;
  }

  if (activity.text.includes("XP in ")) {
    const skill = activity.text.split("XP in ")[1].replace(".", "");
    let level = activity.text.split("XP in ")[0].replace(".", "");
    if (level.substring(level.length - 6) == "000000") {
      level = level.substring(0, level.length - 6) + "m";
    }
    response.text = `${level} xp in ${skill}`;
  }

  if (activity.details.includes("experience points in the")) {
    response.details = "";
  }

  // if (activity.text.includes("I killed "))
  // {
  //     var boss = activity.text
  //         .split("I killed ")[1]
  //         .split(" ")[1]
  //         .replace(".", "");
  //     var bossResponse = await OfficialApiCall("https://secure.runescape.com/m=itemdb_rs/bestiary/beastSearch.json?term=" + boss);
  //     var joResponse = JArray.Parse(bossResponse);
  //     var bossId = joResponse.FirstOrDefault()?.Value<int>("value");
  //     var bossInfoApiUrl = "https://secure.runescape.com/m=itemdb_rs/bestiary/beastData.json?beastid=" + bossId;
  //
  //     var bossInfoResponse = await OfficialApiCall(bossInfoApiUrl);
  // }

  if (activity.text.includes("I found ")) {
    let item = "";
    if (activity.text.includes("I found a pair of ")) {
      item = activity.text.split("I found a pair of ")[1];
    } else if (activity.text.includes("I found a ")) {
      item = activity.text.split("I found a ")[1];
    } else if (activity.text.includes("I found an ")) {
      item = activity.text.split("I found an ")[1];
    } else if (activity.text.includes("I found some ")) {
      item = activity.text.split("I found some ")[1];
    } else {
      return response;
    }

    // var itemPriceResponse = await OfficialApiCall(Constants.ExternalApiItemPriceUrl + item.Replace(".", ""));

    try {
      const price = 421304982;
      response.price = price;
      if (price != null) {
        if (price > 20000000) {
          response.importance = 1;
        }
        if (price > 100000000) {
          response.importance = 2;
        }
      }
      try {
        const itemId = 0;
        // var itemDetailsResponseString =
        //     await OfficialApiCall(Constants.RunescapeApiItemDetailsUrl + itemId);
        // if (itemDetailsResponseString == null)
        // {
        //            return response;
        //        }
        const iconUri = "";
        response.imageUrl = iconUri;
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return response;
};

type AddActivitiesProps = {
  playerId: number;
  activities: Activity[];
  ctx: any;
};

export const addActivities = async ({
  playerId,
  activities,
  ctx,
}: AddActivitiesProps): Promise<DataResponse> => {
  const resp: DataResponse = {
    success: true,
    message: "",
  };

  // first, get list of exisitng activities
  const existingActivities = await ctx.prisma.activity.findMany({
    where: {
      playerId,
    },
  });

  const activitiesToCreate: any[] = [];

  activities.reverse().forEach((activity) => {
    const activityDate = DateTime.fromJSDate(activity.occurred);
    const isDuplicate = existingActivities.some(
      (ea: Activity) =>
        ea.text === activity.text &&
        ea.details === activity.details &&
        DateTime.fromJSDate(ea.occurred).toISO() === activityDate.toISO()
    );

    if (!isDuplicate) {
      activitiesToCreate.push({
        ...activity,
        playerId,
        occurred: activityDate.toISO(),
      });
    }
  });

  await ctx.prisma.activity.createMany({
    data: activitiesToCreate,
    skipDuplicates: true,
  });

  return resp;
};
