import React from 'react';

export default function CarouselPage ({ title, content }) {
  return (
    <div className="carousel-content">
      {title && <h5 className="h2 mb-3">{title}</h5>}
      {content}
    </div>
  );
};
