"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import bcrypt from "bcryptjs";

export async function login(email?: string, password?: string) {
  // If no credentials provided, maybe it's just setting the role from local storage fallback (for backwards compat, though we'll remove it).
  // Actually, let's just make them required.
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  let role = "user";
  let name = "";
  let valid = false;

  // Check admin
  if (email === "admin@floodeye.com") {
    const adminHash = process.env.ADMIN_PASSWORD_HASH;
    if (adminHash && bcrypt.compareSync(password, adminHash)) {
      role = "admin";
      name = "Admin";
      valid = true;
    }
  } 
  // Check user
  else if (email === "user@floodeye.com") {
    const userHash = process.env.USER_PASSWORD_HASH;
    if (userHash && bcrypt.compareSync(password, userHash)) {
      role = "user";
      name = "User";
      valid = true;
    }
  }

  if (!valid) {
    return { success: false, error: "Invalid email or password" };
  }

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
