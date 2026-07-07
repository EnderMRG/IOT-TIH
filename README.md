# IoT Environmental Dashboard

A modern, highly responsive Next.js web application for monitoring real-time telemetry from an ESP32 microcontroller and an array of environmental sensors.

## Features

- **Real-Time Dashboard**: View live readings for Temperature, Humidity, Atmospheric Pressure, Altitude, and Distance.
- **Dynamic Charts**: Interactive time-series line charts for all sensor metrics.
- **Smart Alerts**: Configurable thresholds that generate real-time visual alerts (e.g., High Temperature, Object Too Close, Sensor Offline).
- **Comfort Score**: Proprietary scoring algorithm blending temperature and humidity into a 0-100 comfort rating.
- **Device Status**: Monitor ESP32 WiFi connectivity, ThingSpeak sync status, and RSSI signal strength.
- **Live Simulation Mode**: Built-in mock data generator for testing the UI without hardware connected.
- **Hardware Integrations**: Support for ThingSpeak Cloud Sync to retrieve stored sensor logs.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, custom glassmorphism design system
- **UI Components**: shadcn/ui, Lucide React (Icons)
- **Data Visualization**: Recharts
- **Animations**: Framer Motion

## Getting Started

### Prerequisites
Make sure you have Node.js (v20 or higher) and npm installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd "IoT Based Water Leveled indicator"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## Configuration

Navigate to the **Settings** page within the application to configure:
- ESP32 local IP address
- Sensor alert thresholds (Max Temp, Max Humidity, Min Distance, etc.)
- Data refresh intervals
- ThingSpeak Channel ID and API Key

## Simulation Mode
If you don't have the hardware set up yet, click the **Lightning Bolt** icon in the top right of the navigation bar to toggle Simulation Mode. This will inject realistic mock data into the telemetry provider, allowing you to preview charts, alerts, and gauges.
