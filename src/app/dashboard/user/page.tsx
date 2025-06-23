import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserDashboardClient from "@/components/pages/UserDashboardClient";

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "user") {
    redirect("/login");
  }
//   console.log("User Dashboard Page - Session:", session);
  if (!session.user.id) {
    redirect("/login");
  }
//   console.log("User Dashboard Page - User ID:", session.user.id);
  return <UserDashboardClient userId={session.user.id} />;
}
