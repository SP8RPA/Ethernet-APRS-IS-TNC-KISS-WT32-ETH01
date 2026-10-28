# V4.3 FINAL — SP8RPA Edition (2026)

Zmodyfikowany projekt SQ2CPA APRS Ethernet iGate dla WT32-ETH01 i **dowolnego zgodnego interfejsu TNC KISS przez UART**. Heltec Wireless Stick Lite V3 jest jednym z możliwych urządzeń współpracujących.

## Najważniejsze względem pierwowzoru

- KISS A: **sprzętowy UART2** na GPIO4, RX-only, 115200 b/s.
- Jawna inicjalizacja Ethernet LAN8720, diagnostyka linku i obsługa błędów startu.
- Konfiguracja SPIFFS odporna na brak pliku i zerową prędkość UART.
- Historia 20 ramek w panelu WWW; JSON bez niepoprawnych znaków, pauza odświeżania.
- Diagnostyka bajtów KISS i dekodowanych ramek.
- Stopka: zachowane © 2024 SQ2CPA; dodane „Modified by SP8RPA © 2026” z linkiem do profilu.

## Potwierdzone

**Test długoterminowy: zaliczony.** Potwierdzono pracę WT32-ETH01 jako bramki TNC KISS → Ethernet → APRS-IS, z ramkami widocznymi na aprs.fi. W instalacji testowej wykorzystano Heltec Wireless Stick Lite V3 jako przykładowy TNC.

## Uwagi

Wydanie firmware: **V4.3 FINAL**.

Pierwowzór: https://github.com/SQ2CPA/APRS_Ethernet_IGate  
Modyfikacje: https://github.com/SP8RPA  
Licencja: MIT — zob. LICENSE.
