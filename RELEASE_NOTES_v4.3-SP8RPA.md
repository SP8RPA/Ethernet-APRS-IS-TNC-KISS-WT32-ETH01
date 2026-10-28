# V4.3 FINAL — SP8RPA Edition (2026)

Zmodyfikowany projekt SQ2CPA APRS Ethernet iGate dla WT32-ETH01 i zewnętrznego radia/TNC KISS.

## Najważniejsze względem pierwowzoru

- KISS A: **sprzętowy UART2** na GPIO4, RX-only, 115200 b/s.
- Jawna inicjalizacja Ethernet LAN8720, diagnostyka linku i obsługa błędów startu.
- Konfiguracja SPIFFS odporna na brak pliku i zerową prędkość UART.
- Historia 20 ramek w panelu WWW; JSON bez niepoprawnych znaków, pauza odświeżania.
- Diagnostyka bajtów KISS i dekodowanych ramek.
- Stopka: zachowane © 2024 SQ2CPA; dodane „Modified by SP8RPA © 2026” z linkiem do profilu.

## Potwierdzone

Na instalacji użytkownika zestaw Heltec Stick Lite V3 → KISS → WT32-ETH01 → Ethernet przesyłał ramki do APRS-IS widoczne na aprs.fi. W 10 pokazanych pakietach po zmianie na UART2 nie stwierdzono widocznych błędów w nagłówkach i tekście.

## Uwagi

To edycja firmware **V4.3**, nie nowe wydanie z eksperymentalnymi zmianami w torze transmisji. Samo oznaczenie autorstwa nie zmienia funkcji urządzenia. Kompilację i test tej edycji należy wykonać po pobraniu; poprzednia V4.3 była używana na urządzeniu.

Pierwowzór: https://github.com/SQ2CPA/APRS_Ethernet_IGate  
Modyfikacje: https://github.com/SP8RPA  
Licencja: MIT — zob. LICENSE.
