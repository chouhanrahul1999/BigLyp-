import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { createDb } from "../db";
import { users } from "../db/schema";
import type { Env } from "../index";
import { registerSchema, loginSchema } from "../db/validators";
import { authMiddleware } from "../middleware/auth";


const auth = new Hono<{ Bindings: Env }>();

auth.post("/register", async (c) => {
    const body = await c.req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
        return c.json({ error: parsed.error.flatten() }, 400);
    }

    const { name, email, password } = parsed.data;
    const db = createDb(c.env.DB);

    const existing = await db.select().from(users).where(eq(users.email, email)).get();

    if (existing) {
        return c.json({ error: "Email already registered" }, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id: string = uuidv4();

    await db.insert(users).values({
        id: id,
        name,
        email,
        password: hashedPassword
    });

    return c.json({ id, name, email }, 201)
})

auth.post("/login", async (c) => {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
        return c.json({ error: parsed.error.flatten() }, 400);
    }

    const { email, password } = parsed.data;
    const db = createDb(c.env.DB);

    const user = await db.select().from(users).where(eq(users.email, email)).get();

    if (!user) {
        return c.json({ error: "Invalid credentials" }, 401);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return c.json({ error: "Invalid credentials" }, 401);
    }

    const secret = new TextEncoder().encode(c.env.JWT_SECRET);

    const token = await new SignJWT({ sub: user.id, name: user.name, email: user.email })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(secret);

    return c.json({ token });
})

auth.get("/me", authMiddleware, (c) => {
    const user = c.get("user");
    return c.json({
    id: user.sub,
    name: user.name,
    email: user.email,
  });
})

export default auth;
