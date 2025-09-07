import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  InteractiveCard 
} from '@/components/ui/card'

export function ModernUIShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Modern UI Components
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Beautiful, accessible, and modern components built with Tailwind CSS and Radix UI
          </p>
        </div>

        {/* Button Variants Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-center">Button Variants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="soft" padding="lg">
              <CardHeader>
                <CardTitle size="sm">Default Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">Primary</Button>
                <Button variant="secondary" className="w-full">Secondary</Button>
                <Button variant="outline" className="w-full">Outline</Button>
                <Button variant="ghost" className="w-full">Ghost</Button>
              </CardContent>
            </Card>

            <Card variant="glass" padding="lg">
              <CardHeader>
                <CardTitle size="sm">Modern Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="gradient" className="w-full">Gradient</Button>
                <Button variant="neon" className="w-full">Neon</Button>
                <Button variant="soft" className="w-full">Soft</Button>
                <Button variant="glass" className="w-full">Glass</Button>
              </CardContent>
            </Card>

            <Card variant="elevated" padding="lg">
              <CardHeader>
                <CardTitle size="sm">Sizes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button size="sm" className="w-full">Small</Button>
                <Button size="default" className="w-full">Default</Button>
                <Button size="lg" className="w-full">Large</Button>
                <Button size="xl" className="w-full">Extra Large</Button>
              </CardContent>
            </Card>

            <Card variant="neon" padding="lg">
              <CardHeader>
                <CardTitle size="sm">States</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">Normal</Button>
                <Button loading className="w-full">Loading</Button>
                <Button disabled className="w-full">Disabled</Button>
                <Button variant="destructive" className="w-full">Destructive</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Card Variants Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-center">Card Variants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="default" radius="lg">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>
                  Clean and simple design with subtle shadow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Perfect for general content and information display.
                </p>
              </CardContent>
              <CardFooter justify="between">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Continue</Button>
              </CardFooter>
            </Card>

            <Card variant="elevated" radius="xl">
              <CardHeader separator>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>
                  Enhanced shadow and hover effects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Great for highlighting important content or creating depth.
                </p>
              </CardContent>
              <CardFooter separator justify="end">
                <Button variant="gradient" size="sm">Get Started</Button>
              </CardFooter>
            </Card>

            <Card variant="glass" radius="xl">
              <CardHeader>
                <CardTitle>Glass Card</CardTitle>
                <CardDescription>
                  Modern glass morphism effect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Creates a modern, translucent appearance with backdrop blur.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="glass" size="sm" className="w-full">Explore</Button>
              </CardFooter>
            </Card>

            <Card variant="gradient" radius="lg">
              <CardHeader>
                <CardTitle className="text-white">Gradient Card</CardTitle>
                <CardDescription className="text-white/80">
                  Beautiful gradient background
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">
                  Eye-catching design with gradient backgrounds for special content.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            <Card variant="neon" radius="lg">
              <CardHeader>
                <CardTitle>Neon Card</CardTitle>
                <CardDescription>
                  Glowing border effects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Perfect for call-to-action sections or premium features.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="neon" size="sm" className="w-full">Upgrade Now</Button>
              </CardFooter>
            </Card>

            <InteractiveCard 
              variant="floating" 
              radius="xl"
              onClick={() => console.log('Card clicked!')}
            >
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>
                  Click me for interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built-in click handlers, loading states, and selection indicators.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  Click to Interact
                </Button>
              </CardFooter>
            </InteractiveCard>
          </div>
        </section>

        {/* Feature Showcase */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-center">Feature Highlights</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card variant="soft" radius="xl" padding="lg">
              <CardContent className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl text-white">✨</span>
                  </div>
                  <h3 className="text-2xl font-bold">Modern Design</h3>
                  <p className="text-muted-foreground">
                    Beautiful gradients, glass effects, and smooth animations
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Gradient & glass morphism effects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Smooth hover animations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Responsive design patterns</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="outline" radius="xl" padding="lg">
              <CardContent className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl text-white">⚡</span>
                  </div>
                  <h3 className="text-2xl font-bold">Developer Friendly</h3>
                  <p className="text-muted-foreground">
                    Built with TypeScript, Tailwind CSS, and accessibility in mind
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Full TypeScript support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Accessibility built-in</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Consistent API design</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
    </div>
  )
}