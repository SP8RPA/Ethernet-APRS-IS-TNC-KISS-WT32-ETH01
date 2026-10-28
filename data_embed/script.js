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

            alert(`Failed to load configuration`);
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

    showToast("Your device will be rebooted in a while");
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

function loadReceivedPackets(packets, uptime) {
    const status = document.getElementById('rx-status');
    if (!Array.isArray(packets)) {
        status.textContent = 'Invalid response from WT32; previous entries were retained.';
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

    const uptimeText = Number.isFinite(uptime) ?
        ` | WT32 uptime: ${Math.floor(uptime / 60000)} min` : '';
    status.textContent = `Packets in WT32 RAM: ${packets.length}/20${uptimeText}` +
        (rebooted ? ' | WT32 restarted; RAM history was cleared' : '') +
        (packets.length === 0 ? ' | No packets currently stored' : '');
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
            `Connection/JSON error: ${err.message}; existing entries were retained.`;
        scheduleReceivedPoll();
    });
}

document.getElementById('pause-packets').addEventListener('change', (e) => {
    if (e.target.checked) {
        if (receivedPollTimer !== null) clearTimeout(receivedPollTimer);
        document.getElementById('rx-status').textContent += ' | Auto-refresh paused';
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