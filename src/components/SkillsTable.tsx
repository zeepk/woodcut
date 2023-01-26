import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";
import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { skillNameArray, skillIcon } from "../utils/constants";
import GainsHeaderDropdown from "./GainsHeaderDropdown";
import type { Skill } from "../types/user-types";

type SortDigit = -1 | 0 | 1;
export type GainsPeriod = "day" | "week" | "month" | "year";

const SkillsTable = () => {
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

  const skills = data?.skills ?? [];
  const [xpSort, setXpSort] = useState<SortDigit>(0);
  const [rankSort, setRankSort] = useState<SortDigit>(0);
  const [levelSort, setLevelSort] = useState<SortDigit>(0);
  const [dayGainSort, setDayGainSort] = useState<SortDigit>(0);
  const [gainsPeriod, setGainsPeriod] = useState<GainsPeriod>("week");

  const gainsPeriodProperty = (skill: Skill) => {
    if (gainsPeriod === "day") return Number(skill.dayGain);
    if (gainsPeriod === "week") return Number(skill.weekGain);
    if (gainsPeriod === "month") return Number(skill.monthGain);
    if (gainsPeriod === "year") return Number(skill.yearGain);
    return 0;
  };

  const sortedSkills = skills.sort((a: Skill, b: Skill) => {
    if (xpSort === 1) return Number(b.xp) - Number(a.xp);
    if (xpSort === -1) return Number(a.xp) - Number(b.xp);

    if (rankSort === 1) return b.rank - a.rank;
    if (rankSort === -1) return a.rank - b.rank;

    if (levelSort === 1) return b.level - a.level;
    if (levelSort === -1) return a.level - b.level;

    if (a.dayGain && b.dayGain) {
      if (dayGainSort === 1) return Number(b.dayGain) - Number(a.dayGain);
      if (dayGainSort === -1) return Number(a.dayGain) - Number(b.dayGain);
    }

    return a.skillId - b.skillId;
  });
  return (
    <table className="table-fixed text-left text-xl md:w-full">
      <thead className="bg-gray-300 font-bold dark:bg-zinc-900">
        <tr>
          <th className="px-2 py-4 md:px-8">Skill</th>
          <SortableTableHeader
            title="Rank"
            sortDigit={rankSort}
            setSortDigit={setRankSort}
            hideOnMobile
          />
          <SortableTableHeader
            title="Level"
            sortDigit={levelSort}
            setSortDigit={setLevelSort}
          />
          <SortableTableHeader
            title="XP"
            sortDigit={xpSort}
            setSortDigit={setXpSort}
          />
          <SortableTableHeader
            title="Day Gain"
            sortDigit={dayGainSort}
            setSortDigit={setDayGainSort}
            rightAlign
            hideOnMobile
          />
          <GainsHeaderDropdown
            gainsPeriod={gainsPeriod}
            options={["day", "week", "month", "year"]}
            setGainsPeriod={setGainsPeriod}
          />
        </tr>
      </thead>
      <tbody>
        {sortedSkills.map((skill: Skill, i: number) => (
          <tr
            key={skill.skillId}
            className={`${
              i % 2 === 0
                ? "bg-background-light dark:bg-background-dark"
                : "bg-gray-200 dark:bg-zinc-800"
            }`}
          >
            <td className="flex items-center px-2 py-4 md:px-8">
              {iconTemplate(skill.skillId)}
              <div className="hidden md:block">
                {skillNameArray[skill.skillId]}
              </div>
            </td>
            <td className="hidden pr-8 md:table-cell">
              {skill.rank.toLocaleString()}
            </td>
            <td className="pr-2 md:pr-8">{skill.level}</td>
            <td className="pr-2 md:pr-8">{formatXp(Number(skill.xp))}</td>
            {gainCellTemplate(Number(skill.dayGain))}
            {gainCellTemplate(gainsPeriodProperty(skill), true)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const iconTemplate = (skillId: number) => (
  <img className="mr-2 w-6" src={skillIcon(skillId).src} alt="" />
);

const gainCellTemplate = (skillGain: number, lastColumn?: boolean) =>
  isNaN(skillGain) ? (
    <td className="pr-8 text-right brightness-50">{"-"}</td>
  ) : (
    <td
      className={`${
        lastColumn ? "px-8" : "hidden pl-8 md:table-cell"
      } text-right ${
        skillGain > 0 ? "text-gainz-200 dark:text-gainz-500" : ""
      }`}
    >
      {skillGain > 0 && "+"}
      {formatXp(skillGain)}
    </td>
  );

type SortableTableHeaderProps = {
  title: string;
  sortDigit?: SortDigit;
  setSortDigit?: (sortDigit: SortDigit) => void;
  rightAlign?: boolean;
  hideOnMobile?: boolean;
};

const SortableTableHeader = ({
  title,
  sortDigit,
  setSortDigit,
  rightAlign,
  hideOnMobile,
}: SortableTableHeaderProps) => (
  <th
    className={`cursor-pointer px-2 hover:bg-gray-200 dark:hover:bg-zinc-800 ${
      hideOnMobile && "hidden md:table-cell"
    }`}
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

const formatXp = (xp: number) => {
  if (isNaN(xp)) {
    return "0";
  }
  if (xp.toString().endsWith("00000000") && xp > 1000000000) {
    return (xp.toLocaleString().slice(0, -10) + "b").replace(",", ".");
  }

  if (xp.toString().endsWith("000000")) {
    return xp.toLocaleString().slice(0, -8) + "m";
  }

  return xp.toLocaleString();
};

export default SkillsTable;
