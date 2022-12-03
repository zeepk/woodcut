import { z } from "zod";
import { Skill, TotalSkillsRs3 } from "../../../utils/constants";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  getUserStats: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const { username } = input;
      const resp = {
        username,
        success: true,
        message: "",
        skills: new Array(),
      };

      if (!username || username.length < 1 || username.length > 16) {
        resp.success = false;
        resp.message = "Invalid username";
        return resp;
      }
      const officialStats: string[] = await officialApiCall(username);

      if (officialStats[0]?.includes("Page not found")) {
        resp.success = false;
        resp.message = "Player not found on official hiscores";
        return resp;
      }

      const skills: Skill[] = [];

      for (let i = 0; i < TotalSkillsRs3; i++) {
        const currentSkillString: string[] = officialStats[i].split(",");

        const skillId = i;
        const rank: number = parseInt(currentSkillString[0]);
        const level: number = parseInt(currentSkillString[1]);
        const xp: number = parseInt(currentSkillString[2]);

        skills.push({
          skillId,
          rank,
          level,
          xp,
        });
      }

      resp.skills = skills;

      return resp;
    }),
});

const officialApiCall = async (username: string) => {
  if (username === "test") {
    return "3,2898,5600000000 268,99,200000000 515,99,200000000 294,99,200000000 91,99,200000000 427,99,200000000 132,99,200000000 519,99,200000000 779,99,200000000 196,99,200000000 186,99,200000000 155,99,200000000 512,99,200000000 108,99,200000000 119,99,200000000 295,99,200000000 168,120,200000000 90,99,200000000 919,99,200000000 254,120,200000000 184,120,200000000 83,99,200000000 84,99,200000000 97,99,200000000 306,99,200000000 4091,120,200000000 89,99,200000000 4,120,200000000 3,120,200000000 -1,-1 3400,2501 145,28859770 10,1058 338,5018 498,9150 553,8853 326,9357 508,9980 809,1960 730,474 23197,1252 2908,8681 6228,610 3205,617 23442,871924 -1,-1 2182,57 1313,130 -1,-1 2,186 101380,20 -1,-1 -1,-1 70,30270 2124,1000 -1,-1 8164,1001 4097,879 7884,220".split(
      " "
    );
  }
  const data = await fetch(
    `https://secure.runescape.com/m=hiscore/index_lite.ws?player=${username}`
  )
    .then((res) => res.text())
    .then((res) => res.split("\n"));

  return data;
};
