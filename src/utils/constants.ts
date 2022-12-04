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

export type Skill = {
  skillId: number;
  xp: number;
  level: number;
  // levelGain: number;
  rank: number;
  // dayGain: number;
  // weekGain: number;
  // monthGain: number;
  // yearGain: number;
  // dxpGain?: number;
};

export type Minigame = {
  minigameId: number;
  score: number;
  rank: number;
  dayGain: number;
  weekGain: number;
  monthGain: number;
  yearGain: number;
  dxpGain?: number;
};

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
  "https://secure.runescape.com/m=itemdb_rs/1625481579641_obj_big.gif?id=";
export const RunescapeApiItemDetailsUrl =
  "https://secure.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item=";
export const RunescapeApiClanMemberListUrl =
  "http://services.runescape.com/m=clan-hiscores/members_lite.ws?clanName=";
export const QuestStatusCompleted = "COMPLETED";
export const QuestStatusStarted = "STARTED";
export const QuestStatusNotStarted = "NOT_STARTED";
export const TotalSkillsRs3 = 28 + 1;
export const TotalSkillsOsrs = 23 + 1;
export const MaxXp = 5600000000;
export const MaxTotal = 2898;

export const skillNameArray: string[] = [
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

export const skillIcon = (id: number) => imgArray[id];
