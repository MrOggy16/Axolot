import requests
import psutil
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - [MONITOR] - %(message)s')

def check_health(url):
    """
    Checks if the web application is reachable and returning 200 OK.
    Returns: True if healthy, False otherwise.
    """
    try:
        response = requests.get(url, timeout=2)
        if response.status_code == 200:
            return True, f"Status Code: {response.status_code}"
        else:
            return False, f"Status Code: {response.status_code}"
    except requests.ConnectionError:
        return False, "Connection Refused"
    except requests.Timeout:
        return False, "Request Timed Out"
    except Exception as e:
        return False, str(e)

def check_resources(pid, memory_limit_mb):
    """
    Checks if the process is running and if memory usage is within limits.
    Returns: (is_healthy: bool, message: str)
    """
    try:
        process = psutil.Process(pid)
        
        # Check if running (zombie processes are technically running but useless)
        if process.status() == psutil.STATUS_ZOMBIE:
            return False, "Process is Zombie"

        # Check memory usage
        mem_info = process.memory_info()
        mem_mb = mem_info.rss / (1024 * 1024)  # Convert bytes to MB
        
        if mem_mb > memory_limit_mb:
            return False, f"High Memory Usage: {mem_mb:.2f}MB > {memory_limit_mb}MB"
        
        return True, f"Memory Usage: {mem_mb:.2f}MB"
        
    except psutil.NoSuchProcess:
        return False, "Process ID not found (Crashed/Stopped)"
    except Exception as e:
        return False, f"Error checking resources: {str(e)}"
