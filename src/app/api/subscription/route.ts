import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { ZodError } from 'zod';

enum PlanType {
    DIET = 'DIET',
    PROTEIN = 'PROTEIN',
    ROYAL = 'ROYAL',
}
enum MealType {
    BREAKFAST = 'BREAKFAST',
    LUNCH = 'LUNCH',
    DINNER = 'DINNER',
}
const subscriptionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters long").max(15, "Phone number must not exceed 15 characters"),
    planType: z.nativeEnum(PlanType, {
        errorMap: () => ({ message: "Invalid plan type" }),
    }),
    mealType: z.nativeEnum(MealType, {
        errorMap: () => ({ message: "Invalid meal type" }),
    }),
    price: z.number().optional(),
    userId: z.string().min(1, "User ID is required"),
    DeliveryDays: z.array(z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Invalid date format"
    })).min(1, "At least one delivery day is required"
    )
});

interface SubscriptionRequest {
    name: string;
    phoneNumber: string;
    planType: PlanType;
    mealType: MealType;
    price?: number;
    userId?: string;
    DeliveryDays: string[];
}
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { name, phoneNumber, planType, mealType, price, DeliveryDays, userId }: SubscriptionRequest = subscriptionSchema.parse(body);
        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const exists = await prisma.subscription.findFirst({
            where: {
                PhoneNumber: phoneNumber,
                planType,
                mealType,
            }
        });

        if (exists) {
            return NextResponse.json({ error: "You have already subscribed to this plan." }, { status: 409 });
        }

        const subscription = await prisma.subscription.create({
            data: {
                name,
                PhoneNumber: phoneNumber,
                planType,
                mealType,
                price: price || 0,
                deliveryDays: DeliveryDays.map(day => new Date(day).toISOString()),
                User: {
                    connect: { id: userId },
                },
            }
        });

        return NextResponse.json({ data: subscription, message: "Subscription created successfully" }, { status: 201 });

    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Subscription error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}



export async function GET(): Promise<NextResponse> {
    try {
        const subscriptions = await prisma.subscription.findMany();
        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({ error: "No subscriptions found" }, { status: 404 });
        }
        return NextResponse.json({ data: subscriptions }, { status: 200 });
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}