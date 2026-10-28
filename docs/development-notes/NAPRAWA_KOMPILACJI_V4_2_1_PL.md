# WT32-ETH01 LoRa APRS iGate — poprawka V4.2.1

Poprawiono wyłącznie kolizję identyfikatora `HEX` z makrem Arduino.

W pliku `src/json_packet_escape.h` zmieniono `HEX[]` na `HEX_DIGITS[]` i oba odwołania.

Pozostałe pliki i parametry KISS, UART 115200, Ethernet, APRS-IS pozostają bez zmian względem V4.2.

Weryfikacja: test funkcji JSON skompilowany w g++ z makrem `-DHEX=16` symulującym konflikt Arduino; wyjściowy JSON sprawdzony parserem. Nie zastępuje to pełnego Build PlatformIO ani testu na urządzeniu.

1. Otwórz folder projektu w VS Code z PlatformIO.
2. Build dla środowiska `wt32-eth01`.
3. Jeśli BUILD SUCCESSFUL, wykonaj Upload.
4. Odśwież panel WWW przez Ctrl+F5 i sprawdź `Received packets`.

Nie trzeba kasować SPIFFS ani zmieniać konfiguracji.
