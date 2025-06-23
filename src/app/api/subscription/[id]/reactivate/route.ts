import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
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

  const subscriptionId = params.id;
  if (!subscriptionId) {
    return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
  }

  try {
    const existing = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: "ACTIVE",
        pausedFrom: null,
        pausedUntil: null,
      },
    });

    return NextResponse.json({ message: "Subscription reactivated", data: updated }, { status: 200 });
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
