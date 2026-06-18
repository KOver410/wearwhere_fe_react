# WEARWHERE MOBILE APP - UX/UI DESIGN PROMPT DOCUMENT

## Comprehensive Figma Design Specification for iOS & Android

---

## 1. PROJECT OVERVIEW

### 1.1 Product Summary

WearWhere is a fashion discovery and e-commerce platform. This document defines the complete UX/UI design specification for the **consumer-facing mobile application** (iOS & Android). The app covers shopping, social fashion content (OOTD), virtual wardrobe management, store locator, and personalized style recommendations. Admin and Brand portals remain web-only.

### 1.2 Target Platforms

- **iOS**: iPhone SE (375pt) through iPhone 16 Pro Max (430pt). Design at 390x844pt (iPhone 14/15 standard).
- **Android**: 360x800dp baseline, responsive up to 412x915dp.
- Support Dynamic Island / notch / gesture navigation.

### 1.3 Design Language

- **Style**: Clean, minimal, product-first. Photography as the main visual element. High contrast, image-centric. No gradients, no heavy effects.
- **Feel**: Modern fashion-forward yet accessible. Generous whitespace. Subtle shadows only on interactive cards.
- **Bilingual**: Full EN/VI support. Vietnamese is default. All text elements must account for string length variation (~30% longer in Vietnamese).

### 1.4 Brand Logo & Assets

**Logo goc (Original Logo)**
Logo chinh cua WearWhere la file PNG duoc luu trong du an web tai duong dan:

```
figma:asset/80e96fc2cdc554ebf44dc26a8edeb9829e3445b2.png
```

**Cach lay logo tu du an web hien tai:**

1. Mo du an web WearWhere trong Figma Make / code editor
2. Tim file logo tai bat ky component nao sau day (deu import cung 1 file logo):
   - `/src/app/components/Header.tsx`
   - `/src/app/components/Footer.tsx`
   - `/src/app/components/auth/AuthLayout.tsx`
   - `/src/app/pages/onboarding/OnboardingLayout.tsx`
3. Export file logo PNG tu du an hoac copy truc tiep tu cac file tren

**Dac diem logo:**

