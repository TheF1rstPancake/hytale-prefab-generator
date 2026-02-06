# Hytale Prefab Generator - Progress Report

**Date**: 2026-02-05
**Status**: MCP Server Complete ✅

---

## What We've Built

### ✅ Phase 1: Asset Discovery & Extraction (COMPLETE)

**Discovered**:
- 733 Hytale blocks across 12 categories
- 653 block textures in `Common/BlockTextures/`
- Complete block definition format documented
- Real prefab example analyzed (TavernHouse.prefab.json)

**Key Files**:
- [PREFAB_SCHEMA.md](PREFAB_SCHEMA.md) - Complete prefab format documentation
- [ASSET_EXPLORATION_*.md](.) - Detailed asset structure analysis

**Findings**:
- Prefab format is simple: JSON with blocks array
- Each block: `{x, y, z, name, rotation?}`
- Sparse storage (no air blocks needed)
- Coordinates can be negative (relative to anchor)
- 733 blocks available (no need to guess or hardcode)

### ✅ Phase 2: MCP Server (COMPLETE)

**Built**: Full-featured MCP server for Claude Desktop

**Location**: `mcp-server/`

**Tools Provided**:
1. `search_blocks` - Find blocks by name/category/type
2. `get_block_info` - Get detailed block information
3. `list_categories` - Browse block categories
4. `get_blocks_by_category` - Get all blocks in a category
5. `validate_prefab` - Validate prefab JSON before saving
6. `save_prefab` - Save prefabs to disk
7. `list_prefabs` - List saved prefabs

**Block Registry**:
- 733 blocks extracted from Hytale assets
- Searchable by name, type, tags
- Categorized (Rock, Ores, TreeWood, Plants, etc.)
- Ready for Claude to query on-demand

**Key Achievement**:
✨ **Zero token overhead** - Claude queries blocks only when needed, not loaded in system prompt

---

## Architecture Decision: Why MCP > Artifact

### Original Plan: Claude Artifact
- Self-contained React app in Claude.ai
- Blocks hardcoded in system prompt (50+ blocks = 15K+ tokens)
- Can't access local Hytale installation
- Limited iteration (new artifact each change)

### New Plan: MCP + Local App
- Claude Desktop + MCP server + Local web preview
- Query-based block access (0 tokens wasted)
- Full 733 block library available
- Seamless iteration (Claude updates prefab → web app refreshes)
- Reads textures from local Hytale install

### Comparison

| Feature | Artifact | MCP + Local |
|---------|----------|-------------|
| Setup | ✅ Zero | ⚠️ 5 minutes |
| Blocks | ❌ ~20 | ✅ 733 |
| Tokens | ❌ 15K+ | ✅ ~100 |
| Iteration | ⚠️ Clunky | ✅ Seamless |
| Textures | ⚠️ CDN | ✅ Local install |
| Validation | ❌ None | ✅ Real-time |

**Verdict**: MCP is superior for actual use. Artifact good for demos only.

---

## How It Works

### Workflow

```
1. User opens Claude Desktop (with MCP server configured)
2. User: "Build me a medieval tower"
3. Claude:
   - Calls search_blocks("stone brick")
   - Calls search_blocks("wood planks")
   - Generates prefab JSON structure
   - Calls validate_prefab(...) to check it
   - Calls save_prefab("medieval_tower", ...)
4. Web preview app (if running) auto-renders the structure
5. User: "Make it taller, add windows"
6. Claude: Updates prefab → saves → preview refreshes
7. User: "Perfect! Save to Hytale"
8. Claude: Copies to Hytale prefabs folder
```

### Smart Block Discovery

Instead of:
```
System prompt: Here are 500 blocks... (50,000 tokens)
```

We do:
```
User: "I need stone"
Claude: *searches "stone"* → gets 12 results
Claude: *picks Rock_Stone_Brick*
```

**Claude IS the semantic layer!**

---

## What's Next

### 🔜 Phase 3: Local Web Preview App

**Purpose**: Visualize generated prefabs in 3D

**Tech Stack**:
- React + Three.js
- Vite for dev server
- File watcher (auto-reload on prefab changes)
- Texture loader (from Hytale install)

**Features**:
- 3D voxel rendering
- Orbit controls (rotate, zoom, pan)
- Material counter (block counts)
- Export button (copy to Hytale folder)
- Screenshot capability

**Estimated Time**: 2-3 days

### 🔜 Phase 4: Claude Desktop Configuration

**Tasks**:
- Add MCP server to Claude Desktop config
- Test tool access
- Write user guide

**Estimated Time**: 30 minutes

### 🔜 Phase 5: Texture Extraction & Atlas

**Tasks**:
- Extract textures from Hytale assets
- Build texture atlas for Three.js
- Generate UV coordinates
- Deploy or bundle with web app

**Estimated Time**: 1-2 days

### 🔜 Phase 6: End-to-End Testing

**Tasks**:
- Test full workflow with real prompts
- Validate prefabs load in Hytale
- Test rotation values experimentally
- Document any edge cases

**Estimated Time**: 1 day

### 📅 Future Enhancements

