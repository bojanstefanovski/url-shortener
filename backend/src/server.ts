// src/server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import { buildUrlRoutes } from "./url/routes.js";

const app = Fastify({ logger: true });
app.register(cors, { origin: "*" });

app.register(buildUrlRoutes, { prefix: "/" });

app.get("/health", async () => ({ status: "ok" }));

const PORT = parseInt(process.env.PORT || "3000", 10);

app
  .listen({ port: PORT, host: "0.0.0.0" })
  .then(() => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });