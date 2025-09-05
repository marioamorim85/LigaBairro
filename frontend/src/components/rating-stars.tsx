'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating?: number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function RatingStars({ 
  rating = 0, 
  readonly = false, 
  size = 'md', 
  onRatingChange,
  className 
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverRating || rating) >= star;
        
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "transition-colors",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200",
                !readonly && "hover:fill-yellow-300 hover:text-yellow-300"
              )}
            />
          </button>
        );
      })}
      
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showCount?: boolean;
}

export function RatingDisplay({ 
  rating, 
  reviewCount, 
  size = 'md', 
  className,
  showCount = true 
}: RatingDisplayProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <RatingStars rating={rating} readonly size={size} />
      {showCount && reviewCount !== undefined && (
        <span className="text-sm text-gray-500">
          ({reviewCount} {reviewCount === 1 ? 'avaliação' : 'avaliações'})
        </span>
      )}
    </div>
  );
}