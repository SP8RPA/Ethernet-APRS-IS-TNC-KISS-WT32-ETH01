// PL/EN user-interface translations. This changes only the browser UI, not device configuration.
const I18N = {
  "pl": {
    "nav.configuration": "Konfiguracja",
    "nav.backup": "Kopia konfiguracji",
    "nav.download": "Pobierz",
    "nav.restore": "Przywróć",
    "nav.device": "Urządzenie",
    "nav.reboot": "Uruchom ponownie",
    "nav.packets": "Odebrane ramki",
    "nav.save": "Zapisz",
    "nav.toggle": "Rozwiń menu",
    "theme.enableDark": "Ciemny motyw",
    "theme.enableLight": "Jasny motyw",
    "packets.title": "Ostatnie 20 odebranych ramek",
    "packets.time": "Czas*",
    "packets.frame": "Ramka",
    "packets.port": "Port",
    "packets.pause": "Wstrzymaj automatyczne odświeżanie",
    "packets.wait": "Oczekiwanie na dane o ramkach...",
    "packets.refresh": "Lista odświeża się co 15 sekund (o ile nie jest wstrzymana).",
    "packets.uptimeInfo": "* Czas liczony od uruchomienia urządzenia.",
    "aprs.description": "Podaj serwer APRS-IS i dane logowania. Znak wywoławczy służy do autoryzacji w APRS-IS.",
    "aprs.enable": "Włącz połączenie APRS-IS",
    "aprs.callsign": "Znak wywoławczy i SSID",
    "aprs.passcode": "Kod APRS-IS (passcode)",
    "aprs.server": "Serwer",
    "aprs.port": "Port",
    "tnc.description": "Konfiguracja TNC i KISS",
    "tnc.serverStart": "Serwer na porcie ",
    "tnc.serverBoth": " dla obu portów TNC. ",
    "tnc.serverPortA": "Port A na ",
    "tnc.serverPortB": " Port B na ",
    "tnc.enable": "Włącz serwer TNC",
    "tnc.callsignA": "Znak portu A",
    "tnc.baudA": "Prędkość portu A ",
    "tnc.callsignB": "Znak portu B",
    "tnc.baudB": "Prędkość portu B ",
    "footer.modified": "Modyfikacja: ",
    "modal.savingTitle": "Zapisywanie ustawień",
    "modal.savingBody": "Zaczekaj... Ustawienia są zapisywane, a urządzenie uruchomi się ponownie.",
    "modal.savingWait": "Oczekiwanie na połączenie...",
    "modal.savedTitle": "Ustawienia",
    "modal.savedBody": "Ustawienia zapisane!",
    "modal.close": "Zamknij",
    "modal.systemMessage": "Komunikat systemowy",
    "msg.failedConfig": "Nie udało się pobrać konfiguracji",
    "msg.reboot": "Urządzenie wkrótce uruchomi się ponownie.",
    "msg.rxInvalid": "Nieprawidłowa odpowiedź z WT32; zachowano poprzednie wpisy.",
    "msg.rxCount": "Ramki w pamięci WT32: {count}/20",
    "msg.rxUptime": "Czas pracy WT32: {minutes} min",
    "msg.rxRestarted": "WT32 uruchomił się ponownie; historia RAM została wyczyszczona",
    "msg.rxEmpty": "Brak zapisanych ramek",
    "msg.rxPaused": "Automatyczne odświeżanie wstrzymane",
    "msg.rxError": "Błąd połączenia/JSON: {error}; zachowano poprzednie wpisy."
  },
  "en": {
    "nav.configuration": "Configuration",
    "nav.backup": "Backup",
    "nav.download": "Download",
    "nav.restore": "Restore",
    "nav.device": "Device",
    "nav.reboot": "Reboot",
    "nav.packets": "Received packets",
    "nav.save": "Save",
    "nav.toggle": "Toggle navigation",
    "theme.enableDark": "Dark mode",
    "theme.enableLight": "Light mode",
    "packets.title": "Last 20 received packets",
    "packets.time": "Time*",
    "packets.frame": "Frame",
    "packets.port": "Port",
    "packets.pause": "Pause automatic refresh",
    "packets.wait": "Waiting for packet data...",
    "packets.refresh": "The list refreshes every 15 seconds (unless paused).",
    "packets.uptimeInfo": "* Time is measured from device boot.",
    "aprs.description": "Enter APRS-IS server and credentials. The callsign is used for APRS-IS authentication.",
    "aprs.enable": "Enable APRS-IS connection",
    "aprs.callsign": "Callsign and SSID",
    "aprs.passcode": "Passcode",
    "aprs.server": "Server",
    "aprs.port": "Port",
    "tnc.description": "TNC and KISS configuration",
    "tnc.serverStart": "Server on port ",
    "tnc.serverBoth": " for both TNC ports. ",
    "tnc.serverPortA": "Port A on ",
    "tnc.serverPortB": " Port B on ",
    "tnc.enable": "Enable TNC server",
    "tnc.callsignA": "Port A callsign",
    "tnc.baudA": "Port A baudrate ",
    "tnc.callsignB": "Port B callsign",
    "tnc.baudB": "Port B baudrate ",
    "footer.modified": "Modified by ",
    "modal.savingTitle": "Saving settings",
    "modal.savingBody": "Please wait... Settings are being saved and the device will reboot.",
    "modal.savingWait": "Waiting for connection...",
    "modal.savedTitle": "Settings",
    "modal.savedBody": "Settings saved!",
    "modal.close": "Close",
    "modal.systemMessage": "System message",
    "msg.failedConfig": "Failed to load configuration",
    "msg.reboot": "The device will reboot shortly.",
    "msg.rxInvalid": "Invalid response from WT32; previous entries were retained.",
    "msg.rxCount": "Packets in WT32 RAM: {count}/20",
    "msg.rxUptime": "WT32 uptime: {minutes} min",
    "msg.rxRestarted": "WT32 restarted; RAM history was cleared",
    "msg.rxEmpty": "No packets currently stored",
    "msg.rxPaused": "Auto-refresh paused",
    "msg.rxError": "Connection/JSON error: {error}; previous entries were retained."
  }
};
let currentLanguage = 'pl';
let lastRxStatus = null;
let currentTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';

