import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 

export function createPageUrl(page: string): string {
  debugLog('Creating page URL for:', page);
  // Normalize page names to lowercase and remove spaces
  const normalized = page.replace(/\s+/g, "").toLowerCase();
  switch (normalized) {
    case "dashboard":
      return "/dashboard";
    case "landing":
      return "/";
    default:
      debugLog('Creating page URL for:', normalized);
      return "/" + normalized;
  }
}
/**
 * Development-only logging utilities
 * These functions only log when NODE_ENV === 'development'
 */

export const debugLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

export const debugError = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  }
};

export const debugWarn = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(...args);
  }
};

export const debugInfo = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.info(...args);
  }
};

/**
 * Conditional debug logging with a custom flag
 * Usage: debugIf(process.env.NEXT_PUBLIC_DEBUG === 'true', 'Debug message')
 */
export const debugIf = (condition: boolean, ...args: unknown[]) => {
  if (condition && process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
}; 