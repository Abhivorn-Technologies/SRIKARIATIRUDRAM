'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] whitespace-nowrap';

    const variants = {
      primary:
        'bg-primary hover:bg-primary-hover text-ivory border border-gold/40 shadow-gold-sm hover:shadow-gold-md focus:ring-gold',
      secondary:
        'bg-burgundy-deep hover:bg-burgundy text-gold-lighter border border-gold/30 hover:border-gold/60 focus:ring-gold',
      gold: 'bg-gold-gradient hover:opacity-95 text-burgundy-deep font-semibold shadow-gold-md hover:shadow-gold-lg focus:ring-gold-light',
      outline:
        'bg-transparent hover:bg-primary/20 text-gold-light border border-gold/60 hover:border-gold focus:ring-gold',
      glass:
        'bg-primary/30 backdrop-blur-md hover:bg-primary/50 text-ivory border border-gold/30 hover:border-gold/60 focus:ring-gold',
      ghost: 'bg-transparent hover:bg-white/10 text-ivory/90 hover:text-gold-light',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5',
      xl: 'text-lg px-8 py-4 gap-3 font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2 shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
