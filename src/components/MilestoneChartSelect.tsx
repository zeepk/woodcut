import { useState } from "react";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import type { Progress } from "../types/user-types";

type props = {
  options: Progress[];
};

const GainsHeaderDropdown = ({ options }: props) => {
  const [milestone, setMilestone] = useState<Progress | undefined>(options[0]);
  return (
    <div className="flex items-center justify-end py-2 pr-4">
      <Select.Root
        value={milestone?.name}
        onValueChange={(milestone) =>
          setMilestone(options.find((option) => option.name === milestone))
        }
      >
        <Select.Trigger
          className="inline-flex w-full items-center justify-end bg-transparent p-4 capitalize text-black dark:text-white"
          aria-label="gains period"
        >
          <Select.Value placeholder="Gains period" />
          <Select.Icon className="pl-2">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.ScrollUpButton>
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport>
              <Select.Group>
                {options.map((option) => (
                  <Select.Item
                    key={option.name}
                    className="relative flex w-full cursor-pointer items-center justify-between bg-zinc-900 p-2 capitalize text-white hover:bg-zinc-700 dark:text-white"
                    value={option.name}
                  >
                    <Select.ItemText>{option.name}</Select.ItemText>
                    <Select.ItemIndicator>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton>
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default GainsHeaderDropdown;
