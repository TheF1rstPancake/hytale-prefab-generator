# Hytale Asset Exploration - Quick Reference Index

## Documentation Files Created

This exploration has generated comprehensive documentation of the Hytale server asset structure. Use these files as reference:

### 1. ASSET_EXPLORATION_RESULTS.md
**Location**: `/home/giovanni/scratch/hytale-prefab-generator/ASSET_EXPLORATION_RESULTS.md`

Main findings and conclusions covering:
- Block registry system structure
- Texture asset organization (688 PNGs)
- Metadata and configuration files
- Complete block definition format with examples
- Asset statistics and relationships
- Next steps for prefab generator

**Size**: 15 KB | **Read Time**: 10-15 minutes

### 2. HYTALE_ASSET_SUMMARY.md
**Location**: `/home/giovanni/scratch/hytale-prefab-generator/HYTALE_ASSET_SUMMARY.md`

Detailed technical documentation including:
- Complete directory structure hierarchy
- BlockTypeList registry files (12 files)
- Server/Item/Items organization (2,958 files)
- Block texture catalog (688 PNGs)
- Three sample block definition formats (wool, plant, fluid)
- Comprehensive summary statistics

**Size**: 13 KB | **Read Time**: 15-20 minutes

### 3. HYTALE_DIRECTORY_TREE.txt
**Location**: `/home/giovanni/scratch/hytale-prefab-generator/HYTALE_DIRECTORY_TREE.txt`

Complete visual directory tree with:
- Full Assets.zip structure (64,450 files)
- Server directory layout
- File locations and sizes
- Block type inventory
- Key statistics section

**Size**: 20 KB | **Read Time**: 20-30 minutes for full review

---

## Quick Facts

### Assets Location
- **Primary Archive**: `/home/hytale/server/Assets.zip` (3.5 GB)
- **Active Server**: `/home/hytale/server/Server/` (~1.5 GB)
- **Staging Area**: `/home/hytale/server/staging_area/`

### Block Definitions
- **Total JSON Files**: 6,071
- **Block Categories**: 12 files in `Server/BlockTypeList/`
- **Individual Blocks**: 2,958 in `Server/Item/Items/`
- **Special Blocks**: Fluids, interactions, hitboxes in `Server/Item/Block/`

### Textures
- **Block Textures**: 688 PNG files in `Common/BlockTextures/`
- **Total Textures**: 9,517 PNG files (includes UI, effects, etc.)
- **Naming Pattern**: `BlockType_Variant_Face.png`

### Block Types Available
- **Rocks**: 16 types (Stone, Shale, Slate, Basalt, Marble, Calcite, etc.)
- **Ores**: 9 base types x 5-6 variants = 45+ combinations
- **Plants**: 100+ (grasses, flowers, crops, trees, bushes, cacti)
- **Fluids**: 5 types (Water, Lava, Poison, Slime, Tar)
- **Decorative**: Cloth (12 colors), wood, furniture, specialty

### World Generation
- **Default World**: `/Server/World/Default/` with ore placement rules
- **Instances**: Goblin Dungeon, Forgotten Temple, Void
- **Biomes**: Cold, Hot, Temperate, Island
- **Zones**: 3 zones with different ore distributions

---

## Key Paths (Inside Assets.zip)

### Block Registry
```
Server/BlockTypeList/
├── AllScatter.json (4.6 KB)
├── PlantsAndTrees.json (18.3 KB)
├── TreeWoodAndLeaves.json (6.6 KB)
├── TreeWood.json (5.4 KB)
├── Ores.json (1.3 KB)
├── Rock.json (348 B)
├── Soils.json (309 B)
└── [8 more files]
```

### Block Definitions
```
Server/Item/Items/
├── Cloth/Wool/ (24 color variants)
├── Plant/Crop/ (farming blocks with growth)
├── Plant/Flowers/ (100+ variants)
├── Plant/Grass/ (biome-specific)
├── Furniture/ (decorative blocks)
└── [Many more categories]
```

### Textures
```
Common/BlockTextures/
├── Clay_*.png (13 variants)
├── Cloth_*.png (24 variants)
├── Wood_*.png (50+ variants)
├── Ore_*.png (50+ variants)
├── Rock_*.png (20+ variants)
├── Fluid_*.png (4 variants)
├── Cracks/ (24 animation frames)
└── _Debug/ (6 directional indicators)
```

### Metadata
```
manifest.json (identifies "Hytale" asset group)
Server/Item/Category/CreativeLibrary/Blocks.json (UI hierarchy)
Server/World/Default/ (generation config)
```

---

## Block Definition Structure

Every block definition contains:

### Required Properties
- `TranslationProperties.Name` - Localization key
- `Icon` - UI preview image path
- `Categories` - UI classification
- `BlockType` - Core block properties

### Common Optional Properties
- `Parent` - Inherits from parent block
- `Recipe` - Crafting requirements
- `ItemLevel` - Progression tier
- `Consumable` - Can be eaten/used
- `DrawType` - Rendering style (Model, Standard, Sprite, etc.)
- `Opacity` - Transparency level
- `Textures` - Texture assignment with weighting
- `Support` - Placement requirements
- `Gathering` - Breaking properties (soft, hard, harvest)
- `Interactions` - Collision behaviors
- `Farming` - Growth stages (for plants)
- `BlockEntity` - Dynamic components
- `ParticleColor` - Color for destruction effects

