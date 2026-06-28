import { TriangleAlert } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
}

function ErrorState({
  title = "Something Went Wrong",
  description = "An unexpected error occurred.",
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <div className="rounded-full bg-red-100 p-5">
        <TriangleAlert size={48} className="text-red-600" />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-red-600">{title}</h3>

      <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export default ErrorState;
