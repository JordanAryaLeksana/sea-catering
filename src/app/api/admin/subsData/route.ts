import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);

  const newStart = searchParams.get("newStart");
  const newEnd = searchParams.get("newEnd");

  const mrrStart = searchParams.get("mrrStart");
  const mrrEnd = searchParams.get("mrrEnd");

  const reactStart = searchParams.get("reactStart");
  const reactEnd = searchParams.get("reactEnd");

  const growthEnd = searchParams.get("growthEnd"); // Subscription growth until this date

  if (!newStart || !newEnd || !mrrStart || !mrrEnd || !reactStart || !reactEnd || !growthEnd) {
    return NextResponse.json({ error: "All date ranges are required" }, { status: 400 });
  }

  const [newSubscriptions, mrrAgg, reactivations, subscriptionGrowth] = await Promise.all([
    prisma.subscription.count({
      where: {
        createdAt: {
          gte: new Date(newStart),
          lte: new Date(newEnd),
        },
      },
    }),

    prisma.subscription.aggregate({
      _sum: { price: true },
      where: {
        status: "ACTIVE",
        createdAt: {
          gte: new Date(mrrStart),
          lte: new Date(mrrEnd),
        },
      },
    }),

    prisma.subscription.count({
      where: {
        reactivatedAt: {
          gte: new Date(reactStart),
          lte: new Date(reactEnd),
        },
      },
    }),

    prisma.subscription.count({
      where: {
        status: "ACTIVE",
        createdAt: {
          lte: new Date(growthEnd),
        },
      },
    }),
  ]);

  const mrr = mrrAgg._sum?.price || 0;

  return NextResponse.json({
    newSubscriptions,
    mrr,
    reactivations,
    subscriptionGrowth,
  });
}
