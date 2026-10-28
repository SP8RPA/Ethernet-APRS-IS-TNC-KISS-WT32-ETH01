# Diagnostyka WT32-ETH01: poprawka APRS Ethernet iGate

Bazowy projekt: SQ2CPA APRS_Ethernet_IGate (archiwum dostarczone w rozmowie).
Zmiany ograniczone do `src/APRS_Ethernet_IGate.cpp`:

1. `SoftwareSerial portA(4, 0)` → `SoftwareSerial portA(4, -1)`
2. `SoftwareSerial portB(35, 0)` → `SoftwareSerial portB(35, -1)`
   Powód: GPIO0 w WT32-ETH01 służy jako wejście zegara 50 MHz Ethernetu i nie może być wyjściem TX. Porty A/B są w tym projekcie używane do ODBIORU (RX).
3. Jawne `ETH.begin(...)` dla LAN8720: adres PHY 1, GPIO16 = włączanie oscylatora, MDC 23, MDIO 18, zegar GPIO0_IN. Dla Arduino ESP32 2.x i 3.x obsłużono inną kolejność parametrów.
4. Zastąpienie nieskończonego `while (!ETH.linkUp()) ;` krótką diagnostyką; projekt może uruchamiać panel i dodatkowe usługi nawet bez linku (oczywiście nie będą dostępne po sieci bez fizycznego połączenia).

## Uruchomienie
- Odłącz GPIO0 od GND po wgraniu firmware! Reset/odłącz-podłącz zasilanie.
- W Visual Studio Code / PlatformIO otwórz katalog projektu, środowisko `wt32-eth01`, zbuduj `Build` i wgraj `Upload`.
- Zostaw adapter USB-UART do monitora COM (TXD0/RXD0) i ustaw **115200, 8N1**.
- Podłącz poprawny przewód Ethernet do działającego portu switcha/routera.
- Oczekiwane komunikaty m.in. `[ETH] init: OK`, `ETH Connected`, `ETH MAC ... IPv4 ...`, `[ETH] link: UP ...`.
- Jeśli `[ETH] init: FAILED` lub link DOWN, podaj pełny log startu, zdjęcia obu stron WT32 i zmierzone napięcie zasilania.

UWAGA: Poprawkę przygotowano poprzez analizę kodu i dokumentacji WT32-ETH01; **nie wykonano kompilacji ani testu na fizycznej płytce**.
