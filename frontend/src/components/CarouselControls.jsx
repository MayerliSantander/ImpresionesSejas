import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function CarouselControls ({ direction, onClick }) {
  return (
    <div
      className={`carousel-controls ${direction}`}
      onClick={onClick}
      role="button"
      aria-label={`Go ${direction}`}
    >
      {direction === 'left' ? <FaChevronLeft /> : <FaChevronRight />}
    </div>
  );
};
