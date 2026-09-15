import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-gold-lighter font-sans">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'w-full bg-white text-black border border-gold rounded-lg px-3.5 py-2.5 text-sm font-bold placeholder:text-zinc-500 font-sans',
            'focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon transition-colors duration-150',
            'disabled:opacity-90 disabled:bg-zinc-200 disabled:text-zinc-600 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-sans">{error}</p>}
        {!error && helperText && <p className="text-xs text-ivory/60 font-sans">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-gold-lighter font-sans">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            'w-full bg-white text-black border border-gold rounded-lg px-3.5 py-2.5 text-sm font-bold placeholder:text-zinc-500 font-sans',
            'focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon transition-colors duration-150',
            'disabled:opacity-90 disabled:bg-zinc-200 disabled:text-zinc-600 min-h-[100px] resize-y',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 font-sans">{error}</p>}
        {!error && helperText && <p className="text-xs text-ivory/60 font-sans">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
