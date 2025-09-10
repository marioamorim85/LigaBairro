# PorPerto Button System - Usage Guide

## Overview

The PorPerto app features a comprehensive button system designed for rapid development, consistent UX, and delightful interactions. The system includes enhanced base buttons and specialized action buttons for common use cases.

## Quick Start

```tsx
import { Button } from '@/components/ui/button';
import { AcceptButton, RejectButton, CreateButton } from '@/components/ui/action-buttons';

// Basic usage
<Button variant="default">Click me</Button>

// Action buttons
<AcceptButton onClick={handleAccept} />
<RejectButton onClick={handleReject} />
<CreateButton>Create New Request</CreateButton>
```

## Enhanced Button Variants

### New Specialized Variants
- `accept` - Green gradient for positive actions (accept applications, approve requests)
- `reject` - Red gradient for negative actions (reject applications, decline requests)
- `success` - Success feedback with pulse animation
- `warning` - Amber gradient for cautionary actions
- `info` - Blue gradient for informational actions
- `premium` - Rainbow gradient for premium features
- `cta` - High-impact call-to-action button
- `minimal` - Subtle transparent button for secondary actions

### Enhanced Existing Variants
- `default` - Improved shadow and hover effects
- `destructive` - Added shake animation and better shadows
- `outline` - Enhanced border hover effects

## Button Sizes

```tsx
// Available sizes
<Button size="xs">Extra Small</Button>      // h-7
<Button size="sm">Small</Button>           // h-8
<Button size="default">Default</Button>    // h-10
<Button size="lg">Large</Button>          // h-11
<Button size="xl">Extra Large</Button>     // h-12
<Button size="xxl">2X Large</Button>       // h-14

// Icon sizes
<Button size="icon-sm">🔔</Button>         // h-8 w-8
<Button size="icon">⚙️</Button>           // h-10 w-10
<Button size="icon-lg">❤️</Button>        // h-12 w-12
```

## Action Buttons

### AcceptButton
Perfect for accepting applications, approving requests, or confirming positive actions.

```tsx
<AcceptButton 
  onClick={handleAccept}
  loading={isAccepting}
  showIcon={true}
  iconPosition="left"
>
  Accept Application
</AcceptButton>
```

### RejectButton
For declining applications, rejecting requests, or negative actions.

```tsx
<RejectButton 
  onClick={handleReject}
  loading={isRejecting}
  className="ml-2"
>
  Decline Request
</RejectButton>
```

### Common Usage Patterns

#### Request Application Actions
```tsx
import { ButtonGroup, AcceptButton, RejectButton } from '@/components/ui/action-buttons';

<ButtonGroup>
  <AcceptButton onClick={() => handleApplication(id, 'accept')} />
  <RejectButton onClick={() => handleApplication(id, 'reject')} />
</ButtonGroup>
```

#### CRUD Operations
```tsx
<ButtonGroup spacing="loose">
  <CreateButton onClick={openCreateModal} />
  <EditButton onClick={openEditModal} />
  <DeleteButton onClick={confirmDelete} />
</ButtonGroup>
```

#### Form Actions
```tsx
<ActionBar position="sticky-bottom">
  <Button variant="ghost">Cancel</Button>
  <Button variant="cta" type="submit">Save Changes</Button>
</ActionBar>
```

## Component Compositions

### ButtonGroup
Groups related buttons with consistent spacing.

```tsx
<ButtonGroup 
  orientation="horizontal" // or "vertical"
  spacing="normal"         // "tight", "normal", "loose"
>
  <Button>Option 1</Button>
  <Button>Option 2</Button>
</ButtonGroup>
```

### ActionBar
Creates a consistent action area for pages.

```tsx
<ActionBar position="bottom"> {/* "top", "bottom", "sticky-top", "sticky-bottom" */}
  <Button variant="ghost">Cancel</Button>
  <Button variant="cta">Save</Button>
</ActionBar>
```

## Animation Classes

### Available Animations
- `animate-wiggle` - Shake effect for errors or rejections
- `animate-pulse-glow` - Pulsing glow effect
- `animate-scale-up` - Scale up entrance animation
- `animate-success-bounce` - Success celebration bounce
- `btn-accept` - Shimmer effect on accept buttons
- `btn-reject` - Shake animation on hover

### Usage Examples
```tsx
<Button 
  variant="destructive"
  className="hover:animate-wiggle"
  onClick={deleteItem}
>
  Delete Item
</Button>

<Button 
  variant="success"
  className="animate-success-bounce"
>
  Success!
</Button>
```

## Loading States

All buttons support loading states with spinner and custom text.

```tsx
<Button 
  loading={isSubmitting}
  loadingText="Saving..."
  disabled={isSubmitting}
>
  Save Changes
</Button>

<AcceptButton 
  loading={isAccepting}
  loadingText="Accepting..."
>
  Accept
</AcceptButton>
```

## Best Practices

### Visual Hierarchy
1. **Primary Actions**: Use `cta` or `default` variant
2. **Secondary Actions**: Use `secondary` or `outline`
3. **Destructive Actions**: Use `destructive` or `DeleteButton`
4. **Accept/Reject**: Always use `AcceptButton` and `RejectButton`

### Accessibility
- Always provide meaningful button text
- Use loading states for async actions
- Include appropriate ARIA labels when needed
- Ensure sufficient color contrast

### Performance
- Use specialized action buttons to reduce bundle size
- Leverage CSS animations over JavaScript where possible
- Group related buttons to reduce layout shift

## Real-world Examples

### Request Detail Page
```tsx
// Accept/Reject application
<div className="flex justify-end space-x-2">
  <RejectButton 
    onClick={() => handleApplication('reject')}
    loading={isProcessing}
  />
  <AcceptButton 
    onClick={() => handleApplication('accept')}
    loading={isProcessing}
  />
</div>
```

### Social Interactions
```tsx
<ButtonGroup>
  <LoveButton 
    isLoved={request.isLoved}
    onClick={toggleLove}
  />
  <ShareButton onClick={shareRequest} />
</ButtonGroup>
```

### Form Submissions
```tsx
<ActionBar>
  <Button variant="ghost" onClick={onCancel}>
    Cancel
  </Button>
  <CreateButton 
    type="submit"
    loading={isCreating}
    loadingText="Creating..."
  >
    Create Request
  </CreateButton>
</ActionBar>
```

## Migration Guide

### From Basic Button
```tsx
// Before
<Button className="bg-green-500 text-white">Accept</Button>

// After
<AcceptButton>Accept</AcceptButton>
```

### From Custom Styled Buttons
```tsx
// Before
<button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
  Delete
</button>

// After
<DeleteButton>Delete</DeleteButton>
```

## Customization

### Custom Variants
Add new variants to the button system by extending the `buttonVariants` in `button.tsx`:

```tsx
// Add to buttonVariants.variants.variant
custom: "bg-custom text-custom-foreground hover:bg-custom/90 hover:scale-105 active:scale-95"
```

### Theme Integration
All buttons automatically adapt to light/dark themes using CSS custom properties defined in `globals.css`.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All animations gracefully degrade on browsers with `prefers-reduced-motion: reduce`.