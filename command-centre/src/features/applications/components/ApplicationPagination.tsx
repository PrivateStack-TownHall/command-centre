interface ApplicationPaginationProps {
  page: number;
  totalPages: number;

  onPageChange: (page: number) => void;
}

function ApplicationPagination({
  page,
  totalPages,
  onPageChange,
}: ApplicationPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="my-6 flex items-center justify-between border-t border-slate-200 pt-4">
      <div className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="
            rounded-lg
            border
            border-slate-200
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            transition-colors
            hover:bg-slate-50
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          {pages.map((currentPage) => (
            <button
              key={currentPage}
              onClick={() => onPageChange(currentPage)}
              className={`
                h-10
                min-w-10
                rounded-lg
                border
                text-sm
                font-medium
                transition-colors
                ${
                  page === currentPage
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }
              `}
            >
              {currentPage}
            </button>
          ))}
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="
            rounded-lg
            border
            border-slate-200
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            transition-colors
            hover:bg-slate-50
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ApplicationPagination;
