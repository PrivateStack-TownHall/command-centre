import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

function EmptyState({
  title = "No Data Found",
  description = "There is nothing to display right now.",
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <div className="rounded-full bg-slate-100 p-5">
        <Inbox size={48} className="text-slate-400" />
      </div>

      <h3 className="mt-4 text-lg font-semibold">{title}</h3>

      <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;
