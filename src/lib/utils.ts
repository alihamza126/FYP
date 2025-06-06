import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
   return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
   });
}



export function formatCurrency(amount: number, currency = "USD"): string {
   return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
   }).format(amount);
}
