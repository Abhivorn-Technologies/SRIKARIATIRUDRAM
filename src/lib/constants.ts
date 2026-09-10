export const SITE_NAME = "Srikari Ati Rudra Mahayagnam";

export const NAKSHATRAS = [
  { id: "rohini", nameEn: "Rohini", nameTe: "రోహిణి", rasiEn: "Vrishabha", rasiTe: "వృషభం", lord: "Chandra", dayIndex: 1 },
  { id: "mrigasira", nameEn: "Mrigasira", nameTe: "మృగశిర", rasiEn: "Vrishabha / Mithuna", rasiTe: "వృషభం / మిథునం", lord: "Kuja", dayIndex: 2 },
  { id: "ardra", nameEn: "Ardra", nameTe: "ఆర్ద్ర", rasiEn: "Mithuna", rasiTe: "మిథునం", lord: "Rahu", dayIndex: 3 },
  { id: "punarvasu", nameEn: "Punarvasu", nameTe: "పునర్వసు", rasiEn: "Mithuna / Karkataka", rasiTe: "మిథునం / కర్కాటకం", lord: "Guru", dayIndex: 4 },
  { id: "pushya", nameEn: "Pushya", nameTe: "పుష్యమి", rasiEn: "Karkataka", rasiTe: "కర్కాటకం", lord: "Sani", dayIndex: 5 },
  { id: "ashlesha", nameEn: "Ashlesha", nameTe: "ఆశ్లేష", rasiEn: "Karkataka", rasiTe: "కర్కాటకం", lord: "Budha", dayIndex: 6 },
  { id: "magha", nameEn: "Magha", nameTe: "మఖ", rasiEn: "Simha", rasiTe: "సింహం", lord: "Ketu", dayIndex: 7 },
  { id: "purva-phalguni", nameEn: "Purva Phalguni", nameTe: "పూర్వ ఫల్గుణి", rasiEn: "Simha", rasiTe: "సింహం", lord: "Sukra", dayIndex: 8 },
  { id: "uttara-phalguni", nameEn: "Uttara Phalguni", nameTe: "ఉత్తర ఫల్గుణి", rasiEn: "Simha / Kanya", rasiTe: "సింహం / కన్య", lord: "Surya", dayIndex: 9 },
  { id: "hasta", nameEn: "Hasta", nameTe: "హస్త", rasiEn: "Kanya", rasiTe: "కన్య", lord: "Chandra", dayIndex: 10 },
  { id: "chitta", nameEn: "Chitta", nameTe: "చిత్త", rasiEn: "Kanya / Tula", rasiTe: "కన్య / తుల", lord: "Kuja", dayIndex: 11 },
  { id: "swathi", nameEn: "Swathi", nameTe: "స్వాతి", rasiEn: "Tula", rasiTe: "తుల", lord: "Rahu", dayIndex: 12 },
  { id: "vishakha", nameEn: "Vishakha", nameTe: "విశాఖ", rasiEn: "Tula / Vrischika", rasiTe: "తుల / వృశ్చికం", lord: "Guru", dayIndex: 13 },
  { id: "anuradha", nameEn: "Anuradha", nameTe: "అనూరాధ", rasiEn: "Vrischika", rasiTe: "వృశ్చికం", lord: "Sani", dayIndex: 14 },
  { id: "jyeshta", nameEn: "Jyeshta", nameTe: "జ్యేష్ఠ", rasiEn: "Vrischika", rasiTe: "వృశ్చికం", lord: "Budha", dayIndex: 15 },
  { id: "moola", nameEn: "Moola", nameTe: "మూల", rasiEn: "Dhanus", rasiTe: "ధనుస్సు", lord: "Ketu", dayIndex: 16 },
  { id: "purvashada", nameEn: "Purvashada", nameTe: "పూర్వాషాఢ", rasiEn: "Dhanus", rasiTe: "ధనుస్సు", lord: "Sukra", dayIndex: 17 },
  { id: "uttarashada", nameEn: "Uttarashada", nameTe: "ఉత్తరాషాఢ", rasiEn: "Dhanus / Makara", rasiTe: "ధనుస్సు / మకరం", lord: "Surya", dayIndex: 18 },
  { id: "shravana", nameEn: "Shravana", nameTe: "శ్రవణం", rasiEn: "Makara", rasiTe: "మకరం", lord: "Chandra", dayIndex: 19 },
  { id: "dhanishta", nameEn: "Dhanishta", nameTe: "ధనిష్ఠ", rasiEn: "Makara / Kumbha", rasiTe: "మకరం / కుంభం", lord: "Kuja", dayIndex: 20 },
  { id: "sathabhisha", nameEn: "Sathabhisha", nameTe: "శతాభిషం", rasiEn: "Kumbha", rasiTe: "కుంభం", lord: "Rahu", dayIndex: 21 },
  { id: "purva-bhadrapada", nameEn: "Purva Bhadrapada", nameTe: "పూర్వాభాద్ర", rasiEn: "Kumbha / Meena", rasiTe: "కుంభం / మీనం", lord: "Guru", dayIndex: 22 },
  { id: "uttara-bhadrapada", nameEn: "Uttara Bhadrapada", nameTe: "ఉత్తరాభాద్ర", rasiEn: "Meena", rasiTe: "మీనం", lord: "Sani", dayIndex: 23 },
  { id: "revathi", nameEn: "Revathi", nameTe: "రేవతి", rasiEn: "Meena", rasiTe: "మీనం", lord: "Budha", dayIndex: 24 },
  { id: "krittika", nameEn: "Krittika", nameTe: "కృత్తిక", rasiEn: "Mesha / Vrishabha", rasiTe: "మేషం / వృషభం", lord: "Surya", dayIndex: 25 },
  { id: "bharani", nameEn: "Bharani", nameTe: "భరణి", rasiEn: "Mesha", rasiTe: "మేషం", lord: "Sukra", dayIndex: 26 },
  { id: "ashwini", nameEn: "Ashwini", nameTe: "అశ్విని", rasiEn: "Mesha", rasiTe: "మేషం", lord: "Ketu", dayIndex: 27 },
];

