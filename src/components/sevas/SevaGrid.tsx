'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Seva } from '@/types/seva';
import { SevaCard } from './SevaCard';

export function SevaGrid({ sevas }: { sevas: Seva[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
      {sevas.map((seva, index) => (
        <motion.div
          key={seva.id || seva.slug}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{
            duration: 0.5,
            delay: (index % 3) * 0.1,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="h-full flex"
        >
          <div className="w-full h-full">
            <SevaCard seva={seva} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
