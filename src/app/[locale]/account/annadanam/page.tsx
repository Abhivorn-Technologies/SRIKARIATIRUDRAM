import { annadanamService } from '@/services/devotee.service';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { formatCurrency } from '@/lib/utils';
import { Utensils, Calendar } from 'lucide-react';

export default async function AccountAnnadanamPage() {
  const sponsorships = await annadanamService.getDevoteeSponsorships();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3">
          <AccountSidebar />
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
            <div>
              <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-gold-lighter">
                My Annadanam Sponsorships
              </h1>
              <p className="text-xs sm:text-sm text-ivory/70">
                Tracking your daily meal offerings to visiting pilgrims
              </p>
            </div>
            <Link href="/annadanam">
              <Button variant="gold" size="sm" className="font-bold">
                <Utensils className="w-3.5 h-3.5 mr-1" /> Sponsor Annadanam
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {sponsorships.map((s) => (
              <Card key={s.id} variant="sacred" className="p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gold tracking-widest block">
                      {s.id}
                    </span>
                    <h4 className="font-cinzel text-base font-bold text-ivory mt-0.5">
                      {s.tier === 'morning' ? 'Morning Maha Prasadam Seva' : 'Full Day Annadanam'}
                    </h4>
                  </div>
                  <Badge variant="success" size="sm">Confirmed</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-ivory/60 block">Auspicious Date:</span>
                    <strong className="text-ivory">{s.date}</strong>
                  </div>
                  <div>
                    <span className="text-ivory/60 block">In Memory Of:</span>
                    <strong className="text-gold-light">{s.inMemoryOf || 'Family Prosperity'}</strong>
                  </div>
                  <div>
                    <span className="text-ivory/60 block">Meals Provided:</span>
                    <strong className="text-emerald-400">~{s.mealsServed.toLocaleString()} Devotees</strong>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
