export const SITE_NAME = "Srikari Ati Rudra Mahayagnam";

export const NAKSHATRAS = [
  { id: "rohini", nameEn: "Rohini", nameTe: "రోహిణి", nameHi: "रोहिणी", rasiEn: "Vrishabha", rasiTe: "వృషభం", lord: "Chandra", dayIndex: 1 },
  { id: "mrigasira", nameEn: "Mrigasira", nameTe: "మృగశిర", nameHi: "मृगशिरा", rasiEn: "Vrishabha / Mithuna", rasiTe: "వృషభం / మిథునం", lord: "Kuja", dayIndex: 2 },
  { id: "ardra", nameEn: "Ardra", nameTe: "ఆర్ద్ర", nameHi: "आर्द्रा", rasiEn: "Mithuna", rasiTe: "మిథునం", lord: "Rahu", dayIndex: 3 },
  { id: "punarvasu", nameEn: "Punarvasu", nameTe: "పునర్వసు", nameHi: "पुनर्वसु", rasiEn: "Mithuna / Karkataka", rasiTe: "మిథునం / కర్కాటకం", lord: "Guru", dayIndex: 4 },
  { id: "pushya", nameEn: "Pushya", nameTe: "పుష్యమి", nameHi: "पुष्य", rasiEn: "Karkataka", rasiTe: "కర్కాటకం", lord: "Sani", dayIndex: 5 },
  { id: "ashlesha", nameEn: "Ashlesha", nameTe: "ఆశ్లేష", nameHi: "आश्लेषा", rasiEn: "Karkataka", rasiTe: "కర్కాటకం", lord: "Budha", dayIndex: 6 },
  { id: "magha", nameEn: "Magha", nameTe: "మఖ", nameHi: "मघा", rasiEn: "Simha", rasiTe: "సింహం", lord: "Ketu", dayIndex: 7 },
  { id: "purva-phalguni", nameEn: "Purva Phalguni", nameTe: "పూర్వ ఫల్గుణి", nameHi: "पूर्वाफाल्गुनी", rasiEn: "Simha", rasiTe: "సింహం", lord: "Sukra", dayIndex: 8 },
  { id: "uttara-phalguni", nameEn: "Uttara Phalguni", nameTe: "ఉత్తర ఫల్గుణి", nameHi: "उत्तराफाल्गुनी", rasiEn: "Simha / Kanya", rasiTe: "సింహం / కన్య", lord: "Surya", dayIndex: 9 },
  { id: "hasta", nameEn: "Hasta", nameTe: "హస్త", nameHi: "हस्त", rasiEn: "Kanya", rasiTe: "కన్య", lord: "Chandra", dayIndex: 10 },
  { id: "chitta", nameEn: "Chitta", nameTe: "చిత్త", nameHi: "चित्रा", rasiEn: "Kanya / Tula", rasiTe: "కన్య / తుల", lord: "Kuja", dayIndex: 11 },
  { id: "swathi", nameEn: "Swathi", nameTe: "స్వాతి", nameHi: "स्वाति", rasiEn: "Tula", rasiTe: "తుల", lord: "Rahu", dayIndex: 12 },
  { id: "vishakha", nameEn: "Vishakha", nameTe: "విశాఖ", nameHi: "विशाखा", rasiEn: "Tula / Vrischika", rasiTe: "తుల / వృశ్చికం", lord: "Guru", dayIndex: 13 },
  { id: "anuradha", nameEn: "Anuradha", nameTe: "అనూరాధ", nameHi: "अनुराधा", rasiEn: "Vrischika", rasiTe: "వృశ్చికం", lord: "Sani", dayIndex: 14 },
  { id: "jyeshta", nameEn: "Jyeshta", nameTe: "జ్యేష్ఠ", nameHi: "ज्येष्ठा", rasiEn: "Vrischika", rasiTe: "వృశ్చికం", lord: "Budha", dayIndex: 15 },
  { id: "moola", nameEn: "Moola", nameTe: "మూల", nameHi: "मूल", rasiEn: "Dhanus", rasiTe: "ధనుస్సు", lord: "Ketu", dayIndex: 16 },
  { id: "purvashada", nameEn: "Purvashada", nameTe: "పూర్వాషాఢ", nameHi: "पूर्वाषाढ़ा", rasiEn: "Dhanus", rasiTe: "ధనుస్సు", lord: "Sukra", dayIndex: 17 },
  { id: "uttarashada", nameEn: "Uttarashada", nameTe: "ఉత్తరాషాఢ", nameHi: "उत्तराषाढ़ा", rasiEn: "Dhanus / Makara", rasiTe: "ధనుస్సు / మకరం", lord: "Surya", dayIndex: 18 },
  { id: "shravana", nameEn: "Shravana", nameTe: "శ్రవణం", nameHi: "श्रवण", rasiEn: "Makara", rasiTe: "మకరం", lord: "Chandra", dayIndex: 19 },
  { id: "dhanishta", nameEn: "Dhanishta", nameTe: "ధనిష్ఠ", nameHi: "धनिष्ठा", rasiEn: "Makara / Kumbha", rasiTe: "మకరం / కుంభం", lord: "Kuja", dayIndex: 20 },
  { id: "sathabhisha", nameEn: "Sathabhisha", nameTe: "శతాభిషం", nameHi: "शतभिषा", rasiEn: "Kumbha", rasiTe: "కుంభం", lord: "Rahu", dayIndex: 21 },
  { id: "purva-bhadrapada", nameEn: "Purva Bhadrapada", nameTe: "పూర్వాభాద్ర", nameHi: "पूर्वाभाद्रपद", rasiEn: "Kumbha / Meena", rasiTe: "కుంభం / మీనం", lord: "Guru", dayIndex: 22 },
  { id: "uttara-bhadrapada", nameEn: "Uttara Bhadrapada", nameTe: "ఉత్తరాభాద్ర", nameHi: "उत्तराभाद्रपद", rasiEn: "Meena", rasiTe: "మీనం", lord: "Sani", dayIndex: 23 },
  { id: "revathi", nameEn: "Revathi", nameTe: "రేవతి", nameHi: "रेवती", rasiEn: "Meena", rasiTe: "మీనం", lord: "Budha", dayIndex: 24 },
  { id: "krittika", nameEn: "Krittika", nameTe: "కృత్తిక", nameHi: "कृत्तिका", rasiEn: "Mesha / Vrishabha", rasiTe: "మేషం / వృషభం", lord: "Surya", dayIndex: 25 },
  { id: "bharani", nameEn: "Bharani", nameTe: "భరణి", nameHi: "भरणी", rasiEn: "Mesha", rasiTe: "మేషం", lord: "Sukra", dayIndex: 26 },
  { id: "ashwini", nameEn: "Ashwini", nameTe: "అశ్విని", nameHi: "अश्विनी", rasiEn: "Mesha", rasiTe: "మేషం", lord: "Ketu", dayIndex: 27 },
];

