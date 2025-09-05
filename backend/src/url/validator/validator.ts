import { z } from "zod";

export const CreateUrlSchema = z.object({
  longUrl: z.string().trim().url().refine((u) => {
    try { const p = new URL(u); return ["http:", "https:"].includes(p.protocol); } catch { return false; }
  }, { message: "Only HTTP/HTTPS URLs allowed" }),
});

export const RedirectUrlSchema = z.object({
  slug: z.string().min(1).max(8).regex(/^[a-zA-Z0-9_-]{4,8}$/),
});


export type CreateUrlInput = z.infer<typeof CreateUrlSchema>;