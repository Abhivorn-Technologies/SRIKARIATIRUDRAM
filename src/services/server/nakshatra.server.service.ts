import { query } from '@/lib/db';
import { SevaItem, sevaServerService } from './seva.server.service';

export interface NakshatraItem {
  id: string;
  name: string;
  name_te?: string;
  name_hi?: string;
  deity?: string;
  rasi?: string;
  lord?: string;
  programme_date?: string;
  day_number?: number;
  day_type: string;
  special_seva_id?: string;
  special_seva_name?: string;
  active: boolean;
}

export interface NakshatraProgrammeResult {
  nakshatra: string;
  nameTe?: string;
  nameHi?: string;
  rasi?: string;
  deity?: string;
  lord?: string;
  dayNumber: number;
  programmeDate: string;
  dateDisplay: string;
  dayType: string;
  specialSeva: {
    id?: string;
    name?: string;
  } | null;
  availableSevas: {
    id: string;
    slug: string;
    title: string;
    titleTe?: string;
    titleHi?: string;
    amount: number;
    description: string;
    category: string;
    isSpecial?: boolean;
    tag?: string;
    capacity: number;
    bookedCount: number;
    availableSlots: number;
    availabilityStatus: 'AVAILABLE' | 'FEW_SLOTS_LEFT' | 'FULLY_BOOKED';
  }[];
}

