"use client";
import { Button } from "@/components/ui/button";
import { CreditCard, Phone, Calendar, Package, Clock, PauseCircle, XCircle, Play, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useState } from "react";
import axiosClient from "@/lib/axios";
import { isAxiosError } from "axios";
import { useEffect } from "react";
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

export const UserSubscriptionDashboardClient = ({ userId }: { userId: string }) => {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        if (!userId) return;
        setIsLoading(true);

        const fetchSubscription = async () => {
            try {
                const res = await axiosClient.get(`/subscription/user/${userId}`);
                setSubscription(res.data.data);
                console.log("Subscription data:", res.data);
            } catch (error: unknown) {
                if (isAxiosError(error)) {
                    console.error("Error fetching subscription:", error.response?.data);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscription();
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

    const HandleReactivateSubs = async () => {
        if (!subscription) {
            alert("No subscription to reactivate");
            return;
        }

        const isConfirmed = window.confirm(
            "Apakah Anda yakin ingin mengaktifkan kembali langganan?"
        );
        if (!isConfirmed) return;

        setIsLoading(true);
        try {
            const response = await axiosClient.patch(`/subscription/${subscription.id}/reactivate`);
            setSubscription(response.data.data);
            alert("Subscription reactivated successfully");
            console.log("Subscription reactivated:", response.data);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                alert(error.response?.data?.error || "An error occurred while reactivating subscription");
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

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'PAUSED':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Skeleton className="h-12 w-48" />
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6 lg:p-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-4xl mx-auto space-y-6">

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

                                            {subscription.status === "CANCELLED" && (
                                                <motion.div
                                                    variants={buttonVariants}
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                >
                                                    <Button
                                                        onClick={HandleReactivateSubs}
                                                        disabled={isLoading}
                                                        variant="outline"
                                                        className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50"
                                                    >
                                                        <RotateCcw className="w-4 h-4 mr-2" />
                                                        Aktifkan Kembali
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
                                        className={`space-y-6 relative ${subscription.status === "CANCELLED" ? "blur-sm" : ""}`}
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

                                        {/* CANCELLED Info */}
                                        {subscription.status === "CANCELLED" && (
                                            <motion.div
                                                variants={itemVariants}
                                                className="p-4 rounded-lg bg-red-50 border border-red-200"
                                            >
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <XCircle className="h-5 w-5 text-red-600" />
                                                    <p className="font-semibold text-red-800">Langganan Tidak Aktif</p>
                                                </div>
                                                <p className="text-red-700">
                                                    Langganan Anda saat ini tidak aktif. Klik tombol Aktifkan Kembali untuk mengaktifkan langganan.
                                                </p>
                                            </motion.div>
                                        )}

                                        {subscription.status === "CANCELLED" && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px] rounded-lg"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="text-center p-6 bg-white/90 rounded-lg shadow-lg border"
                                                >
                                                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                                                    <p className="text-lg font-semibold text-gray-800 mb-2">Langganan Tidak Aktif</p>
                                                    <p className="text-gray-600 mb-4">Aktifkan kembali untuk melanjutkan layanan</p>
                                                    <Button
                                                        onClick={HandleReactivateSubs}
                                                        disabled={isLoading}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    >
                                                        <RotateCcw className="w-4 h-4 mr-2" />
                                                        {isLoading ? "Mengaktifkan..." : "Aktifkan Kembali"}
                                                    </Button>
                                                </motion.div>
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
};