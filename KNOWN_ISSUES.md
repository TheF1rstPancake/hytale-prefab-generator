# Known Issues

## 1. Missing Block Variants (CRITICAL)

**Status**: In Progress
**Priority**: High
**Affects**: Block search, prefab generation

### Problem

The current block registry only contains **733 base block types** (Rock, Ore, Plant, etc.) but is missing **block variants** like:
- Brick blocks (`Rock_Stone_Brick`, `Rock_Chalk_Brick_Half`)
- Cobblestone variants (`Rock_Stone_Cobble`)
- Half blocks, stairs, walls, pillars
- Smooth variants

**Example**:
- Searching for "stone brick" returns NO results ❌
- Only finds base types like `Rock_Stone` ✅

### Root Cause

Current extraction reads from `Server/BlockTypeList/*.json` which only lists base types.

The **full block catalog** is in `Server/Item/Items/` which contains ~2,958 individual block JSON files with all placeable variants.

### Impact

Users can't search for or generate structures with:
- Brick buildings (no brick blocks!)
- Polished/smooth blocks
- Decorative variants (half blocks, stairs, walls)
- Most of the blocks seen in example prefabs like TavernHouse

### Solution

**Option A: Extract Full Registry** (Recommended)
Run the v2 extraction script to get all 2,958 blocks:
```bash
npm run build-registry:v2
```

This will:
- Extract from `Server/Item/Items/` instead of `Server/BlockTypeList/`
- Include all block variants
- Properly categorize by material type

**Option B: Hybrid Approach**
Keep base types but add common variants manually.

### Workaround (Temporary)

Until the full registry is extracted, users must use base block names:
- Instead of: `Rock_Stone_Brick` → Use: `Rock_Stone`
- Instead of: `Wood_Oak_Planks` → Use: `Wood_Oak` (if available)

This produces less detailed structures but works with current registry.

### Files Involved

- `/mcp-server/scripts/build-block-registry.cjs` - Current (base types only)
- `/mcp-server/scripts/build-block-registry-v2.cjs` - Full extraction (WIP)
- `/mcp-server/data/block-registry.json` - Current registry (733 blocks)

### Technical Details

**Current extraction**:
```javascript
// Extracts from Server/BlockTypeList/*.json
execSync(`unzip "Assets.zip" "Server/BlockTypeList/*.json"`);
// Gets: Rock, Rock_Stone, Rock_Sandstone (base types)
```

**Needed extraction**:
```javascript
// Extract from Server/Item/Items/
execSync(`unzip "Assets.zip" "Server/Item/Items/**/*.json"`);
// Gets: Rock_Stone, Rock_Stone_Brick, Rock_Stone_Cobble, Rock_Stone_Brick_Half, etc.
```

**Block definition format** (from Server/Item/Items):
```json
{
  "TranslationProperties": {...},
  "BlockType": {  // ← This identifies it as a placeable block
    "Textures": [...],
    "Gathering": {...}
  },
  "Tags": {
    "Type": ["Rock"]
  }
}
```

Only files with `BlockType` should be included (filters out non-placeable items).

### Testing

Once full registry is extracted, verify:
```
1. Search for "stone brick" → Should find Rock_Stone_Brick
2. Search for "half" → Should find all half blocks
3. Total blocks should be ~2,000-2,500 (not 733)
4. Categories should show materials (Rock, Wood, etc.)
```

---

## 2. Rotation Values Undocumented

**Status**: Not Started
**Priority**: Medium

### Problem

Prefabs use rotation values 1-11, but we don't know what each value means:
- Rotation 1 = ?
- Rotation 2 = ?
- etc.

### Impact

Generated prefabs can't control block orientation (stairs, doors, fences).

### Solution

Manual testing:
1. Create test prefabs with each rotation value
2. Load in Hytale
3. Document which rotation = which orientation

---

## 3. State-Based Blocks Not Supported

**Status**: Not Started
**Priority**: Low

### Problem

Blocks with asterisk prefix (`*Furniture_Village_Door_State_Definitions_CloseDoorOut`) represent complex states (open/closed doors, etc.).

### Impact

Can't generate prefabs with:
- Doors in specific states
- Multi-state furniture
- Complex block configurations

### Solution

For V1: Skip state blocks, use simple blocks only.
For V2: Add state block support with proper configuration.

---

## 4. No 3D Preview Yet

**Status**: Planned (Phase 4)

### Problem

Users can't visualize generated prefabs before loading in-game.

### Solution

Build Three.js web preview app (see PLAN.md Phase 3).

---

## 5. No Direct Hytale Integration

**Status**: Planned (Phase 6)

### Problem

Users must manually copy `.prefab.json` files to Hytale folder.

### Solution

Build Hytale plugin for in-game placement (see PLAN.md Phase 6).

---

## Update Log

- **2026-02-05**: Identified missing block variants issue during testing
- **2026-02-05**: Created build-block-registry-v2.cjs for full extraction