export const RASIS = [
  { id: "mesha", nameEn: "Mesha (Aries)", nameTe: "మేష రాశి" },
  { id: "vrishabha", nameEn: "Vrishabha (Taurus)", nameTe: "వృషభ రాశి" },
  { id: "mithuna", nameEn: "Mithuna (Gemini)", nameTe: "మిథున రాశి" },
  { id: "karkataka", nameEn: "Karkataka (Cancer)", nameTe: "కర్కాటక రాశి" },
  { id: "simha", nameEn: "Simha (Leo)", nameTe: "సింహ రాశి" },
  { id: "kanya", nameEn: "Kanya (Virgo)", nameTe: "కన్య రాశి" },
  { id: "tula", nameEn: "Tula (Libra)", nameTe: "తుల రాశి" },
  { id: "vrischika", nameEn: "Vrischika (Scorpio)", nameTe: "వృశ్చిక రాశి" },
  { id: "dhanus", nameEn: "Dhanus (Sagittarius)", nameTe: "ధనుస్సు రాశి" },
  { id: "makara", nameEn: "Makara (Capricorn)", nameTe: "మకర రాశి" },
  { id: "kumbha", nameEn: "Kumbha (Aquarius)", nameTe: "కుంభ రాశి" },
  { id: "meena", nameEn: "Meena (Pisces)", nameTe: "మీన రాశి" }
];

export const COMMON_GOTRAMS = [
  "Bharadwaja", "Kashyapa", "Vashishta", "Kaundinya", "Harithasa",
  "Gouthama", "Atreya", "Kausika", "Srivatsa", "Shandilya",
  "Gargeya", "Kutsa", "Mudgala", "Parashara", "Agasthya", "Other / Not Known"
];

export const RELATIONS = [
  { id: "self", nameEn: "Self", nameTe: "స్వయంగా" },
  { id: "spouse", nameEn: "Spouse (Wife / Husband)", nameTe: "భార్య / భర్త" },
  { id: "son", nameEn: "Son", nameTe: "కుమారుడు" },
  { id: "daughter", nameEn: "Daughter", nameTe: "కుమార్తె" },
  { id: "father", nameEn: "Father", nameTe: "తండ్రి" },
  { id: "mother", nameEn: "Mother", nameTe: "తల్లి" },
  { id: "brother", nameEn: "Brother", nameTe: "సోదరుడు" },
  { id: "sister", nameEn: "Sister", nameTe: "సోదరి" },
  { id: "other", nameEn: "Other Family Member", nameTe: "ఇతర కుటుంబ సభ్యులు" }
];
