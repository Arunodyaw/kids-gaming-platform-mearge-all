const http = require("http");

function post(path, data) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);
        const req = http.request({
            hostname: "localhost",
            port: 4000,
            path: path,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": body.length,
            },
        }, (res) => {
            let resBody = "";
            res.on("data", (chunk) => resBody += chunk);
            res.on("end", () => {
                try {
                    const json = JSON.parse(resBody);
                    if (res.statusCode >= 400) reject(json);
                    else resolve(json);
                } catch (e) {
                    reject(resBody);
                }
            });
        });
        req.on("error", reject);
        req.write(body);
        req.end();
    });
}

async function test() {
    try {
        console.log("Creating session...");
        const sessionRes = await post("/api/sessions", {
            participantId: `verify-child-${Date.now()}`,
            timezone: "WITA",
            game: { name: "FishBallCollector", version: "1.0.0" },
        });
        const sessionId = sessionRes.sessionId;
        console.log("Session created:", sessionId);

        console.log("Ingesting data...");
        const ingestRes = await post(`/api/sessions/${sessionId}/ingest`, {
            gazeSamples: [
                { ts: Date.now(), facePresent: true, gazeX: 0.5, gazeY: 0.5 }
            ],
            gameEvents: [
                { type: "GAME_START", ts: Date.now(), score: 0 }
            ],
        });
        console.log("Ingest response:", ingestRes);
        process.exit(0);
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
}

test();