export const RASIS = [
  { id: "mesha", nameEn: "Mesha (Aries)", nameTe: "మేష రాశి", nameHi: "मेष राशि" },
  { id: "vrishabha", nameEn: "Vrishabha (Taurus)", nameTe: "వృషభ రాశి", nameHi: "वृषभ राशि" },
  { id: "mithuna", nameEn: "Mithuna (Gemini)", nameTe: "మిథున రాశి", nameHi: "मिथुन राशि" },
  { id: "karkataka", nameEn: "Karkataka (Cancer)", nameTe: "కర్కాటక రాశి", nameHi: "कर्क राशि" },
  { id: "simha", nameEn: "Simha (Leo)", nameTe: "సింహ రాశి", nameHi: "सिंह राशि" },
  { id: "kanya", nameEn: "Kanya (Virgo)", nameTe: "కన్య రాశి", nameHi: "कन्या राशि" },
  { id: "tula", nameEn: "Tula (Libra)", nameTe: "తుల రాశి", nameHi: "तुला राशि" },
  { id: "vrischika", nameEn: "Vrischika (Scorpio)", nameTe: "వృశ్చిక రాశి", nameHi: "वृश्चिक राशि" },
  { id: "dhanus", nameEn: "Dhanus (Sagittarius)", nameTe: "ధనుస్సు రాశి", nameHi: "धनु राशि" },
  { id: "makara", nameEn: "Makara (Capricorn)", nameTe: "మకర రాశి", nameHi: "मकर राशि" },
  { id: "kumbha", nameEn: "Kumbha (Aquarius)", nameTe: "కుంభ రాశి", nameHi: "कुंभ राशि" },
  { id: "meena", nameEn: "Meena (Pisces)", nameTe: "మీన రాశి", nameHi: "मीन राशि" }
];

