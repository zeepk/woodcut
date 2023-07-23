// tabs of different activity views, each with searching
// all, drops (gp filter), skilling milestones
import { useRouter } from "next/router";
import { useState } from "react";
import type { NextPageWithLayout } from "./_app";
import Head from "next/head";

import { trpc } from "./../utils/trpc";
import ActivitiesTable from "./../components/ActivitiesTable";
import LoadingSpinner from "./../components/LoadingSpinner";

const activeStyle =
  "dark:bg-zinc-900 dark:text-white bg-gray-400 text-black cursor-auto";
const inactiveStyle =
  "dark:bg-zinc-600 dark:text-white bg-zinc-200 text-black hover:brightness-110 cursor-pointer";

const Rs3: NextPageWithLayout = () => {
  const router = useRouter();
  const isReady = router.isReady;
  const [error, setError] = useState("");
  const [currentTab, setCurrentTab] = useState<number>(0);
  const isSkillsTab = currentTab === 0;

  const { data, isFetching } = trpc.player.getAllActivities.useQuery(
    undefined,
    {
      enabled: isReady,
      retry: false,
      refetchOnMount: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      onError: (error) => setError(error.data?.code ?? ""),
      onSuccess: () => setError(""),
    }
  );

  const head = (
    <Head>
      <title>Woodcut Stats</title>
      <meta name="description" content="RuneScape 3 Activities" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );

  if (isFetching) {
    return (
      <>
        {head}

        <main className="flex h-screen w-full flex-col items-center justify-start overflow-hidden bg-white pt-[30vh] text-text-light dark:bg-background-dark dark:text-text-dark">
          <div className="flex h-80 w-full items-center justify-center">
            <LoadingSpinner size="h-24 w-24" />
          </div>
        </main>
      </>
    );
  }

  if ((!data || error) && !isFetching) {
    return (
      <>
        {head}

        <main className="flex h-screen w-full flex-col items-center justify-start overflow-hidden bg-white pt-[30vh] text-text-light dark:bg-background-dark dark:text-text-dark">
          <h1 className="mb-5 text-4xl font-bold">
            {`You've hit an error! Try refreshing your browser.`}
          </h1>
          <p className="text-xl">
            If the error persists, please contact me on Twitter @matthughes2112
          </p>
        </main>
      </>
    );
  }

  if (!data) {
    return <></>;
  }

  return (
    <>
      {head}

      <main className="max-w-screen flex min-h-screen flex-col items-center justify-start bg-white px-2 pt-20 text-text-light dark:bg-background-dark dark:text-text-dark">
        <>
          <div className="flex w-full max-w-[1200px] flex-col justify-start">
            <div className="flex h-10 items-end justify-start">
              <button
                onClick={() => setCurrentTab(0)}
                className={`${
                  isSkillsTab ? activeStyle : inactiveStyle
                } flex h-full w-36 items-center justify-center rounded-t-md font-semibold drop-shadow-dark`}
              >
                All Activities
              </button>
              <button
                onClick={() => console.log(1)}
                className={`${
                  !isSkillsTab ? activeStyle : inactiveStyle
                } flex h-full w-48 items-center justify-center rounded-t-md font-semibold drop-shadow-dark`}
              >
                {`Showing ${data?.length ?? 0} activities`}
              </button>
            </div>
            <div className="flex w-full flex-col">
              <div
                className={`w-full overflow-scroll rounded drop-shadow-dark md:overflow-hidden ${
                  isSkillsTab ? "" : "hidden"
                }`}
              >
                <ActivitiesTable activities={data} />
              </div>
              <div
                className={`w-full overflow-scroll rounded drop-shadow-dark md:overflow-hidden ${
                  !isSkillsTab ? "" : "hidden"
                }`}
              >
                <h1 className="mb-5 text-4xl font-bold">Minigames</h1>
              </div>
            </div>
          </div>
        </>
      </main>
    </>
  );
};

export default Rs3;
