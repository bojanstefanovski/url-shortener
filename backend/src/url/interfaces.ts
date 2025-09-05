import type { Url } from "@prisma/client";

export type UrlEntity = Url;

export interface UrlResponseDto {
  slug: string;
  longUrl: string;
  shortUrl: string;
  clicks: number;
}

export type UrlRepo = {
  findByLongUrl(longUrl: string): Promise<UrlEntity | null>;
  findBySlug(slug: string): Promise<UrlEntity | null>;
  create(input: { longUrl: string; slug: string }): Promise<UrlEntity>;
  incrementClicks(slug: string): Promise<void>;
};

export type UrlService = {
    register: (longUrl: string) => Promise<{url: UrlEntity, existing: boolean}>
    getUrlBySlug: (longUrl: string) => Promise<UrlEntity | null>

}

export type RegisterUrlPostRouteBody = {
  longUrl: string
}

export type GetSlugRouteParams = {
  slug: string
}