// frontend/src/tracking/gazeTracker.js
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

function flattenLandmarks(pts) {
    const out = [];
    for (const p of pts) {
        out.push(p.x, p.y, p.z ?? 0);
    }
    return out;
}

/**
 * Simple gaze approximation:
 * - Take left eye region landmarks and estimate iris center as average of a few points.
 * - Use eye corners to normalize direction.
 */
function estimateGaze(landmarks) {
    const leftOuter = landmarks[33];
    const leftInner = landmarks[133];
    const rightOuter = landmarks[362];
    const rightInner = landmarks[263];

    const leftCenter = {
        x: (leftOuter.x + leftInner.x) / 2,
        y: (leftOuter.y + leftInner.y) / 2,
    };
    const rightCenter = {
        x: (rightOuter.x + rightInner.x) / 2,
        y: (rightOuter.y + rightInner.y) / 2,
    };

    const leftApproxPupil = avgPoints(landmarks, [159, 145, 153, 154]);
    const rightApproxPupil = avgPoints(landmarks, [386, 374, 380, 381]);

    const gazeLeft = normDirection(leftApproxPupil, leftCenter, leftOuter, leftInner);
    const gazeRight = normDirection(rightApproxPupil, rightCenter, rightOuter, rightInner);

    return {
        gazeX: (gazeLeft.gazeX + gazeRight.gazeX) / 2,
        gazeY: (gazeLeft.gazeY + gazeRight.gazeY) / 2,
    };
}

function avgPoints(landmarks, idx) {
    let x = 0, y = 0;
    for (const i of idx) { x += landmarks[i].x; y += landmarks[i].y; }
    return { x: x / idx.length, y: y / idx.length };
}

function normDirection(pupil, center, outer, inner) {
    const eyeWidth = Math.max(1e-6, Math.abs(outer.x - inner.x));
    const eyeHeight = Math.max(1e-6, eyeWidth * 0.35);
    const dx = (pupil.x - center.x) / eyeWidth;
    const dy = (pupil.y - center.y) / eyeHeight;
    return { gazeX: Math.max(-1, Math.min(1, dx * 2)), gazeY: Math.max(-1, Math.min(1, dy * 2)) };
}

export class GazeTracker {
    constructor(videoEl) {
        this.video = videoEl;
        this.model = null;
        this.running = false;
    }

    async init() {
        await tf.setBackend("webgl");
        await tf.ready();

        this.model = await faceLandmarksDetection.createDetector(
            faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
            {
                runtime: "tfjs",
                refineLandmarks: true,
                maxFaces: 1,
            }
        );
    }

    async start(sampleHz, onSample) {
        if (!this.model) throw new Error("Model not initialized");
        this.running = true;

        const intervalMs = Math.max(50, Math.floor(1000 / sampleHz));
        while (this.running) {
            const ts = Date.now();
            try {
                const faces = await this.model.estimateFaces(this.video, { flipHorizontal: true });

                if (!faces || faces.length === 0) {
                    onSample({ ts, facePresent: false });
                } else {
                    const keypoints = faces[0].keypoints;
                    const { gazeX, gazeY } = estimateGaze(keypoints);
                    onSample({
                        ts,
                        facePresent: true,
                        gazeX,
                        gazeY,
                        landmarks: flattenLandmarks(keypoints),
                    });
                }
            } catch {
                onSample({ ts, facePresent: false });
            }

            await new Promise(r => setTimeout(r, intervalMs));
        }
    }

    stop() {
        this.running = false;
    }
}
