# Project Requirements

This document outlines the hardware and software requirements necessary to deploy and run the full IoT Environmental Dashboard system.

## Hardware Requirements

To provide real data to the dashboard, you will need the following hardware components:

1. **Microcontroller**
   - 1x ESP32 Development Board (e.g., ESP32-WROOM-32)
   - *Alternative: NodeMCU ESP8266 (requires code adaptation)*

2. **Sensors**
   - **Temperature & Humidity**: DHT22 or DHT11 sensor module
   - **Atmospheric Pressure & Altitude**: BMP280 or BME280 sensor module (I2C)
   - **Distance/Proximity**: HC-SR04 Ultrasonic Distance Sensor

3. **Miscellaneous**
   - Jumper wires (Male-to-Male, Male-to-Female)
   - Breadboard
   - USB Data Cable (for programming and power)
   - Power supply (if deploying away from a PC)

## Software Requirements

### Backend / Microcontroller (ESP32)
- **Arduino IDE** or **PlatformIO** (VS Code)
- **ESP32 Board Package** installed in Arduino IDE
- **Libraries required:**
  - `WiFi.h` (built-in)
  - `HTTPClient.h` (built-in)
  - `DHT sensor library` by Adafruit
  - `Adafruit BMP280 Library` (or BME280)
  - `ThingSpeak` library by MathWorks

### Frontend / Web Application
- **OS**: Windows, macOS, or Linux
- **Runtime**: Node.js v20.x or higher
- **Package Manager**: npm or pnpm
- **Browser**: Modern web browser (Chrome, Edge, Firefox, Safari)

## API & Cloud Integration
- **Local Network**: The ESP32 and the machine running the Next.js server must be on the same local network if fetching directly via IP.
- **ThingSpeak (Optional)**: A free ThingSpeak account to log data to the cloud. You will need:
  - Channel ID
  - Read/Write API Keys

## Data Payload Structure (JSON)
If pushing data from the ESP32 directly to the web app, the expected JSON payload format is:

```json
{
  "temperature": 25.4,
  "humidity": 60,
  "pressure": 1012.5,
  "altitude": 115,
  "distance": 45.2
}
```
