import FilterSelect, {
  ALL_OPTION,
} from "@/components/shared/filters/FilterSelect";

import type { PublicFeatureApplication } from "../utils/public-endpoints";

interface ApplicationSelectProps {
  /** From getPublicFeatureApplications(...) — see application.config.ts. */
  applications: PublicFeatureApplication[];
  /** An application id, or ALL_OPTION. */
  value: string;
  onValueChange: (value: string) => void;
}

/**
 * The one application dropdown used by every cross-app page. Apps whose
 * public endpoint isn't live yet are listed but can't be picked.
 */
function ApplicationSelect({
  applications,
  value,
  onValueChange,
}: ApplicationSelectProps) {
  return (
    <FilterSelect
      label="Filter by application"
      value={value}
      onValueChange={onValueChange}
      className="w-[200px]"
      options={[
        { value: ALL_OPTION, label: "All Applications" },
        ...applications.map((app) => ({
          value: app.id,
          label: `${app.emoji} ${app.name}`,
          disabled: app.status !== "available",
          hint: app.status !== "available" ? "Coming soon" : undefined,
        })),
      ]}
    />
  );
}

export default ApplicationSelect;
