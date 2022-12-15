import { PrismaClient } from "@prisma/client";
import { TotalSkillsRs3, TestData } from "../../utils/constants";
import { Skill } from "../../types/user-types";

type getUserGainsProps = {
  username: string;
  ctx: { prisma: PrismaClient };
};

const createStatRecord = async (
  prisma: any,
  playerId: number,
  username: string,
  existingData?: string[]
) => {
  // make api call to get current stats
  // create new stat record with current skills and minigames
  const data = existingData ?? (await officialApiCall(username));
  if (!data) return null;
  const statRecordData = createStatRecordFromData(data);
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

const officialApiCall = async (username: string) => {
  if (username === "test") {
    return TestData.split(" ");
  }

  const data = await fetch(
    `https://secure.runescape.com/m=hiscore/index_lite.ws?player=${username}`
  )
    .then((res) => res.text())
    .then((res) => res.split("\n"))
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

  // find existing user
  const getExistingPlayer = async () =>
    await ctx.prisma.player.findFirst({
      where: {
        username,
      },
    });

  // find existing user and get current stats
  const data = await Promise.all([
    getExistingPlayer(),
    officialApiCall(username),
  ]);

  let player = data[0];
  const officialStats = data[1];

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
        recentStats: officialStats.toString(),
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

  const skills: Skill[] = [];

  for (let i = 0; i < TotalSkillsRs3; i++) {
    const currentSkillString: string[] = officialStats[i].split(",");

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

export const createNewStatRecordForAllUsers = async () => {
  const prisma = new PrismaClient();
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

  players.forEach(async (player) => {
    const record = await createStatRecord(prisma, player.id, player.username);
    if (!record) return null;

    player.statRecords.push(record);

    // TODO: every x number of players, wait some time before continuing
  });

  return `Created new stat record for ${players.length} players`;
};
