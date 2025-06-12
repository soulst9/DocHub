import React from 'react';
import { Button } from '@/components/ui/button';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 주변의 페이지들만 표시
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      // 시작이나 끝에 가까우면 조정
      if (currentPage <= 3) {
        end = 5;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
      {/* 페이지 정보 */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">{startItem}-{endItem}</span>개 항목 (전체 <span className="font-medium">{totalItems}</span>개)
      </div>

      {/* 페이지네이션 버튼들 */}
      <div className="flex items-center gap-2">
        {/* 첫 페이지 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="hidden sm:flex"
        >
          ⏮️
        </Button>

        {/* 이전 페이지 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ⬅️ 이전
        </Button>

        {/* 페이지 번호들 */}
        <div className="flex items-center gap-1">
          {/* 첫 페이지가 보이지 않으면 ... 표시 */}
          {pageNumbers[0] > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                className="w-10 h-8"
              >
                1
              </Button>
              {pageNumbers[0] > 2 && (
                <span className="px-2 text-gray-400">...</span>
              )}
            </>
          )}

          {/* 페이지 번호 버튼들 */}
          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`w-10 h-8 ${
                currentPage === page 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : ''
              }`}
            >
              {page}
            </Button>
          ))}

          {/* 마지막 페이지가 보이지 않으면 ... 표시 */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-2 text-gray-400">...</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                className="w-10 h-8"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        {/* 다음 페이지 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음 ➡️
        </Button>

        {/* 마지막 페이지 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="hidden sm:flex"
        >
          ⏭️
        </Button>
      </div>

      {/* 페이지 크기 선택 */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">페이지당:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onPageChange(1, parseInt(e.target.value))}
          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={6}>6개</option>
          <option value={12}>12개</option>
          <option value={24}>24개</option>
          <option value={48}>48개</option>
        </select>
      </div>
    </div>
  );
} 