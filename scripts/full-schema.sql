-- ==============================================================================
-- SRIKARI ATI RUDRA MAHAYAGNAM — COMPLETE SUPABASE DATABASE SCHEMA
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Table: schedules (28-day Mahayagnam schedule)
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_number INT UNIQUE NOT NULL,
    date DATE NOT NULL,
    date_display TEXT NOT NULL,                  -- e.g. "25 November 2026"
    nakshatra TEXT NOT NULL,                     -- e.g. "Rohini"
    rasi TEXT,
    day_type TEXT NOT NULL DEFAULT 'REGULAR',    -- 'REGULAR' | 'CHANDI' | 'SARPA_SUKTA' | 'ASLESHA_BALI' | 'SUBRAMANYESWARA_KALYANAM' | 'POORNAHUTI'
    special_seva_id TEXT,
    status TEXT NOT NULL DEFAULT 'SCHEDULED',    -- 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
    title TEXT,
    title_te TEXT,
    title_hi TEXT,
    description TEXT,
    tithi TEXT,
    special_events JSONB DEFAULT '[]'::jsonb,
    morning_programme TEXT,
    madhyahnika TEXT,
    special_programme TEXT,
    evening_programme TEXT,
    annadanam_menu TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: nakshatras (27 Janma Nakshatras reference & rules)
CREATE TABLE IF NOT EXISTS public.nakshatras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,                   -- e.g. "Mrigasira"
    name_te TEXT,
    name_hi TEXT,
    deity TEXT,
    rasi TEXT,
    lord TEXT,
    programme_date DATE,
    day_number INT,
    day_type TEXT NOT NULL DEFAULT 'REGULAR',
    special_seva_id TEXT,
    special_seva_name TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: sevas (Approved Sevas Catalogue)
CREATE TABLE IF NOT EXISTS public.sevas (
    id TEXT PRIMARY KEY,                         -- e.g. 'ati-rudram-donation'
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_te TEXT,
    title_hi TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    short_desc TEXT,
    short_desc_te TEXT,
    short_desc_hi TEXT,
    full_desc TEXT,
    full_desc_te TEXT,
    full_desc_hi TEXT,
    category TEXT NOT NULL DEFAULT 'homam',      -- 'donation' | 'abhishekam' | 'homam' | 'archana' | 'kalyanam'
    icon TEXT DEFAULT '🕉️',
    duration TEXT,
    time TEXT,
    prasadam JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    capacity INT DEFAULT 100,
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    applicable_nakshatras JSONB DEFAULT '[]'::jsonb, -- [] means all
    applicable_dates JSONB DEFAULT '[]'::jsonb,      -- [] means all
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table: seva_availability (Dynamic Date + Seva Capacity Tracker)
CREATE TABLE IF NOT EXISTS public.seva_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    seva_id TEXT NOT NULL REFERENCES public.sevas(id) ON DELETE CASCADE,
    capacity INT NOT NULL DEFAULT 50,
    booked_count INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'AVAILABLE',    -- 'AVAILABLE' | 'FEW_SLOTS_LEFT' | 'FULLY_BOOKED'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_date_seva UNIQUE (date, seva_id)
);

