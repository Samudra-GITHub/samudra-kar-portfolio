# Contributing to Portfolio V2

This is a personal portfolio site, so scope is intentionally narrow — but fixes and improvements are welcome.

## Getting set up

```bash
git clone https://github.com/Samudra-GITHub/samudra-kar-portfolio.git
cd samudra-kar-portfolio
npm install
npm run dev
```

The contact form needs EmailJS credentials to actually send mail — see [README](./README.md#environment-variables). Everything else runs without them.

## Before opening a PR

```bash
npm run typecheck
npm run build
```

Both must pass.

## Scope

- 3D/shader changes belong in `src/three/`.
- Narrative content sections belong in `src/sections/`.
- Keep new dependencies minimal — this site should stay fast.

## Reporting issues

Use the issue templates under `.github/ISSUE_TEMPLATE/`.
