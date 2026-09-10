import { scheduleList } from '@/data/schedule';
import { ScheduleDay } from '@/types/schedule';

export const scheduleService = {
  async getAllDays(): Promise<ScheduleDay[]> {
    return scheduleList;
  },

  async getDayByNumber(dayNumber: number): Promise<ScheduleDay | undefined> {
    return scheduleList.find((d) => d.dayNumber === dayNumber);
  },

  async getDayByNakshatra(nakshatra: string): Promise<ScheduleDay | undefined> {
    const term = nakshatra.toLowerCase();
    return scheduleList.find(
      (d) =>
        d.nakshatra.toLowerCase().includes(term) ||
        d.nakshatraTe.toLowerCase().includes(term)
    );
  },
};
