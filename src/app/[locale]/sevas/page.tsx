import { Metadata } from 'next';
import { sevaService } from '@/services/seva.service';
import { SevaGrid } from '@/components/sevas/SevaGrid';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { Phone, Mail, MessageCircle, Flame, Sparkles, HeartHandshake } from 'lucide-react';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'sevas' });
  return {
    title: `${t('title')} | Srikari Ati Rudra Mahayagnam`,
    description: t('intro'),
  };
}

export default async function SevasPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'sevas' });
  const sevas = await sevaService.getAllSevas();

  return (
    <div className="min-h-screen bg-[#35030A] text-[#FFF8E8] py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* ============================================================ */}
        {/* 1. HERO SECTION                                              */}
        {/* ============================================================ */}
        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5A0714]/80 text-[#E8C76A] border border-[#D6A532]/40 shadow-[0_0_15px_rgba(214,165,50,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-[#E8C76A]" />
            <span className="font-cinzel text-xs font-bold uppercase tracking-widest">
              {t('badge')}
            </span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FAF4E6] via-[#F2C14E] to-[#D6A532] tracking-tight">
            {t('title')}
          </h1>

          <p className="font-cinzel text-base sm:text-lg md:text-xl font-bold text-[#E8C76A] tracking-wider uppercase">
            {t('subtitle')}
          </p>

          {/* ============================================================ */}
          {/* 2. SEVAS INTRODUCTION                                        */}
          {/* ============================================================ */}
          <div className="pt-2">
            <p className="text-sm sm:text-base text-[#FFF8E8]/85 font-sans leading-relaxed max-w-3xl mx-auto">
              {t('intro')}
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. 9 SEVA CARDS GRID                                         */}
        {/* ============================================================ */}
        <section aria-label="Approved Sevas List" className="w-full">
          <SevaGrid sevas={sevas} />
        </section>

        {/* ============================================================ */}
        {/* 4. PARTICIPATE / BOOK CTA                                    */}
        {/* ============================================================ */}
        <section className="relative rounded-3xl bg-gradient-to-r from-[#4A0A14] via-[#5A0714] to-[#35030A] border-2 border-[#D6A532]/60 p-8 sm:p-10 lg:p-12 text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#D6A532]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#D6A532]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#D6A532]/20 border border-[#D6A532]/50 text-[#F2C14E] mb-1">
              <Flame className="w-6 h-6" />
            </div>

            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FAF4E6] via-[#F2C14E] to-[#D6A532] tracking-wide">
              {t('ctaTitle')}
            </h2>

            <p className="text-sm sm:text-base text-[#FFF8E8]/90 font-sans leading-relaxed">
              {t('ctaSubtitle')}
            </p>

            <div className="pt-3">
              <Link href="/book-seva/date" className="inline-block">
                <button
                  type="button"
                  className="bg-gradient-to-r from-[#F2C14E] via-[#D6A532] to-[#B38728] hover:from-[#FFE484] hover:via-[#F2C14E] hover:to-[#D6A532] text-[#280509] font-cinzel font-black text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-[0_0_20px_rgba(214,165,50,0.45)] hover:shadow-[0_0_30px_rgba(214,165,50,0.75)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider select-none cursor-pointer"
                >
                  <span className="text-lg leading-none">🪔</span>
                  <span>{t('ctaButton')}</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. CONTACT / SUPPORT SECTION                                 */}
        {/* ============================================================ */}
        <section className="rounded-2xl bg-[#230206]/80 border border-[#D6A532]/30 p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1.5 max-w-2xl mx-auto">
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#F2C14E] tracking-wider uppercase">
              {t('supportTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-[#FFF8E8]/75 font-sans">
              {t('supportSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/919490462652"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-4 rounded-xl bg-[#35030A] border border-[#D6A532]/30 hover:border-[#D6A532] hover:bg-[#4A0A14] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] uppercase tracking-wider text-[#E8C76A]/80 font-sans block font-semibold">
                  {t('whatsappLabel')}
                </span>
                <span className="text-sm font-bold text-[#FFF8E8] font-sans">
                  9490462652
                </span>
              </div>
            </a>

            {/* Secondary Helpline */}
            <a
              href="tel:+917569253943"
              className="flex items-center gap-3.5 p-4 rounded-xl bg-[#35030A] border border-[#D6A532]/30 hover:border-[#D6A532] hover:bg-[#4A0A14] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#5A0714] border border-[#D6A532]/40 text-[#F2C14E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] uppercase tracking-wider text-[#E8C76A]/80 font-sans block font-semibold">
                  {t('phoneLabel')}
                </span>
                <span className="text-sm font-bold text-[#FFF8E8] font-sans">
                  7569253943
                </span>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:info@srikariatirudram.com"
              className="flex items-center gap-3.5 p-4 rounded-xl bg-[#35030A] border border-[#D6A532]/30 hover:border-[#D6A532] hover:bg-[#4A0A14] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#5A0714] border border-[#D6A532]/40 text-[#F2C14E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] uppercase tracking-wider text-[#E8C76A]/80 font-sans block font-semibold">
                  {t('emailLabel')}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#FFF8E8] font-sans truncate block">
                  info@srikariatirudram.com
                </span>
              </div>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
