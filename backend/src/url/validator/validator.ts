import { z } from "zod";

export const CreateUrlSchema = z.object({
  longUrl: z.string().trim().url()
});

export const RedirectUrlSchema = z.object({
  slug: z.string().min(1).max(8).regex(/^[a-zA-Z0-9_-]{4,8}$/),
});


export type CreateUrlInput = z.infer<typeof CreateUrlSchema>;