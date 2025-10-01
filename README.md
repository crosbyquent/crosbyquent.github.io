# Mechanical Engineering Portfolio (Static, React via CDN)

This folder is ready to upload to **any static host** (GitHub Pages, Netlify, Vercel Static, S3, etc.).
No build step needed — it uses CDN scripts for React, Tailwind, and Framer Motion.

## How to use
1. Open `app.js` and update:
   - Your name/title in the header.
   - The `projects` array (6 items). Add your own images, slugs, tags, and blog content.
2. Upload the entire folder to your host.
3. The app uses **hash routing** (`#/project/<slug>`), so it works on static hosting without custom rewrites.

## Local preview
Just open `index.html` in your browser (double-click).

## Files
- `index.html` — page shell and CDN scripts
- `app.js` — the site code (React without build tooling)
- `assets/logo.svg` — simple gear logo (replace with your logo)

## Notes
- Tailwind is loaded via the CDN for simplicity. For production optimization, you can later migrate to a build pipeline.
- If your images are large, consider downscaling for page speed.
