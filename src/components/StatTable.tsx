import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { skillNameArray, skillIcon } from "../utils/constants";
import GainsHeaderDropdown from "./GainsHeaderDropdown";

type props = {
  skills: any[];
};

type SortDigit = -1 | 0 | 1;
export type GainsPeriod = "week" | "month" | "year" | "dxp";

const StatTable = ({ skills }: props) => {
  const [xpSort, setXpSort] = useState<SortDigit>(0);
  const [rankSort, setRankSort] = useState<SortDigit>(0);
  const [levelSort, setLevelSort] = useState<SortDigit>(0);
  const [dayGainSort, setDayGainSort] = useState<SortDigit>(0);
  const [gainsPeriod, setGainsPeriod] = useState<GainsPeriod>("week");

  const sortedSkills = skills.sort((a: any, b: any) => {
    if (xpSort === 1) return b.xp - a.xp;
    if (xpSort === -1) return a.xp - b.xp;

    if (rankSort === 1) return b.rank - a.rank;
    if (rankSort === -1) return a.rank - b.rank;

    if (levelSort === 1) return b.level - a.level;
    if (levelSort === -1) return a.level - b.level;

    if (dayGainSort === 1) return b.dayGain - a.dayGain;
    if (dayGainSort === -1) return a.dayGain - b.dayGain;

    return a.skillId - b.skillId;
  });
  return (
    <table className="w-full table-auto text-left text-xl">
      <thead className="font-bold">
        <tr>
          <th className="px-8 py-4">Skill</th>
          <SortableTableHeader
            title="Rank"
            sortDigit={rankSort}
            setSortDigit={setRankSort}
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
          />
          <GainsHeaderDropdown
            gainsPeriod={gainsPeriod}
            options={["week", "month", "year", "dxp"]}
            setGainsPeriod={setGainsPeriod}
          />
        </tr>
      </thead>
      <tbody>
        {sortedSkills.map((skill: any, i: number) => (
          <tr
            key={skill.skillId}
            className={`${
              i % 2 === 0
                ? "bg-background-light dark:bg-background-dark"
                : "bg-gray-100 dark:bg-zinc-800"
            } hover:brightness-95`}
          >
            <td className="flex items-center px-8 py-4">
              {iconTemplate(skill.skillId)}
              {skillNameArray[skill.skillId]}
            </td>
            <td className="px-8">{skill.rank.toLocaleString()}</td>
            <td className="px-8">{skill.level}</td>
            <td className="px-8">{formatXp(skill.xp)}</td>
            {gainCellTemplate(skill.dayGain)}
            {gainCellTemplate(skill.weekGain)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const iconTemplate = (skillId: number) => (
  <img className="mr-2 w-6" src={skillIcon(skillId).src} />
);

const gainCellTemplate = (skillGain: number) => (
  <td className={`px-8 ${skillGain > 0 ? "font-semibold text-gainz-500" : ""}`}>
    {skillGain > 0 && "+"}
    {formatXp(skillGain)}
  </td>
);

type SortableTableHeaderProps = {
  title: string;
  sortDigit?: SortDigit;
  setSortDigit?: (sortDigit: SortDigit) => void;
};

const SortableTableHeader = ({
  title,
  sortDigit,
  setSortDigit,
}: SortableTableHeaderProps) => (
  <th
    className="cursor-pointer px-8 hover:bg-gray-200 dark:hover:bg-zinc-800"
    onClick={() =>
      sortDigit && setSortDigit
        ? setSortDigit(sortDigit > 0 ? -1 : sortDigit < 0 ? 0 : 1)
        : null
    }
  >
    <div className="flex">
      {title}
      {sortDigit === 1 ? (
        <ChevronUpIcon className="ml-1 h-6 w-6" />
      ) : sortDigit === -1 ? (
        <ChevronDownIcon className="ml-1 h-6 w-6" />
      ) : (
        <div className="ml-1 h-6 w-6" />
      )}
    </div>
  </th>
);

const formatXp = (xp: number) => {
  if (xp.toString().endsWith("00000000") && xp > 1000000000) {
    return (xp.toLocaleString().slice(0, -10) + "b").replace(",", ".");
  }

  if (xp.toString().endsWith("000000")) {
    return xp.toLocaleString().slice(0, -8) + "m";
  }

  return xp.toLocaleString();
};

export default StatTable;
