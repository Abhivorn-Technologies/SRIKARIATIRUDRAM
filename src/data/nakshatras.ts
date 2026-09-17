import { NAKSHATRAS } from '@/lib/constants';
import { scheduleList } from '@/data/schedule';

export type DayType = 'REGULAR' | 'VISESHA' | 'KALYANAM' | 'CONCLUDING';

export interface ApplicableSevaOption {
  id: string;
  slug: string;
  title: string;
  titleTe: string;
  titleHi: string;
  price: number;
  description: string;
  descriptionTe: string;
  descriptionHi: string;
  isSpecial?: boolean;
  tag?: string;
  tagTe?: string;
  tagHi?: string;
}

export interface NakshatraBookingInfo {
  nakshatraId: string;
  nakshatra: string;
  nakshatraTe: string;
  nakshatraHi: string;
  rasi: string;
  rasiTe: string;
  rasiHi: string;
  dayNumber: number;
  date: string;
  dateTe: string;
  dateHi: string;
  dayOfWeek: string;
  dayOfWeekTe: string;
  dayOfWeekHi: string;
  dayType: DayType;
  dayTypeLabel: string;
  dayTypeLabelTe: string;
  dayTypeLabelHi: string;
  specialSeva: string | null;
  specialSevaTe: string | null;
  specialSevaHi: string | null;
  programmeHighlights?: string[];
  availableSevas: ApplicableSevaOption[];
}

export interface ProgrammeDayOption {
  id: string;
  dayNumber: number;
  nameEn: string;
  nameTe: string;
  nameHi: string;
  rasi: string;
  rasiTe: string;
  date: string;
  dateTe: string;
  isSpecial: boolean;
  dayType: DayType;
  dayTypeLabel: string;
}

// 28 Complete Programme Days derived from the centralized 28-day schedule
export const PROGRAMME_28_DAYS: ProgrammeDayOption[] = scheduleList.map((d) => {
  const cleanNak = d.nakshatra.replace(/ Nakshatram/i, '').replace(/ Nakshatra/i, '').trim();
  const cleanNakTe = d.nakshatraTe.replace(/ నక్షత్రం/i, '').replace(/ నక్షత్రము/i, '').trim();

  let dayType: DayType = 'REGULAR';
  let dayTypeLabel = 'REGULAR DAY';

  if (d.dayNumber === 28) {
    dayType = 'CONCLUDING';
    dayTypeLabel = 'GRAND CONCLUDING DAY';
  } else if (d.dayNumber === 25) {
    dayType = 'KALYANAM';
    dayTypeLabel = 'SPECIAL KALYANAM DAY';
  } else if (d.dayNumber === 2 || d.dayNumber === 11 || d.dayNumber === 20) {
    dayType = 'VISESHA';
    dayTypeLabel = 'SARPA SUKTA HOMAM';
  } else if (d.dayNumber === 3 || d.dayNumber === 12 || d.dayNumber === 21) {
    dayType = 'VISESHA';
    dayTypeLabel = 'CHANDI HOMAM';
  } else if (d.dayNumber === 6) {
    dayType = 'VISESHA';
    dayTypeLabel = 'ASLESHA BALI';
  } else if (d.dayNumber === 1) {
    dayType = 'REGULAR';
    dayTypeLabel = 'OPENING DAY';
  }

  return {
    id: `day-${d.dayNumber}-${cleanNak.toLowerCase()}`,
    dayNumber: d.dayNumber,
    nameEn: cleanNak,
    nameTe: cleanNakTe,
    nameHi: d.nakshatraHi ? d.nakshatraHi.replace(/ नक्षत्र/i, '') : cleanNak,
    rasi: d.rasi,
    rasiTe: d.rasiTe,
    date: d.date,
    dateTe: d.dateTe,
    isSpecial: d.dayNumber === 28 || d.dayNumber === 25 || d.dayNumber === 2 || d.dayNumber === 3 || d.dayNumber === 6 || d.dayNumber === 11 || d.dayNumber === 12 || d.dayNumber === 20 || d.dayNumber === 21,
    dayType,
    dayTypeLabel,
  };
});

