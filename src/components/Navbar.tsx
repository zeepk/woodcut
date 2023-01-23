import { FormEventHandler, MouseEventHandler, useState } from "react";
import { useRouter } from "next/router";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Logo from "../assets/images/logo.png";
import LogoSmall from "../assets/images/logoSmall.png";
import LoadingSpinner from "./LoadingSpinner";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  // const darkMode = localStorage && localStorage.theme === "dark";

  const toggleDarkMode = () => {
    if (localStorage.theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "dark";
    }
  };

  const handleLogoClick: MouseEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault();
    router.push("/");
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
    <div className="align-center min-h-5 absolute flex h-[7vh] w-full justify-between bg-gainz-900 p-2 drop-shadow-dark dark:bg-zinc-900">
      <img
        onClick={handleLogoClick}
        src={LogoSmall.src}
        alt="logo"
        className="h-full cursor-pointer md:hidden"
      />
      <img
        onClick={handleLogoClick}
        src={Logo.src}
        alt="logo"
        className="hidden h-full cursor-pointer md:block"
      />

      <div className="align-start flex items-center">
        <button
          onClick={toggleDarkMode}
          className="mr-5 rounded p-2 hover:bg-gray-200 focus:outline-none dark:hover:bg-gray-700"
        >
          <MoonIcon className="h-5 w-5 text-zinc-500 dark:hidden" />
          <SunIcon className="hidden h-5 w-5 text-white dark:block" />
        </button>
        <form onSubmit={handleSearch} className="flex h-full items-end">
          <input
            type="text"
            className="mr-2 block h-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-zinc-500 dark:focus:ring-zinc-500 md:text-xl"
            placeholder="Username"
            required
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="flex h-full w-16 items-center justify-center rounded bg-forest-500 py-2 font-bold text-white hover:brightness-110 md:w-36"
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
      </div>
    </div>
  );
};

export default Navbar;
