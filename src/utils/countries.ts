/**
 * Country information structure
 */
export interface Country {
  /** ISO 3166-1 alpha-2 country code (2 letters) */
  code: string;
  /** Full country name */
  name: string;
}

/**
 * List of supported countries with their ISO codes and names
 */
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

/**
 * Find a country by its ISO 3166-1 alpha-2 country code
 * @param code - 2-letter country code (case-insensitive)
 * @returns Country object or undefined if not found
 *
 * @example
 * ```typescript
 * getCountryByCode("US"); // { code: "US", name: "United States" }
 * getCountryByCode("us"); // { code: "US", name: "United States" }
 * getCountryByCode("XX"); // undefined
 * ```
 */
export const getCountryByCode = (code: string): Country | undefined =>
  countries.find((c) => c.code === code.toUpperCase());

/**
 * Find a country by code or name (case-insensitive)
 * Attempts to resolve by 2-letter code first; if not found, tries by name
 * @param value - Country code or name to search for
 * @returns Country object or undefined if not found
 *
 * @example
 * ```typescript
 * // By code
 * getCountryByAny("US"); // { code: "US", name: "United States" }
 * getCountryByAny("us"); // { code: "US", name: "United States" }
 *
 * // By name
 * getCountryByAny("United States"); // { code: "US", name: "United States" }
 * getCountryByAny("united states"); // { code: "US", name: "United States" }
 * getCountryByAny("Germany"); // { code: "DE", name: "Germany" }
 *
 * // Not found
 * getCountryByAny("Invalid Country"); // undefined
 * getCountryByAny(""); // undefined
 * getCountryByAny("   "); // undefined
 * ```
 */
export const getCountryByAny = (value: string): Country | undefined => {
  if (!value) return undefined;
  const raw = value.trim();
  if (raw.length === 2) return getCountryByCode(raw);
  const lower = raw.toLowerCase();
  return countries.find((c) => c.name.toLowerCase() === lower);
};
