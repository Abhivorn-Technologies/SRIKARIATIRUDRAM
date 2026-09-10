export interface ProgrammeItem {
  time: string;
  timeTe: string;
  timeHi?: string;
  ritual: string;
  ritualTe: string;
  ritualHi?: string;
  description: string;
  descriptionTe: string;
  descriptionHi?: string;
  session: 'morning' | 'evening';
}

export type ScheduleDayStatus = 'available' | 'few_slots' | 'fully_booked';

export interface ScheduleDay {
  dayNumber: number;
  day: number; // Alias for dayNumber
  date: string;
  dateTe: string;
  dateHi?: string;
  dayOfWeek: string;
  dayOfWeekTe: string;
  dayOfWeekHi?: string;
  nakshatra: string;
  nakshatraTe: string;
  nakshatraHi?: string;
  nakshatraPada?: string;
  rasi: string;
  rasiTe: string;
  rasiHi?: string;
  title: string;
  titleTe: string;
  titleHi?: string;
  presidingDeity: string;
  presidingDeityTe: string;
  presidingDeityHi?: string;
  pradhanaHomam: string;
  pradhanaHomamTe: string;
  pradhanaHomamHi?: string;
  programme: string; // Verbatim final programme text
  programmeTe: string;
  programmeHi?: string;
  eveningProgramme: string; // Verbatim evening programme text
  eveningProgrammeTe: string;
  eveningProgrammeHi?: string;
  specialSeva: string | null;
  specialSevaTe: string | null;
  specialSevaHi?: string | null;
  specialProgramme: string | null;
  specialProgrammeTe?: string | null;
  specialProgrammeHi?: string | null;
  sevaSlug: string | null;
  price: number | null;
  specialSignificance: string;
  specialSignificanceTe: string;
  specialSignificanceHi?: string;
  image: string;
  programmeTimeline?: ProgrammeItem[];
  availableSevas: string[]; // Seva IDs
  status: ScheduleDayStatus;
  isSpecial: boolean;
  isConfirmed: boolean;
  specialKey?: string;
  highlightTag?: 'OPENING DAY' | 'GRAND CONCLUDING DAY' | 'SPECIAL PROGRAMME' | null;
}


