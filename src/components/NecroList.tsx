import { useRouter } from "next/router";
import type { TopRankedPlayer } from "../types/user-types";
import { skillIcon, skillNameArray } from "../utils/constants";
import Avatar from "./Avatar";
import { trpc } from "../utils/trpc";
import LoadingSpinner from "./LoadingSpinner";

const formatPlayer = (
  player: TopRankedPlayer,
  i: number,
  skillId: number,
  router?: ReturnType<typeof useRouter>
) => {
  return (
    <div
      key={i}
      className={`${
        i % 2 === 0
          ? "bg-background-light dark:bg-background-dark"
          : "bg-gray-200 dark:bg-zinc-800"
      } flex w-full items-center justify-between p-3 text-gray-800 hover:brightness-110 dark:text-text-dark`}
    >
      <div className="flex w-6/12 flex-row items-center justify-start">
        <div className="flex flex-col items-center pr-2 text-sm">{i + 1}</div>
        <div
          onClick={() => router?.push(`/rs3/${player.username}`)}
          className="flex w-9/12 cursor-pointer flex-col items-center hover:underline xl:flex-row"
        >
          <Avatar username={player.username} width="max-w-12 max-h-12" />
          <p className="text-md ml-2 truncate font-semibold">
            {player.displayName}
          </p>
        </div>
      </div>
      <div className={`flex w-3/12 flex-row items-center justify-end`}>
        <div>
          <p className={`text-md truncate font-normal text-white`}>
            {player.xp.toLocaleString()} xp
          </p>
          {player.level && (
            <p className={`truncate text-sm font-normal text-white`}>
              Level {player.level}
            </p>
          )}
        </div>
        <img
          className={`mr-2 h-10 w-10 p-2`}
          src={skillIcon(skillId).src}
          alt="skill icon"
        />
      </div>
    </div>
  );
};

type TopDxpListProps = {
  skillId: number;
};

const NecroList = ({ skillId }: TopDxpListProps) => {
  const router = useRouter();
  const title = `Top ${skillNameArray[skillId]} Players`;

  const { isFetching, data } = trpc.player.getTopNecroPlayers.useQuery(
    undefined,
    {
      refetchOnMount: true,
    }
  );

  const players = data?.find((d) => d.skillId === skillId)?.players ?? [];

  return (
    <div className="flex h-full w-full flex-col rounded drop-shadow-dark">
      <p className="bg-gray-300 py-4 text-center text-lg font-bold text-gray-800 dark:bg-zinc-900 dark:text-text-dark">
        {title}
      </p>
      {!isFetching && players.length > 0 ? (
        <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll">
          {players.map((player: TopRankedPlayer, i: number) =>
            formatPlayer(player, i, skillId, router)
          )}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center overflow-x-hidden overflow-y-hidden">
          <LoadingSpinner size="h-24 w-24 my-[20vh] md:my-0" />
        </div>
      )}
    </div>
  );
};

export default NecroList;
