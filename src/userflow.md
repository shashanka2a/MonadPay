# MonadVenmo User Flow Documentation

## Overview
MonadVenmo is a social payments PWA built on Monad blockchain with 11 interconnected screens, featuring a comprehensive onboarding system, transaction flows, and account management.

---

## 1. App Initialization Flow

### 1.1 Splash Screen → Tutorial → Onboarding
```
Splash Screen (auto-advances after animation)
    ↓
Tutorial Screen (swipeable cards explaining app features)
    ↓
Onboarding Screen (account setup)
    ↓
Home Screen (main app interface)
```

**Splash Screen**
- Displays MonadVenmo logo with animated gradient
- Matrix rain background effect
- Auto-advances to Tutorial after 2-3 seconds

**Tutorial Screen**
- 3 swipeable cards explaining:
  1. Fast payments on Monad (10,000 TPS)
  2. Use handles instead of wallet addresses
  3. Social payment features
- "Get Started" button → Onboarding
- "Skip" option → Onboarding

---

## 2. Onboarding Flow (Three Paths)

### 2.1 Initial Choice Screen
```
Onboarding Choice
    ├─→ Connect Existing Wallet
    ├─→ Create New Wallet
    └─→ Skip for now → Home
```

**Options:**
1. **Connect Existing Wallet** - For users with existing Monad wallets
2. **Create New Wallet** - For new users needing wallet creation
3. **Skip for now** - Direct access to app (limited functionality)

---

### 2.2 Connect Existing Wallet Flow
```
Connect Wallet Path
    ↓
Choose Wallet Provider (MetaMask / WalletConnect)
    ↓
[Connecting... loading state]
    ↓
✓ Wallet Connected (shows address)
    ↓
Enter Handle (@username)
    ↓
[Real-time availability checking]
    ↓
Map Handle to Wallet (pay 0.001 MON fee)
    ↓
[Mapping... loading state]
    ↓
Home Screen (with mapped handle + wallet)
```

**Key Features:**
- Wallet provider selection (MetaMask, WalletConnect)
- Real-time wallet connection with loading states
- Connected wallet address display (truncated: 0x1234...5678)
- Handle availability checking with visual feedback (✓/✗)
- Transaction fee display: 0.001 MON (~$0.01 USD) + gas
- "Back" button returns to choice screen

---

### 2.3 Create New Wallet Flow
```
Create Wallet Path
    ↓
Enter Handle (@username)
    ↓
[Real-time availability checking]
    ↓
Review Security Info (wallet generation explanation)
    ↓
Create Wallet & Claim Handle (pay 0.001 MON fee)
    ↓
[Creating Wallet... loading state]
    ↓
Home Screen (with new wallet + handle)
```

**Key Features:**
- Handle selection with real-time availability
- Security information about wallet generation
- Automatic wallet creation + handle registration
- Recovery phrase generation (mentioned in info box)
- Same fee structure as mapping: 0.001 MON + gas
- "Back" button returns to choice screen

---

## 3. Main Navigation Structure

### 3.1 Bottom Navigation (Persistent on 4 screens)
```
┌─────────────────────────────────────────┐
│                                         │
│           [SCREEN CONTENT]              │
│                                         │
├─────────────────────────────────────────┤
│  🏠 Home  │  📤 Send  │  📋 Activity  │  ⚙️ Settings  │
└─────────────────────────────────────────┘
```

**Visible on:** Home, Send, Activity, Settings
**Hidden on:** Onboarding, Confirm, Success, Transaction Detail, QR Scanner

---

## 4. Home Screen (Hub)

### 4.1 Home Screen Layout
```
┌─────────────────────────────────────┐
│  @handle                    [QR]    │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   Balance Card                │  │
│  │   $1,234.56                   │  │
│  │   123.45 MON                  │  │
│  └───────────────────────────────┘  │
│                                     │
│  [Send]  [Request]  [Add Money]    │
│                                     │
│  Recent Activity                   │
│  ┌─────────────────────────────┐   │
│  │ @alice  +$50.00             │   │
│  │ @bob    -$25.00             │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Bottom Nav: Home selected]       │
└─────────────────────────────────────┘
```

