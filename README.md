# APRS Ethernet iGate — WT32-ETH01 (SP8RPA Edition)

![Firmware](https://img.shields.io/badge/firmware-V4.3%20FINAL-blue) ![Platform](https://img.shields.io/badge/board-WT32--ETH01-informational) ![License](https://img.shields.io/badge/license-MIT-green)

Zmodyfikowana wersja projektu **[SQ2CPA APRS Ethernet iGate](https://github.com/SQ2CPA/APRS_Ethernet_IGate)** dla modułu **WT32-ETH01**. Bramkę można podłączyć do **dowolnego zgodnego urządzenia lub oprogramowania TNC KISS**, które udostępnia ramki AX.25 przez UART. Odebrane pakiety są przekazywane do **APRS-IS** przez przewodowy Ethernet RJ45. Nie jest wymagany konkretny model radia ani firmware TNC.

**Oryginalny projekt i autor:** [SQ2CPA](https://github.com/SQ2CPA) (2024).  
**Modyfikacje / wydanie:** [SP8RPA](https://github.com/SP8RPA) (2026).  

> To niezależna modyfikacja. Nie jest oficjalnym wydaniem SQ2CPA.

## Co działa

- Odbiór ramek **KISS przez sprzętowy UART2 (GPIO4, 115200 b/s)** — port A.
- Drugi port wejściowy TNC (GPIO35) pozostawiony w pierwotnym modelu obsługi programowej — port B.
- Przekazywanie odebranych ramek do **APRS-IS przez LAN8720 / Ethernet RJ45**.
- Panel konfiguracyjny WWW i historia ostatnich **20 ramek** z odświeżaniem co 15 s (możliwość pauzy).
- Diagnostyka KISS na porcie szeregowym; obsługa błędnych bajtów w *widoku WWW* jako `\xNN`.
- Ochrona przed błędną konfiguracją UART po starcie i diagnostyka inicjalizacji Ethernetu.

**Test długoterminowy: zaliczony.** Potwierdzono działanie odbioru KISS, przekazywania ramek do APRS-IS i ich obecność na aprs.fi.

## Schemat działania

```text
Dowolny TNC KISS (sprzęt lub oprogramowanie)
           |  UART TTL 3,3 V / KISS
           v
WT32-ETH01: RX GPIO4 (port A), 115200 b/s, 8N1
           |  LAN8720 / Ethernet RJ45
           v
      Router → APRS-IS → aprs.fi
```

## Podłączenie

| Sygnał z TNC KISS | WT32-ETH01 | Uwagi |
|---|---|---|
| TX (wyjście danych KISS) | GPIO4 (KISS A RX) | UART TTL 3,3 V, 115200 b/s, 8N1 |
| GND | GND | Wspólna masa |

WT32-ETH01 odbiera ramki KISS na porcie A. Urządzenia z innym poziomem napięć na wyjściu szeregowym wymagają odpowiedniego konwertera.

### Przykład: Heltec Wireless Stick Lite V3

Heltec z firmware SQ2CPA jest **tylko przykładem** źródła ramek KISS. Można użyć innego sprzętu lub oprogramowania udostępniającego zgodny strumień KISS.

| Heltec Wireless Stick Lite V3 | WT32-ETH01 |
|---|---|
| GPIO17 (Hardware Serial TX) | GPIO4 (KISS A RX) |
| GND | GND |

Przykładowe ustawienia Helteca: **Hardware Serial TNC = ON**, **mode = KISS**, **TX pin = 17**, **RX pin = 18**, **baud = 115200**. Ustawienie `Accept Own Frames` zależy od zastosowania.

## Instalacja i kompilacja

Wymagane: VS Code + PlatformIO, WT32-ETH01, konwerter **USB–UART TTL z sygnałami 3,3 V** oraz połączenie Ethernet RJ45. W `platformio.ini` zdefiniowano środowisko `wt32-eth01`.

### Programator USB–UART

Do programowania WT32-ETH01 w instalacji SP8RPA użyto **kablowego konwertera USB–UART PL2303HX**. Można zastosować również inny zgodny konwerter USB–UART TTL.

| Konwerter USB–UART | WT32-ETH01 |
|---|---|
| TXD | RXD (GPIO3, RX0) |
| RXD | TXD (GPIO1, TX0) |
| GND | GND |

**Uwaga:** poziomy logiczne TXD/RXD muszą być zgodne z **3,3 V** ESP32; interfejs TTL nie jest klasycznym RS-232 o wyższych napięciach. Jeżeli konwerter ma wyprowadzony przewód zasilania **5 V**, wolno podłączyć go wyłącznie do wejścia **5V** WT32-ETH01, o ile źródło USB zapewnia wystarczający prąd. Można również zasilać WT32 z osobnego stabilizowanego źródła; w takim przypadku nie łącz przewodu 5 V konwertera. Nie zasilaj równocześnie wejść 5 V i 3V3.

### Kompilacja i wgrywanie

```bash
pio run -e wt32-eth01
pio run -e wt32-eth01 -t upload --upload-port COMx
```

Wybierz rzeczywisty port COM konwertera zamiast `COMx`. Do flashowania ESP32 zrób zworkę między **GPIO0 a GND**, a następnie zresetuj lub włącz zasilanie urządzenia. Po zakończeniu programowania **odłącz zworkę GPIO0–GND przed normalnym uruchomieniem**.

Po pierwszym uruchomieniu ustaw w panelu WWW **własny znak, APRS-IS passcode i serwer**. Repo zawiera wyłącznie przykładowy `data/config.json` z `N0CALL` i placeholderem passcode, nie prawdziwe dane instalacji.

Nie kasuj SPIFFS bez potrzeby. Jeśli system plików nie daje się zamontować, oprogramowanie podejmuje próbę formatowania (może usunąć zapisane ustawienia); zrób kopię konfiguracji.

## Weryfikacja działania

1. Sprawdź link Ethernet, adres DHCP i panel WWW.
2. W monitorze szeregowym sprawdź `[UART A] Hardware UART2 ... initialized=YES`.
3. Po odbiorze ramki szukaj `[KISS A/10s] ... decoded=1` i `<--- Got packet PORT A`.
4. Otwórz stronę **Received packets**; sprawdź historię ramek, w tym nagłówki APRS.
5. Sprawdź, czy własny iGate pojawia się w ścieżce pakietu APRS-IS / aprs.fi. Sam napis `Uploaded to APRS-IS` w logu nie jest potwierdzeniem przyjęcia przez serwer.

## Zmiany względem pierwowzoru

Dokładne zestawienie kodu i objawów usuwanych błędów: **[docs/CHANGES_VS_ORIGINAL_PL.md](docs/CHANGES_VS_ORIGINAL_PL.md)**. Obejmuje m.in. naprawę startu SPIFFS, unikanie konfliktu GPIO0, HardwareSerial UART2, historię WWW z poprawnym JSON i diagnostykę KISS.

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
