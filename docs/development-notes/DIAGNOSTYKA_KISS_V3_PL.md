# APRS Ethernet iGate — diagnostyka KISS V3

To kopia **działającej w sieci wersji V2** uzupełniona wyłącznie o liczniki diagnostyczne wejścia UART KISS A (GPIO4). Logi nie zmieniają konfiguracji APRS-IS ani sposobu dekodowania ramki. Nie została wykonana kompilacja ani test na sprzęcie.

## Wgrywanie

Otwórz ten folder jako projekt PlatformIO, wykonaj Build i Upload. Odłącz GPIO0 od GND i zrestartuj WT32. Serial Monitor na 115200 b/s, USB-UART **3,3 V logic**, połącz TXD0 WT32 → RX adaptera, GND → GND. Nie podłączaj GPIO0 do GND podczas zwykłego startu.

## Log

Po uruchomieniu szukaj:

```
[UART A] RX=GPIO4 baud=115200, initialized=YES
[KISS A/10s] bytes=0 FEND=0 decoded=0 sample HEX:
```

W Heltecu włącz Hardware Serial TNC, tryb KISS, TX pin 17, RX pin 18, prędkość 115200. Połącz **GPIO17 TX Heltec → GPIO4 RX WT32, wspólna GND**. Jeśli testujesz ramki nadawane przez sam Heltec, włącz na czas próby `Accept Own Frames`; najlepiej sprawdź też ramkę faktycznie odebraną drogą radiową z innego nadajnika.

Po teście interpretuj:

- `bytes=0`: WT32 nie dostaje żadnych bajtów na GPIO4 (przewody, TX Heltec, konfiguracja, poziomy napięć).
- `bytes>0`, `FEND=0`: coś przychodzi, ale brak delimitera KISS `C0` (np. zły tryb, zły baud).
- `FEND>=2` oraz `decoded=0`: bajty KISS przychodzą, ale ramka jest odrzucana / ucięta; wklej `sample HEX`.
- `decoded>=1`: odbiór KISS działa, w panelu WWW powinien się pojawić pakiet (odświeżenie ~15 s).
- `WARNING: SoftwareSerial RX buffer overflow`: biblioteka gubi dane, w następnym kroku warto przejść na sprzętowy UART ESP32.

Pakiet musi zawierać maksymalnie 255 bajtów na etapie dekodera, zgodnie z obecną implementacją. Zapisz screenshoty panelu Helteca i log, gdyby problem się utrzymywał.
