'use client';

import { RatingStars } from '@/components/rating-stars';
import { GoogleAvatar } from '@/components/ui/google-avatar';
import { formatDatePT } from '@/lib/utils';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  reviewee: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

interface PublicReviewsProps {
  reviews: Review[];
  requesterId: string;
  helperId?: string;
}

export function PublicReviews({ reviews, requesterId, helperId }: PublicReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }


  // Separar as reviews
  const requesterReview = reviews.find(review => review.reviewer.id === requesterId);
  const helperReview = reviews.find(review => review.reviewer.id === helperId);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📝 Avaliações da Colaboração
      </h3>
      
      {/* Review do Solicitante sobre o Ajudante */}
      {requesterReview && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
              <GoogleAvatar 
                src={requesterReview.reviewer.avatarUrl} 
                alt={requesterReview.reviewer.name}
              />
            <div className="flex-1">
              <div className="space-y-2">
                <p className="font-medium text-blue-800">
                  {requesterReview.reviewer.name} avaliou {requesterReview.reviewee.name}
                </p>
                <div className="flex items-center">
                  <RatingStars rating={requesterReview.rating} readonly size="sm" />
                </div>
                <p className="text-xs text-blue-600">
                  {formatDatePT(requesterReview.createdAt, { short: true, includeTime: true })}
                </p>
              </div>
              
              {requesterReview.comment && (
                <div className="bg-white rounded p-3 border border-blue-100">
                  <p className="text-sm text-gray-700">"{requesterReview.comment}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review do Ajudante sobre o Solicitante */}
      {helperReview && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
              <GoogleAvatar 
                src={helperReview.reviewer.avatarUrl} 
                alt={helperReview.reviewer.name}
              />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-green-800">
                    {helperReview.reviewer.name} avaliou {helperReview.reviewee.name}
                  </p>
                  <p className="text-xs text-green-600">
                    {formatDatePT(helperReview.createdAt, { short: true, includeTime: true })}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <RatingStars rating={helperReview.rating} readonly size="sm" />
                </div>
              </div>
              
              {helperReview.comment && (
                <div className="bg-white rounded p-3 border border-green-100">
                  <p className="text-sm text-gray-700">"{helperReview.comment}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas se ambas as reviews estão presentes */}
      {requesterReview && helperReview && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="text-center">
              <p className="font-medium">Avaliação Média</p>
              <div className="flex items-center justify-center mt-1">
                <RatingStars rating={Math.round((requesterReview.rating + helperReview.rating) / 2)} readonly size="sm" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-medium">Colaboração</p>
              <p className="text-green-600 font-semibold mt-1">✓ Concluída</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}