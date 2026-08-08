import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "$0.00";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return "0%";
  return `${value.toFixed(2)}%`;
}

export function calculateVariance(budget: number, spent: number): number {
  return budget - spent;
}

export function calculateCPI(earnedValue: number, actualCost: number): number {
  if (actualCost === 0) return 0;
  return earnedValue / actualCost;
}

export function calculateSPI(earnedValue: number, plannedValue: number): number {
  if (plannedValue === 0) return 0;
  return earnedValue / plannedValue;
}

export function calculateProgressPercentage(claimed: number, contract: number): number {
  if (contract === 0) return 0;
  return (claimed / contract) * 100;
}
