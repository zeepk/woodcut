import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "../db/client";

// get return type of async user function
type User = inferAsyncReturnType<typeof clerkClient.users.getUser>;

const createContextInner = async ({ user }: { user: User | null }) => {
  return { user, prisma };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  async function getUser() {
    // get userId from request
    const { userId } = getAuth(opts.req);
    // get full user object
    const user = userId ? await clerkClient.users.getUser(userId) : null;
    return user;
  }

  const user = await getUser();

  return await createContextInner({ user });
};

export type Context = inferAsyncReturnType<typeof createContext>;
