import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, publicProcedure } from "../trpc";
import {
  getPlayerData,
  getTopDxpPlayers,
  getTopPlayersInDateRange,
  getTopRankedPlayers,
} from "../../common/stat-services";
import { getFormattedActivities } from "../../common/activity-services";
import { TotalSkillsRs3 } from "../../../utils/constants";

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
    const activities = await getFormattedActivities({
      ctx,
      limit: 30,
      price: 10_000_000,
    });
    return activities;
  }),
  getTopDxpPlayers: publicProcedure.query(async ({ ctx }) => {
    const players = await getTopDxpPlayers(ctx);
    return players;
  }),
  getTopWeeklyPlayers: publicProcedure.query(async ({ ctx }) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const players = await getTopPlayersInDateRange(ctx, oneWeekAgo);
    return players.filter((player) => player.gain > 0).slice(0, 10);
  }),
  getAllActivities: publicProcedure.query(async ({ ctx }) => {
    const activities = await getFormattedActivities({
      ctx,
      limit: 250,
      price: 100_000,
    });
    return activities;
  }),
  getTopNecroPlayers: publicProcedure.query(async () => {
    const [overall, necromancy] = await Promise.all([
      getTopRankedPlayers(0),
      getTopRankedPlayers(TotalSkillsRs3 - 1),
    ]);

    return [overall, necromancy];
  }),
});
