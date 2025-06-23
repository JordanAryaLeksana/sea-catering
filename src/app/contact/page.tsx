"use client";
import { motion, easeInOut } from 'framer-motion';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Building2, MessageSquare, Send, Sparkles } from "lucide-react";
import axiosClient from '@/lib/axios';
import { useRouter } from 'next/navigation';

enum TypeOfContact {
    GENERAL = "GENERAL",
    SUPPORT = "SUPPORT",
    FEEDBACK = "FEEDBACK",
}
type FormData = {
    companyName: string;
    type: TypeOfContact;
    email: string;
    message: string;
};

const contactSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    type: z.nativeEnum(TypeOfContact, {
        errorMap: () => ({ message: "Invalid contact type" }),
    }),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    message: z.string().min(1, "Message is required"),
});

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 }
    }
};

const floatingVariants = {
    float: {
        y: [-10, 10, -10],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: easeInOut
        }
    }
};

const sparkleVariants = {
    sparkle: {
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: easeInOut
        }
    }
};

export default function ContactPage() {
    const router = useRouter();
    const form = useForm<FormData>({
        resolver: zodResolver(contactSchema),
        mode: "onTouched",
        reValidateMode: "onChange",
        defaultValues: {
            companyName: "",
            type: TypeOfContact.GENERAL,
            email: "",
            message: "",
        },
    })

    const onSubmit = async (data: FormData) => {
        // console.log("Form submitted:", data);
        try{
            const response = await axiosClient.post('/contact', data);
            // console.log("Response from server:", response.data);
            if (response.status === 201) {
                // console.log("Form submitted successfully:", response.data);
                alert("Success! Your message has been sent.");
                router.push("/contact/success");
                form.reset();
            } 
        }catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className=" mt-20 min-h-screen bg-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    variants={floatingVariants}
                    animate="float"
                    className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-yellow-100 to-green-100 rounded-full blur-3xl opacity-30"
                />
                <motion.div
                    variants={floatingVariants}
                    animate="float"
                    style={{ animationDelay: "2s" }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full blur-3xl opacity-30"
                />
                <motion.div
                    variants={floatingVariants}
                    animate="float"
                    style={{ animationDelay: "4s" }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-100 to-yellow-100 rounded-full blur-3xl opacity-20"
                />
            </div>
            <motion.div
                variants={sparkleVariants}
                animate="sparkle"
                className="absolute top-32 right-1/4 text-yellow-400"
            >
                <Sparkles size={24} />
            </motion.div>
            <motion.div
                variants={sparkleVariants}
                animate="sparkle"
                style={{ animationDelay: "1s" }}
                className="absolute bottom-32 left-1/4 text-pink-400"
            >
                <Sparkles size={20} />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-2xl mx-auto"
                >
                    {/* Header Section */}
                    <motion.div
                        variants={itemVariants}
                        className="text-center mb-8 sm:mb-12"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-green-600 rounded-full mb-6 shadow-lg"
                        >
                            <Mail className="w-8 h-8 text-white" />
                        </motion.div>
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-yellow-800 to-green-800 bg-clip-text text-transparent mb-4"
                        >
                            Contact Us
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="text-lg sm:text-xl text-gray-600 max-w-md mx-auto leading-relaxed"
                        >
                            If you have any questions, feel free to reach out! Wed love to hear from you.
                        </motion.p>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-yellow-500/10">
                            <CardHeader className="text-center pb-8">
                                <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                                    <MessageSquare className="w-6 h-6 text-yellow-500" />
                                    Contact Form
                                </CardTitle>
                                <CardDescription className="text-gray-600 text-base">
                                    Fill out the form below and well get back to you soon
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <motion.div
                                            variants={itemVariants}
                                            className="space-y-6"
                                        >
                                            {/* Company Name Field */}
                                            <FormField
                                                control={form.control}
                                                name="companyName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                            <Building2 className="w-4 h-4 text-yellow-500" />
                                                            Company Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <motion.div
                                                                whileFocus={{ scale: 1.02 }}
                                                                transition={{ type: "spring", stiffness: 300 }}
                                                            >
                                                                <Input 
                                                                    {...field} 
                                                                    placeholder="Enter your company name"
                                                                    className="h-12 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 transition-all duration-200"
                                                                />
                                                            </motion.div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Type of Contact Field */}
                                            <FormField
                                                control={form.control}
                                                name="type"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold text-gray-700">
                                                            Type of Contact
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <SelectTrigger className="h-12 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500">
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.values(TypeOfContact).map((type) => (
                                                                    <SelectItem key={type} value={type}>
                                                                        {type}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Email Field */}
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-yellow-500" />
                                                            Email
                                                        </FormLabel>
                                                        <FormControl>
                                                            <motion.div
                                                                whileFocus={{ scale: 1.02 }}
                                                                transition={{ type: "spring", stiffness: 300 }}
                                                            >
                                                                <Input 
                                                                    {...field} 
                                                                    type="email"
                                                                    placeholder="Enter your email"
                                                                    className="h-12 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 transition-all duration-200"
                                                                />
                                                            </motion.div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Message Field */}
                                            <FormField
                                                control={form.control}
                                                name="message"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                            <MessageSquare className="w-4 h-4 text-yellow-500" />
                                                            Message
                                                        </FormLabel>
                                                        <FormControl>
                                                            <motion.div
                                                                whileFocus={{ scale: 1.02 }}
                                                                transition={{ type: "spring", stiffness: 300 }}
                                                            >
                                                                <Textarea
                                                                    {...field}
                                                                    placeholder="Enter your message"
                                                                    className="min-h-[120px] border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 transition-all duration-200 resize-none"
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
                                            className="pt-4"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full"
                                            >
                                                <Button 
                                                    type="submit" 
                                                    className="w-full h-12 bg-gradient-to-r from-yellow-500 to-green-600 hover:from-yellow-600 hover:to-green-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                                                >
                                                    <Send className="w-5 h-5" />
                                                    Send Message
                                                </Button>
                                            </motion.div>
                                        </motion.div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}