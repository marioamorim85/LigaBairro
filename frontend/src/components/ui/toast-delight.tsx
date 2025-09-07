'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'celebration' | 'love';

interface ToastDelightProps {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    colors: 'from-emerald-500 to-green-600',
    bgColors: 'bg-emerald-50 border-emerald-200',
    textColors: 'text-emerald-800',
    emoji: '✅'
  },
  error: {
    icon: XCircle,
    colors: 'from-red-500 to-pink-600',
    bgColors: 'bg-red-50 border-red-200',
    textColors: 'text-red-800',
    emoji: '❌'
  },
  warning: {
    icon: AlertCircle,
    colors: 'from-amber-500 to-orange-600',
    bgColors: 'bg-amber-50 border-amber-200',
    textColors: 'text-amber-800',
    emoji: '⚠️'
  },
  info: {
    icon: Info,
    colors: 'from-blue-500 to-indigo-600',
    bgColors: 'bg-blue-50 border-blue-200',
    textColors: 'text-blue-800',
    emoji: 'ℹ️'
  },
  celebration: {
    icon: Sparkles,
    colors: 'from-purple-500 to-pink-600',
    bgColors: 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200',
    textColors: 'text-purple-800',
    emoji: '🎉'
  },
  love: {
    icon: Heart,
    colors: 'from-pink-500 to-rose-600',
    bgColors: 'bg-pink-50 border-pink-200',
    textColors: 'text-pink-800',
    emoji: '💖'
  }
};

export function ToastDelight({ id, type, title, description, duration = 5000, onClose }: ToastDelightProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        return Math.max(0, newProgress);
      });
    }, 100);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300 transform',
        config.bgColors,
        isVisible ? 'animate-bounce-in translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        type === 'celebration' && 'animate-tada'
      )}
    >
      {/* Progress bar */}
      <div 
        className={cn('absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-100', config.colors)}
        style={{ width: `${progress}%` }}
      />

      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon with animation */}
          <div className={cn(
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg',
            `bg-gradient-to-r ${config.colors}`,
            type === 'celebration' && 'animate-pulse',
            type === 'love' && 'animate-heartbeat'
          )}>
            <Icon className="w-4 h-4" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className={cn('font-semibold text-sm', config.textColors)}>
                {title}
              </p>
              <span className="text-lg">{config.emoji}</span>
            </div>
            {description && (
              <p className={cn('mt-1 text-xs', config.textColors, 'opacity-80')}>
                {description}
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className={cn(
              'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
              'hover:bg-black/10 transition-colors duration-200',
              config.textColors
            )}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Floating particles for celebration */}
      {type === 'celebration' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-4 w-1 h-1 bg-purple-400 rounded-full animate-ping" />
          <div className="absolute top-3 right-6 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-300" />
          <div className="absolute bottom-4 left-8 w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-700" />
        </div>
      )}
    </div>
  );
}

// Toast manager component
interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Expose addToast globally
  useEffect(() => {
    (window as any).showToastDelight = addToast;
    return () => {
      delete (window as any).showToastDelight;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastDelight
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}

// Hook for using toasts
export function useToastDelight() {
  const showToast = (toast: Omit<ToastData, 'id'>) => {
    if (typeof window !== 'undefined' && (window as any).showToastDelight) {
      return (window as any).showToastDelight(toast);
    }
  };

  return {
    showSuccess: (title: string, description?: string) =>
      showToast({ type: 'success', title, description }),
    
    showError: (title: string, description?: string) =>
      showToast({ type: 'error', title, description }),
      
    showWarning: (title: string, description?: string) =>
      showToast({ type: 'warning', title, description }),
      
    showInfo: (title: string, description?: string) =>
      showToast({ type: 'info', title, description }),
      
    showCelebration: (title: string, description?: string) =>
      showToast({ type: 'celebration', title, description, duration: 8000 }),
      
    showLove: (title: string, description?: string) =>
      showToast({ type: 'love', title, description, duration: 6000 }),
  };
}

// Pre-configured celebration toasts
export const celebrationToasts = {
  requestCreated: () => ({
    type: 'celebration' as const,
    title: 'Pedido criado com sucesso!',
    description: 'Os teus vizinhos vão adorar ajudar-te 😊'
  }),
  
  applicationSent: () => ({
    type: 'success' as const,
    title: 'Candidatura enviada!',
    description: 'Que gesto bonito! O teu vizinho vai ficar feliz 🤝'
  }),
  
  requestCompleted: () => ({
    type: 'love' as const,
    title: 'Missão cumprida!',
    description: 'Mais uma vez a comunidade de Fiães brilhou ⭐'
  }),
  
  firstLogin: () => ({
    type: 'celebration' as const,
    title: 'Bem-vindo à família Liga Bairro!',
    description: 'Prepare-se para conhecer vizinhos incríveis 🏡'
  }),
  
  ratingGiven: () => ({
    type: 'love' as const,
    title: 'Avaliação registada!',
    description: 'Obrigado por ajudar a construir confiança na comunidade 💖'
  })
};