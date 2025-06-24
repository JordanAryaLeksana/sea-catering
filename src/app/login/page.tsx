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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Sparkles, Shield, Key } from "lucide-react";
import ParticlesBackground from "@/components/ui/BubbleParticle";

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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const floatingVariants = {
        animate: {
            y: [-8, 8, -8],
            rotate: [0, 3, -3, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 relative overflow-hidden">
            <div className="absolute z-0 inset-0">
                <ParticlesBackground />
            </div>
            <motion.div
                className="absolute top-20 left-10 text-yellow-300/20"
                variants={floatingVariants}
                animate="animate"
            >
                <Sparkles size={24} />
            </motion.div>
            <motion.div
                className="absolute top-32 right-16 text-yellow-400/30"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: "1s" }}
            >
                <Shield size={28} />
            </motion.div>
            <motion.div
                className="absolute bottom-32 left-20 text-yellow-300/25"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: "2s" }}
            >
                <Key size={26} />
            </motion.div>

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-transparent to-yellow-100/20 pointer-events-none" />

            <motion.div
                className="w-full max-w-md relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-yellow-200/50 overflow-hidden">
                    <CardHeader className="text-center pb-4">
                        <motion.div
                            variants={itemVariants}
                            className="flex justify-center mb-4"
                        >
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <LogIn className="w-8 h-8 text-yellow-600" />
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <h1 className="text-3xl font-bold text-yellow-700 mb-2">Login</h1>
                            <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">
                                Welcome back
                            </Badge>
                        </motion.div>
                    </CardHeader>

                    <CardContent className="p-6 pt-0">
                        <Form {...form}>
                            <motion.form 
                                onSubmit={form.handleSubmit(onSubmit)} 
                                className="space-y-5"
                                variants={containerVariants}
                            >
                                {/* Email */}
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-yellow-700 font-medium flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <motion.div
                                                        whileFocus={{ scale: 1.02 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Input 
                                                            {...field} 
                                                            type="email" 
                                                            placeholder="you@example.com"
                                                            className="border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all duration-200"
                                                        />
                                                    </motion.div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                {/* Password */}
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-yellow-700 font-medium flex items-center gap-2">
                                                    <Lock className="w-4 h-4" />
                                                    Password
                                                </FormLabel>
                                                <FormControl>
                                                    <motion.div
                                                        whileFocus={{ scale: 1.02 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Input 
                                                            {...field} 
                                                            type="password" 
                                                            placeholder="••••••••"
                                                            className="border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all duration-200"
                                                        />
                                                    </motion.div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                {/* Login Button */}
                                <motion.div 
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button 
                                        type="submit" 
                                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 shadow-lg transition-all duration-200"
                                    >
                                        Sign In
                                    </Button>
                                </motion.div>

                                {/* OR Divider */}
                                <motion.div variants={itemVariants} className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-yellow-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-yellow-600 font-medium">or</span>
                                    </div>
                                </motion.div>

                                {/* Google Sign In */}
                                <motion.div 
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full border-yellow-200 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-300 font-medium py-3 transition-all duration-200"
                                        onClick={async () => {
                                            await signOut({ redirect: false });
                                            await signIn("google", {
                                                callbackUrl: "/dashboard/user",
                                                prompt: "consent select_account",
                                            });
                                        }}
                                        type="button"
                                    >
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        Sign in with Google
                                    </Button>
                                </motion.div>
                            </motion.form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Bottom Decorative Text */}
                <motion.div 
                    className="text-center mt-6"
                    variants={itemVariants}
                >
                    <p className="text-sm text-yellow-600/80">
                        Dont have an account? 
                        <button 
                            onClick={() => router.push("/register")}
                            className="ml-1 font-medium text-yellow-700 hover:text-yellow-800 transition-colors underline"
                        >
                            Register here
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}