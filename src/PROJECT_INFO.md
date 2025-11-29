# MonadVenmo - Complete User Flow Documentation

## Overview
MonadVenmo is a social payments PWA built on the Monad blockchain, combining Web2 UX familiarity with Web3 power.

## Complete User Journey

### 1. **Splash Screen**
- **Duration**: 2 seconds
- **Features**:
  - Animated MonadVenmo logo with 3D rotation
  - Matrix rain effect background
  - Loading bar animation
  - Brand tagline: "10,000 TPS • Sub-cent fees • Instant finality"

### 2. **Tutorial/Onboarding (3 Slides)**
- **Slide 1**: Lightning Fast Payments (10,000 TPS)
- **Slide 2**: Human-Readable Handles (@alice vs 0x...)
- **Slide 3**: Decentralized & Secure (Monad blockchain)
- **Features**:
  - Swipeable slides with smooth transitions
  - Skip option available
  - Progress dots indicator

### 3. **Handle Registration**
- **Purpose**: Claim your on-chain identity
- **Features**:
  - Real-time handle availability checking
  - Visual feedback (✓ available, ✗ taken)
  - Fee display (0.001 MON ≈ $0.01)
  - Matrix rain background effect
  - 3D rotating key icon
- **UX Flow**:
  1. User enters desired handle (e.g., "satoshi")
  2. System checks Registry Contract
  3. Shows availability status
  4. User clicks "Mint Handle"
  5. Transaction processes (~1 second)
  6. Redirects to Home

### 4. **Home Screen (Main Dashboard)**
- **Layout**:
  - **Top Bar**:
    - User avatar (clickable → Settings)
    - Handle (@shashank)
    - QR Scanner button
  - **Refresh Button**: Manual balance refresh
  - **Balance Hero**:
    - Large balance display ($4,250.50)
    - Today's change (+$120.00) with trend arrow
  - **Quick Actions Grid** (4 icons):
    1. Send (Purple-Cyan gradient)
    2. Request (Green-Cyan gradient)
    3. Scan (Orange-Red gradient)
    4. Contacts (Pink-Purple gradient)
  - **Activity Feed**:
    - Recent transactions (scrollable)
    - Each shows: Avatar, handle, note, time, amount
    - Lightning bolt icon for instant finality
    - Clickable for transaction details
  - **Bottom Navigation**: 5 tabs

### 5. **Send Money Flow**

#### Step 1: Recipient Input
- **Features**:
  - Handle search input (@username)
  - Real-time Registry lookup
  - Loading state while checking
  - Verified user card on match:
    - Avatar
    - Handle
    - Truncated address (0x71...3A)
    - Green checkmark
  - "Handle not found" error state

#### Step 2: Amount Entry
- **Features**:
  - Large amount display
  - Custom numeric keypad (0-9, ., ←)
  - Optional note field
  - Real-time input validation
  - Disabled decimals beyond 2 places

#### Step 3: Confirmation Screen
- **Features**:
  - Recipient summary card with avatar
  - Amount breakdown
  - Network fee display (< $0.001)
  - Estimated time (< 1s)
  - Total calculation
  - Warning message about irreversibility
  - "Slide to Confirm" button
  - Loading state during processing

#### Step 4: Success Screen
- **Features**:
  - Warp speed tunnel animation
  - Animated checkmark with glow
  - Amount and recipient displayed
  - Performance metrics:
    - Processing time (0.8s)
    - Gas fee (< $0.0008)
  - Transaction hash with copy button
  - "View on Explorer" link
  - Monad branding footer

### 6. **Request Money Flow**

#### Step 1: Amount & Note
- **Features**:
  - Amount keypad
  - Optional note input ("What's it for?")
  - "Generate QR Code" button

#### Step 2: QR Code Display
- **Features**:
  - Large QR code (256x256)
  - Request details summary
  - Share button (native share API)
  - Copy link button
  - Request link format: `monadpay://pay/@shashank?amount=50&note=...`

### 7. **QR Scanner**
- **Features**:
  - Full-screen camera view
  - Animated scanning frame with corners
  - Moving scan line effect
  - Instructions overlay
  - "Upload from Gallery" button
  - Success animation on detection
  - Auto-redirect to Send flow with prefilled data

