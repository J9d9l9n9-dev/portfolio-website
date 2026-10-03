# Portfolio

A production-ready, high-performance full-stack personal portfolio application engineered with **FastAPI (Python 3.13), SQLAlchemy 2.0, PostgreSQL/SQLite, React 19, TypeScript, TanStack Query, and Tailwind CSS v4**.

Designed with clean separation of concerns, strict type safety across both frontend and backend, comprehensive automated test coverage (Pytest + Vitest), resilient offline fallback mechanisms, and containerized deployment.

---

## Overview

This application serves as both a comprehensive showcase of professional software engineering capabilities and a live demonstration of full-stack system architecture. It bridges modern reactive user interfaces with robust, authenticated REST APIs, automated data seeding, and secure content management.

### Key Highlights
- **100% Authentic Profile Data**: Zero fabricated statistics, honest proficiency tiers, and real academic & technical milestones.
- **Resilient Fallback Layer**: Frontend seamlessly falls back to local cached snapshots when the backend is initializing or offline.
- **Owner CMS & Admin Dashboard**: Full CRUD management over projects, skills, education, experience, and contact inquiries with JWT authentication and rate limiting.
- **Rigorous Test Discipline**: 33 backend tests and 4 frontend contract tests passing with 100% success rate.
- **WCAG AA Compliance**: High-contrast dark and light modes, accessible form labels, keyboard navigation, and reduced-motion support.

---

## Features

- **Redesigned Two-Column Hero**: Professional typography hierarchy, clean status indicator, meaningful CTAs, authentic stat counters, and an animated portrait image with layered ambient glow and reduced-motion support.
- **Structured 4-Pillar About Section**: Factual background, "What I Build" systems breakdown, current learning focus (DSA & system design), and verified academic education.
- **Grouped Domain Skills**: Clean competency tiers (`Intermediate`, `Active Tooling`, `Currently Learning`) without arbitrary percentage bars.
- **Interactive Projects Showcase & Deep-Dive Case Studies**:
  - Filterable by domain (*All*, *AI & Full-Stack*, *Backend & Mobile*, *Frontend & Utilities*).
  - Dedicated `/projects/:slug` deep-dive case-study pages detailing Problem, Solution, Architecture, Features, and Engineering Learnings.
  - Full-screen screenshots gallery with Lightbox modal (keyboard `ESC` and navigation support).
- **Verified Experience & Milestones Timeline**: Real chronological milestones spanning foundational programming, DSA, hackathon participation, and production application development.
- **Academic Education**: Verified degrees and coursework from GITAM University and Sasi Junior College.
- **Secure Contact Form**: Floating accessible labels, client and server-side validation, in-memory IP rate limiting, and honeypot anti-spam protection.
- **Full Admin Portal (`/admin`)**:
  - Protected by JWT Bearer token authentication.
  - Direct inquiry inbox table to view and delete incoming messages.
  - Full CRUD management for Profile, Projects, Skills, Experience, and Education.
  - Secure file upload handler with MIME validation and size limits.
- **Global Command Palette (`Ctrl+K` / `⌘K`)**: Quick keyboard search across all sections, project case studies, and instant actions.

---

## Tech Stack

| Layer | Technologies | Rationale |
|---|---|---|
| **Frontend Framework** | React 19, TypeScript | Modern component architecture, strict type contracts, concurrent rendering |
| **Build Tooling** | Vite 8 | Instant HMR, Rollup production bundling, tree-shaking |
| **State & Caching** | TanStack Query v5 | Server state synchronization, optimistic caching, automatic retries |
| **Styling** | Tailwind CSS v4 | CSS variable design tokens, responsive 8px grid, dark/light theme tokens |
| **Icons & Assets** | Lucide React, Custom SVG | Crisp, scalable iconography without bloated external libraries |
| **Backend Framework** | FastAPI (Python 3.12 / 3.13) | High-speed ASGI framework, Pydantic v2 schemas, auto OpenAPI docs |
| **ORM & Database** | SQLAlchemy 2.0, PostgreSQL / SQLite | Typed relational mapping, schema integrity, zero-config local dev fallback |
| **Security & Auth** | JWT, Passlib (BCrypt) | Stateless token-based authentication and secure password hashing |
| **Testing** | Pytest, Vitest | Automated unit & integration tests across API endpoints and client logic |
| **Containerization** | Docker, Docker Compose, Nginx | Multi-stage production container builds and local orchestration |

