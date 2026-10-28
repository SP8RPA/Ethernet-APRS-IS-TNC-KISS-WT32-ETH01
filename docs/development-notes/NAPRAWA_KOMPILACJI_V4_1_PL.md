# WT32 Ethernet iGate – V4.1: poprawka kompilacji

W V4 w `src/web_utils.cpp` była błędna instrukcja:

```cpp
serializeJson(receivedPackets[i].packet, *response);
```

`receivedPackets[i].packet` jest typu `String`, a ArduinoJson 6 oczekuje dokumentu (`JsonDocument`) lub wariantu (`JsonVariant`) jako pierwszego argumentu.

V4.1 tworzy mały dokument JSON dla pojedynczej ramki i przekazuje go do `serializeJson()`. Dzięki temu poprawnie obsługuje cudzysłowy, ukośniki i znaki sterujące. Zachowuje wszystkie zmiany V4 (historia RX 20 wpisów, licznik, pauza odświeżania). Nie zmienia konfiguracji KISS, GPIO, Ethernetu ani obsługi APRS-IS.

## Wgranie

1. Otwórz nowy folder `APRS_Ethernet_IGate_WT32_RX_HISTORY_v4_1` w VS Code / PlatformIO.
2. Wykonaj `Build` (środowisko `wt32-eth01`).
3. Po udanej kompilacji wykonaj `Upload`.
4. Odłącz GPIO0 od GND (jeżeli jest podłączony do programowania), uruchom WT32 ponownie.
5. Odśwież panel WWW przez Ctrl+F5 i przejdź do `Received packets`.

Nie używaj `Upload Filesystem Image` tylko dla tej poprawki: strona WWW jest osadzana w firmware przez kompresję podczas budowania. Konfiguracja urządzenia w SPIFFS nie wymaga kasowania.

## Ograniczenia

Kod został sprawdzony statycznie; nie przeprowadzono pełnego Build w PlatformIO ani testu na fizycznym WT32. Jeśli Build zwróci kolejny błąd, przekaż pierwszą sekcję z `error:` (razem z 10 wierszami powyżej) oraz wynik końcowy.
