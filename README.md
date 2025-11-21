# Theta Lounge - Therapy Center Frontend

A modern, responsive web application for Theta Lounge therapy center built with React, TypeScript, and Vite.

## Features

- 🎨 Beautiful, modern UI with custom typography (Playfair Display, Poppins, Inter)
- 📱 Fully responsive design with mobile-first approach
- 🎥 Engaging video backgrounds with overlays
- 🔐 Protected admin routes with authentication
- 🎯 Custom Tailwind CSS theme with theta-blue color palette
- ⚡ Fast development with Vite and Hot Module Replacement (HMR)

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Modern icon library

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── admin/       # Admin-specific components
│   ├── layout/      # Layout components (NavBar, Footer)
│   └── shared/      # Shared components
├── pages/           # Page components
│   ├── admin/       # Admin pages
│   └── ...          # Public pages
├── context/         # React Context providers
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

All rights reserved.
