import type { NextPageWithLayout } from "./_app";
import Head from "next/head";

const Home: NextPageWithLayout = () => {
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
      <main className="min-w-screen mx-auto flex min-h-screen flex-col items-center justify-center bg-background-light p-4 dark:bg-background-dark">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 dark:text-white md:text-[5rem]">
          Woodcut
        </h1>
      </main>
    </>
  );
};

export default Home;
