import { FaceMesh, type Results } from '@mediapipe/face_mesh';

// Signal types
export interface ImageSignals {
    // Facial Signals
    smileScore: number;     // 0.0 to 1.0 (Higher = bigger smile)
    eyeOpenness: number;    // 0.0 to 1.0 (Lower = sleepy/squinting)
    headTilt: number;       // degrees deviation from vertical
    faceAngle: number;      // degrees left/right turn
    emotion: 'happy' | 'neutral' | 'annoyed' | 'surprised';

    // Image Quality Signals
    brightness: number;     // 0-255 average
    blurScore: number;      // 0.0 to 1.0 (Higher = clearer)
    dominantColor: string;  // Hex code
    isDark: boolean;        // brightness < 60
    isBlurry: boolean;      // blurScore < 0.3
    faceDetected: boolean;  // found a face?
}

// MediaPipe Helper to load model lazily
let faceMesh: FaceMesh | null = null;

async function getFaceMesh(): Promise<FaceMesh> {
    if (faceMesh) return faceMesh;

    faceMesh = new FaceMesh({
        locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
    });

    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    return faceMesh;
}

// Helper: Calculate Euclidean distance
function distance(p1: { x: number, y: number }, p2: { x: number, y: number }) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Helper: Analyze pixel data for brightness/color
function analyzePixels(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    let totalBrightness = 0;
    let r = 0, g = 0, b = 0;

    for (let i = 0; i < data.length; i += 4) {
        const br = (data[i] + data[i + 1] + data[i + 2]) / 3;
        totalBrightness += br;
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }

    const pxCount = width * height;
    return {
        brightness: totalBrightness / pxCount,
        avgColor: {
            r: Math.round(r / pxCount),
            g: Math.round(g / pxCount),
            b: Math.round(b / pxCount)
        }
    };
}

// Helper: Calculate Laplacian Variance for Blur Detection
function calculateBlurScore(ctx: CanvasRenderingContext2D, width: number, height: number): number {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Convert to grayscale
    const grayData = new Uint8ClampedArray(width * height);
    for (let i = 0; i < data.length; i += 4) {
        grayData[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }

    // Laplacian Kernel
    // 0  1  0
    // 1 -4  1
    // 0  1  0
    let laplacianVar = 0;
    let mean = 0;
    let count = 0;
    const values: number[] = [];

    // Convolve (ignore borders for simplicity)
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x;
            const val =
                grayData[idx - width] + // top
                grayData[idx + width] + // bottom
                grayData[idx - 1] +     // left
                grayData[idx + 1] -     // right
                4 * grayData[idx];      // center

            values.push(val);
            mean += val;
            count++;
        }
    }

    mean /= count;

    // Variance
    for (let i = 0; i < values.length; i++) {
        laplacianVar += Math.pow(values[i] - mean, 2);
    }
    laplacianVar /= count;

    // Normalize: Variance of < 100 is usually blurry, > 500 is sharp
    // Map 0-500 to 0-1
    let score = laplacianVar / 300;
    if (score > 1) score = 1;
    return score;
}

