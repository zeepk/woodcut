import "chart.js/auto";
import type { Progress } from "../types/user-types";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.defaults.color = "#FFF";
ChartJS.register(ArcElement, Tooltip, Legend);

type props = {
  milestone: Progress;
};

const MilestoneChart = ({ milestone }: props) => {
  const commonOptions = {
    legend: {
      display: false,
      labels: {
        fontColor: "#FFF",
        fontSize: 18,
      },
    },
  };

  const data = milestone.midRange
    ? {
        ...milestone,
        data: {
          labels: ["Complete", "Started", "Incomplete"],
          options: commonOptions,
          color: "#FFF",
          datasets: [
            {
              color: "#FFF",
              label: "Quests",
              data: [
                milestone.current,
                milestone.midRange,
                milestone.remaining,
              ],
              backgroundColor: [
                "rgba(64, 168, 137)",
                "rgba(162, 171, 118)",
                "rgba(125, 79, 76)",
              ],
            },
          ],
        },
      }
    : {
        ...milestone,
        options: commonOptions,
        data: {
          labels: ["Current", "Remaining"],
          datasets: [
            {
              label: "Xp",
              data: [milestone.current, milestone.remaining],
              backgroundColor: ["rgba(64, 168, 137)", "rgba(125, 79, 76)"],
            },
          ],
        },
      };

  return (
    <div className="align-center flex flex-col items-center">
      <h3 className="text-2xl font-bold">{`${data.name}: ${data.percent.toFixed(
        2
      )}%`}</h3>
      <Doughnut data={data.data} />
    </div>
  );
};

export default MilestoneChart;
