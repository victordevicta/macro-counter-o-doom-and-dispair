# 💀 Macro Counter O' Doom and Dispair

> *"Your gains are perishing. Your macros await judgment. Enter the dark sanctum."*

A full-stack nutritional tracking application with dark fantasy gothic aesthetics — built as a professional-grade React Native + NestJS SaaS app. Think MyFitnessPal, but forged in the fires of Darkest Dungeon and seasoned with Diablo IV's despair.

---

## ⚔️ Screenshots & Theme

The app uses a **Dark Fantasy / Medieval Gothic** visual language:
- Background: Deep obsidian `#0A0A0F`
- Primary: Blood Crimson `#8B1A1A` / `#C62828`
- Accents: Medieval Gold `#C9A84C`
- Text: Aged Parchment `#E8D5C4`
- Macros: Purple (Protein), Earth Brown (Carbs), Dark Gold (Fat)

Doom quotes throughout:
- *"Protein deficit detected."*
- *"The sodium curse grows stronger."*
- *"Micronutrient despair."*
- *"Your gains are perishing."*

---

## 🗂️ Project Structure

```
macro-counter-o-doom-and-dispair/
├── backend/                    # NestJS API
│   ├── prisma/
│   │   └── schema.prisma       # Complete database schema
│   └── src/
│       ├── auth/               # JWT auth + refresh tokens
│       ├── users/              # Profile & stats
│       ├── foods/              # Food search + 3 API integrations
│       │   └── external/       # Nutritionix, OFF, USDA
│       ├── diary/              # Daily food diary
│       ├── goals/              # Nutritional goals
│       ├── weight/             # Weight logging
│       ├── prisma/             # Prisma service
│       ├── common/             # Filters, interceptors, decorators
│       ├── config/             # App configuration
│       └── main.ts
└── mobile/                     # React Native + Expo
    └── src/
        ├── api/                # Axios API client + endpoints
        ├── components/
        │   ├── ui/             # Button, Input, Card, ProgressBar, MacroCircle
        │   ├── dashboard/      # CalorieRing, MacroSummary
        │   └── diary/          # MealSection, FoodEntryItem
        ├── navigation/         # Root, Auth, Tab navigators
        ├── screens/
        │   ├── auth/           # Login, Register, Onboarding
        │   ├── dashboard/      # Main dashboard
        │   ├── diary/          # Daily diary + Add food
        │   ├── search/         # Food search
        │   ├── barcode/        # Barcode scanner
        │   ├── progress/       # Weight tracking
        │   └── profile/        # User profile
        ├── store/              # Zustand state (auth, diary)
        ├── theme/              # Colors, Typography, Spacing
        └── types/              # TypeScript interfaces
```

---

## 🚀 Tech Stack

### Mobile
| Tech | Purpose |
|------|---------|
| **React Native + Expo** | Cross-platform mobile |
| **TypeScript** | Full type safety |
| **React Navigation v6** | Tab + Stack navigation |
| **Zustand** | Global state management |
| **TanStack Query v5** | Server state + caching |
| **React Hook Form + Zod** | Form validation |
| **Expo Camera** | Barcode scanning |
| **Expo Secure Store** | Token storage |
| **React Native SVG** | Calorie ring charts |
| **Expo Linear Gradient** | Dark gradient backgrounds |

### Backend
| Tech | Purpose |
|------|---------|
| **NestJS** | Scalable Node.js framework |
| **TypeScript** | Full type safety |
| **Prisma ORM** | Database access layer |
| **PostgreSQL** | Primary database |
| **JWT + Passport** | Authentication |
| **Swagger/OpenAPI** | API documentation |
| **class-validator** | DTO validation |
| **Axios** | External API calls |

### External APIs
| API | Purpose |
|-----|---------|
| **Nutritionix** | Branded food database, NLP queries |
| **Open Food Facts** | Barcode scanning, international foods |
| **USDA FoodData Central** | Scientific nutritional data |

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or Expo Go app)

---

### 1. Clone & Install

