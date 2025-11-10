# YoPrint Anime Search Application

A modern anime search application built with React, TypeScript, and Material-UI.

## 🚀 Features

- Real-time anime search with debouncing
- Detailed anime information pages
- Responsive design for all screen sizes
- Pagination support
- Smart image loading with fallbacks

## ✨ Bonus Implementations

### 1. Creative UI with Light and Dark Mode

A comprehensive theme system with smooth transitions between light and dark modes.

**Features:**
- Theme toggle button (top-right corner)
- Persists user preference in localStorage
- Respects system color scheme on first load
- CSS variable-based theming system
- Glassmorphism effects with backdrop blur
- Gradient backgrounds and glowing shadows
- Custom typography (Poppins, Orbitron)

**Key Files:**
- `src/components/ThemeToggle.tsx`
- `src/index.css`
- `src/App.tsx`

---

### 2. Filter and Sort Function by Rating, Name, and Time

Advanced filtering and sorting capabilities for finding anime.

**Sort Options:**
- Rating: High to Low / Low to High
- Name: A-Z / Z-A
- Time: Newest First / Oldest First (by release year)

**Filter Features:**
- Genre filtering with multi-select chips
- Real-time filtering and sorting
- Search autocomplete suggestions
- Clear filters button

**Key Files:**
- `src/components/FilterBar.tsx`
- `src/pages/SearchPage.tsx` (lines 159-197)

---

### 3. Grid and List View

Two view modes for customizing the browsing experience.

**Grid View:**
- Responsive grid layout (1-4 columns)
- Card-based design with hover effects
- Image-focused display with rating badges
- Staggered animations

**List View:**
- Horizontal layout with larger thumbnails
- Detailed information with synopsis preview
- Genre tags visible
- Slide-in hover animations

**Key Files:**
- `src/components/FilterBar.tsx` (view toggle)
- `src/pages/SearchPage.tsx` (rendering logic)

---

### 4. Creative Empty State Handling

Thoughtful empty states for different scenarios.

**Empty State Types:**
1. **Initial State**: Welcome message when first visiting
2. **No Results**: Shown when search returns zero results
3. **Filtered Out**: Shown when filters exclude all results

**Features:**
- Contextual messaging and icons
- Action buttons (Clear Filters, Try Different Search)
- Animated emoji icons and decorative elements
- Glassmorphism design with gradient text
- Smart display logic that prevents showing during loading

**Key Files:**
- `src/components/EmptyState.tsx`
- `src/pages/SearchPage.tsx` (display logic)

---

### 5. Mobile Responsive Design

Fully responsive design that adapts seamlessly across all device sizes using Material-UI's breakpoint system.

**Responsive Breakpoints:**
- **xs (Mobile)**: < 600px - Single column layouts, stacked components
- **sm (Tablet)**: ≥ 600px - 2 columns in grid view, improved spacing
- **md (Desktop)**: ≥ 900px - 3-4 columns in grid view, side-by-side layouts
- **lg (Large Desktop)**: ≥ 1200px - Maximum 4 columns, optimal spacing

**Responsive Features:**
- **Grid Layout**: Adapts from 1 column (mobile) to 4 columns (desktop)
- **Typography**: Font sizes scale responsively (e.g., `fontSize: { xs: '2rem', md: '3rem' }`)
- **Pagination**: Stacks vertically on mobile, horizontal on larger screens
- **Filter Bar**: Collapsible design optimized for mobile screens
- **Detail Page**: Image and content stack on mobile, side-by-side on desktop
- **Touch-Friendly**: Adequate spacing and button sizes for mobile interaction

**Key Files:**
- `src/pages/SearchPage.tsx` (responsive grid: xs={12} sm={6} md={4} lg={3})
- `src/pages/DetailPage.tsx` (responsive layout: xs={12} md={4/8})
- `src/components/Pagination.tsx` (flexDirection: { xs: 'column', sm: 'row' })

---

## 🛠️ Technology Stack

- React 18, TypeScript
- Material-UI (MUI)
- Redux Toolkit
- React Router
- Vite
- Jikan API

## 📦 Installation

```bash
npm install
npm run dev
```

## 📝 Project Structure

```
src/
├── components/    # UI components
├── pages/         # Page components
├── store/         # Redux store
├── services/      # API services
├── types/         # TypeScript types
└── utils/         # Utilities
```
