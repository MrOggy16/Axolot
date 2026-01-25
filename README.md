# Axolot - Self-Healing Infrastructure

Axolot is a demonstration of **autonomic computing principles**, showcasing a system that can detect failures, resource exhaustion, and anomalies—and automatically recover without human intervention.

<div align="center">
  <img src="frontend/public/logo.png" alt="Axolot Logo" width="200" />
</div>

## 🚀 How It Works

The system consists of four independent components working in harmony:

1.  **Breakable App (Target)**: A Flask application intentionally designed with "chaos endpoints" to crash, leak memory, or freeze.
2.  **The Healer (Autonomic Manager)**: A separate watchdog process that continuously monitors the app's health (HTTP) and resources (CPU/RAM).
3.  **Mission Control API**: A telemetry server that aggregates logs and events for real-time visualization.
4.  **Frontend Dashboard**: A Next.js interface to visualize the system status and trigger chaos events.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Visuals**: Custom SVG Graphics & Animations

### Backend
- **Language**: Python 3.x
- **Framework**: Flask
- **Monitoring**: Psutil (Process & System Utilities)
- **Concurrency**: Threading & Subprocesses

## 📂 Project Structure

- `start_demo.bat`: **Entry point**. Launches all services in parallel.
- `backend/`: Python backend services (Healer, App, Monitor, API).
  - `healer.py`: The "brain" of the system.
  - `monitor.py`: Health check logic.
  - `breakable_app.py`: The target app.
  - `api_server.py`: Telemetry API.
- `frontend/`: The Next.js dashboard application.

## ⚡ Getting Started

### Prerequisites
- **Python 3.x**
- **Node.js & npm**

### Running the Demo
Simply double-click **`start_demo.bat`** or run it from the terminal:

```bash
.\start_demo.bat
```

This will open three terminal windows and start:
1.  **Healer & App** (Port 5000)
2.  **Mission Control API** (Port 5001)
3.  **Frontend Dashboard** (Port 3000)

Open [http://localhost:3000](http://localhost:3000) to access the Mission Control.

## 🎮 Usage

1.  **Observe**: Watch the "Heartbeat" graph. It shows real-time latency and status.
2.  **Trigger Chaos**: Use the buttons on the dashboard to inject failures:
    - **Crash**: Kills the process (Healer should restart it in <3s).
    - **Memory Leak**: Fills RAM until the threshold (100MB) is active, triggering a restart.
    - **CPU Burn**: Spikes CPU usage.
3.  **Verify**: Check the logs panel to see the Healer detecting issues and taking action.

## 🛡️ License
MIT License
