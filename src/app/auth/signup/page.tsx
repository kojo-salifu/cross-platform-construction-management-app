"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Check } from "lucide-react";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Account created! Please sign in.");
        router.push("/auth/signin");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to create account");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">
        {/* Sign Up Form */}
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl">Construction Hub</span>
            </div>
            <CardTitle className="text-2xl">Start your free trial</CardTitle>
            <CardDescription>
              No credit card required. 3 months completely free.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizationName">Company Name</Label>
                <Input
                  id="organizationName"
                  placeholder="ABC Construction Ltd"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Start Free Trial"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl">What's included</CardTitle>
            <CardDescription>Everything you need to manage construction projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                "3 months completely free - No credit card required",
                "Daily site reports with weather tracking",
                "BOQ financial control with EVM",
                "Concrete pour QC and testing logs",
                "RFI management workflow",
                "Material delivery tracking",
                "Geotagged progress photos",
                "Document vault with version control",
                "Mobile apps for iOS & Android",
                "Offline-first data entry",
                "Up to 5 projects",
                "Up to 10 team members",
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-white border border-blue-300 rounded-lg p-4 mt-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                After your free trial:
              </p>
              <p className="text-xs text-slate-600">
                Continue with our Professional plan at $49/month, or choose Enterprise for unlimited projects and users. Cancel anytime.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
