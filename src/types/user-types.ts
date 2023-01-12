export type PlayerDataResponse = {
  username: string;
  success: boolean;
  message: string;
  skills: Skill[];
  minigames: Minigame[];
  activities: Activity[];
  created: boolean;
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
  date: Date;
  text: string;
  details: string;
  imageUrl?: string;
  price?: number;
  importance?: number;
};
