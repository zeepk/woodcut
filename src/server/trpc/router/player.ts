import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { router, publicProcedure } from "../trpc";
import { getPlayerData, getTopDxpPlayers } from "../../common/stat-services";
import { getFormattedActivities } from "../../common/activity-services";

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
    const activities = await getFormattedActivities({ ctx });
    return activities;
  }),
  getTopDxpPlayers: publicProcedure.query(async ({ ctx }) => {
    const players = await getTopDxpPlayers(ctx);
    console.log("players", players);
    return players;
  }),
});
