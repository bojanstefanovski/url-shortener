import { describe, it, expect } from "vitest";
import { canonicalizeUrl } from "./canonicalizeUrl.js";

describe("Canonical url", () => {
  it("should remove utm params", () => {
    const url = "https://example.com?utm_campaign=toot";
    const result = canonicalizeUrl(url);

    expect(result).toBe("https://example.com");
  });

  it("should keep real query params", () => {
    const url = "https://example.com?page=1&utm_source=twitter";
    const result = canonicalizeUrl(url);

    expect(result).toBe("https://example.com/?page=1");
  });

  it("should strip hash", () => {
    const url = "https://example.com/path#section";
    const result = canonicalizeUrl(url);

    expect(result).toBe("https://example.com/path");
  });
});