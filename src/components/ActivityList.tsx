import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";
import type { Activity } from "../types/user-types";
import { DateTime } from "luxon";
import { skillNameArray, skillIcon } from "../utils/constants";
import type { StaticImageData } from "next/image";
import { useState, useEffect } from "react";

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
          {formatDate(activity.occurred)}
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
  const [canAddActivities, setCanAddActivities] = useState(true);
  const addActivities = trpc.player.addPlayerActivities.useMutation();

  const { data, isFetching } = trpc.player.getPlayerStats.useQuery(
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

  useEffect(() => {
    // TODO: figure out why I couldn't get useQuery's onSuccess to work
    if (data?.player?.id && data.activities && canAddActivities) {
      setCanAddActivities(false);
      addActivities.mutate({
        playerId: data.player.id,
        activities: data.activities,
      });
    }
  }, [data?.activities]);

  const activities =
    data?.activities.sort(
      (a: Activity, b: Activity) => b.occurred.getTime() - a.occurred.getTime()
    ) ?? [];
  return (
    <div className="flex h-full w-full flex-col rounded drop-shadow-dark">
      <p className="bg-gray-300 py-4 text-center text-xl font-bold dark:bg-zinc-900">
        Activities
      </p>
      {!isFetching && activities.length > 0 ? (
        <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll">
          {activities.map((activity: Activity, i: number) =>
            formatActivity(activity, i)
          )}
        </div>
      ) : (
        <p className="bg-gray-400 py-4 text-center text-lg font-bold dark:bg-zinc-800">
          {`${fetchName}'s RuneMetrics profile is set to private.`}
        </p>
      )}
    </div>
  );
};

export default ActivityList;
