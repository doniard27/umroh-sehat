'use client';

import { useState } from 'react';
import { X, Images } from 'lucide-react';
import Link from 'next/link';

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  showAllLink?: boolean;
  hideHeader?: boolean;
}

export default function Gallery({ images, showAllLink = false, hideHeader = false }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section id="galeri" className={`py-20 ${hideHeader ? '' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {!hideHeader && (
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">Galeri</h2>
            <div className="w-24 h-1 bg-[#0B6E4F] mx-auto rounded-full"></div>
          </div>
        )}

        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 max-w-7xl mx-auto masonry-grid">
          {images.map((image, index) => {
            const defaultImg = `/images/gallery-${(index % 4) + 1}.jpg`;
            return (
              <div 
                key={image.id} 
                className="break-inside-avoid cursor-pointer overflow-hidden rounded-xl group masonry-grid-item relative"
                onClick={() => setSelectedImage(image)}
              >
                <div className="bg-gray-100 w-full relative overflow-hidden">
                  <img 
                    src={image.imageUrl || defaultImg} 
                    alt={image.caption || "Galeri Umroh Sehat"} 
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = defaultImg;
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  {image.caption && <p className="text-white text-sm font-medium">{image.caption}</p>}
                </div>
              </div>
            );
          })}
        </div>

        {showAllLink && (
          <div className="text-center mt-12">
            <Link
              href="/galeri"
              className="inline-flex items-center gap-2 bg-[#0B6E4F] hover:bg-green-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-colors"
            >
              <Images className="w-5 h-5" />
              Lihat Semua Foto Galeri
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img 
              src={selectedImage.imageUrl || '/images/gallery-1.jpg'} 
              alt={selectedImage.caption || "Galeri Image"} 
              className="max-w-full max-h-[80vh] object-contain rounded"
              onError={(e) => {
                e.currentTarget.src = '/images/gallery-1.jpg';
              }}
            />
            {selectedImage.caption && (
              <p className="text-white text-center mt-4 text-lg">{selectedImage.caption}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
