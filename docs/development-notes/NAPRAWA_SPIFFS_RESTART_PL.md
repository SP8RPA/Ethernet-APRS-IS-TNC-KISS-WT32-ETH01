# WT32-ETH01 — naprawa błędu SPIFFS / IntegerDivideByZero (v2)

W logu zgłoszono `SPIFFS mount failed, -10025` i `Guru Meditation Error (IntegerDivideByZero)`.

## Przyczyna w kodzie

W poprzedniej wersji globalny obiekt `Config` próbował zamontować SPIFFS jeszcze przed `setup()`.
Gdy SPIFFS nie udało się zamontować, konstruktor kończył pracę bez wywołania `init()`.
Następnie `portA.begin(Config.portA.baudrate)` otrzymywało wartość 0 — przyczyna prawdopodobnego dzielenia przez 0.

## Zmiany w v2

- Konstruktor `Config` zawsze ustawia bezpieczne wartości startowe, a odczyt SPIFFS przeniesiono do `Config.begin()` wywoływanego w `setup()`.
- `SPIFFS.begin(true)` próbuje sformatować partycję **tylko wtedy, gdy nie da się jej zamontować**. Formatowanie usuwa poprzedni plik konfiguracji, więc trzeba ponownie ustawić znak/APRS-IS.
- Brak lub uszkodzony `config.json` powoduje utworzenie pliku z domyślnymi wartościami, bez restartu.
- Brakujące/zerowe prędkości KISS są zastępowane przez 115200 b/s.
- Zachowano wcześniejsze poprawki GPIO0 i ustawień ETH.

## Jak wgrać

1. Zamknij poprzedni folder w VS Code. Rozpakuj tę paczkę do nowego katalogu.
2. VS Code + PlatformIO: `Build` i `Upload` dla środowiska `wt32-eth01`.
3. **Odłącz GPIO0 od GND** po zakończeniu programowania, zresetuj WT32.
4. Monitor portu szeregowego 115200, 8N1; odczytaj log od pierwszej linii `[BOOT]`.
5. Po starcie szukaj komunikatów: `[CONFIG] SPIFFS mounted`, `[BOOT] UART KISS A=115200 B=115200`, `[ETH] init: OK`, `ETH Connected`, `ETH MAC... IPv4...`.
6. Jeżeli ETH nie zestawi linku, podaj pełny log `[BOOT]`, `[CONFIG]`, `[ETH]` oraz informację, czy świeci dioda RJ45.

**UWAGA:** paczka to *kod źródłowy*, nie gotowy BIN. Nie przeprowadzono kompilacji PlatformIO ani testu na fizycznym WT32. Nie podłączaj Helteca, dopóki Ethernet nie działa.

### Opcja bez patcha

Oryginalny projekt zawiera plik `data/config.json`. W PlatformIO można spróbować `Upload Filesystem Image` (zadanie `uploadfs`) dla środowiska `wt32-eth01`, co zwykle usuwa problem pustej partycji SPIFFS. Zawsze wykonuj upload SPIFFS przy zgodnym schemacie partycji. W starszym kodzie należy jednak nadal uważać na błędy konfiguracji i restarty.
