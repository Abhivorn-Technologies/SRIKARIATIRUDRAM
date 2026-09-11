-- ==============================================================================
-- SRIKARI ATI RUDRA MAHAYAGNAM — SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. Table: media_assets (For Cloudinary uploaded media: videos, banners, gallery)
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,                       -- e.g. 'main_video'
    name TEXT NOT NULL,                            -- e.g. 'MAINVD.mp4'
    media_type TEXT NOT NULL DEFAULT 'video',      -- 'video' | 'image' | 'audio'
    cloudinary_public_id TEXT,                     -- e.g. 'srikari_atirudram/MAINVD'
    secure_url TEXT NOT NULL,                      -- https://res.cloudinary.com/...
    url TEXT NOT NULL,
    format TEXT,
    duration TEXT,
    bytes BIGINT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & create public read policy
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to media_assets"
ON public.media_assets
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow service role full access to media_assets"
ON public.media_assets
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- 2. Table: seva_bookings (For Devotee Seva Registrations)
CREATE TABLE IF NOT EXISTS public.seva_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT UNIQUE NOT NULL,               -- e.g. 'SAR-20261125-9823'
    seva_id TEXT NOT NULL,
    seva_name TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    selected_date DATE NOT NULL,
    
    -- Devotee Details
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    gothram TEXT,
    nakshatram TEXT,
    rashi TEXT,
    special_prayers TEXT,
    
    -- Payment & Status
    payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'success' | 'failed'
    payment_method TEXT,
    transaction_id TEXT,
    payment_response JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for bookings
ALTER TABLE public.seva_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access to seva_bookings"
ON public.seva_bookings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