- Rotation support (map 1-11 to orientations)
- State-based blocks (doors, trapdoors)
- Complex block models (stairs, slabs)
- Hytale plugin (in-game placement)
- Voice input (Web Speech API)
- Desktop app (Tauri, all-in-one package)

---

## File Structure

```
hytale-prefab-generator/
├── PLAN.md                      # Original plan
├── PREFAB_SCHEMA.md            # Prefab format documentation
├── PROGRESS.md                 # This file
├── ASSET_EXPLORATION_*.md      # Asset discovery docs
│
├── mcp-server/                 # ✅ COMPLETE
│   ├── src/
│   │   └── index.js           # MCP server implementation
│   ├── scripts/
│   │   └── build-block-registry.js
│   ├── data/
│   │   ├── block-registry.json (733 blocks)
│   │   ├── categories.json
│   │   └── textures.json
│   ├── prefabs/               # Saved prefabs
│   ├── package.json
│   └── README.md
│
└── preview-app/               # 🔜 TODO: Next phase
    ├── src/
    │   ├── components/
    │   │   ├── Viewer3D.jsx
    │   │   └── Controls.jsx
    │   ├── lib/
    │   │   ├── PrefabLoader.js
    │   │   └── TextureAtlas.js
    │   └── App.jsx
    └── package.json
```

---

## Quick Start Guide

### 1. Build Block Registry
```bash
cd mcp-server
npm install
npm run build-registry
```

### 2. Test MCP Server
```bash
npm start
# Should see: ✅ Loaded 733 blocks from registry
# Ctrl+C to stop
```

### 3. Configure Claude Desktop
Add to `~/.config/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "node",
      "args": ["/home/giovanni/scratch/hytale-prefab-generator/mcp-server/src/index.js"]
    }
  }
}
```

### 4. Restart Claude Desktop

### 5. Test in Claude
```
Can you search for stone blocks in Hytale?
```

---

## Key Decisions Made

### 1. ✅ Skip YAML Intermediate Format
**Why**: Modern LLMs generate JSON reliably. No need for extra conversion step.

### 2. ✅ MCP Server > Claude Artifact (for V1)
**Why**:
- Full block library (733 vs 20)
- Query-based (0 token overhead)
- Better iteration UX
- Local file access

### 3. ✅ Simple Text Search (No Semantic Layer)
**Why**:
- Block names are structured
- Claude is the semantic layer
- 733 blocks, not millions
- Can iterate on searches

### 4. ✅ Extract Textures Later
**Why**:
- MCP server works without rendering
- Prefab generation can be tested immediately
- Textures needed only for preview app

---

## Testing Strategy

### Unit Tests (TODO)
- Block search (exact, partial, category)
- Prefab validation (valid, invalid, warnings)
- File operations (save, list)

### Integration Tests (TODO)
- MCP server ↔ Claude Desktop
- Prefab generation ↔ Hytale loading
- Web app ↔ File watcher

### Manual Tests (TODO)
- Generate 10+ diverse structures
- Load each in Hytale
- Verify appearance matches expectation
- Document any issues

---

## Success Metrics

### MCP Server ✅
- [x] 733 blocks extracted
- [x] 7 tools implemented
- [x] Starts without errors
- [x] README with setup guide

### Preview App 🔜
- [ ] Renders basic cubes
- [ ] Loads textures from Hytale
- [ ] Auto-refreshes on file change
- [ ] Material counter works

### End-to-End 🔜
- [ ] Claude generates valid prefab
- [ ] Prefab loads in Hytale
- [ ] Structure appears correctly
- [ ] Can iterate on design

---

## Blockers / Risks

### ⚠️ Low Risk
- Rotation mapping unknown (can test manually)
- State-based blocks complex (skip for V1)
- Texture extraction might be slow (one-time cost)

### ✅ Resolved
- ~~Prefab format unknown~~ → Documented from TavernHouse example
- ~~Block list unknown~~ → Extracted 733 blocks from assets
- ~~Token overhead~~ → MCP query-based approach

---

## Timeline (Revised)

| Phase | Status | Time |
|-------|--------|------|
| Asset discovery | ✅ Complete | 3 hours |
| MCP server | ✅ Complete | 4 hours |
| Preview app | 🔜 Next | 2-3 days |
| Texture extraction | 🔜 Pending | 1-2 days |
| End-to-end testing | 🔜 Pending | 1 day |
| **Total** | **In Progress** | **~1 week** |

---

## Next Action Items

1. **Immediate**:
   - [ ] Configure Claude Desktop with MCP server
   - [ ] Test search_blocks tool
   - [ ] Generate first test prefab with Claude

2. **This Week**:
   - [ ] Build preview app (React + Three.js)
   - [ ] Extract textures from Hytale
   - [ ] Create texture atlas
   - [ ] Test full workflow

3. **Documentation**:
   - [ ] User installation guide
   - [ ] Video demo
   - [ ] Example prompts

---

## Resources

- **Hytale Assets**: `/home/hytale/server/Assets.zip`
- **MCP Server**: `/home/giovanni/scratch/hytale-prefab-generator/mcp-server/`
- **Documentation**: See `*.md` files in project root
- **Example Prefab**: `/tmp/TavernHouse.prefab.json`

---

**Status**: Ready for Claude Desktop integration and first test! 🚀
