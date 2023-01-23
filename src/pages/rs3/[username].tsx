import { useRouter } from "next/router";
import { useState } from "react";
import type { NextPageWithLayout } from "../_app";
import Head from "next/head";
import Avatar from "../../components/Avatar";
import StatTable from "../../components/StatTable";

import { trpc } from "../../utils/trpc";
import ActivityList from "../../components/ActivityList";
import LoadingSpinner from "../../components/LoadingSpinner";

const Rs3: NextPageWithLayout = () => {
  const router = useRouter();
  const { username } = router.query;
  const isReady = router.isReady;
  const fetchName = typeof username === "string" ? username : "";
  const [error, setError] = useState(false);

  const { data, isFetching } = trpc.player.getPlayerStats.useQuery(
    {
      username: fetchName,
    },
    {
      enabled: isReady,
      retry: false,
      refetchOnMount: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      onError: () => setError(true),
      onSuccess: () => setError(false),
    }
  );

  const head = (
    <Head>
      <title>Woodcut Stats</title>
      <meta name="description" content="Stats for RuneScape 3 player" />
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

  return (
    <>
      {head}

      <main className="max-w-screen flex min-h-screen flex-col items-start justify-start bg-white px-2 pt-20 text-text-light dark:bg-background-dark dark:text-text-dark">
        <>
          <div className="flex w-full items-center justify-start py-5">
            <Avatar username={fetchName} width="w-20" />
            <h1 className="text-text-500 mb-4 text-4xl font-bold">
              {fetchName.split("+").join(" ")}
            </h1>
          </div>
          <div className="divider dark:border-divider-400 w-full border border-gray-500" />
          <div className="mt-5 mb-40 flex w-full flex-row flex-wrap">
            <div className="w-full p-2 md:w-9/12 md:pr-5">
              <StatTable />
            </div>
            <div className="mt-10 w-full p-2 pr-5 dark:text-text-dark md:h-[80vh] md:w-3/12">
              <ActivityList
                activities={data?.activities ?? []}
                username={fetchName}
              />
            </div>
          </div>
        </>
      </main>
    </>
  );
};

export default Rs3;
