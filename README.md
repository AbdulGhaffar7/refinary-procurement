# 🏭 Refinery PO System

A unified procurement order management system featuring a React frontend and Node.js microservices.

---

## 📂 Project Overview

This repository is organized as a monorepo containing the following components:

- **`/client`**: React + Vite + MUI (Frontend)
- **`/services/catalog-service`**: Product and Catalog management API.
- **`/services/procurement-service`**: Purchase Order and Procurement logic API.

---

## 🚀 Quick Start Guide

Follow these steps to set up and run the entire ecosystem from the **root directory**.

### 1. Prerequisites

Ensure you have **Node.js** (v18 or higher) and **npm** installed on your machine.

### 2. Install All Dependencies

Instead of navigating into every folder manually, use the built-in helper script to install all `node_modules` at once:

```bash
npm run install-all
```

To launch the Frontend, Catalog Service, and Procurement Service simultaneously in a single terminal window, run:

```bash
npm run dev
```

Once the npm run dev command is active, you can access the application components at the following local addresses:

Frontend UI: http://localhost:5173

Catalog API: http://localhost:8001

Procurement API: http://localhost:8002

You can also access Swagger UI for backend at
Catalog API: http://localhost:8001/api-docs/

Procurement API: http://localhost:8002/api-docs
