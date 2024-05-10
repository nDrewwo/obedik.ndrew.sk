#include <WiFi.h>

const char* ssid = "CISCO_312";
const char* password = "0123456789ABC";

void setup() {
  Serial.begin(9600);
  WiFi.mode(WIFI_STA);

  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("Connected to WiFi network");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {

}
