<div align="center">
  <img src="./src/app/icon.svg" width="120" height="120" alt="Rent Split Optimizer Logo" />
  <h1>Rent Split Optimizer</h1>
  <p><strong>A mathematically proven, beautiful way to split rent fairly amongst roommates.</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-State-black?style=for-the-badge)](https://github.com/pmndrs/zustand)
</div>

---

## 🚀 Overview

The **Rent Split Optimizer** takes the headache out of deciding who pays what when moving into a new apartment. 

Instead of arguing over the master bedroom, you input the exact sizes of every room, check off who has a private bathroom or a balcony, and let deterministic mathematics figure out the exactly perfect split down to the cent. Everyone gets an undeniable, logically sound breakdown of their share of the rent and utilities.

## ✨ Features

- **Dynamic Rent Algorithm**: Weighs room sizes, private bathrooms, balconies, and common area usage to allocate costs smoothly.
- **Premium Modifiers Engine**: Lock advanced visual scoring algorithms (Sunlight, View, Furnishings) behind a digital unlocking gate for premium users.
- **Flawless Mathematics**: Utilizes Banker's Rounding to guarantee the final allocated split permanently exactly matches your target budget.
- **Live Visualizations**: Adjust a room size and watch your share instantly resize via responsive Recharts graphs.
- **Digital Receipts**: Once configured, lock it down and generate a unique, shareable URL to act as an uneditable "Treaty" in your group chat.

## 🛠️ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/ashinshanly/splitrent.git
cd splitrent

# 2. Install dependencies
npm install

# 3. Apply the database schema
npx prisma db push

# 4. Start the development server
npm run dev
```

Visit `http://localhost:3000` to start calculating.

## 🏗️ Architecture Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + Shadcn UI + Framer Motion
- **State Management**: Zustand
- **Database**: SQLite (via Prisma ORM)
- **Charts**: Recharts

---
<div align="center">
  <sub>Built with sleek glassmorphism and modern web standards.</sub>
</div>
