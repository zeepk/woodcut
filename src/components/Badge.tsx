import type { Badge } from "../types/user-types";

type props = {
  badge: Badge;
};

const Badge = ({ badge }: props) => {
  return (
    <div
      className={`${badge.color} mx-2 mb-2 flex h-6 items-center rounded px-2 text-sm font-medium`}
      title={badge.tooltip}
    >
      <img src={badge.icon.src} alt={badge.name} className="mr-2 h-[80%]" />
      <p>{badge.name}</p>
    </div>
  );
};

export default Badge;
