"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import bcrypt from "bcryptjs";

const rateLimitCache = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

export async function login(email?: string, password?: string) {
  // If no credentials provided, maybe it's just setting the role from local storage fallback (for backwards compat, though we'll remove it).
  // Actually, let's just make them required.
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  // Rate Limiting
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown-ip";
  const now = Date.now();
  
  const attempt = rateLimitCache.get(ip);
  if (attempt) {
    if (now - attempt.timestamp < RATE_LIMIT_WINDOW_MS) {
      if (attempt.count >= MAX_ATTEMPTS) {
        return { success: false, error: "Too many login attempts. Please try again later." };
      }
      attempt.count += 1;
    } else {
      // Reset window
      rateLimitCache.set(ip, { count: 1, timestamp: now });
    }
  } else {
    rateLimitCache.set(ip, { count: 1, timestamp: now });
  }


  let role = "user";
  let name = "";
  let valid = false;

  // Check admin
  if (email === "admin@floodeye.com") {
    const rawAdminHash = process.env.ADMIN_PASSWORD_HASH;
    if (rawAdminHash) {
      const adminHash = "$2b$10$" + rawAdminHash;
      if (bcrypt.compareSync(password, adminHash)) {
        role = "admin";
        name = "Admin";
        valid = true;
      }
    }
  } 
  // Check user
  else if (email === "user@floodeye.com") {
    const rawUserHash = process.env.USER_PASSWORD_HASH;
    if (rawUserHash) {
      const userHash = "$2b$10$" + rawUserHash;
      if (bcrypt.compareSync(password, userHash)) {
        role = "user";
        name = "User";
        valid = true;
      }
    }
  }

  if (!valid) {
    return { success: false, error: "Invalid email or password" };
  }

  // Clear rate limit on successful login
  rateLimitCache.delete(ip);

  // Securely set HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set("auth_session", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return { success: true, role, name };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  
  redirect("/");
}
