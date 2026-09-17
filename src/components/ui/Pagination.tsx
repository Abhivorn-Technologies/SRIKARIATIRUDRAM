'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
  className = '',
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array with optional ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#240006]/90 border border-gold/20 shadow-md ${className}`}>
      {/* Left: Info & Items per page dropdown */}
      <div className="flex items-center gap-4 text-xs text-ivory/80">
        <div>
          Showing <span className="font-bold text-gold">{startItem}</span> to{' '}
          <span className="font-bold text-gold">{endItem}</span> of{' '}
          <span className="font-bold text-gold">{totalItems}</span> entries
        </div>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 border-l border-gold/20 pl-4">
            <span className="text-ivory/60">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-[#1A0004] border border-gold/30 rounded px-2 py-1 text-gold font-bold text-xs focus:ring-1 focus:ring-gold outline-none cursor-pointer"
            >
              {itemsPerPageOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-[#1A0004] text-ivory">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Navigation Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          {/* First Page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title="First Page"
            className="p-1.5 rounded-lg border border-gold/20 text-ivory/80 hover:text-gold hover:border-gold/50 disabled:opacity-30 disabled:hover:text-ivory/80 disabled:hover:border-gold/20 transition-all"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title="Previous Page"
            className="p-1.5 rounded-lg border border-gold/20 text-ivory/80 hover:text-gold hover:border-gold/50 disabled:opacity-30 disabled:hover:text-ivory/80 disabled:hover:border-gold/20 transition-all flex items-center gap-1 text-xs px-2.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline">Prev</span>
          </button>

          {/* Page Number Buttons */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((p, idx) =>
              typeof p === 'number' ? (
                <button
                  key={idx}
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    currentPage === p
                      ? 'bg-gold text-maroon font-black shadow-md border border-gold'
                      : 'bg-[#1A0004] text-ivory/80 border border-gold/20 hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  {p}
                </button>
              ) : (
                <span key={idx} className="px-1 text-ivory/40 text-xs">
                  ...
                </span>
              )
            )}
          </div>

          {/* Next Page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Next Page"
            className="p-1.5 rounded-lg border border-gold/20 text-ivory/80 hover:text-gold hover:border-gold/50 disabled:opacity-30 disabled:hover:text-ivory/80 disabled:hover:border-gold/20 transition-all flex items-center gap-1 text-xs px-2.5"
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            title="Last Page"
            className="p-1.5 rounded-lg border border-gold/20 text-ivory/80 hover:text-gold hover:border-gold/50 disabled:opacity-30 disabled:hover:text-ivory/80 disabled:hover:border-gold/20 transition-all"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