---

## Architecture

```mermaid
graph TD
    Client[Web Browser / Client]
    
    subgraph Frontend ["Frontend (React 19 + TypeScript + Vite)"]
        UI[Tailwind Design System & Bento Grid]
        Router[React Router DOM 7]
        TQ[TanStack Query Cache]
        APIClient[API Client & Resilient Fallback]
        CmdK[Command Palette & Toasts]
    end

    subgraph Backend ["Backend (FastAPI REST API)"]
        App[FastAPI Engine /api/v1]
        AuthMiddleware[JWT Auth & BCrypt Security]
        RateLimiter[IP Rate Limiter & Honeypot Filter]
        Uploads[Static File Serving /uploads]
        Routers[Profile | Projects | Skills | Experience | Education | Contact | Upload | Auth]
        ORM[SQLAlchemy 2.0 ORM]
    end

    subgraph Database ["Persistence Layer"]
        DB[(PostgreSQL / SQLite)]
    end

    Client -->|HTTP/HTTPS| Router
    Router --> UI
    UI --> TQ
    UI --> CmdK
    TQ --> APIClient
    APIClient -->|JSON REST API| App
    App --> AuthMiddleware
    App --> RateLimiter
    App --> Uploads
    App --> Routers
    Routers --> ORM
    ORM --> DB
```

---

## Project Structure

```text
port/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI pipeline for lint, test, and build
├── backend/                     # FastAPI Python Application
│   ├── app/
│   │   ├── config.py            # Pydantic Settings & environment parsing
│   │   ├── database.py          # SQLAlchemy 2.0 engine & session maker
│   │   ├── models.py            # Relational database models
│   │   ├── schemas.py           # Pydantic v2 validation and response models
│   │   ├── auth.py              # JWT tokens, password hashing, and OAuth2 schemes
│   │   ├── seed.py              # Database seeder from content.json
│   │   ├── main.py              # FastAPI entrypoint, middleware, and router mounts
│   │   └── routers/             # Modular REST API endpoints
│   ├── seed/
│   │   └── content.json         # Single source of truth for portfolio profile data
│   ├── tests/                   # Pytest automated test suite (33 tests)
│   ├── Dockerfile               # Multi-stage Python 3.12/3.13 image
│   └── requirements.txt         # Python dependencies
├── frontend/                    # React 19 + TypeScript + Vite Application
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts        # Fetch API client with offline fallback cache
│   │   ├── components/          # UI components, layout, navbar, command palette
│   │   │   ├── sections/        # Hero, About, Skills, Experience, Projects, Contact
│   │   │   └── ui/              # TechLogos, CommandPalette, Toast, SocialIcons
│   │   ├── pages/               # HomePage, ProjectDetailPage, AdminPage, NotFound
│   │   ├── context/             # ThemeContext (dark/light)
│   │   ├── types/               # Strict TypeScript interface contracts
│   │   └── tests/               # Vitest unit test suite (4 tests)
│   ├── public/                  # Static assets (images, profile, projects, resume.pdf)
│   ├── Dockerfile               # Multi-stage Node 20 build + Nginx static server
│   ├── nginx.conf               # Nginx reverse proxy and client routing rules
│   └── package.json
├── docs/                        # Project documentation, audits, reports & screenshots
│   ├── audits/                  # Placeholder and data integrity audits
│   ├── reports/                 # Functionality, test, and QA reports
│   └── screenshots/             # High-resolution screenshots of live application
├── .env.example                 # Environment configuration template
├── .gitignore                   # Git exclusion rules (DB, env, build artifacts)
├── docker-compose.yml           # Multi-container orchestration (Postgres, Backend, Frontend)
├── LICENSE                      # MIT Open-Source License
└── README.md                    # Project documentation
```

