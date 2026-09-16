import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import type { Application } from "@/lib/constants";
import { badgeVariants, type BadgeColor } from "@/lib/badge-variants";

import { BUILDING_ART } from "../config/building-art.config";
import BuildingArt from "./BuildingArt";

interface BuildingProps {
  app: Application;
  color: BadgeColor;
  index: number;
  onClick: () => void;
}

/**
 * One application's card in the Ecosystem Map — icon/name/description
 * header (matching every other card style in the app) with a custom
 * illustrated building below. Clicking anywhere opens the app's info
 * panel.
 */
function Building({ app, color, index, onClick }: BuildingProps) {
  const art = BUILDING_ART[app.id];
  const Icon = art?.icon;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className="
        group
        flex
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        text-left
        shadow-sm
        transition-shadow
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${badgeVariants[color]}`}
          >
            {Icon ? <Icon className="h-5 w-5" /> : app.emoji}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">
              {app.name}
            </h3>
            <p className="truncate text-xs text-slate-500">
              {app.description}
            </p>
          </div>
        </div>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors group-hover:border-primary group-hover:text-primary">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>

      <div className="aspect-[11/8] w-full overflow-hidden border-t border-slate-100">
        <BuildingArt
          variant={art?.variant ?? "shop"}
          color={app.color}
          name={app.shortName}
        />
      </div>
    </motion.button>
  );
}

export default Building;
