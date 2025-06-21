"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "@/lib/axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import axios from "axios";
const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
    const router = useRouter();
    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onTouched",
        reValidateMode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await axiosClient.post("/auth/register", data);
            console.log("Register success:", response.data);
            router.push("/login");
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
        <div className="flex w-full min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Your name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="you@example.com" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" placeholder="••••••••" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Register Button */}
                        <Button type="submit" className="w-full">Register</Button>

                        {/* OR Divider */}
                        <div className="text-center text-sm text-gray-500 my-2">or</div>

                        {/* Google Sign In */}
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full"
                            onClick={() => signIn("google", { callbackUrl: "/dashboard/user" })}
                        >
                            Sign in with Google
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
