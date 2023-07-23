import type { PrismaClient } from "@prisma/client";
import {
  RunescapeApiPlayerMetricsUrlPre,
  RunescapeApiPlayerMetricsUrlPost,
  ExternalApiItemPriceUrl,
  RunescapeApiItemDetailsUrl,
  textToIgnore,
  detailsToIgnore,
} from "../../utils/constants";
import type { Activity } from "../../types/user-types";
const orderedDropPhrases = [
  "I found a pair of ",
  "I found some ",
  "I found an ",
  "I found a ",
  "I found ",
  "Found a ",
];

type ItemDetails = {
  price: number;
  itemId: string;
};

const getItemDetails = async (
  item: string
): Promise<ItemDetails | undefined> => {
  const data = await fetch(`${ExternalApiItemPriceUrl}${item}`)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      return null;
    });
  const itemDetails = Object.values(data)[0] as any;
  if (itemDetails?.price && itemDetails?.id) {
    return {
      price: itemDetails.price,
      itemId: itemDetails.id,
    };
  }

  return undefined;
};

const getItemImageUri = async (itemId: string): Promise<string | undefined> => {
  const data = await fetch(`${RunescapeApiItemDetailsUrl}${itemId}`)
    .then((res) => res.text())
    .then((res) => JSON.parse(res))
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (data && data.item && data.item.icon_large) {
    return data.item.icon_large;
  }

  return undefined;
};

export type RuneMetricsResponse = {
  activities: Activity[];
  name: string;
  questsStarted: number;
  questsCompleted: number;
  questsNotStarted: number;
};

export const officialRuneMetricsApiCall = async (
  username: string
): Promise<RuneMetricsResponse | null> => {
  const data = await fetch(
    `${RunescapeApiPlayerMetricsUrlPre}${username}${RunescapeApiPlayerMetricsUrlPost}`
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        return null;
      }

      const activities: Activity[] = res.activities.map((a: any) => ({
        date: a.date,
        occurred: a.date,
        text: a.text,
        details: a.details,
      }));

      return {
        activities,
        name: res.name,
        questsStarted: res.questsstarted,
        questsCompleted: res.questscomplete,
        questsNotStarted: res.questsnotstarted,
      };
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return data;
};

const getItemFromActivityText = (text: string): string | null => {
  let item = "";

  for (const phrase of orderedDropPhrases) {
    if (text.includes(phrase)) {
      if (text.split(phrase)[1]) {
        item = text.split(phrase)[1].replace(".", "");
        break;
      }
    }
  }

  if (item.includes("wristwraps")) {
    item = item.replace("wristwraps", "wrist wraps");
  }
  if (item.includes("Scriptures")) {
    item = item.replace("Scriptures", "Scripture");
  }
  if (item.includes("Erethdor's grimoire")) {
    item = "Erethdor's grimoire (token)";
  }

  return !!item ? item : null;
};

export const formatActivity = async (activity: Activity, imageUri?: string) => {
  const response: Activity = {
    ...activity,
  };

  if (!imageUri) {
    const item = getItemFromActivityText(activity.text);
    if (item) {
      response.text = "Item drop: " + item;
      const itemDetails = await getItemDetails(item);
      if (itemDetails) {
        response.price = itemDetails?.price;

        const itemImageUri = await getItemImageUri(itemDetails.itemId);
        response.imageUrl = itemImageUri;
      }
    }
  } else if (activity.imageUrl) {
    // we still need to grab the correct image URI (it changes each Monday)
    // by using a test item combined with the item ID stored in activity.imageUrl
    response.imageUrl = imageUri + activity.imageUrl;
  }

  if (activity.text.includes("Levelled up ")) {
    const level = activity.details.split("level ")[1].replace(".", "");
    const skill = activity.text.split("up ")[1].replace(".", "");
    response.text = `${skill} level ${level}`;
  }

  if (activity.text.includes("XP in ")) {
    const skill = activity.text.split("XP in ")[1].replace(".", "");
    let level = activity.text.split("XP in ")[0].replace(".", "");
    if (level.substring(level.length - 6) == "000000") {
      level = level.substring(0, level.length - 6) + "m";
    }
    response.text = `${level} xp in ${skill}`;
  }

  orderedDropPhrases.forEach((phrase) => {
    response.text = response.text.replace(phrase, "");
  });
  response.text = response.text.replace(".", "");

  if (activity.details.includes("experience points in the")) {
    response.details = "";
  }

  return response;
};

type getActivityProps = {
  ctx: { prisma: PrismaClient };
  playerIds?: number[];
  limit?: number;
};

export const getFormattedActivities = async ({
  ctx,
  playerIds,
  limit,
}: getActivityProps) => {
  const filter = playerIds
    ? {
        playerId: {
          in: playerIds,
        },
      }
    : {};

  const activities: Activity[] = await ctx.prisma.activity.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      AND: [
        filter,
        {
          OR: [
            {
              price: {
                equals: 0,
              },
            },
            {
              price: {
                gt: 1000000,
              },
            },
          ],
        },
        {
          NOT: {
            OR: [
              ...textToIgnore.map((activity) => ({
                text: {
                  contains: activity,
                },
              })),
              ...detailsToIgnore.map((activity) => ({
                details: {
                  contains: activity,
                },
              })),
            ],
          },
        },
      ],
    },
    take: limit ?? undefined,
  });

  // use test item to get correct image URI
  const testImageUriRaw = await getItemImageUri("379");
  const testImageUri = testImageUriRaw?.replace("379", "") ?? "";

  const formattedActivities = [];

  for (const activity of activities) {
    const formattedActivity = await formatActivity(activity, testImageUri);
    formattedActivities.push(formattedActivity);
  }

  return formattedActivities;
};
