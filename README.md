<div align="center">
  <img src="public/logotih.png" alt="TIH Logo" width="120" height="120">
  <h1 align="center">FloodEye: Real-time Flood Alert & Water Level Monitoring System</h1>
  <p align="center">
    A modern, AI-powered telemetry dashboard for real-time ESP32 flood monitoring, predictive analytics, and early water level alerts.
  </p>
  <p align="center">
    <a href="#features"><strong>Explore Features</strong></a> ·
    <a href="#getting-started"><strong>Getting Started</strong></a> ·
    <a href="#deployment"><strong>Deploying</strong></a>
  </p>
  <br/>
</div>

## 🎯 Tagline
"Every Drop Monitored, Every Life Protected."

## 👁️ Vision
To leverage advanced IoT technologies, sensor networks and real-time data analytics for accurate flood and water level monitoring, enabling timely early warnings to protect lives, property and the environment. "Building a safer society and a flood-resilient future through smart technology."

## 🚀 Mission
- Monitor water levels in real time using IoT-enabled sensors. 
- Provide timely and reliable flood early warning alerts. 
- Deliver accurate and trustworthy data to government agencies and citizens. 
- Reduce disaster risks and improve community preparedness.

## 🌐 Overview

**FloodEye** is a highly responsive Progressive Web Application (PWA) built with Next.js and Tailwind CSS. It is designed to visualize real-time water level data and environmental conditions from an ESP32 microcontroller equipped with a DHT11, BMP180, and HC-SR04 sensor array. With its sleek glassmorphism UI, interactive charts, and intelligent alerting system, monitoring flood risks has never been easier. 

Uniquely, FloodEye integrates an in-browser **Machine Learning model** (TensorFlow.js) to provide real-time flood predictions up to 4 hours in advance based on environmental telemetry.

---

## ✨ Key Features

- 🧠 **AI-Powered Flood Prediction**: Utilizes an embedded TensorFlow.js model (`tfjs_model`) trained on Assam flood-sensor datasets to analyze telemetry data and predict future flood risks (Normal / High / Critical) locally in the browser.
- 📱 **Progressive Web App (PWA)**: Installable on iOS, Android, and Desktop with custom install prompts for instant offline-capable access.
- 🌊 **Scrollytelling Landing Page**: An immersive introduction built with GSAP and Lenis for smooth scrolling animations.
- 🗺️ **Live Interactive Map**: Pinpoint sensor node locations using MapLibre GL and MapTiler.
- 📊 **Real-Time Telemetry**: Instant visualization of Water Level, Temperature, Humidity, Atmospheric Pressure, and Altitude via ESP32 and ThingSpeak integration.
- 📈 **Dynamic Analytics & Comfort Score**: Interactive, time-series line charts built with Recharts to track historical water level trends and overall environmental comfort.
- 🚨 **Smart Alerts Engine**: Configurable thresholds that trigger visual warnings (e.g., High Water Level, Rapid Rise, Object Too Close, Sensor Disconnects).
- 🧪 **Offline/Cached Data Support**: Automatically displays last known data when the ESP32 device goes offline.

---

## 🛠️ Tech Stack

This project leverages modern web technologies for maximum performance and developer experience:

