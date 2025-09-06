import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDatePT(date: string | Date, options?: {
  includeTime?: boolean;
  short?: boolean;
}): string {
  const dateObj = new Date(date);
  
  const baseOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Lisbon'
  };
  
  if (options?.short) {
    baseOptions.day = 'numeric';
    baseOptions.month = 'short';
    if (options.includeTime) {
      baseOptions.hour = '2-digit';
      baseOptions.minute = '2-digit';
    }
  } else {
    baseOptions.day = 'numeric';
    baseOptions.month = 'long';
    baseOptions.year = 'numeric';
    if (options?.includeTime) {
      baseOptions.hour = '2-digit';
      baseOptions.minute = '2-digit';
    }
  }
  
  return dateObj.toLocaleDateString('pt-PT', baseOptions);
}