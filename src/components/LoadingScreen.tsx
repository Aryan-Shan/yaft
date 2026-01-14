import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const MESSAGES = [
    "Analyzing your life choices...",
    "Detecting lack of free will...",
    "Judging your outfit...",
    "Calculating emotional damage...",
    "Regret loading...",
    "This might hurt..."
]

export function LoadingScreen() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % MESSAGES.length)
        }, 2000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center space-y-8 py-20 min-h-[400px]">
            <div className="relative">
                <div className="absolute inset-0 bg-neon-green/20 blur-xl rounded-full animate-pulse" />
                <Loader2 className="w-16 h-16 text-neon-green animate-spin duration-1000 relative z-10" />
            </div>

            <div className="h-12 overflow-hidden relative w-full text-center flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="text-xl md:text-2xl font-brand text-white font-bold tracking-wide"
                    >
                        {MESSAGES[index]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    )
}
