# Construction Management Hub - Quick Start Card

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)

### Installation

```bash
# 1. Clone & Install
git clone <repo-url>
cd construction-hub
npm install

# 2. Configure Database
echo "DATABASE_URL=postgresql://user:pass@host:5432/db" > .env

# 3. Initialize Database
npx drizzle-kit push
npx tsx src/db/seed.ts

# 4. Run Application
npm run dev
```

Open http://localhost:3000 🎉

---

## 📱 Application Structure

### Main Routes

| URL | Description |
|-----|-------------|
| `/` | Landing page with feature overview |
| `/dashboard` | Executive KPI dashboard |
| `/dashboard/daily` | Daily site reports |
| `/dashboard/boq` | Bill of Quantities (BOQ) |
| `/dashboard/concrete` | Concrete pour tracking |
| `/dashboard/rfis` | RFI management |
| `/dashboard/deliveries` | Material deliveries |
| `/dashboard/photos` | Progress photos |
| `/dashboard/notes` | Field notes |
| `/dashboard/documents` | Document vault |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/projects` | GET, POST | Project CRUD |
| `/api/boq` | GET, POST | BOQ items |
| `/api/daily-reports` | GET, POST | Daily reports |
| `/api/concrete` | GET, POST | Concrete pours |
| `/api/rfis` | GET, POST | RFIs |
| `/api/health` | GET | Health check |

---

## 🗄️ Database Tables

1. **projects** - Project registry
2. **daily_site_reports** - Daily logs
3. **concrete_pours** - QC tracking
4. **boq_items** - Bill of Quantities
5. **rfis** - Information requests
6. **material_deliveries** - Delivery tracking
7. **progress_photos** - Photo gallery
8. **project_documents** - Document vault
9. **site_field_notes** - Field notes

---

## 🎯 Quick Tasks

### Create a Daily Report

1. Navigate to `/dashboard/daily`
2. Fill in:
   - Date
   - Weather conditions
   - Workforce breakdown
   - HSE status
   - Notes
3. Click "Create Daily Report"

### Add BOQ Item

1. Go to `/dashboard/boq`
2. Click "Add BOQ Item"
3. Enter:
   - WBS Code (e.g., "2.1.1")
   - Category (e.g., "Superstructure")
   - Description
   - Contract Qty & Unit Rate
4. Click "Add Item"

### Log Concrete Pour

1. Navigate to `/dashboard/concrete`
2. Record:
   - Element location
   - Mix design (e.g., "C35/45")
   - Volume (m³)
   - Slump test result
   - QC status
3. Submit pour record

### Create RFI

1. Go to `/dashboard/rfis`
2. Click "Add RFI"
3. Fill in:
   - RFI Number
   - Subject
   - Priority
   - Assigned to
4. Click "Create RFI"

---

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Type checking
npm run typecheck

# Production build
npm run build
npm start

# Database operations
npx drizzle-kit push        # Push schema
npx tsx src/db/seed.ts      # Seed data
npx drizzle-kit studio      # Visual DB editor
```

---

## 📊 Sample Data

The seed script creates:
- ✅ 1 Project: "Dubai Marina Residential Tower"
- ✅ 6 BOQ Items (Foundation, Columns, Solar, etc.)
- ✅ 1 Daily Report (with weather and workforce)
- ✅ 3 RFIs (with different priorities)

---

## 🐛 Troubleshooting

### "DATABASE_URL is required"
- Check `.env` file exists in project root
- Verify connection string format

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Failed
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check database exists
psql -l
```

---

## 📚 Documentation Files

- `README.md` - Complete project overview
- `SETUP_GUIDE.md` - Detailed setup instructions
- `ARCHITECTURE.md` - Technical architecture
- `FEATURES.md` - Feature reference
- `DEPLOYMENT.md` - Production deployment
- `PROJECT_SUMMARY.md` - Executive summary

---

## ✅ Validation Checklist

Before deployment:
- [ ] Database schema pushed
- [ ] Environment variables configured
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Health check passes (`curl localhost:3000/api/health`)

---

## 🚀 Deploy to Production

### Vercel (Easiest)
```bash
npm i -g vercel
vercel login
vercel
```

### Railway (All-in-One)
1. Go to railway.app
2. New Project → Deploy from GitHub
3. Add PostgreSQL database
4. Deploy ✅

---

## 💡 Pro Tips

1. **Use Seeded Data** for demos
2. **Filter BOQ by Category** for focused views
3. **Track HSE Status** daily to maintain safety records
4. **Version Documents** to prevent superseded drawing usage
5. **Tag Photos** by trade for easy filtering

---

## 🎯 Key Features at a Glance

- ✅ Real-time KPI Dashboard (CPI, SPI, Variance)
- ✅ Daily Site Reports (Weather, Workforce, HSE)
- ✅ BOQ Financial Control (Earned Value Management)
- ✅ Concrete QC Tracking (Mix design, Slump tests)
- ✅ RFI Workflow (Open → Review → Closed)
- ✅ Material Delivery QC (Approve/Reject)
- ✅ Progress Photos (Geotagged, Trade-tagged)
- ✅ Field Notes (Text + Voice memos)
- ✅ Document Vault (Version control)

---

## 📞 Support

- Check the main README for full documentation
- Review ARCHITECTURE.md for technical details
- See FEATURES.md for complete feature list

---

**Happy Building!** 🏗️

*Construction Management Hub - Production-Ready from Day One*
