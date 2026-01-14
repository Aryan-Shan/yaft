import { analyzeImage, type ImageSignals } from './imageAnalysis';
import { generateSavageRoast } from './roastLogic';

export async function generateRoast(image: File, intensity: string): Promise<{ roast: string, signals: ImageSignals | null }> {
    try {
        // 1. Analyze the image (Face Mesh + Canvas)
        const signals = await analyzeImage(image);
        console.log("Detected Signals:", signals);

        // 2. Generate Roast based on signals
        const roast = generateSavageRoast(signals, intensity);

        // 3. Simulate "processing" time for effect if analysis was too fast
        await new Promise(resolve => setTimeout(resolve, 1500));

        return { roast, signals };
    } catch (error) {
        console.error("Roast Generation Failed:", error);
        // Fallback roast if analysis fails
        return {
            roast: "You broke the AI with your face. That's a new low.",
            signals: null
        };
    }
}