### Special Properties by Block Type
- **Fluids**: `MaxFluidLevel`, `Ticker`, `Collisions`
- **Plants**: `CustomModel`, `Farming`, `Support`, `BlockEntity`
- **Rocks/Soils**: `ParticleColor`, `Textures`
- **Furniture**: `Hitboxes`, `Interactions`

---

## Asset Statistics Table

| Metric | Count | Notes |
|--------|-------|-------|
| Total files in Assets.zip | 64,450 | Archive contains all game assets |
| Block definition JSON files | 6,071 | Server/Item/**/*.json |
| Individual block items | 2,958 | Server/Item/Items/**/*.json |
| Block texture PNG files | 688 | Common/BlockTextures/**/*.png |
| Total PNG textures | 9,517 | Includes UI, effects, icons |
| Block categories | 12 | Server/BlockTypeList JSON files |
| Rock types | 16 | Different stone/mineral types |
| Ore types | 9 | Base ore varieties |
| Ore variants | 45+ | Ores on different rock types |
| Plant types | 100+ | Grasses, flowers, crops, trees |
| Fluid types | 5 | Water, Lava, Poison, Slime, Tar |
| Cloth colors | 12 | Plus light variants |
| Assets archive size | 3.5 GB | Single ZIP file |
| Server install size | ~5 GB | Includes build + configs |

---

## Exploration Methodology

The exploration was conducted systematically:

1. **Directory Listing** - Identified main directories and structure
2. **ZIP Archive Analysis** - Examined Assets.zip contents
3. **File Enumeration** - Counted and categorized all assets
4. **File Examination** - Read and analyzed sample files
5. **Relationship Mapping** - Traced connections between assets
6. **Documentation** - Created comprehensive reference guides

**Scope**: Thorough exploration of block registry, textures, metadata
**Completeness**: All major asset categories identified and documented
**Data Quality**: Sample files verified and analyzed for accuracy

---

## Finding Specific Information

### If you need to find...

**Block definitions for a specific type**
- Look in: `Server/Item/Items/{Category}/`
- Example: Flowers are in `Server/Item/Items/Plant/Flowers/`

**Texture file for a block**
- Look in: `Common/BlockTextures/`
- Name format: `{BlockType}_{Variant}_{Face}.png`
- Example: `Cloth_Black.png`, `Wood_Oak_Side.png`

**Block category registry**
- Look in: `Server/BlockTypeList/`
- Files like: `PlantsAndTrees.json`, `Ores.json`, `Rock.json`

**World generation rules**
- Look in: `Server/World/Default/`
- Files contain ore placement, biome definitions, climate masks

**How blocks are organized for UI**
- Look in: `Server/Item/Category/CreativeLibrary/Blocks.json`
- Defines the creative mode hierarchy

**Fluid behavior**
- Look in: `Server/Item/Block/Fluids/`
- Files like: `Water_Source.json`, `Lava.json`

**Block interactions and physics**
- Look in: `Server/Item/Block/BreakingDecals/` and `Interactions/`

---

## Technical Notes for Implementation

### JSON Parsing
- All definitions are standard JSON format
- Supports nested objects and arrays
- Uses translation keys for localization (don't hardcode English text)

### Path References
- Paths are relative within the archive
- Examples: `BlockTextures/Cloth_Black.png`, `Icons/ItemsGenerated/Plant_Crop_Mushroom_Common_Blue.png`
- All PNG files are in PNG format (no alternatives)

### Block ID Naming
- IDs follow pattern: `{Type}_{Variant}_{Style}`
- Examples: `Rock_Stone`, `Cloth_Block_Wool_Black`, `Plant_Crop_Mushroom_Common_Blue`
- IDs are case-sensitive

### Inheritance Model
- Blocks specify `"Parent"` to inherit properties
- Only override differences from parent
- Parent resolution may require recursive lookup

### Recipe System
- Integrated into block definitions
- Input items specified by ID
- Crafting benches have categories
- Outputs specified by quantity

---

## Exploration Completion Status

**Overall Status**: COMPLETE

Explored Areas:
- [x] Block registry files (BlockTypeList)
- [x] Block definition files (Server/Item/Items)
- [x] Texture asset organization
- [x] Metadata and manifests
- [x] World generation configuration
- [x] Block definition format and examples
- [x] Asset relationships and linking
- [x] Statistics and inventory

Not Examined (outside scope):
- [ ] Actual block model files (.blockymodel format)
- [ ] Audio/sound definitions (explored path but not detailed)
- [ ] Character cosmetics (explored structure only)
- [ ] NPC/creature definitions
- [ ] Quest and story data
- [ ] Server runtime configuration specifics

---

## Contact & Updates

- **Exploration Date**: 2026-02-05
- **Platform**: Linux 6.14.0-37-generic
- **Tools Used**: Bash, unzip, grep, file inspection
- **Status**: Ready for prefab generator implementation

All documentation is in Markdown and plain text format for easy reference and integration into project documentation.

