"""
Breakable App - A deliberately vulnerable Flask application
This app has various endpoints that simulate different types of failures
for testing self-healing systems.
"""

import os
import sys
import time
import signal
import threading
import multiprocessing
from flask import Flask, Response, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Global state for chaos
LEAKY_BUCKET = []
CPU_STRESS_ACTIVE = False
SLOW_MODE = False

@app.route('/')
def home():
    return """
    <html>
    <head><title>Breakable App</title></head>
    <body style="font-family: system-ui; padding: 40px; background: #0a0a0a; color: #fff;">
        <h1>Target App is Running!</h1>
        <p style="color: #22c55e;">Status: ONLINE</p>
        <h3>Available Chaos Endpoints:</h3>
        <ul>
            <li><a href="/crash" style="color: #ef4444;">/crash</a> - Graceful exit</li>
            <li><a href="/hard-crash" style="color: #ef4444;">/hard-crash</a> - Violent segfault</li>
            <li><a href="/nuclear" style="color: #ef4444;">/nuclear</a> - Kill signal (SIGKILL)</li>
            <li><a href="/leak" style="color: #f59e0b;">/leak</a> - Memory leak (+10MB)</li>
            <li><a href="/cpu-burn" style="color: #f59e0b;">/cpu-burn</a> - CPU stress</li>
            <li><a href="/slow" style="color: #f59e0b;">/slow</a> - Slow response mode</li>
            <li><a href="/error" style="color: #f97316;">/error</a> - HTTP 500</li>
            <li><a href="/timeout" style="color: #f97316;">/timeout</a> - Request timeout</li>
        </ul>
    </body>
    </html>
    """

@app.route('/health')
def health():
    global SLOW_MODE
    if SLOW_MODE:
        time.sleep(5)  # Simulate slow response
    return "OK", 200

# =============================================================================
# CRASH ENDPOINTS
# =============================================================================

@app.route('/crash')
def crash():
    """Graceful process exit"""
    print("[CRASH] Received /crash command. Exiting gracefully...")
    
    def delayed_exit():
        time.sleep(0.1)
        os._exit(1)
    
    threading.Thread(target=delayed_exit).start()
    return jsonify({"status": "crashing", "type": "graceful_exit"})

@app.route('/hard-crash')
def hard_crash():
    """Violent segmentation fault - causes immediate process death"""
    print("[HARD-CRASH] BOOM! Triggering Segmentation Fault...")
    
    def trigger_segfault():
        time.sleep(0.05)
        import ctypes
        ctypes.string_at(0)  # Null pointer dereference
    
    threading.Thread(target=trigger_segfault).start()
    return jsonify({"status": "hard_crashing", "type": "segfault"})

@app.route('/nuclear')
def nuclear():
    """Most violent crash - sends SIGKILL to self (cannot be caught)"""
    print("[NUCLEAR] Sending SIGKILL - TOTAL ANNIHILATION!")
    
    def nuclear_option():
        time.sleep(0.05)
        os.kill(os.getpid(), signal.SIGTERM)  # SIGKILL on Unix, SIGTERM on Windows
    
    threading.Thread(target=nuclear_option).start()
    return jsonify({"status": "nuclear_launch", "type": "sigkill"})

@app.route('/chaos')
def chaos():
    """Random chaos - picks a random failure mode"""
    import random
    chaos_options = [crash, hard_crash, leak, error]
    chosen = random.choice(chaos_options)
    print(f"[CHAOS] Randomly chose: {chosen.__name__}")
    return chosen()

# =============================================================================
# RESOURCE EXHAUSTION ENDPOINTS
# =============================================================================

@app.route('/leak')
def leak():
    """Memory leak - adds 10MB to global list"""
    global LEAKY_BUCKET
    print(f"[LEAK] Leaking 10MB of memory...")
    chunk = "X" * (10 * 1024 * 1024)  # 10MB string
    LEAKY_BUCKET.append(chunk)
    total_mb = len(LEAKY_BUCKET) * 10
    return jsonify({
        "status": "leaked",
        "chunk_size_mb": 10,
        "total_chunks": len(LEAKY_BUCKET),
        "total_leaked_mb": total_mb
    })

@app.route('/leak-massive')
def leak_massive():
    """Massive memory leak - adds 100MB at once"""
    global LEAKY_BUCKET
    print(f"[LEAK-MASSIVE] Leaking 100MB of memory!")
    for _ in range(10):
        chunk = "X" * (10 * 1024 * 1024)
        LEAKY_BUCKET.append(chunk)
    total_mb = len(LEAKY_BUCKET) * 10
    return jsonify({
        "status": "massive_leak",
        "chunk_size_mb": 100,
        "total_leaked_mb": total_mb
    })

def cpu_stress_worker():
    """Infinite CPU burn loop"""
    while CPU_STRESS_ACTIVE:
        _ = sum(i * i for i in range(10000))

@app.route('/cpu-burn')
def cpu_burn():
    """Start CPU stress - spawns threads that burn CPU"""
    global CPU_STRESS_ACTIVE
    if CPU_STRESS_ACTIVE:
        return jsonify({"status": "already_burning"})
    
    CPU_STRESS_ACTIVE = True
    print("[CPU-BURN] Starting CPU stress...")
    for _ in range(4):  # 4 threads burning CPU
        t = threading.Thread(target=cpu_stress_worker, daemon=True)
        t.start()
    
    return jsonify({"status": "cpu_burning", "threads": 4})

@app.route('/cpu-stop')
def cpu_stop():
    """Stop CPU stress"""
    global CPU_STRESS_ACTIVE
    CPU_STRESS_ACTIVE = False
    return jsonify({"status": "cpu_stopped"})

# =============================================================================
# NETWORK/RESPONSE ENDPOINTS
# =============================================================================

@app.route('/error')
def error():
    """HTTP 500 Internal Server Error"""
    return jsonify({"error": "Simulated Internal Server Error"}), 500

@app.route('/timeout')
def timeout():
    """Simulate request timeout - sleeps for 30 seconds"""
    print("[TIMEOUT] Sleeping for 30 seconds...")
    time.sleep(30)
    return jsonify({"status": "finally_responded"})

@app.route('/slow')
def slow():
    """Toggle slow mode - makes health checks take 5 seconds"""
    global SLOW_MODE
    SLOW_MODE = not SLOW_MODE
    return jsonify({"slow_mode": SLOW_MODE})

@app.route('/status')
def status():
    """Get current chaos state"""
    return jsonify({
        "memory_leaked_mb": len(LEAKY_BUCKET) * 10,
        "cpu_stress_active": CPU_STRESS_ACTIVE,
        "slow_mode": SLOW_MODE,
        "pid": os.getpid()
    })

# =============================================================================
# STARTUP
# =============================================================================

if __name__ == "__main__":
    print("=" * 50)
    print("  BREAKABLE APP - Chaos Engineering Target")
    print("=" * 50)
    print(f"  PID: {os.getpid()}")
    print("  Port: 5000")
    print("  Ready to be destroyed!")
    print("=" * 50)
    # Get port from environment or default to 5000
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, threaded=True, use_reloader=False)
