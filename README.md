# 🛒 GoseriMart

**Fresh Groceries Delivered to Your Door**
# live demo - https://future-fs-03-five-psi.vercel.app/#/

A full-stack grocery e-commerce application built with Node.js, Express, and MongoDB Atlas. Features user authentication, product browsing, cart management, and order placement with a premium dark-mode UI.

![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![Express](https://img.shields.io/badge/Express-4.x-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

- 🛍️ **30 Products** across 6 categories (fruits, vegetables, dairy, bakery, beverages, snacks)
- 🔍 **Search & Filter** — browse by category or search by name
- 🛒 **Cart Management** — add, update quantity, remove items
- 🔐 **Authentication** — JWT-based signup/login with bcrypt password hashing
- 👤 **User Profile** — edit name, phone, delivery address
- 📦 **Order History** — view past orders with status tracking
- 🎉 **Checkout** — auth-gated with confetti celebration on success
- 🌙 **Premium Dark UI** — glassmorphism, gradients, micro-animations
- 📱 **Fully Responsive** — mobile, tablet, and desktop

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT + bcryptjs |
| **Frontend** | Vanilla HTML, CSS, JavaScript |
| **Styling** | Custom CSS with glassmorphism dark mode |
| **Fonts** | Google Fonts (Inter, Outfit) |

---

## 📁 Project Structure

```
GoseriMart/
├── .gitignore
├── .env.example            # Environment template (copy to .env)
├── package.json            # Root dependencies & scripts
├── README.md
│
├── backend/                # ── Server & API ──
│   ├── server.js           # Express entry point
│   ├── config/
│   │   └── db.js           # MongoDB Atlas connection
│   ├── data/
│   │   └── products.json   # 30 seed products
│   ├── middleware/
│   │   ├── auth.js         # JWT verification
│   │   └── errorHandler.js # Global error handler
│   ├── models/
│   │   ├── User.js         # Mongoose User schema
│   │   ├── Cart.js         # In-memory cart state
│   │   └── Order.js        # In-memory order store
│   └── routes/
│       ├── auth.js         # Signup, login, profile
│       ├── products.js     # Product listing & search
│       ├── cart.js         # Cart CRUD
│       └── orders.js       # Order placement (auth required)
│
└── frontend/               # ── UI & Client ──
    ├── index.html          # SPA shell
    ├── css/
    │   └── styles.css      # Complete design system
    └── js/
        ├── api.js          # API client (fetch wrapper)
        ├── auth.js         # Auth state manager
        ├── app.js          # SPA router
        ├── components/
        │   ├── authModal.js
        │   ├── cartItem.js
        │   ├── header.js
        │   ├── productCard.js
        │   └── toast.js
        └── pages/
            ├── home.js
            ├── products.js
            ├── cart.js
            ├── checkout.js
            ├── profile.js
            └── orders.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB Atlas](https://cloud.mongodb.com/) account (free tier works)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/GoseriMart.git
   cd GoseriMart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your MongoDB Atlas connection string and a JWT secret:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/goserimart
   JWT_SECRET=your-secret-key-here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 🌐 Deploy to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add **Environment Variables** in Render dashboard:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong random string
6. Deploy! 🎉

> **Important**: In MongoDB Atlas → Network Access, allow connections from `0.0.0.0/0` so Render can reach your database.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login, get JWT |
| GET | `/api/auth/me` | ✅ | Get profile |
| PUT | `/api/auth/me` | ✅ | Update profile |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | ❌ | List all (`?category=` `?search=`) |
| GET | `/api/products/categories` | ❌ | List categories |
| GET | `/api/products/:id` | ❌ | Single product |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | ❌ | Get cart |
| POST | `/api/cart/add` | ❌ | Add item |
| PUT | `/api/cart/update` | ❌ | Update quantity |
| DELETE | `/api/cart/remove/:id` | ❌ | Remove item |
| DELETE | `/api/cart/clear` | ❌ | Clear cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | ✅ | Place order |
| GET | `/api/orders` | ✅ | Order history |
| GET | `/api/orders/:id` | ✅ | Single order |

---

## 📄 License

MIT License — feel free to use this project for learning and personal use.

---

**Built with ❤️ by Adarsh Jaiswal**
