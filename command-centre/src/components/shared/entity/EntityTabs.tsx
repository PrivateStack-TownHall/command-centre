import type { ReactNode } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface EntityTab {
  value: string;
  label: string;
  badge?: number;
}

interface EntityTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: EntityTab[];
}

function EntityTabs({ value, onValueChange, tabs }: EntityTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      <TabsList
        className="
          h-auto
          flex-wrap
          justify-start
          gap-2
          bg-transparent
          p-0
          mb-2
        "
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="
              h-auto
              min-w-[130px]
              flex-col
              items-start
              gap-1
              rounded-md
              border
              border-gray-200
              bg-white
              px-2
              py-1
              shadow-sm
              data-[state=active]:border-gray-200
              data-[state=active]:bg-slate-100
            "
          >
            <span className="text-xs uppercase tracking-wide text-slate-500">
              {tab.label}
            </span>

            <span className="text-lg font-bold text-slate-900">
              {tab.badge ?? 0}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export default EntityTabs;
