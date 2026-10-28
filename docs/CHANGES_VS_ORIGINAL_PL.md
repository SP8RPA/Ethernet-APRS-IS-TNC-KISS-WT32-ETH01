# Zmiany SP8RPA względem SQ2CPA APRS Ethernet iGate (2024)

Punkt odniesienia: archiwum oryginalnego projektu **APRS_Ethernet_IGate-main** udostępnione do prac nad WT32-ETH01 (2024). Porównanie dotyczy źródeł pierwowzoru, a nie każdej późniejszej wersji repozytorium SQ2CPA.

Repozytorium: [SQ2CPA/APRS_Ethernet_IGate](https://github.com/SQ2CPA/APRS_Ethernet_IGate).  
Modyfikacje: [SP8RPA](https://github.com/SP8RPA), 2026.  
Wersja funkcjonalna: **V4.3 FINAL**.

## Lista zmian

| Obszar | Pierwowzór | Zmiany w V4.3 |
|---|---|---|
| Inicjalizacja konfiguracji | Montowanie SPIFFS w konstruktorze globalnego obiektu; start mógł zawisnąć w cyklu restartów przy pustym flashu | SPIFFS inicjalizowany podczas `setup()`, z wartościami domyślnymi i obsługą błędów |
| Ochrona UART | Niepoprawna / brakująca konfiguracja mogła ustawić prędkość `0`, kończąc się `IntegerDivideByZero` | Walidacja baudrate i portu APRS-IS, bezpieczna domyślna wartość 115200 |
| Ethernet LAN8720 | Wywołanie `ETH.begin()` bez jawnych parametrów, oczekiwanie bez limitu na link | Jawny PHY addr=1, GPIO16 (OSC enable), GPIO23 MDC, GPIO18 MDIO, GPIO0 CLK input; diagnostyka i limit oczekiwania |
| Konflikt GPIO0 | GPIO0 używany jako TX obu SoftwareSerial, pomimo jego roli zegara Ethernet | Wyłączenie TX (RX-only `-1`) w obu portach KISS |
| Port KISS A | Odbiór na GPIO4 przez `SoftwareSerial` | **Sprzętowy UART2** przez `HardwareSerial`, GPIO4 RX, 115200 b/s i bufor 1024 B |
| Port KISS B | GPIO35, `SoftwareSerial` | Pozostawiony na GPIO35, TX wyłączony; bez zmiany na UART sprzętowy |
| Diagnostyka | Brak rozbudowanych komunikatów diagnostycznych | Logowanie startu, Ethernetu i co 10 s liczby bajtów/FEND/zdekodowanych ramek KISS A |
| Historia WWW | Odpowiedź JSON z `StaticJsonDocument<1536>` mogła być za mała dla 20 pakietów | Strumieniowe generowanie odpowiedzi JSON, bezpieczne kodowanie znaków sterujących i nietekstowych |
| Współbieżność | `std::vector` historii odczytywany w obsłudze HTTP równocześnie z aktualizacją przez `loop()` | Mutex FreeRTOS przy aktualizacji i tworzeniu kopii historii |
| Obsługa WWW | Tabela mogła tracić dane przy błędzie pobierania; brak pauzy | Ochrona bieżących wierszy przed błędem JSON, pauza odświeżania, licznik pakietów i czas pracy urządzenia |
| Pochodzenie ramek | Historia przechowywała numer portu `1` także dla drugiego wejścia | Historia oznacza port B jako `2` |
| Stopka | `2024 SQ2CPA` | Zachowano oryginalną informację; dodatkowo **Modified by SP8RPA © 2026** z linkiem do profilu GitHub |

## Kolejne etapy pracy (skrócona historia)

- **V2**: odporne uruchomienie SPIFFS i walidacja konfiguracji; diagnostyka LAN8720; usunięcie użycia GPIO0 jako TX.
- **V3**: zliczanie bajtów i znaczników KISS A oraz ramek dekodowanych — diagnostyka UART.
- **V4–V4.2.1**: historia 20 pakietów, odświeżanie i pauza, poprawna serializacja JSON; poprawki kompilacji ArduinoJson i nazwy stałej `HEX_DIGITS`.
- **V4.3**: przejście KISS A z SoftwareSerial na **HardwareSerial UART2**, przy zachowaniu GPIO4 i 115200 b/s. Finalna wersja funkcjonalna potwierdzona na WT32-ETH01.

## Zgodność i uwagi

Bramka współpracuje z dowolnym urządzeniem lub oprogramowaniem udostępniającym zgodne ramki AX.25 w formacie KISS przez UART. Heltec Stick Lite V3 był jedynie przykładem użytym podczas uruchamiania.


- KISS po UART nie zapewnia samodzielnie kontroli integralności typu FCS; podejrzane pakiety należy weryfikować, a wyświetlanie ich w WWW nie oznacza poprawności radiowej.
- `Uploaded to APRS-IS` w logu nie zastępuje kontroli rzeczywistego odebrania pakietu po stronie APRS-IS.
- **Test długoterminowy pracy bramki: zaliczony.**

Licencja: **MIT**, oryginalne `Copyright (c) 2024 SQ2CPA` pozostaje bez zmian w `LICENSE`.
