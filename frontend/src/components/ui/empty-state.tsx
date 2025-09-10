'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Sparkles, Heart, Coffee, Zap, 
  Search, MapPin, Users, Clock,
  MessageCircle, Plus, ArrowRight
} from 'lucide-react';

interface EmptyStateProps {
  type: 'no-requests' | 'no-applications' | 'no-notifications' | 'no-messages' | 'search-empty' | 'custom';
  title?: string;
  description?: string;
  emoji?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  children?: ReactNode;
  className?: string;
  showAnimation?: boolean;
}

const emptyStateConfig = {
  'no-requests': {
    emoji: '🏠',
    title: 'Ainda não há pedidos aqui!',
    description: 'Que tal ser o primeiro a pedir ajuda à comunidade de Mozelos? Os teus vizinhos estão prontos para ajudar!',
    actionLabel: 'Criar primeiro pedido',
    icon: Plus,
    colors: 'from-blue-400 to-indigo-500'
  },
  'no-applications': {
    emoji: '👋',
    title: 'Ninguém se candidatou ainda',
    description: 'Não te preocupes! Às vezes demora um bocadinho. Que tal partilhar o teu pedido com alguns vizinhos?',
    actionLabel: 'Partilhar pedido',
    icon: Users,
    colors: 'from-green-400 to-emerald-500'
  },
  'no-notifications': {
    emoji: '🔔',
    title: 'Tudo tranquilo por aqui!',
    description: 'Quando houver novidades sobre os teus pedidos ou candidaturas, vais saber imediatamente.',
    actionLabel: 'Ver pedidos',
    icon: Search,
    colors: 'from-purple-400 to-pink-500'
  },
  'no-messages': {
    emoji: '💬',
    title: 'Conversa ainda por começar',
    description: 'Esta vai ser uma conversa interessante! Começa por dizer olá e explicar os detalhes.',
    actionLabel: 'Enviar mensagem',
    icon: MessageCircle,
    colors: 'from-amber-400 to-orange-500'
  },
  'search-empty': {
    emoji: '🔍',
    title: 'Nada por aqui!',
    description: 'Não encontrámos nada com esses critérios. Que tal tentar uma pesquisa diferente?',
    actionLabel: 'Limpar filtros',
    icon: Search,
    colors: 'from-gray-400 to-gray-500'
  },
  'custom': {
    emoji: '✨',
    title: 'Algo especial',
    description: 'Personaliza esta mensagem',
    actionLabel: 'Ação',
    icon: Sparkles,
    colors: 'from-cyan-400 to-blue-500'
  }
};

export function EmptyState({
  type,
  title,
  description,
  emoji,
  actionLabel,
  onAction,
  actionHref,
  children,
  className,
  showAnimation = true
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayEmoji = emoji || config.emoji;
  const displayActionLabel = actionLabel || config.actionLabel;

  return (
    <div className={cn('flex items-center justify-center min-h-[400px] p-8', className)}>
      <Card className="max-w-md w-full text-center border-0 bg-white/60 backdrop-blur-sm shadow-xl">
        <CardContent className="pt-12 pb-8 px-8">
          {/* Animated emoji/icon */}
          <div className="relative mb-8">
            {/* Background glow */}
            <div className={cn(
              'absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse',
              `bg-gradient-to-r ${config.colors}`
            )} />
            
            {/* Main container */}
            <div className={cn(
              'relative w-24 h-24 mx-auto rounded-full flex items-center justify-center',
              `bg-gradient-to-br ${config.colors}`,
              'shadow-2xl',
              showAnimation && 'animate-bounce'
            )}>
              <div className="text-4xl">{displayEmoji}</div>
            </div>
            
            {/* Floating particles */}
            {showAnimation && (
              <>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
                <Heart className="absolute -bottom-1 -left-3 w-4 h-4 text-pink-400 animate-pulse delay-300" />
                <Zap className="absolute top-4 -left-4 w-5 h-5 text-blue-400 animate-pulse delay-500" />
              </>
            )}
          </div>

          {/* Title with gradient */}
          <h3 className={cn(
            'text-2xl font-bold mb-4',
            'bg-gradient-to-r bg-clip-text text-transparent',
            config.colors
          )}>
            {displayTitle}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            {displayDescription}
          </p>

          {/* Action button or custom children */}
          {children || (displayActionLabel && (onAction || actionHref)) ? (
            <div className="space-y-4">
              {children || (
                <Button
                  onClick={onAction}
                  size="lg"
                  className={cn(
                    'bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105',
                    config.colors,
                    'group'
                  )}
                  {...(actionHref && { asChild: true })}
                >
                  {actionHref ? (
                    <a href={actionHref}>
                      <Icon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      {displayActionLabel}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <>
                      <Icon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      {displayActionLabel}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              )}
              
              {/* Motivational footer */}
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Coffee className="w-4 h-4" />
                PorPerto • Sempre aqui para ajudar
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

// Specific empty state components for common use cases
export function NoRequestsEmptyState({ onCreateRequest }: { onCreateRequest?: () => void }) {
  return (
    <EmptyState
      type="no-requests"
      onAction={onCreateRequest}
      actionHref={!onCreateRequest ? '/requests/new' : undefined}
    />
  );
}

export function NoApplicationsEmptyState({ onShareRequest }: { onShareRequest?: () => void }) {
  return (
    <EmptyState
      type="no-applications"
      onAction={onShareRequest}
    />
  );
}

export function NoNotificationsEmptyState() {
  return (
    <EmptyState
      type="no-notifications"
      actionHref="/requests"
    />
  );
}

export function SearchEmptyState({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      type="search-empty"
      onAction={onClearFilters}
    />
  );
}