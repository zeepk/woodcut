import { router } from "../trpc";
import { authRouter } from "./auth";
import { playerRouter } from "./player";

export const appRouter = router({
  player: playerRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
