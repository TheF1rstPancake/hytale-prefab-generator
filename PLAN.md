# Hytale AI Architect — Action Plan

## Project Summary

**Product:** A voice/text-to-voxel building tool that works inside an LLM chat window (Claude Artifact). Users describe a structure in natural language, an LLM generates it, a 3D preview renders in-browser with real Hytale textures, and the user downloads a `.prefab.json` file to load in-game.

**Core Flow:**

```
User speaks/types description
  → LLM generates structure (YAML)
  → Converter transforms to Hytale .prefab.json
  → Three.js renders 3D preview with real textures (loaded from CDN)
  → User reviews, requests changes, iterates
  → User downloads .prefab.json
  → Hytale plugin loads and places structure in-game
```

---

## Architecture Overview

The project has three tiers, built in phases:

| Tier | What | Key Benefit |
|------|------|-------------|
| **Tier 1: Claude Artifact** | React app running inside Claude.ai | Zero setup — anyone can try it immediately |
| **Tier 2: Desktop App** | Tauri/Electron app with Ollama + BYOK support | Full features, local AI, better rendering |
| **Tier 3: Hytale Plugin** | Java server plugin | In-game placement, ghost preview, inventory checks |

---

## Phase 1: Asset Extraction & Packaging Pipeline

**Goal:** Package Hytale block textures into a web-consumable format hosted on a CDN so the Claude Artifact (and any web app) can render real blocks.

### 1.1 — Hytale Texture Extraction Plugin (Java)

- **What:** A Hytale server plugin that extracts all block textures from the game's asset files.
- **Command:** `/extracttextures`
- **Output:**

```
extracted_assets/
├── raw/
│   └── blocks/
│       ├── hytale_stone_bricks.png  (16×16)
│       ├── hytale_oak_planks.png    (16×16)
│       └── ... (~350 block textures)
└── metadata/
    ├── blocks.json          (block registry: IDs, names, categories, tags, properties)
    └── extraction_manifest.json  (timestamp, Hytale version, counts)
```

- **Key metadata per block:** `id`, `name`, `category`, `tags[]`, `texture_file`, `properties` (transparent, luminance, hardness, tool_required).

### 1.2 — Asset Packaging Script (Node.js)

- **What:** Takes the extracted textures, generates an optimized texture atlas and metadata files ready for CDN deployment.
- **Input:** `extracted_assets/` directory from the extraction plugin.
- **Output:**

```
web_assets/
├── atlases/
│   ├── blocks.png       (2048×2048 texture atlas)
│   └── blocks.webp      (same, smaller)
├── metadata/
│   ├── blocks.json      (block registry + UV coordinates)
│   ├── categories.json  (block categories and tag index)
│   └── manifest.json    (version info, file sizes, stats)
└── README.md
```

- **Behavior:** Destructive rebuild on every run — delete `web_assets/`, regenerate everything fresh. Git handles change tracking.
- **Atlas layout:** Simple grid, row-major. All Hytale block textures are 16×16, so bin-packing isn't needed.
- **Optimization:** PNG compression via pngquant, WebP conversion via sharp/imagemin.
- **CLI usage:**

```bash
npm install
node package-hytale-assets.js                 # defaults
node package-hytale-assets.js --dry-run        # validate only
node package-hytale-assets.js --verbose        # detailed logging
```

- **Dependencies:** `canvas`, `sharp`, `pngquant-bin`, `imagemin`, `imagemin-pngquant`, `imagemin-webp`, `chalk`, `commander`, `ora`.

### 1.3 — CDN Deployment

Host `web_assets/` on GitHub Pages (free, CORS-enabled, cached):

```bash
cd web_assets
git init && git add . && git commit -m "Hytale web assets v1.0.0"
git remote add origin https://github.com/<user>/hytale-web-assets
git push -u origin main
# Enable GitHub Pages in repo settings
# Assets at: https://<user>.github.io/hytale-web-assets/
```

