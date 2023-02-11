import type { Skill } from "../types/user-types";
import { trpc } from "../utils/trpc";
import { skillIcon, skillNameArray } from "../utils/constants";
import Avatar from "./Avatar";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/router";

type props = {
  username: string;
};

const PlayerSkillSummary = ({ username }: props) => {
  const router = useRouter();
  const { data, isFetching } = trpc.player.getPlayerStats.useQuery({
    username,
  });
  const skills =
    data?.skills
      .filter((s) => Number(s.dayGain) > 20000)
      .sort((a, b) => Number(b.dayGain) - Number(a.dayGain))
      .slice(0, 7) ?? [];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border-8 border-gray-300 bg-background-light py-4 drop-shadow-dark dark:border-gray-500 dark:bg-background-dark">
      {isFetching ? (
        <LoadingSpinner size="h-8 w-8" />
      ) : (
        <div className="flex h-full w-full flex-col">
          <div className="flex h-20 flex-row items-center justify-center">
            <Avatar username={username} width="w-16" />
            <h1
              className="cursor-pointer text-2xl font-semibold hover:underline"
              onClick={() =>
                router.push(`/rs3/${username.split(" ").join("+")}`)
              }
            >
              {username.split("+").join(" ")}
            </h1>
          </div>
          <div className="flex flex-col">
            {skills.length === 0 && (
              <h1 className="text-center text-2xl font-semibold">
                No gains today
              </h1>
            )}
            {skills.map((skill, i) => formatSkillRow(i, skill))}
          </div>
        </div>
      )}
    </div>
  );
};

const formatSkillRow = (i: number, skill: Skill) => {
  return (
    <div
      key={skill.skillId}
      className={`flex items-center justify-between ${
        i % 2 === 0
          ? "bg-background-light dark:bg-background-dark"
          : "bg-gray-200 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-center px-2 py-4 md:px-8">
        {iconTemplate(skill.skillId)}
        <div className="hidden md:block">{skillNameArray[skill.skillId]}</div>
      </div>
      <div className="pr-2 text-gainz-200 dark:text-gainz-500 md:pr-8">
        +{formatXp(Number(skill.dayGain))}
      </div>
    </div>
  );
};

const iconTemplate = (skillId: number) => (
  <img className="mr-2 w-6" src={skillIcon(skillId).src} alt="" />
);

const formatXp = (xp: number) => {
  if (isNaN(xp)) {
    return "0";
  }
  if (xp.toString().endsWith("00000000") && xp > 1000000000) {
    return (xp.toLocaleString().slice(0, -10) + "b").replace(",", ".");
  }

  if (xp.toString().endsWith("000000")) {
    return xp.toLocaleString().slice(0, -8) + "m";
  }

  return xp.toLocaleString();
};
export default PlayerSkillSummary;
