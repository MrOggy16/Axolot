"use client";

import { useState, useEffect } from "react";
import {
    AlertTriangle,
    Bomb,
    Droplets,
    Activity,
    Skull,
    Flame,
    Zap,
    Radiation,
    Timer,
    Cpu,
    Shuffle
} from "lucide-react";

const API_URL = "http://localhost:5000";

interface ChaosButton {
    label: string;
    desc: string;
    endpoint: string;
    icon: React.ElementType;
    color: string;
    hoverBg: string;
    hoverBorder: string;
    iconHover: string;
    violent?: boolean;
}

export default function ControlPanel() {
    const [status, setStatus] = useState<string>("Ready to inject chaos");
    const [loading, setLoading] = useState(false);
    const [backendAlive, setBackendAlive] = useState<boolean | null>(null);
    const [showAllButtons, setShowAllButtons] = useState(false);

    // Check if backend is alive
    useEffect(() => {
        const checkBackend = async () => {
            try {
                const res = await fetch(`${API_URL}/health`, { method: "GET" });
                setBackendAlive(res.ok);
            } catch {
                setBackendAlive(false);
            }
        };

        checkBackend();
        const interval = setInterval(checkBackend, 2000);
        return () => clearInterval(interval);
    }, []);

    const trigger = async (endpoint: string, label: string) => {
        setLoading(true);
        setStatus(`⏳ Triggering: ${label}...`);

        // Report event to Mission Control for visual spike
        const eventType = endpoint.replace('/', '').replace('-', '-');
        try {
            await fetch('http://localhost:5001/api/event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: eventType, label })
            });
        } catch {
            // Ignore if API server not running
        }

        try {
            const res = await fetch(`${API_URL}${endpoint}`, { method: "GET" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setStatus(`✅ ${JSON.stringify(data).slice(0, 40)}...`);
        } catch (e) {
            if (endpoint.includes("crash") || endpoint.includes("nuclear") || endpoint.includes("chaos")) {
                setStatus("💥 Server Destroyed! Watch the dashboard...");
            } else {
                setStatus(`⚠️ ${(e as Error).message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const primaryButtons: ChaosButton[] = [
        {
            label: "Crash",
            desc: "sys.exit(1)",
            endpoint: "/crash",
            icon: Bomb,
            color: "red",
            hoverBg: "hover:bg-red-500/20",
            hoverBorder: "hover:border-red-500/50",
            iconHover: "group-hover/btn:text-red-400",
        },
        {
            label: "Hard Crash",
            desc: "Segfault",
            endpoint: "/hard-crash",
            icon: Skull,
            color: "rose",
            hoverBg: "hover:bg-rose-500/20",
            hoverBorder: "hover:border-rose-500/50",
            iconHover: "group-hover/btn:text-rose-400",
            violent: true,
        },
        {
            label: "Nuclear ☢️",
            desc: "SIGKILL",
            endpoint: "/nuclear",
            icon: Radiation,
            color: "fuchsia",
            hoverBg: "hover:bg-fuchsia-500/20",
            hoverBorder: "hover:border-fuchsia-500/50",
            iconHover: "group-hover/btn:text-fuchsia-400",
            violent: true,
        },
        {
            label: "Random Chaos",
            desc: "???",
            endpoint: "/chaos",
            icon: Shuffle,
            color: "violet",
            hoverBg: "hover:bg-violet-500/20",
            hoverBorder: "hover:border-violet-500/50",
            iconHover: "group-hover/btn:text-violet-400",
        },
    ];

    const secondaryButtons: ChaosButton[] = [
        {
            label: "Memory Leak",
            desc: "+10MB",
            endpoint: "/leak",
            icon: Droplets,
            color: "amber",
            hoverBg: "hover:bg-amber-500/20",
            hoverBorder: "hover:border-amber-500/50",
            iconHover: "group-hover/btn:text-amber-400",
        },
        {
            label: "Massive Leak",
            desc: "+100MB",
            endpoint: "/leak-massive",
            icon: Flame,
            color: "orange",
            hoverBg: "hover:bg-orange-500/20",
            hoverBorder: "hover:border-orange-500/50",
            iconHover: "group-hover/btn:text-orange-400",
            violent: true,
        },
        {
            label: "CPU Burn",
            desc: "100% CPU",
            endpoint: "/cpu-burn",
            icon: Cpu,
            color: "yellow",
            hoverBg: "hover:bg-yellow-500/20",
            hoverBorder: "hover:border-yellow-500/50",
            iconHover: "group-hover/btn:text-yellow-400",
        },
        {
            label: "HTTP 500",
            desc: "Error",
            endpoint: "/error",
            icon: AlertTriangle,
            color: "orange",
            hoverBg: "hover:bg-orange-500/20",
            hoverBorder: "hover:border-orange-500/50",
            iconHover: "group-hover/btn:text-orange-400",
        },
        {
            label: "Timeout",
            desc: "30s hang",
            endpoint: "/timeout",
            icon: Timer,
            color: "cyan",
            hoverBg: "hover:bg-cyan-500/20",
            hoverBorder: "hover:border-cyan-500/50",
            iconHover: "group-hover/btn:text-cyan-400",
        },
        {
            label: "Slow Mode",
            desc: "Toggle",
            endpoint: "/slow",
            icon: Activity,
            color: "teal",
            hoverBg: "hover:bg-teal-500/20",
            hoverBorder: "hover:border-teal-500/50",
            iconHover: "group-hover/btn:text-teal-400",
        },
    ];

    const renderButton = (btn: ChaosButton) => {
        const Icon = btn.icon;
        return (
            <button
                key={btn.endpoint}
                onClick={() => trigger(btn.endpoint, btn.label)}
                disabled={loading || !backendAlive}
                className={`
                    relative flex flex-col items-start p-4 rounded-xl 
                    bg-white/5 ${btn.hoverBg} 
                    border border-white/5 ${btn.hoverBorder} 
                    transition-all group/btn
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${btn.violent ? 'overflow-hidden' : ''}
                `}
            >
                {/* Violent buttons get animated background */}
                {btn.violent && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 animate-pulse" />
                )}
                <div className="relative z-10 flex items-center gap-2 mb-1">
                    <Icon size={18} className={`text-zinc-400 ${btn.iconHover}`} />
                    {btn.violent && <span className="text-[10px] text-red-400 font-bold">VIOLENT</span>}
                </div>
                <span className={`relative z-10 font-medium text-sm text-zinc-300 group-hover/btn:text-white`}>
                    {btn.label}
                </span>
                <span className="relative z-10 text-xs text-zinc-600 font-mono">
                    {btn.desc}
                </span>
            </button>
        );
    };

    return (
        <div className="w-full h-full p-6 flex flex-col justify-between bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl relative overflow-hidden group">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-red-500/20 to-amber-500/20 rounded-xl border border-red-500/30">
                            <Flame size={20} className="text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-display font-semibold text-white">Chaos Controls</h3>
                            <p className="text-xs text-zinc-500">Fault injection panel</p>
                        </div>
                    </div>

                    {/* Backend status indicator */}
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            {backendAlive !== null && (
                                <>
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${backendAlive ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`} />
                                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${backendAlive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                </>
                            )}
                        </span>
                        <span className={`text-xs font-medium ${backendAlive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {backendAlive === null ? '...' : backendAlive ? 'Target Online' : 'Target Down'}
                        </span>
                    </div>
                </div>

                {/* Primary Crash Buttons - 2x2 Grid */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                    {primaryButtons.map(renderButton)}
                </div>

                {/* Toggle for more options */}
                <button
                    onClick={() => setShowAllButtons(!showAllButtons)}
                    className="w-full py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1"
                >
                    {showAllButtons ? '▲ Less options' : '▼ More chaos options'}
                </button>

                {/* Secondary Buttons - Collapsible */}
                {showAllButtons && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {secondaryButtons.map(renderButton)}
                    </div>
                )}
            </div>

            {/* Status Footer */}
            <div className="relative z-10 mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 mb-1">
                    <Zap size={12} className="text-zinc-500" />
                    <p className="text-xs uppercase tracking-widest text-zinc-500">Last Action</p>
                </div>
                <p className={`text-sm font-mono truncate ${status.includes('💥') ? 'text-red-400' :
                    status.includes('✅') ? 'text-emerald-400' :
                        'text-zinc-400'
                    }`}>
                    {status}
                </p>
            </div>
        </div>
    );
}