- **Core**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Machine Learning**: [TensorFlow.js](https://www.tensorflow.org/js) (Keras export patched for browser compatibility)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Custom Glassmorphism UI
- **Components**: [shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/)
- **Data Visualization & Maps**: [Recharts](https://recharts.org/), [MapLibre GL JS](https://maplibre.org/)
- **Animations & Scrolling**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/), [Lenis](https://lenis.darkroom.engineering/)
- **PWA**: [`@ducanh2912/next-pwa`](https://github.com/DuCanhGH/next-pwa)
- **Database**: [Neon PostgreSQL](https://neon.tech/)

---

## 🚀 Getting Started

Follow these steps to run the dashboard locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher)
- [npm](https://www.npmjs.com/) (v10.x or higher)
- ESP32 hardware (BMP180/DHT11/HC-SR04 sensors) feeding data to ThingSpeak

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
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   THINGSPEAK_CHANNEL_ID=your_channel_id
   THINGSPEAK_READ_API_KEY=your_read_api_key
   NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_key
   DATABASE_URL=your_neon_postgres_url
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **View the Dashboard**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

You can use the following credentials to test the dashboard:
- **Admin**: `admin@floodeye.com` / `Admin@FloodEye123!`
- **User**: `user@floodeye.com` / `User@FloodEye123!`

---

## ⚙️ Hardware & System Requirements

**Microcontroller:**
- 1x ESP32 Development Board (e.g., ESP32-WROOM-32)

**Sensors:**
- Temperature & Humidity: DHT11 or DHT22
- Atmospheric Pressure & Altitude: BMP180 or BMP280
- Distance/Water Level: HC-SR04 Ultrasonic Sensor

**Power Supply & Deployment:**
- Solar panel + LiPo battery + TP4056 charging module (for off-grid nodes)
- Waterproof enclosures for outdoor/riverbank deployment

Check the `IOTcode/` folder for the Arduino sketch (`IOTcode.ino`) to flash to your ESP32. It uses libraries such as `WiFi.h`, `HTTPClient.h`, DHT sensor library, Adafruit BMP085/BMP180 library, and ThingSpeak.

---

## 🧠 ML Model Details

The predictive engine utilizes a hybrid **1D-CNN + Bidirectional LSTM + Attention** architecture optimized for time series forecasting. Located in the `Model/` directory (`FloodMonitoring.ipynb`).

- **Input Features**: A 48-hour sequence window composed of cyclical time encodings, raw sensor readings, and their 3-hour moving trends.
- **Architecture**: 
  - **Conv1D layer** (64 filters) extracts short-term local temporal features.
  - **Bidirectional LSTM layer** (64 units) captures complex long-term dependencies.
  - **Attention Mechanism** dynamically weights critical time steps.
- **Output**: Predicts precise water level 4 hours into the future (`water_level_plus_4h`).
- **Browser Deployment**: Trained using Keras and exported for web usage. The `patch_model.js` script ensures full compatibility with the TensorFlow.js browser loader.

---

## 🔮 Upcoming Features (Roadmap)

- **Off-Screen Push & Email Notifications**: Web Push Notifications via the browser Push API and Email alerts via Resend/SendGrid.
- **Multi-Node Fleet Management**: Interactive pins on the MapLibre map for managing multiple ESP32 devices geographically.
- **External Weather API Correlation**: Integrate OpenWeatherMap API to correlate ESP32 sensor data with regional precipitation forecasts.
- **Generative AI "Environmental Summaries"**: Google Gemini API integration to generate natural-language flood risk summaries.
- **MQTT Real-Time Streaming**: Replace HTTP polling with MQTT over WebSockets (HiveMQ/AWS IoT Core) for zero-latency telemetry.
- **CSV Data Export**: One-click raw time-series sensor data export for offline analysis.

---

## ☁️ Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add your `THINGSPEAK_CHANNEL_ID`, `THINGSPEAK_READ_API_KEY`, `NEXT_PUBLIC_MAPTILER_KEY`, and `DATABASE_URL` as Environment Variables in the Vercel dashboard.
4. Click **Deploy**.

For a detailed deployment guide, refer to the [Vercel Next.js Deployment Documentation](https://vercel.com/docs/frameworks/nextjs).

---

## 👥 Team

- **Supervisor**: Ashish Kumar Mahato
- **Moharnab Gogoi** - IoT Backend & Cloud Integration
- **Aryyaman Bora** - Frontend & UI Engineering
- **Mayuree Khanikar** - Documentation & Research
- **Indrani Gogoi** - Documentation & Research

---
<div align="center">
  <i>Engineered with ❤️ for IoT Enthusiasts.</i>
</div>
