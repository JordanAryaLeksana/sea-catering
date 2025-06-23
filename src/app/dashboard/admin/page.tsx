"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, TrendingUp, RotateCcw, DollarSign, Calendar, Phone, Package, User } from "lucide-react";
import axiosClient from "@/lib/axios";
import axios from "axios";

type Subscription = {
    id: string;
    name: string;
    PhoneNumber: string;
    planType: string;
    mealType: string;
    price: number;
    deliveryDays: string[];
};

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

type stats = {
    newSubscriptions: number;
    mrr: number;
    reactivations: number;
    subscriptionGrowth: number;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
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
            type: "spring" as const,
            stiffness: 100
        }
    }
};

const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20
        }
    }
} as const;

export default function AdminDashboard() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [data, setData] = useState<stats | null>(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User[]>([]);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axiosClient.get("/subscription");
                // console.log("Fetched subscriptions:", response.data.data);
                setSubscriptions(response.data.data);
            } catch (error: unknown) {
                if(axios.isAxiosError(error)) {
                    // console.error("Axios error:", error.response?.data || error.message);
                    alert(error.response?.data.error || "Unknown error");
                }
                console.error("Error fetching subscriptions:", error);
            }
        };
        const fetchUser = async () => {
            try {
                const response = await axiosClient.get("/users");
                setUser(response.data.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    alert(error.response?.data.error || "Unknown error");
                }
                // console.error("Error fetching user:", error);
            }
        };
        fetchSubscriptions();
        fetchUser();
    }, []);

    const [dateRange, setDateRange] = useState({
        newStart: "",
        newEnd: "",
        mrrStart: "",
        mrrEnd: "",
        reactStart: "",
        reactEnd: "",
        growthEnd: "",
    });

    const fetchData = async () => {
        const { newStart, newEnd, mrrStart, mrrEnd, reactStart, reactEnd, growthEnd } = dateRange;

        if (!newStart || !newEnd || !mrrStart || !mrrEnd || !reactStart || !reactEnd || !growthEnd) {
            alert("Please fill in all date ranges before fetching data.");
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams(dateRange as Record<string, string>);
            const response = await axiosClient.get("/admin/subsData", { params });
            setData(response.data);
            // console.log("Fetched data:", response.data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error))
                alert(error.response?.data.error || "Unknown error");
                // console.error("Axios error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        const iso = (d: Date) => d.toISOString().split("T")[0];

        setDateRange({
            newStart: iso(lastWeek),
            newEnd: iso(today),
            mrrStart: iso(lastWeek),
            mrrEnd: iso(today),
            reactStart: iso(lastWeek),
            reactEnd: iso(today),
            growthEnd: iso(today),
        });
    }, []);

    const getPlanColor = (planType: string) => {
        switch (planType.toLowerCase()) {
            case 'premium': return 'bg-gradient-to-r from-green-500 to-pink-500';
            case 'basic': return 'bg-gradient-to-r from-yellow-500 to-cyan-500';
            default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-8"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center space-y-4">
                        <motion.h1
                            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            Admin Dashboard
                        </motion.h1>
                        <motion.div
                            className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-green-500 mx-auto rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: 96 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        />
                    </motion.div>

                    {/* User Information Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                    <User className="h-5 w-5 text-yellow-600" />
                                    User Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {user.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Skeleton className="h-8 w-48 mx-auto mb-4" />
                                            <p className="text-gray-500">No user data available.</p>
                                        </div>
                                    ) : (
                                        user.map((u) => (
                                            <div key={u.id} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{u.name}</h3>
                                                    <p className="text-sm text-gray-600">{u.email}</p>
                                                    <Badge className="mt-2" variant="outline">{u.role}</Badge>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Date Range Configuration */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                    <Calendar className="h-5 w-5 text-green-600" />
                                    Date Range Configuration
                                </CardTitle>
                                <CardDescription>
                                    Configure date ranges for different metrics
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div
                                        className="space-y-2"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Users className="h-4 w-4 text-green-500" />
                                            New Subscriptions Range
                                        </label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="date"
                                                value={dateRange.newStart}
                                                onChange={e => setDateRange(d => ({ ...d, newStart: e.target.value }))}
                                                className="border-green-200 focus:border-green-500"
                                            />
                                            <Input
                                                type="date"
                                                value={dateRange.newEnd}
                                                onChange={e => setDateRange(d => ({ ...d, newEnd: e.target.value }))}
                                                className="border-green-200 focus:border-green-500"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="space-y-2"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <DollarSign className="h-4 w-4 text-yellow-500" />
                                            MRR Range
                                        </label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="date"
                                                value={dateRange.mrrStart}
                                                onChange={e => setDateRange(d => ({ ...d, mrrStart: e.target.value }))}
                                                className="border-yellow-200 focus:border-yellow-500"
                                            />
                                            <Input
                                                type="date"
                                                value={dateRange.mrrEnd}
                                                onChange={e => setDateRange(d => ({ ...d, mrrEnd: e.target.value }))}
                                                className="border-yellow-200 focus:border-yellow-500"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="space-y-2"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <RotateCcw className="h-4 w-4 text-orange-500" />
                                            Reactivations Range
                                        </label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="date"
                                                value={dateRange.reactStart}
                                                onChange={e => setDateRange(d => ({ ...d, reactStart: e.target.value }))}
                                                className="border-orange-200 focus:border-orange-500"
                                            />
                                            <Input
                                                type="date"
                                                value={dateRange.reactEnd}
                                                onChange={e => setDateRange(d => ({ ...d, reactEnd: e.target.value }))}
                                                className="border-orange-200 focus:border-orange-500"
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="space-y-2"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                            Subscription Growth Until
                                        </label>
                                        <Input
                                            type="date"
                                            value={dateRange.growthEnd}
                                            onChange={e => setDateRange(d => ({ ...d, growthEnd: e.target.value }))}
                                            className="border-green-200 focus:border-green-500"
                                        />
                                    </motion.div>
                                </div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={fetchData}
                                        disabled={loading}
                                        size="lg"
                                        className="w-full sm:w-auto bg-gradient-to-r from-yellow-600 to-green-600 hover:from-yellow-700 hover:to-green-700 text-white font-semibold shadow-lg"
                                    >
                                        {loading ? (
                                            <>
                                                <motion.div
                                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                />
                                                Loading...
                                            </>
                                        ) : (
                                            "Fetch Stats"
                                        )}
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Stats Cards */}
                    <AnimatePresence>
                        {data && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={containerVariants}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                <motion.div variants={statsVariants}>
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-green-600 mb-1">New Subscriptions</p>
                                                    <motion.p
                                                        className="text-3xl font-bold text-green-700"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                                    >
                                                        {data.newSubscriptions}
                                                    </motion.p>
                                                </div>
                                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                                    <Users className="h-6 w-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div variants={statsVariants}>
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-yellow-600 mb-1">MRR</p>
                                                    <motion.p
                                                        className="text-3xl font-bold text-yellow-700"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                                                    >
                                                        Rp{(data.mrr ?? 0).toLocaleString("id-ID")}
                                                    </motion.p>
                                                </div>
                                                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                                                    <DollarSign className="h-6 w-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div variants={statsVariants}>
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-orange-600 mb-1">Reactivations</p>
                                                    <motion.p
                                                        className="text-3xl font-bold text-orange-700"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                                                    >
                                                        {data.reactivations}
                                                    </motion.p>
                                                </div>
                                                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                                                    <RotateCcw className="h-6 w-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div variants={statsVariants}>
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-green-600 mb-1">Subscription Growth</p>
                                                    <motion.p
                                                        className="text-3xl font-bold text-green-700"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                                                    >
                                                        {data.subscriptionGrowth}
                                                    </motion.p>
                                                </div>
                                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                                    <TrendingUp className="h-6 w-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Subscriptions Table */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                    <Package className="h-5 w-5 text-indigo-600" />
                                    Subscriptions
                                </CardTitle>
                                <CardDescription>
                                    Overview of all active subscriptions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {subscriptions.length === 0 ? (
                                    <motion.div
                                        className="text-center py-12"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">No subscriptions found.</p>
                                    </motion.div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <motion.table
                                            className="w-full"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Plan</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Meal Type</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Delivery Days</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {subscriptions.map((sub, index) => (
                                                    <motion.tr
                                                        key={sub.id}
                                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        whileHover={{ backgroundColor: "#f9fafb" }}
                                                    >
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                                    {sub.name.charAt(0)}
                                                                </div>
                                                                <span className="font-medium text-gray-900">{sub.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="h-4 w-4 text-gray-400" />
                                                                <span className="text-gray-700">{sub.PhoneNumber}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <Badge
                                                                className={`${getPlanColor(sub.planType)} text-white border-0`}
                                                            >
                                                                {sub.planType}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className="text-gray-700">{sub.mealType}</span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className="font-semibold text-green-600">
                                                                Rp{(sub.price ?? 0).toLocaleString("id-ID")}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {sub.deliveryDays.map((day, i) => (
                                                                    <Badge
                                                                        key={i}
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        {day}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </motion.table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}