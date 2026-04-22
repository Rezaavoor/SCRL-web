# SCRL Web

A simplified, desktop web version of the canvas from the [SCRL mobile apps](https://apps.apple.com/se/app/scrl-photo-collage-maker/id1289057196?l=en-GB). Built as a prototype that lets you drop photos onto an infinite, zoomable workspace and manipulate them with move / resize / rotate handles.

**Live demo:** [rezaavoor.github.io/SCRL-web](https://rezaavoor.github.io/SCRL-web/)

## Features

- **Scrollable & zoomable canvas** — pan with drag, zoom with scroll or trackpad pinch. Zoom is anchored to the mouse pointer.
- **Photo upload** — pick images from your computer via the toolbar.
- **Selection model** — click a photo to select it, click empty canvas to deselect.
- **Move / resize / rotate** — drag the photo to move, use corner handles to resize, and the top handle to rotate.

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for dev server and build
- [Jotai](https://jotai.org/) for atomic state management
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- ESLint for linting

## Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) (the repo ships a `pnpm-lock.yaml`)

### Install

```bash
pnpm install
```

### Run the dev server

```bash
pnpm dev
```

Then open the printed URL (usually `http://localhost:5173`).

### Other scripts

```bash
pnpm build     # type-check and produce a production build in dist/
pnpm preview   # serve the production build locally
pnpm lint      # run ESLint over the repo
```
## Project Structure

```
src/
├── App.tsx                 # App root, mounts Canvas + Toolbar
├── main.tsx                # React entry point
├── index.css               # Tailwind entry + global styles
├── types.ts                # Shared domain types (PhotoItem, Viewport, Vec2)
├── state/
│   └── atoms.ts            # Jotai atoms (photos, selection, viewport)
├── lib/
│   ├── geometry.ts         # Vector / transform math helpers
│   └── photo.ts            # Photo loading utilities
└── components/
    ├── Canvas.tsx          # Pan / zoom viewport; renders photos
    ├── Toolbar.tsx         # Upload + canvas actions
    ├── Photo.tsx           # A single photo on the canvas
    ├── SelectionFrame.tsx  # Selection outline wrapper
    ├── ResizeHandle.tsx    # Resize handle
    ├── RotateHandle.tsx    # Rotation handle
    └── DeleteHandle.tsx    # Delete handle
```