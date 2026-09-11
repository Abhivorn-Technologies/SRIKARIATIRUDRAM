import { query } from '@/lib/db';

export interface DonationRecord {
  id: string;
  donation_id: string;
  donor_name: string;
  mobile: string;
  email?: string;
  amount: number;
  purpose: string;
  gotram?: string;
  nakshatram?: string;
  address?: string;
  payment_status: string;
  transaction_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const donationServerService = {
  async getDonations(purpose?: string, search?: string): Promise<DonationRecord[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (purpose) {
      conditions.push(`purpose = $${idx}`);
      params.push(purpose);
      idx++;
    }

    if (search) {
      conditions.push(`(donor_name ILIKE $${idx} OR mobile ILIKE $${idx} OR donation_id ILIKE $${idx} OR gotram ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `
      SELECT * FROM public.donations
      ${whereClause}
      ORDER BY created_at DESC;
    `;

    const res = await query<DonationRecord>(sql, params);
    return res.rows;
  },

  async createDonation(data: Partial<DonationRecord>): Promise<DonationRecord> {
    const rand = Math.floor(100000 + Math.random() * 900000);
    const donationId = data.donation_id || `SAR-DON-${rand}`;

    const res = await query<DonationRecord>(`
      INSERT INTO public.donations (
        donation_id, donor_name, mobile, email, amount, purpose,
        gotram, nakshatram, address, payment_status, transaction_id, notes, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, NOW(), NOW()
      )
      RETURNING *;
    `, [
      donationId,
      data.donor_name || 'Anonymous Donor',
      data.mobile || '',
      data.email || null,
      data.amount || 216,
      data.purpose || 'ATI_RUDRAM',
      data.gotram || null,
      data.nakshatram || null,
      data.address || null,
      data.payment_status || 'SUCCESS',
      data.transaction_id || `UPI/TXN${Date.now().toString().slice(-8)}`,
      data.notes || null
    ]);

    return res.rows[0];
  },

  async updateDonation(id: string, updates: Partial<DonationRecord>): Promise<DonationRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowed: (keyof DonationRecord)[] = [
      'donor_name', 'mobile', 'email', 'amount', 'purpose', 'gotram',
      'nakshatram', 'address', 'payment_status', 'transaction_id', 'notes'
    ];

    for (const k of allowed) {
      if (updates[k] !== undefined) {
        fields.push(`${String(k)} = $${idx}`);
        values.push(updates[k]);
        idx++;
      }
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const sql = `
      UPDATE public.donations
      SET ${fields.join(', ')}
      WHERE id::text = $${idx} OR donation_id = $${idx}
      RETURNING *;
    `;

    const res = await query<DonationRecord>(sql, values);
    return res.rows[0] || null;
  }
};
