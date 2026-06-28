import { Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <Loader2 size={40} className="animate-spin text-blue-600" />

      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}

export default Loading;
