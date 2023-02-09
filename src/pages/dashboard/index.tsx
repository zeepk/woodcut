import { useState } from "react";
import Head from "next/head";
import type { NextPageWithLayout } from "../_app";
import LoadingSpinner from "../../components/LoadingSpinner";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import PlayerSkillSummary from "../../components/PlayerSkillSummary";
import ActivityList from "../../components/ActivityList";
import type { Activity } from "../../types/user-types";

const Dashboard: NextPageWithLayout = () => {
  const { data, isFetching: userFetching } = trpc.auth.getUserData.useQuery();
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const { isFetching: activitiesFetching } =
    trpc.auth.getFollowingActivities.useQuery(undefined, {
      refetchOnMount: true,
      onSuccess: (data) => setActivities(data),
    });

  const noAccountsLinkedText = (
    <div className="mt-20 flex max-w-[30rem] flex-col items-center justify-center text-center">
      <span className="text-2xl font-bold text-gray-700 dark:text-white">
        {`Looks like you haven't linked your RuneScape account. You can do this in your `}
        <Link href="/user-profile" className="text-gainz-800 hover:underline">
          account settings.
        </Link>
      </span>
    </div>
  );

  if (userFetching) {
    return (
      <main className="border-box max-w-screen mx-auto flex h-full flex-col items-center justify-start bg-background-light p-4 py-20 dark:bg-background-dark md:max-h-[100vh] md:min-h-[100vh]">
        <LoadingSpinner size="h-8 w-8" />
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Woodcut Dashboard</title>
        <meta
          name="description"
          content="RuneScape stat tracker and hiscores tool"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="border-box max-w-screen mx-auto flex h-full flex-col items-center justify-start bg-background-light p-4 py-20 dark:bg-background-dark dark:text-white md:max-h-[100vh] md:min-h-[100vh]">
        {!data || data.playerAccounts.length === 0 ? (
          noAccountsLinkedText
        ) : (
          <div className="flex h-[80vh] w-full flex-row items-start justify-center">
            <div className="flex h-full w-7/12 flex-row items-start justify-between">
              {data.playerAccounts.map((account) => (
                <div className="mx-4 h-full grow" key={account.id}>
                  <PlayerSkillSummary username={account.username} />
                </div>
              ))}
            </div>
            <div className="mx-4 flex h-full w-5/12 items-center justify-center">
              {activitiesFetching ? (
                <LoadingSpinner size="h-8 w-8" />
              ) : (
                <ActivityList
                  activities={activities ?? []}
                  title="Followed Players"
                />
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Dashboard;
