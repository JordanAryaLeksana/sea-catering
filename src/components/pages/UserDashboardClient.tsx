"use client";

import { useEffect } from "react";
import axiosClient from "@/lib/axios";
import { useState } from "react";
import { isAxiosError } from "axios";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, CreditCard, Phone, Calendar, Package, Clock, PauseCircle, XCircle, Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Subscription = {
    id?: string;
    userId: string;
    name: string;
    PhoneNumber: string;
    planType: string;
    mealType: string;
    deliveryDays: string[];
    price: number;
    status: string;
    pausedFrom?: string;
    pausedUntil?: string;
};

type User = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    subscriptions: Subscription[];
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

const cardHoverVariants = {
    hover: {
        scale: 1.02,
        transition: { duration: 0.2 }
    }
};

const buttonVariants = {
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 }
    },
    tap: {
        scale: 0.95,
        transition: { duration: 0.1 }
    }
};

export default function UserDashboardClient({ userId }: { userId: string }) {
    const [userData, setUserData] = useState<User>();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Changed to true initially

    useEffect(() => {
        if (!userId) return;
        
        const fetchUserData = async () => {
            try {
                const response = await axiosClient.get(`/users/${userId}`);
                setUserData(response.data.data);
                console.log("User data fetched successfully:", response.data);
            } catch (error: unknown) {
                if (isAxiosError(error)) {
                    console.error("Error fetching user data:", error.response?.data);
                }
            }
        };

        const fetchSubscription = async () => {
            try {
                const res = await axiosClient.get(`/subscription/user/${userId}`);
                setSubscription(res.data.data);
                console.log("Subscription data:", res.data);
            } catch (error: unknown) {
                if (isAxiosError(error)) {
                    console.error("Error fetching subscription:", error.response?.data);
                }
            }
        };

        const fetchData = async () => {
            await Promise.all([fetchUserData(), fetchSubscription()]);
            setIsLoading(false); // Set loading to false after both requests complete
        };

        fetchData();
    }, [userId]);

    const HandleCancelSubscription = async () => {
        if (!subscription) {
            alert("No active subscription to cancel");
            return;
        }

        const isConfirmed = window.confirm(
            "Apakah Anda yakin ingin membatalkan langganan? Tindakan ini tidak dapat dibatalkan."
        );

        if (!isConfirmed) return;

        setIsLoading(true);
        try {
            const response = await axiosClient.patch(`/subscription/${subscription.id}/cancel`);
            setSubscription(response.data.data);
            alert("Subscription canceled successfully");
            console.log("Subscription canceled:", response.data);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                alert(error.response?.data?.error || "An error occurred while canceling subscription");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const HandlePauseSubscription = async () => {
        if (!subscription) {
            alert("No active subscription to pause");
            return;
        }

        const today = new Date();
        const todayString = today.toISOString().split('T')[0];

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split('T')[0];

        const pauseUntilInput = prompt(
            `Sampai tanggal berapa Anda ingin menjeda langganan?\n\nMasukkan tanggal dalam format YYYY-MM-DD\n(Minimum: ${tomorrowString}):`
        );

        if (!pauseUntilInput) return;

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(pauseUntilInput)) {
            alert("Format tanggal tidak valid. Gunakan format YYYY-MM-DD (contoh: 2025-07-15)");
            return;
        }

        const pauseUntilDate = new Date(pauseUntilInput);
        if (pauseUntilDate <= today) {
            alert("Tanggal tidak boleh hari ini atau sebelumnya. Pilih tanggal yang akan datang.");
            return;
        }
        
        const isConfirmed = window.confirm(
            `Apakah Anda yakin ingin menjeda langganan dari ${todayString} sampai ${pauseUntilInput}?`
        );

        if (!isConfirmed) return;

        setIsLoading(true);
        try {
            const response = await axiosClient.patch(`/subscription/${subscription.id}/pause`, {
                pausedFrom: todayString,
                pausedUntil: pauseUntilInput
            });
            setSubscription(response.data.data);
            alert(`Subscription paused from ${todayString} until ${pauseUntilInput}!`);
            console.log("Subscription paused:", response.data);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                alert(error.response?.data?.error || "An error occurred while pausing subscription");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const HandleResumeSubscription = async () => {
        if (!subscription) {
            alert("No subscription to resume");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axiosClient.patch(`/subscription/${subscription.id}/resume`);
            setSubscription(response.data.data);
            alert("Subscription resumed!");
            console.log("Subscription resumed:", response.data);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                alert(error.response?.data?.error || "An error occurred while resuming subscription");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'PAUSED':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'INACTIVE':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Show loading skeleton while data is being fetched
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header Skeleton */}
                    <div className="text-center space-y-2">
                        <Skeleton className="h-12 w-80 mx-auto" />
                        <Skeleton className="h-6 w-64 mx-auto" />
                    </div>
                    
                    {/* User Profile Card Skeleton */}
                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-16 w-16 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Skeleton className="h-20 w-full rounded-lg" />
                                <Skeleton className="h-20 w-full rounded-lg" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subscription Card Skeleton */}
                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-10 w-20" />
                                    <Skeleton className="h-10 w-24" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-8 w-24" />
                                    <div className="text-right space-y-1">
                                        <Skeleton className="h-8 w-28" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </div>
                                <Separator />
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="h-24 w-full rounded-lg" />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
            <motion.div
                className="max-w-6xl mx-auto space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center space-y-2">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Dashboard Pengguna
                    </motion.h1>
                    <motion.p
                        className="text-gray-600 text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Kelola profil dan langganan Anda dengan mudah
                    </motion.p>
                </motion.div>

                {/* User Profile Card */}
                {userData && (
                    <motion.div variants={itemVariants}>
                        <motion.div variants={cardHoverVariants} whileHover="hover">
                            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-4">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                                        >
                                            <Avatar className="h-16 w-16 border-4 border-blue-100">
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                                                    {getInitials(userData.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </motion.div>
                                        <div className="space-y-1">
                                            <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                                                <User className="h-5 w-5 text-blue-600" />
                                                Profil Pengguna
                                            </CardTitle>
                                            <CardDescription className="text-gray-600">
                                                Informasi akun Anda
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <motion.div
                                        className="grid md:grid-cols-2 gap-4"
                                        variants={containerVariants}
                                    >
                                        <motion.div
                                            variants={itemVariants}
                                            className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100"
                                        >
                                            <User className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Nama Lengkap</p>
                                                <p className="text-lg font-semibold text-gray-900">{userData.name}</p>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            variants={itemVariants}
                                            className="flex items-center space-x-3 p-3 rounded-lg bg-green-50/50 border border-green-100"
                                        >
                                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Email</p>
                                                <p className="text-lg font-semibold text-gray-900">{userData.email}</p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}

                {/* Subscription Card */}
                <motion.div variants={itemVariants}>
                    <motion.div variants={cardHoverVariants} whileHover="hover">
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                                            <Package className="h-6 w-6 text-purple-600" />
                                            Status Langganan
                                        </CardTitle>
                                        <CardDescription className="text-gray-600">
                                            Detail paket langganan aktif Anda
                                        </CardDescription>
                                    </div>

                                    {/* Action Buttons */}
                                    {subscription && (
                                        <motion.div
                                            className="flex gap-2"
                                            variants={itemVariants}
                                        >
                                            {subscription.status === "ACTIVE" && (
                                                <motion.div
                                                    variants={buttonVariants}
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                >
                                                    <Button
                                                        onClick={HandlePauseSubscription}
                                                        disabled={isLoading}
                                                        variant="outline"
                                                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-400 disabled:opacity-50"
                                                    >
                                                        <PauseCircle className="w-4 h-4 mr-2" />
                                                        Jeda
                                                    </Button>
                                                </motion.div>
                                            )}

                                            {subscription.status === "PAUSED" && (
                                                <motion.div
                                                    variants={buttonVariants}
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                >
                                                    <Button
                                                        onClick={HandleResumeSubscription}
                                                        disabled={isLoading}
                                                        variant="outline"
                                                        className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 disabled:opacity-50"
                                                    >
                                                        <Play className="w-4 h-4 mr-2" />
                                                        Lanjutkan
                                                    </Button>
                                                </motion.div>
                                            )}

                                            {(subscription.status === "ACTIVE" || subscription.status === "PAUSED") && (
                                                <motion.div
                                                    variants={buttonVariants}
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                >
                                                    <Button
                                                        onClick={HandleCancelSubscription}
                                                        disabled={isLoading}
                                                        variant="outline"
                                                        className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Batalkan
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {subscription ? (
                                    <motion.div
                                        className="space-y-6"
                                        variants={containerVariants}
                                    >
                                        {/* Status Badge */}
                                        <motion.div variants={itemVariants} className="flex items-center justify-between">
                                            <Badge
                                                className={`px-4 py-2 text-sm font-semibold ${getStatusColor(subscription.status)}`}
                                            >
                                                {subscription.status === 'PAUSED' && <PauseCircle className="w-4 h-4 mr-1" />}
                                                {subscription.status}
                                            </Badge>
                                            <motion.div
                                                className="text-right"
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                <p className="text-2xl font-bold text-purple-600">
                                                    Rp{subscription.price?.toLocaleString("id-ID")}
                                                </p>
                                                <p className="text-sm text-gray-500">per bulan</p>
                                            </motion.div>
                                        </motion.div>

                                        <Separator />

                                        {/* Subscription Details Grid */}
                                        <motion.div
                                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                                            variants={containerVariants}
                                        >
                                            <motion.div
                                                variants={itemVariants}
                                                className="p-4 rounded-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-100"
                                            >
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Package className="h-4 w-4 text-blue-600" />
                                                    <p className="text-sm font-medium text-gray-700">Nama Paket</p>
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900">{subscription.name}</p>
                                            </motion.div>

                                            <motion.div
                                                variants={itemVariants}
                                                className="p-4 rounded-lg bg-gradient-to-r from-green-50/50 to-emerald-50/50 border border-green-100"
                                            >
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Phone className="h-4 w-4 text-green-600" />
                                                    <p className="text-sm font-medium text-gray-700">No. Telepon</p>
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900">{subscription.PhoneNumber}</p>
                                            </motion.div>

                                            <motion.div
                                                variants={itemVariants}
                                                className="p-4 rounded-lg bg-gradient-to-r from-orange-50/50 to-yellow-50/50 border border-orange-100"
                                            >
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <CreditCard className="h-4 w-4 text-orange-600" />
                                                    <p className="text-sm font-medium text-gray-700">Tipe Paket</p>
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900">{subscription.planType}</p>
                                            </motion.div>

                                            <motion.div
                                                variants={itemVariants}
                                                className="p-4 rounded-lg bg-gradient-to-r from-pink-50/50 to-rose-50/50 border border-pink-100"
                                            >
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <svg className="h-4 w-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                                    </svg>
                                                    <p className="text-sm font-medium text-gray-700">Tipe Makanan</p>
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900">{subscription.mealType}</p>
                                            </motion.div>

                                            <motion.div
                                                variants={itemVariants}
                                                className="p-4 rounded-lg bg-gradient-to-r from-indigo-50/50 to-blue-50/50 border border-indigo-100 md:col-span-2 lg:col-span-1"
                                            >
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Calendar className="h-4 w-4 text-indigo-600" />
                                                    <p className="text-sm font-medium text-gray-700">Hari Pengiriman</p>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {subscription.deliveryDays.map((day, index) => (
                                                        <motion.span
                                                            key={day}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: 0.1 * index }}
                                                            className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                                                        >
                                                            {day}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </motion.div>

                                        {/* Paused Info */}
                                        {subscription.status === "PAUSED" && (
                                            <motion.div
                                                variants={itemVariants}
                                                className="p-4 rounded-lg bg-yellow-50 border border-yellow-200"
                                            >
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Clock className="h-5 w-5 text-yellow-600" />
                                                    <p className="font-semibold text-yellow-800">Langganan Dijeda</p>
                                                </div>
                                                <p className="text-yellow-700">
                                                    Dijeda dari <span className="font-semibold">{subscription.pausedFrom}</span> sampai <span className="font-semibold">{subscription.pausedUntil}</span>
                                                </p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        variants={itemVariants}
                                        className="text-center py-12"
                                    >
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="mb-4"
                                        >
                                            <Package className="h-16 w-16 text-gray-300 mx-auto" />
                                        </motion.div>
                                        <p className="text-xl font-semibold text-gray-600 mb-2">Tidak ada langganan aktif</p>
                                        <p className="text-gray-500">Hubungi customer service untuk berlangganan</p>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}