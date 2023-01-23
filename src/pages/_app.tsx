import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import type { NextPage } from "next";

import { trpc } from "../utils/trpc";
import Navbar from "../components/Navbar";

import "../styles/globals.css";

export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  useEffect(() => {
    if (localStorage) {
      console.log("storage");
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      console.log("no storage");
    }
  }, []);
  return (
    <SessionProvider session={session}>
      <div>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
