# Charles Goodsir — Portfolio

A personal portfolio site built with React and TypeScript, showcasing my move from enterprise software engineering into Application Security.

## Live Site

[charles-goodsir.github.io/my-portfolio](https://charles-goodsir.github.io/my-portfolio/)

## About

I'm a Software Application Engineer at Datacom (Auckland, NZ) with 4+ years working in .NET/C#, TypeScript, React, and Azure on enterprise CRM/ERP systems. I'm currently pivoting toward Application Security, backed by CompTIA Security+ (SY0-701) and hands-on practice through PortSwigger's Web Security Academy and Burp Suite.

This site doubles as a running log of that pivot — not just a static resume, but evidence of the work.

### What's on here

- **Experience** — professional background, reframed toward AppSec/DevSecOps, plus education and certifications
- **CyberDiary** — a dated log of security labs completed, with write-ups, solutions, screenshots, and scripts, filterable by vulnerability type
- **OWASP Top 10 (2025)** — a reference page covering all ten categories, with what I'm actively doing to learn each one
- **Projects** — including [Detour](https://apps.apple.com/), a React Native app I shipped independently to the App Store, and other full-stack builds

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Vite

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

## Project Structure

src/
├── components/ # Page sections (Experience, CyberDiary, OWASP, Projects, etc.)
│ └── Projects/ # Individual project detail pages
├── data/ # Content data (cyberDiaryEntries.ts, owaspTop10.ts)
└── assets/ # Screenshots and lab scripts referenced in CyberDiary

## Connect

- [LinkedIn](https://www.linkedin.com/in/charles-goodsir-430b0b254/)
- [GitHub](https://github.com/charles-goodsir)
