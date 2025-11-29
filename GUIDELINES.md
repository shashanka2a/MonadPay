# monadpay Design Guidelines

Complete design system and UI/UX guidelines for the monadpay payment application.

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Animations & Transitions](#animations--transitions)
7. [Icons & Imagery](#icons--imagery)
8. [Accessibility](#accessibility)
9. [Responsive Design](#responsive-design)
10. [Dark Mode](#dark-mode)

---

## Design Philosophy

### Core Principles

1. **Consumer-Friendly Web3**
   - Hide blockchain complexity
   - Use familiar Web2 patterns
   - Human-readable handles instead of addresses
   - Instant, transparent transactions

2. **Speed & Performance**
   - Emphasize Monad's 10,000 TPS capability
   - Sub-second transaction finality
   - Smooth animations (60fps)
   - Optimistic UI updates

3. **Trust & Security**
   - Clear transaction confirmations
   - Transparent fee structures
   - Visual security indicators
   - Error prevention over error handling

4. **Modern Aesthetics**
   - Dark theme with vibrant accents
   - Glassmorphism effects
   - Gradient highlights
   - Clean, minimal interface

---

## Color System

### Primary Colors

```css
/* Void Black - Primary Background */
--void-black: #050505;
Background: #050505

/* Monad Purple - Primary Brand */
--monad-purple: #836EF9;
Primary Actions, Brand Elements

/* Electric Cyan - Accent */
--electric-cyan: #4FFFFF;
Highlights, Active States, Gradients
```

### Semantic Colors

```css
/* Success Green */
--success-green: #10B981;
Success states, positive actions, confirmations

/* Danger Red */
--danger-red: #EF4444;
Errors, destructive actions, warnings

/* Cool Grey */
--cool-grey: #94A3B8;
Secondary text, inactive states, borders

/* Warning Orange */
--warning-orange: #F59E0B;
Warnings, pending states
```

### Color Usage

#### Backgrounds
- **Primary Background**: `#050505` (Void Black)
- **Card Background**: `#050505` with `backdrop-blur-xl` and `bg-white/5`
- **Modal Overlay**: `bg-black/50` with backdrop blur
- **Input Background**: `bg-white/5` or `bg-white/10`

#### Text Colors
- **Primary Text**: `text-white` (#FFFFFF)
- **Secondary Text**: `text-white/70` or `text-white/80`
- **Tertiary Text**: `text-[#94A3B8]` (Cool Grey)
- **Muted Text**: `text-white/50`

#### Interactive States
- **Primary Button**: Gradient from `#836EF9` to `#4FFFFF`
- **Hover State**: `bg-white/5` or `bg-white/10`
- **Active State**: Gradient with increased opacity
- **Disabled State**: `opacity-30` or `opacity-50`

#### Status Colors
- **Success**: `#10B981` (Green)
- **Error**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Orange)
- **Info**: `#4FFFFF` (Cyan)

### Gradient Combinations

```css
/* Primary Gradient (Purple to Cyan) */
bg-gradient-to-br from-[#836EF9] to-[#4FFFFF]

/* Success Gradient */
bg-gradient-to-br from-[#10B981] to-[#4FFFFF]

/* Warning Gradient */
bg-gradient-to-br from-[#F59E0B] to-[#EF4444]

/* Background Gradient */
bg-gradient-to-b from-[#050505] to-transparent
```

---

## Typography

### Font Families

#### Primary Fonts

```css
/* UI Text - Inter */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
Usage: Buttons, labels, body text, UI elements

/* Headings - Space Grotesk */
font-family: 'Space Grotesk', sans-serif;
Usage: Headings, numbers, balances, amounts

/* Code/Handles - JetBrains Mono */
font-family: 'JetBrains Mono', 'Courier New', monospace;
Usage: Handles (@username), addresses, transaction hashes
```

### Font Sizes

```css
/* Display */
text-6xl: 3.75rem (60px) - Hero titles
text-5xl: 3rem (48px) - Large headings
text-4xl: 2.25rem (36px) - Section headings

/* Headings */
text-3xl: 1.875rem (30px) - Page titles
text-2xl: 1.5rem (24px) - Card titles
text-xl: 1.25rem (20px) - Subheadings

/* Body */
text-lg: 1.125rem (18px) - Large body text
text-base: 1rem (16px) - Default body text
text-sm: 0.875rem (14px) - Small text, captions
text-xs: 0.75rem (12px) - Tiny text, labels
```

### Font Weights

- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Headings
- **Bold**: 700 - Strong emphasis

### Typography Scale

```css
/* Balance Display */
.balance {
  font-family: 'Space Grotesk', sans-serif;
  font-feature-settings: 'tnum' 1; /* Tabular numbers */
  font-size: 2.25rem; /* text-4xl */
  font-weight: 600;
  letter-spacing: -0.02em;
}

/* Handle Display */
.handle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 500;
  color: #4FFFFF;
}

/* Address Display */
.address {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: #94A3B8;
}
```

---

## Spacing & Layout

### Spacing Scale

Based on 0.25rem (4px) base unit:

```css
--spacing: 0.25rem; /* 4px base unit */

/* Common Spacing */
gap-1: 4px
gap-2: 8px
gap-3: 12px
gap-4: 16px
gap-6: 24px
gap-8: 32px

/* Padding */
p-3: 12px
p-4: 16px
p-5: 20px
p-6: 24px
p-8: 32px

/* Margin */
mt-4: 16px
mb-6: 24px
mb-8: 32px
mb-12: 48px
```

### Container Widths

```css
/* Max Widths */
max-w-sm: 24rem (384px) - Small cards
max-w-md: 28rem (448px) - Medium cards
max-w-2xl: 42rem (672px) - Main app container
```

### Layout Patterns

#### Main Container
```css
.container {
  max-width: 42rem; /* max-w-2xl */
  margin: 0 auto;
  padding: 0 1rem;
  background: #050505;
  min-height: 100vh;
}
```

#### Card Layout
```css
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px);
  border-radius: 1.5rem; /* rounded-3xl */
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
}
```

#### Screen Padding
- **Mobile**: `px-4` or `px-6` (16-24px)
- **Desktop**: `px-8` (32px)
- **Vertical**: `py-6` or `py-8` (24-32px)

---

## Components

### Buttons

#### Primary Button
```tsx
<button className="
  px-6 py-3
  bg-gradient-to-br from-[#836EF9] to-[#4FFFFF]
  text-white font-semibold
  rounded-2xl
  shadow-lg shadow-[#836EF9]/50
  hover:opacity-90
  active:scale-95
  transition-all
  disabled:opacity-30 disabled:cursor-not-allowed
">
  Button Text
</button>
```

#### Secondary Button
```tsx
<button className="
  px-6 py-3
  bg-white/5
  text-white
  rounded-2xl
  border border-white/10
  hover:bg-white/10
  active:scale-95
  transition-all
">
  Button Text
</button>
```

#### Icon Button
```tsx
<button className="
  w-12 h-12
  rounded-2xl
  bg-white/5
  flex items-center justify-center
  hover:bg-white/10
  active:scale-90
  transition-all
">
  <Icon className="w-6 h-6" />
</button>
```

### Input Fields

```tsx
<input className="
  w-full
  px-4 py-3
  bg-white/5
  border border-white/10
  rounded-2xl
  text-white
  placeholder:text-white/30
  focus:border-[#836EF9]
  focus:outline-none
  transition-colors
" />
```

### Cards

#### Standard Card
```tsx
<div className="
  bg-white/5
  backdrop-blur-xl
  border border-white/10
  rounded-3xl
  p-6
">
  {/* Card content */}
</div>
```

#### Balance Card
```tsx
<div className="
  bg-gradient-to-br from-[#836EF9]/20 to-[#4FFFFF]/20
  backdrop-blur-xl
  border border-[#836EF9]/30
  rounded-3xl
  p-8
  shadow-2xl shadow-[#836EF9]/20
">
  {/* Balance display */}
</div>
```

### Navigation

#### Bottom Navigation
- Fixed position at bottom
- `bg-[#050505]/95` with `backdrop-blur-xl`
- Border top: `border-t border-white/10`
- Active tab: Gradient background + indicator dot
- Tab size: `w-12 h-12` icons, `text-xs` labels

#### Top Bar
- Height: `h-16` or `h-20`
- Padding: `px-6 py-4`
- Background: Transparent or `bg-[#050505]/95`

### Modals & Overlays

```tsx
<div className="
  fixed inset-0
  bg-black/50
  backdrop-blur-sm
  flex items-center justify-center
  z-50
">
  <div className="
    bg-[#050505]
    rounded-3xl
    border border-white/10
    p-6
    max-w-md w-full mx-4
    shadow-2xl
  ">
    {/* Modal content */}
  </div>
</div>
```

### Transaction Items

```tsx
<div className="
  flex items-center gap-4
  p-4
  rounded-2xl
  bg-white/5
  hover:bg-white/10
  transition-colors
  cursor-pointer
">
  {/* Avatar, handle, amount, time */}
</div>
```

---

## Animations & Transitions

### Transition Timing

```css
/* Default Transition */
transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);

/* Fast Transition */
transition: all 0.1s ease-out;

/* Slow Transition */
transition: all 0.3s ease-in-out;
```

### Spring Animations (Motion)

```tsx
// Page transitions
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ 
    type: 'spring', 
    stiffness: 300, 
    damping: 30 
  }}
>

// Scale animations
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ 
    type: 'spring', 
    stiffness: 200, 
    damping: 20 
  }}
>

// Button press
<motion.button
  whileTap={{ scale: 0.9 }}
  whileHover={{ scale: 1.05 }}
>
```

### Animation Patterns

#### Page Transitions
- **Forward**: Slide from right (`x: '100%' → 0`)
- **Backward**: Slide from left (`x: '-100%' → 0`)
- **Modal**: Slide from bottom (`y: '100%' → 0`)
- **Success**: Scale + fade (`scale: 0.8 → 1, opacity: 0 → 1`)

#### Micro-interactions
- **Button Press**: `scale: 1 → 0.9`
- **Hover**: `opacity: 1 → 0.9` or `bg-white/5 → bg-white/10`
- **Loading**: Rotate animation
- **Success Checkmark**: Scale-in with spring

#### Loading States
```tsx
// Spinner
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
/>

// Pulse
<motion.div
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ duration: 1.5, repeat: Infinity }}
/>
```

---

## Icons & Imagery

### Icon Library

**Lucide React** - Primary icon library

### Icon Sizes

```css
/* Standard Sizes */
w-4 h-4: 16px - Inline icons, small buttons
w-5 h-5: 20px - Default size
w-6 h-6: 24px - Standard buttons, navigation
w-8 h-8: 32px - Large buttons
w-12 h-12: 48px - Feature icons
w-16 h-16: 64px - Hero icons
w-20 h-20: 80px - Splash screen icons
```

### Icon Usage

- **Color**: Inherit from parent or use brand colors
- **Active State**: `text-white` or gradient
- **Inactive State**: `text-[#94A3B8]`
- **Hover**: Transition to `text-white`

### Avatar Images

- **Size**: `w-10 h-10` (40px) standard, `w-12 h-12` (48px) large
- **Shape**: `rounded-full`
- **Fallback**: Gradient background with initials
- **Border**: Optional `border-2 border-white/10`

### QR Codes

- **Size**: Minimum 256x256px for scanning
- **Padding**: White border around QR code
- **Background**: White on dark cards
- **Error Correction**: Level M or higher

---

## Accessibility

### Color Contrast

- **Text on Dark**: Minimum 4.5:1 contrast ratio
- **Interactive Elements**: Minimum 3:1 contrast ratio
- **Focus States**: High contrast outline

### Touch Targets

- **Minimum Size**: 48x48px (12x12 in Tailwind)
- **Spacing**: Minimum 8px between targets
- **Padding**: Adequate padding for comfortable tapping

### Focus States

```css
/* Focus Outline */
focus:outline-none
focus:ring-2
focus:ring-[#836EF9]
focus:ring-offset-2
focus:ring-offset-[#050505]
```

### Screen Reader Support

- Use semantic HTML elements
- Provide `aria-label` for icon-only buttons
- Use `aria-live` for dynamic content updates
- Ensure proper heading hierarchy

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order follows visual flow
- Escape key closes modals
- Enter/Space activates buttons

---

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
sm: 640px   - Small tablets
md: 768px   - Tablets
lg: 1024px  - Small desktops
xl: 1280px  - Desktops
2xl: 1536px - Large desktops
```

### Mobile (< 640px)

- Single column layout
- Full-width cards
- Bottom navigation always visible
- Stacked form elements
- Larger touch targets

### Tablet (640px - 1024px)

- Two-column layouts where appropriate
- Side-by-side forms
- Adjusted spacing

### Desktop (> 1024px)

- Centered container (`max-w-2xl`)
- Optimized spacing
- Hover states enabled
- Keyboard navigation emphasized

---

## Dark Mode

### Theme Implementation

monadpay uses a dark theme by default. All components are designed for dark backgrounds.

### Dark Theme Colors

- **Background**: `#050505` (Void Black)
- **Surface**: `rgba(255, 255, 255, 0.05)` with blur
- **Text**: White with opacity variations
- **Borders**: `rgba(255, 255, 255, 0.1)`

### Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## Component Patterns

### Empty States

```tsx
<div className="flex flex-col items-center justify-center py-12">
  <Icon className="w-16 h-16 text-[#94A3B8] mb-4" />
  <h3 className="text-xl font-semibold mb-2">No Transactions</h3>
  <p className="text-[#94A3B8] text-center">Your transaction history will appear here</p>
</div>
```

### Loading States

```tsx
<div className="flex items-center justify-center py-8">
  <Loader2 className="w-6 h-6 animate-spin text-[#836EF9]" />
  <span className="ml-2 text-[#94A3B8]">Loading...</span>
</div>
```

### Error States

```tsx
<div className="rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 p-4">
  <div className="flex items-center gap-2">
    <AlertCircle className="w-5 h-5 text-[#EF4444]" />
    <span className="text-[#EF4444]">Error message here</span>
  </div>
</div>
```

### Success States

```tsx
<div className="rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 p-4">
  <div className="flex items-center gap-2">
    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
    <span className="text-[#10B981]">Success message here</span>
  </div>
</div>
```

---

## Design Tokens

### Shadows

```css
/* Soft Glow */
shadow-lg shadow-[#836EF9]/50

/* Large Shadow */
shadow-2xl

/* Colored Shadows */
shadow-[#4FFFFF] - Cyan glow
shadow-[#836EF9]/50 - Purple glow
```

### Border Radius

```css
rounded-full: 9999px - Circles, avatars
rounded-3xl: 1.5rem (24px) - Cards, modals
rounded-2xl: 1rem (16px) - Buttons, inputs
rounded-xl: 0.75rem (12px) - Small elements
```

### Blur Effects

```css
backdrop-blur-sm: 8px - Subtle blur
backdrop-blur-xl: 24px - Strong blur (cards)
blur-2xl: 40px - Background effects
```

---

## Best Practices

### Do's ✅

- Use consistent spacing scale
- Maintain color contrast ratios
- Provide loading states for async operations
- Use semantic HTML
- Test on multiple screen sizes
- Ensure touch targets are adequate
- Use animations sparingly and purposefully
- Maintain consistent icon sizes

### Don'ts ❌

- Don't use more than 2-3 font sizes per screen
- Don't mix too many colors
- Don't use animations that cause motion sickness
- Don't hide important information
- Don't use low contrast text
- Don't make touch targets too small
- Don't break the visual hierarchy
- Don't use decorative fonts for body text

---

## Design Resources

### Tools

- **Figma**: Design mockups
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Icon library
- **Motion (Framer Motion)**: Animations

### References

- Material Design 3 (Dark theme)
- Apple Human Interface Guidelines
- Web Content Accessibility Guidelines (WCAG 2.1)

---

## Version History

- **v1.0** - Initial design system
  - Dark theme implementation
  - Component library
  - Animation guidelines
  - Accessibility standards

---

**Last Updated**: 2024

For questions or updates to these guidelines, please contact the design team.



