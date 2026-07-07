#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <DHT.h>
#include <Adafruit_BMP085.h>

//==================================================
// WiFi Credentials
//==================================================

const char* ssid = "Arrya";
const char* password = "aryyaman2006";

//==================================================
// ThingSpeak
//==================================================

String apiKey = "9790UIITGGXBTRZM";

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

float temperature;
float humidity;
float pressure;
float altitude;
float distance;

//==================================================
// WiFi
//==================================================

void connectWiFi()
{
    Serial.print("Connecting to WiFi");

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println();
    Serial.println("Connected!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
}

//==================================================
// Read Ultrasonic
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
        return -1;

    return duration * 0.0343 / 2.0;
}

//==================================================
// Read Sensors
//==================================================

void readSensors()
{
    temperature = dht.readTemperature();
    humidity = dht.readHumidity();

    pressure = bmp.readPressure() / 100.0;
    altitude = bmp.readAltitude();

    distance = readDistance();
}

//==================================================
// Print Readings
//==================================================

void printReadings()
{
    Serial.println("====================================");

    if(isnan(temperature) || isnan(humidity))
    {
        Serial.println("DHT11 ERROR");
    }
    else
    {
        Serial.print("Temperature : ");
        Serial.print(temperature);
        Serial.println(" °C");

        Serial.print("Humidity    : ");
        Serial.print(humidity);
        Serial.println(" %");
    }

    Serial.print("Pressure    : ");
    Serial.print(pressure);
    Serial.println(" hPa");

    Serial.print("Altitude    : ");
    Serial.print(altitude);
    Serial.println(" m");

    if(distance < 0)
    {
        Serial.println("Distance    : No Echo");
    }
    else
    {
        Serial.print("Distance    : ");
        Serial.print(distance);
        Serial.println(" cm");
    }

    Serial.println("====================================");
}

//==================================================
// Upload to ThingSpeak
//==================================================

void uploadThingSpeak()
{
    if(WiFi.status() != WL_CONNECTED)
    {
        connectWiFi();
    }

    HTTPClient http;

    String url =
    "https://api.thingspeak.com/update?api_key=" + apiKey +
    "&field1=" + String(temperature,2) +
    "&field2=" + String(humidity,2) +
    "&field3=" + String(pressure,2) +
    "&field4=" + String(altitude,2) +
    "&field5=" + String(distance,2);

    Serial.println("Uploading...");
    Serial.println(url);

    http.begin(url);

    int response = http.GET();

    if(response > 0)
    {
        Serial.print("HTTP Code: ");
        Serial.println(response);

        String entry = http.getString();

        Serial.print("Entry ID: ");
        Serial.println(entry);
    }
    else
    {
        Serial.print("Upload Failed: ");
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

    delay(1000);

    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);

    dht.begin();

    Wire.begin(21,22);

    if(!bmp.begin())
    {
        Serial.println("BMP180 NOT FOUND");

        while(true);
    }

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