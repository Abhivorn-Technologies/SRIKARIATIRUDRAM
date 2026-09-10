'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { HelpCircle, Plus, Trash2, Edit2, Search } from 'lucide-react';

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: 'Can devotees attend the Ati Rudram Yagnam rituals in person?',
      category: 'General',
      answer: 'Yes, all devotees are welcome to participate in the morning and evening homam rituals at the Dilsukhnagar Yagashala ground. Seva ticket holders receive dedicated seating in the inner hall.',
    },
    {
      id: 2,
      question: 'What is the dress code required inside the Yagnashala?',
      category: 'Rituals',
      answer: 'Traditional Indian attire is mandatory: Dhoti/Kurta or Pancha for men, and Saree or Chudidhar with Dupatta for women.',
    },
    {
      id: 3,
      question: 'How will I receive the sacred Prasadam if I book online from outside Hyderabad?',
      category: 'Booking & Prasadam',
      answer: 'Sacred Bhasmam (Vibhuti), Raksha Sutram, and Akshatas will be sanctified during the Sankalpam and dispatched via Speed Post / Courier to your registered address.',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              KNOWLEDGE BASE & DEVOTEE HELP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-gold" />
            Frequently Asked Questions (FAQ)
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Manage FAQs shown on the public /faq and about pages for devotee queries and guidance.
          </p>
        </div>

        <Button variant="gold" size="sm" className="text-xs font-bold uppercase tracking-wider shrink-0 shadow-gold-sm">
          <Plus className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
          Add FAQ Item
        </Button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <Card key={faq.id} className="p-5 bg-burgundy-deep/90 border-gold/30 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" size="sm" className="text-[10px] text-gold-light border-gold/30">
                {faq.category}
              </Badge>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs border-gold/30">
                  <Edit2 className="w-3 h-3 text-gold" />
                </Button>
              </div>
            </div>
            <h3 className="text-sm font-bold text-ivory">{faq.question}</h3>
            <p className="text-xs text-ivory/70 font-sans leading-relaxed">{faq.answer}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
