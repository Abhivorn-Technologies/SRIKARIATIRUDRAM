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
            'w-full bg-white border border-[#D6A532]/45 rounded-lg px-3.5 py-2.5 text-sm text-[#3A0A0A] placeholder:text-[#8A8A8A] placeholder:opacity-100 font-sans',
            'focus:outline-none focus:border-[#D6A532] focus:ring-1 focus:ring-[#D6A532] transition-colors duration-150',
            'disabled:opacity-90 disabled:bg-[#F3EFE6] disabled:text-[#3A0A0A] disabled:border-[#D6A532]/30 disabled:cursor-not-allowed',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400',
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
            'w-full bg-white border border-[#D6A532]/45 rounded-lg px-3.5 py-2.5 text-sm text-[#3A0A0A] placeholder:text-[#8A8A8A] placeholder:opacity-100 font-sans',
            'focus:outline-none focus:border-[#D6A532] focus:ring-1 focus:ring-[#D6A532] transition-colors duration-150',
            'disabled:opacity-90 disabled:bg-[#F3EFE6] disabled:text-[#3A0A0A] min-h-[100px] resize-y',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400',
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
