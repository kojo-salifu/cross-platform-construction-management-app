# Construction Management Hub

A production-grade, full-stack construction site management platform built with Next.js 14+, PostgreSQL, and Drizzle ORM.

## 🏗️ Overview

This comprehensive construction management application provides an all-in-one solution for tracking daily progress, structural concrete pours, BOQ/cost control, RFIs, material deliveries, progress photos, field notes, and project documents—complete with automated multi-cadence reporting capabilities.

### Key Features

- **📊 Portfolio Dashboard** - Executive KPI summary with Cost Performance Index (CPI), Schedule Performance Index (SPI), budget variance tracking, and HSE incident monitoring
- **📅 Daily Site Reports** - Weather conditions, workforce breakdown by trade, safety logs, and site activities
- **💰 Master BOQ & Financial Control** - Hierarchical Work Breakdown Structure with Earned Value Management, variance analysis, and progress tracking
- **🏗️ Concrete Pour Tracking** - Structural element QC logs, mix design specifications, slump tests, cylinder sample IDs, and supplier tracking
- **📋 RFIs & Submittals** - Request for Information management with priority levels, assignment tracking, and status monitoring
- **🚚 Material Deliveries** - Delivery ticket tracking, QC inspection status, and storage location management
- **📸 Progress Photos** - Geotagged site photography with trade categorization and grid location metadata
- **📝 Field Notes** - Text and voice memo support with blueprint pinning capabilities
- **📁 Document Vault** - Version-controlled repository for blueprints (PDF, DWG), permits, and certificates

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router and Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - High-quality component library
- **Lucide React** - Icon system
- **React Hook Form + Zod** - Form management and validation
- **TanStack Query** - Data fetching and caching (ready for offline-first architecture)
- **Sonner** - Toast notifications

### Backend
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database toolkit
- **Next.js API Routes** - RESTful API endpoints

### Planned Extensions
- **@react-pdf/renderer** - Automated PDF report generation
- **ExcelJS** - Multi-tab BOQ financial exports
- **LocalForage/IndexedDB** - Offline-first field data entry
- **CapacitorJS** - Native iOS/Android mobile apps
- **PWA/Electron** - Desktop packaging

## 📁 Project Structure

```
construction-hub/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── boq/          # BOQ CRUD operations
│   │   │   ├── concrete/     # Concrete pour tracking
│   │   │   ├── daily-reports/# Daily site reports
│   │   │   ├── projects/     # Project management
│   │   │   └── rfis/         # RFI management
│   │   ├── dashboard/        # Main application pages
│   │   │   ├── boq/          # BOQ financial control
│   │   │   ├── concrete/     # Concrete tracking
│   │   │   ├── daily/        # Daily reports
│   │   │   ├── deliveries/   # Material deliveries
│   │   │   ├── documents/    # Document vault
│   │   │   ├── notes/        # Field notes
│   │   │   ├── photos/       # Progress photos
│   │   │   ├── rfis/         # RFI management
│   │   │   └── page.tsx      # Dashboard home
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── boq-table.tsx     # BOQ data table
│   │   ├── daily-report-form.tsx
│   │   ├── dashboard-shell.tsx
│   │   ├── kpi-cards.tsx
│   │   └── rfi-list.tsx
│   ├── db/
│   │   ├── index.ts          # Database connection
│   │   ├── schema.ts         # Drizzle ORM schema
│   │   └── seed.ts           # Sample data seeder
│   └── lib/
│       └── utils.ts          # Utility functions
├── .env                      # Environment variables
├── drizzle.config.json       # Drizzle Kit configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

## 🗄️ Database Schema

### Core Tables

1. **projects** - Main project registry
   - Contract budget, client info, project manager, status
   
2. **daily_site_reports** - Field execution logs
   - Weather conditions, workforce breakdown, HSE status
   
3. **concrete_pours** - Structural concrete QC
   - Mix design, volume, slump tests, cylinder batches
   
4. **boq_items** - Bill of Quantities
   - WBS code, quantities, unit rates, variance tracking
   
5. **rfis** - Requests for Information
   - Priority, assignment, status, responses
   
6. **material_deliveries** - Delivery tracking
   - Supplier, quantity, QC status, storage location
   
7. **progress_photos** - Geotagged photography
   - GPS coordinates, trade tags, grid locations
   
8. **project_documents** - Document vault
   - Version control, file categories, approval status
   
9. **site_field_notes** - Text and voice memos
   - Blueprint pinning, note types, author tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd construction-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_db
   ```

4. **Push database schema**
   ```bash
   npx drizzle-kit push
   ```

5. **Seed sample data (optional)**
   ```bash
   npx tsx src/db/seed.ts
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 📊 Key Functionality

### Dashboard Overview
- Real-time KPI tracking (CPI, SPI, budget variance)
- Active project selection
- Quick action cards for common tasks
- HSE incident monitoring

### BOQ Financial Control
- Hierarchical Work Breakdown Structure (WBS)
- Dynamic variance calculations
- Category-wise budget roll-ups
- Progress percentage tracking
- Unit rate and quantity management

### Daily Site Execution
- Weather and temperature logging
- Trade-wise workforce headcount
- Safety status and incident days
- General site notes and observations

### Concrete Pour QC
- Structural element identification
- Mix design specifications (e.g., C35/45 SCC)
- Slump test results
- Delivery ticket numbers
- Cylinder batch ID tracking
- Pass/Fail QC status

### RFI Management
- Priority levels (High/Medium/Low)
- Assignment to consultants/engineers
- Target resolution dates
- Status tracking (Open/In Review/Closed)
- Response logging

## 🔐 Security & Best Practices

- Environment variables for sensitive configuration
- Server-side rendering for data security
- Type-safe database queries with Drizzle ORM
- Input validation with Zod
- Prepared statements preventing SQL injection

## 📱 Future Enhancements

### Mobile & Desktop
- CapacitorJS integration for native iOS/Android apps
- Camera access for on-site photo capture
- GPS geolocation for automatic photo tagging
- Offline-first data entry with background sync

### Reporting Engine
- **Daily Site Execution Report** - Weather, workforce, concrete QC, photo cards
- **Weekly Progress Audit** - Target vs. actual quantities, CapEx tracking
- **Monthly Executive Report** - CPI/SPI curves, cash flow forecasts, variance breakdown

### Advanced Features
- Blueprint viewer with annotation tools
- Speech-to-text for voice memos
- Photo markup with canvas drawing
- Excel export for BOQ data
- PDF generation for all report types
- Real-time collaboration with WebSockets

## 🤝 Contributing

This is a demonstration project showcasing production-grade construction management capabilities. For production deployments, consider:

- User authentication and authorization (e.g., NextAuth.js)
- Row Level Security (RLS) for multi-tenant isolation
- File upload handling for photos and documents
- Real-time updates with WebSockets or Supabase Realtime
- Comprehensive error handling and logging
- Performance optimization for large datasets

## 📄 License

MIT License - feel free to use this as a template for your construction management needs.

## 🏗️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - Component library
- [Lucide React](https://lucide.dev/) - Icons

---

**Construction Management Hub** © 2024 - Professional-grade site management for modern construction projects.
