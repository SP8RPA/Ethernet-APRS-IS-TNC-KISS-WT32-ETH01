# WT32-ETH01 — zmiana RX KISS A z SoftwareSerial na HardwareSerial UART2 (V4.3)

Bazą jest RX WEB FIX V4.2.1. Cel: poprawić odbiór KISS przy 115200 b/s bez zmiany okablowania, firmware Helteca ani APRS-IS.

## Zmiany

- `SoftwareSerial portA(4,-1)` zastąpiono `HardwareSerial portA(2)`.
- `portA.begin()` uruchamia sprzętowy UART2 (8N1), RX=GPIO4, TX=-1 (nieużywany).
- Bufor odbiorczy ustawiono na 1024 bajty.
- Usunięto wywołanie `overflow()` właściwe dla SoftwareSerial.
- Port KISS B na GPIO35 pozostaje w SoftwareSerial — bez zmian.
- Brak zmian w stronie WWW, dekoderze KISS, APRS-IS i SPIFFS.

## Podłączenie

Heltec Wireless Stick Lite V3 TX GPIO17 -> WT32 GPIO4; Heltec GND -> WT32 GND.
Nie podłączaj GPIO0 WT32 do układu KISS (zegar Ethernetu).

## Budowanie

W katalogu projektu wykonaj `platformio run -e wt32-eth01`; dopiero po poprawnej kompilacji `platformio run -e wt32-eth01 -t upload --upload-port COM53` (dostosuj port).

Nie wymazuj SPIFFS i nie zmieniaj baudrate: oba moduły pozostaw 115200 b/s.

## Test

Po restarcie sprawdź log `[UART A] Hardware UART2 RX=GPIO4 baud=115200, initialized=YES` oraz odebrane ramki. Porównaj ok. 20-50 kolejnych ramek na stronie WWW: nagłówki źródła, adres docelowy i WIDE powinny być bez losowych znaków.

Uwaga: firmware nie został tutaj w całości skompilowany PlatformIO i nie był testowany na sprzęcie. Weryfikacja wymagana na WT32.