---

## Featured Projects

### 1. AI Skin Intelligence & Personalized Skincare Planner
- **Category**: AI & Full-Stack
- **Tech Stack**: React, FastAPI, Python, PyTorch, EfficientNet-B0, SQLAlchemy, Alembic, PostgreSQL, JWT, RBAC
- **Overview**: An AI-driven skincare diagnostic system performing computer vision skin assessments to generate customized morning, evening, weekly, and seasonal routines with allergy-safe ingredient matching.

### 2. ASHA EHR Companion
- **Category**: Backend & Mobile
- **Tech Stack**: React Native, Expo, Fastify, Node.js, SQLite, Sync Engine, Conflict Resolution
- **Overview**: An offline-first electronic health record application engineered for rural healthcare workers (ASHAs) to record ANC visits, immunizations, and patient vitals with deterministic background conflict sync.

### 3. Full-Stack Developer Portfolio
- **Category**: Full-Stack & Engineering
- **Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS v4, FastAPI, SQLAlchemy 2.0, JWT, Pytest, Vitest, Docker
- **Overview**: The portfolio system itself, engineered with an owner-managed CMS, rate-limited inquiries, resilient offline caching, and automated testing.

---

## Getting Started

### Prerequisites
- **Python**: Version 3.12 or 3.13
- **Node.js**: Version 20+ and npm
- **Docker**: (Optional) Docker Desktop 24+ and Docker Compose v2

---

## Environment Variables

Copy the template `.env.example` into `.env` at the root, or configure `backend/.env`:

```bash
cp .env.example .env
```

| Variable | Default Value | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./portfolio.db` | Connection string (`postgresql://...` or `sqlite:///...`) |
| `SECRET_KEY` | `portfolio-dev-secret-key...` | Cryptographic secret for signing JWT tokens |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | JWT token validity window |
| `ADMIN_EMAIL` | `jampadurgalakshminarayana@gmail.com` | Primary owner admin email |
| `ADMIN_PASSWORD` | `AdminPass123!` | Primary owner admin initial password |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin for local dev |
| `VITE_API_URL` | `http://localhost:8000/api/v1` | Backend API endpoint for frontend client |
| `STORAGE_TYPE` | `local` | Upload storage provider (`local`, `s3`, `cloudinary`) |

---

## Running Locally

### Backend (FastAPI)
```bash
cd backend
python -m venv .venv

# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
- API Base: `http://localhost:8000/api/v1`
- Swagger Documentation: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

*Note: On first startup, the database is automatically created and seeded with verified data from `backend/seed/content.json`.*

### Frontend (React + Vite)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Open browser at `http://localhost:5173`.

---

## Docker Setup

Run the entire application stack (PostgreSQL 16, FastAPI backend, Nginx-served frontend) with Docker Compose:

```bash
docker-compose up --build
```

- **Frontend Client**: `http://localhost:3000`
- **Backend API & Docs**: `http://localhost:8000/docs`
- **PostgreSQL Database**: `localhost:5432`

To shut down containers and preserve data volumes:
```bash
docker-compose down
```

---

## Testing

Both frontend and backend suites are automated and verifiable via CLI commands:

### Backend Tests (Pytest)
```bash
cd backend
.\.venv\Scripts\python -m pytest tests -v
```
**Results: 33 / 33 passed (100%)**
- Token generation & JSON/OAuth2 authentication routes
- Protected route authorization (401 response verification)
- Brute-force rate limiting and login lockout mechanisms
- Project filtering and full CRUD operations
- Journey milestones, Certifications, and Achievements CRUD
- Skills, Currently Learning items, Experience, and Education CRUD
- Image upload validation (MIME checking, 5MB file size limit)
- Contact form submission, honeypot anti-spam trap, and message deletion
- Database backup JSON export

