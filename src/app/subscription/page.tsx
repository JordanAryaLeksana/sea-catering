"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "@/lib/axios";
import { isAxiosError } from "axios";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
    User, 
    Phone, 
    UtensilsCrossed, 
    Calendar, 
    AlertTriangle, 
    CreditCard,
    Crown,
    Leaf,
    Dumbbell,
    CheckCircle,
    Sparkles
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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


//skeleton form component
const SkeletonForm = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto mt-8 p-6 space-y-6"
    >
        <Card>
            <CardHeader className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    </motion.div>
);

export default function SubscriptionPage() {
    const { status } = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const session = useSession();
    const userId = session.data?.user?.id || "guest";
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

    if (session.status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
                <div className="container mx-auto px-4 py-8">
                    <SkeletonForm />
                </div>
            </div>
        );
    }
    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-8"
                >
                    <Card className="max-w-md mx-auto shadow-lg">
                        <CardContent className="pt-6">
                            <div className="mb-4">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-8 h-8 text-yellow-600" />
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
                            <p className="text-gray-600 mb-6">You must be signed in to access this page.</p>
                            <Button
                                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                                onClick={() => router.push('/login')}
                            >
                                Sign In
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }
    const onSubmit = async (data: FormData) => {
        const payload = { ...data, price: calculatedPrice };
        try {
            setIsSubmitting(true);
            const response = await axiosClient.post("/subscription", {
                ...payload,
                userId: userId
            });
            console.log("Subscription response:", response.data);
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
        <div className=" mt-24 min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <UtensilsCrossed className="w-8 h-8 text-white" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold text-gray-900 mb-2"
                        >
                            Meal Subscription
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-600"
                        >
                            Choose your perfect meal plan and start your healthy journey
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-yellow-500 to-green-500 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Subscription Details
                                </CardTitle>
                                <CardDescription className="text-yellow-100">
                                    Fill in your information to get started
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Form {...form}>
                                    <div className="space-y-6">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-gray-700">
                                                            <User className="w-4 h-4" />
                                                            Full Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                {...field} 
                                                                className="border-2 focus:border-yellow-400 transition-colors"
                                                                placeholder="Enter your full name"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="phoneNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-gray-700">
                                                            <Phone className="w-4 h-4" />
                                                            Phone Number
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                {...field} 
                                                                className="border-2 focus:border-yellow-400 transition-colors"
                                                                placeholder="Enter your phone number"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.8 }}
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="planType"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2 text-gray-700">
                                                                <Crown className="w-4 h-4" />
                                                                Plan Type
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <SelectTrigger className="border-2 focus:border-yellow-400">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="DIET" className="cursor-pointer hover:bg-green-50">
                                                                            <div className="flex items-center gap-2">
                                                                                <Leaf className="w-4 h-4 text-green-600" />
                                                                                <span>DIET Plan</span>
                                                                                <Badge variant="secondary" className="ml-auto">Rp 30K</Badge>
                                                                            </div>
                                                                        </SelectItem>
                                                                        <SelectItem value="PROTEIN" className="cursor-pointer hover:bg-blue-50">
                                                                            <div className="flex items-center gap-2">
                                                                                <Dumbbell className="w-4 h-4 text-blue-600" />
                                                                                <span>PROTEIN Plan</span>
                                                                                <Badge variant="secondary" className="ml-auto">Rp 40K</Badge>
                                                                            </div>
                                                                        </SelectItem>
                                                                        <SelectItem value="ROYAL" className="cursor-pointer hover:bg-purple-50">
                                                                            <div className="flex items-center gap-2">
                                                                                <Crown className="w-4 h-4 text-purple-600" />
                                                                                <span>ROYAL Plan</span>
                                                                                <Badge variant="secondary" className="ml-auto">Rp 50K</Badge>
                                                                            </div>
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.9 }}
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="mealType"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2 text-gray-700">
                                                                <UtensilsCrossed className="w-4 h-4" />
                                                                Meal Type
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <SelectTrigger className="border-2 focus:border-yellow-400">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="BREAKFAST">🌅 Breakfast</SelectItem>
                                                                        <SelectItem value="LUNCH">☀️ Lunch</SelectItem>
                                                                        <SelectItem value="DINNER">🌙 Dinner</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.0 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="DeliveryDays"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-gray-700">
                                                            <Calendar className="w-4 h-4" />
                                                            Delivery Date
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="date"
                                                                className="border-2 focus:border-yellow-400 transition-colors"
                                                                value={Array.isArray(field.value) && field.value[0]?.split("T")[0] || ""}
                                                                onChange={(e) => field.onChange([e.target.value])}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.1 }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="allergies"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-gray-700">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            Allergies (Optional)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                {...field} 
                                                                className="border-2 focus:border-yellow-400 transition-colors"
                                                                placeholder="Any food allergies or dietary restrictions?"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <Separator className="my-6" />

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1.2 }}
                                            className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-5 h-5 text-green-600" />
                                                    <span className="text-lg font-semibold text-green-800">
                                                        Monthly Total
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-green-700">
                                                        Rp {calculatedPrice.toLocaleString("id-ID")}
                                                    </div>
                                                    <div className="text-sm text-green-600">
                                                        Per month (4.3 weeks)
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.3 }}
                                        >
                                            <Button 
                                                type="submit" 
                                                disabled={isSubmitting}
                                                onClick={form.handleSubmit(onSubmit)}
                                                className="w-full bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white font-semibold py-3 h-auto shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                                            >
                                                <AnimatePresence mode="wait">
                                                    {isSubmitting ? (
                                                        <motion.div
                                                            key="loading"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            Processing...
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="submit"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                            Subscribe Now
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </Button>
                                        </motion.div>
                                    </div>
                                </Form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}