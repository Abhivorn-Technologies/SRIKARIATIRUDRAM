'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepItem {
  id: number;
  num: string;
  label: string;
  labelTe: string;
  labelHi: string;
  path: string;
}

export const BOOKING_STEPS: StepItem[] = [
  { id: 1, num: '01', label: 'SELECT DAY & SEVA', labelTe: 'రోజు & సేవ', labelHi: 'दिवस और सेवा', path: '/book-seva/date' },
  { id: 2, num: '02', label: 'DEVOTEE DETAILS', labelTe: 'భక్తుని వివరాలు', labelHi: 'भक्त विवरण', path: '/book-seva/details' },
  { id: 3, num: '03', label: 'REVIEW', labelTe: 'సమీక్ష', labelHi: 'समीक्षा', path: '/book-seva/review' },
  { id: 4, num: '04', label: 'PAYMENT', labelTe: 'చెల్లింపు', labelHi: 'दान / भुगतान', path: '/book-seva/payment' },
  { id: 5, num: '05', label: 'CONFIRMATION', labelTe: 'ధ్రువీకరణ', labelHi: 'पुष्टि', path: '/book-seva/success' },
];

export function BookingStepper({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick?: (step: number) => void;
}) {
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  return (
    <div className="w-full py-4 overflow-x-auto scrollbar-none">
      <div className="flex items-center justify-between min-w-[540px] max-w-4xl mx-auto px-4">
        {BOOKING_STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted && onStepClick;
          const stepLabel = isTe ? step.labelTe : isHi ? step.labelHi : step.label;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle & Label */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 shrink-0 transition-all focus:outline-none select-none',
                  isClickable ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
                )}
              >
                <div
                  className={cn(
                    'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 border-2',
                    isCompleted && 'bg-gradient-to-br from-[#F2C14E] to-[#D6A532] text-[#2D060B] border-[#D6A532] shadow-[0_0_12px_rgba(214,165,50,0.4)]',
                    isCurrent && 'bg-[#5A0714] text-[#FAF4E6] border-[#F2C14E] ring-4 ring-[#D6A532]/30 scale-105 shadow-[0_0_15px_rgba(214,165,50,0.5)]',
                    !isCompleted && !isCurrent && 'bg-[#230206] text-[#FFF8E8]/40 border-[#D6A532]/25'
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.num}
                </div>
                <span
                  className={cn(
                    'text-[10px] sm:text-xs font-semibold tracking-wider uppercase whitespace-nowrap',
                    isCurrent ? 'text-[#F2C14E] font-black' : isCompleted ? 'text-[#E8C76A]' : 'text-[#FFF8E8]/45',
                    isTe ? 'font-telugu' : isHi ? 'font-hindi' : 'font-cinzel'
                  )}
                >
                  {stepLabel}
                </span>
              </button>

              {/* Connecting Line */}
              {index < BOOKING_STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-[2px] mx-3 transition-colors duration-300',
                    currentStep > index + 1 ? 'bg-gradient-to-r from-[#F2C14E] to-[#D6A532]' : 'bg-[#D6A532]/20'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
