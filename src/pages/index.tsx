import type { NextPageWithLayout } from "./_app";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

const Home: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  const examples = trpc.example.getAllExamples.useQuery();

  const handleClick = trpc.example.addExample.useMutation({
    async onSuccess() {
      await utils.example.getAllExamples.invalidate();
    },
  });

  return (
    <>
      <Head>
        <title>Woodcut - RuneScape Stat Tracker</title>
        <meta
          name="description"
          content="RuneScape stat tracker and hiscores tool"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center bg-white p-4 dark:bg-zinc-800">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 dark:text-white md:text-[5rem]">
          Woodcut
        </h1>
      </main>
    </>
  );
};

export default Home;
