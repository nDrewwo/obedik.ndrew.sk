#include <WiFi.h>
#include <HTTPClient.h>
#include <LiquidCrystal_I2C.h> // Include I2C LCD library (replace with yours)

// Replace with your WiFi credentials
const char* ssid = "RedSox";
const char* password = "Andrejko11150";

// Replace with your server IP or domain
const char* serverAddress = "192.168.68.114";
const int serverPort = 80;

// Define I2C LCD connection details (replace with yours)
const int lcd_rows = 2;
const int lcd_cols = 16;

LiquidCrystal_I2C lcd(0x27,20,4); // Adjust pin connections

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

  // Initialize LCD
  lcd.init();
  lcd.backlight();
}

void loop() {
  // Create a HTTP client object
  HTTPClient http;

  // Build the request URL (replace with your script path)
  http.begin(serverAddress, serverPort, "/test/test1.php"); // Replace with script path

  // Send the request (GET in this example)
  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);

    // Clear and display the response on LCD
    lcd.clear();
    lcd.print(response);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }

  // Delay between requests (adjust as needed)
  delay(5000);

  // Free the resources
  http.end();
}
