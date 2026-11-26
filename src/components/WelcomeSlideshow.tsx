"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  {
    src: "/images/imgshop.jpg",
    alt: "Krishna Building Material showroom exterior",
    caption: "Mahwa ka bharosemand building material store",
  },
  {
    src: "/images/img2.png",
    alt: "Krishna Building Material logo and branding",
    caption: "Quality materials, trusted guidance",
  },
];

export default function WelcomeSlideshow() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <div
      className="slideshow-root"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="slideshow-track">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`slideshow-slide ${i === current ? "active" : ""}`}
            aria-hidden={i !== current}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      {/* Overlay identity */}
      <div className="slideshow-overlay">
        <div className="slideshow-brand">
          <span className="slideshow-brand-symbol" aria-hidden="true" />
          <div>
            <span className="slideshow-brand-name">KRISHNA</span>
            <span className="slideshow-brand-sub">BUILDING MATERIAL</span>
          </div>
        </div>
        <p className="slideshow-tagline">
          Quality Materials · Trusted Guidance · Best Service
        </p>
      </div>

      {/* Controls — only show if more than 1 slide */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="slideshow-btn slideshow-btn-prev"
            aria-label="Previous slide"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={next}
            className="slideshow-btn slideshow-btn-next"
            aria-label="Next slide"
          >
            <FaChevronRight />
          </button>
          <div className="slideshow-dots" role="tablist">
            {slides.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}`}
                className={`slideshow-dot ${i === current ? "active" : ""}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </>
      )}

      {/* Caption */}
      <div className="slideshow-caption" aria-live="polite">
        {slides[current].caption}
      </div>
    </div>
  );
}
