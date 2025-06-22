"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import  { isAxiosError } from "axios";
import axiosClient from "@/lib/axios";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const PLAN_PRICES = {
    DIET: 30000,
    PROTEIN: 40000,
    ROYAL: 50000,
};

enum PlanType {
    DIET = "DIET",
    PROTEIN = "PROTEIN",
    ROYAL = "ROYAL",
}

enum MealType {
    BREAKFAST = "BREAKFAST",
    LUNCH = "LUNCH",
    DINNER = "DINNER",
}

type FormData = {
    name: string;
    phoneNumber: string;
    planType: PlanType;
    mealType: MealType;
    DeliveryDays: string[];
    price?: number;
    allergies?: string;
};

const validateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phoneNumber: z.string().min(1, "Phone is required"),
    planType: z.nativeEnum(PlanType),
    mealType: z.nativeEnum(MealType),
    DeliveryDays: z.preprocess(
        (val) => (Array.isArray(val) ? val : []),
        z
            .array(
                z.string().refine((date) => !isNaN(Date.parse(date)), {
                    message: "Invalid date format",
                })
            )
            .min(1, "At least one delivery day is required")
    ),
    price: z.number().optional(),
    allergies: z.string().optional(),
});

export default function SubscriptionPage() {
    const form = useForm({
        defaultValues: {
            name: "",
            phoneNumber: "",
            planType: PlanType.DIET,
            mealType: MealType.BREAKFAST,
            DeliveryDays: [new Date().toISOString()],
            allergies: "",
        },
        resolver: zodResolver(validateSchema),
    });

    const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

    useEffect(() => {
        const subscription = form.watch((values) => {
            const { planType, DeliveryDays } = values;
            if (!planType || !PLAN_PRICES[planType]) return;

            const planPrice = PLAN_PRICES[planType];
            const mealCount = 1;
            const dayCount = (DeliveryDays && Array.isArray(DeliveryDays)) ? DeliveryDays.length : 0;
            const total = planPrice * mealCount * dayCount * 4.3;
            setCalculatedPrice(total);
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const onSubmit = async (data: FormData) => {
        const payload = { ...data, price: calculatedPrice };
        try {
            await axiosClient.post("/subscription", payload);
            alert("Subscription success");
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                alert(err.response?.data?.error || "Subscription failed");
            } else {
                alert("Unexpected error occurred");
            }
        }
    };


    return (
        <div className="max-w-xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Subscription Form</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="planType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Plan Type</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DIET">DIET</SelectItem>
                                            <SelectItem value="PROTEIN">PROTEIN</SelectItem>
                                            <SelectItem value="ROYAL">ROYAL</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mealType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Meal Type</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BREAKFAST">BREAKFAST</SelectItem>
                                            <SelectItem value="LUNCH">LUNCH</SelectItem>
                                            <SelectItem value="DINNER">DINNER</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="DeliveryDays"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Delivery Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        value={Array.isArray(field.value) && field.value[0]?.split("T")[0] || ""}
                                        onChange={(e) => field.onChange([e.target.value])}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="allergies"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Allergies (optional)</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="text-lg font-semibold text-green-700">
                        Total Price: Rp{calculatedPrice.toLocaleString("id-ID")}
                    </div>
                    <Button type="submit" className="w-full bg-yellow-600 text-white">Submit</Button>
                </form>
            </Form>
        </div>
    );
}
