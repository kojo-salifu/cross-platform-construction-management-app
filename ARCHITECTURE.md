# Construction Management Hub - Architecture Documentation

## System Architecture Overview

This document provides a comprehensive breakdown of the application architecture, design decisions, and implementation patterns.

## 🏛️ Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  Next.js Pages • React Components • Tailwind CSS • Forms    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  Next.js App Router (SSR/SSG)               │
│  Server Components • API Routes • Server Actions            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data Access Layer                          │
│  Drizzle ORM • Type-safe Queries • Connection Pooling       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                        │
│  Relational Schema • Foreign Keys • Indexes                 │
└─────────────────────────────────────────────────────────────┘
```

## 🗂️ Database Schema Design

### Entity Relationship Diagram (Conceptual)

```
┌─────────────┐
│  PROJECTS   │
│  (id, name, │
│   budget)   │
└──────┬──────┘
       │
       │ 1:N
       │
       ├─────────────────────────────────────────┐
       │                                          │
       ↓                                          ↓
┌──────────────────┐                    ┌─────────────────┐
│ DAILY_SITE_      │                    │   BOQ_ITEMS     │
│ REPORTS          │                    │  (wbs_code,     │
│ (date, weather)  │                    │   quantities)   │
└────────┬─────────┘                    └─────────────────┘
         │
         │ 1:N
         ↓
┌──────────────────┐
│ CONCRETE_POURS   │
│ (element, mix,   │
│  volume, qc)     │
└──────────────────┘

Additional entities: RFIs, DELIVERIES, PHOTOS, DOCUMENTS, FIELD_NOTES
```

### Key Design Patterns

#### 1. Normalized Schema
- Each table has a single responsibility
- Foreign key relationships maintain data integrity
- Indexes on frequently queried columns

#### 2. Cascading Deletes
- When a project is deleted, all related records cascade delete
- Photos set to NULL on report deletion (preserved for project history)

#### 3. JSONB for Flexible Data
- `workforce_breakdown` in daily reports stored as JSONB
- Allows flexible trade categories without schema changes

## 🔄 Data Flow Patterns

### Server-Side Rendering (SSR)

```typescript
// Example: Dashboard Page
export default async function DashboardPage() {
  // 1. Fetch data on server (no client-side loading state)
  const projects = await db.select().from(projects).limit(1);
  
  // 2. Calculate derived data
  const kpis = calculateKPIs(boqData);
  
  // 3. Return pre-rendered HTML with data
  return <DashboardShell kpis={kpis} />;
}
```

**Benefits:**
- SEO-friendly
- Fast initial page load
- No loading spinners for data already on server
- Reduced client-side JavaScript

### API Routes for Mutations

```typescript
// POST /api/boq
export async function POST(request: Request) {
  const body = await request.json();
  
  // Validation
  if (!body.projectId) {
    return NextResponse.json({ error: "..." }, { status: 400 });
  }
  
  // Business logic
  const contractBudget = calculateBudget(body);
  
  // Database write
  const newItem = await db.insert(boqItems).values({...}).returning();
  
  return NextResponse.json(newItem[0], { status: 201 });
}
```

## 📊 BOQ Financial Calculations

### Earned Value Management (EVM) Formulas

```typescript
// Cost Performance Index
CPI = Earned Value (EV) / Actual Cost (AC)
// CPI > 1.0 = Under budget ✅
// CPI < 1.0 = Over budget ⚠️

// Schedule Performance Index  
SPI = Earned Value (EV) / Planned Value (PV)
// SPI > 1.0 = Ahead of schedule ✅
// SPI < 1.0 = Behind schedule ⚠️

// Budget Variance
Variance = Contract Budget - Actual Spent

// Progress Percentage
Progress = (Claimed Qty / Contract Qty) × 100
```

### Implementation

```typescript
// src/lib/utils.ts
export function calculateCPI(earnedValue: number, actualCost: number): number {
  if (actualCost === 0) return 0;
  return earnedValue / actualCost;
}

