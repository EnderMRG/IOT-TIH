# EcoSense - Smart Environmental & Distance Monitoring Dashboard

**Version:** 2.0  
**Author:** Moharnab Gogoi  
**Project Type:** IoT + Cloud Dashboard  
**Tech Stack:** ESP32 • ThingSpeak • Next.js • TypeScript • TailwindCSS • Neon PostgreSQL

---

# 1. Project Overview

EcoSense is a cloud-based IoT monitoring platform that collects environmental and proximity data from an ESP32 equipped with multiple sensors. The ESP32 periodically uploads sensor readings to ThingSpeak, which acts as the cloud data storage platform.

A Next.js full-stack application fetches the sensor data from ThingSpeak, processes it, generates analytics and alerts, and presents everything through an interactive, modern dashboard.

The project demonstrates real-time IoT monitoring, cloud integration, data visualization, and intelligent environmental analysis suitable for research, smart buildings, laboratories, classrooms, and industrial monitoring.

---

# 2. Problem Statement

Environmental conditions and object proximity often require continuous monitoring in smart environments. Traditional systems generally provide only raw values without historical visualization, analytics, or remote accessibility.

This project aims to provide a low-cost IoT solution capable of monitoring environmental parameters and object distance while offering cloud storage, historical analytics, and intelligent alerts through a responsive web dashboard.

---

# 3. Objectives

- Monitor environmental conditions in real time.
- Measure object distance using ultrasonic sensing.
- Upload sensor data to ThingSpeak every 15 seconds.
- Display live sensor values on a responsive dashboard.
- Visualize historical trends.
- Generate threshold-based alerts.
- Calculate an Environmental Comfort Score.
- Build a scalable full-stack architecture using Next.js.

---

# 4. Hardware Components

## Microcontroller

- ESP32 DevKit

---

## Sensors

### DHT11

Measures

- Temperature (°C)
- Humidity (%)

---

### BMP180

Measures

- Atmospheric Pressure (hPa)
- Altitude (m)

---

### HC-SR04 Ultrasonic Sensor

Measures

- Distance (cm)

---

# 5. Software Stack

## Frontend

- Next.js 15
- React
- TypeScript
- TailwindCSS
- shadcn/ui
- Recharts
- Framer Motion

---

## Backend

- Next.js Route Handlers
- Server Components
- Server Actions

---

## Cloud Storage

- ThingSpeak

---

## Database

- Neon PostgreSQL

Stores

- Users
- Alert History
- Device Information
- Dashboard Settings

---

## Deployment

- Vercel

---

# 6. System Architecture

```
DHT11
BMP180
HC-SR04
      │
      ▼
ESP32 DevKit
      │
      │ HTTP
      ▼
ThingSpeak Cloud
      │
 REST API
      ▼
Next.js Backend
      │
Data Processing
Analytics
Alert Engine
Caching
      │
      ▼
React Dashboard
```

---

# 7. ThingSpeak Field Mapping

| Field | Sensor Data |
|--------|-------------|
| Field 1 | Temperature |
| Field 2 | Humidity |
| Field 3 | Pressure |
| Field 4 | Altitude |
| Field 5 | Distance |

---

# 8. Functional Requirements

## FR-1

ESP32 shall collect sensor readings.

---

## FR-2

Sensor readings shall be uploaded to ThingSpeak every 15 seconds.

---

## FR-3

The backend shall fetch the latest readings from ThingSpeak.

---

## FR-4

The dashboard shall display live environmental information.

---

## FR-5

Users shall view historical sensor data.

---

## FR-6

Users shall switch between

- Last Hour
- Last 6 Hours
- Last 24 Hours
- Last Week
- Last Month

---

## FR-7

The system shall generate alerts.

---

## FR-8

The system shall calculate an Environmental Comfort Score.

---

## FR-9

The dashboard shall refresh automatically.

---

# 9. Dashboard Modules

---

## Dashboard

Displays

- Live Temperature
- Live Humidity
- Atmospheric Pressure
- Altitude
- Distance Measurement
- Device Status
- Last Updated Time

---

## Historical Analytics

Interactive charts for

- Temperature
- Humidity
- Pressure
- Altitude
- Distance

---

