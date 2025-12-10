/* eslint-disable @next/next/no-img-element */
interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const galleryImages = images?.length ? images : ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80&auto=format&fit=crop"];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg">
        <img src={galleryImages[0]} alt={title} className="h-full w-full object-cover" />
      </div>
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {galleryImages.slice(1).map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
            >
              <img src={image} alt={`${title} thumbnail ${index + 1}`} className="h-24 w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
