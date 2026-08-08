# Construction Management Hub - Deployment Guide

Complete guide for deploying the Construction Management application to production.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Best for:** Next.js applications, automatic scaling, edge deployment

#### Prerequisites
- Vercel account ([Sign up free](https://vercel.com/signup))
- PostgreSQL database (Neon, Supabase, or Railway)

#### Steps

1. **Prepare Database**
   ```bash
   # Option A: Neon (Recommended - Free tier)
   # Go to https://neon.tech
   # Create project, copy connection string
   
   # Option B: Supabase
   # Go to https://supabase.com
   # Create project, get connection string from Settings > Database
   
   # Option C: Railway
   # Go to https://railway.app
   # Create PostgreSQL database
   ```

2. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/construction-hub.git
   git push -u origin main
   ```

3. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   vercel
   
   # Follow prompts:
   # - Link to GitHub repo
   # - Import project
   # - Add environment variable: DATABASE_URL
   ```

4. **Configure Environment Variables**
   
   In Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add:
     ```
     DATABASE_URL = postgresql://user:pass@host:5432/db
     ```
   - Redeploy

5. **Initialize Database**
   ```bash
   # Using Vercel CLI
   vercel env pull .env.local
   
   # Push schema
   npx drizzle-kit push
   
   # Seed data
   npx tsx src/db/seed.ts
   ```

**Your app is now live at:** `https://construction-hub.vercel.app`

---

### Option 2: Railway (All-in-One)

**Best for:** Complete hosting with database included

#### Steps

1. **Create Railway Account**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL**
   - Click "+ New"
   - Select "Database" > "PostgreSQL"
   - Railway auto-creates `DATABASE_URL` variable

4. **Configure Build**
   - Railway auto-detects Next.js
   - Build command: `npm run build`
   - Start command: `npm start`

5. **Initialize Database**
   ```bash
   # Connect to Railway
   railway login
   railway link
   
   # Push schema
   npx drizzle-kit push
   
   # Seed data
   railway run npx tsx src/db/seed.ts
   ```

**Your app is now live at:** `https://construction-hub.up.railway.app`

---

### Option 3: DigitalOcean App Platform

**Best for:** More control, dedicated resources

#### Steps

1. **Prepare Database**
   - Create managed PostgreSQL database on DigitalOcean
   - Note connection string

2. **Create App**
   - Go to DigitalOcean > Apps
   - Create App from GitHub repo
   - Select your repository

3. **Configure**
   - Environment: Node.js
   - Build command: `npm run build`
   - Run command: `npm start`
   - Add environment variable: `DATABASE_URL`

4. **Deploy**
   - DigitalOcean builds and deploys
   - Connect to database via console
   - Run schema push and seed

**Cost:** Starting at $5/month (App) + $15/month (Database)

---

### Option 4: AWS (Enterprise-Grade)

**Best for:** Large scale, compliance requirements, enterprise

#### Architecture

```
┌─────────────────────────────────────────────┐
│ CloudFront (CDN)                            │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│ Application Load Balancer                   │
└─────────────────┬───────────────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼─────┐           ┌─────▼─────┐
│ ECS/Fargate│           │ ECS/Fargate│
│ Container  │           │ Container  │
└─────┬──────┘           └─────┬──────┘
      │                       │
      └───────────┬───────────┘
                  │
┌─────────────────▼───────────────────────────┐
│ RDS PostgreSQL (Multi-AZ)                   │
└─────────────────────────────────────────────┘
```

#### Steps

1. **Create RDS PostgreSQL Database**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier construction-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username admin \
     --master-user-password <secure-password> \
     --allocated-storage 20
   ```

2. **Build Docker Image**
   ```dockerfile
   # Dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

3. **Push to ECR**
   ```bash
   aws ecr create-repository --repository-name construction-hub
   docker build -t construction-hub .
   docker tag construction-hub:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/construction-hub:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/construction-hub:latest
   ```

4. **Create ECS Service**
   ```bash
   # Create task definition
   # Create ECS cluster
   # Create service with Load Balancer
   # Add environment variable: DATABASE_URL
   ```

5. **Configure CloudFront**
   - Create CloudFront distribution
   - Origin: ALB domain
   - Cache behaviors for static assets

**Cost:** ~$50-100/month for small production deployment

---

## 🔐 Environment Variables

### Required Variables

```env
# Database connection (REQUIRED)
DATABASE_URL=postgresql://user:password@host:5432/database

# Next.js configuration (auto-set by most platforms)
NODE_ENV=production
```

### Optional Variables (Future Features)

```env
# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# File uploads (e.g., UploadThing, AWS S3)
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=app_...

# Email notifications (e.g., SendGrid)
SENDGRID_API_KEY=SG....

# Weather API (optional)
OPENWEATHER_API_KEY=...

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
```

---

## 🗄️ Database Migration Strategy

### Development to Production

```bash
# 1. Generate migration from current schema
npx drizzle-kit generate

# 2. Review generated SQL in drizzle/ folder

# 3. Apply to production (or use drizzle-kit push)
npx drizzle-kit migrate

# 4. Verify
psql $DATABASE_URL -c "\dt"  # List tables
```

### Zero-Downtime Migrations

```bash
# 1. Add new columns as nullable
ALTER TABLE boq_items ADD COLUMN new_field TEXT;

# 2. Deploy application code

# 3. Backfill data
UPDATE boq_items SET new_field = old_field WHERE new_field IS NULL;

# 4. Make column NOT NULL (if needed)
ALTER TABLE boq_items ALTER COLUMN new_field SET NOT NULL;

# 5. Remove old column (after verification)
ALTER TABLE boq_items DROP COLUMN old_field;
```

---

## 📊 Monitoring & Observability

### Application Monitoring

**Vercel Analytics (Free)**
```typescript
// next.config.ts
const config = {
  // ...
  experimental: {
    instrumentationHook: true,
  },
};
```

**Sentry (Error Tracking)**
```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

### Database Monitoring

**PostgreSQL Performance Queries**
```sql
-- Long-running queries
SELECT pid, now() - query_start as duration, query 
FROM pg_stat_activity 
WHERE state = 'active' 
ORDER BY duration DESC;

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

## 🔒 Security Checklist

### Pre-Deployment

- [ ] **Environment Variables**: No hardcoded secrets in code
- [ ] **Database Credentials**: Strong passwords, rotated regularly
- [ ] **HTTPS**: SSL/TLS enabled (automatic on Vercel/Railway)
- [ ] **CORS**: Configured for production domain only
- [ ] **Rate Limiting**: Implement for API routes
- [ ] **SQL Injection**: Using Drizzle ORM prepared statements ✅
- [ ] **XSS Protection**: React escapes by default ✅
- [ ] **CSRF Protection**: Implement for mutations
- [ ] **Input Validation**: Zod schemas for all forms
- [ ] **File Upload Security**: Validate file types and sizes
- [ ] **Database Backups**: Automated daily backups enabled

### Post-Deployment

- [ ] **Penetration Testing**: Run security audit
- [ ] **Dependency Audit**: `npm audit fix`
- [ ] **Access Logs**: Enable and monitor
- [ ] **Error Tracking**: Sentry or similar
- [ ] **Uptime Monitoring**: UptimeRobot or Pingdom

---

## 📈 Performance Optimization

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_boq_project_category ON boq_items(project_id, category);
CREATE INDEX idx_daily_reports_date_desc ON daily_site_reports(report_date DESC);
CREATE INDEX idx_rfis_status_priority ON rfis(status, priority);

-- Analyze query performance
EXPLAIN ANALYZE 
SELECT * FROM boq_items WHERE project_id = 1;
```

### Next.js Optimization

```typescript
// app/layout.tsx - Add metadata
export const metadata = {
  title: 'Construction Hub',
  description: '...',
  openGraph: {
    images: ['/og-image.jpg'],
  },
};

// Enable image optimization
import Image from 'next/image';

// Use dynamic imports for heavy components
import dynamic from 'next/dynamic';
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
```

### CDN & Caching

```typescript
// API route caching
export async function GET() {
  const data = await fetchData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run typecheck
      
      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📱 Mobile App Deployment (Future)

### iOS App Store

```bash
# Build iOS app with Capacitor
npx cap add ios
npx cap sync
npx cap open ios

# In Xcode:
# 1. Set signing & capabilities
# 2. Archive for distribution
# 3. Upload to App Store Connect
```

### Google Play Store

```bash
# Build Android app
npx cap add android
npx cap sync
npx cap open android

# In Android Studio:
# 1. Build > Generate Signed Bundle/APK
# 2. Upload to Play Console
```

---

## 🆘 Troubleshooting

### Common Issues

**Build fails with "MODULE_NOT_FOUND"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Database connection timeout**
```bash
# Check database is running
pg_isready -h <host> -p <port>

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check firewall rules (allow your deployment IP)
```

**Next.js memory issues**
```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

---

## ✅ Pre-Launch Checklist

- [ ] Database schema pushed and verified
- [ ] Sample data seeded (or real data migrated)
- [ ] All environment variables configured
- [ ] TypeScript compilation passes
- [ ] Production build succeeds
- [ ] Health check endpoint responds (`/api/health`)
- [ ] SSL certificate configured (HTTPS)
- [ ] Custom domain configured (optional)
- [ ] Monitoring and alerts set up
- [ ] Database backups scheduled
- [ ] Error tracking configured (Sentry)
- [ ] Performance baseline established
- [ ] Security audit completed
- [ ] Team trained on platform usage
- [ ] Documentation shared with stakeholders

---

## 🎉 Post-Deployment

### Day 1
- Monitor error rates
- Check database performance
- Verify all features working
- Collect user feedback

### Week 1
- Review analytics
- Optimize slow queries
- Address bug reports
- Plan feature iterations

### Month 1
- Security review
- Performance audit
- User satisfaction survey
- Roadmap planning

---

**Your Construction Management Hub is now production-ready!** 🚀

For support, refer to:
- [README.md](README.md) - Project overview
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Local development
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
- [FEATURES.md](FEATURES.md) - Complete feature list
