# Hytale Prefab Format Documentation

**Source:** Analysis of `TavernHouse.prefab.json` from CurseForge
**Date:** 2026-02-05
**File Size:** 546 KB (2,715 blocks, 36,333 lines)

---

## Schema Structure

### Top-Level Format

```json
{
  "version": 8,
  "blockIdVersion": 10,
  "anchorX": 0,
  "anchorY": 0,
  "anchorZ": 0,
  "blocks": [ /* array of block objects */ ]
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `version` | integer | Prefab format version (observed: `8`) |
| `blockIdVersion` | integer | Block ID registry version (observed: `10`) |
| `anchorX`, `anchorY`, `anchorZ` | integer | Placement origin point (default: `0, 0, 0`) |
| `blocks` | array | Array of block objects |

---

## Block Object Structure

### Basic Block

```json
{
  "x": -12,
  "y": 12,
  "z": -7,
  "name": "Wood_Oak_Branch_Short"
}
```

### Block with Rotation

```json
{
  "x": -12,
  "y": 12,
  "z": -7,
  "name": "Wood_Oak_Branch_Short",
  "rotation": 3
}
```

### Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `x` | ✅ Yes | integer | X coordinate (can be negative) |
| `y` | ✅ Yes | integer | Y coordinate (vertical, upward positive) |
| `z` | ✅ Yes | integer | Z coordinate (can be negative) |
| `name` | ✅ Yes | string | Block identifier |
| `rotation` | ❌ Optional | integer | Orientation (values: 1-11) |

---

## Coordinate System

### Axes
- **X-axis**: Width (negative to positive)
- **Y-axis**: Height (0 = ground level, positive = up)
- **Z-axis**: Depth (negative to positive)

### Example Structure Bounds
**TavernHouse dimensions:** 26W × 20H × 21D

```
X: -12 to +13 (26 blocks wide)
Y:   0 to +19 (20 blocks tall)
Z: -10 to +10 (21 blocks deep)
```

### Key Observations
- ✅ Coordinates can be **negative** (relative to anchor point)
- ✅ **Sparse storage** — only solid blocks are stored (no air/empty blocks)
- ✅ Coordinates are **absolute**, not relative to structure bounds

---

## Block Naming Convention

### Standard Blocks

Format: `Category_Material_Type_Variant`

Examples:
- `Wood_Oak_Trunk_Half`
- `Soil_Clay_Smooth_Lime`
- `Rock_Stone_Brick`
- `Furniture_Village_Window`

### State-Based Blocks

Format: `*Category_Type_State_Definitions_VariantName`

Examples:
- `*Furniture_Village_Door_State_Definitions_CloseDoorOut`
- `*Wood_Softwood_Roof_State_Definitions_Inverted_Corner_Left`
- `*Wood_Village_Wall_White_Full_State_Definitions_Bottom`

**Note:** Asterisk prefix indicates a block with state definitions (e.g., open/closed doors, wall segments)

---

## Rotation System

### Statistics from TavernHouse
- **992 blocks** (36% of total) have rotation values
- **Range:** 1-11 (no 0, appears 1-indexed)

### Distribution

| Rotation | Count | Likely Use |
|----------|-------|------------|
| 1 | 107 | ? |
| 2 | 197 | Most common |
| 3 | 182 | Second most common |
| 4 | 151 | ? |
| 5 | 141 | ? |
| 6 | 48 | ? |
| 7 | 48 | ? |
| 8 | 68 | ? |
| 9 | 19 | Rare |
| 10 | 17 | Rare |
| 11 | 14 | Rare |

### ❓ Open Question
**What do rotation values 1-11 represent?**
- Likely: Cardinal directions (N/S/E/W) + vertical orientations
- Applies to: Stairs, doors, fences, beams, roof pieces
- **Needs experimentation** to map values to actual orientations

---

## Block Types Found in TavernHouse (40 unique)

### Structural Blocks (8)
- `Rock_Chalk_Brick_Half`
- `Rock_Stone_Brick`
- `Soil_Clay_Brick_Half`
- `Soil_Clay_Smooth_Lime`
- `Soil_Grass_Full`
- `Wood_Hardwood_Planks`
- `Wood_Hardwood_Planks_Half`
- `Wood_Softwood_Planks_Half`

### Wood & Beams (11)
- `Wood_Hardwood_Beam`
- `Wood_Hardwood_Fence`
- `Wood_Hardwood_Ornate`
- `Wood_Oak_Branch_Short`
- `Wood_Oak_Trunk`
- `Wood_Oak_Trunk_Half`
- `Wood_Oak_Trunk_Stairs`
- `Wood_Softwood_Beam`
- `Wood_Softwood_Planks`
- `Wood_Village_Wall_White_Full`
- `Prototype_Wood_Hardwood_Fence_Platform`

### Roofing (3)
- `Wood_Softwood_Roof`
- `Wood_Softwood_Roof_Flat`
- `Wood_Softwood_Roof_Hollow`

### Furniture & Functional (5)
- `Furniture_Human_Ruins_Window`
- `Furniture_Kweebec_Door`
- `Furniture_Tavern_Trapdoor`
- `Furniture_Village_Window`

### Natural/Decorative (3)
- `Plant_Flower_Common_Pink`
- `Plant_Flower_Common_Red2`
- `Plant_Flower_Tall_Yellow`

### State-Based Blocks (11)
- `*Furniture_Tavern_Trapdoor_State_Definitions_OpenDoorOut`
- `*Furniture_Village_Door_State_Definitions_CloseDoorIn`
- `*Furniture_Village_Door_State_Definitions_CloseDoorOut`
- `*Furniture_Village_Trapdoor_State_Definitions_OpenDoorOut`
- `*Wood_Softwood_Roof_Hollow_State_Definitions_Inverted_Corner_Left`
- `*Wood_Softwood_Roof_Hollow_State_Definitions_Inverted_Corner_Right`
- `*Wood_Softwood_Roof_State_Definitions_Inverted_Corner_Left`
- `*Wood_Softwood_Roof_State_Definitions_Inverted_Corner_Right`
- `*Wood_Village_Wall_White_Full_State_Definitions_Bottom`
- `*Wood_Village_Wall_White_Full_State_Definitions_Middle`
- `*Wood_Village_Wall_White_Full_State_Definitions_Top`

---

## Critical Unknowns

### 1. ❓ Full Block Asset List

**Problem:** We only know 40 block types from one example prefab. Hytale likely has hundreds of blocks.

**Why it matters:**
- LLM needs to know **all valid block names** to generate correct structures
- Texture atlas needs to include all available blocks
- Block picker UI needs complete catalog

**Possible solutions:**
1. Extract from Hytale game files (asset extraction plugin from Phase 1)
2. Find official block registry documentation
3. Decompile game to find block list
4. Community-maintained block database

### 2. ❓ Rotation Value Mapping

**Problem:** Don't know what rotation values 1-11 actually represent.

**Solution:** Manual experimentation
- Create test prefabs with different rotation values
- Load in-game and observe orientation
- Document mapping (e.g., 1=North, 2=East, 3=South, 4=West, etc.)

### 3. ❓ State-Based Block Behavior

**Problem:** Asterisk-prefixed blocks (`*Furniture_Village_Door_State_Definitions_CloseDoorOut`) are complex.

**Questions:**
- Can you place a basic `Furniture_Village_Door` without state definitions?
- Are state blocks required for functional items (doors, trapdoors)?
- How are states defined/triggered?

### 4. ❓ Version Compatibility

**Problem:** File has `blockIdVersion: 10` — suggests block IDs might change between game versions.

**Questions:**
- What happens if you load a prefab with outdated `blockIdVersion`?
- Are block names stable across versions?
- Do we need version migration logic?

### 5. ❓ Block Categories/Metadata

**Problem:** No structured metadata in the prefab file.

**Questions:**
- How do we categorize blocks for UI (building materials, decorations, furniture)?
- Which blocks are transparent? Luminous? Solid?
- Which blocks require special rendering (stairs, slabs, complex models)?

---

## Implications for V1 Artifact

### ✅ Good News
- Format is **simple** — just coordinates + block names
- Sparse storage — no need to generate air blocks
- No complex nesting or NBT-like structures
- Can skip YAML intermediate format — LLMs can generate JSON directly

### ⚠️ Blockers
1. **Need full block asset list** before building V1 (can't generate structures with unknown blocks)
2. **Need texture extraction** to render blocks correctly
3. Should **test-validate** format works in Hytale before building full pipeline

### 📋 Revised V1 Strategy

**Week 0: Validation & Discovery**
1. Extract/document full block asset list
2. Create 3-5 test prefabs manually
3. Load in Hytale and validate format
4. Test rotation values experimentally
5. Curate V1 block palette (~20 common blocks)

**Week 1-3: Build Artifact** (only after validation complete)

---

## Next Steps

1. **Find/extract complete block asset list** (CRITICAL)
2. Experiment with rotation values (create test prefabs)
3. Test state-based blocks vs basic blocks
4. Validate version/blockIdVersion compatibility
5. Extract textures from Hytale installation

---

## References

- TavernHouse example: `/tmp/TavernHouse.prefab.json`
- Hytale Modding Docs: https://britakee-studios.gitbook.io/hytale-modding-documentation
- CurseForge Hytale Mods: https://www.curseforge.com/hytale/mods