### 4.2 Navigation from Home
```
Home Screen
    ├─→ [QR Icon] → QR Scanner
    ├─→ [Send Quick Action] → Send Screen
    ├─→ [Request Quick Action] → Request Screen
    ├─→ [Add Money] → (external flow)
    ├─→ [Activity Item] → Transaction Detail
    ├─→ [Pull to Refresh] → Reload activity
    ├─→ [Send Tab] → Send Screen
    ├─→ [Activity Tab] → Activity Screen
    └─→ [Settings Tab] → Settings Screen
```

**Key Features:**
- Pull-to-refresh functionality
- Balance display (USD + MON)
- Quick actions row (Send, Request, Add Money)
- Recent activity feed (last 5 transactions)
- Tap any transaction → Transaction Detail Screen

---

## 5. Send Flow (Payment Initiation)

### 5.1 Complete Send Flow
```
Send Screen (Enter handle/amount)
    ↓
[Search/Lookup handle in Registry]
    ↓
✓ Handle Found (show user info)
    ↓
Enter Amount ($)
    ↓
Add Note (optional)
    ↓
[Review] → Confirm Payment Screen
    ↓
Review Transaction Details
    ↓
[Confirm Payment]
    ↓
[Processing... blockchain transaction]
    ↓
Success Screen
    ↓
[Done] → Home Screen
    └─→ [Share Receipt] → (share functionality)
```

### 5.2 Send Screen Details
```
┌─────────────────────────────────────┐
│  ← Send                             │
│                                     │
│  To                                 │
│  ┌─────────────────────────────┐   │
│  │ @                           │   │ ← Handle lookup
│  └─────────────────────────────┘   │
│                                     │
│  Amount                            │
│  ┌─────────────────────────────┐   │
│  │ $ 0.00                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  Note (optional)                   │
│  ┌─────────────────────────────┐   │
│  │ What's this for?            │   │
│  └─────────────────────────────┘   │
│                                     │
│  Recent Contacts                   │
│  [@alice] [@bob] [@charlie]        │
│                                     │
│         [Continue]                 │
│                                     │
│  [Bottom Nav: Send selected]       │
└─────────────────────────────────────┘
```

**Navigation:**
- Back button → Previous screen / Home
- Continue → Confirm Payment Screen (only enabled when valid)
- Tap Recent Contact → Auto-fill recipient

**Features:**
- Real-time handle lookup from Registry Smart Contract
- Handle validation (shows user avatar/name when found)
- Amount input with USD display
- Optional note/memo field
- Recent contacts quick selection
- Form validation before continuing

---

## 6. Confirm Payment Screen

### 6.1 Confirmation Flow
```
Confirm Payment Screen
    ├─→ [Edit] → Back to Send Screen (preserve data)
    ├─→ [Confirm Payment] → Success Screen
    └─→ [Back] → Send Screen
```

### 6.2 Screen Layout
```
┌─────────────────────────────────────┐
│  ← Confirm Payment                  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   Sending to                  │  │
│  │   @alice                      │  │
│  │   Alice Johnson               │  │
│  │   0x1234...5678               │  │
│  └───────────────────────────────┘  │
│                                     │
│  Amount                            │
│  $50.00                            │
│                                     │
│  Network Fee                       │
│  < $0.001                          │
│                                     │
│  Total                             │
│  $50.00                            │
│                                     │
│  Note                              │
│  "Lunch money"                     │
│                                     │
│  Speed: < 1s                       │
│                                     │
│         [Confirm Payment]          │
│                                     │
└─────────────────────────────────────┘
```

**Key Information Displayed:**
- Recipient handle, name, and wallet address
- Payment amount in USD and MON
- Network fee (typically < $0.001)
- Total amount
- Optional note
- Transaction speed estimate
- Edit option to modify details

---

## 7. Success Screen

### 7.1 Success Flow
```
Success Screen
    ├─→ [Done] → Home Screen
    ├─→ [View Details] → Transaction Detail Screen
    └─→ [Share Receipt] → Share functionality
```