export const nakshatraDetails = NAKSHATRAS.map((n) => {
  const matchedSchedule = scheduleList.find(
    (s) => s.nakshatra.toLowerCase().replace(/[^a-z]/g, '') === n.nameEn.toLowerCase().replace(/[^a-z]/g, '')
  ) || scheduleList[0];

  return {
    ...n,
    dayNumber: matchedSchedule.dayNumber,
    date: `Day ${matchedSchedule.dayNumber} (${matchedSchedule.date})`,
    dateTe: `${matchedSchedule.dayNumber}వ రోజు (${matchedSchedule.dateTe})`,
    presidingDeity: `Lord Shiva as Sri ${n.nameEn} Nakshatreswara`,
    presidingDeityTe: `శ్రీ ${n.nameTe} నక్షత్రేశ్వర స్వామి`,
    tree: "Sacred Vriksha",
    animal: "Sacred Vahana",
    bird: "Sacred Pakshi",
    recommendedSevaSlug: "nakshatra-shanthi",
    homamName: `${n.nameEn} Nakshatra Japam & Shanthi`,
    homamNameTe: `${n.nameTe} నక్షత్ర జపం & శాంతి`,
    significance: `Performing Nakshatra Japam & Shanti on Day ${matchedSchedule.dayNumber} (${matchedSchedule.date}) brings divine blessings, removes planetary doshas, and grants long life and prosperity to persons born under ${n.nameEn} star.`,
    significanceTe: `${matchedSchedule.dateTe} నాడు ${n.nameTe} నక్షత్రం రోజున పూజలు నిర్వహించడం ద్వారా గ్రహదోషాలు తొలగి, సర్వతోముఖాభివృద్ధి కలుగుతుంది.`
  };
});

