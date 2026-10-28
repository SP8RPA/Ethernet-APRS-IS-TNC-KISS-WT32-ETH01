#include <Arduino.h>
#include <SPI.h>
#include <ETH.h>
#include "configuration.h"
#include "aprs_is_utils.h"
#include "web_utils.h"
#include "tnc_utils.h"
#include "utils.h"
#include <SoftwareSerial.h>
#include <freertos/FreeRTOS.h>
#include <freertos/semphr.h>

Configuration Config;
WiFiClient espClient;

std::vector<ReceivedPacket> receivedPackets;
// RX history is accessed by loop() and by ESPAsyncWebServer (separate task).
// The mutex protects vector mutation and snapshots sent to the browser.
SemaphoreHandle_t receivedPacketsMutex = nullptr;

static void addReceivedPacket(const String& packet, int port) {
    ReceivedPacket entry;
    entry.millis = millis();
    entry.packet = packet;
    entry.port = port;
    if (!receivedPacketsMutex ||
        xSemaphoreTake(receivedPacketsMutex, pdMS_TO_TICKS(100)) != pdTRUE) {
        Serial.println("[RX WEB] Could not lock history; only WWW history entry skipped");
        return;
    }
    if (receivedPackets.size() >= 20) receivedPackets.erase(receivedPackets.begin());
    receivedPackets.push_back(entry);
    xSemaphoreGive(receivedPacketsMutex);
}


// Diagnostyka toru KISS (Port A). Liczniki tylko do logu USB-UART.
// Odnotowujemy także uszkodzone/niekompletne ramki: lista WWW pokazuje
// wyłącznie te, które poprawnie przejdą dekoder KISS.
static uint32_t uartABytes = 0;
static uint32_t uartAFend = 0;
static uint32_t uartADecoded = 0;
static uint8_t uartASample[24];
static uint8_t uartASampleLen = 0;
static uint32_t uartALastReport = 0;


// RX-only TNC inputs; TX=-1 avoids GPIO0 (Ethernet 50 MHz clock input)
HardwareSerial portA(2); // ESP32 UART2, RX-only on GPIO4
SoftwareSerial portB(35, -1);

void WiFiEvent(WiFiEvent_t event)
{
    switch (event) {
        case ARDUINO_EVENT_ETH_START:
            Serial.println("ETH Started");
            ETH.setHostname("LoRa-IGate");
        break;
        case ARDUINO_EVENT_ETH_CONNECTED:
            Serial.println("ETH Connected");
        break;
        case ARDUINO_EVENT_ETH_GOT_IP:
            Serial.print("ETH MAC: ");
            Serial.print(ETH.macAddress());
            Serial.print(", IPv4: ");
            Serial.print(ETH.localIP());
            if (ETH.fullDuplex()) {
                Serial.print(", FULL_DUPLEX");
            }
            Serial.print(", ");
            Serial.print(ETH.linkSpeed());
            Serial.println("Mbps");
        break;
        case ARDUINO_EVENT_ETH_DISCONNECTED:
            Serial.println("ETH Disconnected");
        break;
        case ARDUINO_EVENT_ETH_STOP:
            Serial.println("ETH Stopped");
        break;
        default:
        break;
    }
}

