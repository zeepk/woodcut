import { SignIn } from "@clerk/nextjs";
import Head from "next/head";
import type { NextPageWithLayout } from "../_app";
import { dark } from "@clerk/themes";

// sign in
const SignInPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Woodcut Sign In</title>
        <meta name="description" content="Stats for RuneScape 3 player" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen w-full flex-col items-center justify-start overflow-hidden bg-white pt-20 text-text-light dark:bg-background-dark dark:text-text-dark">
        <SignIn
          appearance={{
            baseTheme: dark,
          }}
          path="/sign-up"
          routing="path"
          signUpUrl="/sign-up"
        />
      </main>
    </>
  );
};

export default SignInPage;
