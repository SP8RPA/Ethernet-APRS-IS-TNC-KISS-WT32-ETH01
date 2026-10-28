#pragma once
#include <stddef.h>
#include <stdint.h>

// JSON-safe ASCII rendering of APRS bytes.
// All non-ASCII and control bytes become literal \xNN on the web page.
// This ONLY affects how the web history is displayed; RF/KISS/APRS-IS are untouched.
// Works with Arduino String and std::string so it can be tested natively.
template <typename Output>
inline void appendJsonSafePacket(Output& dst, const char* data, size_t len) {
    static const char HEX_DIGITS[] = "0123456789ABCDEF";
    dst += '"';
    for (size_t i = 0; i < len; ++i) {
        const unsigned char b = static_cast<unsigned char>(data[i]);
        if (b == '"') {
            dst += "\\\"";
        } else if (b == '\\') {
            dst += "\\\\";
        } else if (b >= 0x20 && b <= 0x7E) {
            dst += static_cast<char>(b);
        } else {
            // Two JSON backslashes -> one literal backslash after JSON.parse().
            dst += "\\\\x";
            dst += HEX_DIGITS[b >> 4];
            dst += HEX_DIGITS[b & 15];
        }
    }
    dst += '"';
}