### 7.2 Screen Layout
```
┌─────────────────────────────────────┐
│                                     │
│           ✓                         │
│      (animated checkmark)           │
│                                     │
│     Payment Sent!                  │
│                                     │
│     $50.00 to @alice               │
│                                     │
│  Transaction Hash                  │
│  0xabcd...1234                     │
│                                     │
│  Status: Confirmed                 │
│  Block: #1,234,567                 │
│                                     │
│         [Done]                     │
│    [View Details] [Share]          │
│                                     │
└─────────────────────────────────────┘
```

**Features:**
- Animated success checkmark with confetti effect
- Transaction summary
- Blockchain confirmation details
- Transaction hash (tappable to view on explorer)
- Multiple exit options

---

## 8. Request Flow (Payment Request)

### 8.1 Request Flow
```
Request Screen
    ↓
Enter Amount ($)
    ↓
Add Note (optional, e.g., "Dinner split")
    ↓
[Generate QR Code]
    ↓
QR Code Displayed
    ├─→ Show QR to sender (they scan it)
    ├─→ [Share] → Share payment link
    └─→ [Back] → Home
```

### 8.2 Screen Layout
```
┌─────────────────────────────────────┐
│  ← Request Payment                  │
│                                     │
│  Amount                            │
│  ┌─────────────────────────────┐   │
│  │ $ 0.00                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  Note (optional)                   │
│  ┌─────────────────────────────┐   │
│  │ What's this for?            │   │
│  └─────────────────────────────┘   │
│                                     │
│      [Generate QR Code]            │
│                                     │
│  ─────────────────────────────     │
│  After generation:                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │       [QR CODE]             │   │
│  │                             │   │
│  │   Requesting $25.00         │   │
│  │   from @yourhandle          │   │
│  └─────────────────────────────┘   │
│                                     │
│         [Share Request]            │
│                                     │
│  [Bottom Nav: Home selected]       │
└─────────────────────────────────────┘
```

**Features:**
- Amount input
- Optional note/description
- QR code generation with embedded payment details
- Share button to send request via other apps
- QR code includes: handle, amount, note
- Works with QR Scanner flow

---

## 9. QR Scanner Flow

### 9.1 Scanner Flow
```
QR Scanner Screen
    ↓
[Camera active, scanning for QR]
    ↓
QR Code Detected
    ├─→ Payment Request QR → Send Screen (pre-filled)
    ├─→ Handle QR → Send Screen (recipient filled)
    └─→ Invalid QR → Error toast
    
[Manual Cancel] → Previous Screen
```

### 9.2 Screen Layout
```
┌─────────────────────────────────────┐
│  × Cancel                           │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │     [CAMERA VIEW]             │  │
│  │                               │  │
│  │   ┌─────────────────┐         │  │
│  │   │                 │         │  │
│  │   │  Scan Frame     │         │  │
│  │   │                 │         │  │
│  │   └─────────────────┘         │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  Scan a MonadVenmo QR code         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [Flash] [Gallery]          │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Access Points:**
- Home screen QR icon (top right)
- Send screen QR button
- Request screen scanning option

**Features:**
- Live camera view
- Scanning frame overlay
- Flash toggle
- Gallery import option
- Auto-detect and parse QR codes
- Navigate to appropriate screen with pre-filled data

---

## 10. Activity Screen (Transaction History)

### 10.1 Activity Screen Layout
```
┌─────────────────────────────────────┐
│  Activity                           │
│                                     │
│  [Search transactions...]          │
│                                     │
│  [All] [Sent] [Received]           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Today                       │   │
│  │ ─────────────────────       │   │
│  │ @alice  +$50.00  Received   │   │
│  │ @bob    -$25.00  Sent       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Yesterday                   │   │
│  │ ─────────────────────       │   │
│  │ @charlie -$100.00  Sent     │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Load more...]                    │
│                                     │
│  [Bottom Nav: Activity selected]   │
└─────────────────────────────────────┘
```

### 10.2 Navigation from Activity
```
Activity Screen
    ├─→ [Search] → Filter transactions
    ├─→ [All/Sent/Received Tabs] → Filter by type
    ├─→ [Transaction Item] → Transaction Detail Screen
    ├─→ [Pull to Refresh] → Reload transactions
    └─→ [Bottom Nav] → Navigate to other screens
