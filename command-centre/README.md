# Command Centre

Centralized monitoring dashboard for the Entrepreneur Topics Ecosystem.

![Command Centre Banner](./src/assets/images/banner.png)

## Overview

Command Centre is an enterprise-style administration dashboard used to monitor and manage all applications within the Entrepreneur Topics Ecosystem from a single interface.

The platform aggregates data from multiple applications and provides a unified experience for viewing:

- Products
- Categories
- Images
- Reviews
- Monitoring Metrics

---

## Applications

| Application        | Description                           |
| ------------------ | ------------------------------------- |
| ☕ Kings Brew      | Coffee Ordering Platform              |
| 🥩 Castle Kitchen  | Steak & Restaurant Ordering Platform  |
| 🍔 Byte Burger     | Food Ordering Platform                |
| 🛒 Quantum Mart    | E-Commerce Platform                   |
| 🏪 Trade Hub       | Marketplace Platform                  |
| 🍍 Pineapple Stack | Community Forum & Discussion Platform |
| 👨‍💼 M-ployee        | Employee Information System           |
| 📸 Codigram        | Social Media Platform                 |
| 🏡 Medieval Airbnb | Property Booking Platform             |
| 📚 Leather Shelf   | Library Management Platform           |

---

## Features

### Enterprise Dashboard

- Application Overview
- Centralized Monitoring
- Cross-Platform Management
- Unified Design System

### Product Management

- Search
- Sorting
- Filtering
- Pagination
- Category Management
- Product Images

### Review Management

- Customer Feedback
- Product Reviews
- Rating Visualization

### Image Management

- Product Image Gallery
- Asset Preview
- Image Sorting

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

---

## Project Structure

```bash
src/
│
├── components/
│   ├── data-table/
│   ├── shared/
│   └── ui/
│
├── features/
│   └── applications/
│       ├── api/
│       ├── columns/
│       ├── components/
│       ├── config/
│       ├── hooks/
│       ├── pages/
│       ├── tabs/
│       └── types/
│
├── lib/
├── routes/
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
yarn install
```

### Start Development Server

```bash
yarn dev
```

### Build Production

```bash
yarn build
```

### Preview Production Build

```bash
yarn preview
```

---

## Environment Variables

Create a `.env` file:

```env
VITE_APP_NAME=Command Centre
```

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
