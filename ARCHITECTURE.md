# Fast F1 - Modular Architecture

## Overview
This project has been refactored to follow a modular, component-based architecture with Alpine.js animations and better separation of concerns.

## Project Structure

```
fast-f1/
├── core/                           # Core application infrastructure
│   ├── layouts/                    # Layout components
│   │   └── MainLayout.tsx         # Main application layout
│   ├── ui/                        # Reusable UI components
│   │   ├── Card.tsx               # Animated card component
│   │   ├── Button.tsx             # Interactive button component
│   │   ├── StatCard.tsx           # Statistics display component
│   │   └── index.ts               # UI components exports
│   ├── services/                  # Core services
│   ├── types/                     # TypeScript type definitions
│   ├── utils/                     # Utility functions
│   └── middleware/                # Application middleware
├── features/                      # Feature-based modules
│   └── live_dashboard/            # Live dashboard feature
│       ├── services/              # Feature-specific services
│       │   └── live_dashboard.service.ts  # Data and business logic
│       ├── views/                 # View components
│       │   ├── components/        # Feature-specific components
│       │   │   ├── DashboardHeader.tsx    # Dashboard header
│       │   │   ├── StatsGrid.tsx          # Statistics grid
│       │   │   ├── LiveTimingTable.tsx    # Live timing table
│       │   │   ├── SidePanel.tsx          # Side panel with session info
│       │   │   └── DriverRow.tsx          # Individual driver row
│       │   └── LiveDashboardPage.tsx      # Main page component
│       └── live_dashboard.routes.tsx      # Feature routes
└── main.ts                       # Application entry point
```

## Key Improvements

### 1. Modular Components
- **Reusable UI Components**: `Card`, `Button`, `StatCard` in `core/ui/`
- **Feature Components**: Specific to live dashboard functionality
- **Separation of Concerns**: Each component has a single responsibility

### 2. Service Layer
- **LiveDashboardService**: Handles all data logic and mock data
- **Type Safety**: Proper TypeScript interfaces for all data structures
- **Business Logic**: Centralized data processing and utilities

### 3. Alpine.js Animations
- **Intersection Observer**: Components animate in when they become visible
- **Hover Effects**: Subtle hover animations on interactive elements
- **Staggered Animations**: Sequential animations for better visual flow
- **Loading States**: Enhanced skeleton loading with animations

### 4. Animation Features

#### Component Animations
- **Fade In**: Components fade in when scrolled into view
- **Slide In**: Elements slide in from different directions
- **Scale Effects**: Hover effects with subtle scaling
- **Staggered Loading**: Sequential animation delays for lists

#### Interactive Elements
- **Button Press**: Scale down effect on button press
- **Card Hover**: Lift and scale effect on card hover
- **Row Hover**: Background change and scale on driver row hover
- **Status Indicators**: Pulsing animations for non-green status

## Technology Stack

- **Deno**: Runtime environment
- **Hono**: Web framework
- **HTMX**: Dynamic content updates
- **Alpine.js**: Reactive UI and animations
- **Tailwind CSS**: Styling and responsive design
- **TypeScript**: Type safety

## Component Usage Examples

### Using Core UI Components

```tsx
import { Card, Button, StatCard } from "../../core/ui/index.ts";

// Card with hover animation
Card({
  children: html`<p>Content</p>`,
  hover: true,
  padding: "md"
})

// Button with click animation
Button({
  variant: "primary",
  size: "md",
  children: "Click me",
  onClick: "handleClick()"
})

// Stat card with intersection animation
StatCard({
  title: "Current Leader",
  value: "VER",
  subtitle: "Red Bull Racing",
  icon: html`<path...>`,
  iconColor: "blue"
})
```

### Alpine.js Animation Patterns

```html
<!-- Intersection Observer Animation -->
<div 
  x-data="{ isVisible: false }"
  x-intersect="isVisible = true"
  x-show="isVisible"
  x-transition:enter="transition ease-out duration-500"
  x-transition:enter-start="opacity-0 transform translate-y-8"
  x-transition:enter-end="opacity-100 transform translate-y-0"
>
  Content
</div>

<!-- Hover Animation -->
<div 
  x-data="{ isHovered: false }"
  @mouseenter="isHovered = true"
  @mouseleave="isHovered = false"
  :class="{ 'transform scale-105': isHovered }"
  class="transition-all duration-200"
>
  Hoverable content
</div>

<!-- Staggered Animation -->
<div 
  x-data="{ delay: ${index * 100} }"
  x-transition:enter="transition ease-out duration-300"
  style="transition-delay: var(--delay, ${index * 100}ms)"
>
  List item
</div>
```

## Benefits

1. **Maintainability**: Smaller, focused components are easier to maintain
2. **Reusability**: Core UI components can be used across features
3. **Testability**: Individual components can be tested in isolation
4. **Performance**: Better code splitting and lazy loading opportunities
5. **Developer Experience**: Clear structure and type safety
6. **User Experience**: Smooth animations and responsive interactions

## Future Enhancements

- Add more reusable UI components (Modal, Dropdown, etc.)
- Implement proper state management for complex interactions
- Add unit tests for components and services
- Create a component library documentation
- Add more sophisticated animations and transitions
- Implement proper error boundaries and loading states 