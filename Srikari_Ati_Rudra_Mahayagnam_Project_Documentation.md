# SRIKARI ATI RUDRA MAHAYAGNAM
## Website & Admin Panel — Complete Project Documentation

**Official Title**: LOKAKALYANAHITA NAKSHATRA SHANTHI SAHITA SRIKARI ATI RUDRA MAHAYAGNAM  
**Organization**: Srikari Seva Samiti, Hyderabad, India · In association with Srikari Spiritual, USA  

---

## 1. Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Backend / Database** | Supabase — PostgreSQL, Authentication, Row Level Security, REST APIs |
| **Media** | Cloudinary — images, videos, gallery and large media |
| **Source Control** | GitHub |
| **Deployment / Hosting** | Vercel / Hostinger Node.js Application Server |

---

## 2. Project Purpose

- Premium spiritual information and participation platform for Srikari Ati Rudra Mahayagnam.
- 28-day programme information, Special Seva booking, donations, Annadanam, gallery, live streams and sponsors.
- English, Telugu and Hindi application-level localization.
- Admin management through a protected Supabase-backed Admin Panel.

---

## 3. Branding & Rules

- Always spell **MAHAYAGNAM**, not MAHAYAJNAM.
- Telugu brand spelling: **శ్రీకరి అతి రుద్ర మహాయజ్ఞం**.
- Invocation: **🕉️ శ్రీ గురుభ్యో నమః**.
- Closing: **|| OM NAMAH SHIVAYA ||**.
- Visual language: deep maroon (`#35030A`), gold (`#F2C14E`), cream/warm white (`#FFF8E8`) and subtle gold glow.
- Do not display the website URL anywhere in the website UI.
- Do not add PAN to booking forms.
- **Contact**: 9490462652 · 7569253943 · info@srikariatirudram.com
- **Temple**: Srikari Devi Aalayam, Srikari Peetham, Plot No. 42, Nandanavanam Layout, Basaragadi, beside MLRIT, Medchal Road, Hyderabad, Telangana.

---

## 4. Main Navigation

- `HOME`
- `ABOUT THE MAHAYAGNAM`
- `28-DAY SCHEDULE`
- `SPECIAL SEVAS`
- `ANNADANAM`
- `LIVE`
- `GALLERY`
- `DONATE`
- `CONTACT`

---

## 5. Homepage

- **Hero**: LOKAKALYANAHITA NAKSHATRA SHANTHI + SRIKARI ATI RUDRA MAHAYAGNAM.
- Event dates/countdown and Quick Seva Actions.
- Today's Nakshatra & Programme / Divine Darshan.
- 28-Day Schedule preview and Find My Nakshatra.
- Special Sevas, Nakshatra Shanthi and Annadanam.
- About Ati Rudram preview and participation CTA.
- Gallery, Live, Sponsors, Contact, FAQ and Footer.

---

## 6. 28-Day Schedule — SEPARATE FEATURE

**Routes**: `/[locale]/schedule` (`/en/schedule`, `/te/schedule`, `/hi/schedule`)

The 28-Day Schedule is an independent programme-viewing feature. It must not be replaced, redesigned or merged with the Special Seva booking system.

- Shows Day 1–28, date, Nakshatra, Rasi, daily programme and special programme.
- Its existing UI, navigation, animations and booking behavior remain unchanged.
- Shared schedule DATA may be read by Special Seva booking, but the Special Seva booking UI is separate.

---

## 7. Special Sevas

| # | Seva | Amount (₹) |
| :-: | :--- | :-: |
| 1 | Ati Rudram Donation | ₹216 |
| 2 | Ekadasa Rudra Abhishekam | ₹5,116 |
| 3 | Nakshatra Shanthi | ₹10,116 |
| 4 | Chandi Homam | ₹12,116 |
| 5 | Sarpa Suktam Homam | ₹12,116 |
| 6 | Ashlesha Bali | ₹12,116 |
| 7 | Valli–Devasena Subramanyeswara Kalyanam | ₹1,116 |
| 8 | Parvathi–Parameswara Maha Shanti Kalyanam | ₹1,116 |
| 9 | One-Day Annadanam | ₹25,116 |

---

## 8. Special Seva Booking

```
SPECIAL SEVA
↓
SELECT DAY — DAY 1 to DAY 28
↓
DEVOTEE DETAILS
↓
PAYMENT
↓
BOOKING CONFIRMATION
```

BOOK NOW from `/sevas` must NOT redirect to `/schedule`. Separate routes:
- `/[locale]/book-seva/day` (or `/[locale]/special-seva-booking/day`)
- `/[locale]/book-seva/details`
- `/[locale]/book-seva/payment`
- `/[locale]/book-seva/success`

