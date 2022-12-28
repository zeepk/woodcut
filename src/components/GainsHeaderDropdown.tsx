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

  const handleDropDown = () => {
    setOpen(!isOpen);
  };
  return (
    <div className="dropdown">
      <button
        className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
        onClick={handleDropDown}
      >
        Steps
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
        className={`z-10 w-44 divide-y divide-gray-100 rounded bg-white shadow ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <ul className=" z-10 w-44 divide-y divide-gray-100 rounded bg-white shadow ">
          <li>
            <a href="#" className="block py-2 px-4 hover:bg-gray-100">
              blablabla
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GainsHeaderDropdown;
