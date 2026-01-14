import type { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen w-full relative overflow-x-hidden bg-brand-black text-white scanlines">
            {/* Noise Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwMDAwMDAiIG9wYWNpdHk9IjAuNSIgZmlsdGVyPSJ1cmwoI25vaXNlRmlsdGVyKSIvPjwvc3ZnPg==')] bg-repeat" />

            {/* Gradient Blobs */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon-blue/5 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neon-pink/5 blur-[120px] pointer-events-none" />

            <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
                {children}
            </main>
        </div>
    )
}
