# Proponowane ustawienia repozytorium GitHub

**Nazwa:** `APRS_Ethernet_IGate_WT32_SP8RPA`  
**Opis:** `SQ2CPA APRS Ethernet iGate for WT32-ETH01 — KISS Hardware UART2, APRS-IS, RX history and web UI improvements (SP8RPA V4.3)`  
**Widoczność:** Public (jeżeli chcesz udostępnić źródła)  
**Topics:** `aprs`, `aprs-is`, `lora-aprs`, `wt32-eth01`, `esp32`, `kiss-tnc`, `ethernet`, `ham-radio`, `platformio`  
**Release tag:** `v4.3-sp8rpa`

## Publikowanie

1. Utwórz na GitHub nowe, puste repozytorium o powyższej nazwie (bez automatycznego README/LICENSE).
2. Rozpakuj ZIP projektu i otwórz katalog w VS Code lub terminalu.
3. Z katalogu projektu:

```bash
git init
git add .
git commit -m "V4.3 FINAL: SP8RPA edition of SQ2CPA Ethernet iGate"
git branch -M main
git remote add origin https://github.com/SP8RPA/APRS_Ethernet_IGate_WT32_SP8RPA.git
git push -u origin main
```

Powyższy URL będzie działał **dopiero po utworzeniu repozytorium** na Twoim koncie. Nie publikuj prywatnego pliku konfiguracyjnego z rzeczywistym passcode APRS-IS.

W repo pozostaw plik `LICENSE` z oryginalną licencją MIT; nie usuwaj oznaczenia SQ2CPA.
