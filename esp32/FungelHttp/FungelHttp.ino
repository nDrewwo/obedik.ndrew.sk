#include <WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>
#include <HTTPClient.h>

/* Add network configuration */
const char* WIFI_SSID = "CISCO_312";
const char* WIFI_PASSWORD = "0123456789ABC";

/* Add LCD display configuration */
const int lcdColumns = 16;
const int lcdRows = 2;
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);

/* Add RFID reader variables */
MFRC522 mfrc522(5, 4);
MFRC522::MIFARE_Key key;

void setupWifi();
void setupRfidReader();
String getUid();
String sendHttpRequest(String url, String data);

void setup() {
  Serial.begin(9600);
  lcd.init();
  lcd.backlight();
  setupWifi();
  setupRfidReader();
  lcd.clear();
  lcd.print("Ready to scan!");
}

void loop() {
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  if (!mfrc522.PICC_ReadCardSerial()) {
    lcd.clear();
    lcd.print("Scan failed!");
    delay(1000);
  }

  String uid = getUid();
  lcd.clear();
  lcd.print("Sending data...");

  String data = "rfid=" + uid;
  String serverUrl = "http://192.168.212.137/testik.php"; // Update with your server URL
  String response = sendHttpRequest(serverUrl, data);

  if (response.length() > 0) {
    lcd.clear();
    lcd.print(response);
  } else {
    lcd.clear();
    lcd.print("Request failed!");
  }
  delay(2000);
  lcd.clear();
  lcd.print("Ready to scan!");
}





// VELICE CUSTOM FUNKCIE


void setupWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi");
}

void setupRfidReader() {
  Serial.print("Setting up RFID reader...");
  SPI.begin();
  mfrc522.PCD_Init();
  delay(4);
  mfrc522.PCD_DumpVersionToSerial();
  Serial.println("Done");
}

String getUid() {
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uid += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uid += String(mfrc522.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  Serial.print(uid);
  Serial.print("\n");
  return uid;
}

String sendHttpRequest(String url, String data) {
  HTTPClient http;

  http.begin(url);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  int httpResponseCode = http.POST(data);
  String payload = "";

  if (httpResponseCode > 0) {
    payload = http.getString();
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
  return payload;
}
