'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openGallery = (index: number) => {
    setSelectedImage(index);
    setIsOpen(true);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className={cn('space-y-2', className)}>
        <div className={cn(
          'grid gap-2',
          images.length === 1 && 'grid-cols-1',
          images.length === 2 && 'grid-cols-2',
          images.length >= 3 && 'grid-cols-2'
        )}>
          {images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className={cn(
                'relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100',
                index === 0 && images.length >= 3 ? 'col-span-2 aspect-[2/1]' : 'aspect-square',
                index >= 2 && images.length > 3 && 'relative'
              )}
              onClick={() => openGallery(index)}
            >
              <img
                src={image}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Overlay for additional images */}
              {index === 2 && images.length > 3 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    +{images.length - 3} mais
                  </span>
                </div>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
            </div>
          ))}
        </div>
        
        {images.length > 1 && (
          <p className="text-sm text-gray-500 text-center">
            Clique numa imagem para ver a galeria completa
          </p>
        )}
      </div>

      {/* Full Gallery Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 bg-black">
          <div className="relative h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-10 text-white hover:bg-white/20"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-10 text-white hover:bg-white/20"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Main image */}
            <img
              src={images[selectedImage]}
              alt={`Imagem ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            )}

            {/* Thumbnail navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/50 p-2 rounded-lg max-w-full overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={cn(
                      'flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all',
                      index === selectedImage ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'
                    )}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}