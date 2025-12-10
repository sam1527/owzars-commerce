"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const galleryImages = useMemo(
    () =>
      images?.length
        ? images
        : ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80&auto=format&fit=crop"],
    [images]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-xl">
        <img
          src={galleryImages[activeIndex]}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {galleryImages.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-xl border transition ${
                index === activeIndex
                  ? "border-white/80 ring-2 ring-white/60"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="h-20 w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
