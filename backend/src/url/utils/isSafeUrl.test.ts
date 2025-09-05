import { describe, it, expect } from "vitest";
import { isSafeUrl, isPrivateIpHost } from "./isSafeUrl.js";

describe("isPrivateIpHost", () => {
  it("detects 10.x.x.x as private", () => {
    expect(isPrivateIpHost("10.0.0.1")).toBe(true);
  });

  it("detects 172.16.x.x as private", () => {
    expect(isPrivateIpHost("172.16.0.5")).toBe(true);
  });

  it("detects 192.168.x.x as private", () => {
    expect(isPrivateIpHost("192.168.1.10")).toBe(true);
  });

  it("detects 127.x.x.x as private", () => {
    expect(isPrivateIpHost("127.0.0.1")).toBe(true);
  });

  it("detects 169.254.x.x as private", () => {
    expect(isPrivateIpHost("169.254.1.1")).toBe(true);
  });

  it("returns false for public IP", () => {
    expect(isPrivateIpHost("8.8.8.8")).toBe(false);
  });

  it("returns false for hostname", () => {
    expect(isPrivateIpHost("example.com")).toBe(false);
  });
});

describe("isSafeUrl", () => {
  it("allows https://example.com", () => {
    expect(isSafeUrl("https://example.com")).toEqual({ safe: true });
  });

  it("allows http://example.com", () => {
    expect(isSafeUrl("http://example.com")).toEqual({ safe: true });
  });

  it("blocks ftp://example.com", () => {
    const res = isSafeUrl("ftp://example.com");
    expect(res.safe).toBe(false);
    expect(res.reason).toMatch(/protocol/i);
  });

  it("blocks disallowed port", () => {
    const res = isSafeUrl("https://example.com:22");
    expect(res.safe).toBe(false);
    expect(res.reason).toMatch(/port/i);
  });

  it("blocks localhost names", () => {
    expect(isSafeUrl("http://localhost").safe).toBe(false);
    expect(isSafeUrl("http://127.0.0.1:8080").safe).toBe(false);
    expect(isSafeUrl("http://::1").safe).toBe(false);
  });

  it("blocks private IPv4 addresses", () => {
    expect(isSafeUrl("http://10.0.0.5").safe).toBe(false);
    expect(isSafeUrl("http://172.16.0.1").safe).toBe(false);
    expect(isSafeUrl("http://192.168.0.1").safe).toBe(false);
    expect(isSafeUrl("http://169.254.10.10").safe).toBe(false);
  });

  it("blocks invalid URL string", () => {
    expect(isSafeUrl("not a url").safe).toBe(false);
  });

  it("treats protocol case-insensitively", () => {
    expect(isSafeUrl("HTTPS://Example.com").safe).toBe(true);
  });

  it("allows https with explicit port 443", () => {
    expect(isSafeUrl("https://example.com:443").safe).toBe(true);
  });
});