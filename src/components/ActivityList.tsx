import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";
import type { Activity } from "../types/user-types";
import { DateTime } from "luxon";
import { skillNameArray, skillIcon } from "../utils/constants";
import type { StaticImageData } from "next/image";

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
      key={i}
      className={`${
        i % 2 === 0
          ? "bg-background-light dark:bg-background-dark"
          : "bg-gray-100 dark:bg-zinc-800"
      } flex w-full items-center p-3`}
    >
      <div className="w-full">
        <p className="truncate text-xl font-bold" title={activity.text}>
          {activity.text}
        </p>
        <p className="text-md">{activity.details}</p>
        <p className="pt-5 text-xs brightness-75">
          {formatDate(activity.date)}
        </p>
      </div>
      {iconUrl && (
        <img className="ml-5 h-10 w-10" src={iconUrl} alt="activity icon" />
      )}
    </div>
  );
};

const ActivityList = () => {
  const router = useRouter();
  const { username } = router.query;
  const isReady = router.isReady;
  const fetchName = typeof username === "string" ? username : "";

  const { data } = trpc.user.getUserStats.useQuery(
    {
      username: fetchName,
    },
    {
      enabled: isReady,
      retry: false,
      refetchOnMount: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  const activities =
    data?.activities.sort(
      (a: Activity, b: Activity) => b.date.getTime() - a.date.getTime()
    ) ?? [];
  return (
    <div className="flex h-full w-full flex-col rounded drop-shadow-dark">
      <p className="bg-gray-300 py-4 text-center text-xl font-bold dark:bg-zinc-900">
        Activities
      </p>
      <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll">
        {activities.map((activity: Activity, i: number) =>
          formatActivity(activity, i)
        )}
      </div>
    </div>
  );
};

export default ActivityList;
