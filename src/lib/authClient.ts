// lib/checkAuthClient.ts
import { getSession } from "next-auth/react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

export async function checkAuthClient() {
  const token = Cookies.get("token");
  
    // 1. Cek apakah ada token JWT di cookie
  if (token) {
    try {
      const decoded = jwt.decode(token);
      return {
        method: "jwt",
        decoded,
      };
    } catch (err) {
      console.error("Invalid JWT", err);
    }
  }

  // 2. Kalau tidak ada token, coba ambil session NextAuth
  const session = await getSession();
  if (session) {
    return {
      method: "nextauth",
      session,
    };
  }

  // 3. Tidak login
  return null;
}
