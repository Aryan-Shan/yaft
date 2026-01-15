# How "You Asked For This" Works 💀

This application is a **Client-Side Single Page Application (SPA)** that uses local AI to analyze faces and generate "roasts" without ever sending user photos to a server.

## 🏗️ Tech Stack

*   **Framework**: React + TypeScript + Vite
*   **Styling**: Tailwind CSS (Custom "Void & Neon" design system)
*   **Animation**: Framer Motion
*   **AI/Vision**: Google MediaPipe Face Mesh
*   **Export**: html-to-image

---

## 🧠 The "Brain" (Client-Side AI)

Unlike most "AI" apps that wrap a ChatGPT API, this app runs entirely in your browser.

### 1. Image Pre-processing (`imageAnalysis.ts`)
When a user uploads a photo:
1.  **Canvas Conversion**: The image is drawn onto an invisible HTML Canvas.
2.  **Pixel Analysis**: We look at raw pixel data to calculate:
    *   **Brightness**: Is the photo too dark? (`isDark`)
    *   **Blur**: We run a Laplacian Variance algorithm to detect if the image is out of focus (`blurScore`).
    *   **Color**: We convert RGB to HSL to find the dominant mood.

### 2. Facial Geometry (`MediaPipe`)
We use **MediaPipe Face Mesh** to detect 468 3D landmarks on the user's face.
We don't just "detect a face"; we calculate **Vector Signals**:

*   **Smile Score**: We measure the ratio between the mouth corners and the face width.
    *   `> 0.6`: "Fake Smile" or "Too Happy"
    *   `< 0.1`: "Resting B*tch Face"
*   **Eye Openness**: We measure the vertical distance between eyelids.
    *   `< 0.2`: "Dead Eyes" / "Stoned"
*   **Head Tilt**: We calculate the angle of the eye-line relative to the horizon.
    *   `> 15deg`: "Quirky" / "Trying too hard"

### 3. The Roast Engine (`roastLogic.ts`)
This is a deterministic heuristic engine that maps **Signals** → **Categories** → **Phrases**.

1.  **Signal Mapping**: The engine checks the analysis results against thresholds.
    *   *Example*: If `smileScore > 0.7` AND `eyeOpenness < 0.3`, it detects **"Pain Behind The Eyes"**.
    *   *Example*: If `brightness < 40`, it detects **"Depression Room Lighting"**.
2.  **Category Selection**: It picks the most prominent "flaw" (e.g., `bad_quality`, `no_face`, `too_happy`).
3.  **Intensity Filtering**: It filters phrases based on the user's choice:
    *   **Playful**: "Light teasing."
    *   **No Mercy**: "Personal attacks."
    *   **Career Ending**: "Existential dread."

---

## 🎨 Rendering & Export

### The "Void" Aesthetic
*   **CSS Filters**: We use CSS `mix-blend-mode` and SVG noise overlays to create the grainy, film-video look.
*   **Dynamic Borders**: Tailwind utilities change the neon border colors based on the chosen intensity (Blue/Green/Red).

### "Save Proof" Functionality
To let users download the card:
1.  We grab the DOM element of the card (`RoastCard`).
2.  We use `html-to-image` to "screenshot" that specific div.
3.  **Crucial Fixes**:
    *   The image is forced to **400px x 712px** to ensure it looks good on mobile Stories.
    *   We bake the fonts and noise textures directly into the Blob to avoid "Cross-Origin" security errors.

---

## 🚀 Deployment

Because there is no backend server (no Python, no Node.js API), the entire app compiles into static HTML/JS/CSS.
*   It lives in the `/dist` folder after building.
*   It can be hosted for free on **Vercel**, **Netlify**, or **GitHub Pages**.
