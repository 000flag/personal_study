import React from 'react';
import { Pagination } from 'react-bootstrap';

interface Props {
  pageNumber: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<Props> = ({ pageNumber, totalPages, onPageChange }) => {
  const items = [];
  for (let number = 0; number < totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === pageNumber}
        onClick={() => onPageChange(number)}
      >
        {number + 1}
      </Pagination.Item>
    );
  }
  return <Pagination>{items}</Pagination>;
};

export default PaginationComponent;