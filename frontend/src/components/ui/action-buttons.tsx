'use client';

import * as React from 'react';
import { Check, X, Trash2, Edit3, Plus, Send, Heart, Star, Download, Share2 } from 'lucide-react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

// Accept Button - Specialized for approving requests/applications
interface AcceptButtonProps extends Omit<ButtonProps, 'variant'> {
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
}

export const AcceptButton = React.forwardRef<HTMLButtonElement, AcceptButtonProps>(
  ({ children = 'Aceitar', showIcon = true, iconPosition = 'left', className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="accept"
      className={cn('btn-accept', className)}
      {...props}
    >
      {showIcon && iconPosition === 'left' && <Check className="w-4 h-4 mr-2" />}
      {children}
      {showIcon && iconPosition === 'right' && <Check className="w-4 h-4 ml-2" />}
    </Button>
  )
);
AcceptButton.displayName = 'AcceptButton';

// Reject Button - Specialized for declining requests/applications
interface RejectButtonProps extends Omit<ButtonProps, 'variant'> {
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
}

export const RejectButton = React.forwardRef<HTMLButtonElement, RejectButtonProps>(
  ({ children = 'Rejeitar', showIcon = true, iconPosition = 'left', className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="reject"
      className={cn('btn-reject', className)}
      {...props}
    >
      {showIcon && iconPosition === 'left' && <X className="w-4 h-4 mr-2" />}
      {children}
      {showIcon && iconPosition === 'right' && <X className="w-4 h-4 ml-2" />}
    </Button>
  )
);
RejectButton.displayName = 'RejectButton';

// Delete Button - For destructive actions
interface DeleteButtonProps extends Omit<ButtonProps, 'variant'> {
  showIcon?: boolean;
  confirmText?: string;
}

export const DeleteButton = React.forwardRef<HTMLButtonElement, DeleteButtonProps>(
  ({ children = 'Eliminar', showIcon = true, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="destructive"
      className={cn('hover:animate-wiggle', className)}
      {...props}
    >
      {showIcon && <Trash2 className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  )
);
DeleteButton.displayName = 'DeleteButton';

// Edit Button - For edit actions
interface EditButtonProps extends Omit<ButtonProps, 'variant'> {
  showIcon?: boolean;
}

export const EditButton = React.forwardRef<HTMLButtonElement, EditButtonProps>(
  ({ children = 'Editar', showIcon = true, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      className={cn('hover:border-blue-300 hover:text-blue-600', className)}
      {...props}
    >
      {showIcon && <Edit3 className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  )
);
EditButton.displayName = 'EditButton';

// Create Button - For creating new items
interface CreateButtonProps extends Omit<ButtonProps, 'variant'> {
  showIcon?: boolean;
}

export const CreateButton = React.forwardRef<HTMLButtonElement, CreateButtonProps>(
  ({ children = 'Criar', showIcon = true, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="cta"
      size="lg"
      className={cn(className)}
      {...props}
    >
      {showIcon && <Plus className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  )
);
CreateButton.displayName = 'CreateButton';

// Send Button - For sending messages or forms
interface SendButtonProps extends Omit<ButtonProps, 'variant'> {
  showIcon?: boolean;
}

export const SendButton = React.forwardRef<HTMLButtonElement, SendButtonProps>(
  ({ children = 'Enviar', showIcon = true, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="default"
      className={cn('hover:shadow-blue-500/25', className)}
      {...props}
    >
      {showIcon && <Send className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  )
);
SendButton.displayName = 'SendButton';

// Love Button - For liking or favoriting
interface LoveButtonProps extends Omit<ButtonProps, 'variant'> {
  isLoved?: boolean;
  showIcon?: boolean;
}

export const LoveButton = React.forwardRef<HTMLButtonElement, LoveButtonProps>(
  ({ children, isLoved = false, showIcon = true, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant={isLoved ? 'love' : 'ghost'}
      className={cn(
        'transition-all duration-300',
        isLoved && 'animate-heartbeat',
        className
      )}
      {...props}
    >
      {showIcon && (
        <Heart
          className={cn(
            'w-4 h-4',
            children && 'mr-2',
            isLoved ? 'fill-current' : ''
          )}
        />
      )}
      {children}
    </Button>
  )
);
LoveButton.displayName = 'LoveButton';

// Star Button - For rating or starring
interface StarButtonProps extends Omit<ButtonProps, 'variant'> {
  isStarred?: boolean;
  showIcon?: boolean;
}

export const StarButton = React.forwardRef<HTMLButtonElement, StarButtonProps>(
  ({ children, isStarred = false, showIcon = true, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant={isStarred ? 'warning' : 'ghost'}
      className={cn(
        'transition-all duration-300',
        isStarred && 'animate-pulse-glow',
        className
      )}
      {...props}
    >
      {showIcon && (
        <Star
          className={cn(
            'w-4 h-4',
            children && 'mr-2',
            isStarred ? 'fill-current' : ''
          )}
        />
      )}
      {children}
    </Button>
  )
);
StarButton.displayName = 'StarButton';

// Download Button - For downloads
interface DownloadButtonProps extends Omit<ButtonProps, 'variant'> {
  showIcon?: boolean;
}

export const DownloadButton = React.forwardRef<HTMLButtonElement, DownloadButtonProps>(
  ({ children = 'Descarregar', showIcon = true, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="info"
      className={cn(className)}
      {...props}
    >
      {showIcon && <Download className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  )
);
DownloadButton.displayName = 'DownloadButton';

// Share Button - For sharing content
interface ShareButtonProps extends Omit<ButtonProps, 'variant'> {
  showIcon?: boolean;
}

export const ShareButton = React.forwardRef<HTMLButtonElement, ShareButtonProps>(
  ({ children = 'Partilhar', showIcon = true, className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="secondary"
      className={cn('hover:scale-110 active:scale-95', className)}
      {...props}
    >
      {showIcon && <Share2 className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  )
);
ShareButton.displayName = 'ShareButton';

// Button Group Component for related actions
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, className, orientation = 'horizontal', spacing = 'normal' }, ref) => {
    const spacingClasses = {
      tight: orientation === 'horizontal' ? 'space-x-1' : 'space-y-1',
      normal: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
      loose: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
          spacingClasses[spacing],
          className
        )}
      >
        {children}
      </div>
    );
  }
);
ButtonGroup.displayName = 'ButtonGroup';

// Action Bar - For common page actions
interface ActionBarProps {
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'sticky-top' | 'sticky-bottom';
}

export const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(
  ({ children, className, position = 'bottom' }, ref) => {
    const positionClasses = {
      top: 'top-0',
      bottom: 'bottom-0',
      'sticky-top': 'sticky top-0 z-10',
      'sticky-bottom': 'sticky bottom-0 z-10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end p-4 bg-background/80 backdrop-blur-sm border-t',
          positionClasses[position],
          className
        )}
      >
        <ButtonGroup spacing="normal">
          {children}
        </ButtonGroup>
      </div>
    );
  }
);
ActionBar.displayName = 'ActionBar';