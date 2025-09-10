'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Heart, Home, Users, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gradient' | 'pulse' | 'bounce' | 'neighborhood';
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  if (variant === 'neighborhood') {
    return <NeighborhoodLoader size={size} className={className} />;
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse',
              sizeClasses[size]
            )}
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'bounce') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-bounce',
              sizeClasses[size]
            )}
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    );
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin',
        variant === 'gradient' && 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600',
        sizeClasses[size],
        className
      )}
    />
  );
}

function NeighborhoodLoader({ size, className }: { size: string; className?: string }) {
  const [currentIcon, setCurrentIcon] = useState(0);
  const icons = [Home, Users, Heart, Zap];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const Icon = icons[currentIcon];
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={cn('relative', className)}>
      <Icon className={cn(
        'text-blue-500 animate-pulse',
        sizeClasses[size as keyof typeof sizeClasses]
      )} />
    </div>
  );
}

interface LoadingMessagesProps {
  messages?: string[];
  interval?: number;
  className?: string;
}

export function LoadingMessages({ 
  messages = [
    'A conectar com os vizinhos...',
    'A procurar ajuda por perto...',
    'A carregar a magia da comunidade...',
    'A sincronizar pedidos...',
    'Quase lá... preparando surpresas!',
    'A organizar as melhores oportunidades...'
  ],
  interval = 2000,
  className
}: LoadingMessagesProps) {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [messages.length, interval]);

  return (
    <div className={cn('text-center space-y-4', className)}>
      <LoadingSpinner variant="neighborhood" size="lg" />
      <p className="text-gray-600 text-lg font-medium min-h-[1.5rem] transition-all duration-300">
        {messages[currentMessage]}
      </p>
    </div>
  );
}

interface LoadingCardProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'shimmer' | 'pulse';
  className?: string;
}

export function LoadingCard({ 
  title = 'A carregar algo fantástico...',
  description = 'Vai valer a pena a espera, prometemos!',
  variant = 'shimmer',
  className 
}: LoadingCardProps) {
  return (
    <div className={cn(
      'bg-white/60 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-200',
      variant === 'shimmer' && 'animate-shimmer bg-gradient-to-r from-white/60 via-white/80 to-white/60 bg-[length:200%_100%]',
      variant === 'pulse' && 'animate-pulse',
      className
    )}>
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center animate-pulse">
          <Home className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded-full animate-pulse mb-2" />
          <div className="h-3 bg-gray-200 rounded-full animate-pulse w-2/3" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <div className="space-y-2">
        <div className="h-2 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-2 bg-gray-200 rounded-full animate-pulse w-5/6" />
        <div className="h-2 bg-gray-200 rounded-full animate-pulse w-4/6" />
      </div>
    </div>
  );
}

interface ProgressLoaderProps {
  progress?: number;
  message?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressLoader({ 
  progress = 0, 
  message = 'A processar o teu pedido...',
  showPercentage = true,
  className 
}: ProgressLoaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center space-x-3">
        <LoadingSpinner variant="gradient" />
        <span className="text-gray-600 font-medium">{message}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shimmer" />
        </div>
      </div>
      
      {showPercentage && (
        <div className="text-right text-sm font-semibold text-gray-700">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}

// Full page loading component with personality
export function FullPageLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center z-50">
      <div className="text-center max-w-md px-8">
        {/* Logo animado */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto animate-bounce">
            <div className="text-white font-bold text-3xl">LB</div>
          </div>
          
          {/* Partículas flutuantes */}
          <div className="absolute -top-4 -right-4">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
          </div>
          <div className="absolute -bottom-2 -left-6">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          </div>
          <div className="absolute top-8 -left-8">
            <div className="w-4 h-4 bg-green-400 rounded-full animate-bounce delay-300" />
          </div>
        </div>

        <LoadingMessages 
          messages={message ? [message] : undefined}
          className="mb-4"
        />
        
        <p className="text-gray-500 text-sm">
          PorPerto • A comunidade mais unida de Mozelos
        </p>
      </div>
    </div>
  );
}