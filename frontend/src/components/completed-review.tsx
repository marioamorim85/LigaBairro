'use client';

import { RatingStars } from '@/components/rating-stars';

interface CompletedReviewProps {
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export function CompletedReview({
  userName,
  rating,
  comment,
  createdAt
}: CompletedReviewProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-green-800">
          ✓ Avaliação de {userName}
        </h4>
        <span className="text-xs text-green-600">
          {formatDate(createdAt)}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <RatingStars rating={rating} readonly size="sm" />
        <span className="text-sm text-gray-600">({rating}/5)</span>
      </div>
      
      {comment && (
        <div className="bg-white rounded p-3 border border-green-100">
          <p className="text-sm text-gray-700 italic">"{comment}"</p>
        </div>
      )}
    </div>
  );
}