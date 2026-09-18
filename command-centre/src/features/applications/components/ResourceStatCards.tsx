import { Lock, type LucideIcon } from "lucide-react";
import { Tabs as TabsPrimitive } from "radix-ui";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ResourceStatCard {
  key: string;
  label: string;
  /** From each resource's `icon` in application.config.ts. */
  icon: LucideIcon;
  /** Needs an admin login: the count is shown but the card can't be opened. */
  locked?: boolean;
  /** undefined → shown as "-". */
  count?: number;
  isCountLoading?: boolean;
}

interface ResourceStatCardsProps {
  cards: ResourceStatCard[];
}

const CARD_CLASS =
  "group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm";

function CardBody({ card }: { card: ResourceStatCard }) {
  const Icon = card.icon;

  return (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-data-[state=active]:bg-blue-600 group-data-[state=active]:text-white">
        <Icon aria-hidden className="h-5 w-5" />
      </div>
      <div>
        {card.isCountLoading ? (
          <Skeleton className="h-5 w-10 bg-slate-200" />
        ) : (
          <p className="text-xl font-bold leading-none text-slate-900">
            {card.count ?? "-"}
          </p>
        )}
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          {card.label}
          {card.locked && <Lock aria-hidden className="h-3 w-3" />}
        </p>
      </div>
    </>
  );
}

/**
 * The resource tabs of an application page, drawn as KPI cards next to the
 * page title. Must be rendered inside the page's TabsPrimitive.Root.
 * Keyboard: arrow keys move between cards, Enter/Space opens one.
 */
function ResourceStatCards({ cards }: ResourceStatCardsProps) {
  return (
    <TooltipProvider>
      <TabsPrimitive.List
        aria-label="Resources"
        className="flex flex-wrap gap-3"
      >
        {cards.map((card) =>
          card.locked ? (
            <Tooltip key={card.key}>
              <TooltipTrigger asChild>
                {/* Disabled buttons don't fire hover/focus events, so the
                    tooltip hangs off a focusable wrapper instead. */}
                <span tabIndex={0} className="rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-blue-500/30">
                  <TabsPrimitive.Trigger
                    value={card.key}
                    disabled
                    aria-label={`${card.label}, requires admin login`}
                    className={`${CARD_CLASS} cursor-not-allowed`}
                  >
                    <CardBody card={card} />
                  </TabsPrimitive.Trigger>
                </span>
              </TooltipTrigger>
              <TooltipContent
                sideOffset={6}
                className="bg-slate-900 text-white [&_svg]:bg-slate-900 [&_svg]:fill-slate-900"
              >
                Requires admin login
              </TooltipContent>
            </Tooltip>
          ) : (
            <TabsPrimitive.Trigger
              key={card.key}
              value={card.key}
              className={`${CARD_CLASS} cursor-pointer transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-blue-500/30 data-[state=active]:border-blue-500`}
            >
              <CardBody card={card} />
            </TabsPrimitive.Trigger>
          ),
        )}
      </TabsPrimitive.List>
    </TooltipProvider>
  );
}

export default ResourceStatCards;
