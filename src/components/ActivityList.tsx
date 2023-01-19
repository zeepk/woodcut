import { useRouter } from "next/router";

import type { Activity } from "../types/user-types";
import { DateTime } from "luxon";
import { skillNameArray, skillIcon } from "../utils/constants";
import type { StaticImageData } from "next/image";
import Avatar from "./Avatar";

const formatDate = (date: string): string => {
  const dt = DateTime.fromJSDate(new Date(date));
  return `${dt.toLocaleString(DateTime.DATE_SHORT)} ${dt.toLocaleString(
    DateTime.TIME_24_SIMPLE
  )}`;
};

const formatActivity = (
  activity: Activity,
  i: number,
  includePlayer = false,
  router?: ReturnType<typeof useRouter>
) => {
  let iconUrl: string | undefined | StaticImageData = activity.imageUrl;
  if (activity.text.includes("xp in")) {
    const skillName = activity.text.split("xp in ")[1].toString();
    const skillIndex = skillNameArray.indexOf(skillName);
    iconUrl = skillIcon(skillIndex)?.src;
  }
  if (activity.details.includes("I levelled my")) {
    const skillName = activity.details
      .split("I levelled my")[1]
      .split(" ")[1]
      .toString();
    const skillIndex = skillNameArray.indexOf(skillName);
    iconUrl = skillIcon(skillIndex)?.src;
  }

  return (
    <div
      onClick={() => router?.push(`/rs3/${activity.username}`)}
      key={i}
      className={`${
        i % 2 === 0
          ? "bg-background-light dark:bg-background-dark"
          : "bg-gray-100 dark:bg-zinc-800"
      } flex w-full cursor-pointer items-center p-3 text-text-dark hover:brightness-110`}
    >
      {iconUrl ? (
        <img className="mr-5 h-10 w-10" src={iconUrl} alt="activity icon" />
      ) : (
        <div className="" />
      )}
      <div className="w-full">
        <p className="truncate text-xl font-bold" title={activity.text}>
          {activity.text}
        </p>
        <p className="text-md">{activity.details}</p>
        <p className="pt-5 text-xs brightness-75">
          {formatDate(activity.occurred)}
        </p>
      </div>
      {includePlayer && activity.username && (
        <div className="mr-4 flex w-64 flex-col items-center">
          <Avatar username={activity.username} width="w-20" />
          <p className="truncate text-xl font-bold">
            {activity.username.split("+").join(" ")}
          </p>
        </div>
      )}
    </div>
  );
};

type ActivityListProps = {
  activities: Activity[];
  username?: string;
};

const ActivityList = ({ activities, username }: ActivityListProps) => {
  const router = useRouter();
  return (
    <div className="flex h-full w-full flex-col rounded drop-shadow-dark">
      <p className="bg-gray-300 py-4 text-center text-xl font-bold dark:bg-zinc-900 dark:text-text-dark">
        Activities
      </p>
      {activities.length > 0 ? (
        <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll">
          {activities.map((activity: Activity, i: number) =>
            formatActivity(activity, i, !username, router)
          )}
        </div>
      ) : (
        <p className="bg-gray-400 py-4 text-center text-lg font-bold dark:bg-zinc-800">
          {`${username}'s RuneMetrics profile is set to private.`}
        </p>
      )}
    </div>
  );
};

export default ActivityList;
