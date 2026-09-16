import { TriangleAlert, RefreshCcw, Home } from "lucide-react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";

import { PATHS } from "@/app/routes/paths";

/**
 * Used as the `errorElement` for every route. Without this, an
 * unhandled error anywhere in a page (e.g. the "categories.slice is not
 * a function" crash) takes down the whole app with the browser's raw
 * error overlay. This catches it and shows something a user can act on.
 */
function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  const message = isRouteErrorResponse(error)
    ? error.statusText || error.data
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center">
      <div className="rounded-full bg-red-100 p-5">
        <TriangleAlert size={48} className="text-red-600" />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-900">
          Something went wrong
        </h1>

        <p className="max-w-md text-sm text-slate-500">{String(message)}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="
            inline-flex
            items-center
            gap-2
            rounded-md
            border
            border-slate-200
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-slate-700
            shadow-sm
            transition-colors
            hover:bg-slate-100
          "
        >
          <RefreshCcw size={16} />
          Coba lagi
        </button>

        <button
          onClick={() => navigate(PATHS.COMMANDCENTRE)}
          className="
            inline-flex
            items-center
            gap-2
            rounded-md
            bg-blue-600
            px-4
            py-2
            text-sm
            font-medium
            text-white
            shadow-sm
            transition-colors
            hover:bg-blue-700
          "
        >
          <Home size={16} />
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}

export default RouteErrorBoundary;
