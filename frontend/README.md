# Kriya Boutique — Website

A React + Vite boutique website with Three.js 3D hero and scroll-driven photo reveals.

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
http://localhost:5173
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Cursor.jsx          # Custom gold cursor
│   ├── Cursor.module.css
│   ├── Navbar.jsx          # Fixed navigation with scroll effect
│   ├── Navbar.module.css
│   ├── Hero.jsx            # Hero section wrapper
│   ├── Hero.module.css
│   ├── ThreeHero.jsx       # 🔥 Three.js 3D lehenga figure
│   ├── DressCard.jsx       # Scroll-driven photo dress cards
│   ├── DressCard.module.css
│   ├── Sections.jsx        # Marquee, Intro, Quote, Process, Footer
│   └── Sections.module.css
├── data/
│   └── dresses.js          # ← Edit this to add/update dresses
├── hooks/
│   └── useScroll.js        # Scroll progress + InView hooks
├── styles/
│   └── global.css
├── App.jsx
└── main.jsx

public/
├── lehenga1.png            # Your dress photos go here
├── lehenga2.png
└── lehenga3.png
```

## 📸 Adding More Photos

1. Drop your photo files into the `/public` folder
2. Open `src/data/dresses.js`
3. Update the `photos` array for each dress:

```js
photos: [
  '/lehenga1-front.png',
  '/lehenga1-side.png',
  '/lehenga1-detail.png',
],
```

## 🎨 Customising Dresses

Edit `src/data/dresses.js` to change:
- Names, descriptions, prices
- Fabric & work details
- Colour swatches
- Accent colour (used for background glow)

## 🌐 Deploy

```bash
npm run build
# Upload the /dist folder to Vercel, Netlify, or any static host
```

## 🔧 Tech Stack

- **React 18** + **Vite 5**
- **Three.js** — 3D hero figure
- **CSS Modules** — scoped component styles
- **IntersectionObserver** — scroll-triggered reveals
- **Custom hooks** — `useScrollProgress`, `useInView`

## 📦 Install Dependencies

```bash
npm install react react-dom three @vitejs/plugin-react vite
```

Optional (for enhanced animations):
```bash
npm install framer-motion gsap
```
