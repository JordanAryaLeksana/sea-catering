import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Params = Promise<{ id: string }>;
export async function DELETE(
    request: NextRequest,
    { params }: { params: Params }
): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }
    const subscriptionId = (await params).id
    if (!subscriptionId) {
        return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
    }
    try {
        const existing = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
        if (!existing) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }
        const deletedSubscription = await prisma.subscription.delete({
            where: { id: subscriptionId },
        });

        return NextResponse.json({ message: "Subscription deleted successfully", data: deletedSubscription }, { status: 200 });
    } catch (error) {
        console.error("Error deleting subscription:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function GET(
    request: NextRequest,
    { params }: { params: Params }
): Promise<NextResponse> {
    const { id } = await params;
    const subscriptionId = id;
    if (!subscriptionId) {
        return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
    }
    const existing = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
    if (!existing) {
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    try {
        const subscription = await prisma.subscription.findUnique({
            where: { id: subscriptionId },
        });

        if (!subscription) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }

        return NextResponse.json({ data: subscription }, { status: 200 });
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function PUT(
    request: NextRequest,
    { params }: { params: Params }
): Promise<NextResponse> {
    const subscriptionId = (await params).id;
    if (!subscriptionId) {
        return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
    }

    const body = await request.json();
    try {
        const existing = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
        if (!existing) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }
        const updatedSubscription = await prisma.subscription.update({
            where: { id: subscriptionId },
            data: body,
        });

        return NextResponse.json({ message: "Subscription updated successfully", data: updatedSubscription }, { status: 200 });
    } catch (error) {
        console.error("Error updating subscription:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

