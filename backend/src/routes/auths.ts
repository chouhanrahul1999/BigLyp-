import { Hono } from "hono";
import { email, z } from "zod";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { createDb } from "../db";
import { users } from "../db/schema";
import type { Env } from "../index";
import { registerSchema, loginSchema } from "../db/validators";


const auth = new Hono<{ Bindings: Env }>();

