import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, publicProcedure } from "../trpc";
import { addActivities, getPlayerData } from "../../common/stat-services";

const Activity = z.object({
  date: z.optional(z.string()),
  occurred: z.string(),
  text: z.string(),
  details: z.string(),
  imageUrl: z.optional(z.string()),
  price: z.optional(z.number()),
  importance: z.optional(z.number()),
});

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
      take: 10,
    });

    return activities;
  }),
  addPlayerActivities: publicProcedure
    .input(z.object({ playerId: z.number(), activities: z.array(Activity) }))
    .mutation(async ({ input, ctx }) => {
      const { playerId, activities } = input;
      const addActivitiesResponse = await addActivities({
        playerId,
        activities,
        ctx,
      });

      if (!addActivitiesResponse.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: addActivitiesResponse.message,
        });
      }

      return addActivitiesResponse;
    }),
});
