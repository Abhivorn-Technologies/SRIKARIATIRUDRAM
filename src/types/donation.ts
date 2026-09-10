export type DonationPurpose = 'general' | 'yajna_samagri' | 'goseva' | 'ritwik_dakshina';

export interface DonationRecord {
  id: string;
  donorName: string;
  phone: string;
  email: string;
  amount: number;
  purpose: DonationPurpose;
  purposeLabel: string;
  purposeLabelTe: string;
  date: string;
  receiptNumber: string;
  status: 'completed' | 'pending';
}