### Devotee Details Collected:
- Devotee Full Name *
- Gotram *
- Janma Nakshatra * — editable custom dropdown for the devotee's birth star.
- Rasi — editable custom dropdown.
- Mobile / WhatsApp Number *
- Email Address
- Family Members / Sankalpam Names
- Postal Address for Prasadam Delivery
- Devotee Participation — YES, I WILL ATTEND / NO, I WILL NOT ATTEND.

*The programme-day Nakshatra and the devotee's Janma Nakshatra are different fields and must be stored separately.*

### Confirmation
Show **HAR HAR MAHADEV, BOOKING CONFIRMED**, receipt ID, devotee name, Gotram, Seva, Day, programme date, programme Nakshatra, Janma Nakshatra, Rasi, participation, amount and payment status. Printable receipt ticket and confetti celebration.

---

## 9. Annadanam

- **Heading**: పవిత్ర అన్నదాన సమర్పణ (Sacred Annadanam Offering).
- **One-day sponsorship**: ₹25,116.
- **Additional options**: ₹501, ₹1,116, ₹5,116, ₹11,116, ₹25,116 and Custom Amount.
- Collect sponsor name, mobile, email, occasion/in memory of, display name and privacy choice.
- Date status: AVAILABLE / SPONSORED.

---

## 10. Gallery, Live & Sponsors

- Gallery has Photos and Videos; media path is `public/assets/gallery/` and Cloudinary.
- Video cards use portrait 9:16 presentation with play button.
- Large video media is externally hosted on Cloudinary rather than committed to GitHub.
- Live supports editable live status and stream embed URL.
- Sponsor categories: Mahayajna, Annadana Seva, Veda Seva and Daily Seva Sponsors.

---

## 11. About & Educational Content

- About Srikari Temple and history.
- Sri Rudram, Ekadasa Rudra and Ati Rudram.
- Rudrabhishekam, Nakshatras and Nakshatra Shanthi.
- Purpose of Lokakalyanahita Mahayagnam.
- Spiritual guidance, trustees, Srikari Seva Samiti, mentor and advisory board.

---

## 12. Data Architecture

```
src/data/
├── site.ts
├── navigation.ts
├── sevas.ts
├── schedule.ts
├── nakshatras.ts
├── annadanam.ts
├── donations.ts
├── gallery.ts
├── live.ts
├── sponsors.ts
├── about.ts
└── faq.ts

src/services/
├── booking.service.ts
├── specialSevaBooking.service.ts
├── seva.service.ts
├── schedule.service.ts
├── donation.service.ts
├── annadanam.service.ts
└── devotee.service.ts
```

---

## 13. Supabase Database

Supabase is the primary backend/data platform: PostgreSQL database, Authentication, Row Level Security, APIs and realtime capabilities where required.

### Database Tables:
- `admins`
- `devotees`
- `sevas`
- `schedule_days` / `schedules`
- `bookings`
- `booking_details`
- `payments`
- `sankalpams`
- `annadanam_dates`
- `annadanam_sponsors`
- `donations`
- `gallery`
- `live_streams`
- `sponsors`
- `faq`
- `content`
- `contact_settings` / `site_settings`

Uses RLS and protected admin routes. Sensitive operations are executed server-side.

---

## 14. Cloudinary Media Storage

Cloudinary is the media platform for images, gallery photos, videos, sponsor logos and large media.

```
Admin Upload
↓
Cloudinary
↓
Cloudinary URL / Public ID
↓
Supabase stores metadata
↓
Next.js displays optimized media
```

Never expose Cloudinary API secrets in client-side code.

---

## 15. Admin Panel — Final Documentation

**Admin model**: ONE ADMIN ROLE. The panel is protected by Supabase Authentication & Admin Auth session guard.

### Admin Navigation (`/admin`):
- `Dashboard Hub`
- `Bookings (28-Day Seva Bookings)`
- `Schedule & Rituals`
- `Sevas Catalog`
- `Devotees Database`
- `Payments & Refunds`
- `Priest Sankalpam Register (/admin/sankalpam)`
- `Annadanam Meals`
- `General Donations`
- `Gallery & Photos`
- `Live Broadcast`
- `Mahayagnam Sponsors`
- `Content & FAQ`
- `Contact Enquiries`
- `Reports`
- `System Settings`

*Do NOT add Website, SEO, Metadata or Social Sharing menus.*

### Dashboard Capabilities:
- Total bookings & confirmed bookings count.
- Total revenue & donations aggregate.
- Recent registrations & live broadcast status.
- Master Operations 5-Column Grid Hub.

### Bookings:
- Search/filter bookings.
- View booking and Sankalpam details.
- View Seva, Day, date, amount and payment status.
- View devotee participation (Attending in Person / Courier Prasadam).
- Manage permitted cancellation/refund states.
- Generate receipt ticket.

