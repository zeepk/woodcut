import { useState } from "react";
import { useRouter } from "next/router";
import Logo from "../assets/images/logo.png";
const Navbar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleLogoClick = (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    router.push(`/rs3/${search.split(" ").join("+")}`);
  };

  return (
    <div className="align-center min-h-5 flex h-[7vh] w-full justify-between bg-gray-300 p-2 dark:bg-zinc-900">
      <img
        onClick={handleLogoClick}
        src={Logo.src}
        alt="logo"
        className="h-full cursor-pointer"
      />

      <form onSubmit={handleSearch} className="flex h-full items-end">
        <input
          type="text"
          className="mr-2 block h-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
          placeholder="Username"
          required
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="h-full rounded bg-forest-500 py-2 px-4 font-bold text-white hover:brightness-110"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Navbar;
