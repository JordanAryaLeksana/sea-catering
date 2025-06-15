import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';


interface LoginRequest {
    email: string;
    password: string;
}

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { email, password }: LoginRequest = loginSchema.parse(body);
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' } 
        ) 
        if(!token) {
            return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
        }

        return NextResponse.json({
            message: "Login successful",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                token: token,
            },
        }, { status: 201 });

    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}





