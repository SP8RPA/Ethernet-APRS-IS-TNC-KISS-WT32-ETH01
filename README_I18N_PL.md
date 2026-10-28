# Panel WWW PL / EN — wariant testowy

Wariant opracowany na bazie **V4.3 FINAL**. W interfejsie WT32-ETH01 dodano przełącznik **PL / EN**, widoczny w górnym pasku obok przycisku zapisu.

- Język interfejsu można zmienić bez odświeżania strony, zapisywania konfiguracji lub restartu urządzenia.
- Domyślnie wyświetlany jest **polski**. Wybrany język zapisywany jest lokalnie w przeglądarce (`localStorage`), nie w ustawieniach ESP32.
- Tłumaczenia obejmują menu, konfigurację APRS-IS i TNC, listę pakietów, komunikaty o stanie oraz okna zapisywania.
- Wybór języka nie zmienia wartości formularzy (w tym znaku, passcode, ustawień UART i portów).
- Funkcje KISS, UART2, Ethernet, APRS-IS i backend pozostały **niezmienione**.

## Testy

- `node tests_host/test_i18n.js` — test przełączania i stanu formularza (zaliczony).
- Sprawdzono także w przeglądarce Chromium obie wersje językowe, zachowanie formularza i stronę `Received packets` (zaliczone).
- Nie przeprowadzono kompilacji PlatformIO ani testu na fizycznym WT32-ETH01 w tej wersji.

## Instalacja

W VS Code / PlatformIO otwórz pełny projekt i skompiluj środowisko `wt32-eth01`. Po wgraniu uruchom stronę urządzenia i naciśnij `Ctrl+F5`, by ominąć cache poprzednich plików WWW. Przełącznik języka znajduje się obok `Zapisz` / `Save`.

Zalecane: najpierw przetestuj na urządzeniu. Zatwierdzona bazowa wersja V4.3 pozostaje osobno na gałęzi `main`.