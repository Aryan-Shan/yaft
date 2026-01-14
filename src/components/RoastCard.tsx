import { forwardRef } from 'react'
import { cn } from '../lib/utils'

interface RoastCardProps {
    image: string
    roast: string
    intensity: string
    signals?: any
}

export const RoastCard = forwardRef<HTMLDivElement, RoastCardProps>(({ image, roast, intensity }, ref) => {
    return (
        <div
            ref={ref}
            className="relative w-full max-w-sm mx-auto aspect-[9/16] md:aspect-auto md:h-[600px] overflow-hidden rounded-xl bg-black group"
        >
            {/* Background Image */}
            <img
                src={image}
                alt="Roast Target"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />

            {/* Scanlines/Noise */}
            <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAwMDAiIG9wYWNpdHk9IjAuNSIgZmlsdGVyPSJ1cmwoI25vaXNlRmlsdGVyKSIvPjwvc3ZnPg==')] opacity-20 mix-blend-overlay" />

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div className="border-l-4 border-neon-green pl-4 overflow-visible">
                    <h1 className="text-3xl md:text-4xl font-brand font-bold text-white uppercase leading-none tracking-tighter shadow-black drop-shadow-lg break-words">
                        YOU<br /><span className="text-neon-green">ASKED</span><br />FOR THIS
                    </h1>
                </div>

                <div className="space-y-4">
                    <div className="bg-black/60 backdrop-blur-md p-6 rounded-lg border border-white/10 shadow-2xl">
                        <p className="text-white font-bold text-lg md:text-xl leading-relaxed font-body drop-shadow-md">
                            "{roast}"
                        </p>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Intensity</p>
                            <p className={cn(
                                "text-sm font-bold uppercase",
                                intensity === 'playful' && 'text-neon-blue',
                                intensity === 'no-mercy' && 'text-neon-green',
                                intensity === 'career-ending' && 'text-neon-red',
                            )}>
                                {intensity.replace('-', ' ')}
                            </p>
                        </div>
                        <p className="text-[10px] text-white/30 font-mono">proof that free will was a mistake.</p>
                    </div>
                </div>

                {/* Debug Info (Uncomment to debug signals) */}
                {/* {signals && (
                    <div className="absolute right-4 bottom-4 z-40 p-2 bg-black/90 backdrop-blur rounded border border-white/20 text-[9px] font-mono text-neon-green/80 flex flex-col gap-1 items-end opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="text-[8px] uppercase tracking-wider text-white/40 border-b border-white/10 mb-1 w-full text-right">Analysis</div>
                        <div>Face: <span className={signals.faceDetected ? 'text-neon-green' : 'text-neon-red'}>{signals.faceDetected ? 'YES' : 'NO'}</span></div>
                        <div>Smile: {signals.smileScore.toFixed(2)}</div>
                        <div>Eyes: {signals.eyeOpenness.toFixed(2)}</div>
                        <div>Light: {signals.brightness.toFixed(0)}</div>
                    </div>
                )} */}
            </div>
        </div>
    )
})
RoastCard.displayName = "RoastCard"