**Alternatives:** Cloudflare R2 (free tier: 10 GB storage, unlimited egress) or Bunny CDN (~$1/mo).

**Legal posture:** Include clear attribution ("Textures © Hypixel Studios. Fan-made tool, not affiliated."). Precedent: Minecraft texture repos have existed for 10+ years without DMCA takedowns. If Hypixel requests removal, comply immediately and fall back to desktop-app-reads-local-install approach.

---

## Phase 2: Prefab Format

### 2.1 — Known Facts

| Detail | Value |
|--------|-------|
| File extension | `.prefab.json` |
| Format | JSON |
| Location (Windows) | `%AppData%\Hytale\UserData\Saves\[WorldName]\prefabs\` |
| Location (Linux) | `~/.local/share/Hytale/UserData/Saves/[WorldName]/prefabs/` |
| Internal API | `BlockSelection` class with block data, fluid data, entity data, anchor, bounds |

### 2.2 — Prefab Inspector Plugin (Java)

**Before building the converter, we need to document the real schema.** Build a small Hytale plugin that:

1. Saves a test prefab in-game (copy a known structure).
2. Reads the resulting `.prefab.json` from disk.
3. Logs the full JSON structure to console.
4. Writes a `prefab-schema-example.json` documentation file.

**Command:** `/inspectprefab <filename>`

### 2.3 — LLM-Friendly Format (YAML)

LLMs generate structured YAML more reliably than complex JSON. Define a simplified format for LLM output:

```yaml
id: medieval_tower
size: [5, 10, 5]        # [width, height, depth]
blocks:
  S: hytale:stone_bricks
  W: hytale:oak_planks
  G: hytale:glass_pane
  A: hytale:air
structure:
  # Each item = one Y-layer (bottom to top)
  # Within a layer, rows separated by |, chars = X-axis blocks
  - "SSSSS|SWWWS|SWWWS|SWWWS|SSSSS"
  - "SSSSS|SWAWS|SWAWS|SWAWS|SSSSS"
  # ... (10 layers total)
