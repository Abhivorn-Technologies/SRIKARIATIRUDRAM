'use client';

import React, { useState, useRef, useEffect, useId, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { useLocale } from 'next-intl';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

export interface SelectProps {
  id?: string;
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string; name?: string } }) => void;
  options?: SelectOption[];
  children?: React.ReactNode;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      id,
      name,
      value,
      defaultValue,
      onChange,
      options,
      children,
      label,
      error,
      helperText,
      placeholder = 'Select an option...',
      disabled = false,
      required = false,
      searchable,
      className,
      triggerClassName,
      dropdownClassName,
    },
    ref
  ) => {
    const locale = useLocale();
    const isTe = locale === 'te';
    const isHi = locale === 'hi';
    const generatedId = useId();
    const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : `select-${generatedId}`);

    // Parse options from props or children
    const parsedOptions: SelectOption[] = useMemo(() => {
      if (options && options.length > 0) {
        return options;
      }

      if (children) {
        const opts: SelectOption[] = [];
        React.Children.forEach(children, (child) => {
          if (React.isValidElement(child) && child.type === 'option') {
            const val = child.props.value !== undefined ? String(child.props.value) : '';
            const text = Array.isArray(child.props.children)
              ? child.props.children.join('')
              : String(child.props.children || val);
            opts.push({
              value: val,
              label: text,
              disabled: child.props.disabled,
            });
          }
        });
        return opts;
      }

      return [];
    }, [options, children]);

    // Current internal value
    const [selectedValue, setSelectedValue] = useState<string>(() => {
      if (value !== undefined) return String(value);
      if (defaultValue !== undefined) return String(defaultValue);
      return parsedOptions[0]?.value || '';
    });

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(String(value));
      }
    }, [value]);

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [openUpward, setOpenUpward] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listboxRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Forward ref assignment
    React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

    // Selected option object
    const selectedOption = useMemo(() => {
      return (
        parsedOptions.find((o) => o.value === selectedValue) ||
        (parsedOptions.length > 0 ? parsedOptions[0] : undefined)
      );
    }, [parsedOptions, selectedValue]);

    // Should search be shown
    const isSearchVisible = searchable !== undefined ? searchable : parsedOptions.length >= 7;

    // Filtered options based on search query
    const filteredOptions = useMemo(() => {
      if (!searchQuery.trim()) return parsedOptions;
      const q = searchQuery.toLowerCase().trim();
      return parsedOptions.filter((opt) => {
        const matchLabel = opt.label.toLowerCase().includes(q);
        const matchSub = opt.sublabel ? opt.sublabel.toLowerCase().includes(q) : false;
        const matchVal = opt.value.toLowerCase().includes(q);
        return matchLabel || matchSub || matchVal;
      });
    }, [parsedOptions, searchQuery]);

    // Viewport collision detection
    useEffect(() => {
      if (isOpen && triggerRef.current) {
        setOpenUpward(false);

        if (isSearchVisible) {
          setTimeout(() => {
            searchInputRef.current?.focus();
          }, 50);
        }
      }
    }, [isOpen, isSearchVisible]);

    // Click outside handler
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setSearchQuery('');
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }, [isOpen]);

    // Scroll active item into view
    useEffect(() => {
      if (isOpen && activeIndex >= 0 && listboxRef.current) {
        const activeEl = listboxRef.current.children[activeIndex] as HTMLElement;
        if (activeEl) {
          activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }, [activeIndex, isOpen]);

    const handleSelectOption = (opt: SelectOption) => {
      if (opt.disabled) return;
      setSelectedValue(opt.value);
      setIsOpen(false);
      setSearchQuery('');

      if (onChange) {
        // Create synthetic event compatible with HTMLSelectElement onChange handlers
        const syntheticEvent = {
          target: {
            value: opt.value,
            name: name || selectId,
          },
        } as unknown as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }

      triggerRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen(true);
          const currentIndex = filteredOptions.findIndex((o) => o.value === selectedValue);
          setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
            handleSelectOption(filteredOptions[activeIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSearchQuery('');
          triggerRef.current?.focus();
          break;
        case 'Tab':
          setIsOpen(false);
          setSearchQuery('');
          break;
        case 'Home':
          e.preventDefault();
          setActiveIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setActiveIndex(filteredOptions.length - 1);
          break;
      }
    };

    return (
      <div ref={containerRef} className={cn('w-full space-y-1.5 text-left relative', className)}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'block text-xs font-semibold uppercase tracking-wider text-gold-lighter font-sans',
              isTe ? 'font-telugu' : isHi ? 'font-hindi' : ''
            )}
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        {/* Closed Dropdown Trigger */}
        <button
          id={selectId}
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${selectId}-listbox`}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer outline-none select-none text-left text-sm',
            'bg-gradient-to-r from-[#2B0005] via-[#35030A] to-[#2B0005] border border-[#D6A532]/45 text-[#FAF4E6]',
            'hover:border-[#D6A532] hover:shadow-[0_0_12px_rgba(214,165,50,0.22)]',
            'focus:border-[#D6A532] focus:ring-2 focus:ring-[#D6A532]/35',
            isOpen && 'border-[#D6A532] ring-2 ring-[#D6A532]/40 shadow-[0_0_16px_rgba(214,165,50,0.3)]',
            disabled && 'opacity-50 cursor-not-allowed bg-burgundy/40 border-gold/20',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400',
            triggerClassName
          )}
        >
          <span
            className={cn(
              'truncate font-medium tracking-wide',
              selectedOption ? 'text-[#FAF4E6]' : 'text-[#FAF4E6]/50',
              isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <ChevronDown
            className={cn(
              'w-4 h-4 text-[#D6A532] shrink-0 transition-transform duration-200',
              isOpen && 'rotate-180 text-[#F2C14E]'
            )}
          />
        </button>

        {/* Custom Srikari Popover */}
        {isOpen && !disabled && (
          <div
            id={`${selectId}-listbox`}
            role="listbox"
            tabIndex={-1}
            className={cn(
              'absolute left-0 right-0 z-50 w-full rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.9)] border border-[#D6A532]',
              'bg-[#230005] text-[#FAF4E6] backdrop-blur-md',
              'animate-in fade-in zoom-in-95 duration-150',
              openUpward ? 'bottom-full mb-2' : 'top-full mt-2',
              dropdownClassName
            )}
          >
            {/* Quick Search Header */}
            {isSearchVisible && (
              <div className="p-1 border-b border-[#D6A532]/25 mb-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-[#D6A532] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={isTe ? 'వెతకండి...' : isHi ? 'खोजें...' : 'Search...'}
                    className={cn(
                      'w-full pl-8 pr-7 py-1 rounded-lg text-xs bg-[#170003] border border-[#D6A532]/40 text-[#FAF4E6] placeholder-[#FAF4E6]/75',
                      'focus:outline-none focus:border-[#D6A532] focus:ring-1 focus:ring-[#D6A532]',
                      isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
                    )}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#FAF4E6]/50 hover:text-[#FAF4E6]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-[#D6A532] font-semibold px-1.5 py-0.5 rounded bg-[#D6A532]/10 border border-[#D6A532]/25 shrink-0">
                  {filteredOptions.length}
                </span>
              </div>
            )}

            {/* Options List */}
            <div
              ref={listboxRef}
              className="max-h-60 sm:max-h-68 overflow-y-auto space-y-0.5 pr-1 overscroll-contain"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#D6A532 #1A0004',
              }}
            >
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-center text-xs text-[#FAF4E6]/60 font-sans">
                  {isTe ? 'ఫలితాలు లేవు' : isHi ? 'कोई परिणाम नहीं' : 'No options found'}
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = selectedValue === opt.value;
                  const isHighlighted = activeIndex === idx;

                  return (
                    <div
                      key={opt.value || idx}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectOption(opt)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        'flex items-center justify-between gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 select-none text-xs sm:text-[13px]',
                        isSelected
                          ? 'bg-gradient-to-r from-[#D6A532]/35 via-[#D6A532]/20 to-transparent text-[#F2C14E] border-l-4 border-[#D6A532] font-bold shadow-xs'
                          : isHighlighted
                          ? 'bg-[#D6A532]/15 text-[#FAF4E6]'
                          : 'text-[#FAF4E6]/90 hover:bg-[#D6A532]/10 hover:text-[#FAF4E6]',
                        opt.disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
                      )}
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span
                          className={cn(
                            'truncate',
                            isSelected ? 'text-[#F2C14E] font-bold' : 'text-[#FAF4E6]',
                            isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-sans'
                          )}
                        >
                          {opt.label}
                        </span>
                        {opt.sublabel && (
                          <span className="text-[10px] text-[#FAF4E6]/60 truncate font-sans">
                            {opt.sublabel}
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#F2C14E] stroke-[3] shrink-0" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {error && <p className="text-xs text-red-400 font-sans">{error}</p>}
        {!error && helperText && <p className="text-xs text-ivory/60 font-sans">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export const CustomSelect = Select;
export default Select;
