import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, publicProcedure } from "../trpc";
import { formatActivity, getPlayerData } from "../../common/stat-services";
import { textToIgnore, detailsToIgnore } from "../../../utils/constants";

export const playerRouter = router({
  getPlayerStats: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      const { username } = input;
      const playerGainsResponse = await getPlayerData({ username, ctx });

      if (!playerGainsResponse.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: playerGainsResponse.message,
        });
      }

      return playerGainsResponse;
    }),
  getHomePageActivities: publicProcedure.query(async ({ ctx }) => {
    const activities = await ctx.prisma.activity.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          OR: [
            ...textToIgnore.map((activity) => ({
              text: {
                contains: activity,
              },
            })),
            ...detailsToIgnore.map((activity) => ({
              details: {
                contains: activity,
              },
            })),
          ],
        },
      },
      take: 30,
    });

    const formattedActivities = [];

    for (const activity of activities) {
      const formattedActivity = await formatActivity(activity);
      formattedActivities.push(formattedActivity);
    }

    return formattedActivities;
  }),
});
