import { UrlEntity, UrlRepo, UrlService } from "../interfaces.js";
import { canonicalizeUrl } from "../utils/canonicalizeUrl.js";
import { generateUniqueSlug } from "../utils/generateSlug.js";
import { isSafeUrl } from "../utils/isSafeUrl.js";

export const createUrlService = (repo: UrlRepo ): UrlService => {
    const register = async (longUrl: string): Promise<{url: UrlEntity, existing: boolean}> => {
        const {safe, reason} = isSafeUrl(longUrl);
        if(!safe) {
            throw { code: reason ?? "invalid_url", statusCode: 400 };
        }   
        const canonicalUrl = canonicalizeUrl(longUrl)
        const existingUrl = await repo.findByLongUrl(canonicalUrl)
        if (existingUrl){
            return { url: existingUrl, existing: true}
        }
        const slug = await generateUniqueSlug(repo)
        const createdUrl = await repo.create({longUrl: canonicalUrl, slug });

        return { url: createdUrl, existing: false }
      }
    const getUrlBySlug = async (longUrl: string): Promise<UrlEntity | null> => {
        const res = await repo.findBySlug(longUrl)
        if(res){
            await repo.incrementClicks(res.slug)
        } 
        return res
    }

    return {register, getUrlBySlug}
    };
