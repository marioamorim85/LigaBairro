'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RatingStars } from '@/components/rating-stars';
import { useToast } from '@/components/ui/use-toast';
import { CREATE_REVIEW } from '@/lib/graphql/mutations';

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  reviewedUserId: string;
  reviewedUserName: string;
  onReviewCreated?: () => void;
}

export function ReviewDialog({
  isOpen,
  onClose,
  requestId,
  reviewedUserId,
  reviewedUserName,
  onReviewCreated
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [createReview] = useMutation(CREATE_REVIEW, {
    onCompleted: () => {
      toast({
        title: 'Sucesso',
        description: 'Avaliação enviada com sucesso!',
      });
      onReviewCreated?.();
      handleClose();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Erro ao enviar avaliação',
      });
    }
  });

  const handleClose = () => {
    setRating(0);
    setComment('');
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Por favor, seleciona uma classificação',
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Por favor, escreve um comentário',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createReview({
        variables: {
          input: {
            requestId,
            revieweeId: reviewedUserId,
            rating,
            comment: comment.trim()
          }
        }
      });
    } catch (error) {
      console.error('Error creating review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar {reviewedUserName}</DialogTitle>
          <DialogDescription>
            Como foi a tua experiência com este utilizador?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Classificação
            </label>
            <RatingStars
              rating={rating}
              onRatingChange={setRating}
              size="lg"
              className="justify-center py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Comentário
            </label>
            <Textarea
              placeholder="Descreve a tua experiência..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 caracteres
            </p>
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'A enviar...' : 'Enviar Avaliação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}