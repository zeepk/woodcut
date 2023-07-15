import type { Badge } from "../types/user-types";

type props = {
  badge: Badge;
};

const Badge = ({ badge }: props) => {
  return (
    <div
      className={`${badge.color} mx-2 mb-2 flex h-8 rounded-3xl border-2 px-4 py-1 align-middle text-white brightness-90`}
      title={badge.tooltip}
    >
      <img src={badge.icon.src} alt={badge.name} className="mr-2 h-full" />
      <p>{badge.name}</p>
    </div>
  );
};

export default Badge;
