"use client";

import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const TARGET_URL = process.env.NEXT_PUBLIC_TARGET_URL || "http://localhost:5000";

export default function TriggerChaosButton() {
    const [loading, setLoading] = useState(false);
    const [triggered, setTriggered] = useState(false);

    const triggerChaos = async () => {
        setLoading(true);

        // Report event to Mission Control for visual spike
        try {
            await fetch(`${API_URL}/api/event`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'chaos', label: 'Random Chaos' })
            });
        } catch {
            // Ignore if API server not running
        }

        try {
            await fetch(`${TARGET_URL}/chaos`, { method: "GET" });
            setTriggered(true);
            // Reset after animation
            setTimeout(() => setTriggered(false), 2000);
        } catch {
            // Expected - server crashes
            setTriggered(true);
            setTimeout(() => setTriggered(false), 2000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={triggerChaos}
            disabled={loading}
            className={`
                px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2
                ${triggered
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:scale-105'
                }
                disabled:opacity-70
            `}
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <Zap size={18} />
            )}
            {triggered ? '💥 CHAOS!' : 'Trigger Chaos'}
        </button>
    );
}
