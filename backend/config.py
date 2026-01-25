# Configuration settings

# Target Application Settings
APP_HOST = "127.0.0.1"
APP_PORT = 5000
APP_URL = f"http://{APP_HOST}:{APP_PORT}"
APP_SCRIPT = "breakable_app.py"  # The script to run

# Monitoring Thresholds
CHECK_INTERVAL = 3  # Seconds between checks
MEMORY_THRESHOLD_MB = 100  # Restart if memory usage exceeds this
MAX_RETRIES = 3 # Max retries for health check before declaring failure

# Endpoints to monitor
HEALTH_ENDPOINT = f"{APP_URL}/health"
