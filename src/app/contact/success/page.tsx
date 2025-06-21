import Link from "next/link";

export default function Success() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-green-600 mb-4">Success!</h1>
            <p className="text-lg text-gray-700">Your request has been successfully submitted.</p>
            <p className="text-md text-gray-500 mt-2">We will email you soon later.</p>
            <Link href="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Go to Home
            </Link>
        </div>
    );
}