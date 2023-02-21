import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import type { NextPageWithLayout } from "./_app";
import Head from "next/head";
import ActivityList from "../components/ActivityList";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Activity } from "../types/user-types";
import { isCurrentlyDxp } from "../utils/constants";
import TopDxpList from "../components/TopDxpList";

const Home: NextPageWithLayout = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [activities, setActivities] = useState<Activity[] | null>(null);
  const { isFetching } = trpc.player.getHomePageActivities.useQuery(undefined, {
    refetchOnMount: true,
    onSuccess: (data) => setActivities(data),
  });
  const { isFetching: topDxpFetching, data: topDxpData } =
    trpc.player.getTopDxpPlayers.useQuery(undefined, {
      refetchOnMount: true,
      enabled: isCurrentlyDxp(),
    });

  const showDxp = isCurrentlyDxp() && topDxpData && topDxpData.length > 0;
  const showActivities = activities && activities.length > 0;
  const handleSearch = (e: any) => {
    setLoading(true);
    e.preventDefault();
    router.push(`/rs3/${search.split(" ").join("+")}`);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };
  const dataLoading = topDxpFetching || (isFetching && !activities);

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
      <main className="border-box max-w-screen mx-auto flex h-full flex-col items-center justify-start bg-background-light p-4 py-20 dark:bg-background-dark md:max-h-[100vh] md:min-h-[100vh]">
        <div
          className={`flex h-full w-11/12 ${
            isCurrentlyDxp() ? "md:flex-col" : "md:flex-row"
          } align-center flex-col items-center pb-20 md:w-full md:items-center`}
        >
          <div
            className={`flex h-full flex-col items-center justify-center ${
              isCurrentlyDxp() ? "md:w-full" : "md:mt-[30vh] md:w-8/12"
            }`}
          >
            <h1 className="text-5xl font-extrabold leading-normal text-gray-700 dark:text-white md:text-[5rem]">
              Woodcut
            </h1>
            <form
              onSubmit={handleSearch}
              className="hidden h-12 items-end md:flex"
            >
              <input
                type="text"
                className="mr-2 block h-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-xl text-zinc-900 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
                placeholder="Search for a player"
                required
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="flex h-full w-36 items-center justify-center rounded bg-forest-500 py-2 font-bold text-white hover:brightness-110"
              >
                {loading ? <LoadingSpinner size="h-8 w-8" /> : "Search"}
              </button>
            </form>
          </div>
          {dataLoading ? (
            <div className="flex h-full w-full items-center justify-center pt-20">
              <LoadingSpinner size="h-24 w-24" />
            </div>
          ) : (
            <div
              className={`mt-10 flex w-full items-start justify-center ${
                isCurrentlyDxp()
                  ? "max-w-[80rem] md:h-[70vh] md:w-full"
                  : "md:h-[80vh] md:w-5/12"
              }`}
            >
              <div
                className={`w-full ${
                  isCurrentlyDxp() ? "h-full p-4 md:w-6/12" : "md:full"
                }`}
              >
                {showDxp && <TopDxpList players={topDxpData} />}
              </div>
              <div
                className={`w-full ${
                  isCurrentlyDxp() ? "h-full p-4 md:w-6/12" : "md:full"
                }`}
              >
                {showActivities && <ActivityList activities={activities} />}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
