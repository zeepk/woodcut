import { useState } from "react";
import SkillsTable from "./SkillsTable";

const StatTable = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);

  return (
    <div className="flex w-full flex-col">
      <SkillsTable />
    </div>
  );
};

export default StatTable;