export async function analyzeImage(imageFile: File): Promise<ImageSignals> {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Load Image
            const img = new Image();
            img.src = URL.createObjectURL(imageFile);
            await new Promise(r => img.onload = r);

            // 2. Prepare Canvas
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) throw new Error('Could not create canvas context');
            ctx.drawImage(img, 0, 0);

            // 3. Pixel Analysis (Brightness, Color)
            const { brightness, avgColor } = analyzePixels(ctx, canvas.width, canvas.height);
            // Determine dominant color roughly
            const dominantHex = `#${((1 << 24) + (avgColor.r << 16) + (avgColor.g << 8) + avgColor.b).toString(16).slice(1)}`;

            // 4. Face Analysis with MediaPipe
            const mesh = await getFaceMesh();

            // We need to wrap onResults to catch the data
            const onResults = (results: Results) => {
                let smileScore = 0;
                let eyeOpenness = 0;
                let headTilt = 0;
                let faceAngle = 0;
                let emotion: ImageSignals['emotion'] = 'neutral';

                if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                    const landmarks = results.multiFaceLandmarks[0];

                    // --- Smile Detection ---
                    // Lips: 61 (left corner), 291 (right corner), 0 (top lip), 17 (bottom lip)
                    // Measure width vs height ratios or specific points
                    const leftMouth = landmarks[61];
                    const rightMouth = landmarks[291];

                    const mouthWidth = distance(leftMouth, rightMouth);
                    // Let's use mouth width / face width as a proxy for "big smile"
                    // Face width: 234 (left ear) to 454 (right ear)
                    const leftFace = landmarks[234];
                    const rightFace = landmarks[454];
                    const faceWidth = distance(leftFace, rightFace);

                    // Smile: Mouth width / Face width
                    // Neutral mouth is approx 0.35-0.4 of face width. Wide smile is > 0.5.
                    // (0.4 * 2.5 = 1.0) -> Too high.
                    // Let's try: (Ratio - 0.3) * 3
                    const ratio = mouthWidth / faceWidth;
                    smileScore = (ratio - 0.3) * 4.0;
                    if (smileScore < 0) smileScore = 0;
                    if (smileScore > 1) smileScore = 1;

                    // --- Eye Openness ---
                    // Left Eye: 159 (top), 145 (bottom)
                    // Right Eye: 386 (top), 374 (bottom)
                    // Measure distance vs eye width
                    const leftEyeH = distance(landmarks[159], landmarks[145]);
                    const rightEyeH = distance(landmarks[386], landmarks[374]);
                    // Eye Openness: Avg Eye Height / Face Height
                    // Face Height: 10 (top) to 152 (chin)
                    const topFace = landmarks[10];
                    const bottomFace = landmarks[152];
                    const faceHeight = distance(topFace, bottomFace);

                    const avgEyeHeight = (leftEyeH + rightEyeH) / 2;
                    // Typical ratio is small (~0.05). We want 0.5 to be "normal".
                    // 0.05 * x = 0.5 -> x = 10.
                    // Sleepy/Closed < 0.02. Wide > 0.07.
                    eyeOpenness = (avgEyeHeight / faceHeight) * 8; // Reduced multiplier from 15 to 8
                    if (eyeOpenness > 1) eyeOpenness = 1;

                    // --- Head Tilt ---
                    // Angle between eye centers or ears
                    const dy = rightFace.y - leftFace.y;
                    const dx = rightFace.x - leftFace.x;
                    headTilt = Math.abs(Math.atan2(dy, dx) * (180 / Math.PI));

                    // --- Face Angle (Yaw) ---
                    // Nose tip (1) vs center of ears
                    // If nose is close to one ear, looking that way
                    const nose = landmarks[1];
                    const midFaceX = (leftFace.x + rightFace.x) / 2;
                    faceAngle = Math.abs((nose.x - midFaceX) * 100); // 0 = frontal, higher = turned

                    // --- Emotion Heuristics ---
                    if (smileScore > 0.6) emotion = 'happy';
                    else if (eyeOpenness < 0.2) emotion = 'annoyed'; // or sleepy
                    else if (headTilt > 15) emotion = 'surprised'; // quirky?
                    else emotion = 'neutral';

                } else {
                    // No face detected - use image signals only
                    console.warn("No face detected by MediaPipe");
                }

                resolve({
                    smileScore,
                    eyeOpenness,
                    headTilt,
                    faceAngle,
                    emotion,
                    brightness,
                    blurScore: calculateBlurScore(ctx, canvas.width, canvas.height),
                    dominantColor: dominantHex,
                    isDark: brightness < 60,
                    isBlurry: false, // will update strictly in roast logic if score is low
                    faceDetected: results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0
                });
            };

            mesh.onResults(onResults);
            await mesh.send({ image: canvas });

        } catch (e) {
            reject(e);
        }
    });
}
