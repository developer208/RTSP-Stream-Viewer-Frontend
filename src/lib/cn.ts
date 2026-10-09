import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Class name helper used by Aceternity components and our own custom components.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
