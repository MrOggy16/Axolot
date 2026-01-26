"""
Mission Control API Server
Provides real-time status and logs for the frontend dashboard.
Runs on port 5001 (separate from the breakable app on 5000).
"""

import os
import sys
import time
import json
import random
import threading
from collections import deque
from datetime import datetime
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import requests

# Fix Windows console encoding
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except:
        pass

app = Flask(__name__)
CORS(app)

# ============================================================================
# STATE MANAGEMENT
# ============================================================================

LOG_BUFFER = deque(maxlen=100)
HEARTBEAT_BUFFER = deque(maxlen=120)
CHAOS_EVENTS = deque(maxlen=50)

# Active fluctuations - stores events that should cause visual spikes
ACTIVE_FLUCTUATIONS = []

SYSTEM_STATUS = {
    "status": "UNKNOWN",
    "last_check": None,
    "uptime_start": datetime.now().isoformat(),
    "total_crashes": 0,
    "total_events": 0,
    "last_crash": None,
    "last_heal": None,
    "last_event": None,
    "latency_ms": 0,
    "memory_mb": 0,
    "cpu_percent": 0
}

status_lock = threading.Lock()

TARGET_URL = "http://localhost:5000/health"
TARGET_STATUS_URL = "http://localhost:5000/status"
HEALTH_CHECK_TIMEOUT = 0.5

# ============================================================================
# FLUCTUATION SYSTEM
# ============================================================================

def add_fluctuation(event_type: str, label: str):
    """Add a fluctuation effect that will show in the graph for several seconds."""
    print(f"[EVENT] Adding fluctuation for: {event_type} - {label}")
    
    # Define spike patterns - values are in ms added to base latency
    # Made MUCH larger to be clearly visible
    patterns = {
        'crash': {'base': 750, 'duration': 10, 'decay': True},  # Heavier!
        'hard-crash': {'base': 800, 'duration': 10, 'decay': True},
        'nuclear': {'base': 1200, 'duration': 12, 'decay': True},
        'chaos': {'base': 900, 'duration': 10, 'decay': True},  # Heavier!
        'leak': {'base': 300, 'duration': 6, 'decay': False, 'wave': True},
        'leak-massive': {'base': 500, 'duration': 8, 'decay': False, 'wave': True},
        'cpu-burn': {'base': 400, 'duration': 6, 'decay': False, 'wave': True},
        'error': {'base': 250, 'duration': 4, 'decay': True},
        'timeout': {'base': 200, 'duration': 5, 'decay': False},
        'slow': {'base': 150, 'duration': 4, 'decay': False},
    }
    
    pattern = patterns.get(event_type, {'base': 50, 'duration': 3, 'decay': True})
    
    fluctuation = {
        'start_time': time.time(),
        'end_time': time.time() + pattern['duration'],
        'base_spike': pattern['base'],
        'decay': pattern.get('decay', True),
        'wave': pattern.get('wave', False),
        'event_type': event_type,
        'label': label
    }
    
    with status_lock:
        ACTIVE_FLUCTUATIONS.append(fluctuation)

def get_current_spike():
    """Calculate the current spike value based on active fluctuations."""
    current_time = time.time()
    total_spike = 0
    
    with status_lock:
        # Remove expired fluctuations
        expired = []
        for i, f in enumerate(ACTIVE_FLUCTUATIONS):
            if current_time > f['end_time']:
                expired.append(i)
        
        for i in reversed(expired):
            ACTIVE_FLUCTUATIONS.pop(i)
        
        # Calculate spike from active fluctuations
        for f in ACTIVE_FLUCTUATIONS:
            elapsed = current_time - f['start_time']
            duration = f['end_time'] - f['start_time']
            progress = elapsed / duration
            
            if f['decay']:
                # Decaying spike - starts high, goes down
                spike = f['base_spike'] * (1 - progress * 0.8)  # Keep at least 20%
            elif f['wave']:
                # Wave pattern - oscillates between 50% and 100% of base
                import math
                wave = math.sin(elapsed * 4) * 0.25 + 0.75  # 0.5 to 1.0
                spike = f['base_spike'] * wave * (1 - progress * 0.3)
            else:
                # Constant spike that slowly fades
                spike = f['base_spike'] * (1 - progress * 0.5)
            
            # Add some randomness for visual interest
            spike *= (0.8 + random.random() * 0.4)
            total_spike += spike
    
    return max(0, int(total_spike))

