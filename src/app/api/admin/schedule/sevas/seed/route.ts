import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const MASTER_SEVAS = [
  { id: "nakshatra-hawan-seva", slug: "nakshatra-hawan-seva", title: "Nakshatra Hawan Seva", title_te: "నక్షత్ర హవన్ సేవ", amount: 216, category: "homam" },
  { id: "sampoorna-nakshatra-shanthi", slug: "nakshatra-shanthi", title: "Sampoorna Nakshatra Shanthi", title_te: "సంపూర్ణ నక్షత్ర శాంతి", amount: 10116, category: "homam" },
  { id: "sampoorna-visesha-nakshatra-seva", slug: "sampoorna-visesha-nakshatra-seva", title: "Sampoorna Visesha Nakshatra Seva", title_te: "సంపూర్ణ విశేష నక్షత్ర సేవ", amount: 12116, category: "homam" },
  { id: "chandi-homam", slug: "chandi-homam", title: "Chandi Homam", title_te: "చండీ హోమం", amount: 12116, category: "homam" },
  { id: "sarpa-suktam-homam", slug: "sarpa-suktam-homam", title: "Sarpa Suktam Homam", title_te: "సర్ప సూక్తం హోమం", amount: 12116, category: "homam" },
  { id: "ashlesha-bali", slug: "ashlesha-bali", title: "Ashlesha Bali", title_te: "ఆశ్లేష బలి", amount: 12116, category: "special" },
  { id: "valli-devasena-subramanyeswara-kalyanam", slug: "valli-devasena-subramanyeswara-kalyanam", title: "Sri Valli–Devasena Sametha Subramanyeswara Swamy Kalyanam", title_te: "శ్రీ వల్లీ–దేవసేన సమేత సుబ్రహ్మణ్యేశ్వర స్వామి కళ్యాణం", amount: 1116, category: "kalyanam" },
  { id: "parvathi-parameswara-kalyanam", slug: "parvathi-parameswara-kalyanam", title: "Parvathi–Parameswara Maha Shanti Kalyanam", title_te: "శ్రీ పార్వతీ–పరమేశ్వర మహా శాంతి కళ్యాణం", amount: 1116, category: "kalyanam" },
  { id: "ekadasa-rudra-abhishekam", slug: "ekadasa-rudra-abhishekam", title: "Ekadasa Rudra Abhishekam", title_te: "ఏకాదశ రుద్ర అభిషేకం", amount: 5116, category: "abhishekam" },
  { id: "ati-rudram-donation", slug: "ati-rudram-donation", title: "Ati Rudram Donation", title_te: "అతి రుద్రం పవిత్ర విరాళం", amount: 216, category: "donation" },
  { id: "one-day-annadanam", slug: "one-day-annadanam", title: "One-Day Annadanam", title_te: "ఒక రోజు అన్నదానం", amount: 25116, category: "annadanam" },
  { id: "maha-rudra-japam-and-homam", slug: "maha-rudra-japam-and-homam", title: "Maha Rudra Japam & Homam", title_te: "మహా రుద్ర జపం & హోమం", amount: 10116, category: "homam" },
];

const SPECIAL_DAYS: Record<string, number[]> = {
  SARPA_SUKTA: [2, 11, 20],
  CHANDI: [3, 12, 21],
  ASLESHA_BALI: [6],
  SUBRAMANYESWARA_KALYANAM: [25],
  POORNAHUTI: [28],
};
const SPECIAL_SEVA_ID = "sampoorna-visesha-nakshatra-seva";
const KALYANAM_SEVA_ID = "valli-devasena-subramanyeswara-kalyanam";
const POORNAHUTI_SEVA_ID = "parvathi-parameswara-kalyanam";
const DEFAULT_CAPACITY = 500;

function formatDateToYYYYMMDD(d: any): string {
  if (typeof d === 'string') return d.split('T')[0];
  if (d instanceof Date) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return String(d).split('T')[0];
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const force = body?.force === true;

    for (const seva of MASTER_SEVAS) {
      await db.collection('sevas').updateOne(
        { id: seva.id },
        {
          $set: {
            id: seva.id,
            slug: seva.slug,
            title: seva.title,
            title_te: seva.title_te,
            amount: seva.amount,
            category: seva.category,
            capacity: 500,
            active: true,
            updated_at: new Date().toISOString()
          }
        },
        { upsert: true }
      );
    }

    const days = await db.collection('schedules').find({}).sort({ day_number: 1 }).toArray();
    if (days.length === 0) {
      return NextResponse.json({ success: false, error: "No schedule days found. Seed schedules first." }, { status: 400 });
    }

    if (force) {
      await db.collection('seva_availability').deleteMany({});
    }

    let seeded = 0;
    const errors: string[] = [];

    for (const day of days) {
      const dayNum = day.day_number;
      const date = formatDateToYYYYMMDD(day.date);

      const sevasToAssign: { id: string; capacity: number }[] = [];

      if (dayNum === 28) {
        sevasToAssign.push({ id: POORNAHUTI_SEVA_ID, capacity: DEFAULT_CAPACITY });
      } else {
        sevasToAssign.push({ id: "nakshatra-hawan-seva", capacity: DEFAULT_CAPACITY });
        sevasToAssign.push({ id: "sampoorna-nakshatra-shanthi", capacity: DEFAULT_CAPACITY });

        if (
          SPECIAL_DAYS.SARPA_SUKTA.includes(dayNum) ||
          SPECIAL_DAYS.CHANDI.includes(dayNum) ||
          SPECIAL_DAYS.ASLESHA_BALI.includes(dayNum)
        ) {
          sevasToAssign.push({ id: SPECIAL_SEVA_ID, capacity: DEFAULT_CAPACITY });
        } else if (SPECIAL_DAYS.SUBRAMANYESWARA_KALYANAM.includes(dayNum)) {
          sevasToAssign.push({ id: KALYANAM_SEVA_ID, capacity: DEFAULT_CAPACITY });
        }
      }

      for (const seva of sevasToAssign) {
        try {
          const availId = `sa_${date}_${seva.id}`;
          await db.collection('seva_availability').updateOne(
            { date, seva_id: seva.id },
            {
              $set: {
                id: availId,
                date,
                seva_id: seva.id,
                capacity: seva.capacity,
                status: 'AVAILABLE',
                updated_at: new Date().toISOString()
              },
              $setOnInsert: { booked_count: 0 }
            },
            { upsert: true }
          );
          seeded++;
        } catch (err: any) {
          errors.push(`Day ${dayNum} / ${seva.id}: ${err.message}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded master prices & ${seeded} seva-day assignments across ${days.length} days.`,
      seeded,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const count = await db.collection('seva_availability').countDocuments();
    return NextResponse.json({ success: true, count, message: `${count} seva-day assignments in DB.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}