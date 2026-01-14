import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

// Need to install class-variance-authority? 
// Wait, I didn't install it in step 38. I installed clsx and tailwind-merge. 
// I'll stick to simple objects or just clsx.

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-brand font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95"

    const variants = {
        primary: "bg-neon-green text-black hover:bg-neon-green/90 focus:ring-neon-green shadow-[0_0_15px_rgba(204,255,0,0.5)] hover:shadow-[0_0_25px_rgba(204,255,0,0.7)]",
        secondary: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10",
        danger: "bg-neon-red text-black hover:bg-neon-red/90 shadow-[0_0_15px_rgba(255,51,51,0.5)]",
        ghost: "text-white/60 hover:text-white hover:bg-white/5"
    }

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-8 text-base",
        lg: "h-14 px-10 text-lg"
    }

    return (
        <button
            ref={ref}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button }
