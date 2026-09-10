'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BarChart3, Download, TrendingUp, Calendar, Users, IndianRupee, FileSpreadsheet } from 'lucide-react';

export default function AdminReportsPage() {
  const reportCards = [
    {
      title: 'Daily Seva Collections Summary',
      description: 'Day-by-day revenue breakdown across all 28 Nakshatras and Seva tiers.',
      format: 'Excel & PDF',
      icon: IndianRupee,
    },
    {
      title: 'Vedic Sankalpam Chanting Master List',
      description: 'Devotee Gotrams, Nakshatras, and family members grouped by ritual day.',
      format: 'Purohit A4 PDF',
      icon: Calendar,
    },
    {
      title: 'Annadanam & Donor 80G Tax Register',
      description: 'Audited donor register with PAN numbers, addresses, and 80G receipt serials.',
      format: 'Audit CSV',
      icon: FileSpreadsheet,
    },
    {
      title: 'Counter vs Online Payment Reconciliation',
      description: 'Cash counter collections mapped with online UPI and NetBanking settlements.',
      format: 'Bank Reconciliation Excel',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
              EXECUTIVE ANALYTICS & AUDIT EXPORTS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-lighter mt-1 flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-gold" />
            Operational & Financial Reports
          </h1>
          <p className="text-xs text-ivory/70 font-sans mt-0.5">
            Generate and export comprehensive audits, daily collection tallies, and Vedic priest chanting records.
          </p>
        </div>

        <Button variant="gold" size="sm" className="text-xs font-bold uppercase tracking-wider shrink-0 shadow-gold-sm">
          <Download className="w-3.5 h-3.5 mr-1.5 text-burgundy-deep" />
          Download Complete Audit ZIP
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportCards.map((r, i) => {
          const Icon = r.icon;
          return (
            <Card key={i} variant="gold-border" className="p-5 bg-burgundy-deep/90 border-gold/30 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-gold/15 text-gold border border-gold/30 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge variant="outline" size="sm" className="text-[10px] border-gold/30 text-gold-light">
                    {r.format}
                  </Badge>
                </div>
                <h3 className="text-sm font-bold text-ivory font-cinzel">{r.title}</h3>
                <p className="text-xs text-ivory/70 font-sans">{r.description}</p>
              </div>

              <div className="pt-3 border-t border-gold/15 flex justify-end">
                <Button variant="outline" size="sm" className="text-xs border-gold/30 hover:border-gold">
                  <Download className="w-3 h-3 mr-1.5 text-gold" /> Export Report
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
