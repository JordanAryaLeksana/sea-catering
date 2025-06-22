"use client";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios";
// import { useRouter } from "next/navigation";

type Subscription = {
    id: string;
    name: string;
    phoneNumber: string;
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
export default function AdminDashboard() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    // const router = useRouter();
    const [user, setUser] = useState<User>();
    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axiosClient.get("/subscription");
                setSubscriptions(response.data);
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
            }
        };
        const fetchUser = async () => {
            try {
                const response = await axiosClient.get("/user");
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchSubscriptions();
        fetchUser();
    }, []);

    return (
        <div className="flex w-full min-h-screen items-center justify-center bg-gray-100 p-4">
            <h1>Admin Dashboard</h1>
            <div>
                <h2 className="text-xl font-bold mb-4">Subscriptions</h2>
                {subscriptions.length === 0 ? (
                    <p>No subscriptions found.</p>
                ) : (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Name</th>
                                <th className="px-4 py-2 border">Phone Number</th>
                                <th className="px-4 py-2 border">Plan Type</th>
                                <th className="px-4 py-2 border">Meal Type</th>
                                <th className="px-4 py-2 border">Price</th>
                                <th className="px-4 py-2 border">Delivery Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((sub) => (
                                <tr key={sub.id}>
                                    <td className="px-4 py-2 border">{sub.name}</td>
                                    <td className="px-4 py-2 border">{sub.phoneNumber}</td>
                                    <td className="px-4 py-2 border">{sub.planType}</td>
                                    <td className="px-4 py-2 border">{sub.mealType}</td>
                                    <td className="px-4 py-2 border">${sub.price.toFixed(2)}</td>
                                    <td className="px-4 py-2 border">
                                        {sub.deliveryDays.join(", ")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <h2 className="text-xl font-bold mt-8">User Information</h2>
                {user ? (
                    <div key={user.id} className="bg-white p-4 rounded-lg shadow mb-4">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                    </div>
                ) : (
                    <p>No user information found.</p>
                )}
            </div>
        </div>
    );
}