import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toSentenceCase(string: string) {
  const capitalizedChar = string.charAt(0).toUpperCase();
  const matchFirstChar = /^./gi;
  return string.replace(matchFirstChar, capitalizedChar);
}
