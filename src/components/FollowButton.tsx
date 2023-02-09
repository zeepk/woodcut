import LoadingSpinner from "./LoadingSpinner";
import { trpc } from "../utils/trpc";
import { SignInButton } from "@clerk/clerk-react";

type props = {
  playerId: number;
};

const FollowButton = ({ playerId }: props) => {
  const { data, isFetching, refetch } = trpc.auth.getUserData.useQuery();
  const follow = trpc.auth.followPlayer.useMutation();
  const currentlyFollowing = data?.followingPlayerIds ?? [];

  const isLoading = isFetching || follow.isLoading;
  const isFollowing = currentlyFollowing.includes(playerId);
  const isLinked = data?.playerAccounts.map((p) => p.id).includes(playerId);

  const handleClick = async () => {
    if (isLinked || isLoading || (!isFetching && !data?.user)) {
      return;
    }

    await follow.mutateAsync({ id: playerId, unfollow: isFollowing });
    await refetch();
  };

  const getButtonText = () => {
    if (isLoading) {
      return <LoadingSpinner size="h-6 w-6" color="border-white-500" />;
    }
    if (isFollowing) {
      return "Unfollow";
    }
    if (isLinked) {
      return "Linked";
    }

    return "Follow";
  };

  const getButtonColors = () => {
    if (isFollowing) {
      return "bg-zinc-800";
    }
    if (isLinked) {
      return "bg-gray-700";
    }

    return "bg-blue-500";
  };

  return (
    <div>
      <button
        onClick={async () => await handleClick()}
        className={`${getButtonColors()} flex h-full w-16 items-center justify-center rounded py-2 font-bold text-white hover:brightness-110 md:w-24`}
      >
        {!isFetching && !data?.user ? (
          <SignInButton mode="modal">Follow</SignInButton>
        ) : (
          getButtonText()
        )}
      </button>
    </div>
  );
};

export default FollowButton;
