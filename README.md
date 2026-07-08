<div align="center">
  <img src="public/logotih.png" alt="IoT Logo" width="120" height="120">
  <h1 align="center">Flood Alert & Water Level Monitoring System</h1>
  <p align="center">
    A modern, high-performance telemetry dashboard for real-time ESP32 flood monitoring and water level alerts.
  </p>
  <p align="center">
    <a href="#features"><strong>Explore Features</strong></a> ·
    <a href="#getting-started"><strong>Getting Started</strong></a> ·
    <a href="#deployment"><strong>Deploying</strong></a>
  </p>
  <br/>
</div>

## 🌐 Overview

The **Flood Alert & Water Level Monitoring System** is a highly responsive web application built with Next.js and Tailwind CSS. It is designed to visualize real-time water level data and environmental conditions from an ESP32 microcontroller equipped with an array of sensors. With its sleek glassmorphism UI, interactive charts, and intelligent alerting system, monitoring flood risks and water levels has never been easier.

---

## ✨ Key Features

- 📊 **Real-Time Telemetry**: Instant visualization of Water Level (Proximity), Temperature, Humidity, Atmospheric Pressure, and Altitude.
- 📈 **Dynamic Analytics**: Interactive, time-series line charts built with Recharts to track historical water level trends and environmental changes.
- 🚨 **Smart Alerts Engine**: Configurable thresholds that trigger visual and critical warnings (e.g., High Water Level, Rapid Rise in Water, Sensor Disconnects).
- 🌊 **Flood Risk Algorithm**: A scoring system that calculates flood risk based on blended water level, temperature, and humidity metrics.
- 📡 **Hardware Integration**: Native support for **ThingSpeak Cloud Sync** to retrieve stored sensor logs and ESP32 status metrics (WiFi state, RSSI).
- 🧪 **Developer Simulation Mode**: Built-in mock data generator allows UI testing and demonstration without physical hardware.

---

## 🛠️ Tech Stack

This project leverages modern web technologies for maximum performance and developer experience:

- **Core**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Custom Glassmorphism UI
- **Components**: [shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Getting Started

Follow these steps to run the dashboard locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher)
- [npm](https://www.npmjs.com/) (v10.x or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "IOT-TIH"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your ThingSpeak credentials:
   ```env
   THINGSPEAK_CHANNEL_ID=your_channel_id
   THINGSPEAK_READ_API_KEY=your_read_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **View the Dashboard**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Configuration

The dashboard includes a dedicated **Settings** panel to configure system behavior:

- **Network**: ESP32 Local IP Address configuration
- **Thresholds**: Define limits for alerts (Max Water Level, Max Temp, Max Humidity, etc.)
- **Performance**: Adjust data polling refresh intervals
- **Cloud**: Update ThingSpeak API credentials on the fly

> **Pro Tip (Simulation Mode)**: Click the ⚡ **Lightning Bolt** icon in the top navigation bar to toggle Simulation Mode. This injects realistic mock data, letting you test charts and alerts instantly without an ESP32!

---

## ☁️ Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add your `THINGSPEAK_CHANNEL_ID` and `THINGSPEAK_READ_API_KEY` as Environment Variables in the Vercel dashboard.
4. Click **Deploy**.

For a detailed deployment guide, refer to the [Vercel Next.js Deployment Documentation](https://vercel.com/docs/frameworks/nextjs).

---

## 👥 Team

- **Moharnab Gogoi** - IOT Backend
- **Aryyaman Bora** - Frontend
- **Mayuree Khanikar** - Documentation/Research
- **Indrani Gogoi** - Documentation/Research

---
<div align="center">
  <i>Engineered with ❤️ for IoT Enthusiasts.</i>
</div>
