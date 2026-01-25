import Link from "next/link";
import { LogoCompact } from "@/components/Logo";
import { ArrowLeft, Activity, Cpu, Shield, Zap, Book } from "lucide-react";

export default function Documentation() {
    return (
        <main className="min-h-screen bg-background text-primary selection:bg-white/20 pb-20">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <LogoCompact className="text-white h-8 w-auto" />
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-white transition-colors">
                        <ArrowLeft size={16} />
                        Back to App
                    </Link>
                </div>
            </nav>

            <div className="pt-32 px-4 md:px-8 max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-400">
                        <Book size={12} />
                        SYSTEM DOCUMENTATION
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
                        How it <span className="text-blue-400">Works</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl">
                        A concise guide to the self-healing infrastructure's core components and mechanics.
                    </p>
                </div>

                {/* Documentation Grid */}
                <div className="grid grid-cols-1 gap-8">

                    {/* Health Monitoring */}
                    <section id="health-monitoring" className="scroll-mt-32 p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-start gap-6">
                            <div className="p-3 rounded-xl bg-violet-500/20 border border-violet-500/30 shrink-0">
                                <Activity size={32} className="text-violet-400" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-display font-semibold">Health Monitoring</h2>
                                <ul className="space-y-3 text-zinc-400">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                                        <span>executes continuous <strong>HTTP health checks</strong> every second against the application core.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                                        <span>Analyzes response status codes to instantly identify <strong>service unavailability</strong> or errors.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                                        <span>Operates independently to ensure unbiased surveillance of system pulse.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Resource Tracking */}
                    <section id="resource-tracking" className="scroll-mt-32 p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-start gap-6">
                            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 shrink-0">
                                <Cpu size={32} className="text-amber-400" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-display font-semibold">Resource Tracking</h2>
                                <ul className="space-y-3 text-zinc-400">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                        <span>Real-time monitoring of <strong>CPU and Memory</strong> consumption.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                        <span>Enforces strict thresholds (e.g., <strong>100MB RAM</strong> limit) to prevent resource runaway.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                                        <span>Triggers alerts immediately when usage spikes beyond safe operating parameters.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Automatic Recovery */}
                    <section id="automatic-recovery" className="scroll-mt-32 p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-start gap-6">
                            <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30 shrink-0">
                                <Zap size={32} className="text-cyan-400" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-display font-semibold">Automatic Recovery</h2>
                                <ul className="space-y-3 text-zinc-400">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                                        <span><strong>Zero-touch restoration</strong> triggered upon failure detection.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                                        <span>Restarts the backend process cleanly to restore service state.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                                        <span>Designed to achieve recovery times of <strong>under 3 seconds</strong>.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Real-time Telemetry */}
                    <section id="real-time-telemetry" className="scroll-mt-32 p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-start gap-6">
                            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 shrink-0">
                                <Shield size={32} className="text-emerald-400" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-display font-semibold">Real-time Telemetry</h2>
                                <ul className="space-y-3 text-zinc-400">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        <span>streams <strong>live diagnostic data</strong> to the Mission Control dashboard.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        <span>Logs critical events (Healthy, Degraded, Down, Recovering) for audit.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        <span>Provides visual confirmation of system stability and self-healing actions.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                </div>

                <div className="py-12 border-t border-white/5 text-center text-zinc-500 text-sm">
                    Axolot Infrastructure Documentation • Version 1.0
                </div>

            </div>
        </main>
    );
}
