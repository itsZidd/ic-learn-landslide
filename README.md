# 🗺️ I-CARE LANDSLIDE (E-Modul Geografi Kebencanaan Longsor)

![Universitas Negeri Malang](https://img.shields.io/badge/UNIVERSITAS_NEGERI_MALANG-003366?style=for-the-badge&logo=education&logoColor=white)
![SvelteKit](https://img.shields.io/badge/SvelteKit_2.0-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![Svelte 5](https://img.shields.io/badge/Svelte_5.56_Runes-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![LibSQL/Turso](https://img.shields.io/badge/Turso_SQLite-000000?style=for-the-badge&logo=sqlite&logoColor=white)
![Google Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel_Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

**I-CARE LANDSLIDE** is an interactive, gamified e-module for geography and disaster risk reduction (DRR) education, focused on the **Jabung District, Malang Regency, East Java**. Developed at **Universitas Negeri Malang**, it combines real-world geospatial data, interactive 3D map exploration, automated AI essay evaluation, and teacher analytics.

---

## 🚀 What's Built

Here is the complete feature list, grouped by area:

### 🎒 1. Student Learning Engine (5 Interactive Rooms)
- **Room 01 — Introduction**: Plate tectonics, volcanic formation, and 3D Jabung relief morphology.
- **Room 02 — Connection**: Landslide mechanisms (6 types of mass movement) and real-world field news documentation.
- **Room 03 — Application**: Interactive spatial analysis across 5 thematic overlay maps and land conservation guidelines.
- **Room 04 — Reflection**: Dual self-assessment combining a timed 10-question spatial quiz and an AI-evaluated 3-part essay.
- **Room 05 — Extension**: Advanced disaster mitigation drills and practical community preparedness.

### 🎓 2. Teacher Portal & Class Analytics
- **Teacher Authentication**: Isolated portal with configurable environment-based teacher code & password (`TEACHER_CODE` / `TEACHER_PASSWORD`).
- **Responsive Leaderboard**: Dual-view system with desktop compact tables and stacked mobile cards for small viewports (<768px).
- **Pagination & Filters**: Search by student name/email, class/rombel filter, and customizable pagination (10, 25, 50, 100 items per page).
- **Essay Review Drawer**: Complete transparency for teachers to review each student's exact essay answers, sub-scores (Soal A, B, C), and AI feedback.

### 🤖 3. AI-Powered Essay Evaluator
- **Automated AI Grading**: Evaluates student essays using **Google Gemini AI** according to a geography rubric (100-point total score).
- **Contextual Rubric Scoping**: Tailored prompts for Soal A (Jabung risk interpretation), Soal B (thematic maps requirement), and Soal C (mitigation & land conservation).
- **Graceful Heuristic Fallback**: Built-in fallback keyword evaluator ensuring students receive instant feedback even if AI rate limits occur.

### 🎵 4. Gamified Audio & Visual Experience
- **Interactive Audio Engine**: Background music (BGM) and sound effects (SFX) with smooth volume sliders and instant mute toggles.
- **Responsive Environment Layout**: Dynamic vector background landscape, interactive character dialogues, and cloud animations.

### 📜 5. Instant Certificate Generator
- **Automatic Graduation Certificate**: Generates official PDF/image certificates with unique verification IDs (`ICARE-2026-XXXX-XXXX`) upon 100% module completion.

## 🛠️ Tech Stack & Complete Tools Inventory

### 📦 Exhaustive Tools & Libraries Breakdown (Grouped by Role)

#### 1. Core Framework & Build Engine
| Package | Version | Purpose & Usage |
| :--- | :--- | :--- |
| **`svelte`** | `^5.56.1` | Svelte 5 core framework leveraging Runes reactivity (`$state`, `$derived`, `$effect`) |
| **`@sveltejs/kit`** | `^2.63.0` | SvelteKit 2 web framework for routing, SSR, and API server endpoints |
| **`vite`** | `^8.0.16` | Lightning-fast frontend build tool and local development server |
| **`@sveltejs/vite-plugin-svelte`** | `^7.1.2` | Official Vite plugin for compiling Svelte single-file components |
| **`typescript`** | `^6.0.3` | Type safety and static type checking |

#### 2. Styling, Design System & Icons
| Package | Version | Purpose & Usage |
| :--- | :--- | :--- |
| **`tailwindcss`** | `^4.3.0` | Utility-first CSS framework (Tailwind v4 engine) |
| **`@tailwindcss/vite`** | `^4.3.0` | Vite plugin for compiling Tailwind v4 utility styles |
| **`@lucide/svelte` / `lucide-svelte`** | `^1.30.0` / `^1.0.1` | Icon library for vector UI symbols and navigation badges |
| **Custom Animation Engine** | *Native CSS* | Custom `@keyframes` for wind sweep, title float, character bobbing, and 3D tactile borders |

#### 3. Database, ORM & Storage
| Package | Version | Purpose & Usage |
| :--- | :--- | :--- |
| **`@libsql/client`** | `^0.17.4` | LibSQL / Turso client for serverless and local SQLite database queries |
| **`drizzle-orm`** | `^0.45.2` | TypeScript ORM for type-safe database access |
| **`drizzle-kit`** | `^0.31.10` | CLI migration tool and database schema generator |
| **`local.db`** | *SQLite Disk DB* | Local SQLite database file with runtime auto-migration helpers (`ensureColumnsExist`) |

#### 4. AI & Automated Grading
| Technology | Integration | Purpose & Usage |
| :--- | :--- | :--- |
| **Google Gemini AI API** | `HTTP REST API` | Automated evaluation of geography reflection essays and feedback generation in `/api/evaluate-essay` |

#### 5. Authentication & Environment Configuration
| Package | Version | Purpose & Usage |
| :--- | :--- | :--- |
| **`better-auth`** | `^1.6.26` | Authentication framework for user identity and session management |
| **`dotenv`** | `^17.4.2` | Loads configuration variables from `.env` into server environment |
| **`$env/dynamic/private` & `public`** | *SvelteKit Env* | Dynamic environment variable access for server secrets and client flags |

#### 6. Document Generation & Asset Export
| Package | Version | Purpose & Usage |
| :--- | :--- | :--- |
| **`jspdf`** | `^4.2.1` | Client-side PDF creation for graduation certificates |
| **`html-to-image`** | `^1.11.13` | Renders HTML DOM nodes into canvas PNG/JPEG images for certificate downloads |

#### 7. Hosting & Deployment
| Package | Version | Purpose & Usage |
| :--- | :--- | :--- |
| **`@sveltejs/adapter-vercel`** | `^6.3.4` | Official SvelteKit adapter for deploying serverless endpoints and static assets to Vercel |
| **`@sveltejs/adapter-auto`** | `^7.0.1` | Environment auto-detection adapter fallback |

#### 8. Code Quality, Formatting & Linting
| Package | Version | Purpose & Usage |
| :--- | :--- | :--- |
| **`prettier`** | `^3.8.3` | Opinionated code formatting tool |
| **`prettier-plugin-svelte`** | `^4.1.0` | Prettier plugin for formatting `.svelte` components |
| **`prettier-plugin-tailwindcss`** | `^0.8.0` | Automatically sorts Tailwind CSS class names |
| **`eslint`** | `^10.4.1` | Linter engine for JavaScript and TypeScript |
| **`eslint-plugin-svelte`** | `^3.19.0` | ESLint rules for Svelte template syntax |
| **`svelte-check`** | `^4.6.0` | Svelte template type checking CLI tool |
| **`typescript-eslint`** | `^8.60.1` | TypeScript parser for ESLint |

---

## 📖 A Story Worth Telling

### 💬 1. Why We Left Articulate Storyline 360

The project didn't start as a rebuild — it started as a bug report. The original course (`IC-LEARN_v2.7`, published from **Articulate Storyline 360**) was already live, but riddled with small, frustrating breaks: buttons that clicked silently with no sound feedback, animations that felt clunky, and a general sense that "everything" was fragile and hard to keep working together. The original ask was simple: *port this to something like SvelteKit or Next.js — is that even possible?*

The honest answer started with a reality check. There was no `.story` source file anywhere in the repo — only the compiled HTML5 export (minified per-slide JS, a proprietary trigger/timeline blob in `data.js`/`frame.xml`, raw assets). Storyline's interactivity isn't code in any normal sense; it's data interpreted by a closed-source runtime. That meant there was no such thing as an automated conversion — porting could only mean a full rebuild, using the existing export purely as a reference and asset source (text, images, audio, slide order), reimplemented by hand in a real framework.

Before committing to that scope, the course was inventoried directly from `data.js` rather than guessed at: **32 slides, 609 objects, 902 events, 2717 actions, 63 global variables.** That data explained the original bug report precisely — the course had **147 clickable buttons**, but only **7 explicit sound-play actions** anywhere in it. "Not all buttons have sound" wasn't a rendering glitch; it was literally missing wiring, because Storyline requires every single object's sound trigger to be authored one-by-one with no shared default. About 95% of buttons simply never got one. That's exactly the class of bug a component-based rebuild eliminates by construction — sound becomes a property of one shared `Button` component instead of 147 individual afterthoughts.

**SvelteKit was chosen over Next.js** because the course itself has no real backend need — it's a branching slide sequence with client-side state, not a data-fetching app. SvelteKit's smaller runtime and built-in transitions were judged a better fit for getting animation and interactivity right than React's overhead would have been. Rather than replicating Storyline's 2717 actions and 1159 variable-adjustment calls 1:1, the plan was to reproduce the *behavior* of each slide/branch as clean, data-driven Svelte components — which is what eventually became this repository.

### 💡 2. The AI Prompt Alignment Challenge (Soal B Evaluation)
During early testing, the Gemini AI evaluator incorrectly penalized students on **Soal B** (which asks for the 4 thematic maps needed for landslide risk mapping: *rainfall, slope/topography, geology, and land use*). The AI was misapplying generic prompt instructions from Soal A and expecting students to discuss "longsor translasi" instead of thematic mapping.

To fix this, we re-engineered the prompt architecture in [`src/routes/api/evaluate-essay/+server.ts`](file:///c:/Users/Zidan/Documents/IC-LEARN/src/routes/api/evaluate-essay/+server.ts). We added strict negative constraints telling Gemini: *"Soal B is strictly about thematic maps (curah hujan, lereng, geologi, penggunaan lahan). Do NOT demand mentions of longsor translasi for Soal B."* This eliminated false negatives and aligned AI scores with geography teaching standards.

### 🔄 3. Zero-Downtime Database Auto-Migrations
When we expanded the database schema to store full student essay review records (`latestEssayAnswerA/B/C`, `latestEssayFeedback`, and `latestEssayRubric`), existing SQLite `local.db` files crashed with `no such column` errors. 

Rather than forcing users to wipe their database or run manual CLI migrations, we built runtime auto-migration helpers (`ensureColumnsExist()`) inside [`src/routes/api/students/+server.ts`](file:///c:/Users/Zidan/Documents/IC-LEARN/src/routes/api/students/+server.ts) and [`src/routes/api/progress/+server.ts`](file:///c:/Users/Zidan/Documents/IC-LEARN/src/routes/api/progress/+server.ts). Before executing queries, the server inspects the SQLite table schema and runs targeted `ALTER TABLE` statements automatically.

---

## ⚠️ Known Limitations

1. **Heavy Media Bandwidth Requirement**:
   - The e-module includes high-resolution 3D map overlays and field video documentation (up to 68MB MP4). A stable internet connection (min. 5 Mbps) is required for smooth playback without buffering.
2. **AI Essay Latency & Fallback**:
   - AI essay grading takes 2–4 seconds depending on Google Gemini API response times. If the API is unreachable, a fallback keyword scorer estimates marks so student progress is never blocked.
3. **Model Answer Key Hidden**:
   - To encourage independent learning, the app intentionally does not show the exact model answers to students after evaluation.
4. **Specific Geographic Scope**:
   - Risk classifications and thematic maps are specifically tailored to Jabung District, Malang Regency. Adapting to other districts requires uploading new GIS layers.

---

## ⚙️ Environment Variables Configuration (`.env`)

Create a `.env` file in the root directory:

```env
# Database Configuration (LibSQL / Turso SQLite)
TURSO_DATABASE_URL="libsql://ic-learn-your-subdomain.turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"

# AI Evaluator (Google Gemini API Key)
GEMINI_API_KEY="your-google-gemini-api-key"

# Authentication & Production Secrets
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="https://your-domain.vercel.app"

# Feature Flags & Teacher Credentials
PUBLIC_SHOW_DEV_TOOLS=false
TEACHER_CODE="GURU2026"
TEACHER_PASSWORD="guru123456"
```

---

## 🚀 Local Setup & Deployment

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Run type check and build validation
npm run check
npm run build
```

To deploy to **Vercel**:
1. Connect your repository to **Vercel**.
2. Add all environment variables listed above in **Project Settings ➔ Environment Variables**.
3. Deploy!
