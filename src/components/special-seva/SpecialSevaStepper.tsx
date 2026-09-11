'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Calendar, User, CreditCard, CheckCircle2 } from 'lucide-react';

interface SpecialSevaStepperProps {
  currentStep: 1 | 2 | 3 | 4;
}

export function SpecialSevaStepper({ currentStep }: SpecialSevaStepperProps) {
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  const steps = [
    {
      num: 1,
      label: '01 SELECT DAY',
      labelTe: '01 రోజు ఎంచుకోండి',
      labelHi: '01 दिवस चुनें',
      icon: Calendar,
    },
    {
      num: 2,
      label: '02 DEVOTEE DETAILS',
      labelTe: '02 భక్తుని వివరాలు',
      labelHi: '02 भक्त विवरण',
      icon: User,
    },
    {
      num: 3,
      label: '03 PAYMENT',
      labelTe: '03 చెల్లింపు',
      labelHi: '03 भुगतान',
      icon: CreditCard,
    },
    {
      num: 4,
      label: '✓ CONFIRMED',
      labelTe: '✓ ధ్రువీకరణ',
      labelHi: '✓ कन्फर्म',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {steps.map((s) => {
          const isCurrent = s.num === currentStep;
          const isPassed = s.num < currentStep;
          const Icon = s.icon;

          return (
            <div
              key={s.num}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-gradient-to-r from-[#5A0714] to-[#3B040B] border-[#F2C14E] shadow-[0_0_15px_rgba(214,165,50,0.4)] ring-1 ring-[#F2C14E]'
                  : isPassed
                  ? 'bg-[#230206] border-[#D6A532]/60 text-[#F2C14E]'
                  : 'bg-[#1F0205]/70 border-[#D6A532]/20 text-[#FFF8E8]/40'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-cinzel ${
                  isCurrent
                    ? 'bg-[#F2C14E] text-[#280509] shadow-sm'
                    : isPassed
                    ? 'bg-[#5A0714] text-[#F2C14E] border border-[#D6A532]/40'
                    : 'bg-[#2B040A] text-[#FFF8E8]/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="min-w-0">
                <span
                  className={`block text-[11px] sm:text-xs font-cinzel font-black uppercase tracking-wider truncate ${
                    isCurrent
                      ? 'text-[#FAF4E6]'
                      : isPassed
                      ? 'text-[#F2C14E]'
                      : 'text-[#FFF8E8]/50'
                  }`}
                >
                  {isTe ? s.labelTe : isHi ? s.labelHi : s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
