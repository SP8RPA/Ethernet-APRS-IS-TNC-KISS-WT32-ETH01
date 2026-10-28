# APRS Ethernet iGate — WT32-ETH01 (SP8RPA Edition)

![Firmware](https://img.shields.io/badge/firmware-V4.3%20FINAL-blue) ![Platform](https://img.shields.io/badge/board-WT32--ETH01-informational) ![License](https://img.shields.io/badge/license-MIT-green)

Zmodyfikowana wersja projektu **[SQ2CPA APRS Ethernet iGate](https://github.com/SQ2CPA/APRS_Ethernet_IGate)**, przygotowana dla modułu **WT32-ETH01** współpracującego z zewnętrznym TNC (np. Heltec Wireless Stick Lite V3 z firmware SQ2CPA) przez **UART KISS**. Ramki są przesyłane do **APRS-IS** przez przewodowy Ethernet RJ45.

**Oryginalny projekt i autor:** [SQ2CPA](https://github.com/SQ2CPA) (2024).  
**Modyfikacje / wydanie:** [SP8RPA](https://github.com/SP8RPA) (2026).  
**Wersja bazowa:** V4.3 FINAL; dodanie stopki SP8RPA nie zmienia logiki radiowej ani sieciowej.

> To niezależna modyfikacja. Nie jest oficjalnym wydaniem SQ2CPA.

## Co działa

- Odbiór ramek **KISS przez sprzętowy UART2 (GPIO4, 115200 b/s)** — port A.
- Drugi port wejściowy TNC (GPIO35) pozostawiony w pierwotnym modelu obsługi programowej — port B.
- Przekazywanie odebranych ramek do **APRS-IS przez LAN8720 / Ethernet RJ45**.
- Panel konfiguracyjny WWW i historia ostatnich **20 ramek** z odświeżaniem co 15 s (możliwość pauzy).
- Diagnostyka KISS na porcie szeregowym; obsługa błędnych bajtów w *widoku WWW* jako `\xNN`.
- Ochrona przed błędną konfiguracją UART po starcie i diagnostyka inicjalizacji Ethernetu.

W testach instalacji SP8RPA potwierdzono odbiór KISS, pojawianie się ramek na aprs.fi oraz brak widocznych przekłamań w próbce 10 ramek po przejściu z SoftwareSerial na sprzętowy UART2. Nie jest to formalny test długoterminowy.

## Schemat działania

```text
LoRa APRS RF (433/434 MHz)
          |
Heltec Wireless Stick Lite V3 (SQ2CPA LoRa APRS)
          |  GPIO17 TX (3,3 V) + wspólne GND
          v
WT32-ETH01 GPIO4 RX — KISS, 115200 b/s, 8N1
          |  LAN8720 / RJ45
          v
      Router → APRS-IS → aprs.fi
```

## Podłączenie

| Heltec Wireless Stick Lite V3 | WT32-ETH01 | Uwagi |
|---|---|---|
| GPIO17 (Hardware Serial TX) | GPIO4 (KISS A RX) | UART TTL 3,3 V; **TX → RX** |
| GND | GND | Wspólna masa |

Połączenie jest **jednokierunkowe**. Nie podłączaj 12 V ani RS-232 do GPIO. **GPIO0 WT32 musi pozostać wolne** — służy do zegara PHY Ethernet; do programowania można czasowo połączyć GPIO0 z GND, lecz po wgraniu należy odłączyć. WT32 i Heltec należy zasilić zgodnie z wymaganiami producentów.

Na Heltecu: **Hardware Serial TNC = ON**, **mode = KISS**, **TX pin = 17**, **RX pin = 18**, **baud = 115200**, **Accept Own Frames** zależnie od potrzeb. W wersji bazowej sprawdzono konfigurację z włączoną opcją Accept Own Frames.

## Instalacja i kompilacja

Wymagane: VS Code + PlatformIO, ESP32 WT32-ETH01, adapter USB-UART **3,3 V** do programowania, Ethernet RJ45. W `platformio.ini` zdefiniowano środowisko `wt32-eth01`.

```bash
pio run -e wt32-eth01
pio run -e wt32-eth01 -t upload --upload-port COM53
```

Zamiast `COM53` wybierz rzeczywisty port swojego adaptera. Do flashowania ESP32 ustaw GPIO0=GND podczas resetu/programowania; **przed normalnym startem odłącz GPIO0 od GND**. Monitor logów: `pio device monitor -b 115200`.

`tools/compress.py` automatycznie kompresuje pliki WWW przy kompilacji (`data_embed/*.gz`); nie trzeba tworzyć ich ręcznie. Po pierwszym uruchomieniu należy ustawić w panelu WWW **własny znak, APRS-IS passcode i serwer**. Repo zawiera wyłącznie przykładowy `data/config.json` z `N0CALL` i placeholderem passcode, nie prawdziwe dane instalacji.

Nie kasuj SPIFFS bez potrzeby. Jeśli system plików nie daje się zamontować, oprogramowanie podejmuje próbę formatowania (może usunąć zapisane ustawienia); zrób kopię konfiguracji.

## Weryfikacja działania

1. Sprawdź link Ethernet, adres DHCP i panel WWW.
2. W monitorze szeregowym sprawdź `[UART A] Hardware UART2 ... initialized=YES`.
3. Po odbiorze ramki szukaj `[KISS A/10s] ... decoded=1` i `<--- Got packet PORT A`.
4. Otwórz stronę **Received packets**; sprawdź historię ramek, w tym nagłówki APRS.
5. Sprawdź, czy własny iGate pojawia się w ścieżce pakietu APRS-IS / aprs.fi. Sam napis `Uploaded to APRS-IS` w logu nie jest potwierdzeniem przyjęcia przez serwer.

## Zmiany względem pierwowzoru

Dokładne zestawienie kodu i objawów usuwanych błędów: **[docs/CHANGES_VS_ORIGINAL_PL.md](docs/CHANGES_VS_ORIGINAL_PL.md)**. Obejmuje m.in. naprawę startu SPIFFS, unikanie konfliktu GPIO0, HardwareSerial UART2, historię WWW z poprawnym JSON i diagnostykę KISS.

Wersja **V4.3 pozostaje bazą funkcjonalną** — aktualny wariant dodaje tylko oznaczenie „Modified by SP8RPA © 2026” w stopce panelu, z linkiem do GitHub.

## Pliki

- `src/` — firmware ESP32.
- `data_embed/` — pliki panelu WWW, w tym stopka autorów w `index.html`.
- `data/config.json` — przykładowa konfiguracja (placeholder).
- `tests_host/` — prosty test kodowania JSON do uruchomienia lokalnie.
- `docs/CHANGES_VS_ORIGINAL_PL.md` — lista zmian względem oryginału.
- `docs/development-notes/` — zachowane notatki z kolejnych poprawek V2–V4.3.

## Autorstwo i licencja

Pierwowzór: **© 2024 SQ2CPA**, [repozytorium oryginalne](https://github.com/SQ2CPA/APRS_Ethernet_IGate).  
Modyfikacje / wydanie: **SP8RPA, 2026**, [profil GitHub](https://github.com/SP8RPA).

Projekt zachowuje oryginalną licencję **MIT** z jej pełną treścią w pliku [LICENSE](LICENSE). Treść oryginalnych informacji o prawach autorskich pozostaje w projekcie. Biblioteki (np. Bootstrap) mogą mieć własne licencje.
