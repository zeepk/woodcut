import { useRouter } from "next/router";
import { useState } from "react";
import type { NextPageWithLayout } from "../_app";
import Head from "next/head";
import Avatar from "../../components/Avatar";
import StatTable from "../../components/StatTable";

import { trpc } from "../../utils/trpc";
import ActivityList from "../../components/ActivityList";
import LoadingSpinner from "../../components/LoadingSpinner";
import FollowButton from "../../components/FollowButton";
import MilestoneChart from "../../components/MilestoneCharts";
import Badge from "../../components/Badge";
import { badges } from "../../utils/constants";

const Rs3: NextPageWithLayout = () => {
  const router = useRouter();
  const { username } = router.query;
  const isReady = router.isReady;
  const fetchName = typeof username === "string" ? username : "";
  const [error, setError] = useState("");

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
      onError: (error) => setError(error.data?.code ?? ""),
      onSuccess: () => setError(""),
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

  if (!data && !isFetching && error === "NOT_FOUND") {
    return (
      <>
        {head}

        <main className="flex h-screen w-full flex-col items-center justify-start overflow-hidden bg-white pt-[30vh] text-text-light dark:bg-background-dark dark:text-text-dark">
          <h1 className="mb-5 text-4xl font-bold">
            {`We can't find ${fetchName} on the official RuneScape hiscores.`}
          </h1>
          <p className="text-xl">
            {`Make sure you've entered the name correctly, and that they show up on the `}
            <a
              className="text-cyan-500 hover:underline"
              href="https://secure.runescape.com/m=hiscore/ranking"
            >
              {`official game's hiscores`}
            </a>
          </p>
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
          <div className="flex w-full items-center justify-start p-2">
            <div className="flex w-full flex-wrap items-center justify-start">
              <Avatar username={fetchName} width="w-16" />
              <h1 className="text-text-500 mb-4 mr-4 text-2xl font-bold">
                {data?.player?.displayName || fetchName.split("+").join(" ")}
              </h1>
              <div className="flex w-80 max-w-full flex-wrap items-start justify-start">
                {data?.badgeIds?.map((badgeId) => {
                  const badge = badges.find((b) => b.id === badgeId);
                  if (badge) {
                    return <Badge badge={badge} key={badgeId} />;
                  }
                })}
              </div>
            </div>
            {data?.player?.id && <FollowButton playerId={data.player.id} />}
          </div>
          <div className="divider dark:border-divider-400 w-full border border-gray-500" />
          <div className="mt-5 mb-40 flex w-full flex-row flex-wrap">
            <div className="flex w-full justify-center p-2 md:w-9/12 md:pr-5">
              <StatTable />
            </div>
            <div className="mt-10 w-full p-2 pr-5 dark:text-text-dark md:h-[80vh] md:w-3/12">
              <ActivityList
                activities={data?.activities ?? []}
                username={fetchName}
              />
            </div>
          </div>
          <div className="mt-5 mb-40 flex w-full justify-center">
            <div className="flex w-full flex-row flex-wrap justify-around md:w-8/12">
              {data?.milestoneProgress.map((m) => (
                <div key={m.name} className="p-4 md:w-4/12">
                  <MilestoneChart milestone={m} />
                </div>
              ))}
            </div>
          </div>
        </>
      </main>
    </>
  );
};

export default Rs3;
