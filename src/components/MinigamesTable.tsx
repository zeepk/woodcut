import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";
import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import GainsHeaderDropdown from "./GainsHeaderDropdown";
import type { Minigame } from "../types/user-types";
import { minigameNameArray, TotalSkillsRs3 } from "../utils/constants";

type SortDigit = -1 | 0 | 1;
export type GainsPeriod = "week" | "month" | "year";

const MinigamesTable = () => {
  const router = useRouter();
  const { username } = router.query;
  const isReady = router.isReady;
  const fetchName = typeof username === "string" ? username : "";

  const { data } = trpc.player.getPlayerStats.useQuery(
    {
      username: fetchName,
    },
    {
      enabled: isReady,
    }
  );

  const minigames = data?.minigames ?? [];
  const [scoreSort, setScoreSort] = useState<SortDigit>(0);
  const [rankSort, setRankSort] = useState<SortDigit>(0);
  const [dayGainSort, setDayGainSort] = useState<SortDigit>(0);
  const [gainsPeriod, setGainsPeriod] = useState<GainsPeriod>("week");

  const gainsPeriodProperty = (minigame: Minigame) => {
    if (gainsPeriod === "week") return Number(minigame.weekGain);
    if (gainsPeriod === "month") return Number(minigame.monthGain);
    if (gainsPeriod === "year") return Number(minigame.yearGain);
    return 0;
  };

  const sortedMinigames = minigames.sort((a: Minigame, b: Minigame) => {
    if (scoreSort === 1) return Number(b.score) - Number(a.score);
    if (scoreSort === -1) return Number(a.score) - Number(b.score);

    if (rankSort === 1) return b.rank - a.rank;
    if (rankSort === -1) return a.rank - b.rank;

    if (a.dayGain && b.dayGain) {
      if (dayGainSort === 1) return Number(b.dayGain) - Number(a.dayGain);
      if (dayGainSort === -1) return Number(a.dayGain) - Number(b.dayGain);
    }

    return a.minigameId - b.minigameId;
  });
  return (
    <table className="w-full table-auto text-left text-xl">
      <thead className="bg-gray-300 font-bold dark:bg-zinc-900">
        <tr>
          <th className="px-8 py-4">Minigame</th>
          <SortableTableHeader
            title="Rank"
            sortDigit={rankSort}
            setSortDigit={setRankSort}
          />
          <SortableTableHeader
            title="Score"
            sortDigit={scoreSort}
            setSortDigit={setScoreSort}
          />
          <SortableTableHeader
            title="Day Gain"
            sortDigit={dayGainSort}
            setSortDigit={setDayGainSort}
            rightAlign
          />
          <GainsHeaderDropdown
            gainsPeriod={gainsPeriod}
            options={["week", "month", "year"]}
            setGainsPeriod={setGainsPeriod}
          />
        </tr>
      </thead>
      <tbody>
        {sortedMinigames.map((minigame: Minigame, i: number) => (
          <tr
            key={minigame.minigameId}
            className={`${
              i % 2 === 0
                ? "bg-background-light dark:bg-background-dark"
                : "bg-gray-100 dark:bg-zinc-800"
            }`}
          >
            <td className="flex items-center px-8 py-4">
              {minigameNameArray[minigame.minigameId - TotalSkillsRs3]}
            </td>
            {formatMinigameNumber(minigame.rank)}
            {formatMinigameNumber(minigame.score)}
            {gainCellTemplate(Number(minigame.dayGain))}
            {gainCellTemplate(gainsPeriodProperty(minigame), true)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const formatMinigameNumber = (num: number): any =>
  isNaN(num) || num <= 0 ? (
    <td className="pr-8 brightness-50">{"-"}</td>
  ) : (
    <td className="pr-8">{num.toLocaleString()}</td>
  );

const gainCellTemplate = (minigameGain: number, lastColumn?: boolean) => {
  if (isNaN(minigameGain) || minigameGain < 0)
    return <td className="pr-8 text-right brightness-50">{"-"}</td>;
  return (
    <td
      className={`${lastColumn ? "px-8" : "pl-8"} text-right ${
        minigameGain > 0 ? "text-gainz-500" : ""
      }`}
    >
      {minigameGain > 0 && "+"}
      {minigameGain.toLocaleString()}
    </td>
  );
};

type SortableTableHeaderProps = {
  title: string;
  sortDigit?: SortDigit;
  setSortDigit?: (sortDigit: SortDigit) => void;
  rightAlign?: boolean;
};

const SortableTableHeader = ({
  title,
  sortDigit,
  setSortDigit,
  rightAlign,
}: SortableTableHeaderProps) => (
  <th
    className="cursor-pointer px-2 hover:bg-gray-200 dark:hover:bg-zinc-800"
    onClick={() =>
      sortDigit !== undefined && setSortDigit
        ? setSortDigit(sortDigit > 0 ? -1 : sortDigit < 0 ? 0 : 1)
        : null
    }
  >
    <div
      className={`flex ${rightAlign ? "flex-row-reverse" : "justify-start"}`}
    >
      {title}
      {sortDigit === 1 ? (
        <ChevronUpIcon className="mx-1 h-6 w-6" />
      ) : sortDigit === -1 ? (
        <ChevronDownIcon className="mx-1 h-6 w-6" />
      ) : (
        <div className="ml-1 h-6 w-6" />
      )}
    </div>
  </th>
);

export default MinigamesTable;