// Centralized Helper: Get Exact Nakshatra-wise Seva Booking Options
export function getNakshatraBookingOptions(identifier: string | number): NakshatraBookingInfo {
  let matchedDay = scheduleList[0];

  if (typeof identifier === 'number') {
    matchedDay = scheduleList.find((d) => d.dayNumber === identifier) || scheduleList[0];
  } else if (typeof identifier === 'string') {
    const raw = identifier.trim().toLowerCase();
    
    // Check direct day number or concluding aliases
    if (raw === '28' || raw === 'day-28' || raw === 'day28' || raw.includes('concluding') || raw === 'rohini-28' || raw === 'rohini - day 28') {
      matchedDay = scheduleList.find((d) => d.dayNumber === 28) || scheduleList[27];
    } else if (raw === '1' || raw === 'day-1' || raw === 'day1' || raw === 'opening' || raw === 'rohini-1' || raw === 'rohini - day 1') {
      matchedDay = scheduleList.find((d) => d.dayNumber === 1) || scheduleList[0];
    } else if (!isNaN(parseInt(raw, 10)) && parseInt(raw, 10) >= 1 && parseInt(raw, 10) <= 28) {
      matchedDay = scheduleList.find((d) => d.dayNumber === parseInt(raw, 10)) || scheduleList[0];
    } else {
      const cleanInput = raw.replace(/[^a-z]/g, '');
      
      // Alias normalization for different star spellings
      const aliasMap: Record<string, string> = {
        'ashlesha': 'aslesha',
        'arudra': 'ardra',
        'sathabhisha': 'satabhisham',
        'sathabhishekam': 'satabhisham',
        'shatabhisha': 'satabhisham',
        'satabhisha': 'satabhisham',
        'shravanam': 'shravana',
        'sravana': 'shravana',
        'krithika': 'krittika',
        'aswini': 'ashwini',
        'hastha': 'hasta',
        'chitra': 'chitta',
        'visakha': 'vishakha',
        'jyeshtha': 'jyeshta',
        'mula': 'moola',
        'poorvashada': 'purvashada',
        'uttarashadha': 'uttarashada',
        'poorvabhadrapada': 'purvabhadrapada',
        'uttarabhadrapada': 'uttarabhadrapada',
        'revati': 'revathi',
        'pubba': 'purvaphalguni',
        'makha': 'magha',
        'pushyami': 'pushya',
      };

      const normalized = aliasMap[cleanInput] || cleanInput;

      // When searching by name "Rohini" without explicit day, prioritize Day 1 (Opening Day)
      // unless specifically asked for concluding or day 28
      const found = scheduleList.find((d) => {
        const cleanDayNak = d.nakshatra.toLowerCase().replace(/[^a-z]/g, '');
        const normDayNak = aliasMap[cleanDayNak] || cleanDayNak;
        return normDayNak === normalized || cleanDayNak === normalized || cleanDayNak.includes(normalized) || normalized.includes(cleanDayNak);
      });

      if (found) {
        matchedDay = found;
      }
    }
  }

  const dayNum = matchedDay.dayNumber;

  // 1. BASE SEVAS (Present for regular and special days 1–27)
  const baseSevas: ApplicableSevaOption[] = [
    {
      id: "ati-rudram-donation",
      slug: "ati-rudram-donation",
      title: "Ati Rudram Donation",
      titleTe: "అతి రుద్రం పవిత్ర విరాళం",
      titleHi: "अति रुद्रम दान",
      price: 216,
      description: "Support the sacred Srikari Ati Rudra Mahayajnam through this contribution.",
      descriptionTe: "ఈ పవిత్ర విరాళం ద్వారా శ్రీకరీ అతిరుద్ర మహాయజ్ఞ నిర్వహణలో భాగస్వామ్యం పొందండి.",
      descriptionHi: "इस पावन योगदान के माध्यम से श्रीकरी अति रुद्र महायज्ञ में सहयोग करें।",
      isSpecial: false,
    },
    {
      id: "ekadasa-rudra-abhishekam",
      slug: "ekadasa-rudra-abhishekam",
      title: "Ekadasa Rudra Abhishekam",
      titleTe: "ఏకాదశ రుద్ర అభిషేకం",
      titleHi: "एकादश रुद्र अभिषेक",
      price: 5116,
      description: "Participate in Ekadasa Rudra Abhishekam with Sankalpam.",
      descriptionTe: "సంకల్పంతో ఏకాదశ రుద్ర అభిషేకంలో పాల్గొనండి.",
      descriptionHi: "संकल्प के साथ एकादश रुद्र अभिषेक में भाग लें।",
      isSpecial: false,
    },
    {
      id: "sampoorna-nakshatra-shanthi",
      slug: "nakshatra-shanthi",
      title: "Sampoorna Nakshatra Shanthi",
      titleTe: "సంపూర్ణ నక్షత్ర శాంతి",
      titleHi: "संपूर्ण नक्षत्र शांति",
      price: 10116,
      description: "Complete Janma Nakshatra Shanthi performed with Sankalpam in the devotee's name.",
      descriptionTe: "భక్తుని పేరిట సంకల్పంతో నిర్వహించే సంపూర్ణ జన్మ నక్షత్ర శాంతి హోమం.",
      descriptionHi: "भक्त के नाम से संकल्प सहित संपूर्ण जन्म नक्षत्र शांति।",
      isSpecial: false,
    },
    {
      id: "one-day-annadanam",
      slug: "one-day-annadanam",
      title: "One-Day Annadanam",
      titleTe: "ఒక రోజు అన్నదానం",
      titleHi: "एक दिवसीय अन्नदान",
      price: 25116,
      description: "Sponsor Annadanam for one complete day of the Srikari Ati Rudra Mahayajnam.",
      descriptionTe: "శ్రీకరీ అతిరుద్ర మహాయజ్ఞంలో ఒక రోజు సంపూర్ణ అన్నదానాన్ని స్పాన్సర్ చేయండి.",
      descriptionHi: "श्रीकरी अति रुद्र महायज्ञ में एक संपूर्ण दिन के अन्नदान का प्रायोजन करें।",
      isSpecial: false,
    },
  ];

  let dayType: DayType = 'REGULAR';
  let dayTypeLabel = 'REGULAR NAKSHATRA DAY';
  let dayTypeLabelTe = 'సాధారణ నక్షత్ర దినం';
  let dayTypeLabelHi = 'नियमित नक्षत्र दिवस';
  let specialSevaName: string | null = null;
  let specialSevaNameTe: string | null = null;
  let specialSevaNameHi: string | null = null;
  let programmeHighlights: string[] | undefined = undefined;

  let availableSevas: ApplicableSevaOption[] = [...baseSevas];

  // =========================================================================
  // DAY 28 — GRAND CONCLUDING DAY (ROHINI)
  // MUST HAVE ONLY ONE BOOKABLE SEVA: Parvathi–Parameswara Maha Shanti Kalyanam (₹1,116)
  // No ₹216, No ₹10,116, No other sevas!
  // =========================================================================
  if (dayNum === 28) {
    dayType = 'CONCLUDING';
    dayTypeLabel = 'GRAND CONCLUDING DAY';
    dayTypeLabelTe = 'మహా ముగింపు దినం';
    dayTypeLabelHi = 'भव्य समापन दिवस';
    specialSevaName = 'Sri Parvathi–Parameswara Maha Shanti Kalyanam';
    specialSevaNameTe = 'శ్రీ పార్వతీ–పరమేశ్వర మహా శాంతి కళ్యాణం';
    specialSevaNameHi = 'श्री पार्वती-परमेश्वर महा शांति कल्याणम्';
    programmeHighlights = [
      'Rohini Japam & Maha Shanti',
      'Rudra Parayanam & Rudrabhishekam',
      'Parvathi–Parameswara Maha Shanti Kalyanam',
      'Maha Purnahuti / Poornahuti',
      'Veda Swasti',
      'Ashirvachanam',
      'Concluding Rohini Harathi & Blessings',
    ];

    // ONLY THIS ONE SEVA ALLOWED FOR DAY 28
    availableSevas = [
      {
        id: "parvathi-parameswara-kalyanam",
        slug: "parvathi-parameswara-kalyanam",
        title: "Parvathi–Parameswara Maha Shanti Kalyanam",
        titleTe: "శ్రీ పార్వతీ–పరమేశ్వర మహా శాంతి కళ్యాణం",
        titleHi: "श्री पार्वती-परमेश्वर महा शांति कल्याणम्",
        price: 1116,
        description: "Grand concluding celestial wedding of Goddess Parvathi and Lord Shiva with Maha Purnahuti.",
        descriptionTe: "మహా పూర్ణాహుతి సహిత శ్రీ పార్వతీ–పరమేశ్వర మహా శాంతి దివ్య కళ్యాణం.",
        descriptionHi: "महा पूर्णाहुति सहित श्री पार्वती-परमेश्वर महा शांति कल्याणोत्सव।",
        isSpecial: true,
        tag: "Grand Concluding Seva",
        tagTe: "మహా ముగింపు సేవ",
        tagHi: "महा समापन सेवा",
      },
    ];
  } 
  // SARPA SUKTA HOMAM: Day 2 (Mrigasira), Day 11 (Chitta), Day 20 (Dhanishta)
  else if (dayNum === 2 || dayNum === 11 || dayNum === 20) {
    dayType = 'VISESHA';
    dayTypeLabel = 'VISESHA NAKSHATRA SEVA DAY';
    dayTypeLabelTe = 'విశేష నక్షత్ర సేవ దినం';
    dayTypeLabelHi = 'विशेष नक्षत्र सेवा दिवस';
    specialSevaName = 'Sarpa Sukta Homam';
    specialSevaNameTe = 'సర్ప సూక్త హోమం';
    specialSevaNameHi = 'सर्प सूक्त होमम्';

    availableSevas.push({
      id: "sampoorna-visesha-nakshatra-seva-sarpa",
      slug: "sarpa-suktam-homam",
      title: "Sampoorna Visesha Nakshatra Seva",
      titleTe: "సంపూర్ణ విశేష నక్షత్ర సేవ",
      titleHi: "संपूर्ण विशेष नक्षत्र सेवा",
      price: 12116,
      description: "Nakshatra Shanthi with Sarpa Sukta Homam",
      descriptionTe: "సర్ప సూక్త హోమ సహిత నక్షత్ర శాంతి",
      descriptionHi: "सर्प सूक्त होम सहित नक्षत्र शांति",
      isSpecial: true,
      tag: "Special Homam Included",
      tagTe: "విశేష హోమం సహితం",
      tagHi: "विशेष होम सहित",
    });
  } 
  // CHANDI HOMAM: Day 3 (Ardra), Day 12 (Swathi), Day 21 (Satabhisham)
  else if (dayNum === 3 || dayNum === 12 || dayNum === 21) {
    dayType = 'VISESHA';
    dayTypeLabel = 'VISESHA NAKSHATRA SEVA DAY';
    dayTypeLabelTe = 'విశేష నక్షత్ర సేవ దినం';
    dayTypeLabelHi = 'विशेष नक्षत्र सेवा दिवस';
    specialSevaName = 'Chandi Homam';
    specialSevaNameTe = 'చండీ హోమం';
    specialSevaNameHi = 'चंडी होमम्';

    availableSevas.push({
      id: "sampoorna-visesha-nakshatra-seva-chandi",
      slug: "chandi-homam",
      title: "Sampoorna Visesha Nakshatra Seva",
      titleTe: "సంపూర్ణ విశేష నక్షత్ర సేవ",
      titleHi: "संपूर्ण विशेष नक्षत्र सेवा",
      price: 12116,
      description: "Nakshatra Shanthi with Chandi Homam",
      descriptionTe: "చండీ హోమ సహిత నక్షత్ర శాంతి",
      descriptionHi: "चंडी होम सहित नक्षत्र शांति",
      isSpecial: true,
      tag: "Special Homam Included",
      tagTe: "విశేష హోమం సహితం",
      tagHi: "विशेष होम सहित",
    });
  } 
  // ASLESHA BALI: Day 6 (Aslesha)
  else if (dayNum === 6) {
    dayType = 'VISESHA';
    dayTypeLabel = 'VISESHA NAKSHATRA SEVA DAY';
    dayTypeLabelTe = 'విశేష నక్షత్ర సేవ దినం';
    dayTypeLabelHi = 'विशेष नक्षत्र सेवा दिवस';
    specialSevaName = 'Aslesha Bali';
    specialSevaNameTe = 'ఆశ్లేష బలి';
    specialSevaNameHi = 'आश्लेषा बलि';

    availableSevas.push({
      id: "sampoorna-visesha-nakshatra-seva-aslesha",
      slug: "ashlesha-bali",
      title: "Sampoorna Visesha Nakshatra Seva",
      titleTe: "సంపూర్ణ విశేష నక్షత్ర సేవ",
      titleHi: "संपूर्ण विशेष नक्षत्र सेवा",
      price: 12116,
      description: "Nakshatra Shanthi with Aslesha Bali",
      descriptionTe: "ఆశ్లేష బలి సహిత నక్షత్ర శాంతి",
      descriptionHi: "आश्लेषा बलि सहित नक्षत्र शांति",
      isSpecial: true,
      tag: "Special Remedial Seva",
      tagTe: "విశేష పరిహార సేవ",
      tagHi: "विशेष शांति सेवा",
    });
  } 
  // SUBRAMANYESWARA KALYANAM: Day 25 (Krittika)
  else if (dayNum === 25) {
    dayType = 'KALYANAM';
    dayTypeLabel = 'SPECIAL KALYANAM DAY';
    dayTypeLabelTe = 'విశేష కళ్యాణ దినం';
    dayTypeLabelHi = 'विशेष कल्याण दिवस';
    specialSevaName = 'Sri Valli–Devasena Sametha Subramanyeswara Swamy Kalyanam';
    specialSevaNameTe = 'శ్రీ వల్లీ–దేవసేన సమేత సుబ్రహ్మణ్యేశ్వర స్వామి కళ్యాణం';
    specialSevaNameHi = 'श्री वल्ली-देवसेना समेत सुब्रह्मण्येश्वर स्वामी कल्याणम्';

    availableSevas.push({
      id: "valli-devasena-subramanyeswara-kalyanam",
      slug: "valli-devasena-subramanyeswara-kalyanam",
      title: "Sri Valli–Devasena Sametha Subramanyeswara Swamy Kalyanam",
      titleTe: "శ్రీ వల్లీ–దేవసేన సమేత సుబ్రహ్మణ్యేశ్వర స్వామి కళ్యాణం",
      titleHi: "श्री वल्ली-देवसेना समेत सुब्रह्मण्येश्वर स्वामी कल्याणम्",
      price: 1116,
      description: "Grand celestial wedding celebration of Lord Subramanya with Goddesses Valli and Devasena on Krittika.",
      descriptionTe: "కృత్తికా నక్షత్ర దినమున వల్లీ-దేవసేన సమేత శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి దివ్య కళ్యాణోత్సవం.",
      descriptionHi: "कृत्तिका नक्षत्र पर श्री वल्ली-देवसेना समेत सुब्रह्मण्येश्वर स्वामी का दिव्य कल्याणोत्सव।",
      isSpecial: true,
      tag: "Separate Kalyanam Seva",
      tagTe: "ప్రత్యేక కళ్యాణ సేవ",
      tagHi: "विशेष कल्याण सेवा",
    });
  } 
  // OPENING DAY: Day 1 (Rohini)
  else if (dayNum === 1) {
    dayType = 'REGULAR';
    dayTypeLabel = 'REGULAR / OPENING DAY';
    dayTypeLabelTe = 'సాధారణ / ప్రారంభ దినం';
    dayTypeLabelHi = 'उद्घाटन दिवस';
    specialSevaName = null;
    specialSevaNameTe = null;
    specialSevaNameHi = null;
  }

  const cleanDayNak = matchedDay.nakshatra.replace(/ Nakshatram/i, '').replace(/ Nakshatra/i, '').trim();

  return {
    nakshatraId: dayNum === 28 ? 'day-28-rohini' : `day-${dayNum}-${cleanDayNak.toLowerCase()}`,
    nakshatra: cleanDayNak,
    nakshatraTe: matchedDay.nakshatraTe.replace(/ నక్షత్రం/i, '').replace(/ నక్షత్రము/i, '').trim(),
    nakshatraHi: (matchedDay.nakshatraHi || cleanDayNak).replace(/ नक्षत्र/i, '').trim(),
    rasi: matchedDay.rasi,
    rasiTe: matchedDay.rasiTe,
    rasiHi: matchedDay.rasiHi || matchedDay.rasi,
    dayNumber: matchedDay.dayNumber,
    date: matchedDay.date,
    dateTe: matchedDay.dateTe,
    dateHi: matchedDay.dateHi || matchedDay.date,
    dayOfWeek: matchedDay.dayOfWeek,
    dayOfWeekTe: matchedDay.dayOfWeekTe,
    dayOfWeekHi: matchedDay.dayOfWeekHi || matchedDay.dayOfWeek,
    dayType,
    dayTypeLabel,
    dayTypeLabelTe,
    dayTypeLabelHi,
    specialSeva: specialSevaName,
    specialSevaTe: specialSevaNameTe,
    specialSevaHi: specialSevaNameHi,
    programmeHighlights,
    availableSevas: availableSevas.sort((a, b) => a.price - b.price),
  };
}
