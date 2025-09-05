import { PrismaClient } from "@prisma/client"
import { UrlRepo } from "../interfaces.js";

export const createPrismaUrlRepo = (prisma: PrismaClient): UrlRepo => {
const map = (row: any) => ({
    id: row.id,
    slug: row.slug,
    clicks: row.clicks,
    longUrl: row.longUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
})
return {
    async findByLongUrl(longUrl: string) {
      const r = await prisma.url.findUnique({ where: { longUrl } });
      return r ? map(r) : null;
    },
    async findBySlug(slug: string) {
      const r = await prisma.url.findFirst({ where: { slug } });
      return r ? map(r) : null;
    },
    async create({ longUrl, slug }: {longUrl: string, slug: string}) {
      const r = await prisma.url.create({ data: { longUrl, slug } });
      return map(r);
    },
    async incrementClicks(slug: string) {
      await prisma.url.update({ where: { slug }, data: { clicks: { increment: 1 } } });
  },
  
  };
}