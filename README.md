# 🕉️ SRIKARI ATI RUDRA MAHAYAGNAM — Complete Project Documentation

> **Official Event Title**: LOKAKALYANAHITA NAKSHATRA SHANTHI SAHITA SRIKARI ATI RUDRA MAHAYAGNAM  
> **Organization**: Srikari Seva Samiti, Hyderabad, India (In association with Srikari Spiritual, USA)  
> **Repository**: Private / Official Client Repository  
> **Project Version**: 2.0.0 (Production Ready)  

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Hosting & Infrastructure Details](#-hosting--infrastructure-details)
3. [Technology Stack](#-technology-stack)
4. [Architecture & Folder Structure](#-architecture--folder-structure)
5. [Database Schema & Architecture](#-database-schema--architecture)
6. [API & Integration Endpoints](#-api--integration-endpoints)
7. [Third-Party Services & Accounts](#-third-party-services--accounts)
8. [Environment Variables Reference](#-environment-variables-reference)
9. [Deployment Process & Hosting Setup](#-deployment-process--hosting-setup)
10. [Business Rules & Brand Compliance](#-business-rules--brand-compliance)
11. [Current Project Status & Verification](#-current-project-status--verification)
12. [Developer Handover & Onboarding Guide](#-developer-handover--onboarding-guide)

---

## 🌟 Project Overview

**Srikari Ati Rudra Mahayagnam** is a 28-day grand Vedic Yagnam featuring **14,641 Sri Rudra Trishathi Japas** and **1,464 Sri Rudra Homams**, scheduled from **November 25, 2026 to December 22, 2026** at Srikari Sri Kshetram, Hyderabad, Telangana.

This web application serves as the official digital portal and operations control center for the Mahayagnam, enabling global devotees to:
- Browse the **28-Day Yagnam Schedule**, daily Nakshatra, and ritual details.
- Register & book **Special Sevas**, Nakshatra Shanthi, Homams, and Abhishekams.
- Sponsor **Annadanam (Sacred Food Distribution)** slots.
- Make general donations for Veda Seva, Yajnashala construction, and Pundit Dakshina.
- View **Live Broadcast Streams** and Photo/Video Archives.
- Download & print official **Seva Tickets**, E-Receipts, and Priest Sankalpam Registers.

The project also includes a **Master Admin Control Center** (`/admin`) for temple management to oversee 28-day bookings, general donations, Annadanam sponsors, live broadcasts, photo galleries, and print Priest Sankalpam chanting sheets for Yajnashala Pundits.

---

## 🌐 Hosting & Infrastructure Details

Per organizational technical compliance, the platform infrastructure is configured across dedicated providers:

| Hosting Layer | Provider / Service Used | Exact Purpose |
| :--- | :--- | :--- |
| **Web Application Server** | **Vercel / Hostinger Node.js Web Hosting** | Next.js 14 App Router server-side rendering (SSR), API Route handlers, and static asset delivery. |
| **Database Server** | **Supabase (PostgreSQL 15)** | Managed PostgreSQL relational database with Connection Pooling, SSL encryption, and automated backups. |
| **Media & Assets Storage** | **Cloudinary CDN / Supabase Object Storage** | High-speed global CDN storage for gallery photos, HD videos (`MAINVD.mp4`), and official branding logos. |
| **Payment Gateway** | **Razorpay & Direct Temple UPI VPA** | Encrypted payment processing supporting Credit/Debit Cards, Net Banking, Instant Mobile UPI Deep Links, and QR Codes. |
| **Domain & DNS** | **Custom Domain (`srikariatirudram.org`)** | Primary domain pointing to Vercel/Hostinger edge network with SSL/TLS encryption. |

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework**: [Next.js 14.2.35](https://nextjs.org/) (App Router paradigm with React Server Components & Client Components)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/) (Strict mode enabled, 0 type errors)
- **Styling**: Vanilla CSS Modules + [Tailwind CSS 3.4](https://tailwindcss.com/) with a custom sacred design palette (`#35030A` Deep Burgundy, `#F2C14E` Divine Gold, `#FAF4E6` Ivory White)
- **Icons**: [Lucide React](https://lucide.dev/) icon library
- **Internationalization (i18n)**: `next-intl` supporting English (`/en`), Telugu (`/te`), and Hindi (`/hi`)
- **UI Utilities**: `canvas-confetti` for celebratory booking confirmations, `clsx`, `tailwind-merge`

### Backend & Database Architecture
- **API Runtime**: Next.js Server API Routes (`/src/app/api/...`) with `force-dynamic` execution
- **Database Driver**: `pg` (node-postgres) connected to Supabase PostgreSQL Connection Pooler (`DATABASE_URL`) and Direct Migration endpoint (`DIRECT_URL`)
- **Service Layer Pattern**: Decoupled service architecture (`/src/services/server/...`) for bookings, sevas, donations, annadanam, schedules, and reports

---

## 📂 Architecture & Folder Structure

```
SRIKARIATIRUDRAM/
├── public/
│   ├── assets/
│   │   ├── icons/            # Favicon, SVG logos, print logo.png
│   │   └── images/           # Background graphics, hero banners
├── src/
│   ├── app/                  # Next.js 14 App Router
│   │   ├── [locale]/         # Multilingual localized routes (en, te, hi)
│   │   │   ├── admin/        # Protected Master Admin Command Center
│   │   │   │   ├── bookings/ # 28-Day Seva Bookings management
│   │   │   │   ├── sevas/    # Special Sevas catalog & pricing
│   │   │   │   ├── sankalpam/# Yajnashala Priest Sankalpam Register
│   │   │   │   ├── donations/# General Donations ledger
│   │   │   │   ├── annadanam/# Annadanam Meals management
│   │   │   │   ├── gallery/  # Photos & Videos Cloudinary upload
│   │   │   │   ├── live/     # Live Stream URL configuration
│   │   │   │   ├── sponsors/ # Maha Poshaka Sponsor directory
│   │   │   │   ├── faq/      # Multilingual FAQ management
│   │   │   │   └── settings/ # Temple UPI VPA & Dakshina rules
│   │   │   ├── book-seva/    # Public 4-Step Booking Wizard
│   │   │   ├── schedule/     # 28-Day Independent Schedule Page
│   │   │   ├── special-sevas/# Special Sevas Catalog Page
│   │   │   ├── annadanam/    # Annadanam Sponsorship Page
│   │   │   ├── gallery/      # Public Photo & Video Media Center
│   │   │   ├── donate/       # General Donations Page
│   │   │   └── contact/      # Contact & Directions Page
│   │   └── api/              # Server API Endpoints
│   │       ├── admin/        # Admin REST APIs (reports, settings, upload)
│   │       ├── bookings/     # Seva registration handlers
│   │       ├── payments/     # Razorpay order creation & signature verification
│   │       └── settings/     # Public dynamic settings API
│   ├── components/           # Reusable UI Components
│   │   ├── admin/            # Admin Sidebar, Header, Stat Cards
│   │   ├── booking/          # PaymentUI, BookingStepper, Receipt Ticket
│   │   ├── home/             # Hero Section, MainVideoSection, Darshan
│   │   ├── layout/           # Public Header, Footer, MobileNav
│   │   └── ui/               # Button, Card, Input UI primitives
│   ├── i18n/                 # Localization config & routing wrappers
│   ├── lib/                  # Database client (db.ts), Razorpay client, utils
│   ├── messages/             # i18n JSON translations (en.json, te.json, hi.json)
│   ├── services/             # Client & Server service abstraction layer
│   └── types/                # TypeScript interface definitions
├── scratch/                  # Maintenance & DB seed utility scripts
├── .env                      # Local environment variable configuration
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Custom theme & color palette
└── tsconfig.json             # TypeScript compiler settings
```

---

## 🗄️ Database Schema & Architecture

The application runs on PostgreSQL (Supabase). Below are the core tables and their structures:

### 1. `public.site_settings`
Stores dynamic site-wide configurations editable from `/admin/settings`.
- `key` (VARCHAR(100) PRIMARY KEY): Setting key (e.g. `temple_upi_id`, `site_title`, `kalyanam_amount`).
- `value` (JSONB): Setting value string/number.
- `description` (TEXT): Description of the setting.
- `updated_at` (TIMESTAMP): Last updated timestamp.

### 2. `public.bookings`
Stores all registered Seva bookings and registrations.
- `booking_id` (VARCHAR(100) PRIMARY KEY): E.g. `SAR-2026-849201`.
- `full_name` (VARCHAR(255)): Devotee's primary name.
- `phone_number` (VARCHAR(50)): Mobile / WhatsApp contact.
- `email` (VARCHAR(255)): Email address.
- `gotram` (VARCHAR(100)): Devotee's Gotram.
- `janma_nakshatra` (VARCHAR(100)): Devotee's birth star.
- `rasi` (VARCHAR(100)): Rasi.
- `sankalpam_names` (TEXT): Family members' names for priest chanting.
- `selected_date` (DATE): Yagnam day date.
- `day_number` (INT): Day 1 through Day 28.
- `seva_name` (VARCHAR(255)): Name of booked Seva.
- `amount` (NUMERIC): Dakshina amount in INR.
- `attending_personally` (BOOLEAN): `true` if attending in person, `false` for courier.
- `payment_status` (VARCHAR(50)): `PENDING`, `CONFIRMED`, `SUCCESS`.
- `payment_method` (VARCHAR(50)): `upi`, `card`, `netbanking`.
- `transaction_id` (VARCHAR(255)): Razorpay payment ID or UTR number.
- `created_at` (TIMESTAMP): Registration timestamp.

### 3. `public.sevas`
Master catalog of available Sevas and Dakshina pricing.
- `id` (VARCHAR(100) PRIMARY KEY)
- `title` (VARCHAR(255)): English title.
- `title_te` (VARCHAR(255)): Telugu title.
- `category` (VARCHAR(100)): `homam`, `abhishekam`, `archana`, `kalyanam`, `special`, `donation`.
- `amount` (NUMERIC): Price in INR.
- `capacity` (INT): Daily booking capacity limit.
- `active` (BOOLEAN): Visible status.

### 4. `public.donations`
General yagnam contribution records.
- `donation_id` (VARCHAR(100) PRIMARY KEY)
- `donor_name` (VARCHAR(255))
- `phone` (VARCHAR(50))
- `email` (VARCHAR(255))
- `amount` (NUMERIC)
- `purpose` (VARCHAR(100)): `yajnashala`, `veda_seva`, `annadanam`, `general`.
- `payment_status` (VARCHAR(50))

### 5. `public.schedules`
28-Day Mahayagnam daily schedule registry.
- `day_number` (INT PRIMARY KEY): 1 to 28.
- `date` (DATE): Calendar date (2026-11-25 to 2026-12-22).
- `date_display` (VARCHAR(100))
- `nakshatra` (VARCHAR(100)): Daily ritual Nakshatra.
- `day_type` (VARCHAR(100)): Regular / Special.
- `title` (VARCHAR(255))
- `special_programme` (TEXT)

### 6. `public.media_assets` & `public.sponsors`
Stores gallery photos, videos, and sponsor directories.

---

## 🔌 API & Integration Endpoints

| HTTP Method | Endpoint Path | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/settings` | Returns public site settings (Temple UPI VPA, amounts) | Public |
| `GET` | `/api/sevas` | Fetches active Sevas catalog | Public |
| `GET` | `/api/schedule` | Fetches 28-day schedule registry | Public |
| `POST` | `/api/bookings` | Creates a new Seva booking registration | Public |
| `POST` | `/api/payments/create-order` | Generates a Razorpay Order ID | Public |
| `POST` | `/api/payments/verify-payment` | Verifies Razorpay payment signature & confirms booking | Public |
| `GET` | `/api/admin/settings` | Fetches all system settings for admin edit | Admin Protected |
| `PATCH` | `/api/admin/settings` | Updates system settings in Supabase | Admin Protected |
| `GET` | `/api/admin/reports/sankalpam` | Fetches Priest Sankalpam chanting report by date/day | Admin Protected |
| `GET` | `/api/admin/reports/bookings` | Financial & bookings audit report | Admin Protected |
| `POST` | `/api/admin/upload/cloudinary` | Generates signed upload token for Cloudinary media | Admin Protected |

---

## 🔑 Environment Variables Reference

Create or update your `.env` file in the root directory:

```env
# ==============================================================================
# SRIKARI ATI RUDRA MAHAYAGNAM — ENVIRONMENT CONFIGURATION
# ==============================================================================

# --- App Domain Configuration ---
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# --- Supabase Database Configuration ---
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>

# PostgreSQL Database Connection Strings
DATABASE_URL=postgresql://postgres:<password>@db.<your-supabase-ref>.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres.<your-supabase-ref>:<password>@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres

# --- Cloudinary Media Storage Configuration ---
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ic0bztee
CLOUDINARY_API_KEY=398724935438219
CLOUDINARY_API_SECRET=OwqUsjK5_DvwJ41zL-4wUjWBVW8
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=srikari_preset

# --- Razorpay Payment Gateway Credentials ---
# Test Keys: rzp_test_Tb4Ui4norukuyH | Live Keys: rzp_live_...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_Tb4Ui4norukuyH
RAZORPAY_KEY_SECRET=hR1AEulPFS17UcjJKw1uxQMS
```

---

## 🚀 Deployment Process & Hosting Setup

### Deploying to Vercel (Recommended)
1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Deploy production build"
   git push origin main
   ```
2. Log into [Vercel Dashboard](https://vercel.com/) and click **New Project**.
3. Import your GitHub repository `SRIKARIATIRUDRAM`.
4. In **Environment Variables**, paste all keys from `.env`.
5. Click **Deploy**. Vercel will automatically build and assign your domain.

### Deploying to Hostinger / Node.js Server
1. Run local build check:
   ```bash
   npm run build
   ```
2. Upload codebase to Hostinger Node.js Web Application Manager.
3. Set Node.js version to `18.x` or `20.x`.
4. Set build command: `npm run build`
5. Set start command: `npm run start`

---

## 📜 Business Rules & Brand Compliance

1. **Official Spelling Rules**:
   - Always spell **MAHAYAGNAM**, never *MAHAYAJNAM*.
   - Closing invocation text: `|| OM NAMAH SHIVAYA ||`.
2. **Design Language**:
   - Primary Palette: Deep Burgundy (`#35030A`, `#240006`), Divine Gold (`#F2C14E`, `#D6A532`), Ivory Cream (`#FFF8E8`, `#FAF4E6`).
3. **Data Integrity Rules**:
   - Programme Nakshatra (the day's ritual star) and Devotee's Janma Nakshatra (birth star) are distinct database fields stored separately.
   - Day 28 of the Mahayagnam is fixed as **Rohini Nakshatra, December 22, 2026**.

---

## ✅ Current Project Status & Verification

- **Code Status**: 100% Feature Complete & Production Ready.
- **TypeScript Compiler Check**: `npx tsc --noEmit` passed with **0 errors**.
- **Hydration Safety**: Fully resolved with `mounted` state guards and `suppressHydrationWarning`.
- **Payment Flow**: Verified with both Razorpay Popup Checkout and Direct Temple UPI QR & Mobile App launch.
- **Admin Center**: Operational with Priest Sankalpam Register, 28-day bookings, Seva pricing manager, and CSV export.

---

## 👨‍💻 Developer Handover & Onboarding Guide

To run this project locally on a new developer machine:

1. **Clone Repository & Install Dependencies**:
   ```bash
   git clone https://github.com/your-org/SRIKARIATIRUDRAM.git
   cd SRIKARIATIRUDRAM
   npm install
   ```

2. **Setup Environment Variables**:
   Copy `.env.example` or create `.env` with the credentials listed above.

3. **Verify Type Safety**:
   ```bash
   npx tsc --noEmit
   ```

4. **Launch Local Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Access Admin Control Center**:
   Navigate to `http://localhost:3000/en/admin` (or `/te/admin` / `/hi/admin`).

---

*Documentation maintained by Srikari Ati Rudra Mahayagnam Engineering Team.*  
*|| OM NAMAH SHIVAYA ||*
