import { describe, it, expect } from "vitest";
import { getCountryByCode, getCountryByAny } from "../../src/utils/countries";

describe("countries utils", () => {
  it("getCountryByCode matches case-insensitively", () => {
    const us = getCountryByCode("us");
    expect(us?.code).toBe("US");
    expect(us?.name).toBe("United States");
  });

  it("getCountryByAny resolves by exact name (case-insensitive)", () => {
    const ca = getCountryByAny("canada");
    expect(ca?.code).toBe("CA");
    expect(ca?.name).toBe("Canada");
  });

  it("getCountryByAny resolves by 2-letter code first", () => {
    const jp = getCountryByAny("jp");
    expect(jp?.code).toBe("JP");
  });

  it("returns undefined for unknown values", () => {
    expect(getCountryByCode("xx")).toBeUndefined();
    expect(getCountryByAny("unknownland")).toBeUndefined();
    // empty and whitespace-only
    expect(getCountryByAny("")).toBeUndefined();
    expect(getCountryByAny("   ")).toBeUndefined();
  });
});


