// backend/src/index.js
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load .env file explicitly - override any existing env vars
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath, override: true });

const express = require("express");
const cors = require("cors");
const http = require("http");
const { connectDb } = require("./db");
const { sessionsRouter } = require("./routes/sessions");
const { initWebSocket } = require("./ws");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/api/sessions", sessionsRouter);

async function main() {
    await connectDb();

    const port = Number(process.env.PORT || 4000);
    const server = http.createServer(app);

    // attach websocket to same port
    initWebSocket(server);

    server.listen(port, () => {
        console.log(`✅ API + WS running on http://localhost:${port}`);
    });
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
