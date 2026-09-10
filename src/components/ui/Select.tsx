import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-gold-lighter font-sans">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full appearance-none bg-burgundy-deep/90 border border-gold/30 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-ivory',
              'focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors duration-150',
              'disabled:opacity-50 disabled:bg-burgundy/40 cursor-pointer',
              error && 'border-red-400 focus:border-red-400 focus:ring-red-400',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-burgundy-deep text-ivory py-1">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-light pointer-events-none" />
        </div>
        {error && <p className="text-xs text-red-400 font-sans">{error}</p>}
        {!error && helperText && <p className="text-xs text-ivory/60 font-sans">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
