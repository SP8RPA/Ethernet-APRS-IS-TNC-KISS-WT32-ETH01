# V4 — Received packets: bez znikania przy odświeżeniu

Bazą jest działająca wersja WT32_DIAG_v3.

Zmiany:
- JSON pakietów jest generowany strumieniowo (bez limitu 1536 B), pozostaje tablicą kompatybilną z poprzednią stroną.
- Odpowiedź nie jest buforowana przez przeglądarkę (`no-store`).
- Błędy HTTP/JSON nie kasują obecnej tabeli.
- Dodany checkbox `Pause automatic refresh` — zatrzymanie odświeżania, żeby przeczytać ramki.
- Pokazuje liczbę ramek zapisanych w RAM i czas pracy WT32 od startu; wykrywa restart między kolejnymi odczytami.
- Bez zmian w KISS / Ethernet / APRS-IS / GPIO i pamięci SPIFFS.

Uwaga: historia pozostaje tylko w RAM — po restarcie WT32 znika, a po 20 ramkach najstarszy wpis jest zastępowany kolejnym.
Nie zapisywano historii do SPIFFS, żeby nie zużywać flash przy każdym pakiecie.

Wgrywanie: w PlatformIO otwórz folder projektu, uruchom Build, potem Upload (ten sam profil wt32-eth01), odłącz GPIO0 od GND, wykonaj reset. Panel na `/received-packets` pokazuje nowy checkbox i status. Otwórz panel od nowa (Ctrl+F5).

Diagnostyka bez zmiany firmware: otwórz `http://IP_WT32/received-packets.json`. Jeżeli lista jest pusta zaraz po odbiorze, sprawdź czy WT32 nie restartuje się — na serialu szukaj kolejnego [BOOT] i komunikatów startowych.

Ograniczenia: bez fizycznej płytki WT32 oraz środowiska PlatformIO nie przeprowadzono testu kompilacji i testu sprzętowego.
