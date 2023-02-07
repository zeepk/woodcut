import React from "react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import LoadingSpinner from "./LoadingSpinner";
import { GlobeAltIcon } from "@heroicons/react/24/solid";
import { verificationWorlds } from "../utils/constants";
import { trpc } from "../utils/trpc";

type Props = {
  handleSuccess: () => void;
};

const LinkAccountModalContent = ({ handleSuccess }: Props) => {
  // random number in verificationWorlds array of numbers
  const getRandomWorld = () =>
    verificationWorlds[Math.floor(Math.random() * verificationWorlds.length)];
  const [successCount, setSuccessCount] = useState(0);
  const [showWarning, setShowWarning] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [world, setWorld] = useState(getRandomWorld());
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const linkingInstructions = `Make sure your online status is set to
                              "On" by adjusting the diamond icon at the top of
                                  your chat box.Hop to the world shown below and
                              click the
                              "Check" button.Repeat until account is verified.`;

  const { isFetching } = trpc.auth.checkVerifiedWorld.useQuery(
    { username, world },
    {
      enabled,
      onSuccess: (data) => {
        setEnabled(false);
        setError("");
        if (Number(data?.verification) >= 3) {
          handleSuccess();
          setIsOpen(false);
          return;
        }
        setWorld(getRandomWorld());
        setShowWarning(false);
        setSuccessCount(data?.verification ?? 0);
      },
      onError: (error) => {
        setEnabled(false);
        if (error.data?.code) {
          setError(error.message);
        }
      },
    }
  );

  const handleCheck = () => {
    if (username.length > 14) {
      setError("Username must be less than 14 characters");
      return;
    }
    setEnabled(true);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="rounded bg-forest-500 py-2 px-4 font-bold text-white hover:brightness-110">
          Link Account
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="absolute top-0 left-0 right-0 mx-auto my-4 flex flex w-9/12 max-w-[90vw] flex-col items-center rounded-2xl border-8 border border-zinc-300 bg-background-light p-8 dark:border-zinc-500 dark:bg-background-dark md:mt-40">
          <h1 className="my-2 text-center text-4xl text-text-dark">
            Account Linking
          </h1>
          <div className="flex flex-row py-8">
            <div className="flex w-1/2 flex-col items-start">
              {error && (
                <div className="border-6 my-2 flex h-4 flex-col items-center justify-center rounded-2xl border border-red-500 bg-red-200 p-4">
                  <h1 className="text-large my-16 font-semibold">{error}</h1>
                </div>
              )}
              {!error && showWarning && (
                <div className="border-6 my-2 flex h-4 flex-col items-center justify-center rounded-2xl border border-yellow-500 bg-yellow-200 p-4">
                  <h1 className="text-large my-16 font-semibold">{`Currently only works if you're in a clan`}</h1>
                </div>
              )}
              <p className="text-left text-text-light dark:text-text-dark">
                {linkingInstructions}
              </p>
            </div>
            <div className="flex w-1/2 flex-col items-end justify-center">
              <input
                type="text"
                className="mt-8 block h-8 w-48 rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-right text-sm text-zinc-900 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-zinc-500 dark:focus:ring-zinc-500 md:text-xl"
                placeholder="Username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="mt-4 flex w-1/2 justify-around">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex h-8 w-8 flex-col items-center justify-center ${
                      successCount < i ? "bg-gray-300" : "bg-green-300"
                    } rounded font-bold`}
                  >
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="my-8 flex flex-row">
            <button
              disabled
              className="align-center mr-2 flex h-12 w-48 items-center justify-center rounded bg-zinc-300 font-semibold text-text-light"
            >
              <GlobeAltIcon className="mx-1 h-6 w-6" />
              {`Hop to world ${world}`}
            </button>
            <button
              onClick={handleCheck}
              disabled={isFetching}
              className="align-center ml-2 flex h-12 w-24 items-center justify-center rounded bg-green-300 font-semibold text-text-light hover:brightness-110"
            >
              {isFetching ? (
                <LoadingSpinner size="h-8 w-8" />
              ) : (
                <div>
                  <p className="">Check</p>
                </div>
              )}
            </button>
          </div>
          <div className="flex w-full flex-col items-start">
            <Dialog.Close asChild>
              <button
                className="IconButton rounded bg-red-500 py-2 px-4 font-semibold text-text-light hover:brightness-110"
                aria-label="Close"
              >
                Cancel
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LinkAccountModalContent;
