# Samudra Kar, Portfolio

> An interactive single-page portfolio with a persistent WebGL scene, procedural sound and a narrative section flow.

## Overview

A personal site for an AI engineer, UI/UX designer and frontend developer, built to show range rather than fill a template with project cards. It is a React + Vite single-page app, routed with `wouter`, organised as a sequence of narrative sections. A "world shell" keeps the background grid, WebGL reconstruction field, cursor and sound alive across routes, so navigating never tears the environment down.

**Live site:** [mudra-kar-portfolio-g46m.vercel.app](https://mudra-kar-portfolio-g46m.vercel.app)

## Features

- **Narrative sections**: Hero, About, Journey, Manifesto, Skills, Systems, Projects, How I Work, Experiments, Snapshot and Contact
- **Projects in a modal** (`ProjectModal`), so the scroll is never interrupted by page loads
- **Studio page** at `/studio`
- **Persistent 3D layer** built with React Three Fiber, Drei and postprocessing, with custom shaders (point field, scan grid), a node network and a reconstruction field
- **Adaptive quality**: a device-tier hook (`low` / `medium` / `high`) scales particle counts and drops expensive post-processing on weaker devices
- **Procedural audio**: all sound is synthesised at runtime with the Web Audio API, muted by default and started only by the toggle
- **Motion**: Framer Motion for transitions, Lenis for smooth scrolling, custom cursor and magnetic buttons, with reduced-motion support
- **Contact form** sending directly from the browser through EmailJS
- Downloadable resume (`public/resume.pdf`)

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | React 19, TypeScript, Vite 7, `wouter` routing |
| Styling | Tailwind CSS v4, `tw-animate-css` |
| 3D | Three.js, React Three Fiber, Drei, `@react-three/postprocessing` |
| Motion | Framer Motion, Lenis |
| Email | EmailJS (client-side) |

## Project Structure

```
samudra-kar-portfolio/
├── index.html
├── public/                 # resume.pdf, forest-background.jpg
├── src/
│   ├── main.tsx  App.tsx   # Entry and world shell (routes: /, /studio)
│   ├── pages/              # Portfolio, Studio
│   ├── sections/           # Hero ... Contact, ProjectModal, studio/
│   ├── three/              # SceneLayer, AetherScene, environment/, scenes/, shaders/
│   ├── components/         # Navigation, Preloader, CustomCursor, SoundToggle, ...
│   ├── hooks/              # Device tier, reduced motion, section progress, ...
│   ├── lib/                # data.ts (content), audio.ts (procedural audio)
│   └── index.css
├── assets/                 # README placeholder graphics
├── vite.config.ts          # "@" alias to src/, dev server on :5173
└── package.json
```

## Getting Started

Requires Node.js and npm.

```bash
git clone https://github.com/Samudra-GITHub/samudra-kar-portfolio.git
cd samudra-kar-portfolio
npm install
npm run dev          # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run build` | Production build |
| `npm run preview` | Preview the build |
| `npm run typecheck` | Type-check with `tsc --noEmit` |

## Configuration

Copy `.env.example` to `.env` to enable the contact form. The rest of the site works without it.

| Variable | Purpose |
| --- | --- |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |

These are bundled into the client build, so use only the public key from EmailJS.

## Architecture

`App.tsx` wraps all routes in a `WorldShell` that mounts the preloader, cursor, background, `SceneLayer` and sound once. Page content swaps inside it. Project and copy content lives in `src/lib/data.ts`. The 3D layer reads the device tier from `useDeviceTier` to pick density and effects.

## Deployment

No deployment configuration file is included. The project is a static Vite build and the live site is hosted on Vercel.

## Screenshots

`assets/` holds placeholder graphics only, so no screenshots are shown.

## Future Improvements

- A dedicated photography section
- Expand the Studio page
- Replace placeholder graphics with real screenshots

## License

MIT, see [LICENSE](LICENSE).
