import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, publicProcedure } from "../trpc";
import { getPlayerData } from "../../common/stat-services";
import { formatActivity } from "../../common/activity-services";
import { textToIgnore, detailsToIgnore } from "../../../utils/constants";

export const playerRouter = router({
  getPlayerStats: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      const { username } = input;
      const playerGainsResponse = await getPlayerData({ username, ctx });

      if (!playerGainsResponse.success) {
        if (
          playerGainsResponse.message ===
          "Player not found on official hiscores"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: playerGainsResponse.message,
          });
        }

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
        AND: [
          {
            OR: [
              {
                price: {
                  equals: 0,
                },
              },
              {
                price: {
                  gt: 1000000,
                },
              },
            ],
          },
          {
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
        ],
      },
      take: 30,
    });

    const formattedActivities = [];

    for (const activity of activities) {
      const formattedActivity = await formatActivity(activity, false);
      formattedActivities.push(formattedActivity);
    }

    return formattedActivities;
  }),
});
