import React, { useEffect, useState } from "react";
import './galleryDisplay.css'
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";


export const Gallery = ({ mediaContent }) => {
    const [slideIndex, setSlideIndex] = useState(0);


    const nextSlide = () => {
        slideIndex >= mediaContent.gallery_data.length - 1
          ? setSlideIndex(0)
          : setSlideIndex(slideIndex + 1);
      };
    
      const prevSlide = () => {
        slideIndex === 0
          ? setSlideIndex(mediaContent.gallery_data.length - 1)
          : setSlideIndex(slideIndex - 1);
      };


    useEffect(() => {
        console.log(slideIndex);
      }, [slideIndex]);

    return (
        <div className="gallery-display">
            <img
                src={mediaContent.gallery_data[slideIndex].src}
                alt="Gallery Image"
            />
            {slideIndex !== 0 &&
                <button
                    className="slideButton prev"
                    onClick={prevSlide}
                >
                    <FaChevronLeft />
                </button>
            }
            {slideIndex !== mediaContent.gallery_data.length - 1 &&
                <button
                    className="slideButton next"
                    onClick={nextSlide}
                >
                    <FaChevronRight />
                </button>

            }


        </div>
    )
}