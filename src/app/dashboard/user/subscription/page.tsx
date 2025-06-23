import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserSubscriptionDashboardClient } from "@/components/pages/UserSubcriptionDashboardClient";


export default async function SubscriptionPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "user") {
        redirect("/login");
    }
    //   console.log("User Dashboard Page - Session:", session);
    if (!session.user.id) {
        redirect("/login");
    }
    console.log("User Dashboard Page - User ID:", session.user.id);
    return <UserSubscriptionDashboardClient userId={session.user.id} />;
}