- **Dinh dang**: PNG, nen trong suot (transparent background)
- **Mau goc**: Logo mau den (#0A0A0A) tren nen trong suot
- **Bien the can tao trong Figma cho mobile app:**

| Bien the            | Mau logo        | Nen            | Su dung                                 |
| ------------------- | --------------- | -------------- | --------------------------------------- |
| Primary (Dark)      | #0A0A0A (den)   | Nen trang/sang | Header, Auth screens, Onboarding        |
| Inverted (Light)    | #FFFFFF (trang) | Nen toi        | Splash screen nen den, bottom sheet toi |
| Monochrome Gray     | #6A7282 (xam)   | Bat ky         | Watermark, footer, secondary placement  |
| Compact / Icon-only | Rut gon chu "W" | Bat ky         | App icon, favicon, tab bar brand mark   |

**Kich thuoc khuyen nghi cho mobile:**

- **Splash screen**: logo chieu rong 180-200px, can giua man hinh
- **Top App Bar / Header**: logo chieu cao 28-32px, can trai hoac can giua
- **Auth screens** (Login/Register): logo chieu cao 40-48px, can giua phia tren
- **Onboarding**: logo chieu cao 32px, goc tren trai
- **App Icon** (iOS & Android): tao bien the icon-only (chu "W" hoac bieu tuong rut gon), kich thuoc 1024x1024px cho App Store va Play Store

**Luu y quan trong:**

- Luon giu ti le goc cua logo (aspect ratio lock), KHONG keo gian
- Khoang cach toi thieu xung quanh logo (clear space) = chieu cao logo x 0.5
- Tren nen toi (vi du: splash screen den, dark mode), ap dung hieu ung `brightness(0) invert(1)` hoac su dung bien the logo trang
- Logo khong duoc nho hon chieu cao 20px tren bat ky man hinh nao

---

## 2. DESIGN SYSTEM & TOKENS

### 2.1 Typography

- **Font Family**: Arimo (Google Fonts) - available on both platforms
- **Scale** (mobile-optimized):
  - Display / Hero: 32px, Bold (700)
  - H1 / Page Title: 28px, Bold (700)
  - H2 / Section Title: 22px, Bold (700)
  - H3 / Card Title: 18px, Bold (700)
  - H4 / Subtitle: 16px, Bold (700)
  - Body Large: 16px, Regular (400)
  - Body: 14px, Regular (400)
  - Caption / Label: 12px, Regular (400)
  - Overline / Tag: 10px, Bold (700), UPPERCASE, tracking +1px
- **Line Heights**: 1.4 for body text, 1.2 for headings

### 2.2 Color Palette

**Backgrounds**
| Token | Hex | Usage |
|-------|-----|-------|
| bg-primary | #FFFFFF | Cards, modals, sheets |
| bg-secondary | #F9FAFB | Page backgrounds, input fields |
| bg-tertiary | #F3F4F6 | Tags, chips, placeholders |
| bg-warm | #F8F7F4 | Alternate page backgrounds |

**Text**
| Token | Hex | Usage |
|-------|-----|-------|
| text-primary | #0A0A0A | Headings, primary content |
| text-secondary | #4A5565 | Descriptions, secondary info |
| text-muted | #6A7282 | Captions, timestamps, hints |
| text-white | #FFFFFF | On dark/colored backgrounds |

**Accent & Status**
| Token | Hex | Usage |
|-------|-----|-------|
| accent-primary | #0A0A0A | Primary CTAs, active states |
| accent-orange | #F54900 | Price highlights, sale badges, trending |
| accent-green | #10B981 | Success, in-stock, active status |
| accent-red | #E7000B | Sale price, errors, destructive actions |
| accent-blue | #3B82F6 | Links, info states |

**Borders**
| Token | Hex | Usage |
|-------|-----|-------|
| border-light | #E5E7EB | Card borders, dividers |
| border-default | #D1D5DC | Input borders, separators |

### 2.3 Spacing Scale

Base unit: 4px
Scale: 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48px

- Card internal padding: 16px
- Section vertical spacing: 24px
- Screen horizontal padding: 16px (compact) / 20px (standard)
- Safe area: respect iOS safe area insets (top: 59px with Dynamic Island, bottom: 34px)

### 2.4 Border Radius

| Token       | Value  | Usage                            |
| ----------- | ------ | -------------------------------- |
| radius-xs   | 4px    | Small thumbnails                 |
| radius-sm   | 8px    | Chips, small badges              |
| radius-md   | 10px   | Buttons, inputs, small cards     |
| radius-lg   | 14px   | Cards, modals                    |
| radius-xl   | 16px   | Bottom sheets, large containers  |
| radius-full | 9999px | Avatars, pills, circular buttons |

### 2.5 Shadows

- **Card**: `0px 1px 3px rgba(0,0,0,0.08), 0px 1px 2px rgba(0,0,0,0.06)`
- **Elevated / Sheet**: `0px 10px 25px rgba(0,0,0,0.12), 0px 4px 6px rgba(0,0,0,0.08)`
- **Bottom Tab Bar**: `0px -1px 8px rgba(0,0,0,0.06)`

### 2.6 Component Library

**Buttons**

- Primary: Black (#0A0A0A) bg, white text, 10px radius, height 48px, full-width on mobile
- Secondary: Transparent bg, 2px black border, 10px radius, height 48px
- Tertiary/Text: No bg, text-only with padding
- Small: Height 36px, 8px radius, 14px font
- Icon Button: 44x44px touch target minimum, 10px radius
- Pill/Tag: bg-tertiary, 9999px radius, 12px font, padding 6px 12px
- FAB (Floating Action Button): 56x56px, circular, shadow-elevated, accent-orange bg

**Inputs**

- Text Input: height 48px, 10px radius, border-default, 16px padding, 14px font
- Search Input: with left Search icon, height 44px, bg-secondary
- Textarea: min-height 100px, 10px radius
- Select/Dropdown: 48px height, right chevron indicator

**Cards**

- Product Card: image (aspect 3:4), 14px radius, shadow-card on hover/press
- OOTD Card: image (aspect 4:5 or 1:1), avatar overlay, engagement stats
- Brand Card: logo + name + product count
- Store Card: image, name, distance, rating

**Navigation**

- Bottom Tab Bar: 5 tabs, 44px icon area, active state with filled icon + accent text
- Top App Bar: 56px height, back arrow, title centered, right action icons
- Segmented Control: pill-style toggle for view modes
- Chips/Filters: horizontal scroll, 36px height, 9999px radius

**Overlays**

- Bottom Sheet: drag handle (40x4px, radius-full, bg-tertiary), radius-xl top corners
- Modal: centered, radius-lg, max 90% width, backdrop blur
- Toast/Snackbar: bottom-positioned, 60px from bottom tab, radius-md, auto-dismiss 3s
- Action Sheet: iOS-style grouped options from bottom

**Feedback**

- Skeleton Loading: bg-tertiary with shimmer animation
- Pull-to-Refresh: custom spinner with WearWhere branding
- Empty State: illustration + title + description + CTA button
- Error State: red accent, retry button

---

## 3. APP ARCHITECTURE & NAVIGATION

### 3.1 Bottom Tab Bar (5 tabs)

```
[ Home ]  [ Shop ]  [ OOTD ]  [ Wardrobe ]  [ Profile ]
```

- **Home** (icon: Home) - Discovery feed, hero banners, recommendations
- **Shop** (icon: ShoppingBag) - Browse, categories, search, filters
- **OOTD** (icon: Camera) - Social fashion feed, create post - CENTER TAB with special styling
- **Wardrobe** (icon: Shirt/Hanger) - Virtual wardrobe, outfit builder
- **Profile** (icon: User) - Account, orders, settings

### 3.2 Screen Flow Map

```
SPLASH SCREEN
    |
ONBOARDING (first launch only)
    |-- Welcome/Intro (3 swipeable slides)
    |-- Style Preferences (multi-select grid)
    |-- Price Range (range slider)
    |-- Size & Location (form inputs)
    |-- Complete (success + enter app)
    |
AUTH FLOW (if not logged in)
    |-- Login (email/password + social login)
    |-- Register (email/password + social)
    |-- Forgot Password
    |-- Reset Password
    |-- Verify Email (OTP code input)
    |-- Email Verified (success)
    |
MAIN APP (5 Tab Navigation)
    |
    |-- TAB 1: HOME
    |     |-- Hero Banner Carousel
    |     |-- Style Categories Row
    |     |-- Trending Products Grid
    |     |-- New Arrivals
    |     |-- Flash Sale Section
    |     |-- Brand Spotlight
    |     |-- Recommended For You
    |     |-- OOTD Picks
    |
    |-- TAB 2: SHOP
    |     |-- Search Bar (top)
    |     |-- Category Tabs (horizontal scroll)
    |     |-- Filter & Sort Bar
    |     |-- Product Grid (2-col)
    |     |-- Filter Bottom Sheet
    |     |   |-- Price Range
    |     |   |-- Brands (multi-select)
    |     |   |-- Sizes
    |     |   |-- Colors
    |     |   |-- Style Tags
    |     |   |-- Rating
    |     |-- Sort Bottom Sheet
    |     |-- Product Detail Page
    |     |   |-- Image Gallery (swipeable)
    |     |   |-- Product Info
    |     |   |-- Size Selector
    |     |   |-- Color Selector
    |     |   |-- Add to Cart / Buy Now
    |     |   |-- Reviews Section
    |     |   |-- Related Products
    |     |   |-- Brand Info
    |     |   |-- Store Availability
    |     |-- Search Results Page
    |     |   |-- Recent Searches
    |     |   |-- Search Suggestions
    |     |   |-- Results Grid
    |     |-- All Brands Page
    |     |   |-- A-Z Index
    |     |   |-- Brand Cards Grid
    |     |-- Brand Storefront Page
    |     |   |-- Brand Header/Banner
    |     |   |-- Product Tabs/Categories
    |     |   |-- Products Grid
    |     |-- Style/Collection Page
    |     |   |-- Style Banner
    |     |   |-- Curated Products
    |     |-- Vouchers Page
    |     |   |-- Available Vouchers List
    |     |   |-- Saved Vouchers
    |     |   |-- Voucher Detail Modal
    |
    |-- TAB 3: OOTD (Social Fashion Feed)
    |     |-- Feed (vertical scroll, Instagram-style)
    |     |   |-- Post Card (image, avatar, caption, tags)
    |     |   |-- Like, Comment, Save, Share actions
    |     |   |-- Product Tags (tap to see tagged products)
    |     |-- Create Post (FAB or header action)
    |     |   |-- Camera / Gallery picker
    |     |   |-- Tag Products (search & pin on image)
    |     |   |-- Write Caption
    |     |   |-- Select Style Tags
    |     |   |-- Post Preview
    |     |-- Post Detail Page
    |     |   |-- Full Image
    |     |   |-- Tagged Products List
    |     |   |-- Comments Thread
    |     |   |-- Like/Save/Share
    |     |-- User Public Profile
    |     |   |-- Avatar, Bio, Stats
    |     |   |-- Posts Grid
    |     |   |-- Follow/Unfollow
    |
    |-- TAB 4: WARDROBE
    |     |-- My Wardrobe (gallery view)
    |     |   |-- Category Filter (horizontal chips)
    |     |   |-- Search within wardrobe
    |     |   |-- Grid/List Toggle
    |     |   |-- Item Cards (image, name, brand, worn count)
    |     |   |-- Sort (recent, most worn, favorites)
    |     |   |-- Stats Bar (total items, categories, brands)
    |     |-- Add Item
    |     |   |-- Camera Capture / Photo Library
    |     |   |-- Auto-Categorize (AI suggestion)
    |     |   |-- Manual Category/Details
    |     |   |-- Link to purchased product
    |     |-- Outfit Builder
    |     |   |-- Canvas with drop zones (top, bottom, shoes, accessory)
    |     |   |-- Item picker from wardrobe per zone
    |     |   |-- Save Outfit
    |     |   |-- Share to OOTD
    |     |-- Style Suggestions (AI)
    |     |   |-- AI-generated outfit combos from user's wardrobe
    |     |   |-- Swipe to like/skip
    |     |   |-- "Shop the missing piece" CTA
    |
    |-- TAB 5: PROFILE / ACCOUNT
    |     |-- Profile Overview
    |     |   |-- Avatar, Name, Bio
    |     |   |-- Stats (orders, posts, followers)
    |     |   |-- Quick Links Grid
    |     |-- My Orders
    |     |   |-- Order Tabs (All, Processing, Shipped, Delivered, Cancelled)
    |     |   |-- Order Cards (image, status badge, total)
    |     |   |-- Order Detail
    |     |   |   |-- Status Timeline
    |     |   |   |-- Items List
    |     |   |   |-- Shipping Info
    |     |   |   |-- Payment Summary
    |     |   |   |-- Return Request Button
    |     |-- My Returns
    |     |   |-- Return Cards with status
    |     |   |-- Return Request Form
    |     |-- My OOTDs
    |     |   |-- Grid of user's posts
    |     |   |-- Edit/Delete options
    |     |-- Wishlist
    |     |   |-- Product grid with remove action
    |     |   |-- Move to Cart action
    |     |-- Notifications
    |     |   |-- Tabbed: All, Orders, Social, Promotions
    |     |   |-- Push notification cards
    |     |   |-- Read/Unread states
    |     |-- Address Book
    |     |   |-- Saved addresses list
    |     |   |-- Add/Edit address form
    |     |   |-- Default address toggle
    |     |-- Payment Methods
    |     |   |-- Saved cards list
    |     |   |-- Add new card
    |     |   |-- E-wallet connections
    |     |-- Settings
    |     |   |-- Language Toggle (EN/VI)
    |     |   |-- Notification Preferences
    |     |   |-- Privacy Settings
    |     |   |-- Theme (Light/Dark - if applicable)
    |     |   |-- About / Terms / Privacy Policy
    |     |   |-- Delete Account
    |     |   |-- Logout
    |
    |-- CART & CHECKOUT (accessible from any screen via header icon)
    |     |-- Cart
    |     |   |-- Item list with qty stepper
    |     |   |-- Swipe-to-delete
    |     |   |-- Voucher code input
    |     |   |-- Price Summary
    |     |   |-- Checkout CTA (sticky bottom)
    |     |-- Checkout
    |     |   |-- Shipping Address (select/add)
    |     |   |-- Shipping Method
    |     |   |-- Payment Method (select/add)
    |     |   |-- Voucher Applied
    |     |   |-- Order Summary
    |     |   |-- Place Order CTA
    |     |-- Order Success
    |     |   |-- Success Animation
    |     |   |-- Order Number
    |     |   |-- Estimated Delivery
    |     |   |-- Continue Shopping / View Order
    |
    |-- STORE LOCATOR (accessible from Home or Shop)
    |     |-- Map View (full screen with bottom sheet list)
    |     |-- List View
    |     |-- Store pins on map
    |     |-- Store Detail
    |     |   |-- Photos carousel
    |     |   |-- Address, Hours, Contact
    |     |   |-- Available Brands
    |     |   |-- Directions (open in Maps app)
    |     |   |-- Product availability check
    |
    |-- INFO PAGES
    |     |-- About Us
    |     |-- How It Works
    |     |-- Become a Seller (Partner page)
```

---

## 4. DETAILED SCREEN SPECIFICATIONS

### 4.1 SPLASH SCREEN

- Full screen, centered WearWhere logo (black on white)
- Subtle fade-in animation (0.3s)
- Minimum display: 1.5s
- Transition: fade to Onboarding or Home

### 4.2 ONBOARDING FLOW (4 screens + welcome)

**Welcome Slides (3 slides, swipeable)**

- Full-bleed fashion photography background
- White text overlay with semi-transparent black gradient at bottom
- Slide 1: "Discover Your Style" / Large fashion image
- Slide 2: "Shop Smart" / Product browsing illustration
- Slide 3: "Share Your OOTD" / Social fashion content
- Page indicator dots at bottom
- "Get Started" button on last slide
- "Skip" text button top-right on all slides

**Style Preferences (Step 1/4)**

- Progress bar at top (25%)
- Title: "What's your style?"
- Subtitle: "Select styles you like. We'll personalize your feed."
- 2x3 grid of style cards (Streetwear, Minimalist, Vintage, Casual, Luxury, Sporty)
- Each card: full-bleed image (aspect 3:4), style name overlay, checkmark when selected
- Multiple selection allowed
- Bottom: "Skip" (text) + "Next" (primary button)

**Price Range (Step 2/4)**

- Progress bar (50%)
- Title: "What's your budget?"
- Price range cards or dual-thumb slider
- Ranges: Under 500K, 500K-1M, 1M-2M, 2M-5M, 5M+ (VND)
- Visual price indicator

**Size & Location (Step 3/4)**

- Progress bar (75%)
- Title: "Almost there!"
- Size selectors: Top size (XS-XXL chips), Bottom size (XS-XXL chips), Shoe size (numeric)
- Location: City/Province dropdown
- Gender: Male / Female / Non-binary chips

**Complete (Step 4/4)**

- Progress bar (100%)
- Success checkmark animation (Lottie)
- "You're all set!"
- Personalization summary
- "Start Exploring" primary CTA

### 4.3 AUTH SCREENS

**Login**

- WearWhere logo at top center
- "Welcome Back" title
- Email input field
- Password input field (with show/hide toggle)
- "Forgot Password?" text link
- "Sign In" primary button (full-width)
- Divider: "or continue with"
- Social login buttons row: Google, Apple, Facebook
- Bottom: "Don't have an account? Sign Up" link
- No Header/Footer - standalone screen

**Register**

- Logo + "Create Account" title
- Full Name input
- Email input
- Password input (with strength indicator: weak/medium/strong)
- Confirm Password input
- Terms checkbox: "I agree to Terms & Privacy Policy"
- "Create Account" primary button
- Social login options
- Bottom: "Already have an account? Sign In"

**Forgot Password**

- Back arrow top-left
- Lock icon illustration
- "Forgot Password?" title
- "Enter your email to receive a reset link" subtitle
- Email input
- "Send Reset Link" primary button

**Reset Password**

- New Password input (with strength indicator)
- Confirm Password input
- "Reset Password" primary button

**Verify Email**

- Mail icon illustration
- "Verify Your Email" title
- "We sent a code to [email]"
- 6-digit OTP input (individual boxes)
- "Verify" primary button
- "Resend Code" text link with countdown timer (60s)

**Email Verified**

- Success checkmark animation
- "Email Verified!" title
- "Your account is ready to use"
- "Continue" primary button -> Onboarding

### 4.4 HOME TAB

**Layout**: Vertical scroll, full-width sections

**Top App Bar**

- Left: WearWhere logo (compact, ~28px height)
- Right: Search icon, Notification bell (with red dot badge), Cart icon (with count badge)

**Section 1: Hero Banner Carousel**

- Full-width, aspect 16:9 or 2:1
- Auto-scroll with page indicator dots
- Tap to navigate to campaign/collection page
- 3-5 banners: seasonal campaigns, new arrivals, flash sale

**Section 2: Category Shortcuts**

- Horizontal scroll row
- Circular icons (56x56) with labels below
- Categories: Women, Men, Kids, Shoes, Bags, Accessories, Sale
- Active state: accent ring around icon

**Section 3: Flash Sale / Trending**

- Section header: "Flash Sale" with countdown timer + "See All" link
- Horizontal scroll product cards (compact: image 120x160, name, price, sale price, discount badge)
- Sale price in #E7000B, original price strikethrough

**Section 4: New Arrivals**

- Section header: "New Arrivals" + "See All"
- 2-column product grid (first 4-6 items)
- Product card: image (aspect 3:4), brand name (caption), product name, price
- Heart icon for wishlist (top-right corner of image)

**Section 5: Style Picks / Recommended For You**

- Section header: "For You" + "See All"
- Based on user's style preferences
- Horizontal scroll or 2-column grid
- Personalization indicator: "Based on your style preferences"

**Section 6: OOTD Picks**

- Section header: "Style Inspiration" + "See All"
- Horizontal scroll of OOTD preview cards
- Card: square image, avatar overlay (bottom-left), like count
- Tap to open OOTD detail or feed

**Section 7: Brand Spotlight**

- Section header: "Featured Brands" + "See All"
- Horizontal scroll brand cards
- Card: brand logo/image (square, 100x100), brand name, product count

**Section 8: Store Near You**

- Section header: "Stores Near You" + "See All"
- Horizontal scroll store cards
- Card: store image, name, distance, rating

### 4.5 SHOP TAB

**Top Section**

- Sticky search bar at top (tap to expand into full search screen)
- Category chips horizontal scroll below search (Women, Men, Kids, All, etc.)

**Filter & Sort Bar** (sticky below categories)

- Left: Filter button with active filter count badge
- Right: Sort dropdown (button)
- Layout toggle (grid 2-col / list view)

**Product Grid**

- 2-column grid, 12px gap
- Infinite scroll with loading skeleton
- Product card components:
  - Image: aspect 3:4, radius-md, bg-tertiary placeholder
  - Wishlist heart button (top-right, floating)
  - Brand name (caption, muted)
  - Product name (body, 2-line truncate)
  - Price (body, bold), Sale price in red + original strikethrough
  - Rating stars (small) + review count (optional)

**Filter Bottom Sheet** (slides up from bottom)

- Drag handle at top
- Scrollable content:
  - Price Range: dual-thumb slider with value labels
  - Categories: multi-select chip list
  - Brands: searchable multi-select list with checkboxes
  - Sizes: chip grid (XS, S, M, L, XL, XXL)
  - Colors: color circle selector grid
  - Style Tags: chip list (Minimalist, Streetwear, etc.)
  - Rating: star rating minimum selector
- Sticky bottom: "Reset" (text) + "Show N Results" (primary button with count)

**Sort Bottom Sheet**

- Options: Relevance, Price Low-High, Price High-Low, Newest, Most Popular, Rating
- Radio-style selection
- Dismiss on selection

**Search Screen** (full-screen overlay on search tap)

- Auto-focus search input with clear button
- Recent Searches section (with individual clear + clear all)
- Trending Searches (tag chips)
- As-you-type suggestions list
- Results: product cards grid (same as Shop grid)

### 4.6 PRODUCT DETAIL PAGE

**Layout**: Scrollable, sticky bottom CTA bar

**Image Gallery**

- Full-width swipeable image carousel
- Page indicator dots
- Pinch-to-zoom support
- Image counter (1/5) badge

**Product Info Section**

- Brand name (tappable, navigates to brand page)
- Product name (H2)
- Rating: stars + review count + "See reviews" link
- Price: bold, large. If on sale: sale price in red, original strikethrough, discount percentage badge

**Options**

- Color selector: circular color swatches, selected with check overlay + border
- Size selector: chip/pill buttons, unavailable sizes grayed out
- Size guide link (opens bottom sheet with size chart table)

**Description**

- Expandable/collapsible text section
- "Read More" toggle
- Material, care instructions as icon+text rows

**Reviews Section**

- Overall rating display (large star + number + distribution bars)
- Top 2-3 reviews inline
- "See All Reviews" button
- Each review: avatar, name, rating stars, date, text, helpful count

**Related Products**

- Horizontal scroll product cards
- "You may also like"

**Brand Info Strip**

- Brand logo (small circle) + name + "Visit Store" button
- Product count

**Store Availability**

- "Available in stores" section
- List of nearby stores with stock status
- "Check another store" link

**Sticky Bottom Bar**

- Left: Wishlist heart button (outlined/filled toggle)
- Center/Right: "Add to Cart" (primary, 60% width) or "Buy Now" (if applicable)
- Quantity already in cart indicator

### 4.7 OOTD TAB (Social Fashion Feed)

**Feed Layout**: Instagram-style vertical scroll

**Top App Bar**

- "OOTD" title (left-aligned, H3)
- Right: Create post icon (Camera+), Search icon

**Feed Post Card**

- User row: avatar (36px circle) + username (bold) + time + follow button + more menu (...)
- Image: full-width, aspect 4:5 (tappable for product tags overlay)
- Product tags: floating bubbles on image, tap to reveal product mini-card
- Action row: Like (heart), Comment (message), Share (send), Save (bookmark) - aligned left, save right
- Like count: "Liked by [user] and 234 others"
- Caption: username (bold) + caption text, truncated to 2 lines + "more"
- Style tags: horizontal chip row (e.g., #Streetwear #CasualFriday)
- Comments preview: 1-2 recent comments + "View all N comments"

**Create Post Flow** (Multi-step sheet or full screen)

1. Photo Selection: camera capture or gallery grid picker, crop tool (1:1, 4:5, free)
2. Tag Products: tap on image to place tag pins, search products to link
3. Caption & Tags: text input for caption, style tag selector chips
4. Preview: full preview of post before publishing
5. Post: "Share" button -> success toast

**Post Detail Page**

- Full image with product tags overlay
- All tagged products listed below image as horizontal scroll cards
- Full caption display
- Full comments thread with reply support
- Like/Save/Share actions

**User Public Profile**

- Cover photo / header area
- Avatar (80px), display name, username, bio
- Stats row: Posts | Followers | Following
- Follow/Following button
- Tab bar: Posts (grid) | OOTDs (list)
- Posts grid: 3-column, square thumbnails

### 4.8 WARDROBE TAB

**My Wardrobe Main**

- Stats summary bar: N items | N categories | N brands | N favorites
- Action row: "Add Item" button + filter/search icons
- Category filter: horizontal scroll chips (All, Tops, Bottoms, Outerwear, Dresses, Shoes, Bags, Accessories)
- Sort selector: Recent, Most Worn, Favorites
- Item Grid: 3-column or 2-column toggle
  - Item thumbnail (square, radius-md)
  - Heart icon for favorite
  - Name (1-line truncate)
  - Brand name (caption)
  - Worn count badge
- FAB button bottom-right: "+" to add new item

**Add Item Screen**

- Photo source: Camera / Photo Library buttons
- Image preview with crop
- Form:
  - Category (dropdown/picker)
  - Item Name
  - Brand (searchable dropdown)
  - Color selector
  - Size
  - Season tags (chips)
  - Notes (optional)
  - "Link to Purchase" toggle (search purchased products)
- "Save" primary button

**Outfit Builder**

- Canvas/preview area showing outfit assembly
- Category zones: Top, Bottom, Shoes, Accessories (horizontally scrollable per zone)
- Per zone: horizontal scroll of wardrobe items from that category
- Tap to select, tap again to deselect
- Preview updates in real-time
- Bottom actions: "Save Outfit" + "Share to OOTD"
- Saved outfits gallery section

**Style Suggestions (AI)**

- Card stack / swipe interface (Tinder-like)
- AI-generated outfit combination from user's wardrobe items
- Assembled outfit preview image
- Item details below
- Swipe right to save, left to skip
- "Shop the missing piece" CTA if outfit needs an item not in wardrobe
- "Refresh" for new suggestions

### 4.9 PROFILE TAB

**Profile Overview**

- User avatar (80px, circle, editable)
- Display name + username
- Bio (editable)
- Stats: Orders | Posts | Followers | Following
- "Edit Profile" button

**Quick Links Grid** (2x4 or list)

- My Orders
- My Returns
- My OOTDs
- Wishlist
- Notifications
- Address Book
- Payment Methods
- Vouchers
- Settings

**My Orders**

- Tab bar: All | Processing | Shipped | Delivered | Cancelled
- Order card:
  - Order number + date
  - First product image thumbnail + "and N more items"
  - Total price
  - Status badge (color-coded)
  - "View Details" action
- Empty state for each tab

**Order Detail**

- Status: visual timeline (Placed -> Confirmed -> Shipped -> Delivered)
- Current status highlighted with green
- Items list: image + name + variant + qty + price per item
- Shipping info: address, tracking number (tappable to copy), carrier
- Payment summary: subtotal, shipping, discount, total
- Actions: "Return Item" button (if eligible), "Buy Again", "Review"

**Return Request**

- Select items to return (checkbox per item)
- Return reason dropdown
- Photo upload (evidence)
- Additional notes textarea
- "Submit Return" button

**My Returns**

- Return cards with status badge
- Status: Pending | Approved | Rejected | Completed

**Notifications**

- Segmented tabs: All | Orders | Social | Promotions
- Notification card: icon + title + body + timestamp
- Unread indicator (blue dot)
- Swipe to dismiss/mark read

**Address Book**

- Address cards: name, phone, full address, default badge
- Edit/Delete actions per card
- "Add New Address" CTA
- Add/Edit form: full name, phone, street, city, district, ward, zip, default toggle

**Payment Methods**

- Saved cards: masked number, expiry, card brand icon (Visa/Mastercard)
- E-wallets: MoMo, ZaloPay, VNPay icons
- "Add Payment Method" CTA
- Default indicator

**Settings**

- Grouped list:
  - Language: EN / VI toggle
  - Notifications: push notification preferences (toggles)
  - Privacy: profile visibility, data sharing
  - Appearance: Light / Dark (optional)
  - About WearWhere
  - Terms of Service
  - Privacy Policy
  - Help & Support
  - Delete Account (destructive, with confirmation dialog)
  - Log Out (destructive)

### 4.10 CART & CHECKOUT

**Cart Screen** (accessible via cart icon from any screen)

- Navigation: back arrow + "Cart" title + item count
- Item list:
  - Product image (72x96, radius-md)
  - Product name, variant (color, size)
  - Price (bold)
  - Quantity stepper (- / count / +)
  - Swipe left to reveal "Remove" action (red)
- Voucher input section: text input + "Apply" button, applied voucher shown as tag
- Order Summary:
  - Subtotal
  - Shipping (estimated)
  - Discount
  - Total (H3, bold)
- Sticky bottom: "Checkout (N items)" primary button

**Checkout Screen**

- Sections in vertical scroll:
  1. Shipping Address: selected address card + "Change" link
  2. Shipping Method: radio options (Standard, Express) with price and ETA
  3. Payment Method: selected payment card/wallet + "Change" link
  4. Voucher: applied voucher or "Add voucher" link
  5. Order Items: collapsed list, expandable
  6. Price Breakdown: subtotal, shipping, discount, VAT, total
- Sticky bottom: "Place Order - [total]" primary button
- Terms text: "By placing this order, you agree to our Terms"

**Order Success**

- Full-screen success state
- Checkmark animation (Lottie or custom)
- "Order Placed!" H1
- Order number (#WW-XXXXX)
- Estimated delivery date
- Two buttons: "View Order" (primary) + "Continue Shopping" (secondary)

### 4.11 STORE LOCATOR

**Map View** (default)

- Full-screen map (Google Maps / Apple Maps SDK)
- Store location pins with WearWhere marker style
- Floating search bar at top
- Bottom sheet (half-screen, draggable):
  - List of nearby stores
  - Store card: image (small), name, distance, rating, open/closed status
  - Tap card to expand detail or navigate to store detail
- "List View" toggle button

**List View**

- Full-screen scrollable store list
- Filter by: distance, brands available, open now
- Store card: same as bottom sheet card but larger

**Store Detail**

- Photo carousel at top
- Store name, rating, open status badge
- Address (tappable for Maps direction)
- Business hours (expandable, highlight today)
- Phone (tappable to call)
- Available brands: horizontal scroll brand chips
- "Get Directions" primary button (opens Maps app with directions)

### 4.12 BRAND PAGES

**All Brands Page**

- Search bar at top
- Alphabetical section headers (A, B, C...)
- Right-side A-Z quick index (tappable letters)
- Brand card: logo (square, 56px) + name + product count + verified badge
- Tap to open Brand Storefront

**Brand Storefront**

- Brand banner/hero image (full-width, aspect 3:1)
- Brand logo (overlapping banner, 64px circle, white border)
- Brand name + verified badge + follower count
- "Follow" button
- Category tab bar (All, Shirts, Pants, etc.)
- Product grid (2-col) - same card component as Shop

### 4.13 VOUCHERS PAGE

- Tabs: Available | My Vouchers (saved/claimed)
- Voucher card:
  - Left accent bar (color based on type: red for sale, orange for brand, green for free shipping)
  - Discount value (large, bold)
  - Conditions (min order, valid dates)
  - "Save" / "Use Now" button
  - Expiry date
- Voucher detail bottom sheet: full terms, applicable products/brands

---

## 5. MOBILE-SPECIFIC INTERACTIONS & PATTERNS

### 5.1 Gestures

- **Swipe left on cart item**: reveal delete action
- **Swipe between tabs**: navigate between bottom tab views
- **Pull to refresh**: all list/feed screens
- **Pinch to zoom**: product images, OOTD photos
- **Double tap**: like OOTD post (with heart animation)
- **Long press**: product card for quick actions (add to wishlist, share)
- **Drag down**: dismiss bottom sheet/modal

### 5.2 Haptic Feedback

- Light haptic on: tab switch, toggle, button press
- Medium haptic on: add to cart, like action
- Heavy haptic on: delete, order placed

### 5.3 Animations

- **Page transitions**: horizontal slide (push/pop)
- **Bottom sheets**: spring physics slide up
- **Like**: heart icon scale + color animation
- **Add to cart**: product image flies to cart icon trajectory
- **Skeleton loading**: shimmer gradient animation
- **Pull to refresh**: custom spinner rotation
- **Success states**: checkmark draw + confetti (subtle)
- **Tab switch**: crossfade (150ms)

### 5.4 Loading States

- Skeleton screens for all content areas (match layout structure)
- Inline loading spinners for actions (buttons show spinner, disable interaction)
- Progressive image loading: blur-up technique (low-res -> high-res)

### 5.5 Error Handling

- Network error: full-screen state with retry button + illustration
- Empty results: contextual illustration + helpful message + action CTA
- Form validation: inline error messages below fields, red border
- API errors: toast notification at bottom

### 5.6 Offline Behavior

- Cache last viewed home feed, wishlist, cart
- Show cached content with "You're offline" banner at top
- Queue actions (add to wishlist, cart) for sync when online

---

## 6. ACCESSIBILITY REQUIREMENTS

- All interactive elements: minimum 44x44pt touch target
- Color contrast: WCAG 2.1 AA minimum (4.5:1 for text, 3:1 for large text)
- VoiceOver/TalkBack labels for all interactive elements
- Reduce Motion: respect system setting, disable animations
- Dynamic Type (iOS) / Font Scaling (Android): support up to 200% text scale
- Focus indicators for keyboard/switch control navigation
- Alt text for all product images and OOTD photos

---

## 7. FIGMA DELIVERABLES CHECKLIST

### 7.1 Pages to Create in Figma

1. **Cover Page**: project info, version, date
2. **Design System**: all tokens, components, variants
3. **Splash & Onboarding**: 6 screens
4. **Auth Flow**: 6 screens
5. **Home Tab**: 1 long-scroll screen + component states
6. **Shop Tab**: 4 screens (browse, search, filters, sort)
7. **Product Detail**: 1 long-scroll screen + bottom sheets
8. **OOTD Feed**: 3 screens (feed, create flow, detail)
9. **OOTD Profile**: 1 screen
10. **Wardrobe**: 4 screens (main, add item, outfit builder, AI suggestions)
11. **Profile/Account**: 10 screens
12. **Cart & Checkout**: 3 screens
13. **Store Locator**: 3 screens (map, list, detail)
14. **Brands**: 2 screens (list, storefront)
15. **Vouchers**: 1 screen + bottom sheet
16. **Info Pages**: 3 screens (About, How It Works, Partner)
17. **States**: loading, empty, error, offline for key screens
18. **Notifications**: 1 screen

**Total: ~50-55 unique screens**

### 7.2 Component Library

- Buttons (all variants & states)
- Inputs (text, search, OTP, textarea, dropdown)
- Cards (product, OOTD post, order, store, brand, voucher, notification)
- Navigation (bottom tab bar, top app bar, segmented control)
- Bottom Sheets (filter, sort, size guide, voucher detail)
- Badges & Tags (status, discount, category, style)
- Avatar (sizes: 24, 36, 48, 64, 80)
- Rating (star display + interactive)
- Image Gallery (carousel with indicators)
- Skeleton (matching each card/layout type)
- Empty States (illustrations + text + CTA)
- Toast/Snackbar
- Dialog/Alert
- Quantity Stepper

### 7.3 Prototype Flows (Interactive)

1. Onboarding -> Auth -> Home (happy path)
2. Browse -> Product Detail -> Add to Cart -> Checkout -> Success
3. OOTD Feed -> Create Post -> Published
4. Wardrobe -> Outfit Builder -> Share to OOTD
5. Profile -> My Orders -> Order Detail -> Return Request

### 7.4 Responsive Variants

- iPhone SE (375pt) - compact
- iPhone 14/15 (390pt) - standard (primary design)
- iPhone 16 Pro Max (430pt) - large
- Android baseline (360dp)

---

## 8. DESIGN NOTES & PRINCIPLES

### 8.1 Key Design Principles

1. **Thumb-friendly**: Primary actions within thumb reach zone (bottom 60% of screen)
2. **Progressive disclosure**: Show essentials first, details on demand
3. **Visual hierarchy**: Product images > price > brand > details
4. **Consistent patterns**: Same interaction pattern for similar actions across the app
5. **Performance perception**: Skeleton loading, optimistic updates, smooth animations

### 8.2 Differences from Web Version

- **No horizontal navigation bar**: replaced by bottom tab bar
- **No sidebar**: full-screen views with back navigation
- **No hover states**: replaced by press/active states
- **Simplified filters**: bottom sheet instead of sidebar panel
- **Single-column layouts**: most content flows vertically
- **Bottom-anchored CTAs**: primary actions as sticky bottom buttons
- **Native behaviors**: pull-to-refresh, swipe actions, haptic feedback
- **Camera integration**: native camera for OOTD posting and wardrobe items

### 8.3 i18n Considerations

- All UI strings must have EN/VI variants
- Vietnamese text is ~30% longer - verify no truncation in compact areas
- Currency: VND format (e.g., 450.000d) with dot as thousand separator
- Date format: dd/MM/yyyy for Vietnamese, MMM dd, yyyy for English
- Language toggle accessible from Settings + onboarding

---

_Document Version: 1.0_
_Created: February 24, 2026_
_Platform: iOS & Android Mobile Application_
_Design Tool: Figma_