```bash
git clone <your-repo>
cd macro-counter-o-doom-and-dispair
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your environment file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/macro_counter_doom"
JWT_SECRET=your-secret-key-here-minimum-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-here-minimum-32-chars

# Get free keys at:
# Nutritionix: https://www.nutritionix.com/business/api
NUTRITIONIX_APP_ID=your-app-id
NUTRITIONIX_APP_KEY=your-app-key

# USDA: https://fdc.nal.usda.gov/api-guide.html
USDA_API_KEY=your-usda-key

# Open Food Facts: No key needed!
```

Run database migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

Start the backend:
```bash
npm run start:dev
```

The API will be available at: `http://localhost:3000`
Swagger docs: `http://localhost:3000/api/docs`

---

### 3. Mobile Setup

```bash
cd mobile
npm install
```

Configure the API URL in `src/api/client.ts`:
```typescript
// For physical device, use your machine's local IP:
const BASE_URL = 'http://192.168.1.XXX:3000/api/v1';
// For emulator/simulator, localhost works fine
```

Start Expo:
```bash
npx expo start
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on physical device

---

## 📱 Features

### Authentication
- [x] Registration with validation
- [x] Login with JWT
- [x] Refresh token rotation
- [x] Secure token storage (Expo Secure Store)
- [x] Auto-login on app restart
- [x] Logout with token revocation

### Onboarding
- [x] Sex, age, weight, height collection
- [x] Activity level selection (5 options)
- [x] Goal selection (lose/maintain/gain)
- [x] Auto-calculation via Mifflin-St Jeor formula
- [x] TDEE calculation with activity multipliers
- [x] Macro split generation

### Dashboard
- [x] Calorie ring with remaining/over indicator
- [x] Real-time doom quotes
- [x] Macro progress bars (Protein, Carbs, Fat, Fiber)
- [x] Sodium tracking
- [x] Daily statistics
- [x] Pull-to-refresh

### Food Diary
- [x] Date navigation (previous/next day)
- [x] 4 meal types (Dawn Rations, Midday Sustenance, Nightly Feast, Cursed Morsels)
- [x] Add/edit/delete food entries
- [x] Serving size adjustment
- [x] Quick portion buttons (0.5x, 1x, 1.5x, 2x)
- [x] Per-meal totals
- [x] Daily totals summary
- [x] Copy meal from previous days

### Food Search
- [x] Real-time search with debouncing (400ms)
- [x] Multi-API aggregation (Nutritionix + USDA)
- [x] Recent foods tab
- [x] Favorites tab
- [x] Food images
- [x] Macro display in search results
- [x] Barcode scanner button

### Barcode Scanner
- [x] Camera permission handling
- [x] EAN-13, EAN-8, UPC-A/E, Code128 support
- [x] Flash toggle
- [x] Multi-API barcode lookup (Nutritionix first, OFF fallback)
- [x] Scan-again on failure

### Nutritional Details
- [x] Calories, protein, carbs, fat
- [x] Fiber, sugar, sodium
- [x] Saturated fat, cholesterol
- [x] Potassium, calcium, iron
- [x] Vitamin C, Vitamin D
- [x] Magnesium, zinc

### Progress Tracking
- [x] Weight logging with date
- [x] Body fat percentage tracking
- [x] Muscle mass tracking
- [x] Change calculation from baseline
- [x] Doom quotes based on progress direction
- [x] Historical log list

### Profile
- [x] Username, email display
- [x] Body stats display
- [x] Nutritional goals overview
- [x] Logout with confirmation

---

## 🗄️ Database Schema

```
Users
  └── UserProfile (1:1)
  └── NutritionGoal (1:1)
  └── FoodEntries (1:N)
  └── WeightLogs (1:N)
  └── FavoriteFoods (1:N)
  └── SavedMeals (1:N)
  └── RefreshTokens (1:N)

Foods
  └── FoodEntries (N:1)
  └── FavoriteFoods (N:1)
  └── MealItems (N:1)

SavedMeals
  └── MealItems (1:N)
