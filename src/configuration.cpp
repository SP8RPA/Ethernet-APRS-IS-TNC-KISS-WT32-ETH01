#include <ArduinoJson.h>
#include <SPIFFS.h>
#include "configuration.h"

void Configuration::writeFile() {
    Serial.println("Saving config..");

    StaticJsonDocument<2048> data;
    File configFile = SPIFFS.open("/config.json", "w");

    data["callsign"] = callsign;

    data["aprs_is"]["active"] = aprsis.active;
    data["aprs_is"]["passcode"] = aprsis.passcode;
    data["aprs_is"]["server"] = aprsis.server;
    data["aprs_is"]["port"] = aprsis.port;

    data["tnc"]["enableServer"] = tnc.enableServer;

    data["ports"]["A"]["baudrate"] = portA.baudrate;
    data["ports"]["A"]["callsign"] = portA.callsign;

    data["ports"]["B"]["baudrate"] = portB.baudrate;
    data["ports"]["B"]["callsign"] = portB.callsign;

    if (!configFile) {
        Serial.println("[CONFIG] Could not open config.json for writing.");
        return;
    }

    serializeJson(data, configFile);

    configFile.close();

    Serial.println("Config saved");
}

bool Configuration::readFile() {
    Serial.println("[CONFIG] Reading /config.json...");
    File configFile = SPIFFS.open("/config.json", "r");
    if (!configFile) {
        Serial.println("[CONFIG] File missing or unreadable.");
        return false;
    }

    StaticJsonDocument<2048> data;
    DeserializationError error = deserializeJson(data, configFile);
    configFile.close();
    if (error || !data.is<JsonObject>()) {
        Serial.printf("[CONFIG] Invalid JSON: %s\n", error ? error.c_str() : "not an object");
        return false;
    }

    // Begin from valid defaults: absent or malformed values can never leave baudrate = 0.
    init();
    callsign = String(data["callsign"] | "N0CALL");
    aprsis.active = data["aprs_is"]["active"] | false;
    aprsis.passcode = String(data["aprs_is"]["passcode"] | "XYZVW");
    aprsis.server = String(data["aprs_is"]["server"] | "rotate.aprs2.net");
    aprsis.port = data["aprs_is"]["port"] | 14580;
    tnc.enableServer = data["tnc"]["enableServer"] | false;
    portA.baudrate = data["ports"]["A"]["baudrate"] | 115200;
    portA.callsign = String(data["ports"]["A"]["callsign"] | "N0CALL");
    portB.baudrate = data["ports"]["B"]["baudrate"] | 115200;
    portB.callsign = String(data["ports"]["B"]["callsign"] | "N0CALL");

    // EspSoftwareSerial divides by the configured baud rate internally.
    // A zero in config.json otherwise causes Guru Meditation: IntegerDivideByZero.
    if (portA.baudrate < 1200 || portA.baudrate > 230400) portA.baudrate = 115200;
    if (portB.baudrate < 1200 || portB.baudrate > 230400) portB.baudrate = 115200;
    if (aprsis.port <= 0 || aprsis.port > 65535) aprsis.port = 14580;

    Serial.printf("[CONFIG] Loaded. KISS A=%d, B=%d baud\n", portA.baudrate, portB.baudrate);
    return true;
}

void Configuration::init() {
    callsign = "N0CALL";
    aprsis.active = false;
    aprsis.passcode = "XYZVW";
    aprsis.server = "rotate.aprs2.net";
    aprsis.port = 14580;
    tnc.enableServer = false;
    portA.baudrate = 115200;
    portA.callsign = "N0CALL";
    portB.baudrate = 115200;
    portB.callsign = "N0CALL";
}

// Constructed before setup(): do not access flash or Serial from a global constructor.
Configuration::Configuration() {
    init();
}

bool Configuration::begin() {
    // The first flash after an upload can contain no SPIFFS image.
    // Format only if mount fails; this erases the stored configuration.
    if (!SPIFFS.begin(true)) {
        Serial.println("[CONFIG] SPIFFS mount/format FAILED; using safe RAM defaults.");
        init();
        return false;
    }
    Serial.println("[CONFIG] SPIFFS mounted.");
    if (!SPIFFS.exists("/config.json") || !readFile()) {
        Serial.println("[CONFIG] Missing/invalid config: writing safe defaults.");
        init();
        writeFile();
    }
    return true;
}
