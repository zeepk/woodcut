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
