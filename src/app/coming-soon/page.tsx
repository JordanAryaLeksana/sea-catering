"use client"
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import ParticlesBackground from "@/components/ui/BubbleParticle";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Sparkles, Zap } from "lucide-react";

export default function ComingSoonPage() {
    const router = useRouter();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut" as const
            }
        }
    };

    const floatingVariants = {
        animate: {
            y: [-10, 10, -10],
            rotate: [0, 5, 0, -5, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as const 
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative bg-white px-4 py-8">
   
            <div className="absolute z-0 inset-0">
                <ParticlesBackground />
            </div>


            <motion.div
                className="absolute top-20 left-10 text-yellow-300/30"
                variants={floatingVariants}
                animate="animate"
            >
                <Sparkles size={32} />
            </motion.div>
            <motion.div
                className="absolute top-32 right-16 text-yellow-400/40"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: "1s" }}
            >
                <Zap size={24} />
            </motion.div>
            <motion.div
                className="absolute bottom-32 left-20 text-yellow-300/20"
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: "2s" }}
            >
                <Clock size={28} />
            </motion.div>

            {/* Main Content */}
            <motion.div
                className="relative z-10 flex flex-col items-center justify-center max-w-2xl mx-auto text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Status Badge */}
                <motion.div variants={itemVariants} className="mb-6">
                    <Badge 
                        variant="outline" 
                        className="px-4 py-2 text-yellow-700 border-yellow-300 bg-yellow-50/80 backdrop-blur-sm font-medium"
                    >
                        <Clock className="w-4 h-4 mr-2" />
                        Under Development
                    </Badge>
                </motion.div>

                {/* Main Card */}
                <motion.div variants={itemVariants} className="w-full">
                    <Card className="border-yellow-200/50 bg-white/80 backdrop-blur-sm shadow-xl">
                        <CardContent className="p-8 md:p-12">
                       
                            <motion.h1 
                                className="text-4xl md:text-6xl text-yellow-400 font-bold mb-6 tracking-tight"
                                animate="animate"
                            >
                                Coming Soon!
                            </motion.h1>

                            <motion.p 
                                className="text-lg md:text-xl text-yellow-600 mb-8 leading-relaxed"
                                variants={itemVariants}
                            >
                                This page is under construction. Stay tuned for updates!
                            </motion.p>

                            <motion.div 
                                className="mb-8"
                                variants={itemVariants}
                            >
                                <div className="w-full bg-yellow-100 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: "75%" }}
                                        transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                                    />
                                </div>
                                <motion.p 
                                    className="text-sm text-yellow-600 mt-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 2 }}
                                >
                                    Development Progress: 75%
                                </motion.p>
                            </motion.div>

                            {/* Action Button */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button 
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 group"
                                    onClick={() => router.back()}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                                    Go Back!
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Additional Info Cards */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full"
                    variants={itemVariants}
                >
                    {[
                        { icon: Sparkles, title: "New Features", desc: "Exciting updates coming" },
                        { icon: Zap, title: "Performance", desc: "Lightning fast experience" },
                        { icon: Clock, title: "Soon", desc: "Just a little more time" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="border-yellow-100 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-200">
                                <CardContent className="p-4 text-center">
                                    <item.icon className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                                    <h3 className="font-semibold text-yellow-700 text-sm">{item.title}</h3>
                                    <p className="text-xs text-yellow-600 mt-1">{item.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/20 via-transparent to-yellow-100/20 pointer-events-none" />
        </div>
    );
}