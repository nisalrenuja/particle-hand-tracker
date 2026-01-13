# Particle Hand Tracker

An interactive 3D particle visualization system controlled by hand gestures. Built with Next.js, React, Three.js, and MediaPipe Hands.

## Features

- **Real-time Hand Tracking**: Uses MediaPipe Hands for accurate 21-point hand landmark detection
- **Gesture Recognition**: Detects 6 different hand gestures
- **3D Particle Effects**: 10,000 particles morph between shapes using Three.js WebGL
- **Cyberpunk Aesthetic**: Dark theme with neon cyan and pink accents
- **Type-Safe**: 100% TypeScript with comprehensive type definitions
- **Error Handling**: Graceful error boundaries and resource cleanup
- **Modular Architecture**: Clean separation of concerns with hooks and services

## Supported Gestures

| Gesture | Formation | Effect |
|---------|-----------|--------|
| 👍 Thumbs Up | Thumb raised, all fingers down | **BLAST!** - Particles scatter explosively |
| ☝️ Index | Only index finger raised | **Hello** - Particles form the word "Hello" |
| ✌️ Peace | Index + middle fingers raised | **Gemini** - Particles form the word "Gemini" |
| 🤟 Three Fingers | Index + middle + ring raised | **නියමයි** (Great in Sinhala) |
| ✋ Open Palm | 4+ fingers raised | **Sphere** - Golden rotating sphere formation |
| ✊ Closed Fist | No fingers raised | **ආයුබෝවන්** (Ayubowan - Sinhala greeting) |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Webcam for hand tracking
- Modern browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/particle-hand-tracker.git
cd particle-hand-tracker

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and allow webcam access.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues
npm run type-check   # Run TypeScript compiler checks
```

## Architecture

### Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ErrorBoundary.tsx # Error boundary wrapper
│   ├── ParticleHandTracker.tsx  # Main orchestration component (137 lines)
│   ├── ThreeCanvas.tsx   # Three.js canvas container
│   ├── VideoFeed.tsx     # Webcam video feed
│   └── ui/               # UI components
│       ├── CyberpunkBorder.tsx
│       ├── GestureDisplay.tsx
│       ├── PhysicsDisplay.tsx
│       └── StatusDisplay.tsx
├── config/
│   └── constants.ts      # Configuration constants
├── hooks/                # Custom React hooks
│   ├── useGestureDetection.ts
│   ├── useHandTracking.ts
│   ├── useMediaPipeScripts.ts
│   ├── useParticleSystem.ts
│   ├── useThreeScene.ts
│   └── useThrottle.ts
├── services/
│   └── GestureRecognizer.ts  # Gesture detection service
├── types/                # TypeScript type definitions
│   ├── mediapipe.d.ts    # MediaPipe types
│   └── shapes.ts         # Shape and gesture types
└── utils/                # Utility functions
    ├── geometry/
    │   ├── shapeGenerators.ts
    │   └── textRenderer.ts
    └── math/
        └── interpolation.ts
```

### Key Components

#### Hooks

- **useMediaPipeScripts** - Manages MediaPipe CDN script loading
- **useHandTracking** - Initializes MediaPipe Hands and Camera
- **useGestureDetection** - Analyzes landmarks to recognize gestures
- **useThreeScene** - Sets up Three.js scene, camera, and renderer
- **useParticleSystem** - Manages particle geometry and shape morphing
- **useThrottle** - Throttles values to prevent excessive updates

#### Services

- **GestureRecognizer** - Encapsulates gesture detection logic with confidence scoring

#### Utilities

- **Geometry** - Shape generation (sphere, scatter, text rendering)
- **Math** - Interpolation functions (lerp, lerpColor, lerpVector3)

### Data Flow

```
Webcam → MediaPipe → Landmarks → GestureRecognizer → Shape
                                                         ↓
                            Particles ← Three.js ← ParticleSystem
```

## Configuration

All configuration is centralized in `src/config/constants.ts`:

```typescript
// Customize particle count, colors, animation speeds, etc.
export const PARTICLE_CONFIG = {
  COUNT: 10000,
  SIZE: 1.2,
  OPACITY: 0.9,
};

export const ANIMATION_CONFIG = {
  DEFAULT_LERP_FACTOR: 0.05,
  SCATTER_LERP_FACTOR: 0.1,
  COLOR_LERP_FACTOR: 0.05,
};
```

## Technologies

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript 5** - Type-safe development
- **Three.js** - 3D graphics and WebGL
- **MediaPipe Hands** - Hand tracking ML model
- **Tailwind CSS 4** - Utility-first styling

## Performance

- **60 FPS** target frame rate
- **10,000 particles** with smooth animations
- **~100ms** gesture detection throttling
- Efficient resource cleanup (no memory leaks)
- WebGL hardware acceleration

## Type Safety

- Zero `@ts-ignore` comments
- Comprehensive type definitions for MediaPipe
- Strict TypeScript configuration
- Type-safe prop interfaces

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (limited MediaPipe support)

Requires:
- WebGL support
- Webcam access
- ES2017+ JavaScript

## Troubleshooting

### Camera not starting
- Allow webcam permissions in browser
- Check browser console for errors
- Ensure webcam is not in use by another application

### Low FPS / Performance issues
- Reduce particle count in `constants.ts`
- Close other browser tabs
- Check GPU acceleration is enabled

### Gestures not recognized
- Ensure good lighting
- Keep hand centered in camera view
- Make clear, distinct finger positions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- MediaPipe Hands by Google
- Three.js community
- Next.js team
