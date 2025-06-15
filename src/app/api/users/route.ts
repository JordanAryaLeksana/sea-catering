import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

export async function GET() {
    const session = await getServerSession(authOptions);
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;
    let isAuthenticated = false;
    if (session?.user) {
        isAuthenticated = true;
    }
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET as string);
            isAuthenticated = true;
        
        } catch (err) {
            console.error("JWT Invalid", err);
        }
    }

    if (!isAuthenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ambil data user dari database
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        return NextResponse.json({ data: users, message: "Users Fetched" }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;
    let isAuthenticated = false;
    if (session?.user) {
        isAuthenticated = true;
    }
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET as string);
            isAuthenticated = true;
        
        } catch (err) {
            console.error("JWT Invalid", err);
        }
    }

    if (!isAuthenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Hapus user berdasarkan ID yang diberikan
    const { id } = await request.json();
    try {
        const user = await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ data: user, message: "User Deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function PUT(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;
    let isAuthenticated = false;
    if (session?.user) {
        isAuthenticated = true;
    }
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET as string);
            isAuthenticated = true;
        
        } catch (err) {
            console.error("JWT Invalid", err);
        }
    }

    if (!isAuthenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update user berdasarkan ID yang diberikan
    const { id, name, email, role } = await request.json();
    try {
        const user = await prisma.user.update({
            where: { id },
            data: { name, email, role },
        });

        return NextResponse.json({ data: user, message: "User Updated" }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;
    let isAuthenticated = false;
    if (session?.user) {
        isAuthenticated = true;
    }
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET as string);
            isAuthenticated = true;
        
        } catch (err) {
            console.error("JWT Invalid", err);
        }
    }

    if (!isAuthenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tambah user baru
    const { name, email, password, role } = await request.json();
    try {
        const user = await prisma.user.create({
            data: { name, email, password, role },
        });

        return NextResponse.json({ data: user, message: "User Created" }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;
    let isAuthenticated = false;
    if (session?.user) {
        isAuthenticated = true;
    }
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET as string);
            isAuthenticated = true;
        
        } catch (err) {
            console.error("JWT Invalid", err);
        }
    }

    if (!isAuthenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update user password
    const { id, password } = await request.json();
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ data: user, message: "User Password Updated" }, { status: 200 });
    } catch (error) {
        console.error("Error updating user password:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}