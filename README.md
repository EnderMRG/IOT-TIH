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

**FloodEye** is a highly responsive Progressive Web Application (PWA) built with Next.js and Tailwind CSS. It is designed to visualize real-time water level data and environmental conditions from an ESP32 microcontroller. With its sleek glassmorphism UI, interactive charts, and intelligent alerting system, monitoring flood risks has never been easier. 

Uniquely, FloodEye integrates an in-browser **Machine Learning model** (TensorFlow.js) to provide real-time flood predictions up to 4 hours in advance based on environmental telemetry.

---

## ✨ Key Features

- 🧠 **AI-Powered Flood Prediction**: Utilizes an embedded TensorFlow.js model (`tfjs_model`) to analyze telemetry data and predict future flood risks locally in the browser.
- 📱 **Progressive Web App (PWA)**: Installable on iOS, Android, and Desktop with custom install prompts for instant offline-capable access.
- 🌊 **Scrollytelling Landing Page**: An immersive introduction built with GSAP and Lenis for smooth scrolling animations.
- 🗺️ **Live Interactive Map**: Pinpoint sensor node locations using MapLibre GL and MapTiler.
- 📊 **Real-Time Telemetry**: Instant visualization of Water Level, Temperature, Humidity, Atmospheric Pressure, and Altitude via ESP32 and ThingSpeak integration.
- 📈 **Dynamic Analytics & Comfort Score**: Interactive, time-series line charts built with Recharts to track historical water level trends and overall environmental comfort.
- 🚨 **Smart Alerts Engine**: Configurable thresholds that trigger visual warnings (e.g., High Water Level, Rapid Rise, Object Too Close, Sensor Disconnects) and dynamic Flood Risk levels (Normal, High, Critical).
- 🧪 **Offline/Cached Data Support**: Automatically displays last known data when the ESP32 device goes offline.

---

## 🛠️ Tech Stack

This project leverages modern web technologies for maximum performance and developer experience:

- **Core**: [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Machine Learning**: [TensorFlow.js](https://www.tensorflow.org/js) (Keras export patched for browser compatibility)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Custom Glassmorphism UI
- **Components**: [shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/)
- **Data Visualization & Maps**: [Recharts](https://recharts.org/), [MapLibre GL JS](https://maplibre.org/)
- **Animations & Scrolling**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/), [Lenis](https://lenis.darkroom.engineering/)
- **PWA**: [`next-pwa`](https://github.com/DuCanhGH/next-pwa)

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
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **View the Dashboard**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Hardware Setup

Check the `IOTcode/` folder for the Arduino sketch (`IOTcode.ino`) to flash to your ESP32.
- The default sketch demonstrates sensor setup (e.g., BMP180).
- Extend the code to upload distance (water level), temperature, and humidity directly to your ThingSpeak channel.

## 🧠 ML Model Details

The flood prediction capabilities are powered by a custom deep learning model located in the `Model/` directory (`FloodMonitoring.ipynb`).

**Algorithm Overview**:
The predictive engine utilizes a hybrid **1D-CNN + Bidirectional LSTM + Attention** architecture optimized for time series forecasting.
- **Input Features**: A 48-hour sequence window composed of cyclical time encodings (hour/month sine and cosine), raw sensor readings (temperature, humidity, pressure, water level), and their respective 3-hour moving trends.
- **Architecture**: 
  - A **1D Convolutional (Conv1D) layer** (64 filters) extracts short-term local temporal features and immediate trends from the sensor data.
  - A **Bidirectional LSTM layer** (64 units) processes the sequential data to capture complex long-term dependencies in both forward and backward directions.
  - A custom **Attention Mechanism** dynamically weights the most critical time steps (such as sudden pressure drops or rapid water level rises) to focus the model before passing the context vector to fully connected dense layers.
- **Output**: Predicts the precise water level 4 hours into the future (`water_level_plus_4h`).

**Browser Deployment**:
- The model is trained using TensorFlow/Keras and exported for web usage.
- `patch_model.js` is an included utility script that patches Keras 3 model exports to ensure full compatibility with the TensorFlow.js browser loader.
- The prediction inference runs completely client-side.

---

## ☁️ Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add your `THINGSPEAK_CHANNEL_ID`, `THINGSPEAK_READ_API_KEY`, and `NEXT_PUBLIC_MAPTILER_KEY` as Environment Variables in the Vercel dashboard.
4. Click **Deploy**.

For a detailed deployment guide, refer to the [Vercel Next.js Deployment Documentation](https://vercel.com/docs/frameworks/nextjs).

---

## 👥 Team

- **Moharnab Gogoi** - IoT Backend & Cloud Integration
- **Aryyaman Bora** - Frontend & UI Engineering
- **Mayuree Khanikar** - Documentation & Research
- **Indrani Gogoi** - Documentation

---
<div align="center">
  <i>Engineered with ❤️ for IoT Enthusiasts.</i>
</div>
