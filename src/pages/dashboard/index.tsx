import Head from "next/head";
import { useAuth } from "@clerk/nextjs";
import type { NextPageWithLayout } from "../_app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { trpc } from "../../utils/trpc";

const Dashboard: NextPageWithLayout = () => {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  const { data, isFetching } = trpc.auth.getUserData.useQuery(undefined, {
    onSuccess: (data) => {
      console.log(data);
    },
    // router.push("/");
  });

  if (isFetching) {
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
      <main className="border-box max-w-screen mx-auto flex h-full flex-col items-center justify-start bg-background-light p-4 py-20 dark:bg-background-dark md:max-h-[100vh] md:min-h-[100vh]">
        <h1>Dashboard</h1>
        <h1>{data?.username}</h1>
      </main>
    </>
  );
};

export default Dashboard;
