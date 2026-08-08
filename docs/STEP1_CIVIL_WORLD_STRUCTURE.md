# Civil World — STEP 1 Foundation Blueprint

## 1) Target Directory Structure (Next.js App Router + Secure DAL + Mobile)

```text
civil-world/
├─ .env
├─ .env.example
├─ .gitignore
├─ next.config.ts
├─ tsconfig.json
├─ postcss.config.mjs
├─ eslint.config.mjs
├─ drizzle.config.json
├─ capacitor.config.ts
├─ package.json
├─ public/
│  ├─ sw.js
│  ├─ manifest.webmanifest
│  ├─ icons/
│  │  ├─ icon-192.png
│  │  └─ icon-512.png
│  └─ offline.html
├─ docs/
│  ├─ STEP1_CIVIL_WORLD_STRUCTURE.md
│  ├─ ANDROID_HARDENING.md
│  └─ IOS_HARDENING.md
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/
│  │  │  └─ page.tsx
│  │  ├─ auth/
│  │  │  ├─ signin/page.tsx
│  │  │  ├─ signup/page.tsx
│  │  │  ├─ verify-otp/page.tsx
│  │  │  ├─ forgot-password/page.tsx
│  │  │  └─ reset-password/page.tsx
│  │  ├─ dashboard/
│  │  │  ├─ page.tsx
│  │  │  ├─ boq/page.tsx
│  │  │  ├─ daily/page.tsx
│  │  │  ├─ concrete/page.tsx
│  │  │  ├─ photos/page.tsx
│  │  │  ├─ documents/page.tsx
│  │  │  ├─ rfis/page.tsx
│  │  │  ├─ reports/page.tsx
│  │  │  └─ settings/page.tsx
│  │  ├─ api/
│  │  │  ├─ auth/
│  │  │  │  ├─ nextauth/route.ts
│  │  │  │  ├─ register/route.ts
│  │  │  │  ├─ otp/send/route.ts
│  │  │  │  ├─ otp/verify/route.ts
│  │  │  │  └─ password/reset/route.ts
│  │  │  ├─ billing/
│  │  │  │  ├─ checkout/route.ts
│  │  │  │  └─ portal/route.ts
│  │  │  ├─ webhooks/
│  │  │  │  └─ stripe/route.ts
│  │  │  ├─ ai/
│  │  │  │  └─ generate-report/route.ts
│  │  │  ├─ photos/upload/route.ts
│  │  │  └─ health/route.ts
│  │  ├─ layout.tsx
│  │  └─ globals.css
│  ├─ actions/
│  │  ├─ auth.actions.ts
│  │  ├─ billing.actions.ts
│  │  ├─ report.actions.ts
│  │  ├─ boq.actions.ts
│  │  └─ daily.actions.ts
│  ├─ db/
│  │  ├─ index.ts
│  │  ├─ schema.ts
│  │  └─ seed.ts
│  ├─ lib/
│  │  ├─ auth.ts
│  │  ├─ crypto.ts
│  │  ├─ sanitize.ts
│  │  ├─ headers.ts
│  │  ├─ stripe.ts
│  │  ├─ ai.ts
│  │  ├─ otp/
│  │  │  ├─ otp.service.ts
│  │  │  ├─ sms.twilio.ts
│  │  │  └─ email.resend.ts
│  │  ├─ ratelimit.ts
│  │  ├─ rbac.ts
│  │  ├─ tenant.ts
│  │  └─ validations/
│  │     ├─ auth.schemas.ts
│  │     ├─ otp.schemas.ts
│  │     └─ boq.schemas.ts
│  ├─ dal/
│  │  ├─ base.ts
│  │  ├─ organizations.dal.ts
│  │  ├─ users.dal.ts
│  │  ├─ projects.dal.ts
│  │  ├─ reports.dal.ts
│  │  └─ boq.dal.ts
│  ├─ components/
│  │  ├─ app-shell/
│  │  ├─ auth/
│  │  ├─ dashboard/
│  │  ├─ mobile/
│  │  └─ ui/
│  ├─ mobile/
│  │  ├─ deep-links.ts
│  │  ├─ secure-storage.ts
│  │  ├─ camera.ts
│  │  ├─ geolocation.ts
│  │  └─ offline-queue.ts
│  ├─ middleware.ts
│  └─ types/
│     ├─ auth.d.ts
│     └─ next-auth.d.ts
├─ android/
│  ├─ app/src/main/AndroidManifest.xml
│  ├─ app/proguard-rules.pro
│  └─ app/build.gradle
└─ ios/
   ├─ App/App/Info.plist
   └─ App/App/App.entitlements
```

## 2) Dependency Baseline (Installed)

- Framework & Core: `next`, `react`, `react-dom`, `typescript`
- Database: `drizzle-orm`, `pg`, `drizzle-kit`
- Auth & Security: `next-auth`, `@auth/drizzle-adapter`, `bcryptjs`, `argon2`, `jose`, `otplib`, `isomorphic-dompurify`, `zod`
- OTP Channels: `twilio`, `resend`, `libphonenumber-js`
- Rate Limiting: `@upstash/ratelimit`, `@upstash/redis`
- AI Engine: `ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`
- Billing: `stripe`, `@stripe/stripe-js`
- Mobile Native: `@capacitor/core`, `@capacitor/cli`, `@capacitor/camera`, `@capacitor/geolocation`, `@capacitor/network`, `@capacitor/app-launcher`, `@capacitor/preferences`
- Offline Engine: `localforage`, `idb`, `workbox-window`
- Reports: `@react-pdf/renderer`, `exceljs`
- UI/UX: `tailwindcss`, `lucide-react`, `sonner`, Radix UI packages, `clsx`, `tailwind-merge`, `class-variance-authority`

## 3) Security Baseline Goals for Next Steps

- Zero-trust request validation using Zod on every auth, OTP, billing, and AI route.
- Strict tenant isolation (`organization_id`) in DAL for every query path.
- Redis-backed route rate limits for sensitive endpoints.
- CSP/HSTS/XFO/NoSniff/Referrer policy headers.
- Secure token storage for mobile through Capacitor secure preferences bridge and native keystore patterns.
- Stripe webhook signature validation and immutable audit event logging.
```