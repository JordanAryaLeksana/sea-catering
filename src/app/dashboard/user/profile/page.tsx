"use client";
import axiosClient from "@/lib/axios";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, easeInOut } from "framer-motion";
import { User, Mail, Lock, Edit3, Save, Sparkles } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

type UserProfile = {
    id?: string; // Optional, in case the profile is not fetched yet
    name: string;
    email: string;
    password: string;
}

const userProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});

export default function UserProfilePage() {
    const { data: session, status } = useSession();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const params = useParams();
    // const userId = params.id; 
    const form = useForm<UserProfile>({
        defaultValues: {
            name: userProfile?.name || "",
            email: userProfile?.email || "",
            password: "",
        },
        resolver: zodResolver(userProfileSchema),
        mode: "onTouched",
        reValidateMode: "onChange",
    });
    // console.log("Session data:", session);
    const id = session?.user?.id;
  
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosClient.get(`/users/${id}`);
                const profile = response.data?.data;

                if (profile) {
                    setUserProfile(profile);
                    form.reset({
                        name: profile.name,
                        email: profile.email,
                        password: "",
                    });
                }
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    alert(error.response?.data?.error || "Failed to fetch profile");
                    console.error("Fetch error:", error.response?.data || error.message);
                }
            }
        };

        if (id) fetchUserProfile();
    }, [id, form]);


    if (status === "loading") {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600 font-medium">Loading session...</p>
                </motion.div>
            </div>
        );
    }



    const onSubmit = async (data: UserProfile) => {
        setIsSubmitting(true);
        try {
            const response = await axiosClient.patch("/users", {
                ...data,
                id: session?.user?.id, 
            });

            setUserProfile(response.data);
            alert("Profile updated successfully");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error || "An error occurred while updating profile");
                // console.error("Error updating profile:", error.response?.data || error.message);
            } else {
                alert("An unexpected error occurred");
                console.error("Unknown error:", error)
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4 }
        }
    };

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: easeInOut
            }
        }
    };

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-yellow-100 to-green-100 rounded-full opacity-30"
                />
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    transition={{ delay: 1 }}
                    className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-100 to-orange-100 rounded-full opacity-30"
                />
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    transition={{ delay: 2 }}
                    className="absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-r from-green-100 to-yellow-100 rounded-full opacity-30"
                />
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-20 right-1/3 w-24 h-24 bg-gradient-to-r from-yellow-100 to-pink-100 rounded-full opacity-20"
                />
            </div>

            <div className="relative z-10 flex w-full min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md"
                >
                    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center pb-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-500 to-green-600 rounded-full flex items-center justify-center mb-4"
                            >
                                <User className="w-8 h-8 text-white" />
                            </motion.div>

                            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                User Profile
                            </CardTitle>

                            <CardDescription className="text-gray-600 mt-2">
                                Manage your personal information
                            </CardDescription>

                            <div className="flex items-center justify-center gap-2 mt-3">
                                <Badge variant="secondary" className="text-xs">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Secure
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    <Edit3 className="w-3 h-3 mr-1" />
                                    Editable
                                </Badge>
                            </div>
                        </CardHeader>

                        <Separator className="mb-6" />

                        <CardContent className="space-y-6">
                            <Form {...form}>
                                <motion.form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-5"
                                    variants={containerVariants}
                                >
                                    {/* Name Field */}
                                    <motion.div variants={itemVariants}>
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <User className="w-4 h-4 text-yellow-500" />
                                                        Full Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <motion.div
                                                            whileFocus={{ scale: 1.02 }}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                        >
                                                            <Input
                                                                {...field}
                                                                placeholder="Enter your full name"
                                                                className="h-12 border-2 border-gray-200 focus:border-yellow-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                                                            />
                                                        </motion.div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    {/* Email Field */}
                                    <motion.div variants={itemVariants}>
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-green-500" />
                                                        Email Address
                                                    </FormLabel>
                                                    <FormControl>
                                                        <motion.div
                                                            whileFocus={{ scale: 1.02 }}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                        >
                                                            <Input
                                                                {...field}
                                                                placeholder="Enter your email address"
                                                                type="email"
                                                                className="h-12 border-2 border-gray-200 focus:border-green-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                                                            />
                                                        </motion.div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    {/* Password Field */}
                                    <motion.div variants={itemVariants}>
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                        <Lock className="w-4 h-4 text-green-500" />
                                                        Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <motion.div
                                                            whileFocus={{ scale: 1.02 }}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                        >
                                                            <Input
                                                                {...field}
                                                                placeholder="Enter your password"
                                                                type="password"
                                                                className="h-12 border-2 border-gray-200 focus:border-green-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                                                            />
                                                        </motion.div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>

                                    {/* Submit Button */}
                                    <motion.div
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-gradient-to-r from-yellow-600 to-green-600 hover:from-yellow-700 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                                />
                                            ) : (
                                                <Save className="w-5 h-5 mr-2" />
                                            )}
                                            {isSubmitting ? "Updating..." : "Update Profile"}
                                        </Button>
                                    </motion.div>
                                </motion.form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}