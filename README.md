# 🏎️ Fast F1 Live Dashboard

> A real-time Formula 1 dashboard built with modern web technologies, providing live timing, driver details, and race insights.

![F1 Dashboard](https://img.shields.io/badge/F1-Live%20Dashboard-red?style=for-the-badge&logo=formula1)
![Deno](https://img.shields.io/badge/Deno-2.0-black?style=for-the-badge&logo=deno)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![HTMX](https://img.shields.io/badge/HTMX-2.0-purple?style=for-the-badge)

## ✨ Features

### 🏁 Live Timing & Positions
- **Real-time driver positions** with automatic updates every 2 seconds
- **Live gap intervals** showing time differences between drivers
- **Dynamic position changes** with smooth transitions
- **Intelligent fallback system** for handling API inconsistencies

### 🎯 Interactive Driver Details
- **Click any driver** to view detailed information
- **Driver statistics** including position, gap, lap times, and speed
- **Team colors and branding** for visual identification
- **Real-time telemetry** data (speed, DRS status, gear, throttle)

### 📊 Dashboard Stats
- **Current race leader** with team information
- **Fastest lap times** across all drivers
- **Lap progress tracking** with completion percentage
- **Total active drivers** count

### 🌤️ Session Information
- **Live weather conditions** (air & track temperature)
- **Track status indicators** with flag colors (green/yellow/red/safety)
- **Session details** (event, circuit, location)
- **Race control messages** and notifications

### ⚙️ Customizable Settings
- **Adjustable refresh intervals** (1-10 seconds)
- **Auto-scroll options** for following race leader
- **Sound alerts** for position changes
- **Fullscreen mode** for immersive viewing

## 🛠️ Tech Stack

### Backend
- **🦕 Deno 2.0** - Modern JavaScript/TypeScript runtime
- **🔥 Hono** - Fast, lightweight web framework
- **📡 OpenF1 API** - Official Formula 1 live data source
- **💾 In-memory caching** - Smart data caching with fallbacks

### Frontend
- **⚡ HTMX** - Dynamic HTML updates without JavaScript frameworks
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🏔️ Alpine.js** - Minimal JavaScript framework for interactions
- **📱 Responsive Design** - Mobile-first, works on all devices

### Architecture
- **🏗️ Component-based** - Modular TSX components
- **🔄 Real-time updates** - Live data streaming with HTMX
- **🛡️ Error handling** - Graceful degradation and fallbacks
- **📈 Performance optimized** - Efficient caching and data processing

## 🚀 Quick Start

### Prerequisites
- **Deno 2.0+** installed on your system
- **Internet connection** for accessing OpenF1 API

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fast-f1.git
   cd fast-f1
   ```

2. **Install dependencies** (handled automatically by Deno)
   ```bash
   deno task start
   ```

3. **Open your browser**
   ```
   http://localhost:8000/live
   ```

## 📁 Project Structure

```
fast-f1/
├── 🏗️ core/                    # Core application infrastructure
│   ├── layouts/                # Page layouts and templates
│   ├── middleware/             # Request/response middleware
│   ├── services/               # Shared services
│   ├── types/                  # TypeScript type definitions
│   ├── ui/                     # Reusable UI components
│   └── utils/                  # Utility functions
├── 🎯 features/                # Feature-specific modules
│   ├── live_dashboard/         # Live F1 dashboard feature
│   │   ├── services/           # Dashboard-specific services
│   │   │   ├── live_dashboard.service.ts
│   │   │   └── openf1.service.ts
│   │   └── views/              # Dashboard UI components
│   │       ├── components/     # Reusable dashboard components
│   │       └── LiveDashboardPage.tsx
│   ├── schedule_meetings/      # Meeting scheduling feature
│   └── session_results/        # Race results feature
├── 🌐 public/                  # Static assets
│   └── images/                 # Image assets
├── 📋 deno.json               # Deno configuration
├── 🔒 deno.lock               # Dependency lock file
├── 🚀 main.ts                 # Application entry point
└── 📖 README.md               # This file
```

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Custom port (default: 8000)
PORT=3000

# Optional: API timeout (default: 10000ms)
API_TIMEOUT=15000
```

### Dashboard Settings
Access settings via the ⚙️ gear icon in the top-right corner:

- **Refresh Interval**: 1-10 seconds (default: 2s)
- **Auto-scroll**: Follow race leader automatically
- **Sound Alerts**: Audio notifications for position changes
- **Fullscreen**: Immersive viewing mode

## 📡 API Integration

### OpenF1 API
The dashboard integrates with the official OpenF1 API to provide:

- **Live driver positions** and timing data
- **Real-time telemetry** (speed, DRS, gear, throttle)
- **Session information** and weather conditions
- **Race control messages** and flag status

### Data Flow
```
OpenF1 API → Caching Layer → Data Processing → HTMX Updates → UI
```

### Fallback System
- **Primary**: Live OpenF1 data
- **Secondary**: Cached valid data
- **Tertiary**: Mock data for development

## 🎨 UI Components

### Live Timing Table
- **Two-column layout** for optimal space usage
- **Color-coded status indicators** (green/yellow/red)
- **Real-time telemetry** display
- **Clickable driver rows** for detailed information

### Driver Details Panel
- **Comprehensive driver information**
- **Team branding and colors**
- **Performance metrics** and statistics
- **Smooth animations** and transitions

### Session Info Panel
- **Compact session details**
- **Weather information**
- **Track status with visual indicators**
- **Real-time updates**

## 🔄 Real-time Features

### Auto-refresh System
- **Configurable intervals** (1-10 seconds)
- **Smart caching** to reduce API calls
- **Error handling** with graceful degradation
- **Performance optimization** for smooth updates

### Data Validation
- **Position data validation** to handle API inconsistencies
- **Fallback mechanisms** for missing data
- **Intelligent caching** of last valid positions
- **Comprehensive error logging**

## 🚀 Performance

### Optimization Features
- **3-second caching** for API responses
- **Efficient data processing** with Maps for O(1) lookups
- **Minimal DOM updates** with HTMX
- **Lazy loading** of non-critical components

---

<div align="center">

**🏎️ Built with ❤️ for Formula 1 fans worldwide 🏁**

[⭐ Star this repo](https://github.com/yourusername/fast-f1) • [🐛 Report Bug](https://github.com/yourusername/fast-f1/issues) • [💡 Request Feature](https://github.com/yourusername/fast-f1/issues)

</div>