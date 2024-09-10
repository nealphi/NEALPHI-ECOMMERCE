import React, { useState, useRef } from "react";

interface Props {
  src: string;
  zoomLevel?: number;
}

const ImageMagnifier = ({ src, zoomLevel = 1 }: Props) => {
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const imgRef = useRef<HTMLImageElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsMagnifying(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (imgRef.current && glassRef.current) {
      const { top, left, width, height } = imgRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setBackgroundPosition(`${x}% ${y}%`);

      // Position the magnifier glass
      glassRef.current.style.top = `${e.clientY - top - glassRef.current.clientHeight / 2}px`;
      glassRef.current.style.left = `${e.clientX - left - glassRef.current.clientWidth / 2}px`;
    }
  };

  const handleMouseLeave = () => {
    setIsMagnifying(false);
  };

  return (
    <div
      className="magnifier-container"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img ref={imgRef} src={src} alt="Zoomable" className="magnifier-image" />
      {isMagnifying && (
        <div
          ref={glassRef}
          className="magnifier-glass"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: backgroundPosition,
            display: 'block', // Show the magnifier glass when zooming
          }}
        ></div>
      )}
    </div>
  );
};

export default ImageMagnifier;