```

**Features:**
- Search bar for filtering transactions
- Filter tabs: All, Sent, Received
- Grouped by date (Today, Yesterday, This Week, etc.)
- Pull-to-refresh functionality
- Infinite scroll / Load more
- Color-coded amounts (green = received, white = sent)
- Tap any transaction → Transaction Detail Screen

---

## 11. Transaction Detail Screen

### 11.1 Detail Screen Layout
```
┌─────────────────────────────────────┐
│  ← Transaction Details              │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   Payment Sent                │  │
│  │   $50.00                      │  │
│  │   (12.5 MON)                  │  │
│  └───────────────────────────────┘  │
│                                     │
│  To                                │
│  @alice (Alice Johnson)            │
│  0x1234...5678                     │
│                                     │
│  Date                              │
│  Nov 29, 2025 at 2:34 PM          │
│                                     │
│  Status                            │
│  ✓ Confirmed                       │
│                                     │
│  Transaction Hash                  │
│  0xabcd...1234  [Copy]             │
│                                     │
│  Block Number                      │
│  #1,234,567                        │
│                                     │
│  Network Fee                       │
│  < $0.001                          │
│                                     │
│  Note                              │
│  "Lunch money"                     │
│                                     │
│  [View on Explorer]                │
│  [Share Receipt]                   │
│                                     │
└─────────────────────────────────────┘
```

### 11.2 Navigation
```
Transaction Detail Screen
    ├─→ [Back] → Previous Screen (Activity or Home)
    ├─→ [Copy Hash] → Copy to clipboard + toast
    ├─→ [View on Explorer] → External blockchain explorer
    └─→ [Share Receipt] → Share functionality
```

**Features:**
- Complete transaction information
- Recipient/sender details with handle and address
- Timestamp and status
- Blockchain details (hash, block number)
- Network fee information
- Note/memo if included
- Action buttons (copy, view, share)
- Toast notification on copy

---

## 12. Settings Screen

### 12.1 Settings Layout
```
┌─────────────────────────────────────┐
│  Settings                           │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   [Avatar]                    │  │
│  │   @yourhandle                 │  │
│  │   Your Name                   │  │
│  │   [Edit Profile]              │  │
│  └───────────────────────────────┘  │
│                                     │
│  Account                           │
│  ┌─────────────────────────────┐   │
│  │ 👤 Profile                  │   │
│  │ 🔐 Security                 │   │
│  │ 💳 Connected Wallets        │   │
│  │ 🔗 Linked Accounts          │   │
│  └─────────────────────────────┘   │
│                                     │
│  Preferences                       │
│  ┌─────────────────────────────┐   │
│  │ 🌙 Dark Mode        [ON]    │   │
│  │ 🔔 Notifications    [ON]    │   │
│  │ 💰 Default Currency USD     │   │
│  │ 🌐 Language         English │   │
│  └─────────────────────────────┘   │
│                                     │
│  About                             │
│  ┌─────────────────────────────┐   │
│  │ ℹ️ About MonadVenmo         │   │
│  │ 📄 Terms of Service         │   │
│  │ 🔒 Privacy Policy           │   │
│  │ 🚪 Logout                   │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Bottom Nav: Settings selected]   │
└─────────────────────────────────────┘
```

### 12.2 Settings Navigation
```
Settings Screen
    ├─→ [Edit Profile] → Profile edit modal/screen
    ├─→ [Security] → Security settings
    ├─→ [Connected Wallets] → Wallet management
    ├─→ [Linked Accounts] → Social account connections
    ├─→ [Toggles] → Update preferences
    ├─→ [About/Terms/Privacy] → Information screens
    └─→ [Logout] → Logout confirmation → Onboarding