# ============================================================================
# BACKGROUND HEALTH CHECKER
# ============================================================================

def health_check_loop():
    """Background thread that checks health every 500ms."""
    global SYSTEM_STATUS
    
    while True:
        start_time = time.time()
        
        try:
            response = requests.get(TARGET_URL, timeout=HEALTH_CHECK_TIMEOUT)
            latency = (time.time() - start_time) * 1000
            
            memory_mb = 0
            cpu_percent = 0
            try:
                status_res = requests.get(TARGET_STATUS_URL, timeout=0.5)
                if status_res.ok:
                    status_data = status_res.json()
                    memory_mb = status_data.get("memory_leaked_mb", 0)
                    if status_data.get("cpu_stress_active"):
                        cpu_percent = 100
            except:
                pass
            
            with status_lock:
                if response.status_code == 200:
                    if SYSTEM_STATUS["status"] in ["CRITICAL", "HEALING"]:
                        SYSTEM_STATUS["status"] = "HEALTHY"
                        SYSTEM_STATUS["last_heal"] = datetime.now().isoformat()
                        add_log("HEAL", "[HEALED] System recovered successfully!")
                    else:
                        SYSTEM_STATUS["status"] = "HEALTHY"
                    
                    SYSTEM_STATUS["latency_ms"] = round(latency, 2)
                    SYSTEM_STATUS["memory_mb"] = memory_mb
                    SYSTEM_STATUS["cpu_percent"] = cpu_percent
                else:
                    SYSTEM_STATUS["status"] = "CRITICAL"
                    SYSTEM_STATUS["latency_ms"] = 0
                    
                SYSTEM_STATUS["last_check"] = datetime.now().isoformat()
            
            # Get current spike from active fluctuations
            event_spike = get_current_spike()
            actual_latency = round(latency, 2) if response.status_code == 200 else 0
            display_latency = actual_latency + event_spike
            
            with status_lock:
                HEARTBEAT_BUFFER.append({
                    "timestamp": datetime.now().isoformat(),
                    "latency": display_latency,
                    "actual_latency": actual_latency,
                    "memory_mb": memory_mb,
                    "cpu_percent": cpu_percent,
                    "status": "up" if response.status_code == 200 else "down",
                    "event_spike": event_spike > 0
                })
                
        except requests.RequestException:
            event_spike = get_current_spike()
            
            with status_lock:
                if SYSTEM_STATUS["status"] == "HEALTHY":
                    SYSTEM_STATUS["total_crashes"] += 1
                    SYSTEM_STATUS["last_crash"] = datetime.now().isoformat()
                    add_log("CRASH", "[CRASH] Target application crashed!")
                    SYSTEM_STATUS["status"] = "HEALING"
                elif SYSTEM_STATUS["status"] != "HEALING":
                    SYSTEM_STATUS["status"] = "CRITICAL"
                
                SYSTEM_STATUS["latency_ms"] = 0
                SYSTEM_STATUS["last_check"] = datetime.now().isoformat()
                
                HEARTBEAT_BUFFER.append({
                    "timestamp": datetime.now().isoformat(),
                    "latency": event_spike,  # Show spike even when down
                    "actual_latency": 0,
                    "memory_mb": 0,
                    "cpu_percent": 0,
                    "status": "down",
                    "event_spike": event_spike > 0
                })
        
        time.sleep(0.5)

