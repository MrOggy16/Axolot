"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
    Activity,
    Heart,
    AlertTriangle,
    CheckCircle2,
    Zap,
    Clock,
    Server,
    RefreshCw,
    Wifi,
    WifiOff,
} from "lucide-react";
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface SystemStatus {
    status: "HEALTHY" | "CRITICAL" | "HEALING" | "UNKNOWN";
    last_check: string | null;
    uptime_start: string;
    total_crashes: number;
    last_crash: string | null;
    last_heal: string | null;
    latency_ms: number;
}

interface HeartbeatPoint {
    timestamp: string;
    latency: number;
    actual_latency?: number;
    status: "up" | "down";
    event_spike?: boolean;
    memory_mb?: number;
    cpu_percent?: number;
}

interface LogEntry {
    timestamp: string;
    type: "INFO" | "WARN" | "ERROR" | "CRASH" | "HEAL" | "EVENT";
    message: string;
}

// ============================================================================
// STATUS HUD COMPONENT
// ============================================================================

function StatusHUD({ status, connected }: { status: SystemStatus; connected: boolean }) {
    const statusConfig = {
        HEALTHY: {
            color: "text-emerald-400",
            bg: "bg-emerald-500/20",
            border: "border-emerald-500/50",
            icon: CheckCircle2,
            label: "OPERATIONAL",
        },
        CRITICAL: {
            color: "text-red-400",
            bg: "bg-red-500/20",
            border: "border-red-500/50",
            icon: AlertTriangle,
            label: "CRITICAL",
        },
        HEALING: {
            color: "text-amber-400",
            bg: "bg-amber-500/20",
            border: "border-amber-500/50",
            icon: RefreshCw,
            label: "HEALING",
        },
        UNKNOWN: {
            color: "text-zinc-400",
            bg: "bg-zinc-500/20",
            border: "border-zinc-500/50",
            icon: Activity,
            label: "UNKNOWN",
        },
    };

    const config = statusConfig[status.status] || statusConfig.UNKNOWN;
    const Icon = config.icon;

    return (
        <div
            className={`relative p-6 rounded-2xl border ${config.border} ${config.bg} backdrop-blur-xl overflow-hidden`}
        >
            {/* Animated background pulse for non-healthy states */}
            {status.status !== "HEALTHY" && status.status !== "UNKNOWN" && (
                <div
                    className={`absolute inset-0 ${config.bg} animate-pulse opacity-50`}
                />
            )}

            <div className="relative z-10">
                {/* Status Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className={`p-2.5 rounded-xl ${config.bg} ${config.border} border`}
                        >
                            <Icon
                                size={24}
                                className={`${config.color} ${status.status === "HEALING" ? "animate-spin" : ""}`}
                            />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                                Backend Status
                            </h3>
                            <p className={`text-2xl font-bold ${config.color}`}>
                                {config.label}
                            </p>
                        </div>
                    </div>

                    {/* Connection indicator */}
                    <div className="flex items-center gap-2">
                        {connected ? (
                            <>
                                <Wifi size={14} className="text-emerald-400" />
                                <span className="text-xs text-emerald-400 font-medium">
                                    Connected
                                </span>
                            </>
                        ) : (
                            <>
                                <WifiOff size={14} className="text-red-400" />
                                <span className="text-xs text-red-400 font-medium">
                                    Disconnected
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={14} className="text-zinc-500" />
                            <span className="text-xs text-zinc-500">Latency</span>
                        </div>
                        <p className="text-xl font-mono font-bold text-white">
                            {status.latency_ms > 0 ? `${status.latency_ms}ms` : "---"}
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle size={14} className="text-zinc-500" />
                            <span className="text-xs text-zinc-500">Crashes</span>
                        </div>
                        <p className={`text-xl font-mono font-bold ${status.total_crashes > 0 ? 'text-red-400' : 'text-white'}`}>
                            {status.total_crashes}
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock size={14} className="text-zinc-500" />
                            <span className="text-xs text-zinc-500">Last Crash</span>
                        </div>
                        <p className="text-sm font-mono text-zinc-300">
                            {status.last_crash
                                ? new Date(status.last_crash).toLocaleTimeString()
                                : "Never"}
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Heart size={14} className="text-zinc-500" />
                            <span className="text-xs text-zinc-500">Last Heal</span>
                        </div>
                        <p className="text-sm font-mono text-zinc-300">
                            {status.last_heal
                                ? new Date(status.last_heal).toLocaleTimeString()
                                : "---"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// HEARTBEAT GRAPH COMPONENT
// ============================================================================

function HeartbeatGraph({ data }: { data: HeartbeatPoint[] }) {
    const chartData = data.map((point, index) => ({
        index,
        latency: point.latency,
        actualLatency: point.actual_latency || point.latency,
        status: point.status,
        eventSpike: point.event_spike || false,
        time: new Date(point.timestamp).toLocaleTimeString(),
    }));

    // Show placeholder if no data
    if (chartData.length === 0) {
        return (
            <div className="p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                        <Activity size={18} className="text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            Heartbeat Monitor
                        </h3>
                        <p className="text-xs text-zinc-500">
                            Waiting for data...
                        </p>
                    </div>
                </div>
                <div className="h-48 flex items-center justify-center">
                    <div className="text-center">
                        <Activity size={32} className="mx-auto text-zinc-600 animate-pulse mb-2" />
                        <p className="text-sm text-zinc-500">Collecting heartbeat data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                        <Activity size={18} className="text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            Heartbeat Monitor
                        </h3>
                        <p className="text-xs text-zinc-500">
                            Response latency ({chartData.length} readings)
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="text-zinc-400">Up</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-zinc-400">Down (0ms)</span>
                    </div>
                </div>
            </div>

            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="index"
                            axisLine={false}
                            tickLine={false}
                            tick={false}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#71717a", fontSize: 10 }}
                            width={35}
                            domain={[0, 'auto']}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#18181b",
                                border: "1px solid #3f3f46",
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                            labelFormatter={(value) => chartData[value]?.time || ""}
                            formatter={(value) => [`${value ?? 0}ms`, "Latency"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="latency"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            fill="url(#latencyGradient)"
                            dot={false}
                            activeDot={{ r: 4, fill: "#06b6d4" }}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// ============================================================================
// LOG STREAM COMPONENT
// ============================================================================

function LogStream({ logs }: { logs: LogEntry[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const getLogStyle = (type: string) => {
        switch (type) {
            case "CRASH":
                return "text-red-400 bg-red-500/10 border-l-2 border-red-500";
            case "HEAL":
                return "text-emerald-400 bg-emerald-500/10 border-l-2 border-emerald-500";
            case "WARN":
                return "text-amber-400 bg-amber-500/10 border-l-2 border-amber-500";
            case "ERROR":
                return "text-red-400 bg-red-500/10 border-l-2 border-red-500";
            case "EVENT":
                return "text-cyan-400 bg-cyan-500/10 border-l-2 border-cyan-500";
            default:
                return "text-zinc-400 bg-white/5 border-l-2 border-zinc-600";
        }
    };

    return (
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/20 border border-violet-500/30">
                        <Server size={18} className="text-violet-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            System Logs
                        </h3>
                        <p className="text-xs text-zinc-500">
                            {logs.length} entries
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                    </span>
                    <span className="text-xs text-zinc-500">Live</span>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="h-64 overflow-y-auto font-mono text-xs space-y-1 scrollbar-thin"
            >
                {logs.length === 0 ? (
                    <p className="text-zinc-600 text-center py-8">
                        Waiting for logs...
                    </p>
                ) : (
                    logs.map((log, i) => (
                        <div
                            key={i}
                            className={`px-3 py-2 rounded-r-lg ${getLogStyle(log.type)} transition-all`}
                        >
                            <span className="text-zinc-500 mr-2">
                                {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold mr-2 uppercase`}
                            >
                                {log.type}
                            </span>
                            <span className="text-zinc-300">{log.message}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// ============================================================================
// MAIN MISSION CONTROL COMPONENT
// ============================================================================

export default function MissionControl() {
    const [status, setStatus] = useState<SystemStatus>({
        status: "UNKNOWN",
        last_check: null,
        uptime_start: new Date().toISOString(),
        total_crashes: 0,
        last_crash: null,
        last_heal: null,
        latency_ms: 0,
    });
    const [heartbeat, setHeartbeat] = useState<HeartbeatPoint[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [connected, setConnected] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Fetch all data from API
    const fetchAllData = useCallback(async () => {
        try {
            const [statusRes, heartbeatRes, logsRes] = await Promise.all([
                fetch(`${API_URL}/api/status`, { cache: 'no-store' }),
                fetch(`${API_URL}/api/heartbeat`, { cache: 'no-store' }),
                fetch(`${API_URL}/api/logs`, { cache: 'no-store' }),
            ]);

            if (statusRes.ok) {
                const statusData = await statusRes.json();
                setStatus(statusData);
                setConnected(true);
                setRetryCount(0);
            }

            if (heartbeatRes.ok) {
                const heartbeatData = await heartbeatRes.json();
                setHeartbeat(heartbeatData);
            }

            if (logsRes.ok) {
                const logsData = await logsRes.json();
                setLogs(logsData);
            }

            return true;
        } catch (error) {
            console.error("Failed to fetch data:", error);
            setConnected(false);
            setRetryCount(prev => prev + 1);
            return false;
        }
    }, []);

    // Initial fetch and polling
    useEffect(() => {
        // Initial fetch
        fetchAllData();

        // Poll every 1 second for real-time updates
        const pollInterval = setInterval(() => {
            fetchAllData();
        }, 1000);

        return () => {
            clearInterval(pollInterval);
        };
    }, [fetchAllData]);

    // Not connected state
    if (!connected && retryCount > 2) {
        return (
            <div className="p-8 rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl text-center">
                <div className="mb-4">
                    <WifiOff size={48} className="mx-auto text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-red-400 mb-2">
                    Mission Control API Offline
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                    Cannot connect to <code className="text-red-300 bg-red-500/20 px-2 py-0.5 rounded">{API_URL}</code>
                </p>
                <div className="text-left bg-zinc-900/50 p-4 rounded-xl text-sm font-mono text-zinc-400">
                    <p className="text-zinc-500 mb-2"># Check Connection:</p>
                    <p className="text-emerald-400">Ensure the backend is running and URL is correct.</p>
                </div>
                <button
                    onClick={() => {
                        setRetryCount(0);
                        fetchAllData();
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                    <RefreshCw size={14} className="inline mr-2" />
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Status HUD */}
            <StatusHUD status={status} connected={connected} />

            {/* Heartbeat Graph */}
            <HeartbeatGraph data={heartbeat} />

            {/* Log Stream */}
            <LogStream logs={logs} />
        </div>
    );
}
