import { router, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";

export const authRouter = router({
  getUserData: publicProcedure.query(({ ctx }) => {
    if (ctx.user) {
      clerkClient.users.updateUserMetadata(ctx.user.id, {
        privateMetadata: {
          playerIds: [1, 2],
        },
      });
      console.log(ctx.user.privateMetadata.playerIds);
      console.log("Logged in!");
      console.log(ctx.user);
    } else {
      console.log("Not logged in!");
    }

    const playerAccounts = (ctx.user?.privateMetadata?.playerIds ??
      []) as number[];

    return {
      user: ctx.user,
      playerAccounts,
    };
  }),
});
