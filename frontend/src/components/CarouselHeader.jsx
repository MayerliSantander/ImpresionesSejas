import React from 'react';
import { TbShoppingBag } from "react-icons/tb";
import GenericButton from './GenericButton';

export default function CarouselHeader ({ currentPage, totalPages, onCartClick, bagCount }) {
  return (
    <div className="page-header">
      <span className='h3'>{`${currentPage}/${totalPages}`}</span>
      <div style={{ position: 'relative' }}>
        <GenericButton
          variant="light"
          circle
          icon={<TbShoppingBag size={26} />}
          onClick={onCartClick}
        />
        {bagCount > 0 && (
          <span className="bag-count">{bagCount}</span>
        )}
      </div>
    </div>
  );
};
