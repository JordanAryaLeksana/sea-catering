import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { ZodError } from 'zod';

enum ContactType{
    GENERAL = 'GENERAL',
    SUPPORT = 'SUPPORT',
    FEEDBACK = 'FEEDBACK',
}

interface ContactRequest {
    companyName: string;
    email: string;
    message: string;
    type: ContactType;
}

const contactSchema = z.object({
    companyName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(1, "Message is required"),
    type: z.nativeEnum(ContactType, {
        errorMap: () => ({ message: "Invalid contact type" }),
    }),
});


export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { companyName, email, message, type }: ContactRequest = contactSchema.parse(body);

        const contact = await prisma.contact.create({
            data: {
                companyName,
                email,
                message,
                type,
            },
        });
        if (!contact) {
            return NextResponse.json({ error: "Failed to create contact" }, { status: 400 });
        }
        return NextResponse.json({ message: "Contact created successfully", data: contact }, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Error creating contact:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(): Promise<NextResponse> {
    try {
        const contacts = await prisma.contact.findMany();
        if (contacts.length === 0) {
            return NextResponse.json({ error: "No contacts found" }, { status: 404 });
        }
        return NextResponse.json({ data: contacts }, { status: 200 });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const contact = await prisma.contact.delete({
            where: { id },
        });

        if (!contact) {
            return NextResponse.json({ error: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Contact deleted successfully", data: contact }, { status: 200 });
    } catch (error) {
        console.error("Error deleting contact:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}