### Schedule:
Manage Day, date, Nakshatra, Rasi, programme, special programme, status and availability. This is the 28-Day Schedule data and must not replace the separate Special Seva booking UI.

### Sevas:
Manage Seva name, description, amount, icon/media, active state and availability.

### Devotees:
Name, Mobile, Email, Gotram, Janma Nakshatra, Rasi, Family/Sankalpam names, Address, Participation, Booking history.

### Payments:
Payment ID, Booking ID, Devotee, Seva, Amount, Payment method, Payment status, Transaction reference, Date, Refund status.

### Sankalpam (`/admin/sankalpam`):
Daily report & printable A4 register for Vedic Priests: Serial Number, Booking ID, Devotee Name, Gotram, Janma Nakshatra, Sankalpam Names, Seva, Attendance. Useful filters: Day (Day 1–28), Date, Seva, payment status and participation. Includes Priest Chanting Checkboxes & Signature/Seal blocks.

### Annadanam:
Manage date availability, sponsor, amount, mobile, occasion, display name, privacy and payment status.

### Gallery / Live / Sponsors:
- **Gallery**: Upload/manage media through Cloudinary and store metadata in Supabase.
- **Live**: Manage live status and live/embed URLs.
- **Sponsors**: Manage category, amount, display name, privacy, logo, description and status.

### Content / FAQ / Contact:
- **Content**: Manage approved content and language variants.
- **FAQ**: Add/edit/delete/publish/reorder English, Telugu and Hindi FAQs.
- **Contact**: Manage official phone, WhatsApp, email, address and approved Maps link.

### Reports:
- Booking Report
- Sankalpam Report
- Donation Report
- Annadanam Report
- Sponsor Report

### Settings & Security:
- Event, contact, payment, email/WhatsApp, Cloudinary, live, language and booking settings.
- Use Supabase Auth and RLS.
- Never expose database, payment, Cloudinary API secret or other private credentials in browser code.

---

## 16. Final Business Rules

- 28-Day Schedule and Special Sevas are separate systems.
- Special Seva BOOK NOW → separate Day 1–28 selection → Devotee Details → Payment → Confirmation.
- Special Seva Devotee Details has editable Janma Nakshatra and Rasi dropdowns.
- Programme Nakshatra and devotee Janma Nakshatra are separate fields.
- Day 28 is Rohini, 22 December 2026.
- No PAN and no website URL in website UI.
- One Admin role only.
- Supabase handles backend/database/auth; Cloudinary handles media.
- All pages must be responsive and free from clipping/overflow.

---

## 17. Final User Journey

```
HOME
├── ABOUT
├── 28-DAY SCHEDULE → existing independent schedule
├── SPECIAL SEVAS → BOOK NOW → SELECT DAY 1-28 → DEVOTEE DETAILS → PAYMENT → CONFIRMATION
├── ANNADANAM
├── LIVE
├── GALLERY
├── DONATE
└── CONTACT
```

---

## 18. Hosting & Infrastructure Details

For every component of this project, the hosting platform, cloud service, and exact purpose are documented below:

| Component / Service | Hosting Platform / Service Used | Exact Purpose & Role |
| :--- | :--- | :--- |
| **Web Application Server** | **Vercel / Hostinger Node.js Application Server** | Hosts the Next.js 14 App Router application, handles Server-Side Rendering (SSR), API routes, and serves internationalized pages (`/en`, `/te`, `/hi`). |
| **Database Engine** | **Supabase (PostgreSQL 15)** | Primary relational cloud database. Hosts all tables (`bookings`, `sevas`, `site_settings`, `donations`, `schedules`), handles connection pooling on port 5432, Row Level Security (RLS), and database backups. |
| **Media & Asset CDN** | **Cloudinary CDN** | Cloud object storage for high-definition Yagnam videos (`MAINVD.mp4`), photo gallery uploads, sponsor logos, and official temple header logos. |
| **Payment Processing** | **Razorpay Gateway & Direct Temple UPI VPA** | Handles encrypted payment transactions. Supports Credit/Debit Cards, Net Banking, and direct 1-tap mobile UPI links (GPay, PhonePe, Paytm, BHIM) with dynamic QR codes. |
| **Source Code Repository** | **GitHub** | Version control repository hosting source code, migration scripts, and automated deployment triggers. |
| **Domain & DNS Management** | **Custom Domain (`srikariatirudram.org`)** | Domain DNS pointing to the application server edge network with auto-renewing SSL/TLS certificates. |

---

*Documentation Version 2.0 — Approved for Client & Technical Handover*  
*|| OM NAMAH SHIVAYA ||*
