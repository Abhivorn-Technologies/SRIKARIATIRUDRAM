import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'sacred' | 'glass' | 'gold-border' | 'plain';
  interactive?: boolean;
}

export function Card({
  className,
  variant = 'sacred',
  interactive = false,
  children,
  ...props
}: CardProps) {
  const variants = {
    sacred:
      'bg-sacred-card border border-gold/30 shadow-xl text-ivory rounded-xl backdrop-blur-sm',
    glass:
      'bg-burgundy/60 backdrop-blur-md border border-gold/25 shadow-lg text-ivory rounded-xl',
    'gold-border':
      'bg-burgundy-deep/90 border-2 border-gold/60 shadow-gold-sm hover:shadow-gold-md text-ivory rounded-xl',
    plain:
      'bg-burgundy-deep/80 border border-gold/15 text-ivory rounded-xl',
  };

  const interactiveStyles =
    interactive &&
    'transition-all duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-gold-md cursor-pointer';

  return (
    <div
      className={cn('p-6 relative overflow-hidden', variants[variant], interactiveStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 space-y-1.5', className)} {...props}>{children}</div>;
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-cinzel text-xl font-bold text-gold-light tracking-wide', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-ivory/80 leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4', className)} {...props}>{children}</div>;
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-6 pt-4 border-t border-gold/20 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}
