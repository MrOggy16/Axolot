import os

# Configuration settings

# Target Application Settings
# On Render, use 0.0.0.0 to be accessible. Locally, use 127.0.0.1
APP_HOST = "0.0.0.0" if os.environ.get("RENDER") else "127.0.0.1"
# Render assigns a port via the PORT environment variable
APP_PORT = int(os.environ.get("PORT", 5000))

APP_URL = f"http://{APP_HOST}:{APP_PORT}"
APP_SCRIPT = "breakable_app.py"  # The script to run

# Monitoring Thresholds
CHECK_INTERVAL = 3  # Seconds between checks
MEMORY_THRESHOLD_MB = 100  # Restart if memory usage exceeds this
MAX_RETRIES = 3 # Max retries for health check before declaring failure

# Endpoints to monitor
HEALTH_ENDPOINT = f"{APP_URL}/health"
