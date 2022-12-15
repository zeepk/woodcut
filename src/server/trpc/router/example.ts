import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

const updateAllUsersURL = process.env.UPDATE_USERS_SECRET || "";

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
  // updateTest: protectedProcedure.query(({ ctx }) => {
  //   console.log(ctx.session?.user);
  //   return ctx.session;
  // }),
  // // updateTest: publicProcedure.query(({ctx: {
  // // req: GetServerSidePropsContext["req"];
  // // res: GetServerSidePropsContext["res"];
  // // }}) => {
  // // console.log(ctx.req.url);
  // //   return "secret unlocked";
  // // }),
  // [updateAllUsersURL]: publicProcedure.query(() => {
  //   return "secret unlocked";
  // }),
});