### Frontend Tests (Vitest)
```bash
cd frontend
npm test
```
**Results: 4 / 4 passed (100%)**
- Validates resilient fallback datasets (`FALLBACK_PROJECTS`, `FALLBACK_SKILLS`, `FALLBACK_EDUCATION`).
- Verifies category taxonomy (`all`, `ai-fullstack`, `backend-mobile`, `frontend-tools`).
- Confirms featured project case studies and honest competency tiers.

### Production Build Verification
```bash
cd frontend
npm run build
```
- Compiles TypeScript contracts (`tsc -b`) and bundles via Vite.
- Output: Production-ready bundle in `frontend/dist` (~465 kB gzip).

---

## API Documentation

When the backend is running, interactive OpenAPI documentation is accessible at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Primary Endpoints Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/profile` | Public | Fetch owner profile, bio, social links, and statistics |
| `PUT` | `/api/v1/profile` | Admin (JWT) | Update owner bio and metadata |
| `GET` | `/api/v1/projects` | Public | List all projects (supports `?category=` filtering) |
| `GET` | `/api/v1/projects/{slug}` | Public | Retrieve detailed project case study by slug |
| `POST` | `/api/v1/projects` | Admin (JWT) | Create new project entry |
| `PUT` | `/api/v1/projects/{id}` | Admin (JWT) | Update existing project |
| `DELETE` | `/api/v1/projects/{id}` | Admin (JWT) | Delete project entry |
| `GET` | `/api/v1/skills` | Public | List grouped skill domains and technologies |
| `POST` | `/api/v1/skills` | Admin (JWT) | Create new skill group |
| `GET` | `/api/v1/experience` | Public | List career experience milestones |
| `POST` | `/api/v1/experience` | Admin (JWT) | Add career experience entry |
| `GET` | `/api/v1/education` | Public | List academic education records |
| `POST` | `/api/v1/education` | Admin (JWT) | Add academic education record |
| `POST` | `/api/v1/contact` | Public | Submit contact inquiry (rate-limited, honeypot protected) |
| `GET` | `/api/v1/contact` | Admin (JWT) | Retrieve contact inquiry inbox |
| `DELETE` | `/api/v1/contact/{id}` | Admin (JWT) | Delete inquiry message |
| `POST` | `/api/v1/upload` | Admin (JWT) | Upload image/document asset |
| `POST` | `/api/v1/auth/login-json`| Public | Authenticate owner credentials for JWT token |
| `GET` | `/api/v1/auth/me` | Admin (JWT) | Validate active admin session |

---

## Admin Dashboard

The authenticated administrative console is accessible at `/admin`.

### Default Credentials (Local Development)
- **Email**: `jampadurgalakshminarayana@gmail.com`
- **Password**: `AdminPass123!`

### Capabilities
- **Overview Dashboard**: Metrics on active projects, skills, education records, and unread inquiries.
- **Message Inbox**: Review and delete user contact inquiries.
- **Entity CRUD**: In-browser forms to edit profile bio, add/update projects, modify skills, and manage education timeline.
- **Asset Uploads**: Upload project screenshots and documents directly into `/uploads` with real-time preview.
- **Instant Invalidation**: Mutations trigger immediate TanStack Query cache updates on the public-facing pages.

---

## Security

The application incorporates multiple layers of defensive security:

1. **Authentication & Password Hashing**:
   - Passwords hashed using `BCrypt` with salted iterations via Passlib.
   - Stateless JWT tokens signed with `HS256` cryptographic algorithms.
2. **Access Control (RBAC)**:
   - Public read access for portfolio content; administrative write operations strictly require valid `Bearer <token>`.
3. **Spam & Abuse Protection**:
   - In-memory IP rate limiting on `/api/v1/contact` prevents inquiry flooding.
   - Invisible honeypot field (`website`) silently intercepts and rejects automated bot submissions.
4. **File Upload Hardening**:
   - Strict MIME-type validation (JPEG, PNG, WebP, GIF, PDF).
   - Enforced 5MB file size limit to prevent Denial-of-Service attacks.
   - Secure filename sanitization avoiding directory traversal (`../`).
5. **Data Protection & Sanitization**:
   - Pydantic v2 schemas rigorously sanitize and validate all request payloads.
   - SQLAlchemy parameterized queries eliminate SQL injection vulnerabilities.
   - Sensitive environment variables and SQLite databases strictly excluded via `.gitignore`.

---

## Screenshots

| Section | Preview |
|---|---|
| **Hero Section (Dark)** | ![Hero Dark](docs/screenshots/hero-dark.png) |
| **Bento Grid About Section** | ![About Dark](docs/screenshots/about-dark.png) |
| **Skills & SVG Tooling** | ![Skills Dark](docs/screenshots/skills-dark.png) |
| **Experience Timeline** | ![Experience Dark](docs/screenshots/experience-dark.png) |
| **Projects Showcase** | ![Projects Dark](docs/screenshots/projects-dark.png) |
| **Interactive Case Study** | ![Project Detail](docs/screenshots/project-detail-dark.png) |
| **Command Palette (Ctrl+K)** | ![Command Palette](docs/screenshots/command-palette-dark.png) |
| **Contact Inquiries Form** | ![Contact Dark](docs/screenshots/contact-dark.png) |
| **Admin Management Portal** | ![Admin Portal](docs/screenshots/admin-dashboard-dark.png) |

---

## Deployment

### Containerized Deployment (Recommended)
Deploy via Docker Compose on any VPS (AWS EC2, DigitalOcean Droplet, Linode, Render):
```bash
# Clone repository
git clone https://github.com/J9d9l9n9-dev/portfolio-website.git
cd portfolio-website

