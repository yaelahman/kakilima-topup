import { describe, expect, it } from "vitest";
import { roleLabel } from "./role";

describe("roleLabel", () => {
  it("returns em dash for empty values", () => {
    expect(roleLabel(null)).toBe("—");
    expect(roleLabel(undefined)).toBe("—");
    expect(roleLabel("")).toBe("—");
  });

  it("maps known roles", () => {
    expect(roleLabel("superadmin")).toBe("Superadmin");
    expect(roleLabel("SUPERADMIN")).toBe("Superadmin");
    expect(roleLabel("member")).toBe("Member");
  });

  it("title-cases unknown roles", () => {
    expect(roleLabel("reseller")).toBe("Reseller");
    expect(roleLabel(42)).toBe("42");
  });
});