```

**Rules for the LLM system prompt:**

- Single-character palette keys (A–Z, 0–9).
- `A` always means `hytale:air`.
- Layers stack bottom-up (Y-axis).
- Rows within a layer = Z-axis, characters = X-axis.
- Size must match actual dimensions.
- Use only block IDs from a curated list of ~50 common blocks (provided in the system prompt, ~1,000 tokens).

### 2.4 — YAML → .prefab.json Converter (Node.js)

Transforms the LLM-friendly YAML into the real Hytale `.prefab.json` format (schema determined by the inspector plugin). Also used by the web app to produce downloadable files.

---

## Phase 3: Web Renderer (Three.js)

### 3.1 — Texture Loading

```
1. Fetch atlas.png from CDN (one-time, ~2 MB compressed)
2. Fetch blocks.json from CDN (UV coordinates + metadata, ~50 KB)
3. Create THREE.CanvasTexture with NearestFilter (pixelated look)
4. For each block in the structure, apply UV mapping from blocks.json
```

Detect device pixel ratio and load `@2x` atlas on high-DPI screens.

### 3.2 — Renderer Class

A `HytaleBlockRenderer` class that:

- `initialize()` — loads atlas + metadata from CDN.
- `renderBlock(blockId, x, y, z, scene)` — creates a textured cube with correct UVs.
- `renderStructure(structure, scene)` — iterates layers, rows, chars and renders all non-air blocks.
- `searchBlocks(query)` — searches by name/tag for a block picker UI.
- `getBlocksByCategory(category)` — returns blocks in a category.

### 3.3 — React Component

A `<HytalePreview structure={...} />` component with:

- Three.js scene + WebGLRenderer.
- OrbitControls (rotate, zoom, pan).
- Ambient + directional lighting.
- Automatic camera positioning based on structure bounds.

---

## Phase 4: Claude Artifact (Tier 1 MVP)

A single React artifact running inside Claude.ai that provides the full experience with no setup:

### Features

- **Text input** — describe what you want built.
- **Voice input** — Web Speech API (browser-native speech-to-text).
- **3D preview** — Three.js with real Hytale textures from CDN.
- **Material counter** — lists all blocks needed and quantities.
- **Edit/iterate** — "make it taller," "add a door," "use cobblestone instead."
- **Download** — exports `.prefab.json` file via browser download.
- **Example templates** — pre-built structures to start from.

### How It Works in Practice

1. User opens Claude.ai, asks to build something.
2. Claude generates the artifact + the structure YAML inline in the same response.
3. Artifact loads textures from GitHub Pages CDN.
4. Three.js renders the structure with real block textures.
5. User requests changes → Claude modifies the YAML → artifact re-renders.
6. User clicks Download → gets `.prefab.json`.

### Limitations

- No persistent storage (session-based).
- Can't place directly in-game (needs plugin).
- Limited to Claude's context window for iteration history.

---

## Phase 5: Desktop App (Tier 2)

### Tech Stack

**Recommended: Tauri** (Rust backend, ~3 MB bundle vs. Electron's ~100 MB).

### LLM Provider Support

| Provider | How It Works |
|----------|--------------|
| **Ollama (local)** | HTTP to `localhost:11434`. Free, private, unlimited. Recommended models: `llama3.2:3b` (fast), `codellama:13b` (better structured output), `mixtral:8x7b` (best quality). |
| **Claude (BYOK)** | Anthropic API with user's own API key. |
| **OpenAI (BYOK)** | OpenAI API with user's own API key. |

### Additional Features Over Artifact

- Persistent structure library (save/load).
- Better 3D rendering (can bundle textures or read from local Hytale install).
- Direct export to Hytale prefab folder.
- Hot-reload: watch prefab folder for changes.

### Texture Loading Strategy (Desktop)

1. Try to detect local Hytale installation → read textures directly (Litematica model).
2. Fall back to CDN-hosted atlas.
3. Fall back to bundled basic atlas (~50 common blocks).

---

## Phase 6: Hytale Plugin (Tier 3)

### Commands

```
/aiarchitect place <filename>    — place structure at cursor position
/aiarchitect preview <filename>  — show ghost block preview
/aiarchitect list                — list available .prefab files
/aiarchitect reload              — reload prefab folder
/aiarchitect cancel              — cancel current placement
```

### Core Logic

1. Watch `%AppData%/.../aiarchitect/prefabs/` for new files.
2. Parse `.prefab.json`.
3. Check player inventory for required materials.
4. Show ghost preview (semi-transparent blocks).
5. On confirmation, place blocks via `world.setBlock()` and consume materials.

---

## Licensing

### Recommended: Business Source License (BSL) 1.1

```
Licensed under the Business Source License 1.1

Change Date: [Current Date + 2 Years]
Change License: Apache 2.0

Additional Use Grant:
  ✅ Personal use — unlimited, free
  ✅ Educational use — unlimited, free
  ✅ Non-commercial servers — unlimited, free
  ❌ Commercial use — requires commercial license

Commercial Use Definition:
  - Running paid Hytale servers using this mod
  - Offering this as a paid service / SaaS
  - Embedding in paid products
  - Revenue > $10,000/year from services using this mod

