import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'maroon' | 'success' | 'warning' | 'outline' | 'live';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({
  className,
  variant = 'gold',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    gold: 'bg-gold/20 text-gold-lighter border border-gold/40',
    maroon: 'bg-primary/60 text-ivory border border-primary-light',
    success: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40',
    warning: 'bg-amber-950/80 text-amber-300 border border-amber-500/40',
    outline: 'bg-transparent text-gold-light border border-gold/40',
    live: 'bg-red-950/90 text-red-200 border border-red-500/60 animate-pulse',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 rounded font-medium tracking-wide uppercase',
    md: 'text-xs px-2.5 py-1 rounded-md font-semibold tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 rounded-lg font-semibold tracking-wider',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-sans justify-center transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {variant === 'live' && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping shrink-0" />
      )}
      {children}
    </span>
  );
}
