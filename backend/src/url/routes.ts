import { FastifyPluginAsync } from "fastify";
import { createUrlController } from "./controller/controller.js";
import { createUrlService } from "./service/service.js";
import { PrismaClient } from "@prisma/client";
import { safeUrlGuard, safeUrlSlug } from "./middleware/middleware.js";
import { createPrismaUrlRepo } from "./infrastructure/repository.js";

export const buildUrlRoutes: FastifyPluginAsync = async (app) => {
  const prisma = new PrismaClient();
  const repo = createPrismaUrlRepo(prisma);
  const service = createUrlService(repo);
  const controller = createUrlController(service);

  app.post("/", {preHandler: safeUrlGuard}, controller.createSlug);
  app.get("/:slug", {preHandler: safeUrlSlug}, controller.redirectUrl);
};