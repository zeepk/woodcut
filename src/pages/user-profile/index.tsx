import type { NextPageWithLayout } from "../_app";
import Head from "next/head";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserProfile,
} from "@clerk/nextjs";
import { trpc } from "../../utils/trpc";
import LoadingSpinner from "../../components/LoadingSpinner";

const UserProfilePage: NextPageWithLayout = () => {
  const { data, isFetching } = trpc.auth.getUserData.useQuery(undefined, {});
  const playerAccounts = data?.playerAccounts;

  if (isFetching) {
    return <LoadingSpinner size="h-8 w-8" />;
  }

  if (!data?.user || !playerAccounts) {
    return <RedirectToSignIn redirectUrl="/" />;
  }

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
      <main className="border-box max-w-screen mx-auto flex h-full flex-col items-center justify-start bg-background-light p-4 py-20 text-text-light dark:bg-background-dark dark:text-text-dark md:max-h-[100vh] md:min-h-[100vh]">
        <h1 className="my-16 text-4xl">Account Settings</h1>
        <div className="min-h-24 mb-16 flex w-[55rem] flex-col items-center justify-center rounded-2xl dark:bg-zinc-800">
          <h1 className="my-4 text-xl">Linked Accounts</h1>
          {playerAccounts.length === 0 && (
            <h1 className="mb-8 text-2xl">None yet!</h1>
          )}
          {playerAccounts.map((playerAccount) => (
            <div
              key={playerAccount}
              className="mb-4 flex w-9/12 items-center justify-between"
            >
              <div>{playerAccount}</div>
              <div>
                <button
                  onClick={() => console.log("TODO")}
                  className="flex h-full w-36 items-center justify-center rounded bg-forest-500 py-2 font-bold text-white hover:brightness-110"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => console.log("TODO")}
            className="mb-8 flex h-full w-36 items-center justify-center rounded bg-forest-500 py-2 font-bold text-white hover:brightness-110"
          >
            Link Account
          </button>
        </div>
        <SignedIn>
          <UserProfile />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn redirectUrl="/" />
        </SignedOut>
      </main>
    </>
  );
};

export default UserProfilePage;
