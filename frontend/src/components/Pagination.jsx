import React from 'react';
import '../styles/_pagination.scss';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <nav className="d-flex justify-content-center">
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)}>
            <FiChevronLeft />
          </button>
        </li>
        <li className="page-item disabled">
          <span className="page-link">
            {page} / {totalPages}
          </span>
        </li>
        <li className={page === totalPages ? 'page-item disabled' : 'page-item'}>
          <button className="page-link" onClick={() => onPageChange(page + 1)}>
            <FiChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  );
}
