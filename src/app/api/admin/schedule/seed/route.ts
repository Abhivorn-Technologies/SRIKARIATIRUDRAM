import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { rawScheduleData } from '@/data/schedule';

export const dynamic = 'force-dynamic';

function getDayType(item: any) {
  const key = (item.specialKey ?? '').toLowerCase();
  if (key.includes('sarpa')) return 'SARPA_SUKTA';
  if (key.includes('chandi')) return 'CHANDI';
  if (key.includes('aslesha')) return 'ASLESHA_BALI';
  if (key.includes('krithika') || (item.nakshatra ?? '').toLowerCase().includes('krittika')) return 'SUBRAMANYESWARA_KALYANAM';
  if (item.dayNumber === 28 || key.includes('poornahuti') || item.highlightTag === 'GRAND CONCLUDING DAY') return 'POORNAHUTI';
  return 'REGULAR';
}

function parseDate(dateStr: string) {
  const months: Record<string, string> = {
    January: '01', February: '02', March: '03', April: '04',
    May: '05', June: '06', July: '07', August: '08',
    September: '09', October: '10', November: '11', December: '12',
  };
  const parts = dateStr.trim().split(' ');
  if (parts.length === 3) {
    return parts[2] + '-' + (months[parts[1]] ?? '01') + '-' + parts[0].padStart(2, '0');
  }
  return dateStr;
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const force = body?.force === true;

    const existingCount = await db.collection('schedules').countDocuments();
    if (existingCount >= 28 && !force) {
      return NextResponse.json({
        success: true,
        message: 'Database already has ' + existingCount + ' schedule entries. Pass { force: true } to re-seed.',
        seeded: 0,
        existing: existingCount,
      });
    }

    let seeded = 0;
    const errors: string[] = [];
    for (const item of rawScheduleData) {
      try {
        const dateFormatted = parseDate(item.date);
        await db.collection('schedules').updateOne(
          { day_number: item.dayNumber },
          {
            $set: {
              day_number: item.dayNumber,
              date: dateFormatted,
              date_display: item.date,
              nakshatra: item.nakshatra,
              rasi: item.rasi ?? '',
              day_type: getDayType(item),
              status: 'SCHEDULED',
              title: item.title,
              title_te: item.titleTe ?? item.title,
              morning_programme: item.programme ?? '',
              special_programme: item.pradhanaHomam ?? item.specialProgramme ?? '',
              evening_programme: item.eveningProgramme ?? '',
              description: item.specialSeva ?? '',
              updated_at: new Date().toISOString()
            }
          },
          { upsert: true }
        );
        seeded++;
      } catch (err: any) {
        errors.push('Day ' + item.dayNumber + ': ' + err.message);
      }
    }
    return NextResponse.json({ success: true, message: 'Seeded ' + seeded + ' of ' + rawScheduleData.length + ' days.', seeded, total: rawScheduleData.length, errors: errors.length > 0 ? errors : undefined });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message ?? 'Seed failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const count = await db.collection('schedules').countDocuments();
    return NextResponse.json({ success: true, count, isSeeded: count >= 28, message: count >= 28 ? 'All ' + count + ' schedule days are in the database.' : 'Only ' + count + ' days in DB - run POST to seed all 28.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}