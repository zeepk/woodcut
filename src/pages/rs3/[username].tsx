import { useRouter } from "next/router";
import type { NextPageWithLayout } from "../_app";
import Head from "next/head";
import Avatar from "../../components/Avatar";
import StatTable from "../../components/StatTable";

import { trpc } from "../../utils/trpc";
import ActivityList from "../../components/ActivityList";
import { Activity } from "../../types/user-types";

const Rs3: NextPageWithLayout = () => {
  const router = useRouter();
  const { username } = router.query;
  const fetchName = typeof username === "string" ? username : "";

  const { data, isFetching } = trpc.user.getUserStats.useQuery(
    {
      username: fetchName,
    },
    {
      retry: false,
      refetchOnMount: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const skills = data?.skills ?? [];
  const activities = data?.activities ?? [];

  const loading = isFetching || !skills;

  return (
    <>
      <Head>
        <title>Stats</title>
        <meta name="description" content="Stats for RuneScape 3 player" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-screen flex min-h-screen flex-col items-start justify-start bg-white text-text-light dark:bg-background-dark dark:text-text-dark">
        <>
          <div className="flex w-full items-center justify-start py-5">
            <Avatar username={fetchName} width="w-20" />
            <h1 className="text-text-500 mb-4 text-4xl font-bold">
              {fetchName.split("+").join(" ")}
            </h1>
          </div>
          <div className="divider dark:border-divider-400 w-full border border-gray-500" />
          {loading ? (
            <div className="flex h-80 w-full items-center justify-center">
              <div
                className="h-24 w-24 animate-spin rounded-full
                    border-4 border-solid border-green-500 border-t-transparent shadow-md"
              ></div>
            </div>
          ) : (
            <div className="mt-5 flex w-full flex-row">
              <div className="w-9/12 p-2 pr-5">
                <StatTable skills={skills} />
              </div>
              <div className="h-[80vh] w-3/12 p-2 pr-5">
                <ActivityList
                  activities={activities.sort(
                    (a: Activity, b: Activity) =>
                      a.date.getTime() - b.date.getTime()
                  )}
                />
              </div>
            </div>
          )}
        </>
      </main>
    </>
  );
};

export default Rs3;
