import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    const token = (await cookies()).get("token")?.value;
    if (!session?.user && !token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET as string);
        } catch (err) {
            console.error("JWT Invalid", err);
            return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
        }
    }

    const userId = params.id;
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    //block get user by id if not admin
    if (session?.user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    if (!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ data: existingUser }, { status: 200 });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    const token = (await cookies()).get("token")?.value;

    if (!session?.user && !token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET as string);
        } catch (err) {
            console.error("JWT Invalid", err);
            return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
        }
    }

    const userId = params.id;
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const deletedUser = await prisma.user.delete({
        where: { id: userId },
    });

    if (!deletedUser) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 400 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
}
