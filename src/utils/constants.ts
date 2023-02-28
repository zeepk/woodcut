import Overall from "../assets/skillIcons/1_overall.png";
import Attack from "../assets/skillIcons/2_attack.png";
import Defence from "../assets/skillIcons/3_defence.png";
import Strength from "../assets/skillIcons/4_strength.png";
import Constitution from "../assets/skillIcons/5_constitution.png";
import Ranged from "../assets/skillIcons/6_ranged.png";
import Prayer from "../assets/skillIcons/7_prayer.png";
import Magic from "../assets/skillIcons/8_magic.png";
import Cooking from "../assets/skillIcons/9_cooking.png";
import Woodcutting from "../assets/skillIcons/10_woodcutting.png";
import Fletching from "../assets/skillIcons/11_fletching.png";
import Fishing from "../assets/skillIcons/12_fishing.png";
import Firemaking from "../assets/skillIcons/13_firemaking.png";
import Crafting from "../assets/skillIcons/14_crafting.png";
import Smithing from "../assets/skillIcons/15_smithing.png";
import Mining from "../assets/skillIcons/16_mining.png";
import Herblore from "../assets/skillIcons/17_herblore.png";
import Agility from "../assets/skillIcons/18_agility.png";
import Thieving from "../assets/skillIcons/19_thieving.png";
import Slayer from "../assets/skillIcons/20_slayer.png";
import Farming from "../assets/skillIcons/21_farming.png";
import Runecrafting from "../assets/skillIcons/22_runecrafting.png";
import Hunter from "../assets/skillIcons/23_hunter.png";
import Construction from "../assets/skillIcons/24_construction.png";
import Summoning from "../assets/skillIcons/25_summoning.png";
import Dungeoneering from "../assets/skillIcons/26_dungeoneering.png";
import Divination from "../assets/skillIcons/27_divination.png";
import Invention from "../assets/skillIcons/28_invention.png";
import Archaeology from "../assets/skillIcons/29_archaeology.png";

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
export const RunescapeApiItemImageUrl =
  "https://secure.runescape.com/m=itemdb_rs/1677499269765_obj_big.gif?id=";
export const RunescapeApiItemDetailsUrl =
  "https://secure.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item=";
export const RunescapeApiClanMemberListUrl =
  "http://services.runescape.com/m=clan-hiscores/members_lite.ws?clanName=";
export const QuestStatusCompleted = "COMPLETED";
export const QuestStatusStarted = "STARTED";
export const QuestStatusNotStarted = "NOT_STARTED";

export const verificationWorlds = [
  7, 8, 11, 17, 19, 20, 29, 34, 38, 41, 43, 55, 61, 80, 81, 94, 108, 141,
];

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

const imgArray = [
  Overall,
  Attack,
  Defence,
  Strength,
  Constitution,
  Ranged,
  Prayer,
  Magic,
  Cooking,
  Woodcutting,
  Fletching,
  Fishing,
  Firemaking,
  Crafting,
  Smithing,
  Mining,
  Herblore,
  Agility,
  Thieving,
  Slayer,
  Farming,
  Runecrafting,
  Hunter,
  Construction,
  Summoning,
  Dungeoneering,
  Divination,
  Invention,
  Archaeology,
];

export const TotalSkillsRs3 = 28 + 1;
export const SkillsRs3 = 28;
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

export const dxpStartDate = new Date("2023-02-17");
export const dxpEndDate = new Date("2023-02-27");
export const isCurrentlyDxp = () =>
  new Date() >= dxpStartDate && new Date() <= dxpEndDate;

export const TestData =
  "3,2898,5600000000 268,99,200000000 515,99,200000000 294,99,200000000 91,99,200000000 427,99,200000000 132,99,200000000 519,99,200000000 779,99,200000000 196,99,200000000 186,99,200000000 155,99,200000000 512,99,200000000 108,99,200000000 119,99,200000000 295,99,200000000 168,120,200000000 90,99,200000000 919,99,200000000 254,120,200000000 184,120,200000000 83,99,200000000 84,99,200000000 97,99,200000000 306,99,200000000 4091,120,200000000 89,99,200000000 4,120,200000000 3,120,200000000 -1,-1 3400,2501 145,28859770 10,1058 338,5018 498,9150 553,8853 326,9357 508,9980 809,1960 730,474 23197,1252 2908,8681 6228,610 3205,617 23442,871924 -1,-1 2182,57 1313,130 -1,-1 2,186 101380,20 -1,-1 -1,-1 70,30270 2124,1000 -1,-1 8164,1001 4097,879 7884,220";
