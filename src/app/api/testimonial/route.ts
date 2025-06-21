import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { ZodError } from 'zod';

const testimonialSchema = z.object({
  message: z.string().min(1, "Message is required"),
  userId: z.string().min(1, "User ID is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { message, userId, rating } = testimonialSchema.parse(body);

    // Cari user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Simpan testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        message,
        userId,
        rating,
      },
      include: {
        User: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Testimonial created successfully",
        data: {
          name: testimonial.User.name,
          email: testimonial.User.email,
          message: testimonial.message,
          rating: testimonial.rating,
        },
      },
      { status: 201 }
    );
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
    const testimonials = await prisma.testimonial.findMany({
      include: {
        User: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' }, 
    });

    if (!testimonials || testimonials.length === 0) {
      return NextResponse.json({ error: "No testimonials found" }, { status: 404 });
    }

    const formatted = testimonials.map((t) => ({
      name: t.User.name,
      email: t.User.email,
      message: t.message,
      rating: t.rating,
    }));
    console.log("Testimonials fetched successfully:", formatted);
    return NextResponse.json({ data: formatted }, { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
