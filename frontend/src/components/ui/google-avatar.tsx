'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface GoogleAvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
}

export function GoogleAvatar({ src, alt, fallback, className }: GoogleAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  // Se não há src ou houve erro, mostra fallback
  const shouldShowFallback = !src || imageError || !imageLoaded;

  return (
    <Avatar className={className}>
      {src && !imageError && (
        <AvatarImage
          src={src}
          alt={alt || 'Avatar'}
          onError={handleImageError}
          onLoad={handleImageLoad}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
      )}
      <AvatarFallback>
        {fallback || '?'}
      </AvatarFallback>
    </Avatar>
  );
}