import { PrismaClient } from "@prisma/client";
import { TotalSkillsRs3, TestData } from "../../utils/constants";
import { Skill } from "../../types/user-types";

type getUserGainsProps = {
  username: string;
  ctx: { prisma: PrismaClient };
};

type PlayerResponseData = {
  Username: string;
  Data: string;
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

  const data = await fetch(
    `https://secure.runescape.com/m=hiscore/index_lite.ws?player=${username}`
  )
    .then((res) => res.text())
    .catch((err) => {
      console.log(err);
      return null;
    });

  return data;
};

export const getUserGains = async ({ username, ctx }: getUserGainsProps) => {
  const resp: any = {
    username,
    success: true,
    message: "",
    skills: [],
    created: false,
  };

  // if username is invalid, return right away
  if (!username || username.length < 1 || username.length > 16) {
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

  const officialStats =
    player && playerRecentlyUpdatedInLast60Seconds
      ? player.recentStats
      : await officialApiCall(username);

  // if player doesn't exist return 404
  if (!officialStats || officialStats[0]?.includes("Page not found")) {
    resp.success = false;
    resp.message = "Player not found on official hiscores";
    return resp;
  }

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
  }

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

  const splitOfficialStats = playerRecentlyUpdatedInLast60Seconds
    ? officialStats.split(" ")
    : officialStats.split("\n");

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
    }

    skills.push(skillToAdd);
  }

  resp.skills = skills;

  return resp;
};

export const createNewStatRecordForAllUsers = async (
  playerData: PlayerResponseData[]
) => {
  const prisma = new PrismaClient();
  console.log("created prisma client");
  console.log(playerData.map((pd) => pd.Username));
  const players = await prisma.player.findMany({
    where: {
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

  const successfulPlayerNames: string[] = [];
  const unsuccessfulPlayerNames: string[] = [];

  console.log(players.map((pd) => pd.username));
  for (const player of players) {
    const statData = playerData.find(
      (pd) => pd.Username === player.username
    )?.Data;
    if (!statData) {
      console.log(`No stat data recieved for player: ${player.username}`);
      unsuccessfulPlayerNames.push(player.username);
      return;
    }

    const record = await createStatRecord(
      prisma,
      player.id,
      player.username,
      statData
    );
    if (!record) {
      console.log(`Failed to create stat record for ${player.username}`);
      unsuccessfulPlayerNames.push(player.username);
      return;
    }

    successfulPlayerNames.push(player.username);
  }

  const log = `Successfully created stat records for ${
    successfulPlayerNames.length
  } players: ${successfulPlayerNames.join(
    ", "
  )} but not for ${unsuccessfulPlayerNames.join(", ")}`;
  console.log(log);

  return log;
};
