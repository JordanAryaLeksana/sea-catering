import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { ZodError } from 'zod';
interface Testimonial {
    name: string;
    message: string;
    userId: string;
    rating: number;
}
const testimonialSchema = z.object({
    name: z.string().min(1, "Name is required"),
    message: z.string().min(1, "Message is required"),
    userId: z.string().min(1, "User ID is required"),
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        
        const { message, userId, rating }: Testimonial = testimonialSchema.parse(body);
        const name = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true },
        });
        if (!name) {
            return NextResponse.json({ error: "Name User not found" }, { status: 404 });
        }

        const testimonial = await prisma.testimonial.create({
            data: {
                message,
                userId,
                rating,
            },
        });
        if (!testimonial) {
            return NextResponse.json({ error: "Failed to create testimonial" }, { status: 400 });
        }
        return NextResponse.json({ message: "Testimonial created successfully", data: testimonial }, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Error creating testimonial:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(): Promise<NextResponse> {
    try {
        const existingTestimonials = await prisma.testimonial.findMany();
        if (existingTestimonials.length === 0) {
            return NextResponse.json({ error: "No testimonials found" }, { status: 404 });
        }

        const exitingUser = await prisma.user.findMany({    
            where: {
                id: { in: existingTestimonials.map((testimonial) => testimonial.userId) },
            },
            select: { id: true, name: true, email: true },
        });
        if (!exitingUser || exitingUser.length === 0) {
            return NextResponse.json({ error: "No users found for testimonials" }, { status: 404 });
        }
        const testimonials = await prisma.testimonial.findMany({
            include: {
                User: {
                    select: { name: true, email: true },
                },
            },
        });
        if (!testimonials) {
            return NextResponse.json({ error: "No testimonials found" }, { status: 404 });
        }
        return NextResponse.json({ data: testimonials }, { status: 200 });
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

