import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAllExamples: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  addExample: publicProcedure.mutation(({ ctx }) => {
    return ctx.prisma.example.create({
      data: {},
    });
  }),
});
