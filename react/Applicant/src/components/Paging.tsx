import React from 'react';
import { Pagination } from 'react-bootstrap';

interface PagingProps {
  /** 현재 페이지 (0-based index) */
  pageNumber: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지가 바뀔 때 호출 (0-based page index) */
  onPageChange: (page: number) => void;
}

const Paging: React.FC<PagingProps> = ({
  pageNumber,
  totalPages,
  onPageChange,
}) => {
  // 개별 페이지 번호 아이템 생성
  const items: React.ReactNode[] = [];
  for (let i = 0; i < totalPages; i++) {
    items.push(
      <Pagination.Item
        key={i}
        active={i === pageNumber}
        onClick={() => onPageChange(i)}
      >
        {i + 1}
      </Pagination.Item>
    );
  }

  return (
    <Pagination className="mb-0">
      <Pagination.Prev
        disabled={pageNumber === 0}
        onClick={() => onPageChange(pageNumber - 1)}
      />
      {items}
      <Pagination.Next
        disabled={pageNumber === totalPages - 1}
        onClick={() => onPageChange(pageNumber + 1)}
      />
    </Pagination>
  );
};

export default Paging;