After the Change Date, code becomes Apache 2.0 (fully open source).
```

**Why BSL:** Used by HashiCorp, MariaDB, CockroachDB. Legally tested, simple to understand, converts to open source after X years.

**Alternative:** Elastic License 2.0 (used by Elasticsearch/Kibana). Prohibits hosted/managed service offering and license key circumvention.

### Commercial Tiers

| Tier | Price | Includes |
|------|-------|----------|
| Server License | $99/server/year | Run on commercial Hytale servers, unlimited players, priority support |
| SaaS License | Negotiated | Build web services on top. 10% of gross or $500/mo minimum |
| White Label | Negotiated | Embed in own product, no branding requirements |

---

## Go-to-Market

### Phase 1: Viral Launch (Weeks 1–4)

- Post the Claude Artifact publicly (r/hytale, Twitter/X, Discord).
- Headline: "I built a voice-controlled Hytale building AI in Claude."
- YouTube demo (3–5 min): "Build ANYTHING in Hytale with your VOICE."
- CurseForge plugin release (free).

### Phase 2: Desktop App Beta (Weeks 5–12)

- GitHub Releases (Win/Mac/Linux).
- Clear Ollama setup + BYOK instructions.
- Content creator outreach: free commercial licenses to top Hytale YouTubers.

### Phase 3: Commercial Licensing (Month 4+)

- Reach out to top 50 Hytale server networks ($99/server).
- Sponsor Hytale building competitions.

---

## Timeline

### Week 1–2: Asset Pipeline

| Day | Task |
|-----|------|
| 1–2 | Build Java texture extraction plugin |
| 3–4 | Build Node.js packaging script |
| 5 | Test full extraction → packaging pipeline |
| 6 | Deploy to GitHub Pages |
| 7 | Documentation |

### Week 2–3: Prefab Format

| Day | Task |
|-----|------|
| 1–2 | Build Prefab Inspector plugin, document real `.prefab.json` schema |
| 3–4 | Build YAML → `.prefab.json` converter |
| 5 | Test round-trip: generate YAML → convert → load in Hytale |

### Week 3–4: Claude Artifact MVP

| Day | Task |
|-----|------|
| 1–2 | Three.js renderer with CDN-loaded textures |
| 3–4 | Voice + text input, structure generation |
| 5–6 | Material counter, download, iteration UX |
| 7 | Polish, examples, testing |

### Month 2: Desktop App

- Tauri app scaffold.
- Ollama + Claude + OpenAI provider integration.
- Persistent structure library.
- Local Hytale install texture reading.

### Month 3: Hytale Plugin

- In-game placement commands.
- Ghost preview.
- Inventory material check + consumption.

---

## Open Questions / Next Steps

1. **Prefab format:** The real `.prefab.json` schema hasn't been fully documented yet. The Inspector plugin is the critical first step — everything downstream depends on knowing the exact format.
2. **Block ID registry:** Need to extract the full list of valid block IDs from Hytale. The extraction plugin should output this. For MVP, a curated list of ~50 common blocks is sufficient.
3. **Coordinate system:** Need to confirm which axis is which (X = width? Y = height? Z = depth?) and whether layers stack bottom-up or top-down. The Inspector plugin will answer this.
4. **3D block models:** Some Hytale blocks use full 3D models (doors, stairs) not just textured cubes. For MVP, render everything as cubes. Handle complex models in a later phase.
5. **Community texture hosting:** Consider creating an org-level GitHub repo (`hytale-community/textures`) so maintenance isn't on one person. Alternatively, email Hypixel Studios requesting official permission or an asset CDN for community tools.

---

## Revenue Projections (Conservative)

| | Year 1 | Year 2 |
|---|--------|--------|
| Free users | 10,000 | 50,000 |
| Server licenses | 20 × $99 = $1,980 | 100 × $99 = $9,900 |
| Commercial deals | 2 × $500/mo = $12,000 | 10 × $500/mo = $60,000 |
| **Total** | **~$14,000** | **~$70,000** |

---

## Key References

| Resource | URL |
|----------|-----|
| Hytale Modding Docs | https://britakee-studios.gitbook.io/hytale-modding-documentation |
| Hytale Community Docs | https://hytale-docs.com |
| CurseForge Hytale Mods | https://www.curseforge.com/hytale/mods |
| Hytale Plugin Template | https://github.com/realBritakee/hytale-template-plugin |
| Hytale Prefab Docs (Unofficial) | https://hytale-docs.pages.dev |
| Ollama | https://ollama.ai |
| Three.js Voxel Example | https://threejs.org/examples/#webgl_geometry_minecraft |
| Anthropic API | https://docs.anthropic.com |
| Minecraft Assets Precedent | https://github.com/InventivetalentDev/minecraft-assets |
