const Image = ({ src, alt, width, height }) => {
  return <img src={src} alt={alt} className={`${width} ${height}`} />;
};

export default Image;
