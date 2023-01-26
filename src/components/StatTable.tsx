import { useState } from "react";
import MinigamesTable from "./MinigamesTable";
import SkillsTable from "./SkillsTable";

const StatTable = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const isSkillsTab = currentTab === 0;

  const activeStyle =
    "dark:bg-zinc-900 dark:text-white bg-gray-400 text-black cursor-auto";
  const inactiveStyle =
    "dark:bg-zinc-600 dark:text-white bg-zinc-200 text-black hover:brightness-110 cursor-pointer";

  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex h-10 items-end justify-start">
        <button
          onClick={() => setCurrentTab(0)}
          className={`${
            isSkillsTab ? activeStyle : inactiveStyle
          } flex h-full w-24 items-center justify-center rounded-t-md font-semibold drop-shadow-dark`}
        >
          Skills
        </button>
        <button
          onClick={() => setCurrentTab(1)}
          className={`${
            !isSkillsTab ? activeStyle : inactiveStyle
          } flex h-full w-24 items-center justify-center rounded-t-md font-semibold drop-shadow-dark`}
        >
          Minigames
        </button>
      </div>
      <div className="flex w-full flex-col">
        <div
          className={`w-full overflow-scroll rounded drop-shadow-dark md:overflow-hidden ${
            isSkillsTab ? "" : "hidden"
          }`}
        >
          <SkillsTable />
        </div>
        <div
          className={`w-full overflow-scroll rounded drop-shadow-dark ${
            !isSkillsTab ? "" : "hidden"
          }`}
        >
          <MinigamesTable />
        </div>
      </div>
    </div>
  );
};

export default StatTable;
