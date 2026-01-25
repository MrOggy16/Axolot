import Link from "next/link";
import { LogoCompact } from "@/components/Logo";
import ControlPanel from "@/components/ControlPanel";
import MissionControl from "@/components/MissionControl";
import TriggerChaosButton from "@/components/TriggerChaosButton";
import { ArrowUpRight, CheckCircle2, Shield, Cpu, Zap, Activity } from "lucide-react";

export default function Home() {
    return (
        <main className="min-h-screen bg-background text-primary selection:bg-white/20 pb-20">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-2">
                    <LogoCompact className="text-white h-8 w-auto" />
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-secondary">
                    <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#controls" className="hover:text-white transition-colors">Controls</a>
                </div>

                <Link href="/documentation" className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-medium hover:scale-105 transition-transform">
                    Documentation
                </Link>
            </nav>

            <div className="pt-32 px-4 md:px-8 max-w-7xl mx-auto space-y-6">

                {/* Hero Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Hero Text */}
                    <div className="relative p-8 md:p-12 bg-zinc-900/40 border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.1),transparent_50%)]" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-400 mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                MISSION CONTROL ACTIVE
                            </div>
                            <h1 className="font-display text-4xl md:text-6xl font-semibold leading-[1.1] tracking-tight">
                                Self-Healing<br />
                                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                    Infrastructure
                                </span>
                            </h1>
                        </div>

                        <div className="relative z-10 mt-8">
                            <p className="text-zinc-400 max-w-md text-lg mb-6">
                                Watch your application crash, heal, and recover in real-time.
                                A demonstration of autonomic computing principles.
                            </p>
                            <div className="flex gap-3">
                                <TriggerChaosButton />
                                <a href="#dashboard" className="px-6 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
                                    <Activity size={18} />
                                    View Dashboard
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Control Panel */}
                    <div id="controls">
                        <ControlPanel />
                    </div>
                </section>

                {/* Stats Row */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-6 bg-zinc-900/40 border border-white/10 rounded-2xl hover:bg-zinc-900/60 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                                <Shield size={18} className="text-emerald-400" />
                            </div>
                        </div>
                        <h4 className="text-3xl font-display font-bold text-white">99.9%</h4>
                        <p className="text-zinc-500 text-sm">Uptime Target</p>
                    </div>

                    <div className="p-6 bg-zinc-900/40 border border-white/10 rounded-2xl hover:bg-zinc-900/60 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                                <Zap size={18} className="text-cyan-400" />
                            </div>
                        </div>
                        <h4 className="text-3xl font-display font-bold text-white">&lt;3s</h4>
                        <p className="text-zinc-500 text-sm">Recovery Time</p>
                    </div>

                    <div className="p-6 bg-zinc-900/40 border border-white/10 rounded-2xl hover:bg-zinc-900/60 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
                                <Cpu size={18} className="text-amber-400" />
                            </div>
                        </div>
                        <h4 className="text-3xl font-display font-bold text-white">100MB</h4>
                        <p className="text-zinc-500 text-sm">Memory Threshold</p>
                    </div>

                    <div className="p-6 bg-zinc-900/40 border border-white/10 rounded-2xl hover:bg-zinc-900/60 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-violet-500/20 border border-violet-500/30">
                                <Activity size={18} className="text-violet-400" />
                            </div>
                        </div>
                        <h4 className="text-3xl font-display font-bold text-white">1s</h4>
                        <p className="text-zinc-500 text-sm">Health Check Interval</p>
                    </div>
                </section>

                {/* Mission Control Dashboard */}
                <section id="dashboard" className="pt-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10">
                            <Activity size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-semibold text-white">Mission Control</h2>
                            <p className="text-sm text-zinc-500">Real-time system monitoring and telemetry</p>
                        </div>
                    </div>
                    <MissionControl />
                </section>

                {/* Features Section */}
                <section id="features" className="mt-12 border-t border-white/10 pt-12">
                    <h2 className="text-2xl font-display font-semibold text-white mb-8">How It Works</h2>
                    {[
                        { title: "Health Monitoring", desc: "Continuous HTTP health checks every second", link: "/documentation#health-monitoring" },
                        { title: "Resource Tracking", desc: "Memory and CPU usage monitoring with thresholds", link: "/documentation#resource-tracking" },
                        { title: "Automatic Recovery", desc: "Instant process restart on failure detection", link: "/documentation#automatic-recovery" },
                        { title: "Real-time Telemetry", desc: "Live streaming of system events and metrics", link: "/documentation#real-time-telemetry" },
                    ].map((item, i) => (
                        <Link href={item.link} key={i}>
                            <div className="group flex items-center justify-between py-6 border-b border-white/10 cursor-pointer">
                                <h3 className="text-xl md:text-2xl font-display font-medium text-zinc-400 group-hover:text-white transition-colors">
                                    <span className="text-sm font-mono text-zinc-600 mr-6">0{i + 1}</span>
                                    {item.title}
                                    <span className="text-sm font-normal text-zinc-600 ml-4 hidden md:inline">
                                        — {item.desc}
                                    </span>
                                </h3>
                                <ArrowUpRight className="text-zinc-600 group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100" />
                            </div>
                        </Link>
                    ))}
                </section>

            </div>
        </main>
    );
}
