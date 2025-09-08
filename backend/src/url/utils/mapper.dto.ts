import { UrlEntity, UrlResponseDto } from "../interfaces.js";


export const toUrlDto = (entity: UrlEntity, base = "http://localhost:3000"): UrlResponseDto => ({
  slug: entity.slug,
  longUrl: entity.longUrl,
  shortUrl: `${base}/${entity.slug}`,
  clicks: entity.clicks,
});