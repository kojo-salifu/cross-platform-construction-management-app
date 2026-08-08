import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, BarChart3, FileText, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-2xl">Construction Hub</span>
          </div>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Construction Management Platform
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              All-in-one site management for daily reports, structural concrete tracking, BOQ control, 
              RFIs, and automated multi-cadence reporting.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/dashboard">
                Launch Application →
              </Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Daily Site Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Track weather, workforce, activities, and site conditions in real-time
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">BOQ & Financial Control</h3>
                <p className="text-sm text-muted-foreground">
                  Master Bill of Quantities with Earned Value Management and variance analysis
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Concrete Pour Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  QC logs for structural elements, mix design, slump tests, and cylinder samples
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">HSE & Safety</h3>
                <p className="text-sm text-muted-foreground">
                  Zero-incident tracking, near-miss reporting, and safety audit logs
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Launch the dashboard to manage your construction projects with professional-grade tools.
            </p>
            <Button asChild size="lg">
              <Link href="/dashboard">
                Open Dashboard
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Construction Management Hub © 2024 • Built with Next.js, PostgreSQL & Drizzle ORM
        </div>
      </footer>
    </div>
  );
}