-- 5. Table: bookings (Devotee Seva Bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT UNIQUE NOT NULL,             -- e.g. 'SAR-2026-000482'
    seva_id TEXT NOT NULL REFERENCES public.sevas(id),
    seva_name TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    selected_date DATE NOT NULL,
    day_number INT,
    nakshatra TEXT NOT NULL,
    rasi TEXT,
    time_slot TEXT DEFAULT '08:30 AM – 12:00 PM',
    
    -- Devotee Details
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,
    gotram TEXT,
    janma_nakshatra TEXT,
    date_of_birth TEXT,
    sankalpam_names TEXT,
    family_members JSONB DEFAULT '[]'::jsonb,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'India',
    attending_personally TEXT DEFAULT 'yes',
    delivery_option TEXT DEFAULT 'postal_courier',
    
    -- Payment & Status
    payment_method TEXT DEFAULT 'upi',
    payment_status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'
    booking_status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED'
    attendance TEXT NOT NULL DEFAULT 'PENDING',     -- 'PENDING' | 'PRESENT' | 'ABSENT'
    transaction_id TEXT,
    payment_response JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table: devotees (Devotee CRM)
CREATE TABLE IF NOT EXISTS public.devotees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    email TEXT,
    gotram TEXT,
    nakshatram TEXT,
    rasi TEXT,
    dob TEXT,
    family_members JSONB DEFAULT '[]'::jsonb,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'India',
    total_bookings INT DEFAULT 0,
    total_donated NUMERIC(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Table: annadanam (Annadanam Sponsorships)
CREATE TABLE IF NOT EXISTS public.annadanam (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    day_number INT,
    sponsor_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 5116,
    occasion TEXT,                               -- e.g. "Birthday", "Wedding Anniversary", "Memorial"
    display_name TEXT,
    payment_status TEXT NOT NULL DEFAULT 'PENDING',
    status TEXT NOT NULL DEFAULT 'CONFIRMED',    -- 'PENDING' | 'CONFIRMED' | 'CANCELLED'
    is_anonymous BOOLEAN DEFAULT false,
    transaction_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Table: donations (General / Specific Donations)
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id TEXT UNIQUE NOT NULL,
    donor_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    purpose TEXT NOT NULL DEFAULT 'ATI_RUDRAM',   -- 'ATI_RUDRAM' | 'ANNADANAM' | 'VEDA_PANDIT_SAMBHAVANA' | 'YAJNA_MATERIALS' | 'GENERAL_DONATION'
    gotram TEXT,
    nakshatram TEXT,
    address TEXT,
    payment_status TEXT NOT NULL DEFAULT 'SUCCESS',
    transaction_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Table: media_assets (Cloudinary Videos & Images)
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE,
    name TEXT NOT NULL,
    title TEXT,
    description TEXT,
    media_type TEXT NOT NULL DEFAULT 'image',     -- 'video' | 'image' | 'audio'
    cloudinary_public_id TEXT,
    secure_url TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    format TEXT,
    duration TEXT,
    bytes BIGINT,
    metadata JSONB DEFAULT '{}'::jsonb,
    category TEXT DEFAULT 'general',
    day_number INT,
    nakshatra TEXT,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Table: live_stream (Live Stream Switcher)
CREATE TABLE IF NOT EXISTS public.live_stream (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    live_url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_live BOOLEAN NOT NULL DEFAULT false,
    platform TEXT DEFAULT 'youtube',             -- 'youtube' | 'custom' | 'hls'
    channel_name TEXT DEFAULT 'Srikari Ati Rudram Official',
    viewers_count INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Table: announcements (Live Ticker & Alerts)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    priority TEXT NOT NULL DEFAULT 'NORMAL',     -- 'URGENT' | 'HIGH' | 'NORMAL'
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Table: sponsors (Major Yajna & Annadana Sponsors)
CREATE TABLE IF NOT EXISTS public.sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT,
    category TEXT NOT NULL DEFAULT 'MAHAYAJNA',  -- 'MAHAYAJNA' | 'ANNADANA' | 'VEDA_SEVA' | 'DAILY_SEVA'
    amount NUMERIC(10, 2),
    image_url TEXT,
    display_consent BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Table: site_settings (Dynamic Key-Value Configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Table: audit_logs (Admin Action Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id TEXT,
    admin_name TEXT NOT NULL,
    action TEXT NOT NULL,                        -- 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'ATTENDANCE'
    module TEXT NOT NULL,                        -- 'schedule' | 'sevas' | 'bookings' | 'live' | 'gallery' | 'settings'
    record_id TEXT,
    old_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure existing media_assets has all updated columns
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS day_number INT;
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS nakshatra TEXT;
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(selected_date);
CREATE INDEX IF NOT EXISTS idx_bookings_seva ON public.bookings(seva_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(payment_status, booking_status);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON public.schedules(date);
CREATE INDEX IF NOT EXISTS idx_schedules_nakshatra ON public.schedules(nakshatra);
CREATE INDEX IF NOT EXISTS idx_devotees_phone ON public.devotees(phone_number);
CREATE INDEX IF NOT EXISTS idx_media_type ON public.media_assets(media_type, published);
CREATE INDEX IF NOT EXISTS idx_annadanam_date ON public.annadanam(date);
CREATE INDEX IF NOT EXISTS idx_donations_purpose ON public.donations(purpose);

-- Enable RLS on all tables
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nakshatras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sevas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seva_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annadanam ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_stream ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for Website
CREATE POLICY "Public Read schedules" ON public.schedules FOR SELECT TO public USING (true);
CREATE POLICY "Public Read nakshatras" ON public.nakshatras FOR SELECT TO public USING (true);
CREATE POLICY "Public Read sevas" ON public.sevas FOR SELECT TO public USING (active = true);
CREATE POLICY "Public Read seva_availability" ON public.seva_availability FOR SELECT TO public USING (true);
CREATE POLICY "Public Read media_assets" ON public.media_assets FOR SELECT TO public USING (published = true);
CREATE POLICY "Public Read live_stream" ON public.live_stream FOR SELECT TO public USING (true);
CREATE POLICY "Public Read announcements" ON public.announcements FOR SELECT TO public USING (active = true);
CREATE POLICY "Public Read sponsors" ON public.sponsors FOR SELECT TO public USING (active = true AND display_consent = true);
CREATE POLICY "Public Read site_settings" ON public.site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Public Read annadanam" ON public.annadanam FOR SELECT TO public USING (true);

-- Service Role Full Access Policies (For Next.js Server APIs)
CREATE POLICY "Service Role full schedules" ON public.schedules FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role full nakshatras" ON public.nakshatras FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role full sevas" ON public.sevas FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role full seva_availability" ON public.seva_availability FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role full bookings" ON public.bookings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role full devotees" ON public.devotees FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role full annadanam" ON public.annadanam FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role full donations" ON public.donations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role full media_assets" ON public.media_assets FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role full live_stream" ON public.live_stream FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role full announcements" ON public.announcements FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role full sponsors" ON public.sponsors FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role full site_settings" ON public.site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service Role full audit_logs" ON public.audit_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