export const COMMON_GOTRAMS = [
  "Bharadwaja", "Kashyapa", "Vashishta", "Kaundinya", "Harithasa",
  "Gouthama", "Atreya", "Kausika", "Srivatsa", "Shandilya",
  "Gargeya", "Kutsa", "Mudgala", "Parashara", "Agasthya", "Other / Not Known"
];

export const GOTRAMS_LIST = [
  { id: "Bharadwaja", nameEn: "Bharadwaja", nameTe: "భరద్వాజ", nameHi: "भारद्वाज" },
  { id: "Kashyapa", nameEn: "Kashyapa", nameTe: "కశ్యప", nameHi: "कश्यप" },
  { id: "Vashishta", nameEn: "Vashishta", nameTe: "వశిష్ఠ", nameHi: "वशिष्ठ" },
  { id: "Kaundinya", nameEn: "Kaundinya", nameTe: "కౌండిన్య", nameHi: "कौंडिन्य" },
  { id: "Harithasa", nameEn: "Harithasa", nameTe: "హరితస", nameHi: "हारितस" },
  { id: "Gouthama", nameEn: "Gouthama", nameTe: "గౌతమ", nameHi: "गौतम" },
  { id: "Atreya", nameEn: "Atreya", nameTe: "ఆత్రేయ", nameHi: "आत्रेय" },
  { id: "Kausika", nameEn: "Kausika", nameTe: "కౌశిక", nameHi: "कौशिक" },
  { id: "Srivatsa", nameEn: "Srivatsa", nameTe: "శ్రీవత్స", nameHi: "श्रीवत्स" },
  { id: "Shandilya", nameEn: "Shandilya", nameTe: "శాండిల్య", nameHi: "शांडिल्य" },
  { id: "Gargeya", nameEn: "Gargeya", nameTe: "గార్గేయ", nameHi: "गार्गेय" },
  { id: "Kutsa", nameEn: "Kutsa", nameTe: "కుత్స", nameHi: "कुत्स" },
  { id: "Mudgala", nameEn: "Mudgala", nameTe: "ముద్గల", nameHi: "मुद्गल" },
  { id: "Parashara", nameEn: "Parashara", nameTe: "పరాశర", nameHi: "पाराशर" },
  { id: "Agasthya", nameEn: "Agasthya", nameTe: "అగస్త్య", nameHi: "अगस्त्य" },
  { id: "Other / Not Known", nameEn: "Other / Not Known", nameTe: "ఇతర / తెలియదు", nameHi: "अन्य / ज्ञात नहीं" },
];

export const RELATIONS = [
  { id: "self", nameEn: "Self", nameTe: "స్వయంగా", nameHi: "स्वयं" },
  { id: "spouse", nameEn: "Spouse (Wife / Husband)", nameTe: "భార్య / భర్త", nameHi: "पति / पत्नी" },
  { id: "son", nameEn: "Son", nameTe: "కుమారుడు", nameHi: "पुत्र" },
  { id: "daughter", nameEn: "Daughter", nameTe: "కుమార్తె", nameHi: "पुत्री" },
  { id: "father", nameEn: "Father", nameTe: "తండ్రి", nameHi: "पिता" },
  { id: "mother", nameEn: "Mother", nameTe: "తల్లి", nameHi: "माता" },
  { id: "brother", nameEn: "Brother", nameTe: "సోదరుడు", nameHi: "भाई" },
  { id: "sister", nameEn: "Sister", nameTe: "సోదరి", nameHi: "बहन" },
  { id: "other", nameEn: "Other Family Member", nameTe: "ఇతర కుటుంబ సభ్యులు", nameHi: "अन्य परिजन" }
];
