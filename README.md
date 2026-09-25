# Portfolio V2

**Interactive developer portfolio.**

A personal site built to demonstrate range across UI/UX design, full-stack engineering, and 3D/motion work — not a template with swapped-in project cards.

<br/>

<img src="./assets/hero-placeholder.svg" width="100%" alt="Portfolio V2 hero" />

<br/>

## Live Site

**[mudra-kar-portfolio-g46m.vercel.app →](https://mudra-kar-portfolio-g46m.vercel.app)**

<br/>

## Preview

<table width="100%">
<tr>
<td width="50%"><img src="./assets/screenshot-placeholder.svg" width="100%" alt="Home" /><br/><sub align="center">Home</sub></td>
<td width="50%"><img src="./assets/screenshot-placeholder.svg" width="100%" alt="Aether scene" /><br/><sub align="center">Aether 3D scene</sub></td>
</tr>
</table>

<br/>

## About

Built as a single-page application (React + Vite), routed with `wouter`, and structured around a set of narrative sections rather than a flat project grid.

<br/>

## Projects

Project detail is presented through a modal (`ProjectModal.tsx`) rather than a separate page per project, keeping the scroll experience uninterrupted.

<br/>

## Motion Design

Framer Motion drives section transitions and micro-interactions; **Lenis** handles smooth scrolling site-wide.

<br/>

## Three.js

A custom 3D layer (`src/three/AetherScene.tsx`) — built on React Three Fiber, Drei, and postprocessing — renders a persistent background scene with custom shaders and environment lighting, not a stock Three.js example.

<br/>

## Photography

Not yet a dedicated section — see [Roadmap](#roadmap).

<br/>

## Contact

The contact form sends through **EmailJS** directly from the client (`src/sections/Contact.tsx`) — no backend required.

<br/>

## Folder Structure

```
portfolio-v2/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── pages/
│   │   ├── Portfolio.tsx
│   │   └── Studio.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Journey.tsx
│   │   ├── Manifesto.tsx
│   │   ├── Skills.tsx
│   │   ├── Systems.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectModal.tsx
│   │   ├── HowIWork.tsx
│   │   ├── Experiments.tsx
│   │   ├── Snapshot.tsx
│   │   └── Contact.tsx
│   ├── three/
│   │   ├── AetherScene.tsx
│   │   ├── SceneLayer.tsx
│   │   ├── environment/
│   │   ├── scenes/
│   │   └── shaders/
│   ├── components/
│   ├── hooks/
│   └── lib/
└── public/
```

<br/>

## Tech Stack

`Vite` · `React 19` · `TypeScript` · `Three.js` · `React Three Fiber` · `Drei` · `Framer Motion` · `Tailwind CSS 4` · `Lenis` · `EmailJS`

<br/>

## Setup

```bash
git clone https://github.com/Samudra-GITHub/samudra-kar-portfolio.git
cd samudra-kar-portfolio
npm install
npm run dev
```

<br/>

## Environment Variables

```bash
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Required only for the contact form to actually send mail — the rest of the site runs without them.

<br/>

## Roadmap

- [x] Hero, About, Journey, Manifesto, Skills, Systems, Projects sections
- [x] Custom Three.js Aether scene with shaders
- [x] EmailJS-powered contact form
- [ ] Dedicated photography section
- [ ] Studio page expansion

<br/>

## License

MIT — see [LICENSE](./LICENSE).

<br/>

<sub>Part of the Sams Studio product ecosystem. See the [profile](https://github.com/Samudra-GITHub) for the full lineup.</sub>
