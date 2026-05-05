type ClassValue = string | undefined | null | false | ClassValue[]

export function cn(...classes: (string | undefined | null | false | 0)[]): string {
  return classes.filter(Boolean).join(' ')
}