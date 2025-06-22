// PATCH /api/subscription/:id/cancel
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
    }

    try {
        const subscription = await prisma.subscription.update({
            where: { id },
            data: {
                status: "CANCELLED",
            },
        });

        return NextResponse.json({
            data: subscription,
            message: "Subscription cancelled successfully",
        });
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
