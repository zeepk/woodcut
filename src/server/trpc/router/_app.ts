import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { playerRouter } from "./player";

export const appRouter = router({
  example: exampleRouter,
  player: playerRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
