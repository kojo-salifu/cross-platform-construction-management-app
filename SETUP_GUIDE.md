# Construction Management Hub - Setup Guide

This guide will help you get the Construction Management application up and running quickly.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 13 or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd construction-hub

# Install dependencies
npm install
```

### Step 2: Database Setup

**Option A: Local PostgreSQL**

1. Start PostgreSQL on your machine
2. Create a new database:
   ```bash
   createdb app_db
   # Or using psql:
   psql -U postgres
   CREATE DATABASE app_db;
   \q
   ```

3. Create `.env` file in project root:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/app_db
   ```

**Option B: Cloud PostgreSQL (Recommended for Production)**

Services like Supabase, Neon, or Railway provide free PostgreSQL hosting:

1. Sign up for [Supabase](https://supabase.com) (free tier available)
2. Create a new project
3. Copy the connection string from project settings
4. Create `.env` file:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[HOST]:[PORT]/postgres
   ```

### Step 3: Initialize Database

```bash
# Push schema to database
npx drizzle-kit push

# Seed with sample data (optional but recommended for demo)
npx tsx src/db/seed.ts
```

You should see output like:
```
🌱 Seeding database...
✅ Created project: Dubai Marina Residential Tower
✅ Created 6 BOQ items
✅ Created sample daily report
✅ Created 3 RFIs
🎉 Database seeding completed!
```

### Step 4: Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Open your browser to `http://localhost:3000`

## 🎯 What You'll See

### Landing Page
- Professional homepage with feature overview
- "Launch Application" button to enter dashboard

### Dashboard (Main View)
- **Executive KPIs**: Budget, CPI, SPI, variance tracking
- **Quick Actions**: Create daily reports, log concrete pours, update BOQ
- **Recent Activity**: Latest updates across all modules

### Available Modules

| Module | Route | Description |
|--------|-------|-------------|
| Dashboard | `/dashboard` | Executive overview with KPIs |
| Daily Reports | `/dashboard/daily` | Site execution and weather logs |
| BOQ Financial | `/dashboard/boq` | Bill of Quantities and variance |
| Concrete Pours | `/dashboard/concrete` | Structural QC tracking |
| RFIs | `/dashboard/rfis` | Information requests |
| Deliveries | `/dashboard/deliveries` | Material tracking |
| Photos | `/dashboard/photos` | Progress photography |
| Field Notes | `/dashboard/notes` | Site observations |
| Documents | `/dashboard/documents` | Document vault |

## 📊 Sample Data Overview

The seed script creates a sample project: **"Dubai Marina Residential Tower"**

**BOQ Items (6 items)**
- Excavation and earthworks
- Foundation slab (C35/45 concrete)
- RC columns and beams
- Floor slab concrete
- Rooftop solar PV panels
- Electrical distribution system

**Daily Report**
- Date: Feb 15, 2024
- Weather: Sunny, 18.5°C - 32°C
- Workers: 45 total (steel fixers, carpenters, electricians, etc.)
- HSE Status: Compliant, 23 zero-incident days

**RFIs (3 items)**
- Foundation reinforcement spacing clarification (High priority, In Review)
- BIPV solar mounting details (Medium priority, Open)
- Fire-rated sealant specification (Medium priority, Closed)

## 🛠️ Development Workflow

### Adding New BOQ Items

1. Navigate to BOQ module (`/dashboard/boq`)
2. Click "Add BOQ Item"
3. Fill in:
   - WBS Code (e.g., "2.3.1")
   - Category (Substructure, Superstructure, MEP, etc.)
   - Description
   - Unit (m³, m², pcs, kg)
   - Contract Quantity
   - Unit Rate ($)
4. Click "Add Item"

### Creating Daily Reports

1. Go to Daily Reports (`/dashboard/daily`)
2. Fill in the form:
   - **Date**: Report date
   - **Weather**: Conditions, temperature, humidity, wind
   - **Workforce**: Headcount by trade
   - **HSE**: Safety status and incident days
   - **Notes**: Daily activities
3. Click "Create Daily Report"

### Managing RFIs

1. Navigate to RFIs (`/dashboard/rfis`)
2. Click "Add RFI"
3. Enter:
   - RFI Number (e.g., "RFI-2024-004")
   - Priority (High/Medium/Low)
   - Subject and description
   - Assigned engineer/consultant
   - Target resolution date
4. Track status changes (Open → In Review → Closed)

## 🔧 Troubleshooting

### "DATABASE_URL is required" Error

**Solution**: Ensure `.env` file exists in project root with valid DATABASE_URL

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

### Database Connection Failed

**Check:**
1. PostgreSQL is running: `pg_isready`
2. Database exists: `psql -l`
3. Credentials are correct in `.env`
4. Host and port are accessible

### Build Errors

**Common fixes:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### TypeScript Errors

```bash
# Run type checking
npm run typecheck

# Generate Next.js types
npx next typegen
```

## 📱 Next Steps

### Customize for Your Project

1. **Update Project Data**
   - Edit `src/db/seed.ts` with your actual project information
   - Or manually create projects via the UI

2. **Add Authentication**
   - Integrate [NextAuth.js](https://next-auth.js.org/) for user login
   - Add role-based access control

3. **Enable File Uploads**
   - Integrate [UploadThing](https://uploadthing.com/) or S3
   - Update schema for photo/document URLs

4. **Deploy to Production**
   - [Vercel](https://vercel.com) (easiest for Next.js)
   - [Railway](https://railway.app) (includes PostgreSQL)
   - [AWS/Azure/GCP](https://nextjs.org/docs/deployment)

### Extend Functionality

- **PDF Reports**: Implement `@react-pdf/renderer` for automated reports
- **Excel Export**: Use `exceljs` for BOQ financial exports
- **Offline Mode**: Add LocalForage + TanStack Query for offline data entry
- **Mobile Apps**: Package with CapacitorJS for iOS/Android
- **Real-time Updates**: Add WebSockets for live collaboration

## 📞 Support

- Check the main [README.md](README.md) for detailed documentation
- Review the database schema in `src/db/schema.ts`
- Explore API routes in `src/app/api/`

## ✅ Quick Validation Checklist

Before deployment, ensure:

- [ ] Database schema pushed (`npx drizzle-kit push`)
- [ ] Environment variables configured
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Application starts (`npm start`)
- [ ] Health check passes (`curl http://localhost:3000/api/health`)

---

**Happy Building!** 🏗️ 

You now have a production-grade construction management platform ready to track your projects from groundbreaking to completion.
