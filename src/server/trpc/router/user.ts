import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { getUserGains } from "../../common/stat-services";

export const userRouter = router({
  getUserStats: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      const { username } = input;
      const userGainsResponse = await getUserGains({ username, ctx });

      return userGainsResponse;
    }),
});
