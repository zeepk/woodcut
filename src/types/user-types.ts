import { StaticImageData } from "next/image";

export type Player = {
  id: number;
  username: string;
  displayName?: string;
  gameVersion?: string;
  accountType?: string;
  created: Date;
  lastChecked: Date;
  recentStats: string;
  isTracking: boolean;
};

export type DataResponse = {
  success: boolean;
  message: string;
};

export type PlayerDataResponse = DataResponse & {
  player?: Player;
  skills: Skill[];
  minigames: Minigame[];
  activities: Activity[];
  created: boolean;
  milestoneProgress: Progress[];
  badgeIds: BadgeId[];
};

export type Skill = {
  skillId: number;
  xp: number | bigint;
  level: number;
  // levelGain: number;
  rank: number;
  dayGain?: number | bigint;
  yesterdayGain?: number | bigint;
  weekGain?: number | bigint;
  monthGain?: number | bigint;
  yearGain?: number | bigint;
  dxpGain?: number;
};

export type Minigame = {
  minigameId: number;
  score: number;
  rank: number;
  dayGain?: number;
  yesterdayGain?: number;
  weekGain?: number;
  monthGain?: number;
  yearGain?: number;
  dxpGain?: number;
};

export type Activity = {
  date?: string;
  playerId?: number;
  username?: string;
  occurred: string;
  text: string;
  details: string;
  imageUrl?: string;
  price?: number;
  importance?: number;
};

export type Progress = {
  name: string;
  current: number;
  required: number;
  remaining: number;
  percent: number;
  midRange?: number;
  badgeId: BadgeId;
};

export type TopPlayer = {
  id: number;
  username: string;
  displayName: string;
  startXp: number;
  endXp: number;
  gain: number;
};

export type TopRankedPlayerRaw = {
  name: string;
  score: string;
  rank: string;
};

export type TopRankedPlayer = {
  id?: number;
  username: string;
  displayName: string;
  xp: number;
  level?: number;
  rank: number;
};

export type BadgeId =
  | "max"
  | "maxTotal"
  | "120All"
  | "200mAll"
  | "questCape"
  | "runescore20k"
  | "runescore25k"
  | "runescore30k"
  | "runescoreMax";

export type Badge = {
  id: BadgeId;
  name: string;
  tooltip: string;
  icon: StaticImageData;
  color: string;
};
