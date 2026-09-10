'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepItem {
  id: number;
  num: string;
  label: string;
  labelTe: string;
}

export const BOOKING_STEPS: StepItem[] = [
  { id: 1, num: '01', label: 'SELECT SEVA', labelTe: 'సేవ ఎంపిక' },
  { id: 2, num: '02', label: 'DATE / NAKSHATRA', labelTe: 'తేదీ / నక్షత్రం' },
  { id: 3, num: '03', label: 'SANKALPAM', labelTe: 'సంకల్ప వివరాలు' },
  { id: 4, num: '04', label: 'REVIEW', labelTe: 'సమీక్ష' },
  { id: 5, num: '05', label: 'PAYMENT', labelTe: 'దక్షిణ సమర్పణ' },
];

export function BookingStepper({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick?: (step: number) => void;
}) {
  return (
    <div className="w-full py-4 overflow-x-auto scrollbar-none">
      <div className="flex items-center justify-between min-w-[620px] max-w-4xl mx-auto px-4">
        {BOOKING_STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted && onStepClick;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle & Label */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 shrink-0 transition-all focus:outline-hidden',
                  isClickable ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
                )}
              >
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2',
                    isCompleted && 'bg-gold text-burgundy-deep border-gold shadow-gold-sm',
                    isCurrent && 'bg-primary text-gold-lighter border-gold-light ring-4 ring-gold/20 scale-105',
                    !isCompleted && !isCurrent && 'bg-burgundy-deep text-ivory/40 border-gold/20'
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.num}
                </div>
                <span
                  className={cn(
                    'text-[11px] md:text-xs font-semibold tracking-wide uppercase whitespace-nowrap',
                    isCurrent ? 'text-gold-light font-bold' : isCompleted ? 'text-gold/90' : 'text-ivory/50'
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connecting Line */}
              {index < BOOKING_STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-[2px] mx-2 transition-colors duration-200',
                    currentStep > index + 1 ? 'bg-gold' : 'bg-gold/20'
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
