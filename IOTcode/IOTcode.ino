#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <DHT.h>
#include <Adafruit_BMP085.h>

//==================================================
// WiFi Credentials
//==================================================

const char* ssid = "EMOBILITY";
const char* password = "TIDF@2025";

//==================================================
// ThingSpeak
//==================================================

String apiKey = "KCRQY0X688FWQI57";

//==================================================
// DHT11
//==================================================

#define DHTPIN 16
#define DHTTYPE DHT11

//==================================================
// Ultrasonic Sensor
//==================================================

#define TRIG_PIN 5
#define ECHO_PIN 18

//==================================================
// Objects
//==================================================

DHT dht(DHTPIN, DHTTYPE);
Adafruit_BMP085 bmp;

//==================================================
// Variables
//==================================================

float temperature = -999;
float humidity = -999;
float pressure = -999;
float altitude = -999;
float distance = -999;

//==================================================
// Sensor Status
//==================================================

bool dhtOK = false;
bool bmpOK = false;
bool ultrasonicOK = false;

//==================================================
// WiFi
//==================================================

void connectWiFi()
{
    Serial.print("Connecting to WiFi");

    WiFi.begin(ssid, password);

    int retry = 0;

    while (WiFi.status() != WL_CONNECTED && retry < 30)
    {
        delay(500);
        Serial.print(".");
        retry++;
    }

    if(WiFi.status() == WL_CONNECTED)
    {
        Serial.println();
        Serial.println("WiFi Connected!");
        Serial.print("IP Address : ");
        Serial.println(WiFi.localIP());
    }
    else
    {
        Serial.println();
        Serial.println("WiFi Connection Failed!");
    }
}

//==================================================
// Ultrasonic
//==================================================

float readDistance()
{
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);

    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH, 30000);

    if(duration == 0)
        return -999;

    return duration * 0.0343 / 2.0;
}

//==================================================
// Read Sensors
//==================================================

void readSensors()
{
    //------------------------------------------------
    // DHT11
    //------------------------------------------------

    temperature = dht.readTemperature();
    humidity = dht.readHumidity();

    if(isnan(temperature) || isnan(humidity))
    {
        dhtOK = false;
        temperature = -999;
        humidity = -999;
    }
    else
    {
        dhtOK = true;
    }

    //------------------------------------------------
    // BMP180
    //------------------------------------------------

    if(bmpOK)
    {
        pressure = bmp.readPressure() / 100.0;
        altitude = bmp.readAltitude();
    }
    else
    {
        pressure = -999;
        altitude = -999;
    }

    //------------------------------------------------
    // Ultrasonic
    //------------------------------------------------

    distance = readDistance();

    if(distance == -999)
    {
        ultrasonicOK = false;
    }
    else
    {
        ultrasonicOK = true;
    }
}

//==================================================
// Print Values
//==================================================

void printReadings()
{
    Serial.println();
    Serial.println("==========================================");

    //---------------- DHT ----------------

    if(dhtOK)
    {
        Serial.print("Temperature : ");
        Serial.print(temperature);
        Serial.println(" °C");

        Serial.print("Humidity    : ");
        Serial.print(humidity);
        Serial.println(" %");
    }
    else
    {
        Serial.println("Temperature : FAILED");
        Serial.println("Humidity    : FAILED");
    }

    //---------------- BMP ----------------

    if(bmpOK)
    {
        Serial.print("Pressure    : ");
        Serial.print(pressure);
        Serial.println(" hPa");

        Serial.print("Altitude    : ");
        Serial.print(altitude);
        Serial.println(" m");
    }
    else
    {
        Serial.println("Pressure    : FAILED");
        Serial.println("Altitude    : FAILED");
    }

    //---------------- Ultrasonic ----------------

    if(ultrasonicOK)
    {
        Serial.print("Distance    : ");
        Serial.print(distance);
        Serial.println(" cm");
    }
    else
    {
        Serial.println("Distance    : FAILED");
    }

    Serial.println("==========================================");
}

//==================================================
// Upload to ThingSpeak
//==================================================

void uploadThingSpeak()
{
    if(WiFi.status() != WL_CONNECTED)
    {
        connectWiFi();

        if(WiFi.status() != WL_CONNECTED)
        {
            Serial.println("Skipping Upload (No WiFi)");
            return;
        }
    }

    HTTPClient http;

    String url =
    "http://api.thingspeak.com/update?api_key=" + apiKey +
    "&field1=" + String(temperature,2) +
    "&field2=" + String(humidity,2) +
    "&field3=" + String(pressure,2) +
    "&field4=" + String(altitude,2) +
    "&field5=" + String(distance,2);

    Serial.println("Uploading to ThingSpeak...");
    Serial.println(url);

    http.begin(url);

    int response = http.GET();

    if(response > 0)
    {
        Serial.print("HTTP Response : ");
        Serial.println(response);

        String entry = http.getString();

        Serial.print("Entry ID      : ");
        Serial.println(entry);
    }
    else
    {
        Serial.print("Upload Failed : ");
        Serial.println(response);
    }

    http.end();
}

//==================================================
// Setup
//==================================================

void setup()
{
    Serial.begin(115200);
    delay(2000);

    Serial.println();
    Serial.println("========== FloodEye ==========");

    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);

    dht.begin();

    Wire.begin(21,22);

    //------------------------------------------------
    // BMP180 Check
    //------------------------------------------------

    bmpOK = bmp.begin();

    if(bmpOK)
    {
        Serial.println("BMP180 Detected");
    }
    else
    {
        Serial.println("BMP180 NOT FOUND");
        Serial.println("Continuing without BMP180...");
    }

    //------------------------------------------------
    // WiFi
    //------------------------------------------------

    connectWiFi();
}

//==================================================
// Loop
//==================================================

void loop()
{
    readSensors();

    printReadings();

    uploadThingSpeak();

    delay(15000);
}