export const nakshatraServerService = {
  async getAllNakshatras(): Promise<NakshatraItem[]> {
    const res = await query<NakshatraItem>(`
      SELECT * FROM public.nakshatras
      ORDER BY day_number ASC NULLS LAST, name ASC;
    `);
    return res.rows;
  },

  async getNakshatraByName(name: string): Promise<NakshatraItem | null> {
    const clean = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const res = await query<NakshatraItem>(`
      SELECT * FROM public.nakshatras
      WHERE LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '', 'g')) = $1
      LIMIT 1;
    `, [clean]);
    return res.rows[0] || null;
  },

  async createNakshatra(data: Partial<NakshatraItem>): Promise<NakshatraItem> {
    const res = await query<NakshatraItem>(`
      INSERT INTO public.nakshatras (
        name, name_te, name_hi, deity, rasi, lord, programme_date, day_number, day_type, special_seva_id, special_seva_name, active, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()
      )
      RETURNING *;
    `, [
      data.name, data.name_te, data.name_hi, data.deity, data.rasi, data.lord,
      data.programme_date, data.day_number, data.day_type || 'REGULAR',
      data.special_seva_id, data.special_seva_name, data.active !== false
    ]);
    return res.rows[0];
  },

  async updateNakshatra(id: string, updates: Partial<NakshatraItem>): Promise<NakshatraItem | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowedKeys: (keyof NakshatraItem)[] = [
      'name', 'name_te', 'name_hi', 'deity', 'rasi', 'lord', 'programme_date',
      'day_number', 'day_type', 'special_seva_id', 'special_seva_name', 'active'
    ];

    for (const key of allowedKeys) {
      if (updates[key] !== undefined) {
        fields.push(`${String(key)} = $${idx}`);
        values.push(updates[key]);
        idx++;
      }
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const sql = `
      UPDATE public.nakshatras
      SET ${fields.join(', ')}
      WHERE id::text = $${idx} OR name ILIKE $${idx}
      RETURNING *;
    `;

    const res = await query<NakshatraItem>(sql, values);
    return res.rows[0] || null;
  },

  async deleteNakshatra(id: string): Promise<boolean> {
    const res = await query(`
      DELETE FROM public.nakshatras
      WHERE id::text = $1;
    `, [id]);
    return res.rowCount > 0;
  },

  /**
   * CORE BUSINESS LOGIC: getNakshatraProgramme(nakshatra)
   * Resolves: Janma Nakshatra -> Programme Date -> Day Type -> Dynamic Applicable Sevas + Live DB Pricing & Capacity
   */
  async getNakshatraProgramme(nakshatraName: string): Promise<NakshatraProgrammeResult | null> {
    const nakshatra = await this.getNakshatraByName(nakshatraName);
    if (!nakshatra) return null;

    // Get matching schedule details
    const scheduleRes = await query(`
      SELECT * FROM public.schedules
      WHERE day_number = $1 OR date = $2::date
      LIMIT 1;
    `, [nakshatra.day_number || 1, nakshatra.programme_date || '2026-11-25']);

    const schedule = scheduleRes.rows[0] || {
      day_number: nakshatra.day_number || 1,
      date: nakshatra.programme_date || '2026-11-25',
      date_display: '25 November 2026',
      day_type: nakshatra.day_type || 'REGULAR'
    };

    const targetDate = schedule.date ? new Date(schedule.date).toISOString().split('T')[0] : '2026-11-25';

    // Get all active sevas from database
    const allSevas = await sevaServerService.getAllSevas();

    // Get availability for that date
    const availRes = await query(`
      SELECT seva_id, capacity, booked_count, status
      FROM public.seva_availability
      WHERE date = $1::date;
    `, [targetDate]);

    const availabilityMap = new Map<string, { capacity: number; booked_count: number; status: string }>();
    availRes.rows.forEach((r: any) => {
      availabilityMap.set(r.seva_id, r);
    });

    // Build applicable sevas based on Nakshatra Day Type rules
    const dayType = schedule.day_type || nakshatra.day_type || 'REGULAR';
    const applicableList: NakshatraProgrammeResult['availableSevas'] = [];

    // 1. Hawan Seva (Always ₹216 from DB)
    const hawanSeva = allSevas.find((s) => s.id === 'nakshatra-hawan-seva') || allSevas.find((s) => s.id === 'ati-rudram-donation');
    if (hawanSeva) {
      const av = availabilityMap.get(hawanSeva.id) || { capacity: hawanSeva.capacity, booked_count: 0, status: 'AVAILABLE' };
      applicableList.push({
        id: hawanSeva.id,
        slug: hawanSeva.slug,
        title: hawanSeva.title,
        titleTe: hawanSeva.title_te,
        titleHi: hawanSeva.title_hi,
        amount: Number(hawanSeva.amount),
        description: hawanSeva.short_desc || 'Sacred Hawan offering dedicated to your Janma Nakshatra day.',
        category: hawanSeva.category,
        capacity: av.capacity,
        bookedCount: av.booked_count,
        availableSlots: Math.max(0, av.capacity - av.booked_count),
        availabilityStatus: (av.status as any) || 'AVAILABLE'
      });
    }

    // 2. Sampoorna Nakshatra Shanthi (Always ₹10,116 from DB)
    const shanthiSeva = allSevas.find((s) => s.id === 'sampoorna-nakshatra-shanthi');
    if (shanthiSeva) {
      const av = availabilityMap.get(shanthiSeva.id) || { capacity: shanthiSeva.capacity, booked_count: 0, status: 'AVAILABLE' };
      applicableList.push({
        id: shanthiSeva.id,
        slug: shanthiSeva.slug,
        title: shanthiSeva.title,
        titleTe: shanthiSeva.title_te,
        titleHi: shanthiSeva.title_hi,
        amount: Number(shanthiSeva.amount),
        description: shanthiSeva.short_desc || 'Complete Vedic Nakshatra Shanthi ritual on your programme date.',
        category: shanthiSeva.category,
        capacity: av.capacity,
        bookedCount: av.booked_count,
        availableSlots: Math.max(0, av.capacity - av.booked_count),
        availabilityStatus: (av.status as any) || 'AVAILABLE'
      });
    }

    // 3. Special Day Sevas
    if (dayType === 'CHANDI' || dayType === 'SARPA_SUKTA' || dayType === 'ASLESHA_BALI') {
      const viseshaSeva = allSevas.find((s) => s.id === 'sampoorna-visesha-nakshatra-seva');
      if (viseshaSeva) {
        const av = availabilityMap.get(viseshaSeva.id) || { capacity: viseshaSeva.capacity, booked_count: 0, status: 'AVAILABLE' };
        
        let specialTag = 'Special Day Seva';
        let customDesc = viseshaSeva.short_desc || 'Special Nakshatra Shanthi with designated Vedic Homam.';
        
        if (dayType === 'CHANDI') {
          specialTag = 'Chandi Homam Day';
          customDesc = 'Nakshatra Shanthi with Sacred Chandi Homam';
        } else if (dayType === 'SARPA_SUKTA') {
          specialTag = 'Sarpa Sukta Day';
          customDesc = 'Nakshatra Shanthi with Sarpa Sukta Homam';
        } else if (dayType === 'ASLESHA_BALI') {
          specialTag = 'Aslesha Bali Day';
          customDesc = 'Nakshatra Shanthi with Aslesha Bali Pooja';
        }

        applicableList.push({
          id: viseshaSeva.id,
          slug: viseshaSeva.slug,
          title: viseshaSeva.title,
          titleTe: viseshaSeva.title_te,
          titleHi: viseshaSeva.title_hi,
          amount: Number(viseshaSeva.amount),
          description: customDesc,
          category: viseshaSeva.category,
          isSpecial: true,
          tag: specialTag,
          capacity: av.capacity,
          bookedCount: av.booked_count,
          availableSlots: Math.max(0, av.capacity - av.booked_count),
          availabilityStatus: (av.status as any) || 'AVAILABLE'
        });
      }
    } else if (dayType === 'SUBRAMANYESWARA_KALYANAM' || nakshatra.name.toLowerCase().includes('krithika')) {
      const kalyanamSeva = allSevas.find((s) => s.id === 'sri-subramanyeswara-swamy-kalyanam');
      if (kalyanamSeva) {
        const av = availabilityMap.get(kalyanamSeva.id) || { capacity: kalyanamSeva.capacity, booked_count: 0, status: 'AVAILABLE' };
        applicableList.push({
          id: kalyanamSeva.id,
          slug: kalyanamSeva.slug,
          title: kalyanamSeva.title,
          titleTe: kalyanamSeva.title_te,
          titleHi: kalyanamSeva.title_hi,
          amount: Number(kalyanamSeva.amount),
          description: kalyanamSeva.short_desc || 'Divine Kalyana Utsavam on Krithika Nakshatra day.',
          category: kalyanamSeva.category,
          isSpecial: true,
          tag: 'Krithika Special Kalyanam',
          capacity: av.capacity,
          bookedCount: av.booked_count,
          availableSlots: Math.max(0, av.capacity - av.booked_count),
          availabilityStatus: (av.status as any) || 'AVAILABLE'
        });
      }
    }

    return {
      nakshatra: nakshatra.name,
      nameTe: nakshatra.name_te,
      nameHi: nakshatra.name_hi,
      rasi: nakshatra.rasi,
      deity: nakshatra.deity,
      lord: nakshatra.lord,
      dayNumber: schedule.day_number,
      programmeDate: targetDate,
      dateDisplay: schedule.date_display,
      dayType,
      specialSeva: nakshatra.special_seva_id ? {
        id: nakshatra.special_seva_id,
        name: nakshatra.special_seva_name
      } : null,
      availableSevas: applicableList
    };
  }
};
