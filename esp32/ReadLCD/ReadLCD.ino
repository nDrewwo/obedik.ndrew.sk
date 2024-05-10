#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>

#define RST_PIN  4  // Configurable, see typical pin layout above
#define SS_PIN  5 // Configurable, see typical pin layout above

MFRC522 mfrc522(SS_PIN, RST_PIN);

LiquidCrystal_I2C lcd(0x27, 20, 4); // set the LCD address to 0x27 for a 16 chars and 2 line display

void setup() {
  SPI.begin();  // Init SPI bus
  mfrc522.PCD_Init();  // Init MFRC522 card reader
  lcd.init();    // initialize the lcd
  lcd.backlight();  // turn on backlight
}

void loop() {
  // Check for a new card
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Select one of the cards
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Clear the LCD display
  lcd.clear();

  // Display "Card UID:" on the first line
  lcd.setCursor(0, 0);
  lcd.print("Card UID:");

  // Display UID byte by byte on the second line
  lcd.setCursor(0, 1);
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    lcd.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    lcd.print(mfrc522.uid.uidByte[i], HEX);  
  }

  // Halt communication with the card
  mfrc522.PICC_HaltA();
}