```

**Features:**
- Profile card with avatar and handle
- Account management options
- Preference toggles (dark mode, notifications)
- Currency and language selection
- About and legal information
- Logout functionality

---

## 13. Complete User Journeys

### 13.1 New User Journey (Create Wallet)
```
1. Splash Screen (auto)
2. Tutorial Screen → "Get Started"
3. Onboarding: Choice → "Create New Wallet"
4. Enter handle → Check availability → ✓ Available
5. Review fees → "Create Wallet & Claim Handle"
6. [Processing...] → Wallet created
7. Home Screen (ready to use)
```

### 13.2 Existing User Journey (Connect Wallet)
```
1. Splash Screen (auto)
2. Tutorial Screen → "Get Started"
3. Onboarding: Choice → "Connect Existing Wallet"
4. Select wallet provider (MetaMask)
5. [Connecting...] → ✓ Wallet Connected
6. Enter handle → Check availability → ✓ Available
7. "Map Handle to Wallet" → [Processing...]
8. Home Screen (handle mapped to wallet)
```

### 13.3 Send Money Journey
```
1. Home Screen → "Send" (quick action or tab)
2. Send Screen → Enter @alice
3. [Looking up handle...] → ✓ Found
4. Enter amount: $50.00
5. Add note: "Lunch money"
6. "Continue" → Confirm Payment Screen
7. Review details → "Confirm Payment"
8. [Processing transaction...]
9. Success Screen → ✓ Payment Sent!
10. "Done" → Home Screen (updated balance)
```

### 13.4 Request Money Journey
```
1. Home Screen → "Request" (quick action)
2. Request Screen → Enter $25.00
3. Add note: "Dinner split"
4. "Generate QR Code"
5. QR displayed with payment details
6. Share or show QR to payer
7. Payer scans → Their Send Screen (pre-filled)
8. They complete payment
9. You receive notification → Updated balance
```

### 13.5 Scan and Pay Journey
```
1. Home Screen → Tap QR icon (top right)
2. QR Scanner Screen → Camera active
3. Scan recipient's QR code
4. [Detected!] → Send Screen (recipient pre-filled)
5. Enter amount and note
6. Continue → Confirm → Send
7. Success Screen → Done → Home
```

### 13.6 View Transaction History
```
1. Home Screen → Activity tab (bottom nav)
2. Activity Screen → Browse transactions
3. Filter: "Sent" transactions
4. Tap specific transaction → Transaction Detail Screen
5. View complete details
6. "Copy Hash" → Copied to clipboard (toast)
7. Back → Activity Screen
8. Back → Home Screen
```

---

## 14. Screen State Management

### 14.1 Persistent State Across Screens
- User handle and wallet address
- Account balance (USD and MON)
- Transaction history
- Recent contacts
- User preferences (from Settings)

### 14.2 Temporary State (Per-Session)
- Current screen and navigation history
- Form inputs (Send/Request screens)
- QR scanner camera permissions
- Toast notifications queue

### 14.3 Loading States
- Splash screen animation
- Tutorial loading
- Handle availability checking
- Wallet connection
- Transaction processing
- Blockchain confirmation
- Activity feed loading

---

## 15. Error Handling & Edge Cases

### 15.1 Common Error Scenarios
```
Handle Not Available
    → Show error message → Suggest alternatives

Wallet Connection Failed
    → Show retry option → Alternative providers

Insufficient Balance
    → Block transaction → Show "Add Money" option

Network Error
    → Show offline indicator → Retry option

Invalid QR Code
    → Toast error message → Resume scanning

Transaction Failed
    → Error screen → Retry or Cancel options

Handle Not Found (in Registry)
    → Show "Not found" message → Check spelling
