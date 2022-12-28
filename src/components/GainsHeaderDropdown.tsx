import { useState } from "react";
import { GainsPeriod } from "./StatTable";

type props = {
  gainsPeriod: GainsPeriod;
  setGainsPeriod: (period: GainsPeriod) => void;
  options: GainsPeriod[];
};

const GainsHeaderDropdown = ({
  gainsPeriod,
  setGainsPeriod,
  options,
}: props) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <th className="flex items-center justify-center py-2">
      <div className="dropdown">
        <button
          className="inline-flex items-center bg-zinc-700 px-4 py-2.5 text-center text-sm font-medium capitalize text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-300"
          onClick={() => setOpen(!isOpen)}
        >
          {gainsPeriod}
          <svg
            className="ml-2 h-4 w-4"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        <div
          id="dropdown"
          className={`z-10 w-44 divide-y divide-gray-100 rounded bg-background-light shadow dark:bg-background-dark ${
            isOpen ? "absolute" : "hidden"
          }`}
        >
          <ul className="absolute z-10 w-44 divide-y divide-gray-100 rounded border border-solid border-background-light bg-background-light shadow dark:bg-background-dark ">
            {options.map((option, i) => (
              <li key={i}>
                <button
                  onClick={() => {
                    setGainsPeriod(option);
                    setOpen(false);
                  }}
                  className="block w-full py-2 px-4 capitalize hover:bg-zinc-600"
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </th>
  );
};

export default GainsHeaderDropdown;
