import { expect, vitest, describe, it } from "vitest";
import { RegisterUrlPostRouteBody } from "../interfaces.js";
import { safeUrlGuard } from "./middleware.js";
import type { FastifyReply, FastifyRequest } from "fastify";


const  makeReq = (body: Partial<RegisterUrlPostRouteBody>): FastifyRequest<{ Body: RegisterUrlPostRouteBody }> => {
  return { body } as unknown as FastifyRequest<{ Body: RegisterUrlPostRouteBody }>;
}

const mockReply = () => {
  const res: any = {};
  res.code = vitest.fn((status: number) => {
    res._status = status;
    return res;
  });
  res.send = vitest.fn((payload: any) => {
    res._payload = payload;
    return res;
  });

  res.status = res.code;
  return res as FastifyReply & { _status?: number; _payload?: any };
}

describe("safeUrlGuard (unit)", () => {
  it("does nothing (passes through) for a clean URL", async () => {
    const req = makeReq({ longUrl: "https://example.com/path?q=1" });
    const reply = mockReply();

    await safeUrlGuard(req, reply);

    expect((reply.code as any)).not.toHaveBeenCalled();
    expect((reply.send as any)).not.toHaveBeenCalled();
  });

  it("blocks dangerous scheme: javascript:", async () => {
    const req = makeReq({ longUrl: "javascript:alert(1)" });
    const reply = mockReply();

    await safeUrlGuard(req, reply);

    expect(reply._status).toBe(400);
    expect(reply._payload).toEqual({ ok: false, error: "protocol_forbidden" });
  });

  it("blocks control chars", async () => {
    const req = makeReq({ longUrl: "https://exa\u000D\u000Ample.com" }); // CRLF
    const reply = mockReply();

    await safeUrlGuard(req, reply);

    expect(reply._status).toBe(400);
    expect(reply._payload).toEqual({ ok: false, error: "invalid_chars" });
  });

  it("blocks raw spaces", async () => {
    const req = makeReq({ longUrl: "https://exa mple.com" });
    const reply = mockReply();

    await safeUrlGuard(req, reply);

    expect(reply._status).toBe(400);
    expect(reply._payload).toEqual({ ok: false, error: "spaces_not_allowed" });
  });

  it("blocks bad percent-encoding", async () => {
    const req = makeReq({ longUrl: "https://example.com/%ZZ" });
    const reply = mockReply();

    await safeUrlGuard(req, reply);

    expect(reply._status).toBe(400);
    expect(reply._payload).toEqual({ ok: false, error: "bad_percent_encoding" });
  });

  it("no body.longUrl → pass through", async () => {
    const req = makeReq({});
    const reply = mockReply();

    await safeUrlGuard(req, reply);

    expect((reply.code as any)).not.toHaveBeenCalled();
    expect((reply.send as any)).not.toHaveBeenCalled();
  });
   it("url special caracters", async () => {
    const req = makeReq({ longUrl: "https://example.com/'ZZ'" });
    const reply = mockReply();

    await safeUrlGuard(req, reply);

    expect(reply._status).toBe(400);
    expect(reply._payload).toEqual({ok: false, error: "invalid_special_chars" });
  });
});