import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MagnifyingGlassIcon, Bars3Icon } from "@heroicons/react/24/solid";
import Logo from "../assets/images/logo.png";
import LoadingSpinner from "./LoadingSpinner";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { necroReleased, necroReleaseDate } from "../utils/constants";
import Necromancy from "../assets/skillIcons/30_necromancy.png";

interface NavbarProps {
  setDarkMode: (darkMode: boolean) => void;
}

const Navbar = ({ setDarkMode }: NavbarProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDatetime, setCurrentDatetime] = useState<Date | null>(null);

  // time between now and necro release
  const secondsUntilNecro =
    (necroReleaseDate.getTime() - (currentDatetime?.getTime() ?? 0)) / 1000;
  // convert to seconds
  const hours = Math.floor(secondsUntilNecro / 3600);
  const minutes = Math.floor((secondsUntilNecro % 3600) / 60);
  const seconds = Math.floor(secondsUntilNecro % 60);
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const timer = `${hours}:${minutesString}:${secondsString}`;

  useEffect(() => {
    setInterval(() => {
      setCurrentDatetime(new Date());
    }, 1000);
  }, []);

  const toggleDarkMode = () => {
    if (localStorage.theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setDarkMode(false);
      console.info("Saved theme: light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setDarkMode(true);
      console.info("Saved theme: dark");
    }
  };

  const handleLogoClick = (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  const handleActivitiesClick = (e: any) => {
    e.preventDefault();
    router.push("/activities");
  };

  const handleSearch = (e: any) => {
    setLoading(true);
    e.preventDefault();
    router.push(`/rs3/${search.split(" ").join("+")}`);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  return (
    <div className="align-center min-h-4 absolute z-10 flex h-[50px] w-full justify-between bg-gainz-900 p-2 drop-shadow-dark dark:bg-zinc-900">
      <div className="flex h-full items-center">
        <img
          onClick={handleLogoClick}
          src={Logo.src}
          alt="logo"
          className="absolute w-40 cursor-pointer md:relative md:h-full md:w-auto"
        />

        {
          // search bar with button, hidden on mobile
        }
        <form
          onSubmit={handleSearch}
          className="ml-8 hidden h-full items-start md:flex"
        >
          <input
            type="text"
            className="text-md mr-2 block h-full rounded-lg border border-zinc-300 bg-zinc-50 p-2 text-zinc-900 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
            placeholder="Username"
            required
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="flex h-full w-16 items-center justify-center rounded bg-forest-500 py-2 font-bold text-white hover:brightness-110 md:w-24"
          >
            {loading ? (
              <LoadingSpinner size="h-8 w-8" />
            ) : (
              <div>
                <p className="hidden md:block">Search</p>
                <MagnifyingGlassIcon className="mx-1 h-6 w-6 md:hidden" />
              </div>
            )}
          </button>
        </form>
        <button
          onClick={handleActivitiesClick}
          className="ml-2 hidden h-full w-24 items-center justify-center rounded bg-none py-2 font-bold text-white hover:underline md:flex md:w-36"
        >
          Activities [beta]
        </button>
        {!necroReleased && currentDatetime && (
          <div
            className="ml-48 flex h-full w-28 items-center justify-center rounded bg-gray-700 py-2 text-sm font-semibold tracking-widest text-white md:ml-2 md:w-40 md:text-lg"
            title="Necromancy release date"
          >
            <img src={Necromancy.src} alt="necromancy" className="mr-2 h-6" />
            {timer}
          </div>
        )}
      </div>

      {
        // dark mode button and auth buttons, hidden on mobile
      }
      <div className="align-start hidden items-center md:flex">
        <button
          onClick={toggleDarkMode}
          className="mr-2 rounded p-2 hover:bg-gray-200 focus:outline-none dark:hover:bg-gray-700"
        >
          <MoonIcon className="h-5 w-5 text-zinc-500 dark:hidden" />
          <SunIcon className="hidden h-5 w-5 text-white dark:block" />
        </button>
        <div className="mx-2 h-full">
          <SignedIn>
            <div className="flex h-full">
              <button
                onClick={() => router.push("/dashboard")}
                className="mr-2 rounded bg-gray-200 p-2 hover:brightness-110 focus:outline-none dark:bg-gray-200"
              >
                Dashboard
              </button>
              <UserButton
                userProfileMode="navigation"
                userProfileUrl="/user-profile"
                appearance={{
                  elements: {
                    rootBox: "h-full w-full",
                    userButtonBox: "h-full w-full",
                    userButtonTrigger: "h-full w-full",
                    userButtonAvatarBox: "h-full w-full",
                    avatarImage: "h-full w-full",
                  },
                }}
              />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex hidden h-full w-16 items-center justify-center rounded bg-forest-500 py-1 font-bold text-white hover:brightness-110 md:block md:w-24">
                <p>Sign In</p>
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>

      {
        // mobile nav menu, hidden on desktop
      }
      <div className="absolute right-2 block md:hidden">
        <NavigationMenu.Root>
          <NavigationMenu.List className="flex justify-end">
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className="flex h-[34px] w-12 items-center justify-center rounded bg-forest-500 py-2 font-bold text-white hover:brightness-110">
                <Bars3Icon className="h-6 w-6" />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="NavigationMenuContent">
                <ul>
                  <li className="flex justify-end py-2">
                    <NavigationMenu.Link asChild>
                      <button
                        onClick={toggleDarkMode}
                        className="flex items-center justify-between rounded bg-gray-200 p-2 hover:bg-gray-200 hover:brightness-110 focus:outline-none focus:outline-none dark:bg-gray-200"
                      >
                        <p className="mr-2">Toggle theme</p>
                        <MoonIcon className="h-5 w-5 text-text-light dark:hidden" />
                        <SunIcon className="hidden h-5 w-5 text-text-light dark:block" />
                      </button>
                    </NavigationMenu.Link>
                  </li>
                  <SignedIn>
                    <li className="flex justify-end py-2">
                      <NavigationMenu.Link asChild>
                        <button
                          onClick={() => router.push("/dashboard")}
                          className="rounded bg-gray-200 p-2 hover:brightness-110 focus:outline-none dark:bg-gray-200"
                        >
                          Dashboard
                        </button>
                      </NavigationMenu.Link>
                    </li>
                  </SignedIn>
                  <SignedIn>
                    <li className="flex justify-end py-2">
                      <NavigationMenu.Link asChild>
                        <UserButton
                          userProfileMode="navigation"
                          userProfileUrl="/user-profile"
                          appearance={{
                            elements: {
                              rootBox: "h-16 w-16",
                              userButtonBox: "h-full w-full",
                              userButtonTrigger: "h-full w-full",
                              userButtonAvatarBox: "h-full w-full",
                              avatarImage: "h-full w-full",
                            },
                          }}
                        />
                      </NavigationMenu.Link>
                    </li>
                  </SignedIn>
                  <SignedOut>
                    <li className="flex justify-end py-2">
                      <NavigationMenu.Link asChild>
                        <SignInButton mode="modal">
                          <button className="flex h-full w-24 items-center justify-center rounded bg-forest-500 py-2 font-bold text-white hover:brightness-110">
                            <p>Sign In</p>
                          </button>
                        </SignInButton>
                      </NavigationMenu.Link>
                    </li>
                  </SignedOut>
                  <li className="flex justify-end py-2">
                    <button
                      onClick={handleActivitiesClick}
                      className="ml-2 flex h-full w-36 items-center justify-center rounded border border-white bg-none py-2 font-bold text-white hover:underline"
                    >
                      Activities [beta]
                    </button>
                  </li>
                  <li className="flex justify-end py-2">
                    <form onSubmit={handleSearch} className="flex">
                      <input
                        type="text"
                        className="z-50 mr-2 block rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-zinc-500 dark:focus:ring-zinc-500 md:text-xl"
                        placeholder="Username"
                        required
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button
                        onClick={handleSearch}
                        className="flex h-full w-16 items-center justify-center rounded bg-forest-500 py-2 font-bold text-white hover:brightness-110"
                      >
                        {loading ? (
                          <LoadingSpinner size="h-8 w-8" />
                        ) : (
                          <MagnifyingGlassIcon className="mx-1 h-6 w-6" />
                        )}
                      </button>
                    </form>
                  </li>
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Indicator className="NavigationMenuIndicator">
              <div className="Arrow" />
            </NavigationMenu.Indicator>
          </NavigationMenu.List>

          <NavigationMenu.Viewport className="rounded bg-zinc-800 py-2 pl-8 pr-2 drop-shadow-dark" />
        </NavigationMenu.Root>
      </div>
    </div>
  );
};

export default Navbar;
