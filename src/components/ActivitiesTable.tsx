import { useRouter } from "next/router";

import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

import { skillNameArray, skillIcon } from "../utils/constants";
import type { Activity } from "../types/user-types";
import type { StaticImageData } from "next/image";
import { DateTime } from "luxon";
import Avatar from "./Avatar";
import Coins from "../assets/images/coins.png";

type ActivitiesTableProps = {
  activities: Activity[];
};

const ActivitiesTable = ({ activities }: ActivitiesTableProps) => {
  const router = useRouter();

  const [scoreSort, setScoreSort] = useState(-1);
  const [playerFilterString, setPlayerFilterString] = useState<string>("");
  const [activityFilterString, setActivityFilterString] = useState<string>("");
  const [minPrice, setMinPrice] = useState("0");
  const minPriceNumber = Number(minPrice);

  const sortedActivities = activities
    .sort((a: Activity, b: Activity) => {
      if (!a.occurred || !b.occurred) return 0;
      if (scoreSort === 1)
        return new Date(a.occurred).getTime() - new Date(b.occurred).getTime();

      return new Date(b.occurred).getTime() - new Date(a.occurred).getTime();
    })
    .filter((activity: Activity) => {
      if (
        activityFilterString.length > 0 &&
        activity.text
          .toLowerCase()
          .indexOf(activityFilterString.toLowerCase()) === -1
      )
        return false;

      if (
        playerFilterString.length > 0 &&
        activity.username
          ?.split("+")
          .join(" ")
          .toLowerCase()
          .indexOf(playerFilterString.toLowerCase()) === -1
      )
        return false;

      if (
        !isNaN(minPriceNumber) &&
        minPriceNumber > 0 &&
        (!activity.price || activity.price < minPriceNumber)
      )
        return false;

      return true;
    });

  const activityPlayer = (username: string, displayName?: string) => {
    return (
      <td className={`table-cell pl-4 text-left`}>
        <div
          onClick={() => router?.push(`/rs3/${username}`)}
          className="mr-1 flex w-full cursor-pointer flex-row items-center justify-start py-1 hover:underline md:mr-4"
        >
          <Avatar username={username} width="w-12" />
          <div className="text-md md:text-md ml-1 truncate font-semibold">
            {displayName ?? username.split("+").join(" ")}
          </div>
        </div>
      </td>
    );
  };

  return (
    <table className="text-md table-fixed text-left md:w-full">
      <thead className="bg-gray-300 font-bold dark:bg-zinc-900">
        <tr>
          <FilterableTableHeader
            title="Player"
            setFilterString={setPlayerFilterString}
            placeholder="Search"
          />
          <FilterableTableHeader
            title="Activity"
            setFilterString={setActivityFilterString}
            placeholder="Search"
          />
          <FilterableTableHeader
            title="GP"
            setFilterString={setMinPrice}
            placeholder="Minimum GP Value"
          />
          <SortableTableHeader
            title="Occurred"
            sortDigit={scoreSort}
            setSortDigit={setScoreSort}
            rightAlign
          />
        </tr>
      </thead>
      <tbody>
        {sortedActivities.map((activity: Activity, i: number) => (
          <tr
            key={i}
            className={`${
              i % 2 === 0
                ? "bg-background-light dark:bg-background-dark"
                : "bg-gray-200 dark:bg-zinc-800"
            }`}
          >
            {activityPlayer(activity.username?.split(" ").join("+") ?? "")}
            {activityText(activity)}
            <td className={`pl-8 text-left md:table-cell`}>
              {formatPrice(activity)}
            </td>
            <td className={`px-8 text-right md:table-cell`}>
              {formatDate(activity.occurred)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const activityText = (activity: Activity) => {
  let isSkill = false;
  let iconUrl: string | undefined | StaticImageData = activity.imageUrl;

  if (activity.text.includes("xp in")) {
    const skillName = activity.text.split("xp in ")[1].toString();
    const skillIndex = skillNameArray.indexOf(skillName);
    iconUrl = skillIcon(skillIndex)?.src;
    isSkill = true;
  }
  if (activity.details.includes("I levelled my")) {
    const skillName = activity.details
      .split("I levelled my")[1]
      .split(" ")[1]
      .toString();
    const skillIndex = skillNameArray.indexOf(skillName);
    iconUrl = skillIcon(skillIndex)?.src;
    isSkill = true;
  }
  return (
    <td className={`table-cell text-left`}>
      <div className="mr-1 flex w-full flex-row items-center justify-start py-1">
        {iconUrl ? (
          <img
            className={`mr-2 ${
              isSkill ? "p-0 xl:p-2" : "brightness-125 hover:scale-150"
            } max-h-10 drop-shadow-dark transition-transform duration-75`}
            src={iconUrl}
            alt="activity icon"
          />
        ) : (
          <div className="" />
        )}
        <div className="text-md md:text-md truncate font-semibold capitalize">
          {activity.text}
        </div>
      </div>
    </td>
  );
};

const formatPrice = (activity: Activity) => {
  if (!activity.price) {
    return;
  }

  return (
    <div className="md:text-md flex items-center text-gainz-200 dark:text-gainz-500">
      <img className="mr-1 h-6" src={Coins.src} alt="gp" />
      {activity.price.toLocaleString()}
    </div>
  );
};

type FilterableTableHeaderProps = {
  title: string;
  setFilterString: (text: string) => void;
  placeholder?: string;
  hideOnMobile?: boolean;
};

const FilterableTableHeader = ({
  title,
  setFilterString,
  placeholder,
  hideOnMobile,
}: FilterableTableHeaderProps) => (
  <th
    className={`cursor-pointer px-2 py-2 hover:bg-gray-200 dark:hover:bg-zinc-800 ${
      hideOnMobile && "hidden md:table-cell"
    }`}
  >
    {title}
    <input
      type="text"
      className="text-md md:text-md mt-2 block h-8 rounded-lg border border-zinc-300 bg-zinc-50 p-2 text-zinc-900 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
      placeholder={placeholder ?? title}
      onChange={(e) => setFilterString(e.target.value)}
    />
  </th>
);

type SortableTableHeaderProps = {
  title: string;
  sortDigit?: number;
  setSortDigit?: (sortDigit: number) => void;
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
    className={`cursor-pointer px-8 py-0 hover:bg-gray-200 dark:hover:bg-zinc-800 ${
      hideOnMobile && "hidden md:table-cell"
    }`}
    onClick={() =>
      sortDigit !== undefined && setSortDigit
        ? setSortDigit(sortDigit * -1)
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

const formatDate = (date: string): string => {
  // date format: 21-Jan-2023 00:31
  let dt = DateTime.fromFormat(date, "dd-MMM-yyyy HH:mm", {
    zone: "utc",
  });

  // set to UTC
  dt = dt.setZone();
  return `${dt.toLocaleString(DateTime.DATE_SHORT)} ${dt.toLocaleString(
    DateTime.TIME_24_SIMPLE
  )}`;
};

export default ActivitiesTable;
