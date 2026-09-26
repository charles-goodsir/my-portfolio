# Charles Goodsir: Portfolio

A personal portfolio site built with React and TypeScript, showing my move from enterprise software engineering into DevOps/DevSecOps.

## Live Site

[charlesgoodsir.com](https://charlesgoodsir.com/)

## About

I'm a Software Application Engineer at Datacom (Auckland, NZ) with 4+ years working in .NET/C#, TypeScript, React, and Azure on enterprise CRM/ERP systems. I'm currently pivoting toward DevOps and DevSecOps, with application security as the specialty inside that. That's backed by CompTIA Security+ (SY0-701), hands-on practice through PortSwigger's Web Security Academy and Burp Suite, and IaC/CI-CD work with Terraform and GitHub Actions.

This site doubles as a running log of that pivot. It's not just a static resume, it's evidence of the work.

### What's on here

- **Experience**: professional background, reframed toward AppSec/DevSecOps, plus education and certifications
- **CyberDiary**: a dated log of security labs completed, with write-ups, solutions, screenshots, and scripts, filterable by vulnerability type
- **OWASP Top 10 (2025)**: a reference page covering all ten categories, with what I'm actively doing to learn each one
- **Projects**: including [Detour](https://apps.apple.com/us/app/detour/id6743507600), a React Native app I shipped independently to the App Store, and other full-stack builds
- **Visitor map**: a world map of where visitors come from, backed by a small Cloudflare Worker (see `worker/`), with a risk assessment of the feature
- **CTF map**: an optional 3D game mode at `/play`, described below

## CTF Map

The **Play CTF Map** button on the home page opens a 3D arena styled on the grid from Tron. You drive a small program called the Bit around it, and each page of the site is a flag. Get close to one and press Enter to open that page. The normal site stays the default, and the map is only offered on devices with a keyboard or mouse.

It has a boot screen, a stadium with a crowd and my name in lights, holograms that preview each page, a capture tracker, a radar, and an optional generated synth soundtrack. There is also a real flag hidden on the map. No spoilers here.

How it's built:

- **Three.js** through **React Three Fiber** and **drei**, with bloom, a reflective floor and CRT effects from **@react-three/postprocessing**
- Everything is made from basic shapes and code. There are no 3D models, textures or audio files
- The 3D code and the sound code are split into their own chunks, loaded only when someone opens `/play`. The rest of the site grew by about 1 KB
- Rendering quality scales down automatically if the frame rate drops, and reduced-motion settings are respected throughout
- Code lives in `src/components/Play/`. Every tuning value (sizes, speeds, camera, colours) is in `constants.ts`
- `npm run dev` shows a frame rate and draw-call counter under the capture counter. It's left out of production builds

The plan and decisions behind it are in `plans/03-ctf-map.md`.

## Security

- **Content Security Policy**: GitHub Pages can't send response headers, so a build-only plugin in `vite.config.ts` adds the policy as a `<meta>` tag in the built `index.html`. The one inline script (the GitHub Pages redirect shim) is allowed by its SHA-256 hash, recalculated on every build. The only external host allowed is the visitor map's Worker. `frame-ancestors` isn't available in a meta tag, so there's no clickjacking protection on this host
- **No third-party requests from the page**: fonts are self-hosted through `@fontsource` rather than loaded from Google Fonts
- **Dependencies**: `npm audit` is clean. Build tooling lives in `devDependencies`

Adding any new external script, font or API means adding it to the policy in `vite.config.ts`, or the browser will block it.

## Tech Stack

- React 19, React Router 7
- TypeScript
- Tailwind CSS v4
- Vite
- Three.js, React Three Fiber, drei, postprocessing (CTF map)
- Cloudflare Workers + KV (visitor map)

## Getting Started

```bash
git clone https://github.com/charles-goodsir/my-portfolio.git
cd my-portfolio
npm install
npm run dev
```

Then open `http://localhost:5173` (Vite's default port).

To build for production:

```bash
npm run build
```

To check the production build locally, including the Content Security Policy (which only applies to builds):

```bash
npm run preview
```

To deploy to GitHub Pages:

```bash
npm run deploy
```

## Connect

- [LinkedIn](https://www.linkedin.com/in/charles-goodsir-430b0b254/)
- [GitHub](https://github.com/charles-goodsir)
