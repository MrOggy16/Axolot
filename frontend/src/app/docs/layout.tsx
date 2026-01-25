import Link from "next/link";
import { ArrowLeft, BookOpen, Heart, Cpu, RefreshCw, Radio } from "lucide-react";

const docLinks = [
    { href: "/docs/health-monitoring", title: "Health Monitoring", icon: Heart },
    { href: "/docs/resource-tracking", title: "Resource Tracking", icon: Cpu },
    { href: "/docs/automatic-recovery", title: "Automatic Recovery", icon: RefreshCw },
    { href: "/docs/real-time-telemetry", title: "Real-time Telemetry", icon: Radio },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-primary">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 group">
                    <ArrowLeft size={18} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-lg text-black">
                        S
                    </div>
                    <span className="font-display font-semibold text-lg tracking-tight">
                        Self<span className="text-emerald-400">Heal</span>
                    </span>
                </Link>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/60 border border-white/10">
                    <BookOpen size={16} className="text-emerald-400" />
                    <span className="text-sm font-medium text-zinc-300">Documentation</span>
                </div>
            </nav>

            <div className="flex pt-20">
                {/* Sidebar */}
                <aside className="fixed left-0 top-20 bottom-0 w-64 bg-zinc-900/40 border-r border-white/5 p-6 overflow-y-auto hidden md:block">
                    <div className="space-y-1">
                        <Link
                            href="/docs"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <BookOpen size={18} />
                            <span className="text-sm font-medium">Overview</span>
                        </Link>

                        <div className="pt-4 pb-2">
                            <span className="px-4 text-xs font-medium text-zinc-600 uppercase tracking-wider">Features</span>
                        </div>

                        {docLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <link.icon size={18} />
                                <span className="text-sm font-medium">{link.title}</span>
                            </Link>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-6 md:p-12 max-w-4xl">
                    {children}
                </main>
            </div>
        </div>
    );
}
