import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});


interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { name, email, password }: RegisterRequest = registerSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const response = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });
        console.log("User created:", response);
        if (!response) {
            return NextResponse.json({ error: "Failed to create user" }, { status: 400 });
        }

        return NextResponse.json({
            message: "User registered successfully",
            data: {
                id: response.id,
                name: response.name,
                email: response.email,
            }
        }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const messages = error.errors.map((e) => e.message);
            return NextResponse.json({ error: messages }, { status: 400 });
        }
        console.error("Unexpected error during registration:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


