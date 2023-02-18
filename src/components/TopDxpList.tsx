import { useRouter } from "next/router";
import type { TopDxpPlayer } from "../types/user-types";
import { skillIcon } from "../utils/constants";
import Avatar from "./Avatar";

const formatPlayer = (
  player: TopDxpPlayer,
  i: number,
  router?: ReturnType<typeof useRouter>
) => {
  return (
    <div
      onClick={() => router?.push(`/rs3/${player.username}`)}
      key={i}
      className={`${
        i % 2 === 0
          ? "bg-background-light dark:bg-background-dark"
          : "bg-gray-200 dark:bg-zinc-800"
      } flex w-full cursor-pointer items-center justify-between p-3 text-gray-800 hover:brightness-110 dark:text-text-dark`}
    >
      <div className="flex w-6/12 flex-row items-center justify-start">
        <div className="flex flex-col items-center pr-8 text-2xl font-bold">
          #{i + 1}
        </div>
        <div className="flex w-6/12 flex-col items-center">
          <Avatar username={player.username} width="w-12" />
          <p className="truncate text-xl font-bold">{player.displayName}</p>
        </div>
      </div>
      <div className={`flex w-6/12 flex-row items-center justify-end`}>
        <div>
          <p className={`truncate text-xl font-bold text-gainz-500`}>
            +{player.gain.toLocaleString()} xp
          </p>
        </div>
        <img
          className={`mr-2 h-10 w-10 p-2`}
          src={skillIcon(0).src}
          alt="skill icon"
        />
      </div>
    </div>
  );
};

type TopDxpListProps = {
  players: TopDxpPlayer[];
};

const TopDxpList = ({ players }: TopDxpListProps) => {
  const router = useRouter();
  return (
    <div className="flex h-full w-full flex-col rounded drop-shadow-dark">
      <p className="bg-gray-300 py-4 text-center text-xl font-bold text-gray-800 dark:bg-zinc-900 dark:text-text-dark">
        Top Dxp Players
      </p>
      {players.length > 0 ? (
        <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-scroll">
          {players.map((player: TopDxpPlayer, i: number) =>
            formatPlayer(player, i, router)
          )}
        </div>
      ) : (
        <p className="bg-gray-400 py-4 text-center text-lg font-bold dark:bg-zinc-800">
          {`Nobody yet!`}
        </p>
      )}
    </div>
  );
};

export default TopDxpList;
