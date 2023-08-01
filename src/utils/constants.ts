import { imgArray } from "./images";

import Overall from "../assets/skillIcons/1_overall.png";
import MaxCape from "../assets/images/maxCape.png";
import RuneScore from "../assets/images/RuneScore.png";
import QuestIcon from "../assets/images/questIcon.png";

import type { Badge } from "../types/user-types";

// URLS

export const RunescapeApiBaseUrlRs3 =
  "https://secure.runescape.com/m=hiscore/index_lite.ws?player=";
export const RunescapeImApiBaseUrlRs3 =
  "https://secure.runescape.com/m=hiscore_ironman/index_lite.ws?player=";
export const RunescapeHcimApiBaseUrlRs3 =
  "https://secure.runescape.com/m=hiscore_hardcore_ironman/index_lite.ws?player=";

export const RunescapeApiBaseUrlOsrs =
  "https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=";
export const RunescapeImApiBaseUrlOsrs =
  "https://secure.runescape.com/m=hiscore_oldschool_ironman/index_lite.ws?player=";
export const RunescapeHcimApiBaseUrlOsrs =
  "https://secure.runescape.com/m=hiscore_oldschool_hardcore_ironman/index_lite.ws?player=";
export const RunescapeUimApiBaseUrlOsrs =
  "https://secure.runescape.com/m=hiscore_oldschool_ultimate/index_lite.ws?player=";

export const RunescapeApiClanIdCheck =
  "https://secure.runescape.com/m=clan-hiscores/members.ws?clanName=";
export const RunescapeApiPlayerDetailsUrlPre =
  "https://secure.runescape.com/m=website-data/playerDetails.ws?names=%5B%22";
export const RunescapeApiPlayerDetailsUrlPost =
  "%22%5D&callback=jQuery000000000000000_0000000000&_=0";
export const RunescapeApiPlayerMetricsUrlPre =
  "https://apps.runescape.com/runemetrics/profile/profile?user=";
export const RunescapeApiPlayerMetricsUrlPost = "&activities=20";
export const RunescapeApiPlayerCount =
  "http://www.runescape.com/player_count.js?varname=iPlayerCount&callback=jQuery000000000000000_0000000000&_=0";
export const RunescapeApiQuestsUrl =
  "https://apps.runescape.com/runemetrics/quests?user=";
export const ExternalApiItemPriceUrl =
  "https://api.weirdgloop.org/exchange/history/rs/latest?name=";
export const RunescapeApiItemDetailsUrl =
  "https://secure.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item=";
export const RunescapeApiClanMemberListUrl =
  "http://services.runescape.com/m=clan-hiscores/members_lite.ws?clanName=";
export const QuestStatusCompleted = "COMPLETED";
export const QuestStatusStarted = "STARTED";
export const QuestStatusNotStarted = "NOT_STARTED";

// Badges

const badgeRed = "bg-red-800 text-red-100";
const badgeGreen = "bg-green-800 text-green-100";

export const badges: Badge[] = [
  {
    id: "max",
    name: "Max",
    tooltip: "All skills level 99 or higher",
    icon: MaxCape,
    color: badgeRed,
  },
  {
    id: "maxTotal",
    name: "Max Total",
    tooltip: "Maximum total level achieved",
    icon: MaxCape,
    color: badgeRed,
  },
  {
    id: "120All",
    name: "120 All",
    tooltip: "All skills level 120",
    icon: Overall,
    color: badgeRed + " brightness-110",
  },
  {
    id: "200mAll",
    name: "200m All",
    tooltip: "Achieved 200m xp in all skills",
    icon: Overall,
    color: badgeRed + " brightness-110",
  },
  {
    id: "questCape",
    name: "Quest Cape",
    tooltip: "Completed all quests",
    icon: QuestIcon,
    color: "bg-cyan-700 text-cyan-100",
  },
  {
    id: "runescore20k",
    name: "20k RuneScore",
    tooltip: "Achieved 20k RuneScore",
    icon: RuneScore,
    color: badgeGreen,
  },
  {
    id: "runescore25k",
    name: "25k RuneScore",
    tooltip: "Achieved 25k RuneScore",
    icon: RuneScore,
    color: badgeGreen,
  },
  {
    id: "runescore30k",
    name: "30k RuneScore",
    tooltip: "Achieved 30k RuneScore",
    icon: RuneScore,
    color: badgeGreen + " brightness-110",
  },
  {
    id: "runescoreMax",
    name: "Max RuneScore",
    tooltip: "Achieved maximum RuneScore",
    icon: RuneScore,
    color: badgeGreen + " brightness-110",
  },
];

// Skills

export const necroReleaseDate = new Date("2023-08-07T12:00:00.000Z");
export const necroReleased = new Date() >= necroReleaseDate;

export const dxpStartDate = new Date("2023-07-28");
export const dxpEndDate = new Date("2023-08-07");
export const isCurrentlyDxp = () =>
  new Date() >= dxpStartDate && new Date() <= dxpEndDate;

const skills120 = [
  "Herblore",
  "Slayer",
  "Farming",
  "Dungeoneering",
  "Archaeology",
];
const eliteSkills = ["Invention"];
export const skillNameArray = [
  "Overall",
  "Attack",
  "Defence",
  "Strength",
  "Constitution",
  "Ranged",
  "Prayer",
  "Magic",
  "Cooking",
  "Woodcutting",
  "Fletching",
  "Fishing",
  "Firemaking",
  "Crafting",
  "Smithing",
  "Mining",
  "Herblore",
  "Agility",
  "Thieving",
  "Slayer",
  "Farming",
  "Runecrafting",
  "Hunter",
  "Construction",
  "Summoning",
  "Dungeoneering",
  "Divination",
  "Invention",
  "Archaeology",
];

