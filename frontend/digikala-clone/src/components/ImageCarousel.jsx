import { useState, useEffect } from 'react';
import img1 from '../assets/img-slider-1.jpg';
import img2 from '../assets/img-slider-2.jpg';
import img3 from '../assets/img-slider-3.jpg';
import img4 from '../assets/img-slider-4.webp';
import img5 from '../assets/img-slider-5.webp';

const images = [img1, img2, img3, img4, img5];

export function ImageCarousel() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [direction, setDirection] = useState("next");
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = (newIndex, dir) => {
    if (isAnimating) return; // Prevent multiple transitions at once
    
    const normalizedIndex = (newIndex + images.length) % images.length;
    
    setPrevIndex(index);
    setDirection(dir);
    setIndex(normalizedIndex);
    setIsAnimating(true);
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
      setPrevIndex(null);
    }, 500); // Match this with your CSS animation duration
  };

  const next = () => goTo(index + 1, "next");
  const prev = () => goTo(index - 1, "prev");

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        next();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [index, isAnimating]);

  return (
    <div className="relative w-full overflow-hidden h-96 group">
      {/* Image wrapper */}
      <div className="relative w-full h-full">
        {/* Previous image (slide out) - only render during animation */}
        {prevIndex !== null && isAnimating && (
          <img
            src={images[prevIndex]}
            alt={`Slide ${prevIndex + 1}`}
            className={`
              absolute w-full h-full object-cover
              ${direction === "next" ? "animate-slide-out-left" : "animate-slide-out-right"}
            `}
          />
        )}

        {/* Current image (slide in or static) */}
        <img
          src={images[index]}
          alt={`Slide ${index + 1}`}
          className={`
            absolute w-full h-full object-cover
            ${isAnimating 
              ? (direction === "next" ? "animate-slide-in-right" : "animate-slide-in-left")
              : ""
            }
          `}
        />
      </div>

      {/* Prev & Next Buttons */}
      <div className="absolute bottom-3 right-3 gap-2 hidden group-hover:flex">
        <button 
          onClick={prev} 
          disabled={isAnimating}
          className="bg-white text-black p-2 rounded-full w-8 h-8 flex justify-center items-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>
        <button 
          onClick={next} 
          disabled={isAnimating}
          className="bg-white text-black p-2 rounded-full w-8 h-8 flex justify-center items-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={`dot-${i}`}
            className={`w-2 h-1 rounded-full transition-all ${
              index === i ? "bg-white w-4" : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => !isAnimating && goTo(i, i > index ? "next" : "prev")}
            disabled={isAnimating}
          />
        ))}
      </div>
    </div>
  );
}