## Statistics

Displays

- Average Temperature
- Maximum Temperature
- Minimum Temperature
- Average Humidity
- Average Pressure
- Average Distance

---

## Alerts

Shows

- High Temperature
- High Humidity
- Rapid Pressure Change
- Object Too Close
- Sensor Offline

---

## Device Status

Displays

- ESP32 Online
- ThingSpeak Connected
- Last Upload Time
- Signal Status

---

# 10. Dashboard UI

## Sidebar

- Dashboard
- Analytics
- History
- Alerts
- Settings

---

## Top Navigation

Displays

- Current Date
- Current Time
- Connection Status

---

## Live Sensor Cards

Each card contains

- Current Reading
- Unit
- Status Indicator
- Trend Arrow

Cards

- Temperature
- Humidity
- Pressure
- Altitude
- Distance

---

## Charts

Interactive Line Charts

- Temperature vs Time
- Humidity vs Time
- Pressure vs Time
- Altitude vs Time
- Distance vs Time

---

## Gauges

Circular gauges for

- Temperature
- Humidity
- Distance

---

## Alert Panel

Displays active warnings.

---

# 11. Backend APIs

## GET /api/sensors

Returns latest sensor readings.

---

## GET /api/history

Returns historical data.

Supported ranges

```
1h
6h
24h
7d
30d
```

---

## GET /api/analytics

Returns

- averages
- minimums
- maximums
- trends

---

## GET /api/alerts

Returns active alerts.

---

## GET /api/environment-score

Returns

```json
{
  "score": 91,
  "status": "Excellent"
}
```

---

# 12. Data Processing

The backend performs

- Data validation
- Unit normalization
- Timestamp formatting
- Missing value handling
- Alert generation

---

# 13. Alert Rules

## Temperature

> 35°C

Severity

High

---

## Humidity

> 80%

Severity

Medium

---

## Pressure

Pressure changes by more than 10 hPa within one hour.

Severity

Medium

---

## Distance

Distance < 20 cm

Severity

Critical

---

## Sensor Offline

No new ThingSpeak update for more than 60 seconds.

Severity

Critical

---

# 14. Environmental Comfort Score

The score is calculated using

- Temperature
- Humidity
- Atmospheric Pressure

Output

```
0–40      Poor

41–60     Moderate

61–80     Good

81–100    Excellent
```

---

# 15. Database Schema

## Users

- id
- name
- email

---

## Devices

- id
- device_name
- channel_id

---

## Alert History

- id
- alert_type
- severity
- timestamp

---

## Settings

- refresh_interval
- threshold_temperature
- threshold_humidity
- threshold_distance

---

# 16. Non-Functional Requirements

- Responsive Design
- Mobile Friendly
- Automatic Refresh
- Fast API Response (<500 ms)
- Secure Environment Variables
- Error Handling
- Scalable Architecture

---

# 17. Future Enhancements

- Multiple ESP32 Devices
- MQTT Integration
- Weather API Integration
- Push Notifications
- Email Alerts
- PDF Report Generation
- CSV Export
- AI-generated Environmental Insights
- Predictive Temperature Forecasting
- Occupancy Detection using Distance Sensor
- OTA Firmware Updates

---

# 18. Success Metrics

- Sensor Upload Success Rate >99%
- Dashboard Response <500 ms
- Automatic Refresh Every 15 Seconds
- Accurate Historical Visualization
- Reliable Alert Detection
- Mobile Responsive Interface

---

# 19. Deliverables

- ESP32 Firmware
- ThingSpeak Integration
- Next.js Full-Stack Dashboard
- Responsive UI
- Historical Analytics
- Alert Management
- Environmental Comfort Score
- Deployment on Vercel
- Technical Documentation
- Source Code Repository

---

# 20. Project Summary

EcoSense is a modern IoT monitoring platform that combines ESP32, DHT11, BMP180, and HC-SR04 ultrasonic sensing with ThingSpeak cloud storage and a Next.js full-stack dashboard. It provides real-time monitoring, historical analytics, environmental comfort assessment, and proximity alerts through a clean and scalable architecture. The modular design allows easy expansion with additional sensors, AI-driven analytics, multi-device support, and predictive monitoring capabilities.