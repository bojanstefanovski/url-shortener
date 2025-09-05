import { FastifyReply, FastifyRequest } from "fastify";
import { GetSlugRouteParams, RegisterUrlPostRouteBody } from "../interfaces.js";

export async function safeUrlGuard(
  request: FastifyRequest<{ Body: RegisterUrlPostRouteBody }>,
  reply: FastifyReply
) {
  const body = request.body;
  if (!body?.longUrl) return;

  const raw = body.longUrl.trim();
  const lower = raw.toLowerCase();

  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("file:") ||
    lower.startsWith("vbscript:")
  ) {
    return reply.code(400).send({ ok: false, error: "protocol_forbidden" });
  }

  if (/[\u0000-\u001F\u007F]/.test(raw)) {
    return reply.code(400).send({ ok: false, error: "invalid_chars" });
  }

  if (/\s/.test(raw)) {
    return reply.code(400).send({ ok: false, error: "spaces_not_allowed" });
  }

  if (/%(?![0-9A-Fa-f]{2})/.test(raw)) {
    return reply.code(400).send({ ok: false, error: "bad_percent_encoding" });
  }

  if (/[<>"'`\\]/.test(raw)) {
    return reply.code(400).send({ ok: false, error: "invalid_special_chars" });
  }
}

export const safeUrlSlug = async (
  request: FastifyRequest<{ Params: GetSlugRouteParams }>,
  reply: FastifyReply
) => {
  const body = request.params;
  if (!body) return;

  // add any slug validation checks here, e.g. invalid characters
  if (!/^[a-zA-Z0-9_-]+$/.test(body.slug)) {
    return reply.code(400).send({ ok: false, error: "invalid_slug" });
  }
};