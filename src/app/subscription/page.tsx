"use client";
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from '@/components/ui/form';

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import axiosClient from '@/lib/axios';

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

type FormData = {
    name: string;
    phoneNumber: string;
    planType: "DIET" | "PROTEIN" | "ROYAL";
    mealType: "BREAKFAST" | "LUNCH" | "DINNER";
    DeliveryDays: string[];
    allergies?: string;
};

const validateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(1, "Phone is required"),
  planType: z.enum(['DIET', 'PROTEIN', 'ROYAL']),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER']),
  DeliveryDays: z.preprocess(
    (val) => Array.isArray(val) ? val : [],
    z.array(z.string().refine(date => !isNaN(Date.parse(date)), {
      message: "Invalid date format"
    })).min(1, "At least one delivery day is required")
  ),
  allergies: z.string().optional()
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
};

const floatingShapes = [
  { size: 60, delay: 0, duration: 8, x: "10%", y: "20%" },
  { size: 40, delay: 2, duration: 10, x: "80%", y: "10%" },
  { size: 30, delay: 4, duration: 6, x: "90%", y: "70%" },
  { size: 50, delay: 1, duration: 9, x: "15%", y: "80%" },
  { size: 25, delay: 3, duration: 7, x: "70%", y: "60%" },
];

export default function SubscriptionPage() {
    const form = useForm({
        defaultValues: {
            name: "",
            phoneNumber: "",
            planType: PlanType.DIET,
            mealType: MealType.BREAKFAST,
            DeliveryDays: [new Date().toISOString()],
            allergies: ""
        },
        mode: "onTouched",
        reValidateMode: "onChange",
        resolver: zodResolver(validateSchema)
    })

    const onSubmit = async (data: FormData) => {
        console.log("Form submitted:", data);
        try {
            const response = await axiosClient.post('/subscription', data);
            console.log("Response from server:", response.data);
            if (response.status === 201) {
                alert("Subscription successful!");
            } else {
                alert("Subscription failed. Please try again.");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error);
                console.log("Axios error:", error.response);
            } else {
                alert("An unexpected error occurred");
                console.log("Unknown error:", error);
            }
        }
    };

    return (
        <div className="relative mt-20 min-h-screen bg-white overflow-hidden">
            {/* Floating Background Shapes */}
            {floatingShapes.map((shape, index) => (
                <motion.div
                    key={index}
                    className="absolute rounded-full bg-gradient-to-br from-yellow-100 to-green-100 opacity-20"
                    style={{
                        width: shape.size,
                        height: shape.size,
                        left: shape.x,
                        top: shape.y,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: shape.duration,
                        delay: shape.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
            <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-yellow-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-green-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-r from-pink-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md mx-auto"
                >
                    <motion.div
                        variants={itemVariants}
                        className="text-center mb-8"
                    >
                        <motion.h1
                            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent mb-2"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                                duration: 0.6, 
                                ease: "easeOut",
                                delay: 0.2 
                            }}
                        >
                            Subscription
                        </motion.h1>
                        <motion.p
                            className="text-gray-600 text-sm sm:text-base"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            Choose your perfect meal plan
                        </motion.p>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
                            <CardHeader className="pb-4">
                                <motion.div 
                                    className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-green-500 rounded-full mx-auto"
                                    initial={{ width: 0 }}
                                    animate={{ width: 64 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Form {...form}>
                                    <motion.form 
                                        onSubmit={form.handleSubmit(onSubmit)} 
                                        className="space-y-6"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <motion.div variants={itemVariants}>
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-medium">Name</FormLabel>
                                                        <FormControl>
                                                            <motion.div whileFocus={{ scale: 1.02 }}>
                                                                <Input 
                                                                    placeholder="Your Name" 
                                                                    {...field} 
                                                                    className="transition-all duration-200 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 border-gray-200 hover:border-gray-300"
                                                                />
                                                            </motion.div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <FormField
                                                control={form.control}
                                                name="phoneNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-medium">Phone</FormLabel>
                                                        <FormControl>
                                                            <motion.div whileFocus={{ scale: 1.02 }}>
                                                                <Input 
                                                                    placeholder="Your Phone" 
                                                                    {...field} 
                                                                    className="transition-all duration-200 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 border-gray-200 hover:border-gray-300"
                                                                />
                                                            </motion.div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <FormField
                                                control={form.control}
                                                name="planType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-medium">Plan Section</FormLabel>
                                                        <FormControl>
                                                            <motion.div whileTap={{ scale: 0.98 }}>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
                                                                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 border-gray-200 hover:border-gray-300">
                                                                        <SelectValue placeholder="Select Plan" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="DIET">🥗 DIET</SelectItem>
                                                                        <SelectItem value="PROTEIN">💪 PROTEIN</SelectItem>
                                                                        <SelectItem value="ROYAL">👑 ROYAL</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </motion.div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <FormField
                                                control={form.control}
                                                name="mealType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-medium">Meal Type</FormLabel>
                                                        <FormControl>
                                                            <motion.div whileTap={{ scale: 0.98 }}>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
                                                                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 border-gray-200 hover:border-gray-300">
                                                                        <SelectValue placeholder="Select Meal Type" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="BREAKFAST">🌅 BREAKFAST</SelectItem>
                                                                        <SelectItem value="LUNCH">☀️ LUNCH</SelectItem>
                                                                        <SelectItem value="DINNER">🌙 DINNER</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </motion.div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <FormField
                                                control={form.control}
                                                name="DeliveryDays"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-medium">Delivery Date</FormLabel>
                                                        <FormControl>
                                                            <motion.div whileFocus={{ scale: 1.02 }}>
                                                                <Input
                                                                    type="date"
                                                                    value={Array.isArray(field.value) && field.value.length > 0 ? field.value[0].split('T')[0] : ''}
                                                                    onChange={e => {
                                                                        const dateValue = e.target.value ? new Date(e.target.value) : null;
                                                                        field.onChange(dateValue);
                                                                    }}
                                                                    onBlur={field.onBlur}
                                                                    name={field.name}
                                                                    ref={field.ref}
                                                                    className="transition-all duration-200 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 border-gray-200 hover:border-gray-300"
                                                                />
                                                            </motion.div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <FormField
                                                control={form.control}
                                                name="allergies"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-medium">Allergies (optional)</FormLabel>
                                                        <FormControl>
                                                            <motion.div whileFocus={{ scale: 1.02 }}>
                                                                <Input 
                                                                    placeholder="List any allergies" 
                                                                    {...field} 
                                                                    className="transition-all duration-200 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 border-gray-200 hover:border-gray-300"
                                                                />
                                                            </motion.div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>

                                        <motion.div 
                                            variants={itemVariants}
                                            className="pt-4"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Button 
                                                    type="submit" 
                                                    className="w-full bg-gradient-to-r from-yellow-600 to-green-600 hover:from-yellow-700 hover:to-green-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                                >
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 1 }}
                                                    >
                                                        Submit Subscription ✨
                                                    </motion.span>
                                                </Button>
                                            </motion.div>
                                        </motion.div>
                                    </motion.form>
                                </Form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}