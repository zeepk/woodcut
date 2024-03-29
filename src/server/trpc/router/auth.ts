import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { getClanFromUsername, validateWorld } from "../../common/auth-services";
import { getFormattedActivities } from "../../common/activity-services";

export const authRouter = router({
  getUserData: publicProcedure.query(async ({ ctx }) => {
    const playerIds = (ctx.user?.privateMetadata?.playerIds ?? []) as number[];
    const followingPlayerIds = (ctx.user?.privateMetadata?.followingIds ??
      []) as number[];

    const playerAccounts = await ctx.prisma.player.findMany({
      where: { id: { in: playerIds } },
    });

    return {
      user: ctx.user,
      playerAccounts,
      followingPlayerIds,
    };
  }),
  getFollowingActivities: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      console.error("Not logged in");
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to do this",
      });
    }

    const followingPlayerIds = (ctx.user?.privateMetadata?.followingIds ??
      []) as number[];
    const linkedPlayerIds = (ctx.user.privateMetadata?.playerIds ??
      []) as number[];

    const activities = await getFormattedActivities({
      ctx,
      playerIds: [...followingPlayerIds, ...linkedPlayerIds],
    });
    return activities;
  }),
  deleteVerifiedPlayer: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        console.error("Not logged in");
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to do this",
        });
      }

      await ctx.prisma.player.update({
        where: { id: input.id },
        data: { verification: 0 },
      });

      const playerIds = (ctx.user.privateMetadata?.playerIds ?? []) as number[];
      await clerkClient.users.updateUserMetadata(ctx.user.id, {
        privateMetadata: {
          playerIds: playerIds.filter((id) => id !== input.id),
        },
      });
    }),
  followPlayer: publicProcedure
    .input(z.object({ id: z.number(), unfollow: z.boolean().optional() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        return {
          redirect: true,
        };
      }

      const followingIds = (ctx.user.privateMetadata?.followingIds ??
        []) as number[];
      if (input.unfollow) {
        await clerkClient.users.updateUserMetadata(ctx.user.id, {
          privateMetadata: {
            followingIds: followingIds.filter((id) => id !== input.id),
          },
        });
      } else {
        await clerkClient.users.updateUserMetadata(ctx.user.id, {
          privateMetadata: {
            followingIds: [...followingIds, input.id],
          },
        });
      }
    }),
  checkVerifiedWorld: publicProcedure
    .input(z.object({ username: z.string(), world: z.number() }))
    .query(async ({ input, ctx }) => {
      const resp = {
        success: false,
        message: "",
        verification: 0,
      };
      if (!ctx.user) {
        console.error("Not logged in");
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to do this",
        });
      }

      const players = await ctx.prisma.player.findMany({
        // replace all spaces with +
        where: { username: input.username.replaceAll(" ", "+") },
        take: 1,
      });

      if (players.length === 0) {
        console.error("Player not found");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found, try searching for them first.",
        });
      }

      const player = players[0];
      if (player.verification >= 3) {
        console.error("Player already verified");
        throw new TRPCError({
          code: "CONFLICT",
          message: "Player already verified by another user",
        });
      }

      const clanName = await getClanFromUsername(input.username);
      if (clanName === "") {
        console.error("No clan name found");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player found, but not in a clan",
        });
      }
      if (!clanName) {
        console.error("Player not found on official hiscores");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found on the official hiscores",
        });
      }

      const { success, message } = await validateWorld({
        world: input.world,
        clanName,
        username: input.username,
      });

      if (!success) {
        console.error(message);
        throw new TRPCError({
          code: "NOT_FOUND",
          message,
        });
        // resp.success = true;
        // resp.verification = 2;
        // return resp;
      }

      if (success) {
        const currentVerification = isNaN(player.verification)
          ? 0
          : player.verification;
        const verificationNumber = currentVerification + 1;
        if (verificationNumber === 3 && ctx.user) {
          const playerAccounts = (ctx.user.privateMetadata?.playerIds ??
            []) as number[];
          await clerkClient.users.updateUserMetadata(ctx.user.id, {
            privateMetadata: {
              playerIds: [...playerAccounts, player.id],
            },
          });
        }
        await ctx.prisma.player.update({
          where: { id: player.id },
          data: { verification: verificationNumber },
        });

        resp.success = true;
        resp.verification = verificationNumber;
        return resp;
      }

      return resp;
    }),
});
