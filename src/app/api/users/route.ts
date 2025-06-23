import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';


const isDefaultAdmin = (email: string) => {
    return email === process.env.ADMIN_EMAIL;
};

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role == "admin") {
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
    }
    if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                role: "USER"
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        if (!users || users.length === 0) {
            return NextResponse.json({ error: "No users found" }, { status: 404 });
        }
        if (users.some(user => user.email === process.env.ADMIN_EMAIL)) {
            return NextResponse.json({ error: "Cannot fetch users with default admin account" }, { status: 403 });
        }
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
    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (existingUser?.email === process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: "Cannot delete default admin account" }, { status: 403 });
    }
    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    try {
        const user = await prisma.user.delete({
            where: { id: session?.user.id },
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
    const { id, name, email, role } = await request.json();
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (existingUser?.email === process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: "Cannot update default admin account" }, { status: 403 });
    }
    try {
        const user = await prisma.user.update({
            where: { id: session?.user.id },
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

    const { name, email, password, role } = await request.json();
    if (isDefaultAdmin(email) && role?.toLowerCase() === 'admin') {
        return NextResponse.json({ error: "Cannot create default admin via this route" }, { status: 403 });
    }

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
    const { id, password, name, email } = await request.json();
    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (existingUser?.email === process.env.ADMIN_EMAIL) {
        return NextResponse.json({ error: "Cannot update password for default admin" }, { status: 403 });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.update({
            where: { id: session?.user.id },
            data: {
                name,
                email,
                password: hashedPassword
            },
        });

        return NextResponse.json({ data: user, message: "User Password Updated" }, { status: 200 });
    } catch (error) {
        console.error("Error updating user password:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}