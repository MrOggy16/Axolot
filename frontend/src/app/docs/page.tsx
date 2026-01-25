import Link from "next/link";
import { Heart, Cpu, RefreshCw, Radio, ArrowRight } from "lucide-react";

const features = [
    {
        href: "/docs/health-monitoring",
        title: "Health Monitoring",
        icon: Heart,
        color: "emerald",
        points: ["HTTP health checks", "1-second intervals", "Automatic failure detection"],
    },
    {
        href: "/docs/resource-tracking",
        title: "Resource Tracking",
        icon: Cpu,
        color: "cyan",
        points: ["Memory usage tracking", "CPU monitoring", "Threshold alerts"],
    },
    {
        href: "/docs/automatic-recovery",
        title: "Automatic Recovery",
        icon: RefreshCw,
        color: "amber",
        points: ["Instant process restart", "Zero manual intervention", "Failure event logging"],
    },
    {
        href: "/docs/real-time-telemetry",
        title: "Real-time Telemetry",
        icon: Radio,
        color: "violet",
        points: ["Live event streaming", "WebSocket updates", "Historical metrics"],
    },
];

const colorClasses = {
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400",
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400",
    violet: "from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-400",
};

export default function DocsPage() {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-display font-bold text-white mb-4">
                    Self-Heal Documentation
                </h1>
                <p className="text-lg text-zinc-400 max-w-2xl">
                    Learn how the self-healing infrastructure works. Simple, concise guides for each component.
                </p>
            </div>

            {/* Quick Start */}
            <section className="p-6 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-500/20 rounded-2xl">
                <h2 className="text-xl font-display font-semibold text-white mb-4">Quick Start</h2>
                <ul className="space-y-3 text-zinc-300">
                    <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">1</span>
                        <span>Start the backend server with <code className="px-2 py-1 bg-black/30 rounded text-emerald-400 text-sm">python api_server.py</code></span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">2</span>
                        <span>Launch the healer with <code className="px-2 py-1 bg-black/30 rounded text-emerald-400 text-sm">python healer.py</code></span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
                        <span>Open the dashboard and trigger chaos to see healing in action</span>
                    </li>
                </ul>
            </section>

            {/* Feature Cards */}
            <section>
                <h2 className="text-xl font-display font-semibold text-white mb-6">Core Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature) => (
                        <Link
                            key={feature.href}
                            href={feature.href}
                            className={`group p-6 bg-gradient-to-br ${colorClasses[feature.color as keyof typeof colorClasses]} border rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <feature.icon size={24} />
                                    <h3 className="font-display font-semibold text-white">{feature.title}</h3>
                                </div>
                                <ArrowRight size={18} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                            <ul className="space-y-2">
                                {feature.points.map((point, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                                        <span className="w-1 h-1 rounded-full bg-current" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Architecture Overview */}
            <section className="space-y-4">
                <h2 className="text-xl font-display font-semibold text-white">How It All Connects</h2>
                <div className="p-6 bg-zinc-900/40 border border-white/10 rounded-2xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                        <div className="p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                            <span className="text-emerald-400 font-mono text-sm">Monitor</span>
                            <p className="text-xs text-zinc-500 mt-1">Watches app health</p>
                        </div>
                        <ArrowRight className="text-zinc-600 rotate-90 md:rotate-0" />
                        <div className="p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                            <span className="text-cyan-400 font-mono text-sm">Detect</span>
                            <p className="text-xs text-zinc-500 mt-1">Identifies failures</p>
                        </div>
                        <ArrowRight className="text-zinc-600 rotate-90 md:rotate-0" />
                        <div className="p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                            <span className="text-amber-400 font-mono text-sm">Heal</span>
                            <p className="text-xs text-zinc-500 mt-1">Restarts processes</p>
                        </div>
                        <ArrowRight className="text-zinc-600 rotate-90 md:rotate-0" />
                        <div className="p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                            <span className="text-violet-400 font-mono text-sm">Report</span>
                            <p className="text-xs text-zinc-500 mt-1">Streams telemetry</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
