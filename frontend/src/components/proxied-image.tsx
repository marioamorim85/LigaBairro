'use client';

import { useState, useEffect } from 'react';

interface ProxiedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProxiedImage({ src, alt, className }: ProxiedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(src, {
          method: 'GET',
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        
        setImageSrc(objectURL);
        setLoading(false);

        // Cleanup function to revoke object URL when component unmounts
        return () => {
          URL.revokeObjectURL(objectURL);
        };
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
        setLoading(false);
      }
    };

    if (src) {
      loadImage();
    }
  }, [src]);

  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Failed to load</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
    />
  );
}