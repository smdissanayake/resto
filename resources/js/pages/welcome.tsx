import React from 'react';
import { Head, Link } from '@inertiajs/react'; // Correct import for Inertia
import { ArrowRight, ChefHat, LayoutDashboard, Monitor, Smartphone, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FF6B00] selection:text-white overflow-x-hidden">
            <Head title="Welcome to RestoSaaS" />

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#ff9f4d] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6B00]/20">
                            <span className="font-bold text-xl text-white">R</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Resto<span className="text-[#FF6B00]">SaaS</span></span>
                    </div>

                    <Link
                        href="/login"
                        className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all hover:scale-105 active:scale-95"
                    >
                        Log In
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FF6B00]/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 text-[#FF6B00] text-sm font-bold tracking-wide mb-8">
                            THE ULTIMATE RESTAURANT OS
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                            Manage Your Restaurant <br className="hidden md:block" />
                            Like a <span className="text-[#FF6B00]">Pro</span>.
                        </h1>
                        <p className="text-lg lg:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
                            From Order to Kitchen to Profit. The all-in-one platform designed
                            to streamline operations, boost efficiency, and delight your specific customers.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/login"
                                className="group relative px-8 py-4 bg-[#FF6B00] hover:bg-[#e66000] rounded-full text-white font-bold text-lg shadow-xl shadow-[#FF6B00]/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
                            >
                                <span className="relative z-10">Enter System</span>
                                <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </Link>
                            <button disabled className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white/40 font-bold text-lg cursor-not-allowed">
                                View Demo (Coming Soon)
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-[#0A0A0A] border-t border-white/5 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-white/40">Powerful modules working in perfect harmony.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Monitor}
                            title="Smart POS"
                            description="Lightning fast point of sale designed for high-volume environments. Handle tables, takeaway, and delivery with ease."
                            color="text-blue-400"
                            bg="bg-blue-500/10"
                        />
                        <FeatureCard
                            icon={ChefHat}
                            title="Kitchen Display"
                            description="Direct link to the kitchen. Orders flash instantly on KDS screens with sound alerts. No more missing paper tickets."
                            color="text-orange-400"
                            bg="bg-orange-500/10"
                        />
                        <FeatureCard
                            icon={Smartphone}
                            title="Table Management"
                            description="Drag & drop floor plan editor. Real-time status updates (Occupied/Free) visible to all staff instantly."
                            color="text-green-400"
                            bg="bg-green-500/10"
                        />
                        <FeatureCard
                            icon={LayoutDashboard}
                            title="Inventory Control"
                            description="Track every ingredient. Auto-deduction based on recipes, low stock alerts, and supplier management."
                            color="text-purple-400"
                            bg="bg-purple-500/10"
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="Advanced Reports"
                            description="Deep insights into your business. Sales trends, staff performance, and top-selling items at a glance."
                            color="text-pink-400"
                            bg="bg-pink-500/10"
                        />
                        <FeatureCard
                            icon={Users}
                            title="Staff Management"
                            description="Role-based access control, secure PIN login, and performance tracking for your entire team."
                            color="text-yellow-400"
                            bg="bg-yellow-500/10"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 text-center text-white/20 text-sm">
                <p>&copy; {new Date().getFullYear()} Idigolla Restaurant System. All rights reserved.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description, color, bg }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-[#0F0F0F] border border-white/5 hover:border-white/10 transition-colors group"
        >
            <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-white/40 leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