```

---

## 🔌 API Endpoints

### Auth
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### Users
```
GET  /api/v1/users/me
PUT  /api/v1/users/profile
GET  /api/v1/users/stats
```

### Foods
```
GET  /api/v1/foods/search?query=chicken&page=1
GET  /api/v1/foods/barcode/:upc
GET  /api/v1/foods/favorites
GET  /api/v1/foods/recent
GET  /api/v1/foods/:id
POST /api/v1/foods/custom
POST /api/v1/foods/:id/favorite
```

### Diary
```
GET    /api/v1/diary?date=2024-01-15
GET    /api/v1/diary/week?startDate=2024-01-15
POST   /api/v1/diary/entries
PUT    /api/v1/diary/entries/:id
DELETE /api/v1/diary/entries/:id
POST   /api/v1/diary/copy-meal
```

### Goals
```
GET  /api/v1/goals
PUT  /api/v1/goals
POST /api/v1/goals/reset
```

### Weight
```
GET    /api/v1/weight?limit=30
GET    /api/v1/weight/progress
POST   /api/v1/weight
DELETE /api/v1/weight/:id
```

---

## 🧮 Mifflin-St Jeor Formula

The app uses the **Mifflin-St Jeor equation** for BMR calculation:

**Male:**
```
BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
```

**Female:**
```
BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
```

**TDEE = BMR × Activity Multiplier**

| Activity Level | Multiplier |
|---------------|------------|
| Sedentary | 1.2 |
| Lightly Active | 1.375 |
| Moderately Active | 1.55 |
| Very Active | 1.725 |
| Extra Active | 1.9 |

**Goal Adjustments:**
- Lose Weight: TDEE - 500 kcal
- Maintain: TDEE
- Gain Muscle: TDEE + 300 kcal

---

## 🏗️ Architecture Decisions

### Backend
- **Global Prisma Module** — injected everywhere via `@Global()`
- **Transform Interceptor** — wraps all responses in `{ data, meta, success }`
- **Exception Filter** — catches all errors, adds doom quotes
- **JWT + Refresh Token rotation** — stored in DB, invalidated on logout
- **External API abstraction** — foods aggregated from 3 sources, cached in DB
- **Upsert strategy** — external foods cached by `externalId + source` unique pair

### Mobile
- **Zustand stores** — auth and diary state kept lean
- **TanStack Query** — server state (foods search, favorites, weight logs)
- **Zustand** — client state (auth, current diary date)
- **Axios interceptor** — auto-refresh tokens on 401
- **Expo Secure Store** — tokens never hit AsyncStorage

---

## 🚀 Production Deployment

### Backend (Railway/Render/Fly.io)

```bash
# Build
npm run build

# Start
npm run start:prod

# Set env vars in platform dashboard
```

### Mobile (EAS Build)

```bash
npm install -g eas-cli
eas login
eas build --platform android
eas build --platform ios
eas submit
```

---

## 🔒 Security

- Passwords hashed with **bcrypt** (12 rounds)
- JWT access tokens: 15min expiry
- Refresh tokens: 7 days, stored in DB (revocable)
- Rate limiting via `@nestjs/throttler`
- Input validation on all DTOs (class-validator)
- CORS configured for known origins

---

## 📦 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Access token signing key (min 32 chars) |
| `JWT_REFRESH_SECRET` | ✅ | Refresh token signing key |
| `JWT_EXPIRES_IN` | ❌ | Default: `15m` |
| `JWT_REFRESH_EXPIRES_IN` | ❌ | Default: `7d` |
| `NUTRITIONIX_APP_ID` | ⚠️ | Nutritionix API ID |
| `NUTRITIONIX_APP_KEY` | ⚠️ | Nutritionix API key |
| `USDA_API_KEY` | ⚠️ | USDA FoodData Central key |

⚠️ App works without API keys, but food search will be limited.

---

## 🌑 Lore

*"In the age before macros were counted, mortals wandered in nutritional darkness. They feasted without knowledge, grew without purpose, suffered without data.*

*Then came the Macro Counter O' Doom and Dispair — forged in the furnaces of despair, tempered in the waters of caloric deficit. It sees all. It judges all. Your protein deficit is known. Your sodium curse is monitored. Your gains are witnessed.*

*Enter the sanctum. Begin your suffering. Track your macros."*

---

## 📄 License

MIT — Use freely, suffer nobly.

---

*"All macros shall be counted. All deficits shall be mourned. The void is watching."*