function updateThemeControl() {
    const button = document.getElementById('theme-switch');
    const label = tr(currentTheme === 'dark' ? 'theme.enableLight' : 'theme.enableDark');
    button.querySelector('.theme-icon').textContent = currentTheme === 'dark' ? '☀' : '☾';
    button.querySelector('.theme-label').textContent = label;
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    button.setAttribute('aria-pressed', String(currentTheme === 'dark'));
}

function setTheme(theme) {
    currentTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', currentTheme);
    try { localStorage.setItem('wt32-igate-theme', currentTheme); } catch (_) {}
    updateThemeControl();
}

document.getElementById('theme-switch').addEventListener('click', (event) => {
    event.preventDefault();
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

function tr(key, values = {}) {
    const template = I18N[currentLanguage][key] || I18N.en[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) =>
        Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : `{${name}}`);
}

function setLanguage(lang) {
    currentLanguage = lang === 'en' ? 'en' : 'pl';
    document.documentElement.lang = currentLanguage;
    for (const element of document.querySelectorAll('[data-i18n]')) {
        element.textContent = tr(element.dataset.i18n);
    }
    for (const element of document.querySelectorAll('[data-i18n-aria]')) {
        element.setAttribute('aria-label', tr(element.dataset.i18nAria));
    }
    for (const button of document.querySelectorAll('#language-switch button[data-lang]')) {
        const active = button.dataset.lang === currentLanguage;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
    }
    try { localStorage.setItem('wt32-igate-language', currentLanguage); } catch (_) {}
    updateThemeControl();
    if (lastRxStatus !== null) {
        updateRxStatus(lastRxStatus);
    }
}

for (const button of document.querySelectorAll('#language-switch button[data-lang]')) {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        setLanguage(button.dataset.lang);
    });
}

let initialLanguage = 'pl';
try {
    const saved = localStorage.getItem('wt32-igate-language');
    if (saved === 'pl' || saved === 'en') initialLanguage = saved;
} catch (_) {}
// Called before loading settings; does not alter or submit any form fields.
setLanguage(initialLanguage);

// Custom scripts

let currentSettings = null;

function backupSettings() {
    const data =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(currentSettings));
    const a = document.createElement("a");
    a.setAttribute("href", data);
    a.setAttribute("download", "configuration.json");
    a.click();
}

document.getElementById("backup").onclick = backupSettings;

document.getElementById("restore").onclick = function (e) {
    e.preventDefault();

    document.querySelector("input[type=file]").click();
};

document.querySelector("input[type=file]").onchange = function () {
    const files = document.querySelector("input[type=file]").files;

    if (!files.length) return;

    const file = files.item(0);

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        const data = JSON.parse(reader.result);

        loadSettings(data);
    };
};

function fetchSettings() {
    fetch("/configuration.json")
        .then((response) => response.json())
        .then((settings) => {
            loadSettings(settings);
        })
        .catch((err) => {
            console.error(err);

            alert(tr("msg.failedConfig"));
        });
}

function loadSettings(settings) {
    currentSettings = settings;

    document.getElementById("callsign").value = settings.callsign;

    document.getElementById("aprs_is.active").checked = settings.aprs_is.active;
    document.getElementById("aprs_is.server").value = settings.aprs_is.server;
    document.getElementById("aprs_is.port").value = settings.aprs_is.port;
    document.getElementById("aprs_is.passcode").value = settings.aprs_is.passcode;

    document.getElementById("tnc.enableServer").checked = settings.tnc.enableServer;

    document.getElementById("ports.A.baudrate").value = settings.ports.A.baudrate;
    document.getElementById("ports.A.callsign").value = settings.ports.A.callsign;

    document.getElementById("ports.B.baudrate").value = settings.ports.B.baudrate;
    document.getElementById("ports.B.callsign").value = settings.ports.B.callsign;
}

