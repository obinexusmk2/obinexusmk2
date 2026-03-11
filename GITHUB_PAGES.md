# GitHub Pages deployment

This repository now deploys to GitHub Pages using `.github/workflows/deploy-pages.yml`.

## What gets published
- `/` → `obinexus.org/public/index.html`
- `/oha/` → `oha.obinexus.org/public/index.html`
- `/iwu/` → `iwu.obinexus.org/public/index.html`
- `/iji/` → `iji.obinexus.org/public/index.html`
- `/assets/` → `obinexus.org/public/assets`
- `/shared/styles/` → `shared/styles`

## Enable in GitHub
1. Push to `main`.
2. In **Repository Settings → Pages**, set **Source** to **GitHub Actions**.
3. (Optional, for custom domain) create a `CNAME` file in repo root (for example: `obinexus.org`). The workflow will publish it automatically.
