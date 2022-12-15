export type Skill = {
  skillId: number;
  xp: number | bigint;
  level: number;
  // levelGain: number;
  rank: number;
  dayGain?: number | bigint;
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
