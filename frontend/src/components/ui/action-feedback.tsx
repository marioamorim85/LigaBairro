'use client';

import { useEffect, useState } from 'react';
import { Heart, Sparkles, CheckCircle, Star, Zap, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingFeedback {
  id: string;
  x: number;
  y: number;
  type: 'heart' | 'star' | 'spark' | 'check' | 'zap' | 'coffee';
  color: string;
}

interface ActionFeedbackProps {
  children: React.ReactNode;
  feedbackType?: 'heart' | 'star' | 'spark' | 'check' | 'zap' | 'coffee';
  disabled?: boolean;
  className?: string;
}

const feedbackIcons = {
  heart: Heart,
  star: Star,
  spark: Sparkles,
  check: CheckCircle,
  zap: Zap,
  coffee: Coffee
};

const feedbackColors = {
  heart: 'text-pink-500',
  star: 'text-yellow-500',
  spark: 'text-purple-500',
  check: 'text-green-500',
  zap: 'text-blue-500',
  coffee: 'text-amber-500'
};

export function ActionFeedback({ 
  children, 
  feedbackType = 'heart', 
  disabled = false,
  className 
}: ActionFeedbackProps) {
  const [feedbacks, setFeedbacks] = useState<FloatingFeedback[]>([]);

  const triggerFeedback = (event: React.MouseEvent) => {
    if (disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newFeedback: FloatingFeedback = {
      id: Date.now().toString(),
      x,
      y,
      type: feedbackType,
      color: feedbackColors[feedbackType]
    };

    setFeedbacks(prev => [...prev, newFeedback]);

    // Remove feedback after animation
    setTimeout(() => {
      setFeedbacks(prev => prev.filter(f => f.id !== newFeedback.id));
    }, 1000);
  };

  return (
    <div 
      className={cn('relative inline-block', className)}
      onClick={triggerFeedback}
    >
      {children}
      
      {/* Floating feedback icons */}
      {feedbacks.map((feedback) => {
        const Icon = feedbackIcons[feedback.type];
        return (
          <div
            key={feedback.id}
            className={cn(
              'absolute pointer-events-none z-50',
              feedback.color,
              'animate-bounce-in'
            )}
            style={{
              left: feedback.x,
              top: feedback.y,
              transform: 'translate(-50%, -50%)',
              animation: 'floatUp 1s ease-out forwards'
            }}
          >
            <Icon className="w-6 h-6" />
          </div>
        );
      })}
    </div>
  );
}

// Quick feedback for common actions
export function LikeButton({ 
  liked = false, 
  onToggle, 
  count,
  className 
}: { 
  liked?: boolean; 
  onToggle?: () => void; 
  count?: number;
  className?: string;
}) {
  return (
    <ActionFeedback feedbackType="heart" className={className}>
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200',
          'hover:bg-pink-50 hover:scale-105 active:scale-95',
          liked ? 'text-pink-600 bg-pink-50' : 'text-gray-600 hover:text-pink-600'
        )}
      >
        <Heart className={cn('w-5 h-5', liked && 'fill-current animate-heartbeat')} />
        {count !== undefined && <span className="text-sm font-medium">{count}</span>}
      </button>
    </ActionFeedback>
  );
}

export function StarRating({ 
  rating = 0, 
  maxRating = 5, 
  onRate, 
  readonly = false,
  size = 'md'
}: {
  rating?: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => {
        const isActive = star <= (hoveredRating || rating);
        
        return (
          <ActionFeedback key={star} feedbackType="star" disabled={readonly}>
            <button
              className={cn(
                'transition-all duration-200 hover:scale-110 active:scale-95',
                readonly && 'cursor-default'
              )}
              onMouseEnter={() => !readonly && setHoveredRating(star)}
              onMouseLeave={() => !readonly && setHoveredRating(0)}
              onClick={() => !readonly && onRate?.(star)}
              disabled={readonly}
            >
              <Star 
                className={cn(
                  sizeClasses[size],
                  isActive ? 'text-yellow-500 fill-current' : 'text-gray-300',
                  !readonly && 'hover:text-yellow-400'
                )} 
              />
            </button>
          </ActionFeedback>
        );
      })}
    </div>
  );
}

// Progress celebration component
export function ProgressCelebration({ 
  progress, 
  milestones = [25, 50, 75, 100],
  onMilestone 
}: {
  progress: number;
  milestones?: number[];
  onMilestone?: (milestone: number) => void;
}) {
  const [celebratedMilestones, setCelebratedMilestones] = useState<number[]>([]);

  useEffect(() => {
    milestones.forEach(milestone => {
      if (progress >= milestone && !celebratedMilestones.includes(milestone)) {
        setCelebratedMilestones(prev => [...prev, milestone]);
        onMilestone?.(milestone);
      }
    });
  }, [progress, milestones, celebratedMilestones, onMilestone]);

  return (
    <div className="relative">
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={cn(
            'bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500',
            progress === 100 && 'animate-pulse'
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
      
      {/* Milestone celebrations */}
      {celebratedMilestones.map(milestone => (
        <div
          key={milestone}
          className="absolute top-0 pointer-events-none"
          style={{ left: `${milestone}%`, transform: 'translateX(-50%)' }}
        >
          <div className="animate-bounce-in">
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Hover delight component
export function HoverDelight({ 
  children, 
  delightType = 'glow',
  className 
}: {
  children: React.ReactNode;
  delightType?: 'glow' | 'lift' | 'wiggle' | 'pulse' | 'rainbow';
  className?: string;
}) {
  const delightClasses = {
    glow: 'hover:shadow-lg hover:shadow-blue-500/25 transition-shadow duration-300',
    lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300',
    wiggle: 'hover:animate-wiggle',
    pulse: 'hover:animate-pulse',
    rainbow: 'hover:btn-rainbow transition-all duration-500'
  };

  return (
    <div className={cn(delightClasses[delightType], className)}>
      {children}
    </div>
  );
}