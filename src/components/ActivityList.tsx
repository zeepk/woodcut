import { Activity } from "../types/user-types";
import { DateTime } from "luxon";
import { skillNameArray, skillIcon } from "../utils/constants";
import { StaticImageData } from "next/image";

type props = {
  activities: Activity[];
};

const formatDate = (date: Date): string => {
  const dt = DateTime.fromJSDate(date);
  return `${dt.toLocaleString(DateTime.DATE_SHORT)} ${dt.toLocaleString(
    DateTime.TIME_24_SIMPLE
  )}`;
};

const formatActivity = (activity: Activity, i: number) => {
  let iconUrl: string | undefined | StaticImageData = activity.imageUrl;
  if (activity.text.includes("xp in")) {
    const skillName = activity.text.split("xp in ")[1].toString();
    const skillIndex = skillNameArray.indexOf(skillName);
    iconUrl = skillIcon(skillIndex)?.src;
  }

  return (
    <div
      className={`${
        i % 2 === 0
          ? "bg-background-light dark:bg-background-dark"
          : "bg-gray-100 dark:bg-zinc-800"
      } flex w-full items-center p-3 hover:brightness-95`}
    >
      {iconUrl && <img className="mr-5 h-10 w-10" src={iconUrl} />}
      <div className="">
        <p className="truncate text-xl font-bold" title={activity.text}>
          {activity.text}
        </p>
        <p className="text-md">{activity.details}</p>
        <p className="pt-5 text-xs brightness-75">
          {formatDate(activity.date)}
        </p>
      </div>
    </div>
  );
};

const ActivityList = ({ activities }: props) => {
  return (
    <div className="flex h-full w-full flex-col border border-4 border-gray-300 dark:border-zinc-900">
      <p className="bg-gray-300 py-4 text-center text-xl font-bold dark:bg-zinc-900">
        Activities
      </p>
      <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll">
        {activities.map((activity, i) => formatActivity(activity, i))}
      </div>
    </div>
  );
};

export default ActivityList;
