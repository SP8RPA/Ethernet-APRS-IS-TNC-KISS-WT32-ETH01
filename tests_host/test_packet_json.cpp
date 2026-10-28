#include <iostream>
#include <string>
#include "../src/json_packet_escape.h"
int main() {
    const std::string samples[] = {
        "SP8RPA-8>APLRFT,WIDE1-1:>Tracker started",
        "This has \"quotes\" and a \\ backslash",
        std::string("A\0B\r\n\tZ", 7),
        std::string("\xFF\xC0\x02\x1F", 4),
    };
    std::cout << "[";
    for (size_t i = 0; i < sizeof(samples) / sizeof(samples[0]); ++i) {
        if (i) std::cout << ",";
        std::string out;
        appendJsonSafePacket(out, samples[i].data(), samples[i].size());
        std::cout << out;
    }
    std::cout << "]\n";
}
