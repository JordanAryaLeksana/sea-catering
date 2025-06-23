import { NextResponse } from "next/server";
import { createDefaultAdmin } from "@/utils/createAdmin";

export async function GET() {
  try {
    await createDefaultAdmin();
    return NextResponse.json({ message: "Admin created if not exists" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}