def add_log(log_type, message):
    """Add a log entry to the buffer."""
    LOG_BUFFER.append({
        "timestamp": datetime.now().isoformat(),
        "type": log_type,
        "message": message
    })

# ============================================================================
# LOG FILE WATCHER
# ============================================================================

def watch_healer_log():
    """Watch healer.log for new entries."""
    log_file = "healer.log"
    
    while not os.path.exists(log_file):
        time.sleep(1)
    
    with open(log_file, 'r', encoding='utf-8', errors='replace') as f:
        f.seek(0, 2)
        
        while True:
            line = f.readline()
            if line:
                line = line.strip()
                if line:
                    log_type = "INFO"
                    if "HEALER ACTIVATED" in line or "Issue Detected" in line:
                        log_type = "WARN"
                    elif "Error" in line or "error" in line:
                        log_type = "ERROR"
                    elif "Starting" in line or "started" in line:
                        log_type = "INFO"
                    
                    add_log(log_type, line)
            else:
                time.sleep(0.5)

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/api/status')
def get_status():
    with status_lock:
        return jsonify(SYSTEM_STATUS)

@app.route('/api/heartbeat')
def get_heartbeat():
    with status_lock:
        return jsonify(list(HEARTBEAT_BUFFER))

@app.route('/api/logs')
def get_logs():
    log_type = request.args.get('type')
    with status_lock:
        logs = list(LOG_BUFFER)
        if log_type:
            logs = [l for l in logs if l['type'] == log_type]
        return jsonify(logs)

@app.route('/api/event', methods=['POST'])
def record_event():
    """Record a chaos event and trigger fluctuations."""
    global SYSTEM_STATUS
    
    data = request.get_json() or {}
    event_type = data.get('type', 'unknown')
    event_label = data.get('label', 'Unknown Event')
    
    # Add fluctuation effect
    add_fluctuation(event_type, event_label)
    
    event = {
        "timestamp": datetime.now().isoformat(),
        "type": event_type,
        "label": event_label
    }
    
    with status_lock:
        CHAOS_EVENTS.append(event)
        SYSTEM_STATUS["total_events"] += 1
        SYSTEM_STATUS["last_event"] = event_label
        add_log("EVENT", f"[CHAOS] {event_label} triggered!")
    
    return jsonify({"status": "recorded", "event": event})

@app.route('/api/logs/stream')
def stream_logs():
    def generate():
        last_count = 0
        while True:
            with status_lock:
                current_count = len(LOG_BUFFER)
                if current_count > last_count:
                    new_logs = list(LOG_BUFFER)[last_count:]
                    for log in new_logs:
                        yield f"data: {json.dumps(log)}\n\n"
                    last_count = current_count
            time.sleep(0.5)
    
    return Response(generate(), mimetype='text/event-stream')

@app.route('/api/status/stream')
def stream_status():
    def generate():
        while True:
            with status_lock:
                data = {
                    **SYSTEM_STATUS,
                    "heartbeat": list(HEARTBEAT_BUFFER)[-10:] if HEARTBEAT_BUFFER else []
                }
                yield f"data: {json.dumps(data)}\n\n"
            time.sleep(1)
    
    return Response(generate(), mimetype='text/event-stream')

@app.route('/health')
def health():
    return "OK", 200

# ============================================================================
# STARTUP
# ============================================================================

if __name__ == "__main__":
    add_log("INFO", "[STARTUP] Mission Control API Server starting...")
    
    health_thread = threading.Thread(target=health_check_loop, daemon=True)
    health_thread.start()
    
    log_thread = threading.Thread(target=watch_healer_log, daemon=True)
    log_thread.start()
    
    print("=" * 50)
    print("  MISSION CONTROL API SERVER")
    print("=" * 50)
    print("  Port: 5001")
    print("  Active Fluctuation System: ENABLED")
    print("=" * 50)
    
    port = int(os.environ.get("PORT", 5001)) # Different default for local
    app.run(host="0.0.0.0", port=port)
