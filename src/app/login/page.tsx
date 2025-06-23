"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
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

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});



export default function LoginPage() {

    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(schema),
        mode: "onTouched",
        reValidateMode: "onChange",
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: z.infer<typeof schema>) => {
        await signOut({ redirect: false });
        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        // console.log("Login response:", data);
        const session = await getSession();
        if (session?.user?.role === "admin") {
            if (res?.error) {
                alert("Login failed: " + res.error);
                return;
            } else{
                alert("Login successful");
                router.push("/dashboard/admin");
            }
        } else {
            if (res?.error) {
                alert("Login failed: " + res.error);
                return;
            } else {
                alert("Login successful");
                router.push("/dashboard/user");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md bg-white p-6 rounded-xl shadow">
                    <h1 className="text-2xl font-bold">Login</h1>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" placeholder="you@example.com" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <Button type="submit" className="w-full">Login</Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                            await signOut({ redirect: false });
                            await signIn("google", {
                                callbackUrl: "/dashboard/user",
                                prompt: "consent select_account",
                            });
                        }}
                        type="button"
                    >
                        Sign in with Google
                    </Button>
                </form>
            </Form>
        </div>
    );
}