# Configure environment
cp .env.example .env
nano .env  # set secure SECRET_KEY and production DB credentials

# Launch with reverse proxy
docker-compose up -d --build
```

### Serverless / Static Frontend + PaaS Backend
- **Frontend**: Deploy `frontend/` on Vercel or Netlify with build command `npm run build` and publish directory `dist`. Set environment variable `VITE_API_URL=https://api.yourdomain.com/api/v1`.
- **Backend**: Deploy `backend/` on Render, Railway, or Fly.io using the provided `Dockerfile`. Connect a managed PostgreSQL database instance and configure `DATABASE_URL` and `SECRET_KEY`.

---

## Future Improvements

- [ ] Automated end-to-end regression tests running in GitHub Actions CI matrix.
- [ ] Multi-region S3 / Cloudinary cloud storage adapter for project media assets.
- [ ] Webhook integration for real-time Discord / Slack alerts on incoming contact inquiries.
- [ ] Exportable dynamic resume generation directly reflecting the updated database state.

---

## Author

**Jampa Durga Lakshmi Narayana**<br>
*Full-Stack Developer & AI Software Engineer*

- **Email**: [jampadurgalakshminarayana@gmail.com](mailto:jampadurgalakshminarayana@gmail.com)
- **Education**: B.Tech in Computer Science and Engineering, GITAM University (2024 – 2028)
- **GitHub**: [github.com/J9d9l9n9-dev](https://github.com/J9d9l9n9-dev)
- **LinkedIn**: [linkedin.com/in/durgalakshminarayanajampa](https://www.linkedin.com/in/durgalakshminarayanajampa/)
- **LeetCode**: [leetcode.com/u/J9d9l9n9](https://leetcode.com/u/J9d9l9n9/)
