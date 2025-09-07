import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: 
          "shadow-sm hover:shadow-md",
        elevated: 
          "shadow-md hover:shadow-lg hover:-translate-y-1",
        glass: 
          "bg-white/5 backdrop-blur-md border-white/10 shadow-lg hover:bg-white/10 hover:shadow-xl",
        gradient: 
          "bg-gradient-to-br from-card to-card/80 shadow-lg hover:shadow-xl hover:-translate-y-1 border-0",
        neon: 
          "shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 border-primary/20 hover:-translate-y-1",
        outline: 
          "border-2 shadow-none hover:shadow-md hover:border-primary/50",
        soft: 
          "bg-primary/5 border-primary/10 hover:bg-primary/10 hover:shadow-md",
        floating: 
          "shadow-2xl hover:shadow-3xl hover:-translate-y-2 border-0 bg-card/95 backdrop-blur-sm",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-lg",
        lg: "rounded-xl",
        xl: "rounded-2xl",
        full: "rounded-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      radius: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  hover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, radius, hover = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, padding, radius }),
        hover && "cursor-pointer",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { separator?: boolean }
>(({ className, separator = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      separator && "border-b border-border/10 pb-4 mb-4",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    size?: "sm" | "default" | "lg" | "xl"
  }
>(({ className, size = "default", ...props }, ref) => {
  const sizeClasses = {
    sm: "text-lg font-semibold",
    default: "text-2xl font-semibold",
    lg: "text-3xl font-bold",
    xl: "text-4xl font-bold",
  }
  
  return (
    <h3
      ref={ref}
      className={cn(
        "leading-none tracking-tight",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    size?: "sm" | "default" | "lg"
  }
>(({ className, size = "default", ...props }, ref) => {
  const sizeClasses = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base",
  }
  
  return (
    <p
      ref={ref}
      className={cn(
        "text-muted-foreground",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    noPadding?: boolean
  }
>(({ className, noPadding = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      !noPadding && "p-6 pt-0",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    separator?: boolean,
    justify?: "start" | "center" | "end" | "between" | "around"
  }
>(({ className, separator = false, justify = "start", ...props }, ref) => {
  const justifyClasses = {
    start: "justify-start",
    center: "justify-center", 
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-6 pt-0",
        separator && "border-t border-border/10 pt-4 mt-4",
        justifyClasses[justify],
        className
      )}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

// New component for interactive cards with built-in animations
const InteractiveCard = React.forwardRef<
  HTMLDivElement,
  CardProps & {
    onClick?: () => void
    loading?: boolean
    selected?: boolean
  }
>(({ className, onClick, loading = false, selected = false, children, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "group relative overflow-hidden",
      onClick && "cursor-pointer",
      selected && "ring-2 ring-primary ring-offset-2",
      loading && "pointer-events-none opacity-70",
      className
    )}
    onClick={onClick}
    {...props}
  >
    {loading && (
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
        <svg
          className="animate-spin h-8 w-8 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    )}
    
    {/* Hover overlay effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    
    {children}
  </Card>
))
InteractiveCard.displayName = "InteractiveCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  InteractiveCard,
  cardVariants
}