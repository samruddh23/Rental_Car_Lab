# Agent Instructions

## Project

- This is a React 19 + Vite app using Tailwind CSS 3 through PostCSS.
- The main UI is in `src/App.jsx`; shared state and data fetching live in `src/CarContext.jsx` and `src/useFetchCars.js`.
- Tailwind directives are in `src/index.css`, which is imported by `src/main.jsx`.
- `src/App.css` contains leftover Vite starter styles and is not imported by the current entry point. Do not assume edits there affect the rendered app.
- Keep styling consistent with the existing Tailwind utility-first approach unless a global rule or reusable component style is clearly needed.

## CSS Validation

For CSS or Tailwind changes:

1. Confirm the changed stylesheet is on the active import path from `src/main.jsx`.
2. Check `tailwind.config.js` content globs whenever adding or changing utility classes. The content list must include the files where classes are used, especially `src/**/*.{js,jsx,ts,tsx}`; an empty list can make production CSS omit utilities.
3. Run `npm run build` to exercise Vite, PostCSS, Autoprefixer, and Tailwind in production mode.
4. Run `npm run lint` for JSX and JavaScript issues related to the change. This project has no dedicated CSS linter or test script.
5. For layout or responsive changes, use `npm run dev` and inspect desktop and mobile widths in the browser after the build passes.

Prefer semantic, complete Tailwind class names over dynamically assembled class fragments that Tailwind cannot detect at build time. Avoid unrelated formatting changes and preserve the existing component boundaries.

## Useful Commands

- `npm run dev` - start the Vite development server
- `npm run build` - validate the production build and generated CSS
- `npm run lint` - run Oxlint
- `npm run preview` - serve the production build locally

See [README.md](README.md) for the baseline Vite project documentation.
