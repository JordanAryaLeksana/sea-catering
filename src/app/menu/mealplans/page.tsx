"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ReviewForm ={
    name: string;
    message: string;
    rating: number;
}

// Sample meal plans data with elegant themes
const mealPlans = [
    {
        id: 1,
        name: "Ocean Fresh Premium",
        price: "IDR 450,000",
        description: "Fresh seafood and premium ingredients delivered weekly",
        image: "🐟",
    },
    {
        id: 2,
        name: "Garden Fresh Healthy",
        price: "IDR 320,000",

        description: "Nutritionally balanced meals with fresh garden vegetables",
        image: "🥗",
    },
    {
        id: 3,
        name: "Family Feast Delight",
        price: "IDR 680,000",

        description: "Perfect for family gatherings with colorful variety",
        image: "👨‍👩‍👧‍👦",
    },
    {
        id: 4,
        name: "Executive Energy",
        price: "IDR 280,000",
        description: "Professional lunch solutions with vibrant nutrition",
        image: "💼",
    }
];

const validateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    message: z.string().min(1, "Message is required"),
    rating: z.number()
});

export default function MealPlansPage() {

    const form = useForm({
        defaultValues: {
            name: "",
            message: "",
            rating: 0,
        },
        resolver: zodResolver(validateSchema)
    })

    const onSubmit = (data: ReviewForm ) => {
        console.log("Form submitted:", data);
        // Here you can handle the form submission, e.g., send data to an API
    };
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 opacity-10"></div>
                <div className="relative mx-8 lg:mx-16 xl:mx-24 py-20 text-center">
                    <div className="inline-block p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mb-8">
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
                            Our Meal Plans
                        </h1>
                        <p className="text-xl md:text-2xl text-amber-800 max-w-2xl mx-auto font-light">
                            Discover premium catering solutions tailored for every occasion
                        </p>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-8 lg:mx-16 xl:mx-24 py-16">
                {/* Meal Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {mealPlans.map((plan, index) => (
                        <Card
                            key={plan.id}
                            className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/90 backdrop-blur-sm"
                            style={{
                                animationDelay: `${index * 100}ms`
                            }}
                        >
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <CardHeader className="relative z-10 pb-4">
                                <div className="text-6xl text-center mb-6 transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg">
                                    {plan.image}
                                </div>
                                <CardTitle className="text-xl font-bold text-center text-amber-800 group-hover:text-orange-600 transition-colors duration-300">
                                    {plan.name}
                                </CardTitle>
                                <CardDescription className="text-center text-amber-600 font-medium">
                                    {plan.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="relative z-10 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                        {plan.price}
                                    </div>
                                </div>
                                <Separator className="bg-gradient-to-r from-yellow-200 to-orange-200" />
                            </CardContent>
                            <CardFooter className="relative z-10 flex gap-3 pt-4">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                                            See Details
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-yellow-50 to-orange-50 border-0">
                                        <DialogHeader>
                                            <div className="text-4xl text-center mb-4 filter drop-shadow-lg">{plan.image}</div>
                                            <DialogTitle className="text-2xl text-center text-amber-800">{plan.name}</DialogTitle>
                                            <DialogDescription className="text-center text-lg text-amber-600 font-medium">
                                                {plan.description}
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-6 mt-6">

                                            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                                {plan.price}
                                            </div>
                                            <Separator className="bg-gradient-to-r from-yellow-200 to-orange-200" />
                                            <Separator className="bg-gradient-to-r from-yellow-200 to-orange-200" />
                                            <div className="flex gap-3 pt-4">
                                                <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                                                    Subscribe Now
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-amber-300 text-amber-700 hover:bg-yellow-50 hover:border-amber-400"
                                                >
                                                    Learn More
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Testimonial Section */}
                <motion.section className="mt-20">
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-amber-800 mb-8">
                        Create Your Review
                    </h1>
                    <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-amber-800">Share Your Experience</CardTitle>
                            <CardDescription className="text-amber-600">
                                We value your feedback! Please share your thoughts about our meal plans.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your Review" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="rating"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rating</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="1" max="5" placeholder="Rate 1-5" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Submit</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.section>
            </div>
        </div>
    );
}