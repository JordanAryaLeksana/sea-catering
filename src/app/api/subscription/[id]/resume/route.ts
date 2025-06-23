import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Params = Promise<{ id: string }>;
export async function PATCH(
    request: NextRequest,
    { params }: { params: Params }
): Promise<NextResponse> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
    }

    try {
        const updated = await prisma.subscription.update({
            where: { id },
            data: {
                status: "ACTIVE",
                pausedFrom: null,
                pausedUntil: null,
            },
        });

        return NextResponse.json({
            message: "Subscription resumed successfully",
            data: updated,
        });
    } catch (error) {
        console.error("Error resuming subscription:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