export function calculateProgressPercentage(claimed: number, contract: number): number {
  if (contract === 0) return 0;
  return (claimed / contract) * 100;
}
```

## 🎨 UI Component Architecture

### Atomic Design Pattern

```
Atoms (Basic elements)
├── Button
├── Input
├── Label
└── Card

Molecules (Combinations)
├── KPICard (Card + Icon + Data)
├── FormField (Label + Input)
└── StatusBadge

Organisms (Complex components)
├── BOQTable
├── DailyReportForm
├── RFIList
└── KPICards

Templates (Page layouts)
└── DashboardShell

Pages (Complete views)
├── Dashboard
├── BOQ Page
└── Daily Reports Page
```

### Component Communication

```typescript
// Server Component (Data Fetching)
export default async function BOQPage() {
  const items = await db.select().from(boqItems);
  return <BOQTable items={items} />;  // Props down
}

// Client Component (Interactivity)
"use client";
export function BOQTable({ items }: Props) {
  const [filter, setFilter] = useState("all");  // State up
  // ... interaction logic
}
```

## 🔐 Security Architecture

### Environment Variable Pattern

```typescript
// ❌ Never hardcode secrets
const apiKey = "abc123";

// ✅ Use environment variables
const apiKey = process.env.API_KEY;

// ✅ Client-side access (NEXT_PUBLIC_ prefix only)
const publicKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
```

### SQL Injection Prevention

```typescript
// ❌ String concatenation (vulnerable)
db.execute(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ Drizzle ORM prepared statements
db.select().from(users).where(eq(users.id, userId));
```

### Type Safety

```typescript
// TypeScript + Drizzle ensures:
// - Correct column names
// - Matching data types
// - Foreign key relationships
// - Non-null constraints

const result = await db.select({
  projectName: projects.name,     // ✅ Type-checked
  budget: projects.overallBudget, // ✅ Type-checked
  invalidCol: projects.foo,       // ❌ Compile error
}).from(projects);
```

## 📦 State Management Strategy

### Current Approach: Server State + URL State

```typescript
// Server state (database)
const items = await db.select().from(boqItems);

// URL state (filters, pagination)
const searchParams = useSearchParams();
const status = searchParams.get("status") || "all";
```

### Future: TanStack Query for Client State

```typescript
// Automatic caching, refetching, optimistic updates
const { data, isLoading } = useQuery({
  queryKey: ['boq', projectId],
  queryFn: () => fetch(`/api/boq?projectId=${projectId}`).then(r => r.json()),
  staleTime: 5 * 60 * 1000,  // 5 minutes
});
```

## 🔄 Offline-First Architecture (Planned)

### Sync Queue Pattern

```typescript
// Write to IndexedDB first
await localDB.dailyReports.add(report);

// Queue for sync
await syncQueue.add({
  endpoint: '/api/daily-reports',
  method: 'POST',
  data: report,
});

// Background sync when online
navigator.serviceWorker.ready.then(registration => {
  return registration.sync.register('sync-reports');
});
```

## 📱 Mobile Strategy (CapacitorJS)

### Native Capabilities

```typescript
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

// Take photo with metadata
const photo = await Camera.getPhoto({
  quality: 90,
  allowEditing: false,
  resultType: CameraResultType.Uri,
  saveToGallery: true,
});

// Get GPS coordinates
const position = await Geolocation.getCurrentPosition();
const { latitude, longitude } = position.coords;

// Save to database with location
await db.insert(progressPhotos).values({
  photoUrl: photo.path,
  latitude,
  longitude,
  uploadedAt: new Date(),
});
```

## 📊 Reporting Engine Design (Future)

### Multi-Cadence Reports

```typescript
interface ReportGenerator {
  daily: () => Promise<DailyReport>;
  weekly: () => Promise<WeeklyReport>;
  monthly: () => Promise<MonthlyReport>;
}

// Daily Report (Field-level)
class DailyReportGenerator {
  async generate(date: Date) {
    const weather = await getWeatherData(date);
    const workforce = await getWorkforceData(date);
    const pours = await getConcretePoursData(date);
    const photos = await getPhotos(date);
    
    return await PDF.create({
      title: `Daily Site Report - ${formatDate(date)}`,
      sections: [weather, workforce, pours, photos],
    });
  }
}
```

## 🎯 Performance Optimizations

### Database Indexing

```sql
-- High-traffic queries
CREATE INDEX idx_boq_project_id ON boq_items(project_id);
CREATE INDEX idx_daily_reports_date ON daily_site_reports(report_date DESC);
CREATE INDEX idx_rfis_status ON rfis(status, project_id);
```

### Next.js Optimizations

```typescript
// Static generation for public pages
export const dynamic = 'force-static';

// Incremental Static Regeneration
export const revalidate = 3600;  // 1 hour

// Route segment config
export const runtime = 'nodejs';  // or 'edge' for ultra-fast APIs
```

### Image Optimization

```typescript
import Image from 'next/image';

// Automatic optimization, lazy loading, WebP conversion
<Image 
  src={photo.url} 
  width={800} 
  height={600} 
  alt="Progress photo"
  loading="lazy"
  placeholder="blur"
/>
```

## 🧪 Testing Strategy (Recommended)

```typescript
// Unit tests
describe('calculateCPI', () => {
  it('returns correct CPI', () => {
    expect(calculateCPI(100, 100)).toBe(1.0);
    expect(calculateCPI(100, 110)).toBe(0.91);
  });
});

// Integration tests
describe('BOQ API', () => {
  it('creates new BOQ item', async () => {
    const res = await fetch('/api/boq', {
      method: 'POST',
      body: JSON.stringify(mockBOQItem),
    });
    expect(res.status).toBe(201);
  });
});

// E2E tests (Playwright)
test('user can create daily report', async ({ page }) => {
  await page.goto('/dashboard/daily');
  await page.fill('[name=reportDate]', '2024-02-15');
  await page.click('button[type=submit]');
  await expect(page.locator('text=Report created')).toBeVisible();
});
```

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless Next.js instances (deploy multiple containers)
- PostgreSQL connection pooling
- CDN for static assets
- Redis for session/cache layer

### Data Partitioning
```sql
-- Partition large tables by date
CREATE TABLE daily_site_reports (...)
PARTITION BY RANGE (report_date);

CREATE TABLE daily_reports_2024 PARTITION OF daily_site_reports
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### Caching Strategy
```typescript
// API route with caching
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
```

## 🔗 Integration Points

### Future Integrations

1. **Accounting Software**
   - Export BOQ data to QuickBooks/Xero
   - Sync invoice data

2. **BIM Software**
   - Import 3D models
   - Link BOQ items to BIM elements

3. **Weather APIs**
   - Auto-populate weather data
   - Historical weather reports

4. **IoT Sensors**
   - Concrete temperature monitoring
   - Equipment tracking

## 📚 Technology Decisions

### Why Next.js?
- ✅ Server-side rendering for SEO and performance
- ✅ API routes eliminate need for separate backend
- ✅ File-based routing for maintainability
- ✅ Built-in optimization (images, fonts, code splitting)

### Why PostgreSQL?
- ✅ ACID compliance for financial data
- ✅ Complex queries with JOINs
- ✅ JSONB for flexible schemas
- ✅ Industry standard, widely supported

### Why Drizzle ORM?
- ✅ Type-safety at compile time
- ✅ Lightweight (smaller bundle than Prisma)
- ✅ SQL-like syntax (familiar to DBAs)
- ✅ Excellent TypeScript inference

### Why Tailwind CSS?
- ✅ Utility-first reduces custom CSS
- ✅ Responsive design built-in
- ✅ Consistent design system
- ✅ Purges unused styles in production

---

**This architecture supports:**
- 📱 Mobile-first responsive design
- 🚀 High performance and SEO
- 🔒 Enterprise-grade security
- 📈 Horizontal scalability
- 🛠️ Developer productivity
- 🏗️ Production-ready construction management
