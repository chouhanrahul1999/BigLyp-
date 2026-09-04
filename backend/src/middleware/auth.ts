import { createMiddleware } from "hono/factory";
import { jwtVerify } from "jose";
import type { Env } from "../index";

export type JwtPayload = {
    sub: string;
    name: string;
    email: string;
};

export const authMiddleware = createMiddleware<{ Bindings: Env; Variables: { user: JwtPayload } }>(
    async (c, next) => {
        const authHeader = c.req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const token = authHeader.slice(7);

        try {
            const secret = new TextEncoder().encode(c.env.JWT_SECRET);
            const { payload } = await jwtVerify<JwtPayload>(token, secret);

            if (!payload.sub || !payload["name"] || !payload["email"]) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            c.set("user", {
                sub: payload.sub,
                name: payload.name,
                email: payload.email
            })

            await next();
        } catch {
            return c.json({ error: "Unauthorized" }, 401);
        }
    }
)
