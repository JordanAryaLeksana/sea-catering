import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";



export default function ComingSoonPage() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Coming Soon!</h1>
            <p className="text-lg text-gray-600">This page is under construction. Stay tuned for updates!</p>
            <Button className="mt-6" onClick={() => router.back()}>
                Go Back!
            </Button>
        </div>
    );
}