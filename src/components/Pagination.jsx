import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Functional pagination component — responsive with proper spacing.
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
      <span className="text-xs sm:text-sm text-text-muted order-2 sm:order-1">
        Page {currentPage} of {totalPages}
      </span>

      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-text-muted hover:bg-surface-alt hover:text-text-primary
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
              ${page === currentPage
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-text-muted hover:bg-surface-alt hover:text-text-primary"
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-text-muted hover:bg-surface-alt hover:text-text-primary
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
