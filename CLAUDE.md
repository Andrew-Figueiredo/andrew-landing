# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static personal landing page for Andrew Figueiredo. No build system, no framework, no package manager — just three files served directly in a browser. Content is in Brazilian Portuguese (pt-BR).

## Running Locally

Open `index.html` directly in a browser, or serve it with any static HTTP server:

```bash
python -m http.server 8000
# or
npx serve .
```

No build step required.

## Architecture

Three files make up the entire site:

- **`index.html`** — Single-page layout with sections: header/nav, hero, metrics, about (`#sobre`), focus (`#foco`), rhythm (`#ritmo`)
- **`styles.css`** — All styling (~400 lines). Design tokens live as CSS custom properties at the top of the file
- **`script.js`** — Three self-contained features: animated particle canvas (hero), metric counter animation (scroll-triggered), and mouse-tracking glow on the canvas

### CSS Design Tokens

All colors and key values are defined as CSS variables on `:root`:

| Variable | Value | Role |
|---|---|---|
| `--bg` | `#0f1115` | Dark navy background |
| `--accent` | `#ff7a1a` | Orange primary accent |
| `--accent-soft` | `#ffd166` | Golden soft accent |
| `--cool` | `#69e2ff` | Cyan highlight |
| `--text` | `#f5f1e8` | Warm white text |
| `--muted` | `#bcb4a7` | Warm gray secondary text |

### Responsive Breakpoints

- `980px` — hero switches from 2-column grid to single column
- `640px` — metric/about grids collapse to 1 column

### JavaScript Features

- **Particle canvas** (`<canvas id="signal-canvas">`) — 42 nodes on desktop, 28 on mobile; uses `requestAnimationFrame` with physics bounce and proximity-based connection lines
- **Metric counters** — triggered by `IntersectionObserver`; animates from 0 to target value over 1.1s with cubic ease-out
- **Pointer glow** — tracks `mousemove` over the canvas to update particle opacity/glow via a radial gradient

## Key Conventions

- **No external JS dependencies** — keep it vanilla; Google Fonts CDN is the only external resource
- **All layout via CSS Grid/Flexbox** — no positioning hacks
- **Glassmorphism panels** use `backdrop-filter: blur(...)` + semi-transparent `background`; check browser support before adding new ones
- **Animations use `requestAnimationFrame` and `IntersectionObserver`** — avoid `setInterval`/`setTimeout` for visual effects
