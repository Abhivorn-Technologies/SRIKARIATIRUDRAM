import { scheduleList } from '@/data/schedule';
import { ScheduleDay } from '@/types/schedule';
import { scheduleServerService, ScheduleItem } from '@/services/server/schedule.server.service';

function mapDbScheduleToDay(item: ScheduleItem, staticFallback?: ScheduleDay): ScheduleDay {
  const fallback = staticFallback || scheduleList.find(d => d.dayNumber === item.day_number);

  const titleVal = item.title || fallback?.title || `Day ${item.day_number}`;
  const titleTeVal = item.title_te || item.title || fallback?.titleTe || titleVal;
  const titleHiVal = item.title_hi || item.title || fallback?.titleHi || titleVal;

  const nakshatraVal = item.nakshatra || fallback?.nakshatra || '';
  const nakshatraTeVal = item.nakshatra || fallback?.nakshatraTe || nakshatraVal;
  const nakshatraHiVal = item.nakshatra || fallback?.nakshatraHi || nakshatraVal;

  const pradhanaVal = item.special_programme || fallback?.pradhanaHomam || 'Sri Rudra Hawan';
  const pradhanaTeVal = item.special_programme || fallback?.pradhanaHomamTe || pradhanaVal;
  const pradhanaHiVal = item.special_programme || fallback?.pradhanaHomamHi || pradhanaVal;

  const morningVal = item.morning_programme || fallback?.programme || '06:30 AM Suprabhatam & Rudrabhishekam';
  const morningTeVal = item.morning_programme || fallback?.programmeTe || morningVal;
  const morningHiVal = item.morning_programme || fallback?.programmeHi || morningVal;

  const eveningVal = item.evening_programme || fallback?.eveningProgramme || '06:00 PM Deeparadhana & Harathi';
  const eveningTeVal = item.evening_programme || fallback?.eveningProgrammeTe || eveningVal;
  const eveningHiVal = item.evening_programme || fallback?.eveningProgrammeHi || eveningVal;

  const descVal = item.description || fallback?.specialSignificance || '';
  const descTeVal = item.description || fallback?.specialSignificanceTe || descVal;
  const descHiVal = item.description || fallback?.specialSignificanceHi || descVal;

  return {
    dayNumber: item.day_number,
    day: item.day_number,
    date: item.date_display || fallback?.date || item.date,
    dateTe: item.date_display || fallback?.dateTe || item.date,
    dateHi: item.date_display || fallback?.dateHi || item.date,
    dayOfWeek: fallback?.dayOfWeek || '',
    dayOfWeekTe: fallback?.dayOfWeekTe || '',
    dayOfWeekHi: fallback?.dayOfWeekHi || '',
    nakshatra: nakshatraVal,
    nakshatraTe: nakshatraTeVal,
    nakshatraHi: nakshatraHiVal,
    rasi: item.rasi || fallback?.rasi || '',
    rasiTe: item.rasi || fallback?.rasiTe || '',
    rasiHi: item.rasi || fallback?.rasiHi || '',
    title: titleVal,
    titleTe: titleTeVal,
    titleHi: titleHiVal,
    presidingDeity: fallback?.presidingDeity || 'Sri Parameswara',
    presidingDeityTe: fallback?.presidingDeityTe || 'శ్రీ పరమేశ్వరుడు',
    presidingDeityHi: fallback?.presidingDeityHi || 'श्री परमेश्वर',
    pradhanaHomam: pradhanaVal,
    pradhanaHomamTe: pradhanaTeVal,
    pradhanaHomamHi: pradhanaHiVal,
    programme: morningVal,
    programmeTe: morningTeVal,
    programmeHi: morningHiVal,
    eveningProgramme: eveningVal,
    eveningProgrammeTe: eveningTeVal,
    eveningProgrammeHi: eveningHiVal,
    specialSeva: fallback?.specialSeva || null,
    specialSevaTe: fallback?.specialSevaTe || null,
    specialSevaHi: fallback?.specialSevaHi || null,
    specialProgramme: pradhanaVal,
    specialProgrammeTe: pradhanaTeVal,
    specialProgrammeHi: pradhanaHiVal,
    sevaSlug: item.special_seva_id || fallback?.sevaSlug || null,
    price: fallback?.price || null,
    specialSignificance: descVal,
    specialSignificanceTe: descTeVal,
    specialSignificanceHi: descHiVal,
    image: fallback?.image || '/assets/images/schedule/day-default.jpg',
    programmeTimeline: fallback?.programmeTimeline || [],
    availableSevas: fallback?.availableSevas || [],
    status: (item.status === 'FULLY_BOOKED' ? 'fully_booked' : item.status === 'FEW_SLOTS' ? 'few_slots' : 'available'),
    isSpecial: item.day_type !== 'REGULAR',
    isConfirmed: true,
    highlightTag: fallback?.highlightTag || null,
    assigned_sevas: ((item as any).assigned_sevas || []).filter(
      (s: any) => s && s.status !== 'HIDDEN' && (s.amount > 0 || s.price > 0)
    )
  } as any;
}

export const scheduleService = {
  async getAllDays(): Promise<ScheduleDay[]> {
    try {
      const dbSchedules = await scheduleServerService.getAllSchedules();
      if (dbSchedules && dbSchedules.length > 0) {
        return dbSchedules.map(d => mapDbScheduleToDay(d));
      }
    } catch (err) {
      console.warn('Falling back to static scheduleList due to DB error:', err);
    }
    return scheduleList;
  },

  async getDayByNumber(dayNumber: number): Promise<ScheduleDay | undefined> {
    try {
      const dbItem = await scheduleServerService.getScheduleById(String(dayNumber));
      if (dbItem) {
        return mapDbScheduleToDay(dbItem);
      }
    } catch (err) {
      console.warn('Falling back to static day lookup due to DB error:', err);
    }
    return scheduleList.find((d) => d.dayNumber === dayNumber);
  },

  async getDayByNakshatra(nakshatra: string): Promise<ScheduleDay | undefined> {
    const term = nakshatra.toLowerCase();
    const all = await this.getAllDays();
    return all.find(
      (d) =>
        d.nakshatra.toLowerCase().includes(term) ||
        d.nakshatraTe.toLowerCase().includes(term)
    );
  },
};