function showToast(message) {
    const el = document.querySelector('#toast');

    el.querySelector('.toast-body').innerHTML = message;

    (new bootstrap.Toast(el)).show();
}

document.getElementById('reboot').addEventListener('click', function (e) {
    e.preventDefault();

    fetch("/action?type=reboot", { method: "POST" });

    showToast(tr("msg.reboot"));
});

const form = document.querySelector("form");

const saveModal = new bootstrap.Modal(document.getElementById("saveModal"), {
    backdrop: "static",
    keyboard: false,
});

const savedModal = new bootstrap.Modal(
    document.getElementById("savedModal"),
    {}
);

function checkConnection() {
    const controller = new AbortController();

    setTimeout(() => controller.abort(), 2000);

    fetch("/status?_t=" + Date.now(), { signal: controller.signal })
        .then(() => {
            saveModal.hide();

            savedModal.show();

            setTimeout(function () {
                savedModal.hide();
            }, 3000);

            fetchSettings();
        })
        .catch((err) => {
            setTimeout(checkConnection, 0);
        });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    fetch(form.action, {
        method: form.method,
        body: new FormData(form),
    });

    saveModal.show();

    setTimeout(checkConnection, 2000);
});

fetchSettings();

let lastRxUptime = null;
let receivedPollTimer = null;

function scheduleReceivedPoll() {
    if (receivedPollTimer !== null) clearTimeout(receivedPollTimer);
    receivedPollTimer = setTimeout(() => {
        if (document.getElementById('pause-packets').checked) {
            scheduleReceivedPoll();
        } else {
            fetchReceivedPackets();
        }
    }, 15000);
}

function updateRxStatus(state) {
    const parts = [tr('msg.rxCount', {count: state.count})];
    if (Number.isFinite(state.uptime)) {
        parts.push(tr('msg.rxUptime', {minutes: Math.floor(state.uptime / 60000)}));
    }
    if (state.rebooted) parts.push(tr('msg.rxRestarted'));
    if (state.empty) parts.push(tr('msg.rxEmpty'));
    if (document.getElementById('pause-packets').checked) parts.push(tr('msg.rxPaused'));
    document.getElementById('rx-status').textContent = parts.join(' | ');
}

function loadReceivedPackets(packets, uptime) {
    const status = document.getElementById('rx-status');
    if (!Array.isArray(packets)) {
        status.textContent = tr('msg.rxInvalid');
        scheduleReceivedPoll();
        return;
    }

    const rebooted = Number.isFinite(uptime) && lastRxUptime !== null && uptime < lastRxUptime;
    if (Number.isFinite(uptime)) lastRxUptime = uptime;

    const container = document.querySelector('#received-packets tbody');
    container.replaceChildren();
    for (const packet of packets) {
        const tr = document.createElement('tr');
        const elapsedMs = Number(packet.millis) || 0;
        const seconds = Math.floor(elapsedMs / 1000);
        const stamp = `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m ${seconds % 60}s`;
        for (const value of [stamp, String(packet.packet ?? ''), String(packet.port ?? '')]) {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        }
        container.appendChild(tr);
    }

    lastRxStatus = { count: packets.length, uptime, rebooted, empty: packets.length === 0 };
    updateRxStatus(lastRxStatus);
    scheduleReceivedPoll();
}

function fetchReceivedPackets() {
    fetch('/received-packets.json?_t=' + Date.now(), { cache: 'no-store' })
    .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const uptimeRaw = response.headers.get('X-IGate-Uptime-Ms');
        const uptime = uptimeRaw === null ? NaN : Number(uptimeRaw);
        return response.json().then((packets) => ({ packets, uptime }));
    })
    .then(({ packets, uptime }) => loadReceivedPackets(packets, uptime))
    .catch((err) => {
        console.error('Failed to load received packets', err);
        document.getElementById('rx-status').textContent =
            tr('msg.rxError', {error: err.message});
        scheduleReceivedPoll();
    });
}

document.getElementById('pause-packets').addEventListener('change', (e) => {
    if (e.target.checked) {
        if (receivedPollTimer !== null) clearTimeout(receivedPollTimer);
        document.getElementById('rx-status').textContent += ' | ' + tr('msg.rxPaused');
    } else {
        fetchReceivedPackets();
    }
});

document.querySelector('a[href="/received-packets"]').addEventListener('click', function (e) {
    e.preventDefault();

    document.getElementById('received-packets').classList.remove('d-none');
    document.getElementById('configuration').classList.add('d-none');
    
    document.querySelector('button[type=submit]').remove();

    fetchReceivedPackets();
})