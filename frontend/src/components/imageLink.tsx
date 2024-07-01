import React from 'react';

const ImageLink = ({ href, src, alt, width, height}) => {
  return (
    <a href={href}>
      <img
        src={src}
        alt={alt}
        className={`${width} ${height}`}
      />
    </a>
  );
};

export default ImageLink;
