# Enterprise Construction Hub - Quick Start

## 🚀 Get Running with Auth & Payments

### 1. Install & Setup (5 minutes)

```bash
# Clone and install
git clone <repo-url>
cd construction-hub
npm install

# Configure environment
cp .env.example .env
# Edit .env and set:
#   DATABASE_URL=postgresql://...
#   NEXTAUTH_SECRET=<run: openssl rand -base64 32>
#   NEXTAUTH_URL=http://localhost:3000

# Initialize database
npx drizzle-kit push --force
npx tsx src/db/seed.ts

# Run application
npm run dev
```

Open http://localhost:3000 🎉

---

## 🔐 Authentication

### Demo Credentials
```
Email: demo@construction-hub.com
Password: demo123
```

### Sign Up Flow
1. Visit `/auth/signup`
2. Enter company name, email, password
3. **Automatic 3-month free trial starts**
4. Sign in at `/auth/signin`

### Check Your Trial Status

```sql
-- In your database
SELECT 
  name, 
  plan_type,
  trial_ends_at,
  subscription_status
FROM organizations;
```

---

## 📱 Mobile App Development

### Build iOS App

```bash
# Build Next.js
npm run build

# Add iOS platform
npx cap add ios

# Sync assets
npx cap sync

# Open in Xcode (macOS only)
npx cap open ios
```

### Build Android App

```bash
# Build Next.js
npm run build

# Add Android platform
npx cap add android

# Sync assets
npx cap sync

# Open in Android Studio
npx cap open android
```

### Test Mobile Features

```typescript
// In mobile app, camera and GPS work automatically
import { MobilePhotoUpload } from "@/components/mobile-photo-upload";

<MobilePhotoUpload projectId={1} reportId={5} />
```

---

## 💳 Payment Integration (Production)

### 1. Setup Stripe

```bash
# Create account at https://stripe.com
# Get API keys from Dashboard

# Add to .env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 2. Create Products

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe
stripe login

# Create products
stripe products create --name="Professional Plan"
stripe prices create \
  --product=prod_xxx \
  --unit-amount=4900 \
  --currency=usd \
  --recurring[interval]=month
```

### 3. Test Subscription

```bash
# Use test card
# 4242 4242 4242 4242
# Exp: Any future date
# CVC: Any 3 digits
```

---

## 🌐 Offline Mode

### Test Offline Functionality

1. Open DevTools → Application → Service Workers
2. Check "Offline"
3. Create a daily report
4. Check DevTools → Application → IndexedDB → `offline_reports`
5. Uncheck "Offline"
6. Refresh page - data syncs automatically

### Register Service Worker

Add to `src/app/layout.tsx`:

```typescript
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}, []);
```

---

## 📸 GPS Photo Capture

### On Mobile Device

```typescript
// Component automatically detects mobile
<MobilePhotoUpload projectId={projectId} />

// Workflow:
// 1. User clicks "Capture Photo"
// 2. GPS location captured automatically
// 3. Native camera opens
// 4. Photo saved with lat/lng embedded
// 5. Upload to server with metadata
```

### Check GPS Data

```sql
SELECT 
  id,
  trade_tag,
  grid_location,
  latitude,
  longitude,
  uploaded_at
FROM progress_photos
WHERE latitude IS NOT NULL;
```

---

## 🔧 Common Tasks

### Add New User to Organization

```typescript
// Via database or API
await db.insert(users).values({
  id: "user_" + randomBytes(8).toString("hex"),
  name: "Jane Engineer",
  email: "jane@company.com",
  password: await bcrypt.hash("password123", 10),
  role: "engineer",
  organizationId: 1,
});
```

### Extend Trial Period

```sql
UPDATE organizations
SET trial_ends_at = trial_ends_at + INTERVAL '30 days'
WHERE id = 1;
```

### Check Subscription Status

```sql
SELECT 
  o.name,
  o.subscription_status,
  o.plan_type,
  COUNT(p.id) as project_count,
  COUNT(u.id) as user_count,
  o.max_projects,
  o.max_users
FROM organizations o
LEFT JOIN projects p ON p.organization_id = o.id
LEFT JOIN users u ON u.organization_id = o.id
GROUP BY o.id;
```

---

## 🚦 Validation Checklist

### Authentication ✅
- [ ] Can sign up new account
- [ ] Organization created with trial
- [ ] Can sign in with credentials
- [ ] Session persists across page loads
- [ ] Can sign out

### Mobile ✅
- [ ] `capacitor.config.ts` exists
- [ ] Camera permission requested
- [ ] GPS location captured
- [ ] Photo uploads successfully

### Offline ✅
- [ ] Service worker registered
- [ ] Works offline
- [ ] Data queued in IndexedDB
- [ ] Syncs when back online

### Database ✅
- [ ] All 14 tables created
- [ ] Foreign keys working
- [ ] Sample data seeded
- [ ] Indexes created

---

## 🐛 Quick Troubleshooting

### "NEXTAUTH_SECRET not set"
```bash
# Generate secret
openssl rand -base64 32

# Add to .env
NEXTAUTH_SECRET=<paste-output>
```

### Camera not working on mobile
```typescript
// Check iOS Info.plist
<key>NSCameraUsageDescription</key>
<string>Take progress photos</string>

// Check Android manifest
<uses-permission android:name="android.permission.CAMERA" />
```

### Service worker not updating
```javascript
// Hard refresh in browser
Cmd+Shift+R (Mac)
Ctrl+Shift+R (Windows/Linux)

// Or unregister and re-register
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    registrations.forEach(r => r.unregister());
  });
```

---

## 📊 Key URLs

### Web Application
- `/` - Landing page
- `/auth/signin` - Login
- `/auth/signup` - Registration (starts trial)
- `/dashboard` - Main dashboard (protected)

### API Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/nextauth/signin` - Login
- `GET /api/auth/nextauth/session` - Get session
- `POST /api/photos/upload` - Upload GPS photo

### Mobile Deep Links (when deployed)
- `constructionhub://dashboard`
- `constructionhub://daily/new`

---

## 💡 Pro Tips

1. **Use Demo Account** for testing without creating new accounts
2. **Check trial_ends_at** to see when free period expires
3. **Test offline mode** in DevTools before deploying mobile
4. **Use Stripe test mode** until ready for production
5. **Enable GPS** on device for accurate photo tagging

---

## 📞 Support

- **Authentication**: Check `ENTERPRISE_FEATURES.md` section 1
- **Payments**: Check `ENTERPRISE_FEATURES.md` section 2
- **Mobile**: Check `ENTERPRISE_FEATURES.md` section 3
- **Offline**: Check `ENTERPRISE_FEATURES.md` section 4

---

## 🎯 Next Deployment Steps

1. **Development** ✅ (You are here)
2. **Stripe Setup** (30 min)
3. **Mobile Build** (2 hours)
4. **Production Deploy** (1 hour)
5. **App Store Submission** (varies)

---

**Enterprise Construction Hub - From Sign-Up to Mobile in Minutes!** 🚀
