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
};

export type Skill = {
  skillId: number;
  xp: number | bigint;
  level: number;
  // levelGain: number;
  rank: number;
  dayGain?: number | bigint;
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
};
