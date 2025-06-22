import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export default async function UserDashboardPage() {
    const session = await getServerSession(authOptions);
    // console.log("SESSION:", session); 
    if (!session || session.user.role !== "user") {
        return redirect("/login");
    }
    

    return (
        <div>
            <h1>User Dashboard</h1>
        </div>
    );
}
