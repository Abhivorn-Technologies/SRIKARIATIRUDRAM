'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Seva, SevaCategory } from '@/types/seva';
import { SevaCard } from './SevaCard';
import { Tabs } from '@/components/ui/Tabs';

export function SevaGrid({ sevas }: { sevas: Seva[] }) {
  const t = useTranslations('sevas');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const tabs = [
    { id: 'all', label: t('filterAll'), count: sevas.length },
    { id: 'homam', label: t('filterHomam'), count: sevas.filter((s) => s.category === 'homam').length },
    { id: 'abhishekam', label: t('filterAbhishekam'), count: sevas.filter((s) => s.category === 'abhishekam').length },
    { id: 'special', label: t('filterSpecial'), count: sevas.filter((s) => s.category === 'special').length },
  ];

  const filteredSevas = useMemo(() => {
    if (activeCategory === 'all') return sevas;
    return sevas.filter((s) => s.category === activeCategory);
  }, [sevas, activeCategory]);

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <Tabs
          tabs={tabs}
          activeTab={activeCategory}
          onChange={setActiveCategory}
          className="bg-burgundy-deep/80 p-1.5 rounded-xl border border-gold/30"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSevas.map((seva) => (
          <SevaCard key={seva.id} seva={seva} />
        ))}
      </div>
    </div>
  );
}
