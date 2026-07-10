#include <Wire.h>
#include <Adafruit_BMP085.h>

Adafruit_BMP085 bmp;

void setup()
{
  Serial.begin(115200);
  delay(3000);

  Serial.println("Starting BMP180...");

  Wire.begin(21, 22);

  if (!bmp.begin())
  {
    Serial.println("BMP180 NOT FOUND!");
    while (1);
  }

  Serial.println("BMP180 FOUND!");
}

void loop()
{
  Serial.print("Temperature : ");
  Serial.print(bmp.readTemperature());
  Serial.println(" °C");

  Serial.print("Pressure    : ");
  Serial.print(bmp.readPressure() / 100.0);
  Serial.println(" hPa");

  Serial.print("Altitude    : ");
  Serial.print(bmp.readAltitude());
  Serial.println(" m");

  Serial.println("----------------------------");

  delay(2000);
}