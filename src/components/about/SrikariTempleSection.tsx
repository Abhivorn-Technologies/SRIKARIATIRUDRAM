'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, Users, Award, ShieldCheck, Sparkles } from 'lucide-react';

export function SrikariTempleSection() {
  const advisoryBoardMembers = [
    {
      name: 'Vidwan Kiran Sarma',
      location: 'Kanchi',
      role: 'Vedic Scholar',
    },
    {
      name: 'Dr. Umamaheswara Sarma',
      location: 'Hyderabad',
      role: 'Veda Pandit, Keesara Veda Patasala',
    },
    {
      name: 'Dr. K. N. J. Srinivas',
      location: 'North Carolina, USA',
      role: 'Distinguished Professional & Devotee',
    },
    {
      name: 'Smt. Chidrupi Gogulapati',
      location: 'USA',
      role: 'Devotee & Patron',
    },
    {
      name: 'Smt. J. Arunasri',
      location: 'Bengaluru',
      role: 'Devotee & Patron',
    },
  ];

  return (
    <section className="w-full bg-[#230206] py-14 sm:py-16 lg:py-20 border-b border-[#D6A532]/25 relative overflow-hidden font-sans">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D6A532]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#3A0008]/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-14">
        
        {/* ================================================== */}
        {/* 1. ABOUT SRIKARI TEMPLE SECTION */}
        {/* ================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2B0005] border border-[#D6A532]/60 shadow-sm">
              <Landmark className="w-3.5 h-3.5 text-[#F2C14E] shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold text-[#F2C14E] uppercase tracking-widest font-cinzel">
                Sacred Sanctuary &amp; Foundation
              </span>
            </div>

            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black tracking-tight leading-tight text-[#F2C14E]">
              ABOUT SRIKARI TEMPLE
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D6A532] to-transparent mx-auto mt-2" />
          </div>

          {/* Temple Information Content Cards */}
          <div className="bg-[#2B0005]/90 border border-[#D6A532]/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-black/50 backdrop-blur-md space-y-5 text-sm sm:text-base md:text-[16.5px] text-[#FAF4E6]/90 leading-relaxed font-sans">
            <p>
              Srikari Devi Aalayam, established in 2009, is located at Srikari Peetham, Plot No. 42, Nandanavanam Layout, Basaragadi, beside MLRIT, Medchal Road, Hyderabad, Telangana.
            </p>

            <p>
              The temple functions under the spiritual guidance and blessings of His Holiness Jagadguru Sri Sri Sri Vidyaranya Bharathi Swamiji, Pontiff of the Sri Hampi Virupaksha Vidyaranya Samsthana Peetham, and under the spiritual oversight of Sri Hampi Virupaksha Matham.
            </p>

            <p>
              The temple was founded through the vision and devotion of Sri G. Srikanth and Smt. Jyotsna Gogulapati, the founding trustees, with the objective of preserving Vedic traditions, promoting Sanatana Dharma, conducting spiritual and charitable activities, and serving the cause of Lokakalyanam.
            </p>

            <p>
              Srikari Seva Samiti is the associated service organisation supporting and organising the temple’s devotional, Vedic, charitable, and community service activities.
            </p>

            <p>
              Dr. Vamshi Krishna Ghanapathi, Chairman of Sanatana Guru Sampradaya Pratishthanam, serves as Mentor and Guide, providing guidance on institutional, Vedic, and management-related matters.
            </p>
          </div>
        </motion.div>

        {/* ================================================== */}
        {/* 2. ADVISORY BOARD SUBSECTION */}
        {/* ================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6 sm:space-y-8 pt-4 border-t border-[#D6A532]/20"
        >
          {/* Subsection Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#2B0005] border border-[#D6A532]/40">
              <Users className="w-3.5 h-3.5 text-[#F2C14E] shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold text-[#F2C14E] uppercase tracking-widest font-cinzel">
                Guidance &amp; Governance
              </span>
            </div>

            <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-[#F2C14E] uppercase">
              ADVISORY BOARD
            </h3>

            <p className="text-sm sm:text-base text-[#FAF4E6]/90 font-sans leading-relaxed max-w-4xl">
              The activities and future development of Srikari Temple are supported by an Advisory Board comprising distinguished Vedic scholars, professionals, and devotees from India and the United States:
            </p>
          </div>

          {/* Advisory Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {advisoryBoardMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#2B0005]/85 border border-[#D6A532]/35 shadow-md shadow-black/40 flex items-start gap-3.5 sm:gap-4 transition-all hover:border-[#D6A532]/60 hover:bg-[#2B0005]"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#3A0008] border border-[#D6A532]/40 flex items-center justify-center text-[#F2C14E] shrink-0 mt-0.5">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#F2C14E]" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h4 className="font-cinzel text-base sm:text-lg font-bold text-[#FAF4E6] leading-snug">
                    {member.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm text-[#F2C14E]/90 font-sans">
                    <span className="font-medium text-[#FAF4E6]/80">{member.role}</span>
                    <span className="text-[#D6A532]">•</span>
                    <span className="font-semibold text-[#F2C14E]">{member.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default SrikariTempleSection;
