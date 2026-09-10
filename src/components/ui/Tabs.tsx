'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Tabs
export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'pill' | 'underline';
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pill',
}: TabsProps) {
  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        if (variant === 'underline') {
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative flex items-center gap-2',
                isActive ? 'text-gold-light font-semibold' : 'text-ivory/60 hover:text-ivory'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/40 text-gold-lighter">
                  {tab.count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="tabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                />
              )}
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 border',
              isActive
                ? 'bg-primary text-gold-lighter border-gold/70 shadow-gold-sm font-semibold'
                : 'bg-burgundy-deep/60 text-ivory/70 border-gold/20 hover:border-gold/40 hover:text-ivory'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gold/20 text-gold-light">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Accordion
export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  isOpen: controlledOpen,
  onToggle,
}: AccordionItemProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const handleToggle = () => {
    if (onToggle) onToggle();
    else setUncontrolledOpen(!uncontrolledOpen);
  };

  return (
    <div className="border border-gold/30 rounded-xl bg-sacred-card/70 overflow-hidden mb-3">
      <button
        onClick={handleToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-white/5"
      >
        <span className="font-cinzel text-base md:text-lg font-bold text-gold-light pr-4">
          {title}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gold-light shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-gold'
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 text-sm text-ivory/80 leading-relaxed border-t border-gold/15">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Empty State
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center rounded-xl bg-burgundy-deep/40 border border-gold/20">
      <div className="w-14 h-14 rounded-full bg-primary/40 border border-gold/30 flex items-center justify-center text-gold-light mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="font-cinzel text-lg font-bold text-gold-lighter mb-1">{title}</h4>
      {description && <p className="text-sm text-ivory/60 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}

// Skeleton
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-burgundy/60 border border-gold/10', className)}
      {...props}
    />
  );
}
