import Script from "next/script";
import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import type { NextPageWithLayout } from "./_app";
import Head from "next/head";
import ActivityList from "../components/ActivityList";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Activity, TopPlayer } from "../types/user-types";
import TopDxpList from "../components/TopDxpList";
import { isCurrentlyDxp } from "../utils/constants";
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID;

const Home: NextPageWithLayout = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [xpData, setXpData] = useState<TopPlayer[] | null>(null);
  const { isFetching } = trpc.player.getHomePageActivities.useQuery(undefined, {
    refetchOnMount: true,
    onSuccess: (data) => setActivities(data),
  });

  const getGains = isCurrentlyDxp()
    ? trpc.player.getTopDxpPlayers
    : trpc.player.getTopWeeklyPlayers;
  const { isFetching: isXpFetching } = getGains.useQuery(undefined, {
    refetchOnMount: true,
    onSuccess: (data) => setXpData(data),
  });

  const showActivities = activities && activities.length > 0;
  const handleSearch = (e: any) => {
    setLoading(true);
    e.preventDefault();
    router.push(`/rs3/${search.split(" ").join("+")}`);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
  `}
      </Script>
      <main className="border-box max-w-screen mx-auto flex h-full flex-col items-center justify-start bg-background-light p-4 py-20 dark:bg-background-dark md:max-h-[100vh] md:min-h-[90vh]">
        <div className="flex h-full w-full flex-col items-center md:w-11/12 md:flex-row md:items-start">
          <div className="order-2 mt-10 flex w-full items-center justify-center md:order-1 md:h-[60vh] md:w-4/12">
            {isXpFetching && !xpData && (
              <LoadingSpinner size="h-24 w-24 my-[20vh] md:my-0" />
            )}
            {xpData && <TopDxpList players={xpData} />}
          </div>
          <div className="order-1 flex h-full flex-col items-center justify-center px-[3rem] md:order-2 md:mt-[30vh] md:w-4/12">
            <h1 className="text-5xl font-extrabold leading-normal text-gray-700 dark:text-white md:text-[4rem]">
              Woodcut
            </h1>
            <form
              onSubmit={handleSearch}
              className="flex h-20 flex-col items-center md:flex"
            >
              <input
                type="text"
                className="mb-2 mr-2 block h-full rounded-lg border border-zinc-300 bg-zinc-50 p-2 text-center text-lg text-zinc-900 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
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
          <div className="order-3 mt-10 flex w-full items-center justify-center md:h-[60vh] md:w-4/12">
            {isFetching && !activities && (
              <LoadingSpinner size="hidden md:block h-24 w-24" />
            )}
            {showActivities && <ActivityList activities={activities} />}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
