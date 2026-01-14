import { motion } from 'framer-motion'
import { Flame, Skull, Smile } from 'lucide-react'
import { cn } from '../lib/utils'

interface IntensitySelectorProps {
    onSelect: (intensity: string) => void
}

const INTENSITIES = [
    {
        id: 'playful',
        title: 'Playful Bully',
        icon: Smile,
        description: 'Like a best friend roasting you. Hurts, but funny.',
        color: 'text-neon-blue',
        borderColor: 'hover:border-neon-blue'
    },
    {
        id: 'no-mercy',
        title: 'No Mercy',
        icon: Flame,
        description: 'The gloves are off. Prepare to cry.',
        color: 'text-neon-green',
        borderColor: 'hover:border-neon-green'
    },
    {
        id: 'career-ending',
        title: 'Career-Ending',
        icon: Skull,
        description: 'We might get sued. You approved this.',
        color: 'text-neon-red',
        borderColor: 'hover:border-neon-red'
    }
]

export function IntensitySelector({ onSelect }: IntensitySelectorProps) {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-brand font-bold text-white">CHOOSE YOUR PAIN</h2>
                <p className="text-white/60">How much do you hate yourself today?</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {INTENSITIES.map((level, index) => (
                    <motion.button
                        key={level.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelect(level.id)}
                        className={cn(
                            "relative w-full text-left p-6 rounded-xl transition-all duration-300 group hover:-translate-y-1 outline-none",
                            "bg-zinc-950 border border-zinc-800", // "Void" base style
                            "hover:border-transparent", // clear base border on hover
                            level.borderColor, // applies neon border color on hover
                            "hover:ring-1 hover:ring-inset", // sharp inner ring
                            "hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)]", // neon glow
                            level.id === 'playful' && "hover:shadow-neon-blue/50 hover:ring-neon-blue",
                            level.id === 'no-mercy' && "hover:shadow-neon-green/50 hover:ring-neon-green",
                            level.id === 'career-ending' && "hover:shadow-neon-red/50 hover:ring-neon-red",
                        )}
                    >
                        <div className={cn("p-3 rounded-full bg-zinc-900 w-fit mb-4 group-hover:scale-110 transition-transform", level.color)}>
                            <level.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{level.title}</h3>
                        <p className="text-sm text-white/50">{level.description}</p>
                    </motion.button>
                ))}
            </div>
        </div>
    )
}