```

### 15.2 User Guidance
- Inline validation on all forms
- Real-time feedback (checkmarks, errors)
- Loading states for all async operations
- Toast notifications for quick feedback
- Error screens with clear next steps

---

## 16. Navigation Patterns Summary

### 16.1 Primary Navigation Methods
1. **Bottom Nav** - Main 4 screens (Home, Send, Activity, Settings)
2. **Quick Actions** - Home screen buttons (Send, Request, Add Money)
3. **Back Buttons** - Return to previous screen
4. **Flow-Based** - Multi-step processes (Send → Confirm → Success)
5. **Deep Links** - Direct access from notifications/QR codes

### 16.2 Screen Transitions
- **Slide Right** - Forward navigation (Send, Request, Confirm)
- **Slide Left** - Backward navigation (Back buttons)
- **Slide Up** - Modal overlays (Transaction Detail)
- **Fade** - Screen replacements (Onboarding → Home)
- **Scale** - Success/Celebration screens

### 16.3 Exit Points to Home
- Success Screen → "Done" button
- Settings → Bottom Nav
- Activity → Bottom Nav
- Transaction Detail → Back button
- Any screen with Bottom Nav → Home tab

---

## 17. Feature Matrix

| Screen | Pull-to-Refresh | Search/Filter | Bottom Nav | QR Access | Back Button |
|--------|----------------|---------------|------------|-----------|-------------|
| Splash | ❌ | ❌ | ❌ | ❌ | ❌ |
| Tutorial | ❌ | ❌ | ❌ | ❌ | ❌ |
| Onboarding | ❌ | ❌ | ❌ | ❌ | ✅ (in sub-steps) |
| Home | ✅ | ❌ | ✅ | ✅ | ❌ |
| Send | ❌ | ✅ | ✅ | ✅ | ✅ |
| Request | ❌ | ❌ | ✅ | ❌ | ✅ |
| Confirm | ❌ | ❌ | ❌ | ❌ | ✅ |
| Success | ❌ | ❌ | ❌ | ❌ | ❌ |
| QR Scanner | ❌ | ❌ | ❌ | ❌ | ✅ |
| Activity | ✅ | ✅ | ✅ | ❌ | ❌ |
| Transaction Detail | ❌ | ❌ | ❌ | ❌ | ✅ |
| Settings | ❌ | ❌ | ✅ | ❌ | ❌ |

---

## 18. Quick Reference - Screen Purposes

| Screen | Purpose | Entry Points | Exit Points |
|--------|---------|--------------|-------------|
| **Splash** | Branded loading | App launch | Auto → Tutorial |
| **Tutorial** | Feature education | From Splash | Skip/Continue → Onboarding |
| **Onboarding** | Account setup | From Tutorial | Complete → Home, Skip → Home |
| **Home** | Main dashboard | Onboarding, Bottom Nav, Success | Bottom Nav, Quick Actions |
| **Send** | Initiate payment | Home, Bottom Nav, QR scan | Confirm, Back |
| **Request** | Request payment | Home Quick Action | Generate QR, Back |
| **Confirm** | Review transaction | Send flow | Success, Back |
| **Success** | Transaction complete | Confirm flow | Done → Home, Details |
| **QR Scanner** | Scan QR codes | Home QR icon, Send | Send (pre-filled), Back |
| **Activity** | Transaction history | Bottom Nav | Transaction Detail, Bottom Nav |
| **Transaction Detail** | Full transaction info | Activity, Home feed | Back |
| **Settings** | Account management | Bottom Nav | Various settings, Bottom Nav |

---

## Design System Notes

### Color Palette
- **Void Black** (#050505) - Primary background
- **Monad Purple** (#836EF9) - Primary brand color
- **Electric Cyan** (#4FFFFF) - Accent color
- **Success Green** (#10B981) - Positive actions
- **Error Red** (#EF4444) - Negative actions

### Typography
- **Space Grotesk** - Numbers and amounts
- **Inter** - UI text and labels
- **JetBrains Mono** - Handles (@username) and addresses

### Key UI Elements
- **Glassmorphism** - Cards and overlays (backdrop-blur)
- **Matrix Rain** - Background animation on Onboarding
- **Gradient Buttons** - Purple to Cyan gradients
- **Rounded Corners** - 3xl radius (24px) for main elements
- **Smooth Transitions** - Spring animations (300ms stiffness)

---

**Total Screens:** 11 (Splash, Tutorial, Onboarding, Home, Send, Request, Confirm, Success, QR Scanner, Activity, Transaction Detail, Settings)

**Total User Flows:** 6+ major journeys

**Navigation Methods:** 5 types (Bottom Nav, Quick Actions, Back, Flow-Based, Deep Links)

**Design Philosophy:** Consumer-friendly Web3 with social payments UX, hiding blockchain complexity while leveraging Monad's speed and low fees.
