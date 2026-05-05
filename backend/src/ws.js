// backend/src/ws.js
const http = require("http");
const { WebSocketServer, WebSocket } = require("ws");

let wss = null;

function initWebSocket(server) {
    wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        ws.meta = {};

        ws.send(
            JSON.stringify({
                type: "CONNECTED",
                message: "WebSocket connected. Send {type:'SUBSCRIBE', sessionId:'...'}",
            })
        );

        ws.on("message", (raw) => {
            try {
                const msg = JSON.parse(raw.toString());

                if (msg.type === "SUBSCRIBE" && typeof msg.sessionId === "string") {
                    ws.meta.sessionId = msg.sessionId;
                    ws.send(
                        JSON.stringify({
                            type: "SUBSCRIBED",
                            sessionId: msg.sessionId,
                        })
                    );
                }
            } catch (e) {
                ws.send(
                    JSON.stringify({
                        type: "ERROR",
                        message: "Invalid JSON message",
                    })
                );
            }
        });

        ws.on("close", () => {
            // nothing to cleanup beyond socket close
        });
    });

    console.log("✅ WebSocket server initialized");
}

function broadcastToSession(sessionId, payload) {
    if (!wss) return;

    const msg = JSON.stringify({
        type: "SESSION_EVENT",
        sessionId,
        payload,
        ts: Date.now(),
    });

    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN && client.meta?.sessionId === sessionId) {
            client.send(msg);
        }
    }
}

function broadcastAll(payload) {
    if (!wss) return;

    const msg = JSON.stringify({
        type: "BROADCAST",
        payload,
        ts: Date.now(),
    });

    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    }
}

module.exports = { initWebSocket, broadcastToSession, broadcastAll };
