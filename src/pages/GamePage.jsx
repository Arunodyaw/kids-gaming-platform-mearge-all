import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { eventBus } from "../tracking/eventBus";
import { GazeTracker } from "../tracking/gazeTracker";
import './GamePage.css';


// const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
// ─────────────────────────────────────────────
// Download helper
// ─────────────────────────────────────────────
function downloadReport(report) {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const mar = 15;
    const colW = (pageW - mar * 2) / 2;
    let y = 0;

    // ── Helper: section header ──
    const sectionHeader = (title, r, g, b) => {
        doc.setFillColor(r, g, b);
        doc.roundedRect(mar, y, pageW - mar * 2, 9, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text(title, mar + 4, y + 6);
        y += 13;
    };

    // ── Helper: two-column metric row ──
    const metricRow = (label, value, col) => {
        const x = mar + col * colW;
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(x, y, colW - 3, 12, 2, 2, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(label.toUpperCase(), x + 4, y + 4.5);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(value, x + 4, y + 10.5);
        if (col === 1) y += 15;
    };

    // ── Full-width metric row ──
    const metricRowFull = (label, value) => {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(mar, y, pageW - mar * 2, 12, 2, 2, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(label.toUpperCase(), mar + 4, y + 4.5);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(value, mar + 4, y + 10.5);
        y += 15;
    };

    // ── PAGE HEADER ──
    doc.setFillColor(30, 27, 75);
    doc.rect(0, 0, pageW, 38, "F");
    // accent bar
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 38, pageW, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("Fish Ball Collector", mar, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(165, 180, 252);
    doc.text("Attention Study Report", mar, 24);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Session: ${report.sessionId}`, mar, 32);
    doc.text(`Generated: ${report.generatedAt}`, pageW - mar, 32, { align: "right" });

    y = 48;

    // ── EYE TRACKING ──
    sectionHeader("👁  Eye Tracking Features", 59, 130, 246);
    metricRow("Mean Gaze X", report.meanGazeX.toFixed(4), 0);
    metricRow("Mean Gaze Y", report.meanGazeY.toFixed(4), 1);
    metricRow("Std Dev X", report.stdGazeX.toFixed(4), 0);
    metricRow("Std Dev Y", report.stdGazeY.toFixed(4), 1);
    metricRow("Variance X", report.varGazeX.toFixed(4), 0);
    metricRow("Variance Y", report.varGazeY.toFixed(4), 1);
    metricRow("Gaze Velocity", report.gazeVelocity.toFixed(4), 0);
    metricRow("Face Present", `${(report.facePresentRatio * 100).toFixed(1)}%`, 1);

    y += 4;

    // ── GAME PERFORMANCE ──
    sectionHeader("🎮  Game Performance", 16, 185, 129);
    metricRow("Final Score", String(report.finalScore), 0);
    metricRow("Balls Collected", String(report.ballsCollected), 1);
    metricRow("Red Balls Touched", String(report.redBallsTouched), 0);
    metricRow("Duration", `${(report.durationMs / 1000).toFixed(1)} s`, 1);

    y += 4;

    // ── REACTION TIME ──
    sectionHeader("⚡  Reaction Time", 236, 72, 153);
    const avgRt = report.averageReactionTime !== null
        ? `${report.averageReactionTime.toFixed(1)} ms` : "N/A";
    metricRowFull("Average Reaction Time (from game)", avgRt);
    metricRow("Mean Reaction Time", `${report.meanReactionTime.toFixed(1)} ms`, 0);
    metricRow("Std Dev Reaction", `${report.stdReactionTime.toFixed(1)} ms`, 1);

    // ── ADHD PREDICTION ──
    y += 4;
    sectionHeader("🧠  ADHD Profile", 220, 38, 38);
    metricRowFull("ADHD Status", report.hasADHD ? "High likelihood of ADHD" : "Low likelihood of ADHD");
    if (report.hasADHD) {
        metricRow("ADHD Level", report.adhdLevel || "Unknown", 0);
        y += 15;
    }

    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Recommendations:", mar + 4, y);
    y += 6;

    doc.setTextColor(71, 85, 105);
    report.recommendations.forEach((rec) => {
        doc.text("•", mar + 4, y);
        const textLines = doc.splitTextToSize(rec, pageW - mar * 2 - 9);
        doc.text(textLines, mar + 9, y);
        y += (textLines.length * 5) + 1;
    });
    y += 4;

    // ── FOOTER ──
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFillColor(30, 27, 75);
    doc.rect(0, pageH - 14, pageW, 14, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Fish Ball Collector – Attention Study | Research Data", mar, pageH - 5);
    doc.text(`Page 1 of 1`, pageW - mar, pageH - 5, { align: "right" });

    doc.save(`attention-report-${report.sessionId}.pdf`);
}

// ─────────────────────────────────────────────
// Report Modal
// ─────────────────────────────────────────────
function GameReportModal({ report }) {
    const dur = (report.durationMs / 1000).toFixed(1);
    const facePercent = (report.facePresentRatio * 100).toFixed(1);

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 20px",
            fontFamily: "system-ui, -apple-system, sans-serif",
        }}>
            <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes starPop {
          0%   { transform: scale(0) rotate(-15deg); opacity:0; }
          60%  { transform: scale(1.3) rotate(5deg);  opacity:1; }
          100% { transform: scale(1) rotate(0deg);    opacity:1; }
        }
        .report-card {
          animation: fadeInUp 0.5s ease both;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 20px;
          width: 100%;
          max-width: 760px;
        }
        .metric-pill {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: background 0.2s;
        }
        .metric-pill:hover { background: rgba(255,255,255,0.12); }
        .metric-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #94a3b8;
        }
        .metric-value {
          font-size: 22px;
          font-weight: 800;
          font-family: ui-monospace, monospace;
          letter-spacing: -0.5px;
        }
        .section-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #64748b;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.15), transparent);
        }
        .dl-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 15px 32px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(99,102,241,0.45);
        }
        .dl-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.6); }
        .play-btn {
          background: rgba(255,255,255,0.08);
          color: #e2e8f0;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 14px;
          padding: 15px 32px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .play-btn:hover { background: rgba(255,255,255,0.14); transform: translateY(-2px); }
      `}</style>

            {/* Hero Header */}
            <div className="report-card" style={{ textAlign: "center", animationDelay: "0s" }}>
                <div style={{ fontSize: "56px", lineHeight: 1, marginBottom: "12px", animation: "starPop 0.6s 0.2s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                    🏁
                </div>
                <h1 style={{
                    margin: "0 0 8px",
                    fontSize: "clamp(22px, 4vw, 34px)",
                    fontWeight: 900,
                    letterSpacing: "-1px",
                    background: "linear-gradient(90deg, #a5b4fc, #f0abfc, #a5b4fc)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "shimmer 3s linear infinite",
                }}>
                    Game Complete – Attention Report
                </h1>
                <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
                    Session: <span style={{ color: "#94a3b8", fontFamily: "monospace" }}>{report.sessionId}</span>
                    &nbsp;·&nbsp;{report.generatedAt}
                </p>
            </div>

            {/* Eye Tracking Section */}
            <div className="report-card" style={{ animationDelay: "0.1s" }}>
                <div className="section-title">
                    <span>👁</span> Eye Tracking Features
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
                    <div className="metric-pill">
                        <div className="metric-label">Mean Gaze X</div>
                        <div className="metric-value" style={{ color: "#60a5fa" }}>{report.meanGazeX.toFixed(4)}</div>
                    </div>
                    <div className="metric-pill">
                        <div className="metric-label">Mean Gaze Y</div>
                        <div className="metric-value" style={{ color: "#60a5fa" }}>{report.meanGazeY.toFixed(4)}</div>
                    </div>
                    <div className="metric-pill">
                        <div className="metric-label">Std Dev X</div>
                        <div className="metric-value" style={{ color: "#818cf8" }}>{report.stdGazeX.toFixed(4)}</div>
                    </div>
                    <div className="metric-pill">
                        <div className="metric-label">Std Dev Y</div>
                        <div className="metric-value" style={{ color: "#818cf8" }}>{report.stdGazeY.toFixed(4)}</div>
                    </div>
                    <div className="metric-pill">
                        <div className="metric-label">Variance X</div>
                        <div className="metric-value" style={{ color: "#a78bfa" }}>{report.varGazeX.toFixed(4)}</div>
                    </div>
                    <div className="metric-pill">
                        <div className="metric-label">Variance Y</div>
                        <div className="metric-value" style={{ color: "#a78bfa" }}>{report.varGazeY.toFixed(4)}</div>
                    </div>
                    <div className="metric-pill">
                        <div className="metric-label">Gaze Velocity</div>
                        <div className="metric-value" style={{ color: "#fbbf24" }}>{report.gazeVelocity.toFixed(4)}</div>
                    </div>
                    <div className="metric-pill" style={{
                        background: report.facePresentRatio > 0.5 ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                        borderColor: report.facePresentRatio > 0.5 ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)",
                    }}>
                        <div className="metric-label">Face Present (Session Avg)</div>
                        <div className="metric-value" style={{ color: report.facePresentRatio > 0.5 ? "#34d399" : "#f87171" }}>
                            {facePercent}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Performance Section */}
            <div className="report-card" style={{ animationDelay: "0.2s" }}>
                <div className="section-title">
                    <span>🎮</span> Game Performance
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
                    <div className="metric-pill">
                        <div className="metric-label">Final Score</div>
                        <div className="metric-value" style={{ color: "#f0abfc" }}>{report.finalScore}</div>
                    </div>
                    <div className="metric-pill">
                        <div className="metric-label">Balls Collected</div>
                        <div className="metric-value" style={{ color: "#34d399" }}>{report.ballsCollected}</div>
                    </div>
                    <div className="metric-pill">
                        <div className="metric-label">Red Balls Touched</div>
                        <div className="metric-value" style={{ color: "#f87171" }}>{report.redBallsTouched}</div>
                    </div>
                    <div className="metric-pill">
                        <div className="metric-label">Duration</div>
                        <div className="metric-value" style={{ color: "#94a3b8" }}>
                            {dur}<span style={{ fontSize: "13px", color: "#64748b" }}> s</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reaction Time Section */}
            <div className="report-card" style={{ animationDelay: "0.3s" }}>
                <div className="section-title">
                    <span>⚡</span> Reaction Time
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
                    <div className="metric-pill">
                        <div className="metric-label">Avg Reaction Time</div>
                        <div className="metric-value" style={{ color: "#fb7185" }}>
                            {report.averageReactionTime !== null ? report.averageReactionTime.toFixed(1) : "N/A"}
                            {report.averageReactionTime !== null && <span style={{ fontSize: "13px", color: "#64748b" }}> ms</span>}
                        </div>
                    </div>
                    <div className="metric-pill">
                        <div className="metric-label">Mean Reaction</div>
                        <div className="metric-value" style={{ color: "#f472b6" }}>
                            {report.meanReactionTime.toFixed(1)}<span style={{ fontSize: "13px", color: "#64748b" }}> ms</span>
                        </div>
                    </div>
                    <div className="metric-pill">
                        <div className="metric-label">Std Dev Reaction</div>
                        <div className="metric-value" style={{ color: "#c084fc" }}>
                            {report.stdReactionTime.toFixed(1)}<span style={{ fontSize: "13px", color: "#64748b" }}> ms</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ADHD Prediction Section */}
            <div className="report-card" style={{ animationDelay: "0.4s", background: report.hasADHD ? "rgba(239,68,68,0.05)" : "rgba(16,185,129,0.05)", borderColor: report.hasADHD ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)" }}>
                <div className="section-title">
                    <span>🧠</span> ADHD Prediction Profile
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <h4 style={{ margin: "0 0 8px", color: "#e2e8f0" }}>Likelihood of ADHD</h4>
                        <div style={{ fontSize: "24px", fontWeight: 800, color: report.hasADHD ? "#f87171" : "#34d399" }}>
                            {report.hasADHD ? "Detected" : "Not Detected"}
                        </div>
                        {report.hasADHD && (
                            <div style={{ marginTop: "8px", fontSize: "16px", color: "#fca5a5" }}>
                                Level: <strong>{report.adhdLevel}</strong>
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 style={{ margin: "0 0 8px", color: "#e2e8f0" }}>Recommendations</h4>
                        <ul style={{ margin: 0, paddingLeft: "20px", color: "#cbd5e1", lineHeight: "1.6", fontSize: "15px" }}>
                            {report.recommendations.map((r, i) => (
                                <li key={i} style={{ marginBottom: "4px" }}>{r}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", animation: "fadeInUp 0.5s 0.5s both" }}>
                <button className="dl-btn" onClick={() => downloadReport(report)}>
                    ⬇ Download Report (PDF)
                </button>
                <button className="play-btn" onClick={() => window.location.reload()}>
                    🔄 Play Again
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function GamePage() {
    const videoRef = useRef(null);
    const gameContainerRef = useRef(null);
    const [sessionId, setSessionId] = useState("");
    const [status, setStatus] = useState("init");
    const [webcamPermission, setWebcamPermission] = useState(false);

    const gazeBuffer = useRef([]);
    const gameEventBuffer = useRef([]);

    const flushTimer = useRef(null);
    const trackerRef = useRef(null);
    const gameLoadedRef = useRef(false);

    // NEW: Refs for cumulative face present tracking
    const totalGazeSamplesRef = useRef(0);
    const facePresentCountRef = useRef(0);

    // Live ML Features calculation
    const [liveFeatures, setLiveFeatures] = useState({
        meanGazeX: 0, stdGazeX: 0, varGazeX: 0,
        meanGazeY: 0, stdGazeY: 0, varGazeY: 0,
        facePresentRatio: 0, gazeVelocity: 0,
        ballsCollected: 0, redHits: 0, maxScore: 0,
        meanReactionTime: 0, stdReactionTime: 0,
        timeElapsed: 0
    });
    const liveFeaturesRef = useRef(liveFeatures);
    liveFeaturesRef.current = liveFeatures;

    // ── post-game report state ──
    const [gameOver, setGameOver] = useState(false);
    const [finalReport, setFinalReport] = useState(null);

    const rollingGazeBuffer = useRef([]);
    const rollingEventBuffer = useRef([]);
    const gameStartTimeRef = useRef(null);

    // Create session
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.post(`${API_BASE}/api/sessions`, {
                    participantId: `child-${Date.now()}`,
                    timezone: "WITA",
                    game: { name: "FishBallCollector", version: "1.0.0" },
                });
                setSessionId(res.data.sessionId);
                setStatus("session-created");
            } catch (error) {
                console.error("Failed to create session:", error);
                setStatus("error");
            }
        })();
    }, []);

    // Load game and bridge with React eventBus
    useEffect(() => {
        if (!sessionId || !gameContainerRef.current || gameLoadedRef.current) return;

        window.reactEventBus = eventBus;

        const iframe = document.createElement("iframe");
        iframe.src = "/fish-ball-collector/index.html";
        iframe.style.width = "100%";
        iframe.style.height = "1600px";
        iframe.style.border = "none";
        iframe.style.background = "transparent";
        iframe.style.overflow = "hidden";
        iframe.scrolling = "no";
        iframe.allow = "camera";

        iframe.onload = () => {
            gameLoadedRef.current = true;

            const tryConnect = () => {
                try {
                    const iframeWindow = iframe.contentWindow;
                    if (iframeWindow && iframeWindow.gameTracker) {
                        iframeWindow.gameTracker.init(eventBus, sessionId);
                        iframeWindow.reactEventBus = eventBus;
                        setStatus("game-ready");
                    } else {
                        setTimeout(tryConnect, 500);
                    }
                } catch (e) {
                    console.log("Waiting for game to initialize...");
                    setTimeout(tryConnect, 500);
                }
            };

            setTimeout(tryConnect, 1000);
        };

        gameContainerRef.current.appendChild(iframe);

        return () => {
            if (window.reactEventBus === eventBus) {
                delete window.reactEventBus;
            }
            if (gameContainerRef.current && iframe.parentNode) {
                gameContainerRef.current.removeChild(iframe);
            }
        };
    }, [sessionId]);

    // Hook game events from React eventBus
    useEffect(() => {
        const unsub = eventBus.on("GAME_EVENT", (ev) => {
            gameEventBuffer.current.push({ ...ev, sessionId });

            const now = Date.now();
            const eventTs = ev.ts || now;
            rollingEventBuffer.current.push({ ...ev, ts: eventTs });

            if (ev.type === "GAME_START") {
                gameStartTimeRef.current = eventTs;
                // NEW: Reset cumulative counters when game starts
                totalGazeSamplesRef.current = 0;
                facePresentCountRef.current = 0;
                console.log("Game started - counters reset");
            } else if (ev.type === "GAME_OVER") {
                // ── Freeze final report with TRUE mean face present ratio ──
                const snap = liveFeaturesRef.current;

                // NEW: Calculate the TRUE mean face present ratio for the entire session
                const trueMeanFacePresentRatio = totalGazeSamplesRef.current > 0
                    ? facePresentCountRef.current / totalGazeSamplesRef.current
                    : snap.facePresentRatio; // fallback if no samples (shouldn't happen)

                console.log(`Game Over - Total samples: ${totalGazeSamplesRef.current}, Face present: ${facePresentCountRef.current}, True mean: ${trueMeanFacePresentRatio}`);

                // ADHD Prediction Logic (using TRUE mean ratio)
                let adhdScore = 0;
                const isFaceValid = trueMeanFacePresentRatio > 0;

                // Inattention: looking away from screen - use TRUE mean
                if (trueMeanFacePresentRatio < 0.8) adhdScore += 2;
                // Hyperactivity: fast eye movements
                if (snap.gazeVelocity > 0.050) adhdScore += 2;
                // Inattention/Hyperactivity: high scatter of gaze
                if (snap.varGazeX > 0.020 || snap.varGazeY > 0.020) adhdScore += 1;
                // Inattention/Impulsivity: high reaction time variability
                if (snap.stdReactionTime > 500) adhdScore += 1;

                const hasADHD = isFaceValid && adhdScore >= 2;
                let adhdLevel = null;
                let recommendations = ["Keep practicing attention games.", "Maintain a regular sleep schedule.", "Encourage outdoor physical activities."];

                if (hasADHD) {
                    if (adhdScore >= 4) {
                        adhdLevel = "Severe";
                        recommendations = [
                            "Consult with a pediatric specialist or child psychologist.",
                            "Use highly structured daily routines.",
                            "Break complex tasks into smaller, manageable steps.",
                            "Limit unmonitored screen time and avoid over-stimulation."
                        ];
                    }
                    else if (adhdScore === 3) {
                        adhdLevel = "Moderate";
                        recommendations = [
                            "Consider further professional ADHD evaluation.",
                            "Implement frequent short breaks during cognitive tasks.",
                            "Use visual schedules and timers.",
                            "Minimize background distractions in the learning environment."
                        ];
                    } else {
                        adhdLevel = "Low";
                        recommendations = [
                            "Monitor attention span during focused tasks.",
                            "Praise sustained attention and positive behavior.",
                            "Minimize distractions in the immediate environment.",
                            "Practice mindfulness or focused breathing exercises."
                        ];
                    }
                }

                const report = {
                    sessionId,
                    generatedAt: new Date().toLocaleString(),
                    meanGazeX: snap.meanGazeX,
                    stdGazeX: snap.stdGazeX,
                    varGazeX: snap.varGazeX,
                    meanGazeY: snap.meanGazeY,
                    stdGazeY: snap.stdGazeY,
                    varGazeY: snap.varGazeY,
                    // NEW: Use TRUE mean ratio here
                    facePresentRatio: trueMeanFacePresentRatio,
                    gazeVelocity: snap.gazeVelocity,
                    finalScore: ev.finalScore,
                    redBallsTouched: ev.redBallsTouched,
                    ballsCollected: ev.ballsCollected,
                    durationMs: ev.durationMs,
                    averageReactionTime: ev.averageReactionTime,
                    meanReactionTime: snap.meanReactionTime,
                    stdReactionTime: snap.stdReactionTime,
                    hasADHD,
                    adhdLevel,
                    recommendations,
                };
                setFinalReport(report);
                setGameOver(true);
            }
        });
        return () => unsub();
    }, [sessionId]);

    // Live feature calculation interval
    useEffect(() => {
        const interval = setInterval(() => {
            if (!gameStartTimeRef.current) return;

            const now = Date.now();

            const gazeWindow = rollingGazeBuffer.current.filter((s) => now - s.ts <= 5000);
            rollingGazeBuffer.current = gazeWindow;

            const eventWindow = rollingEventBuffer.current.filter((e) => now - e.ts <= 5000);
            rollingEventBuffer.current = eventWindow;

            let mGazeX = 0, stdGazeX = 0, varGazeX = 0;
            let mGazeY = 0, stdGazeY = 0, varGazeY = 0;
            let facePresentRatio = 0, gazeVelocity = 0;

            if (gazeWindow.length > 0) {
                const validX = gazeWindow.filter((g) => g.gazeX !== undefined).map((g) => g.gazeX);
                const validY = gazeWindow.filter((g) => g.gazeY !== undefined).map((g) => g.gazeY);

                if (validX.length > 0) {
                    mGazeX = validX.reduce((a, b) => a + b, 0) / validX.length;
                    varGazeX = validX.reduce((a, b) => a + Math.pow(b - mGazeX, 2), 0) / validX.length;
                    stdGazeX = Math.sqrt(varGazeX);
                }

                if (validY.length > 0) {
                    mGazeY = validY.reduce((a, b) => a + b, 0) / validY.length;
                    varGazeY = validY.reduce((a, b) => a + Math.pow(b - mGazeY, 2), 0) / validY.length;
                    stdGazeY = Math.sqrt(varGazeY);
                }

                const faceCount = gazeWindow.filter((g) => g.facePresent).length;
                facePresentRatio = faceCount / gazeWindow.length;

                let velocitySum = 0;
                let diffCount = 0;
                for (let i = 1; i < gazeWindow.length; i++) {
                    const prev = gazeWindow[i - 1];
                    const curr = gazeWindow[i];
                    if (prev.gazeX !== undefined && curr.gazeX !== undefined && prev.gazeY !== undefined && curr.gazeY !== undefined) {
                        const dx = curr.gazeX - prev.gazeX;
                        const dy = curr.gazeY - prev.gazeY;
                        velocitySum += Math.sqrt(dx * dx + dy * dy);
                        diffCount++;
                    }
                }
                gazeVelocity = diffCount > 0 ? velocitySum / diffCount : 0;
            }

            const ballCollectedEvents = eventWindow.filter((e) => e.type === "BALL_COLLECTED");
            const ballsCollected = ballCollectedEvents.length;

            const redHitEvents = eventWindow.filter((e) => e.type === "RED_HIT");
            const redHits = redHitEvents.length;

            const scoreEvents = eventWindow.filter((e) => e.type === "SCORE_CHANGED");
            const maxScore = scoreEvents.length > 0 ? Math.max(...scoreEvents.map((e) => e.payload?.score ?? e.score ?? 0)) : 0;

            const reactionEvents = eventWindow.filter((e) => e.type === "REACTION");
            let mReaction = 0, stdReaction = 0;
            if (reactionEvents.length > 0) {
                const validR = reactionEvents.map((e) => e.payload?.reactionMs ?? e.reactionMs).filter((r) => r !== undefined);
                if (validR.length > 0) {
                    mReaction = validR.reduce((a, b) => a + b, 0) / validR.length;
                    const varReaction = validR.reduce((a, b) => a + Math.pow(b - mReaction, 2), 0) / validR.length;
                    stdReaction = Math.sqrt(varReaction);
                }
            }

            const timeElapsed = (now - gameStartTimeRef.current) / 1000;

            setLiveFeatures({
                meanGazeX: mGazeX, stdGazeX, varGazeX,
                meanGazeY: mGazeY, stdGazeY, varGazeY,
                facePresentRatio, gazeVelocity,
                ballsCollected, redHits, maxScore,
                meanReactionTime: mReaction, stdReactionTime: stdReaction,
                timeElapsed
            });

        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Webcam + tracking start
    useEffect(() => {
        if (!sessionId) return;
        if (!videoRef.current) return;

        (async () => {
            try {
                setStatus("requesting-webcam");
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
                    audio: false
                });
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setWebcamPermission(true);

                setStatus("loading-model");
                const tracker = new GazeTracker(videoRef.current);
                await tracker.init();
                trackerRef.current = tracker;

                setStatus("tracking");
                tracker.start(10, (sample) => {
                    gazeBuffer.current.push({ ...sample, sessionId });
                    rollingGazeBuffer.current.push({ ...sample, ts: Date.now() });

                    // NEW: Update cumulative counters for face present tracking
                    totalGazeSamplesRef.current++;
                    if (sample.facePresent) {
                        facePresentCountRef.current++;
                    }
                });

                flushTimer.current = window.setInterval(async () => {
                    await flushBuffers();
                }, 2000);
            } catch (error) {
                console.error("Webcam/tracking error:", error);
                if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
                    setStatus("webcam-denied");
                    alert("Webcam permission is required for eye tracking. Please allow camera access and refresh.");
                } else {
                    setStatus("tracking-error");
                }
            }
        })();

        return () => {
            trackerRef.current?.stop();
            if (flushTimer.current) window.clearInterval(flushTimer.current);
            const v = videoRef.current;
            const s = v?.srcObject;
            s?.getTracks()?.forEach(t => t.stop());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    async function flushBuffers() {
        if (!sessionId) return;
        const gaze = gazeBuffer.current.splice(0, gazeBuffer.current.length);
        const events = gameEventBuffer.current.splice(0, gameEventBuffer.current.length);
        if (gaze.length === 0 && events.length === 0) return;

        try {
            await axios.post(`${API_BASE}/api/sessions/${sessionId}/ingest`, {
                gazeSamples: gaze,
                gameEvents: events,
            });
        } catch (error) {
            console.error("Failed to flush buffers:", error);
            gazeBuffer.current.unshift(...gaze);
            gameEventBuffer.current.unshift(...events);
        }
    }

    return (
        <>
            {/* ── Post-game report modal ── */}
            {gameOver && finalReport && <GameReportModal report={finalReport} />}

            <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
                <div style={{ marginBottom: "20px" }}>
                    <h1>Fish Ball Collector - Attention Study</h1>
                    <p><strong>Status:</strong> {status}</p>
                    <p><strong>Session ID:</strong> {sessionId || "Creating..."}</p>
                    {!webcamPermission && (
                        <div style={{ padding: "10px", background: "#fff3cd", borderRadius: "4px", marginTop: "10px" }}>
                            ⚠️ Please allow webcam access when prompted to enable eye tracking.
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div style={{ flex: "1", minWidth: "800px" }}>
                        <h3>Game</h3>
                        <div ref={gameContainerRef} style={{ background: "#f0f0f0", borderRadius: "8px", overflow: "hidden" }}>
                            {!gameLoadedRef.current && (
                                <div style={{ padding: "40px", textAlign: "center" }}>
                                    Loading game...
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div>
                            <h3>Eye Tracking</h3>
                            <video
                                ref={videoRef}
                                width={320}
                                height={240}
                                playsInline
                                muted
                                autoPlay
                                style={{
                                    borderRadius: "8px",
                                    background: "#000",
                                    transform: "scaleX(-1)"
                                }}
                            />
                            <p style={{ fontSize: "12px", marginTop: "10px", color: "#666" }}>
                                ⚠️ Only facial landmarks and gaze direction are stored (no video saved).
                                <br />
                                <strong>Privacy:</strong> All data is anonymized and used only for research purposes.
                            </p>

                            {status === "tracking" && (
                                <div style={{ marginTop: "10px", padding: "10px", background: "#d4edda", borderRadius: "4px" }}>
                                    Eye tracking active
                                </div>
                            )}
                        </div>

                        {/* Panel 1: Eye Tracking Features */}
                        <div style={{
                            background: "linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)",
                            padding: "20px",
                            borderRadius: "16px",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            border: "1px solid rgba(255,255,255,0.8)"
                        }}>
                            <style>{`
                @keyframes pulse-dot { 
                  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 
                  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); } 
                  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } 
                }
                .feature-card { 
                  background: white; 
                  border-radius: 10px; 
                  padding: 12px; 
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); 
                  border: 1px solid #e2e8f0; 
                  transition: transform 0.2s, box-shadow 0.2s; 
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                }
                .feature-card:hover { 
                  transform: translateY(-2px); 
                  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); 
                }
                .feature-label { 
                  font-size: 11px; 
                  text-transform: uppercase; 
                  letter-spacing: 0.5px; 
                  color: #64748b; 
                  margin-bottom: 4px; 
                  font-weight: 600; 
                  white-space: nowrap; 
                  overflow: hidden; 
                  text-overflow: ellipsis; 
                }
                .feature-value { 
                  font-size: 18px; 
                  font-weight: 700; 
                  color: #0f172a; 
                  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; 
                }
                .feature-group { 
                  margin-bottom: 20px; 
                }
                .feature-group-title { 
                  font-size: 13px; 
                  font-weight: 700; 
                  color: #475569; 
                  margin-bottom: 10px; 
                  text-transform: uppercase; 
                  letter-spacing: 1px;
                  display: flex;
                  align-items: center;
                }
                .feature-group-title::after {
                  content: '';
                  flex: 1;
                  border-bottom: 1px solid #cbd5e1;
                  margin-left: 10px;
                }
              `}</style>

                            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "2px solid #e2e8f0" }}>
                                <div style={{ background: "#10b981", width: "12px", height: "12px", borderRadius: "50%", marginRight: "12px", animation: "pulse-dot 2s infinite" }}></div>
                                <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: 800, letterSpacing: "-0.5px" }}>
                                    Live Eye Tracking Features 
                                </h3>
                            </div>

                            <div className="feature-group" style={{ marginBottom: 0 }}>
                                <div className="feature-group-title">Gaze Statistics</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    <div className="feature-card">
                                        <div className="feature-label">Mean Gaze X</div>
                                        <div className="feature-value" style={{ color: "#3b82f6" }}>{liveFeatures.meanGazeX.toFixed(3)}</div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-label">Mean Gaze Y</div>
                                        <div className="feature-value" style={{ color: "#3b82f6" }}>{liveFeatures.meanGazeY.toFixed(3)}</div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-label">Std Dev X</div>
                                        <div className="feature-value" style={{ color: "#3b82f6" }}>{liveFeatures.stdGazeX.toFixed(3)}</div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-label">Std Dev Y</div>
                                        <div className="feature-value" style={{ color: "#3b82f6" }}>{liveFeatures.stdGazeY.toFixed(3)}</div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-label">Variance X</div>
                                        <div className="feature-value" style={{ color: "#3b82f6" }}>{liveFeatures.varGazeX.toFixed(3)}</div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-label">Variance Y</div>
                                        <div className="feature-value" style={{ color: "#3b82f6" }}>{liveFeatures.varGazeY.toFixed(3)}</div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-label">Gaze Velocity</div>
                                        <div className="feature-value" style={{ color: "#f59e0b" }}>{liveFeatures.gazeVelocity.toFixed(3)}</div>
                                    </div>
                                    <div className="feature-card" style={{ background: liveFeatures.facePresentRatio > 0.5 ? "#f0fdf4" : "#fef2f2", borderColor: liveFeatures.facePresentRatio > 0.5 ? "#bbf7d0" : "#fecaca" }}>
                                        <div className="feature-label">Face Present </div>
                                        <div className="feature-value" style={{ color: liveFeatures.facePresentRatio > 0.5 ? "#16a34a" : "#ef4444" }}>
                                            {(liveFeatures.facePresentRatio * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* NEW: Show cumulative stats */}
                            <div style={{ marginTop: "16px", padding: "10px", background: "#f8fafc", borderRadius: "8px", border: "1px dashed #94a3b8" }}>
                                <div style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", marginBottom: "8px" }}>SESSION CUMULATIVE</div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                                    <span>Total Samples: <strong>{totalGazeSamplesRef.current}</strong></span>
                                    <span>Face Present: <strong>{facePresentCountRef.current}</strong></span>
                                    <span>Session Avg: <strong>
                                        {totalGazeSamplesRef.current > 0
                                            ? ((facePresentCountRef.current / totalGazeSamplesRef.current) * 100).toFixed(0)
                                            : 0}%
                                    </strong></span>
                                </div>
                            </div>
                        </div>

                        {/* Panel 2: Game Features */}
                        <div style={{
                            background: "linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)",
                            padding: "20px",
                            borderRadius: "16px",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            border: "1px solid rgba(255,255,255,0.8)"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "2px solid #e2e8f0" }}>
                                <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: 800, letterSpacing: "-0.5px" }}>
                                    Game Features
                                </h3>
                            </div>

                            <div className="feature-group">
                                <div className="feature-group-title">Game Performance</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    <div className="feature-card">
                                        <div className="feature-label">Balls Collected</div>
                                        <div className="feature-value" style={{ color: "#10b981" }}>{liveFeatures.ballsCollected}</div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-label">Red Hits</div>
                                        <div className="feature-value" style={{ color: "#ef4444" }}>{liveFeatures.redHits}</div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-label">Max Score</div>
                                        <div className="feature-value" style={{ color: "#8b5cf6" }}>{liveFeatures.maxScore}</div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-label">Time Elapsed</div>
                                        <div className="feature-value">{Math.floor(liveFeatures.timeElapsed)}s</div>
                                    </div>
                                </div>
                            </div>

                            <div className="feature-group" style={{ marginBottom: 0 }}>
                                <div className="feature-group-title">Reaction Time</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    <div className="feature-card">
                                        <div className="feature-label">Mean Reaction</div>
                                        <div className="feature-value" style={{ color: "#ec4899" }}>{liveFeatures.meanReactionTime.toFixed(0)} <span style={{ fontSize: "12px", color: "#94a3b8" }}>ms</span></div>
                                    </div>
                                    <div className="feature-card">
                                        <div className="feature-label">Std Deviation</div>
                                        <div className="feature-value" style={{ color: "#ec4899" }}>{liveFeatures.stdReactionTime.toFixed(0)} <span style={{ fontSize: "12px", color: "#94a3b8" }}>ms</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
