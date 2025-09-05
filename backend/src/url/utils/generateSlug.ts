import { nanoid } from "nanoid";
import { UrlRepo } from "../interfaces.js";


export const generateUniqueSlug = async (repo: UrlRepo, length = 8): Promise<string> => {
  let slug = nanoid(length);
  while (await repo.findBySlug(slug)) {
    slug = nanoid(length);
  }
  return slug;
};
