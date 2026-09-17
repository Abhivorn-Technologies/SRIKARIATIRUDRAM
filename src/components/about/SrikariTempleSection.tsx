'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Landmark, Users, Award } from 'lucide-react';

export function SrikariTempleSection() {
  const locale = useLocale();
  const isTe = locale === 'te';
  const isHi = locale === 'hi';

  const advisoryBoardMembers = [
    {
      name: 'Vidwan U. Kiran Kumar Sarma',
      nameTe: 'విద్వాన్ యు. కిరణ్ కుమార్ శర్మ',
      nameHi: 'विद्वान यू. किरण कुमार शर्मा',
      location: 'Kanchi',
      locationTe: 'కాంచీపురం',
      locationHi: 'कांचीपुरम',
      role: 'Vedic Scholar',
      roleTe: 'వేద పండితులు',
      roleHi: 'वैदिक विद्वान',
    },
    {
      name: 'Dr. Umamaheswara Sarma',
      nameTe: 'డాక్టర్ ఉమామహేశ్వర శర్మ',
      nameHi: 'डॉ. उमामहेश्वर शर्मा',
      location: 'Hyderabad',
      locationTe: 'హైదరాబాద్',
      locationHi: 'हैदराबाद',
      role: 'Veda Pandit, Keesara Veda Patasala',
      roleTe: 'వేద పండితులు, కీసర వేద పాఠశాల',
      roleHi: 'वेद पंडित, कीसरा वेद पाठशाला',
    },
    {
      name: 'Dr. Vamsi Krishna Ghanapati',
      nameTe: 'డాక్టర్ వంశీ కృష్ణ ఘనాపాఠి',
      nameHi: 'डॉ. वंशी कृष्ण घनापाठी',
      location: 'Datta Peetham, Mysore',
      locationTe: 'దత్త పీఠం, మైసూర్',
      locationHi: 'दत्त पीठम, मैसूर',
      role: 'Veda Pandit & Scholar',
      roleTe: 'వేద పండితులు & పండితవర్యులు',
      roleHi: 'वेद पंडित एवं विद्वान',
    },
    {
      name: 'Vidwan Prakhya Subramanyeswara Sarma',
      nameTe: 'విద్వాన్ ప్రాఖ్య సుబ్రహ్మణ్యేశ్వర శర్మ',
      nameHi: 'विद्वान प्राख्या सुब्रह्मण्येश्वर शर्मा',
      location: 'Hyderabad',
      locationTe: 'హైదరాబాద్',
      locationHi: 'हैदराबाद',
      role: 'Vedic Scholar',
      roleTe: 'వేద పండితులు',
      roleHi: 'वैदिक विद्वान',
    },
    {
      name: 'Sri V. Ananth Swaroop',
      nameTe: 'శ్రీ వి. అనంత స్వరూప్',
      nameHi: 'श्री वी. अनंत स्वरूप',
      location: 'Kakinada',
      locationTe: 'కాకినాడ',
      locationHi: 'काकीनाडा',
      role: 'Devotee & Patron',
      roleTe: 'భక్తులు & పోషకులు',
      roleHi: 'भक्त एवं संरक्षक',
    },
    {
      name: 'Dr. K. N. J. Srinivas',
      nameTe: 'డాక్టర్ కె. ఎన్. జె. శ్రీనివాస్',
      nameHi: 'डॉ. के. एन. जे. श्रीनिवास',
      location: 'North Carolina, USA',
      locationTe: 'నార్త్ కరోలినా, అమెరికా',
      locationHi: 'नॉर्थ कैरोलिना, अमेरिका',
      role: 'Distinguished Professional & Devotee',
      roleTe: 'ప్రముఖ నిపుణులు & భక్తులు',
      roleHi: 'विशिष्ट पेशेवर एवं भक्त',
    },
    {
      name: 'Smt. Chidrupi Gogulapati',
      nameTe: 'శ్రీమతి చిద్రూపి గోగులపాటి',
      nameHi: 'श्रीमती चिद्रूपी गोगुलापाटी',
      location: 'USA',
      locationTe: 'అమెరికా',
      locationHi: 'अमेरिका',
      role: 'Devotee & Patron',
      roleTe: 'భక్తురాండ్రు & పోషకులు',
      roleHi: 'भक्त एवं संरक्षक',
    },
    {
      name: 'Smt. J. Arunasri',
      nameTe: 'శ్రీమతి జె. అరుణశ్రీ',
      nameHi: 'श्रीमती जे. अरुणाश्री',
      location: 'Bengaluru',
      locationTe: 'బెంగళూరు',
      locationHi: 'बेंगलुरु',
      role: 'Devotee & Patron',
      roleTe: 'భక్తురాండ్రు & పోషకులు',
      roleHi: 'भक्त एवं संरक्षक',
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
                {isTe ? 'పవిత్ర క్షేత్రం & మూల పునాది' : isHi ? 'पवित्र तीर्थ एवं संस्थान' : 'Sacred Sanctuary & Foundation'}
              </span>
            </div>

            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black tracking-tight leading-tight text-[#F2C14E]">
              {isTe ? 'శ్రీకరీ ఆలయం గురించి' : isHi ? 'श्रीकरी मंदिर के विषय में' : 'ABOUT SRIKARI TEMPLE'}
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D6A532] to-transparent mx-auto mt-2" />
          </div>

          {/* Temple Information Content Cards */}
          <div className="bg-[#2B0005]/90 border border-[#D6A532]/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-black/50 backdrop-blur-md space-y-5 text-sm sm:text-base md:text-[16.5px] text-[#FAF4E6]/90 leading-relaxed font-sans">
            <p>
              {isTe
                ? 'శ్రీకరీ దేవి ఆలయం 2009 లో స్థాపించబడింది. ఇది తెలంగాణ రాష్ట్రం, హైదరాబాద్‌లోని మేడ్చల్ రోడ్, MLRIT కళాశాల పక్కన గల బాసరగాడి, నందనవనం లేఅవుట్, ప్లాట్ నం. 42, శ్రీకరీ పీఠంలో నెలకొని ఉంది.'
                : isHi
                ? 'श्रीकरी देवी देवालय की स्थापना 2009 में हुई। यह तेलंगाना राज्य के हैदराबाद स्थित मेडचल रोड पर एमएलआरआईटी कॉलेज के पास बासरागाडी, नंदनवनम लेआउट, प्लॉट नं. 42, श्रीकरी पीठम में स्थित है।'
                : 'Srikari Devi Aalayam, established in 2009, is located at Srikari Peetham, Plot No. 42, Nandanavanam Layout, Basaragadi, beside MLRIT, Medchal Road, Hyderabad, Telangana.'}
            </p>

            <p>
              {isTe
                ? 'ఈ ఆలయం శ్రీ హంపీ విరూపాక్ష విద్యారణ్య సంస్థాన పీఠాధిపతులు పరమపూజ్య జగద్గురు శ్రీ శ్రీ శ్రీ విద్యారణ్య భారతీ స్వామీజీ వారి దివ్య ఆశీస్సులు, మార్గదర్శకత్వంలో మరియు శ్రీ హంపీ విరూపాక్ష మఠం ఆధ్యాత్మిక పర్యవేక్షణలో నిర్వహించబడుతోంది.'
                : isHi
                ? 'यह मंदिर श्री हम्पी विरूपाक्ष विद्यारण्य संस्थान पीठ के पीठाधिपति परमपूज्य जगद्गुरु श्री श्री श्री विद्यारण्य भारती स्वामीजी के दिव्य आशीर्वाद एवं मार्गदर्शन तथा श्री हम्पी विरूपाक्ष मठ के आध्यात्मिक संरक्षण में संचालित होता है।'
                : 'The temple functions under the spiritual guidance and blessings of His Holiness Jagadguru Sri Sri Sri Vidyaranya Bharathi Swamiji, Pontiff of the Sri Hampi Virupaksha Vidyaranya Samsthana Peetham, and under the spiritual oversight of Sri Hampi Virupaksha Matham.'}
            </p>

            <p>
              {isTe
                ? 'వేద సంప్రదాయాల రక్షణ, సనాతన ధర్మ ప్రచారం, ఆధ్యాత్మిక మరియు సేవా కార్యక్రమాల నిర్వహణతో పాటు లోకకళ్యాణ మహోద్దేశంతో వ్యవస్థాపక ధర్మకర్తలు శ్రీ జి. శ్రీకాంత్ మరియు శ్రీమతి జ్యోత్స్న గోగులపాటి గారి సంకల్పం మరియు భక్తిశ్రద్ధలతో ఈ ఆలయం రూపుదిద్దుకుంది.'
                : isHi
                ? 'वैदिक परंपराओं के संरक्षण, सनातन धर्म के प्रचार, आध्यात्मिक एवं धर्मार्थ गतिविधियों तथा लोककल्याण के पावन उद्देश्य हेतु संस्थापक ट्रस्टी श्री जी. श्रीकांत एवं श्रीमती ज्योत्स्ना गोगुलापाटी के संकल्प और भक्तिभाव से इस मंदिर की स्थापना हुई।'
                : 'The temple was founded through the vision and devotion of Sri G. Srikanth and Smt. Jyotsna Gogulapati, the founding trustees, with the objective of preserving Vedic traditions, promoting Sanatana Dharma, conducting spiritual and charitable activities, and serving the cause of Lokakalyanam.'}
            </p>

            <p>
              {isTe
                ? 'శ్రీకరీ సేవా సమితి ఆలయ ఆధ్యాత్మిక, వైదిక, దానధర్మాలు మరియు సామాజిక సేవా కార్యక్రమాలను సమర్థవంతంగా నిర్వహించే అనుబంధ సేవా సంస్థ.'
                : isHi
                ? 'श्रीकरी सेवा समिति मंदिर की आध्यात्मिक, वैदिक, धर्मार्थ तथा सामाजिक सेवा गतिविधियों का आयोजन करने वाली सम्बद्ध संस्था है।'
                : 'Srikari Seva Samiti is the associated service organisation supporting and organising the temple’s devotional, Vedic, charitable, and community service activities.'}
            </p>

            <p>
              {isTe
                ? 'సనాతన గురు సంప్రదాయ ప్రతిష్ఠానం ఛైర్మన్ డాక్టర్ వంశీ కృష్ణ ఘనాపాఠి గారు ఆలయ ఆధ్యాత్మిక, వైదిక మరియు నిర్వాహక అంశాలలో మార్గదర్శకులుగా వ్యవహరిస్తున్నారు.'
                : isHi
                ? 'सनातन गुरु संप्रदाय प्रतिष्ठानम के अध्यक्ष डॉ. वंशी कृष्ण घनापाठीजी मंदिर के संस्थागत, वैदिक तथा प्रबंधकीय विषयों में मार्गदर्शक की भूमिका निभा रहे हैं।'
                : 'Dr. Vamshi Krishna Ghanapathi, Chairman of Sanatana Guru Sampradaya Pratishthanam, serves as Mentor and Guide, providing guidance on institutional, Vedic, and management-related matters.'}
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
                {isTe ? 'మార్గదర్శకత్వం & యాజమాన్యం' : isHi ? 'मार्गदर्शन एवं प्रबंधन' : 'Guidance & Governance'}
              </span>
            </div>

            <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-[#F2C14E] uppercase">
              {isTe ? 'సలహా మండలి' : isHi ? 'सलाहकार समिति' : 'ADVISORY BOARD'}
            </h3>

            <p className="text-sm sm:text-base text-[#FAF4E6]/90 font-sans leading-relaxed max-w-4xl">
              {isTe
                ? 'శ్రీకరీ ఆలయ ఆధ్యాత్మిక సేవా కార్యక్రమాలు మరియు భవిష్యత్ అభివృద్ధికి భారతదేశం మరియు అమెరికా సంయుక్త రాష్ట్రాలకు చెందిన ప్రముఖ వేద పండితులు, నిపుణులు మరియు భక్తులతో కూడిన సలహా మండలి మార్గదర్శకత్వం వహిస్తోంది:'
                : isHi
                ? 'श्रीकरी मंदिर की आध्यात्मिक गतिविधियों तथा भावी विकास हेतु भारत एवं संयुक्त राज्य अमेरिका के प्रतिष्ठित वैदिक विद्वानों, पेशेवरों एवं भक्तों की सलाहकार समिति मार्गदर्शन प्रदान करती है:'
                : 'The activities and future development of Srikari Temple are supported by an Advisory Board comprising distinguished Vedic scholars, professionals, and devotees from India and the United States:'}
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
                    {isTe ? member.nameTe : isHi ? member.nameHi : member.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm text-[#F2C14E]/90 font-sans">
                    <span className="font-medium text-[#FAF4E6]/80">{isTe ? member.roleTe : isHi ? member.roleHi : member.role}</span>
                    <span className="text-[#D6A532]">•</span>
                    <span className="font-semibold text-[#F2C14E]">{isTe ? member.locationTe : isHi ? member.locationHi : member.location}</span>
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
