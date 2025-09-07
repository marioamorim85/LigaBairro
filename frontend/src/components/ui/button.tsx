import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu btn-delight ripple cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-105 active:scale-95 hover:animate-wiggle shadow-md hover:shadow-destructive/25",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 hover:shadow-lg hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 active:scale-95 hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 hover:backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        gradient: "gradient-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-primary/25",
        glass: "glass-card text-foreground hover:scale-105 active:scale-95 backdrop-blur-md hover:backdrop-blur-lg hover:bg-white/10",
        neon: "bg-primary text-primary-foreground neon-border hover:neon-glow hover:scale-105 active:scale-95 hover:animate-pulse",
        soft: "bg-background text-foreground soft-shadow hover:soft-shadow-lg hover:scale-105 active:scale-95 border border-border/50 hover:border-border",
        celebration: "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:scale-110 active:scale-95 shadow-lg hover:shadow-purple-500/50 animate-heartbeat",
        magic: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 active:scale-95 hover:btn-rainbow shadow-lg animate-shimmer",
        love: "bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-pink-500/50 cursor-heart",
        // New Enhanced Variants for Better UX
        accept: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/30 transition-all duration-300",
        reject: "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:animate-wiggle",
        success: "bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-400/40 transition-all duration-300",
        warning: "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-amber-500/30",
        info: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/30",
        premium: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white hover:scale-105 active:scale-95 shadow-xl hover:shadow-purple-600/50 animate-shimmer relative overflow-hidden",
        cta: "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 hover:scale-110 active:scale-95 shadow-xl hover:shadow-orange-500/40 animate-pulse-glow font-semibold",
        minimal: "bg-transparent text-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors duration-200 border-0",
      },
      size: {
        xs: "h-7 px-2 text-xs rounded",
        sm: "h-8 px-3 text-sm rounded-md",
        default: "h-10 px-4 py-2 text-sm",
        lg: "h-11 px-8 text-base rounded-md",
        xl: "h-12 px-10 text-base rounded-lg",
        xxl: "h-14 px-12 text-lg rounded-lg font-semibold",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, loadingText, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || "A carregar"}
          </>
        ) : (
          props.children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }