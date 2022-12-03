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
