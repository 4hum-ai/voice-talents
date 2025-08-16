export interface Country { code: string; name: string }
export const countries: Country[] = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' }
]
export const getCountryByCode = (code: string): Country | undefined => countries.find(c => c.code === code.toUpperCase())

