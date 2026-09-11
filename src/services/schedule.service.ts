import { scheduleList } from '@/data/schedule';
import { ScheduleDay } from '@/types/schedule';
import { scheduleServerService, ScheduleItem } from '@/services/server/schedule.server.service';

function mapDbScheduleToDay(item: ScheduleItem, staticFallback?: ScheduleDay): ScheduleDay {
  const fallback = staticFallback || scheduleList.find(d => d.dayNumber === item.day_number);
  return {
    dayNumber: item.day_number,
    day: item.day_number,
    date: item.date_display || fallback?.date || item.date,
    dateTe: fallback?.dateTe || item.date_display || item.date,
    dateHi: fallback?.dateHi || item.date_display || item.date,
    dayOfWeek: fallback?.dayOfWeek || '',
    dayOfWeekTe: fallback?.dayOfWeekTe || '',
    dayOfWeekHi: fallback?.dayOfWeekHi || '',
    nakshatra: item.nakshatra || fallback?.nakshatra || '',
    nakshatraTe: fallback?.nakshatraTe || item.nakshatra || '',
    nakshatraHi: fallback?.nakshatraHi || item.nakshatra || '',
    rasi: item.rasi || fallback?.rasi || '',
    rasiTe: fallback?.rasiTe || item.rasi || '',
    rasiHi: fallback?.rasiHi || item.rasi || '',
    title: item.title || fallback?.title || `Day ${item.day_number}`,
    titleTe: item.title_te || fallback?.titleTe || item.title || `Day ${item.day_number}`,
    titleHi: item.title_hi || fallback?.titleHi || item.title || `Day ${item.day_number}`,
    presidingDeity: fallback?.presidingDeity || 'Sri Parameswara',
    presidingDeityTe: fallback?.presidingDeityTe || 'శ్రీ పరమేశ్వరుడు',
    presidingDeityHi: fallback?.presidingDeityHi || 'श्री परमेश्वर',
    pradhanaHomam: item.special_programme || fallback?.pradhanaHomam || 'Sri Rudra Hawan',
    pradhanaHomamTe: fallback?.pradhanaHomamTe || item.special_programme || 'శ్రీ రుద్ర హవనం',
    pradhanaHomamHi: fallback?.pradhanaHomamHi || item.special_programme || 'श्री रुद्र हवन',
    programme: item.morning_programme || fallback?.programme || '06:30 AM Suprabhatam & Rudrabhishekam',
    programmeTe: fallback?.programmeTe || item.morning_programme || '',
    programmeHi: fallback?.programmeHi || item.morning_programme || '',
    eveningProgramme: item.evening_programme || fallback?.eveningProgramme || '06:00 PM Deeparadhana & Harathi',
    eveningProgrammeTe: fallback?.eveningProgrammeTe || item.evening_programme || '',
    eveningProgrammeHi: fallback?.eveningProgrammeHi || item.evening_programme || '',
    specialSeva: fallback?.specialSeva || null,
    specialSevaTe: fallback?.specialSevaTe || null,
    specialSevaHi: fallback?.specialSevaHi || null,
    specialProgramme: item.special_programme || fallback?.specialProgramme || null,
    specialProgrammeTe: fallback?.specialProgrammeTe || item.special_programme || null,
    specialProgrammeHi: fallback?.specialProgrammeHi || item.special_programme || null,
    sevaSlug: item.special_seva_id || fallback?.sevaSlug || null,
    price: fallback?.price || null,
    specialSignificance: item.description || fallback?.specialSignificance || '',
    specialSignificanceTe: fallback?.specialSignificanceTe || item.description || '',
    specialSignificanceHi: fallback?.specialSignificanceHi || item.description || '',
    image: fallback?.image || '/assets/images/schedule/day-default.jpg',
    programmeTimeline: fallback?.programmeTimeline || [],
    availableSevas: fallback?.availableSevas || [],
    status: (item.status === 'FULLY_BOOKED' ? 'fully_booked' : item.status === 'FEW_SLOTS' ? 'few_slots' : 'available'),
    isSpecial: item.day_type !== 'REGULAR',
    isConfirmed: true,
    highlightTag: fallback?.highlightTag || null,
  };
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

