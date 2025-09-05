import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUrlSchema, RedirectUrlSchema } from "../validator/validator.js";
import { GetSlugRouteParams, RegisterUrlPostRouteBody, UrlService } from "../interfaces.js";
import { toUrlDto } from "../mapper.dto.js";

export const createUrlController = (urlService: UrlService) => ({
    createSlug: async (req: FastifyRequest<{ Body: RegisterUrlPostRouteBody }>, reply: FastifyReply) => {
        try {
            const dto = CreateUrlSchema.parse(req.body);
            const resp = await urlService.register(dto.longUrl);
            if (resp.existing) {
            return reply.code(200).send({ ok: true, message: "slug_exists", data: toUrlDto(resp.url) });
            }
            return reply.code(201).send({ ok: true, message: "slug_created", data: toUrlDto(resp.url) });
        } catch (err: any) {
            if (err?.name === "ZodError") {
            return reply.code(400).send({ ok: false, error: "invalid_input" });
            }
            if (err?.code) {
            const status = typeof err.statusCode === "number" ? err.statusCode : 400;
            return reply.code(status).send({ ok: false, error: err.code });
            }
            return reply.code(500).send({ ok: false, error: "internal_error" });
        }
    },
    redirectUrl: async (req: FastifyRequest<{ Params: GetSlugRouteParams}>, reply: FastifyReply)=> {
        try {
            const { slug } = RedirectUrlSchema.parse(req.params)
            const url = await urlService.getUrlBySlug(slug)
            if(!url)  return reply.status(404).send({ error: "Not found" });
             return reply.redirect(url.longUrl, 302);
        } catch(err) {
            req.log.error(err);
            return reply.code(500).send({ error: "Internal error" });   
        }
    }
})