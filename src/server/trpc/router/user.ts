import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, publicProcedure } from "../trpc";
import { getPlayerData } from "../../common/stat-services";

export const userRouter = router({
  getUserStats: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      const { username } = input;
      const userGainsResponse = await getPlayerData({ username, ctx });

      if (!userGainsResponse.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: userGainsResponse.message,
        });
      }

      return userGainsResponse;
    }),
});
