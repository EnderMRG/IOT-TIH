"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Simple validation logic (matching the old frontend logic)
  let role = null;

  if (email === "admin@floodeye.com" && password === "admin") {
    role = "admin";
  } else if (email === "user@floodeye.com" && password === "user") {
    role = "user";
  } else {
    return { error: "Invalid email or password. Please try again." };
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

  // Redirect to dashboard
  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  
  redirect("/login");
}