if (necroReleased) {
  skillNameArray.push("Necromancy");
}

export const minigameNameArray = [
  "Bounty Hunter",
  "B.H. Rogues",
  "Dominion Tower",
  "The Crucible",
  "Castle Wars games",
  "B.A. Attackers",
  "B.A. Defenders",
  "B.A. Collectors",
  "B.A. Healers",
  "Duel Tournament",
  "Mobilising Armies",
  "Conquest",
  "Fist of Guthix",
  "GG: Athletics",
  "GG: Resource Race",
  "WE2: Armadyl Lifetime Contribution",
  "WE2: Bandos Lifetime Contribution",
  "WE2: Armadyl PvP kills",
  "WE2: Bandos PvP kills",
  "Heist Guard Level",
  "Heist Robber Level",
  "CFP: 5 game average",
  "AF15: Cow Tipping",
  "AF15: Rats killed after the miniquest",
  "RuneScore",
  "Clue Scrolls Easy",
  "Clue Scrolls Medium",
  "Clue Scrolls Hard",
  "Clue Scrolls Elite",
  "Clue Scrolls Master",
];

// includes "overall"
export const TotalSkillsRs3 = skillNameArray.length;
export const SkillsRs3 = TotalSkillsRs3 - 1;
export const SkillIds120 = [
  ...skills120.map((skill) => skillNameArray.indexOf(skill)),
];
export const SkillIdsElite = [
  ...eliteSkills.map((skill) => skillNameArray.indexOf(skill)),
];
export const Non99Skills = [...skills120, ...eliteSkills];
export const Non99SkillIds = [...SkillIds120, ...SkillIdsElite];

export const Xp99 = 13034431;
export const Xp120 = 104273167;
export const Xp200 = 200000000;
export const EliteXp99 = 36073511;
export const EliteXp120 = 80618654;
export const MaxXp = SkillsRs3 * Xp200;
export const RuneScoreId = 53;
export const MaxRuneScore = 30840;

export const All99Total = SkillsRs3 * 99;
export const XpAll99 =
  (SkillsRs3 - eliteSkills.length) * Xp99 + eliteSkills.length * EliteXp99;

export const MaxTotal =
  (SkillsRs3 - Non99Skills.length) * 99 +
  skills120.length * 120 +
  eliteSkills.length * 120;
export const xpMaxTotal =
  (SkillsRs3 - Non99Skills.length) * Xp99 +
  skills120.length * Xp120 +
  eliteSkills.length * EliteXp120;

export const xpAll120 =
  (SkillsRs3 - eliteSkills.length) * Xp120 + eliteSkills.length * EliteXp120;

export const skillIcon = (id: number) => imgArray[id];

// Activities

const xpToIgnore = [...Array(201).keys()]
  .filter((n: number) => n >= 10 && ![50, 100, 150, 200].includes(n))
  .map((n: number) => `${n}000000XP `);

const levelsToIgnore = [...Array(120).keys()]
  .filter((n: number) => ![99, 120].includes(n))
  .map((n: number) => `now level ${n}.`);

const dropsToIgnore = [
  "I found a page",
  "dragon helm",
  "effigy",
  "triskelion",
  "I found a book",
];
const miscToIgnore = [
  "treasure trail",
  "clan",
  "killed",
  "defeated",
  "quest points",
  "songs",
  "floor",
  "all skills over",
  "a collection of",
  "total levels",
].map((s: string) => ` ${s} `);
const miscToIgnoreCustomSpacing = [
  "Challenged by",
  "qualification",
  "mystery",
  "quest complete",
  "tetracompass",
  "Daemonheim",
];

export const textToIgnore = [
  ...dropsToIgnore,
  ...miscToIgnore,
  ...miscToIgnoreCustomSpacing,
  ...xpToIgnore,
];

export const detailsToIgnore = [...levelsToIgnore];

// Other

export const verificationWorlds = [
  7, 8, 11, 17, 19, 20, 29, 34, 38, 41, 43, 55, 61, 80, 81, 94, 108, 141,
];

export const TestData =
  "3,2898,5600000000 268,99,200000000 515,99,200000000 294,99,200000000 91,99,200000000 427,99,200000000 132,99,200000000 519,99,200000000 779,99,200000000 196,99,200000000 186,99,200000000 155,99,200000000 512,99,200000000 108,99,200000000 119,99,200000000 295,99,200000000 168,120,200000000 90,99,200000000 919,99,200000000 254,120,200000000 184,120,200000000 83,99,200000000 84,99,200000000 97,99,200000000 306,99,200000000 4091,120,200000000 89,99,200000000 4,120,200000000 3,120,200000000 -1,-1 3400,2501 145,28859770 10,1058 338,5018 498,9150 553,8853 326,9357 508,9980 809,1960 730,474 23197,1252 2908,8681 6228,610 3205,617 23442,871924 -1,-1 2182,57 1313,130 -1,-1 2,186 101380,20 -1,-1 -1,-1 70,30270 2124,1000 -1,-1 8164,1001 4097,879 7884,220";