void setup() {
    Serial.begin(115200);
    receivedPacketsMutex = xSemaphoreCreateMutex();
    if (!receivedPacketsMutex) Serial.println("[RX WEB] ERROR: mutex allocation failed");
    delay(250);
    Serial.println("\n[BOOT] WT32-ETH01 APRS Ethernet iGate UART2 RX v4.3");
    Config.begin();
    Serial.printf("[BOOT] UART KISS A=%d B=%d baud\n", Config.portA.baudrate, Config.portB.baudrate);

    portA.setRxBufferSize(1024); // hardware UART ring buffer
    portA.begin(Config.portA.baudrate, SERIAL_8N1, 4, -1);
    portB.begin(Config.portB.baudrate);
    Serial.printf("[UART A] Hardware UART2 RX=GPIO4 baud=%d, initialized=%s\n",
                  Config.portA.baudrate, portA ? "YES" : "NO");
    Serial.printf("[UART B] RX=GPIO35 baud=%d, initialized=%s\n",
                  Config.portB.baudrate, portB ? "YES" : "NO");

    WiFi.onEvent(WiFiEvent);

    // WT32-ETH01 LAN8720: PHY addr=1, OSC enable=GPIO16,
    // MDC=GPIO23, MDIO=GPIO18, external 50 MHz clock on GPIO0.
    // The original ETH.begin() relied on board-variant defaults.
#if ESP_ARDUINO_VERSION_MAJOR >= 3
    const bool ethStarted = ETH.begin(ETH_PHY_LAN8720, 1, 23, 18, 16, ETH_CLOCK_GPIO0_IN);
#else
    const bool ethStarted = ETH.begin(1, 16, 23, 18, ETH_PHY_LAN8720, ETH_CLOCK_GPIO0_IN);
#endif
    Serial.printf("[ETH] init: %s\n", ethStarted ? "OK" : "FAILED");

    // Do not hang forever if the cable/PHY cannot establish a link.
    // Periodically report status for a short diagnostic interval.
    for (int attempt = 0; attempt < 20 && !ETH.linkUp(); ++attempt) {
        Serial.println("[ETH] waiting for link...");
        delay(500);
    }
    Serial.printf("[ETH] link: %s, IP: %s\n",
                  ETH.linkUp() ? "UP" : "DOWN",
                  ETH.localIP().toString().c_str());

    WEB_Utils::setup();
    TNC_Utils::setup();
}

void loop() {
   
    if (Config.aprsis.active && !espClient.connected()) {
        APRS_IS_Utils::connect();
    }

    while (portA.available()) {
        const int rawByte = portA.read();
        if (rawByte < 0) break;
        ++uartABytes;
        if ((uint8_t)rawByte == 0xC0) ++uartAFend;
        if (uartASampleLen < sizeof(uartASample)) {
            uartASample[uartASampleLen++] = (uint8_t)rawByte;
        }
        String packet = TNC_Utils::handleInputData((char)rawByte, 1);

        if (packet != "") {
            ++uartADecoded;
            Utils::print("<--- Got packet PORT A : ");
            Utils::println(packet);

            if (Config.aprsis.active && espClient.connected()) {
                APRS_IS_Utils::processLoRaPacket(packet, Config.portA.callsign);
            }

            TNC_Utils::sendToClient(packet);
            TNC_Utils::sendToClientA(packet);

            addReceivedPacket(packet, 1);
        }
    }

    while (portB.available()) {
        String packet = TNC_Utils::handleInputData(portB.read(), 2);

        if (packet != "") {
            Utils::print("<--- Got packet PORT B : ");
            Utils::println(packet);

            if (Config.aprsis.active && espClient.connected()) {
                APRS_IS_Utils::processLoRaPacket(packet, Config.portB.callsign);
            }

            TNC_Utils::sendToClient(packet);
            TNC_Utils::sendToClientB(packet);

            addReceivedPacket(packet, 2);
        }
    }

    TNC_Utils::loop();

    // Daje odpowiedź nawet wtedy, gdy na WWW nic nie widać:
    // bytes=0: brak danych na GPIO4 / konfiguracja TX Heltec.
    // bytes>0, FEND=0: inne kodowanie (np. TNC2), zła prędkość lub zakłócenia.
    // bytes>0, FEND>0, decoded=0: niepełne/odrzucone ramki KISS.
    if ((uint32_t)(millis() - uartALastReport) >= 10000UL) {
        uartALastReport = millis();
        Serial.printf("[KISS A/10s] bytes=%lu FEND=%lu decoded=%lu sample HEX:",
                      (unsigned long)uartABytes,
                      (unsigned long)uartAFend,
                      (unsigned long)uartADecoded);
        for (uint8_t i = 0; i < uartASampleLen; ++i) {
            Serial.printf(" %02X", (unsigned int)uartASample[i]);
        }
        Serial.println();
        uartABytes = 0;
        uartAFend = 0;
        uartADecoded = 0;
        uartASampleLen = 0;
    }
}