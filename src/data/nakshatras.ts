import { NAKSHATRAS } from '@/lib/constants';
import { scheduleList } from '@/data/schedule';

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

