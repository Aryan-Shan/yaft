# You Asked For This 💀

> "The meanest AI roast generator on the internet. Because you clearly hate yourself."

**You Asked For This** is a client-side AI app that uses computer vision to analyze your face and generate brutal, personalized roasts based on your expression, vibe, and questionable life choices.

## 🌟 Features

*   **Face Analysis**: Uses `MediaPipe Face Mesh` to detect smiles, dead eyes, and lighting quality directly in your browser.
*   **Roast Engine**: A custom logic engine that maps your facial signals (Smile Score, Eye Openness, Blur) to savage roast categories.
*   **Three Intensities**:
    *   🙂 **Playful Bully**: Like a best friend roasting you.
    *   🔥 **No Mercy**: The gloves are off.
    *   💀 **Career-Ending**: Emotional damage guaranteed.
*   **Privacy First**: All analysis happens locally on your device. Your face never touches a server.
*   **"Void" Aesthetic**: A premium, dark-mode native UI with neon accents and sharp interactions.
*   **Share the Pain**: Export your roast as a high-quality PNG to share with friends (or enemies).

## 🛠️ Tech Stack

*   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Language**: TypeScript
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **AI/Vision**: [MediaPipe Face Mesh](https://developers.google.com/mediapipe/solutions/vision/face_mesh)
*   **Export**: [html-to-image](https://github.com/bubkoo/html-to-image)

## 🚀 Getting Started

1.  **Clone the repo**
    ```bash
    git clone https://github.com/your-username/you-asked-for-this.git
    cd you-asked-for-this
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    pnpm install
    # or
    yarn
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open locally**
    Visit `http://localhost:5173` and prepare to cry.

## 🏗️ Building for Production

```bash
npm run build
```
This generates a static build in the `dist/` folder, ready to be deployed to Vercel, Netlify, or GitHub Pages.

## 🤝 Contributing

Found a bug? Want to add meaner insults?
1.  Fork it.
2.  Create a branch (`git checkout -b feature/meaner-roasts`).
3.  Commit your changes.
4.  Open a Pull Request.

## 📄 License

MIT. Do whatever you want, just don't blame me for the emotional damage.
