import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-07-29.dahlia" as any,
  typescript: true,
});

export const STRIPE_PLANS = {
  professional: {
    name: "Professional",
    price: 4900, // $49.00 in cents
    interval: "month" as const,
    features: [
      "Up to 10 projects",
      "Up to 25 team members",
      "Advanced reporting",
      "Priority support",
      "Mobile apps",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 14900, // $149.00 in cents
    interval: "month" as const,
    features: [
      "Unlimited projects",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
  },
};
