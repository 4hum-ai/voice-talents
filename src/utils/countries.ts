export interface Country {
  code: string;
  name: string;
}
export const countries: Country[] = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "Korea, Republic of" },
  { code: "VN", name: "Viet Nam" },
];
export const getCountryByCode = (code: string): Country | undefined =>
  countries.find((c) => c.code === code.toUpperCase());

// Attempts to resolve by 2-letter code first; if not, tries by name (case-insensitive)
export const getCountryByAny = (value: string): Country | undefined => {
  if (!value) return undefined;
  const raw = value.trim();
  if (raw.length === 2) return getCountryByCode(raw);
  const lower = raw.toLowerCase();
  return countries.find((c) => c.name.toLowerCase() === lower);
};