### 8. **Activity/History Screen**
- **Features**:
  - Total received/sent cards
  - Search bar (by handle or note)
  - Filter tabs (All/Received/Sent)
  - Transaction list with full details
  - Clickable items → Transaction Detail

### 9. **Transaction Detail Screen**
- **Features**:
  - Status card with amount and direction
  - Transaction information:
    - Status (Confirmed ✓)
    - Date & time
    - Processing time
    - Network fee
  - Blockchain details:
    - Transaction hash (copyable)
    - From/To address (copyable)
    - "View on Explorer" button
  - Visual hierarchy with icons

### 10. **Settings/Profile Screen**
- **Features**:
  - Profile card with avatar, handle, address
  - Menu items:
    - Profile (edit information)
    - Security (wallet management)
    - Notifications (preferences)
    - Appearance (customization)
    - Help & Support
  - App information:
    - Version number
    - Network status (Monad Mainnet)
    - Block height
  - Disconnect wallet button

### 11. **Bottom Navigation**
- **Tabs**:
  1. Home (house icon)
  2. Send (paper plane icon)
  3. Scan (QR code icon)
  4. Activity (history icon)
  5. Profile (user icon)
- **Features**:
  - Active tab indicator (gradient background + dot)
  - Smooth tab switching animations
  - Always visible on main screens

## Design System

### Colors
- **Background**: Void Black (#050505)
- **Brand Primary**: Monad Purple (#836EF9)
- **Brand Secondary**: Electric Cyan (#4FFFFF)
- **Text**: White / Cool Grey (#94A3B8)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Warning**: Orange (#F59E0B)

### Typography
- **Numbers/Balances**: Space Grotesk (tabular)
- **UI Text**: Inter
- **Handles/Code**: JetBrains Mono

### Components
- **Corners**: Deeply rounded (24px for cards, 16px for buttons)
- **Glass Effects**: Backdrop blur on overlays
- **Shadows**: Soft glows for brand colors
- **Animations**: Spring physics for natural feel

## Interactions & Animations

### Page Transitions
- **Home ↔ Send/Request**: Slide from right
- **Home → Settings**: Slide from left
- **Home → Scanner**: Scale + fade
- **Any → Transaction Detail**: Slide from bottom
- **Any → Success**: Scale with spring

### Micro-interactions
- **Buttons**: Scale down on tap (whileTap)
- **Tabs**: Animated indicator follows selection
- **Loading**: Spinner with rotation
- **Success**: Checkmark scale-in with spring
- **Input**: Border color change on focus
- **Refresh**: Icon rotation animation

### Loading States
- **Handle check**: Spinner + "Looking up handle..."
- **Payment processing**: Rotating border + "Processing..."
- **QR scanning**: Moving scan line
- **Balance refresh**: Rotating refresh icon

## Smart Contract Integration (Mock)

### Registry Contract Functions
1. **checkHandleAvailability(handle)**: Returns boolean + user data
2. **mintHandle(handle)**: Registers new handle (0.001 MON + gas)
3. **resolveHandle(handle)**: Returns wallet address
4. **reverseResolve(address)**: Returns handle

### Payment Flow
1. User enters @alice
2. Frontend queries Registry: `resolveHandle("@alice")`
3. Gets address: 0x71C7656...
4. User confirms amount
5. Transaction sent to blockchain
6. Confirmation in ~0.8s (Monad speed)
7. Success screen shows hash

## Accessibility Features
- **High contrast**: White text on dark background
- **Large touch targets**: Minimum 48x48px
- **Clear feedback**: Visual confirmation for all actions
- **Error states**: Clear, helpful messages
- **Loading states**: User always knows what's happening

## Performance Optimizations
- **Code splitting**: Lazy load screens
- **Animation**: Hardware-accelerated transforms
- **Images**: Optimized avatars via API
- **List rendering**: Virtualization for long lists
- **Debouncing**: Handle search (300ms delay)

## Future Enhancements
- [ ] Contacts management
- [ ] Recurring payments
- [ ] Payment requests via links
- [ ] Multi-currency support
- [ ] Payment splitting
- [ ] Transaction notes/tags
- [ ] Export transaction history
- [ ] Biometric authentication
- [ ] Push notifications
- [ ] Dark/Light theme toggle
