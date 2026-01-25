import subprocess
import time
import sys
import psutil
import config
from monitor import check_health, check_resources
import logging

# Configure logging to file and console
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [HEALER] - %(message)s',
    handlers=[
        logging.FileHandler("healer.log"),
        logging.StreamHandler(sys.stdout)
    ]
)

def start_app():
    """Starts the target application as a subprocess."""
    logging.info(f"🔧 Starting {config.APP_SCRIPT}...")
    # Use sys.executable to ensure we use the same Python interpreter
    process = subprocess.Popen([sys.executable, config.APP_SCRIPT])
    logging.info(f"✅ App started with PID: {process.pid}")
    return process

def stop_app(process):
    """Stops the target application."""
    if process and process.poll() is None:
        logging.info(f"🛑 Stopping process {process.pid}...")
        try:
            parent = psutil.Process(process.pid)
            for child in parent.children(recursive=True):
                child.terminate()
            parent.terminate()
            process.wait(timeout=3)
            print("✅ Process stopped.")
        except psutil.NoSuchProcess:
            print("⚠️  Process already gone.")
        except Exception as e:
            print(f"❌ Error stopping process: {e}")
            print("🔨 Forcing kill...")
            process.kill()

def main():
    print("🚑 Self-Healing System Active")
    print("----------------------------")
    
    # 1. Start the Patient
    target_process = start_app()
    
    # Give it a moment to boot
    time.sleep(2)

    try:
        while True:
            print("\n🔍 Cycle Check:")
            
            # 2. Check HTTP Health
            is_healthy_http, http_msg = check_health(config.HEALTH_ENDPOINT)
            print(f"   HTTP: {'✅' if is_healthy_http else '❌'} ({http_msg})")
            
            # 3. Check Resources (CPU/RAM)
            # Note: We check the process we started. 
            # If it crashed externally, target_process might be a stale object, so psutil handles validation.
            is_healthy_res, res_msg = check_resources(target_process.pid, config.MEMORY_THRESHOLD_MB)
            print(f"   RES : {'✅' if is_healthy_res else '❌'} ({res_msg})")

            # 4. Decision Engine
            if not is_healthy_http or not is_healthy_res:
                print("🚨 HEALER ACTIVATED! Issue Detected.")
                print(f"   Reason: {http_msg if not is_healthy_http else res_msg}")
                
                # RECOVERY ACTION: Restart
                stop_app(target_process)
                target_process = start_app()
                
                print("⏳ Waiting for stabilization...")
                time.sleep(3) # Give it time to come up
            
            else:
                print("👍 System Healthy.")

            time.sleep(config.CHECK_INTERVAL)

    except KeyboardInterrupt:
        print("\n\n🔌 Shutting down Healer...")
        stop_app(target_process)
        print("👋 Goodbye.")

if __name__ == "__main__":
    main()
