import { z } from 'zod';

export const devoteeDetailsSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(5, "Please enter a valid postal address for prasadam"),
  city: z.string().min(2, "Please enter city"),
  pincode: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit PIN code"),
  gotram: z.string().min(2, "Please select or enter your Gotram"),
  nakshatra: z.string().min(2, "Please select Janma Nakshatra"),
  rasi: z.string().min(2, "Please select Rasi"),
});

export const familyMemberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  relation: z.string().min(1, "Relationship is required"),
  gotram: z.string().optional(),
  nakshatra: z.string().optional(),
  rasi: z.string().optional(),
});

export const sankalpamFormSchema = z.object({
  specialPrayers: z.string().optional(),
  deliveryOption: z.enum(['temple_pickup', 'postal_courier']),
  familyMembers: z.array(familyMemberSchema).optional(),
});

export const annadanamSchema = z.object({
  sponsorName: z.string().min(2, "Sponsor name is required"),
  inMemoryOf: z.string().optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile number required"),
  email: z.string().email("Valid email required"),
  date: z.string().min(1, "Please select a date"),
  tier: z.enum(['full_day', 'morning', 'evening', 'custom']),
  amount: z.number().min(500, "Minimum contribution is ₹500"),
});

export const donationSchema = z.object({
  donorName: z.string().min(2, "Donor name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile number required"),
  email: z.string().email("Valid email required"),
  amount: z.number().min(101, "Minimum donation is ₹101"),
  purpose: z.enum(['general', 'yajna_samagri', 'goseva', 'ritwik_dakshina']),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid mobile number required"),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const loginSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
});

export const otpSchema = z.object({
  otp: z.string().length(4, "OTP must be 4 digits"),
});
