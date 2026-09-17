# Command Centre

Centralized monitoring dashboard for the Entrepreneur Topics Ecosystem.

![Command Centre Banner](./src/assets/images/banner.png)

## Overview

Command Centre is an enterprise-style administration dashboard used to monitor and manage all applications within the Entrepreneur Topics Ecosystem from a single interface.

The platform aggregates data from multiple applications and provides a unified experience for viewing:

- Application resources (products, categories, posts, books, employees, warehouses, ...)
- Reviews
- Orders
- Monitoring & health
- Ecosystem map

---

## Applications

| Application        | Group           | Description                               | Backend     |
| ------------------ | --------------- | ----------------------------------------- | ----------- |
| ☕ Kings Brew      | commerce-core   | Coffee Ordering Platform                  | Deployed    |
| 🥩 Castle Kitchen  | commerce-core   | Steak & Restaurant Ordering Platform      | Deployed    |
| 🍔 Byte Burger     | commerce-core   | Food Ordering Platform                    | Deployed    |
| 🛒 Quantum Mart    | commerce-core   | E-Commerce Platform                       | Deployed    |
| 🏪 Trade Hub       | commerce-core   | Marketplace Platform                      | Deployed    |
| 🍍 Pineapple Stack | operations-core | Community Forum & Discussion Platform     | Deployed    |
| 👨‍💼 M-ployee        | operations-core | Employee Information System               | Deployed    |
| 📸 Codigram        | operations-core | Social Media Platform                     | Deployed    |
| 📚 Leather Shelf   | operations-core | Library Management Platform               | Deployed    |
| 📦 WareTrack       | operations-core | Warehouse & Inventory Management Platform | Deployed    |
| 🏡 Medieval Airbnb | template        | Property Booking Platform                 | Coming soon |
| 🧭 Nomad           | template        | Digital Nomad Platform                    | Coming soon |

Each application's tabs, endpoints and supported query params are declared in
`src/features/applications/config/application.config.ts`, based on that
backend's Swagger.

---

## Features

### Enterprise Dashboard

- Application Overview
- Centralized Monitoring
- Cross-Platform Management
- Unified Design System

### Application Resources

- One data-driven page per application
- Search, category filter, sorting and pagination (only where the backend supports them)
- Resource counts from each backend's stats endpoint
- Contextual detail panel for nested data (e.g. comments per post)

### Review Management

- Reviews from every application that exposes a public reviews endpoint
- Grouped per application and product
- Rating, application and date sorting

### Order Management

- Public orders with status, date range and amount filters

---

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- TanStack Table
- TanStack Query
- React Router

### State & Data

- TanStack Query
- Axios

### UI Components

- Lucide React
- Radix UI
- Framer Motion

### Testing

- Jest + ts-jest
- Supertest (API contract tests against the deployed Kings Brew API)

---

## Project Structure

```bash
src/
│
├── app/                  # App, providers, router, route paths
├── components/
│   ├── data-table/
│   ├── shared/
│   └── ui/
│
├── features/
│   ├── applications/     # Per-application resource pages
│   │   ├── api/
│   │   ├── columns/
│   │   ├── components/
│   │   ├── config/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── tabs/
│   │   ├── types/
│   │   └── utils/
│   ├── dashboard/        # Command Centre overview
│   ├── ecosystem-map/
│   ├── monitoring/
│   ├── orders/
│   └── reviews/
│
├── layouts/
├── lib/
└── main.tsx
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The dev server runs on port 5000.

### Build Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm test
```

The API contract tests hit the deployed Kings Brew API and are skipped by
default. Run them with:

```bash
RUN_INTEGRATION_TESTS=true npm test
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable                 | Description                                                           |
| ------------------------ | --------------------------------------------------------------------- |
| `VITE_APP_NAME`          | Display name of the dashboard                                         |
| `VITE_<APPLICATION>_URL` | Base URL of each application's backend. Leave empty if not deployed   |
| `VITE_AUDIT_LOG_URL`     | Full URL of a public activity feed for the Monitoring page (optional) |

See `.env.example` for the full list of application URLs.

---

## Design Principles

The dashboard follows enterprise software patterns inspired by:

- Stripe Dashboard
- Shopify Admin
- GitHub Enterprise
- Vercel Dashboard
- Linear

### Core Principles

- Simplicity
- Consistency
- Scalability
- Performance
- Data-First Design

---

## License

MIT License

---

Built with ❤️ by Vincent Guizot
