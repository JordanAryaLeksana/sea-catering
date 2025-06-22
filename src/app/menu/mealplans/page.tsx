"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import axiosClient from "@/lib/axios";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react"; // Import useSession
import { useRouter } from "next/navigation";

type ReviewForm = {
    message: string;
    rating: number;
}

type Testimonial = {
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
    message: z.string().min(1, "Message is required"),
    rating: z.coerce.number().min(1).max(5)
});

export default function MealPlansPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    console.log("Initial testimonials state:", testimonials);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const userId = session?.user?.id;
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await axiosClient.get("/testimonial");
                if (!Array.isArray(response.data.data)) {
                    console.warn("Expected an array but got:", response.data.data);
                    return;
                }

                if (response.data.length === 0) {
                    console.info("No testimonials found.");
                    return;
                }

                setTestimonials(response.data.data);
            } catch (error) {
                console.log("Error fetching testimonials:", error);
                alert("Failed to load testimonials. Please try again later.");
            }
        };
        fetchTestimonials();
    }, []);

    const form = useForm<ReviewForm>({
        defaultValues: {
            message: "",
            rating: 0,
        },
        mode: "onTouched",
        reValidateMode: "onChange",
        resolver: zodResolver(validateSchema)
    })

    const onSubmit = async (data: { message: string; rating: number }) => {
        if (!isAuthenticated || !userId) {
            setShowLoginPrompt(true);
            return;
        }
        try {
            const response = await axiosClient.post("/testimonial", {
                message: data.message,
                rating: data.rating,
                userId: userId,
            });
            if (response.status === 201) {
                setTestimonials((prev) => [response.data.data, ...prev]);
                form.reset();
                setTimeout(() => {
                    carouselRef.current?.scrollTo({ left: 0, behavior: "smooth" });
                }, 300);
                alert("Review submitted successfully!");
            } else {
                alert("Failed to submit review. Please try again.");
            }
        } catch (error) {
            console.log("Error submitting form:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    const handleLoginRedirect = () => {
        router.push("/login");
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

                    {/* Show login prompt if not authenticated */}
                    {!isAuthenticated && (
                        <Card className="bg-yellow-50 border-yellow-200 mb-6">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <p className="text-amber-800 mb-4">
                                        Please log in to submit a review
                                    </p>
                                    <Button
                                        onClick={handleLoginRedirect}
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                    >
                                        Login to Review
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className={`bg-white/90 backdrop-blur-sm shadow-lg ${!isAuthenticated ? 'opacity-50' : ''}`}>
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
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Your Review"
                                                        {...field}
                                                        disabled={!isAuthenticated}
                                                    />
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
                                                    <div className="flex space-x-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => isAuthenticated && field.onChange(star)}
                                                                disabled={!isAuthenticated}
                                                                className={`text-2xl transition-all ${field.value >= star ? "text-yellow-400" : "text-gray-300"
                                                                    } ${!isAuthenticated ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                            >
                                                                ★
                                                            </button>
                                                        ))}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        disabled={!isAuthenticated}
                                        className={`${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isAuthenticated ? 'Submit Review' : 'Login Required'}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Carousel section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-center text-amber-800 mt-16 mb-8">
                            What Our Customers Say
                        </h2>

                        <div
                            ref={carouselRef}
                            className="flex overflow-x-auto space-x-4 pb-4 px-2 scroll-smooth "
                        >
                            {testimonials.length > 0 ? (
                                <AnimatePresence>
                                    {testimonials.map((item, idx) => (
                                        <motion.div
                                            key={item.message + idx}
                                            className="min-w-[260px] bg-white/90 backdrop-blur-sm border border-amber-200 p-4 rounded-xl shadow-md"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg text-amber-800">
                                                    {item.name}
                                                </CardTitle>
                                                <CardDescription className="text-sm text-yellow-600">
                                                    Rating: {item.rating}/5
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-gray-700">{item.message}</p>
                                            </CardContent>
                                        </motion.div>
                                    ))}

                                </AnimatePresence>
                            ) : (
                                <div className="text-center text-gray-400 italic">No testimonials yet.</div>
                            )}
                        </div>
                    </motion.section>
                </motion.section>
            </div>

            {/* Login Prompt Dialog */}
            <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Login Required</DialogTitle>
                        <DialogDescription>
                            You need to be logged in to submit a review. Please log in to continue.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setShowLoginPrompt(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleLoginRedirect}>
                            Go to Login
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}