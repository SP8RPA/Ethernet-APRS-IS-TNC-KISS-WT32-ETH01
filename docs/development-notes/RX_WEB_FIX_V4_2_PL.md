# WT32 APRS Ethernet iGate — RX Web Fix V4.2

Naprawa strony **Received packets** bazująca na V4.1. Zawiera całość projektu PlatformIO.

## Zmiany
- Ramki KISS mogą zawierać dowolne bajty (w tym 0x00, 0x1F i niepoprawne UTF-8). Endpoint `/received-packets.json` zamienia bajty spoza zakresu ASCII 0x20–0x7E na czytelne tekstowo `\xNN`, przy jednoczesnym prawidłowym escape cudzysłowów i ukośników.
- Równoległy zapis ramek przez `loop()` i ich odczyt przez serwer WWW jest chroniony muteksem. Serwer tworzy kopię bufora 20 ramek przed serializacją.
- W panelu WWW pozostawiono listę 20 ramek, licznik czasu i przycisk zatrzymywania odświeżania.
- Nie zmieniono UART KISS 115200 b/s, pinów GPIO, Ethernetu, APRS-IS, dekodera AX.25 ani konfiguracji zapisanej w SPIFFS.

## Wgranie
1. Rozpakuj ZIP do NOWEGO katalogu i otwórz go w Visual Studio Code / PlatformIO.
2. `Build` środowiska `wt32-eth01`. Dopiero po udanej kompilacji `Upload`.
3. Odłącz GPIO0 od GND, jeśli był zwarty w trybie flash, zresetuj WT32.
4. Otwórz stronę WWW i wykonaj `Ctrl+F5`. Przejdź do **Received packets**.
5. W razie błędu otwórz `http://IP_WT32/received-packets.json` i sprawdź odpowiedź.

**Nie uruchamiaj Erase Flash i nie wgrywaj SPIFFS** — nie ma takiej potrzeby dla tej aktualizacji.

## Testy
Zastosowany algorytm kodowania JSON można skompilować na komputerze. Testy host-side obejmują cudzysłowy, ukośniki, NUL, CR/LF, bajty 0xFF i przykładowe uszkodzone ramki KISS. Pełnej kompilacji PlatformIO na ESP32 ani testu na urządzeniu nie przeprowadzono.
