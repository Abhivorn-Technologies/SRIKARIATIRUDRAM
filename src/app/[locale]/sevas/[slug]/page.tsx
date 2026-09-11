import { notFound } from 'next/navigation';
import Image from 'next/image';
import { sevaService } from '@/services/seva.service';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { formatCurrency } from '@/lib/utils';
import { AvailabilityBadge } from '@/components/sevas/SevaCard';
import { Clock, CheckCircle, ShieldCheck, Flame, ArrowLeft, Gift } from 'lucide-react';

export default async function SevaDetailPage({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  const seva = await sevaService.getSevaBySlug(slug);
  if (!seva) notFound();

  const isTe = locale === 'te';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Link */}
      <div>
        <Link
          href="/sevas"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-light hover:text-gold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Sevas
        </Link>
      </div>

      {/* Main Grid: Image & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image & Prasadam Kit */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-gold/50 shadow-gold-md bg-burgundy-deep">
            <Image
              src={seva.image}
              alt={seva.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute top-3 right-3">
              <AvailabilityBadge availability={seva.availability} slots={seva.availableSlots} />
            </div>
          </div>

          {/* Included Prasadam Card */}
          <Card variant="sacred" className="p-5 space-y-3 border-gold/30">
            <div className="flex items-center gap-2 text-gold font-cinzel font-bold text-sm">
              <Gift className="w-4 h-4" /> Consecrated Prasadam Kit Included
            </div>
            <ul className="space-y-2 text-xs text-ivory/80 font-sans">
              {(isTe ? seva.prasadamTe : seva.prasadam).map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right Column: Seva Details & Booking Box */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <Badge variant="gold" size="sm" className="uppercase tracking-widest font-bold">
              {seva.category.toUpperCase()} SEVA
            </Badge>
            <h1 className="font-cinzel text-2xl md:text-3xl font-black text-gold-lighter">
              {isTe ? seva.titleTe : seva.title}
            </h1>
            <p className="text-sm text-ivory/80 leading-relaxed font-sans">
              {isTe ? seva.fullDescTe : seva.fullDesc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-burgundy-deep border border-gold/25 space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between">
              <span className="text-ivory/60">Duration:</span>
              <span className="font-semibold text-ivory">{isTe ? seva.durationTe : seva.duration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ivory/60">Daily Timings:</span>
              <span className="font-semibold text-ivory">{isTe ? seva.timeTe : seva.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ivory/60">Slots Available:</span>
              <span className="font-bold text-emerald-400">{seva.availableSlots} remaining</span>
            </div>
          </div>

          {/* Spiritual Benefits */}
          <div className="space-y-2.5">
            <h4 className="font-cinzel text-sm font-bold text-gold-light uppercase tracking-wider">
              Spiritual Significance & Fruits
            </h4>
            <div className="space-y-2">
              {(isTe ? seva.benefitsTe : seva.benefits).map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-ivory/85 font-sans">
                  <CheckCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price & Booking Action */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/80 to-burgundy-deep border-2 border-gold/60 space-y-4 shadow-gold-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-ivory/60 uppercase font-sans tracking-widest block">
                  Prescribed Dakshina
                </span>
                <span className="font-cinzel text-3xl font-black text-gold">
                  {formatCurrency(seva.price)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-emerald-400 block font-semibold">
                  Digital Receipt Included
                </span>
              </div>
            </div>

            <Link href={`/special-seva-booking/day?seva=${seva.slug}`} className="block">
              <Button
                variant="gold"
                size="lg"
                className="w-full font-bold uppercase tracking-wider py-4 shadow-gold-lg"
              >
                <Flame className="w-4 h-4 mr-2" />
                Book This Seva Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
