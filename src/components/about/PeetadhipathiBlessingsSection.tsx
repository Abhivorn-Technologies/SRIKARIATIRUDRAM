'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function PeetadhipathiBlessingsSection() {
  const [imgError, setImgError] = useState(false);
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  return (
    <section className="w-full bg-gradient-to-b from-[#2B0005] via-[#3D0008] to-[#230206] py-14 sm:py-16 lg:py-20 border-b border-[#D6A532]/30 relative overflow-hidden font-sans">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D6A532]/10 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Top Header Badge */}
        <div className="text-center space-y-3">
          <Badge variant="gold" size="lg" className="font-cinzel tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-gold fill-gold" />
            {isTe
              ? 'దివ్య ఆధ్యాత్మిక మార్గదర్శకత్వం & ఆశీర్వచనాలు'
              : isHi
              ? 'दिव्य आध्यात्मिक मार्गदर्शन एवं आशीर्वाद'
              : 'Divine Spiritual Guidance & Blessings'}
          </Badge>

          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-lighter via-ivory to-gold tracking-wide uppercase">
            {isTe ? 'పీఠాధిపతి ఆశీర్వచనాలు' : isHi ? 'पीठाधिपति आशीर्वाद' : 'PEETADHIPATHI BLESSINGS'}
          </h2>
        </div>

        {/* Feature Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-r from-[#240006]/95 via-[#3B0009]/90 to-[#240006]/95 border-2 border-[#D6A532]/50 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
        >
          {/* Swamiji Photo Frame */}
          <div className="shrink-0 relative group">
            <div className="w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[420px] rounded-2xl p-2 bg-gradient-to-b from-[#F2C14E] via-[#D6A532] to-[#8B1E2D] shadow-[0_0_25px_rgba(214,165,50,0.35)] relative overflow-hidden">
              <div className="w-full h-full rounded-xl bg-[#1A0004] relative overflow-hidden flex flex-col items-center justify-center text-center">
                {!imgError ? (
                  /* Standard img tag for direct, unblocked rendering */
                  <img
                    src="/assets/images/poojari.jpeg"
                    alt="His Holiness Sri Sri Sri Jagadguru Shankaracharya Sri Vidyaranya Bharathi Swamiji"
                    className="w-full h-full object-cover object-top rounded-xl group-hover:scale-105 transition-transform duration-500"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  /* Fallback View when image file is missing */
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#3A0008] to-[#1A0004] text-center space-y-3">
                    <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center shadow-inner">
                      <Crown className="w-10 h-10 text-gold-lighter" />
                    </div>
                    <span className="font-cinzel text-xs font-bold text-gold-light uppercase tracking-wider">
                      {isTe ? 'పరమపూజ్యులు' : isHi ? 'परमपूज्य' : 'His Holiness'}
                    </span>
                    <p className="text-[11px] text-ivory/70 font-sans">
                      {isTe
                        ? 'జగద్గురు శంకరాచార్య శ్రీ విద్యారణ్య భారతీ స్వామీజీ'
                        : isHi
                        ? 'जगद्गुरु शंकराचार्य श्री विद्यारण्य भारती स्वामीजी'
                        : 'Jagadguru Shankaracharya Sri Vidyaranya Bharathi Swamiji'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D6A532] via-[#F2C14E] to-[#D6A532] text-[#240006] font-cinzel text-xs font-black uppercase tracking-wider shadow-lg whitespace-nowrap z-20 border border-white/20">
              {isTe ? '57వ పీఠాధిపతులు' : isHi ? '57वें पीठाधिपति' : '57th Peetadhipathi'}
            </div>
          </div>

          {/* Text Bio */}
          <div className="space-y-4 text-center lg:text-left flex-1">
            <div>
              <span className="text-xs text-gold-light font-cinzel font-bold tracking-widest uppercase block mb-1">
                {isTe
                  ? 'శ్రీ హంపీ విరూపాక్ష విద్యారణ్య మహా సంస్థానం'
                  : isHi
                  ? 'श्री हम्पी विरूपाक्ष विद्यारण्य महा संस्थानम्'
                  : 'Sri Hampi Virupaksha Vidyaranya Maha Samsthanam'}
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-black text-ivory leading-tight">
                {isTe
                  ? 'పరమపూజ్య శ్రీ శ్రీ శ్రీ జగద్గురు శంకరాచార్య శ్రీ విద్యారణ్య భారతీ స్వామీజీ'
                  : isHi
                  ? 'परमपूज्य श्री श्री श्री जगद्गुरु शंकराचार्य श्री विद्यारण्य भारती स्वामीजी'
                  : 'His Holiness Sri Sri Sri Jagadguru Shankaracharya Sri Vidyaranya Bharathi Swamiji'}
              </h3>
            </div>

            <div className="w-20 h-1 bg-gradient-to-r from-gold via-gold-lighter to-transparent mx-auto lg:mx-0 rounded-full" />

            <p className="text-sm sm:text-base text-ivory/90 font-sans leading-relaxed text-justify lg:text-left">
              {isTe
                ? 'పరమపూజ్య శ్రీ శ్రీ శ్రీ జగద్గురు శంకరాచార్య శ్రీ విద్యారణ్య భారతీ స్వామీజీ జగద్గురు ఆదిశంకరాచార్యుల అద్వైత వేదాంత సంప్రదాయంలో వెలిగొందుతున్న శ్రీ హంపీ విరూపాక్ష విద్యారణ్య మహా సంస్థానానికి 57వ పీఠాధిపతులుగా విరాజిల్లుతున్నారు. వేద రక్షణ, సనాతన ధర్మ ప్రచారం, ఆలయ వైభవం మరియు ఆధ్యాత్మిక విజ్ఞాన వ్యాప్తికి వారు తమ అమూల్యమైన సేవలను అందిస్తున్నారు. స్వామీజీ వారి దివ్య ఆశీస్సులు, ధర్మబోధనలు భక్తులకు నిరంతరం ధర్మమార్గంలో నడిపించే దివ్యజ్యోతిగా నిలుస్తున్నాయి.'
                : isHi
                ? 'परमपूज्य श्री श्री श्री जगद्गुरु शंकराचार्य श्री विद्यारण्य भारती स्वामीजी जगद्गुरु आदिशंकराचार्य की अद्वैत वेदांत परंपरा में स्थापित श्री हम्पी विरूपाक्ष विद्यारण्य महा संस्थानम के 57वें पीठाधिपति हैं। आपने सनातन धर्म, वैदिक परंपराओं, मंदिर संस्कृति तथा आध्यात्मिक ज्ञान के संरक्षण एवं प्रचार-प्रसार हेतु अपना जीवन समर्पित किया है। पूज्य स्वामीजी के दिव्य आशीर्वाद एवं मार्गदर्शक प्रवचन भक्तों को निरंतर धर्म एवं भक्ति मार्ग पर चलने की प्रेरणा प्रदान करते हैं।'
                : 'His Holiness Sri Sri Sri Jagadguru Shankaracharya Sri Vidyaranya Bharathi Swamiji is the revered Peetadhipathi of Sri Hampi Virupaksha Vidyaranya Maha Samsthanam, a spiritual institution rooted in the Advaita Vedanta tradition of Jagadguru Adi Shankaracharya. He is recognized as the 57th Peetadhipathi of the Samsthanam and has dedicated his spiritual leadership to the preservation and propagation of Sanatana Dharma, Vedic traditions, temple worship and spiritual knowledge. Through his blessings, discourses and guidance, His Holiness continues to inspire devotees to follow the timeless principles of Dharma, devotion and spiritual discipline.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gold/15 border border-gold/30 text-gold-lighter text-xs font-semibold">
                {isTe ? '✨ అద్వైత వేదాంత సంప్రదాయం' : isHi ? '✨ अद्वैत वेदांत परंपरा' : '✨ Advaita Vedanta Tradition'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gold/15 border border-gold/30 text-gold-lighter text-xs font-semibold">
                {isTe ? '🏛️ హంపీ విరూపాక్ష సంస్థానం' : isHi ? '🏛️ हम्पी विरूपाक्ष संस्थानम्' : '🏛️ Hampi Virupaksha Samsthanam'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gold/15 border border-gold/30 text-gold-lighter text-xs font-semibold">
                {isTe ? '🕉️ సనాతన ధర్మ పరిరక్షణ' : isHi ? '🕉️ सनातन धर्म रक्षण' : '🕉️ Sanatana Dharma Protection'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
