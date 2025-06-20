"use client";
import { motion } from 'framer-motion';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Subtle Background Animation */}
            <motion.div 
                className="absolute inset-0 opacity-15"
                animate={{ 
                    background: [
                        "radial-gradient(circle at 20% 50%, rgba(245,158,11,0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 20%, rgba(16,185,129,0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 40% 70%, rgba(34,197,94,0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 50%, rgba(245,158,11,0.1) 0%, transparent 50%)"
                    ]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Minimal Floating Elements */}
            <motion.div 
                className="absolute top-20 left-16 w-3 h-3 bg-amber-400 rounded-full opacity-40"
                animate={{ 
                    y: [0, -15, 0],
                    opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div 
                className="absolute top-1/3 right-10 w-2 h-2 bg-emerald-400 rounded-full opacity-35"
                animate={{ 
                    y: [0, 12, 0],
                    opacity: [0.35, 0.55, 0.35]
                }}
                transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />
            <motion.div 
                className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-green-400 rounded-full opacity-30"
                animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />

            {/* Hero Section */}
            <motion.section 
                className="relative z-10 pt-16 pb-12 text-center"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="container mx-auto px-4">
                    <motion.h1 
                        className="text-5xl md:text-7xl lg:text-8xl font-bold text-amber-600 mb-6"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{
                            textShadow: '2px 2px 4px rgba(245,158,11,0.2)'
                        }}
                    >
                        SEA CATERING
                    </motion.h1>
                    
                    <motion.div
                        className="rounded- px-8 py-4 inline-block shadow-lg border border-amber-200"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <p className="text-xl md:text-2xl text-amber-700 font-semibold">
                            Healthy Meals, Anytime, Anywhere
                        </p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Welcome Section */}
            <motion.section 
                className="relative z-10 py-16"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <div className="container mx-auto px-4">
                    <motion.div 
                        className="bg-white rounded-2xl p-8 md:p-12 shadow-lg max-w-5xl mx-auto border border-gray-100"
                        whileHover={{ 
                            scale: 1.01,
                            boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.h2 
                            className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            Welcome to SEA Catering
                        </motion.h2>
                        <motion.p 
                            className="text-lg md:text-xl text-gray-600 leading-relaxed text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 1 }}
                        >
                            Your premier destination for <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">customizable healthy meal services</span> with 
                            delivery coverage across all of Indonesia. Were committed to bringing 
                            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded"> nutritious, delicious meals</span> right to your doorstep, 
                            wherever you are in the archipelago.
                        </motion.p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Services Section */}
            <motion.section 
                className="relative z-10 py-16"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
            >
                <div className="container mx-auto px-4">
                    <motion.h2 
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.4 }}
                    >
                        Our Key Features
                    </motion.h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <motion.div 
                            className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.6 }}
                            whileHover={{ 
                                scale: 1.02,
                                borderColor: 'rgba(245,158,11,0.3)'
                            }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-sm">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Meal Customization</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Personalize your meals according to your dietary preferences, restrictions, and nutritional goals.
                            </p>
                        </motion.div>

                        <motion.div 
                            className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.8 }}
                            whileHover={{ 
                                scale: 1.02,
                                borderColor: 'rgba(59,130,246,0.3)'
                            }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-sm">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Nationwide Delivery</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                We deliver to major cities across Indonesia, ensuring fresh meals reach you wherever you are.
                            </p>
                        </motion.div>

                        <motion.div 
                            className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 2 }}
                            whileHover={{ 
                                scale: 1.02,
                                borderColor: 'rgba(16,185,129,0.3)'
                            }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-sm">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Nutritional Information</h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Detailed nutritional breakdown for every meal, helping you make informed healthy choices.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section 
                className="relative z-10 py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 2.2 }}
            >
                <div className="container mx-auto px-4">
                    <motion.h2 
                        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 2.4 }}
                    >
                        Contact Information
                    </motion.h2>
                    
                    <motion.div 
                        className="max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 2.6 }}
                    >
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <motion.div
                                    className="text-center"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Manager</h3>
                                    <p className="text-2xl text-gray-700 font-semibold">Brian</p>
                                </motion.div>
                                
                                <motion.div
                                    className="text-center"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone Number</h3>
                                    <p className="text-2xl text-gray-700 font-semibold">08123456789</p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            <div className="pb-16"></div>
        </div>
    );
}