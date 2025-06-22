import { NextRequest,NextResponse } from "next/server";
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

  const body = await request.json();
  const { pausedFrom, pausedUntil } = body;

  if (!pausedFrom || !pausedUntil) {
    return NextResponse.json({ error: "Pause date range required" }, { status: 400 });
  }

  try {
    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: "PAUSED",
        pausedFrom: new Date(pausedFrom),
        pausedUntil: new Date(pausedUntil),
      },
    });

    return NextResponse.json({
      data: subscription,
      message: "Subscription paused successfully",
    });
  } catch (error) {
    console.error("Error pausing subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
