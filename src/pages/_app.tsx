import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import type { NextPage } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { AppProps } from "next/app";

import { trpc } from "../utils/trpc";
import Navbar from "../components/Navbar";

import "../styles/globals.css";

export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

console.log(
  "%cI see you poking around... enjoy!",
  "color:pink; font-size:20px"
);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [darkMode, setDarkMode] = useState(true);
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  useEffect(() => {
    document.documentElement.classList.add("dark");
    if (localStorage) {
      if (
        localStorage.theme === "light" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: light)").matches)
      ) {
        document.documentElement.classList.remove("dark");
        setDarkMode(false);
        console.info("Loaded theme: light");
      } else {
        document.documentElement.classList.add("dark");
        setDarkMode(true);
        console.info("Loaded theme: dark");
      }
    }
  }, []);
  return (
    <ClerkProvider
      appearance={
        darkMode
          ? {
              baseTheme: dark,
            }
          : {}
      }
      {...pageProps}
    >
      <div>
        <Navbar setDarkMode={setDarkMode} />
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
