import { motion } from 'framer-motion'
import { Button } from './ui/Button'

interface HeroProps {
    onStart: () => void
}

export function Hero({ onStart }: HeroProps) {
    return (
        <div className="text-center max-w-3xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-brand font-bold tracking-tighter leading-[0.9]">
                    <span className="block text-white">YOU ASKED</span>
                    <span className="block text-neon-green text-neon-shadow">FOR THIS</span>
                </h1>
            </motion.div>

            <motion.p
                className="text-lg md:text-xl text-white/60 font-body max-w-xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
            >
                Proof that free will was a mistake.
                <br />
                Get a brutal, AI-generated roast of your face.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
            >
                <Button size="lg" onClick={onStart}>
                    ROAST ME 💀
                </Button>
                <p className="mt-4 text-xs text-white/30">
                    *Emotional damage guaranteed. No refunds on self-esteem.
                </p>
            </motion.div>
        </div>
    )
}
