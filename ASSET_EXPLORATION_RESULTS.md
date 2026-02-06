# Hytale Server Asset Exploration Results

## Executive Summary

Thoroughly explored the Hytale server installation at `/home/hytale/server` and identified the complete asset structure for block registry, textures, and metadata. All major asset systems have been documented with file locations and sample data.

---

## Key Discoveries

### 1. Block Registry System

**Location**: Inside `Assets.zip` (3.5 GB archive)

#### BlockTypeList (Categorization)
- **Path**: `Server/BlockTypeList/` (12 JSON files)
- **Purpose**: High-level block categorization for world generation and UI
- **Files**:
  - `AllScatter.json` - Decorative/scatter blocks
  - `PlantsAndTrees.json` - Vegetation (18.3 KB)
  - `TreeWoodAndLeaves.json` - Tree components
  - `Ores.json` - Ore block registry
  - `Rock.json`, `Soils.json`, `Snow.json` - Rock/soil types

#### Item/Block Definitions (Individual Blocks)
- **Path**: `Server/Item/Items/` (2,958 JSON files)
- **Organization**: Hierarchical by block type
  - `Cloth/Wool/` - 12 colors + light variants
  - `Plant/Crop/` - Farming blocks with growth mechanics
  - `Plant/Flowers/` - 100+ flower variants
  - `Plant/Grass/` - Biome-specific grass
  - `Furniture/` - Decorative and functional blocks
  
**Example Structure**: Each block item contains:
```
- TranslationProperties (localization)
- Icon (UI preview)
- Recipe (crafting)
- BlockType (rendering, collision, behavior)
- Categories (UI classification)
- Custom properties (farming, support, interactions)
```

#### Special Block Definitions
- **Path**: `Server/Item/Block/`
- **Fluids**: Water, Lava, Poison, Slime, Tar with physics
- **Interactions**: Collision handlers, breaking effects
- **Hitboxes**: Collision shapes for various block types

### 2. Texture Assets

**Total**: 688 block texture PNG files

**Location**: `Common/BlockTextures/` within Assets.zip

**Organization by Type**:
- **Clay blocks**: Black, Blue, Cyan, Green, Grey, Lime, Orange, Pink, Purple, Red, White, Yellow (regular + smooth)
- **Cloth blocks**: 12 colors + light variants (textile materials)
- **Wood blocks**: Oak, Pine, Birch, Village walls, decorative types
- **Ore blocks**: Adamantite, Cobalt, Copper, Gold, Iron, Mithril, Onyxium, Silver, Thorium
- **Rock types**: Stone, Shale, Slate, Quartzite, Sandstone, Basalt, Volcanic, Marble, Calcite
- **Fluid textures**: Water, Lava, Slime, Poison
- **Special effects**: 24 breaking crack animations (progression stages)
- **Debug textures**: 6 directional indicator textures

**Naming Convention**: `BlockType_Variant_Face.png`
- Example: `Clay_Smooth_Blue.png`, `Wood_Oak_Side.png`

### 3. Metadata and Configuration

#### Main Manifest
- **File**: `manifest.json` (45 bytes)
- **Content**: Asset package identification
- **Usage**: Identifies this as the "Hytale" asset group

#### Category Hierarchy
- **File**: `Server/Item/Category/CreativeLibrary/Blocks.json`
- **Purpose**: Creative mode block organization
- **Categories**: Rocks, Structural, Soils, Ores, Plants, Fluids, Portals, Deco

#### World Generation Configuration
- **Path**: `Server/World/`
- **Contains**:
  - Ore placement rules by zone (Copper, Iron, Gold, Silver, Mithril, etc.)
  - Biome definitions (Cold, Hot, Temperate, Island)
  - Climate masks for terrain generation
  - Instance definitions (Goblin Dungeon, Forgotten Temple, Void)

### 4. Block Definition Format (Examples)

#### Standard Block (Wool)
```json
{
  "TranslationProperties": {"Name": "server.items.Cloth_Block_Wool_Black.name"},
  "Parent": "Cloth_Block_Wool_White",
  "Icon": "Icons/ItemsGenerated/Cloth_Black.png",
  "ItemLevel": 4,
  "Recipe": {
    "Input": [{"ItemId": "Plant_Petals_Black", "Quantity": 1}, ...],
    "BenchRequirement": [{"Type": "Crafting", "Id": "Furniture_Bench"}]
  },
  "BlockType": {
    "Textures": [{"Weight": 1, "All": "BlockTextures/Cloth_Black.png"}],
    "ParticleColor": "#1e1c1c"
  }
}
```

**Key Features**:
- Inheritance model (Parent block for shared properties)
- Recipe integration with crafting benches
- Texture assignment with weighting
- Particle color for destruction effects

#### Plant/Crop Block
```json
{
  "BlockType": {
    "DrawType": "Model",
    "Opacity": "Transparent",
    "CustomModel": "Blocks/Foliage/Plants/Mushroom.blockymodel",
    "CustomModelTexture": [{"Texture": "Blocks/Foliage/Plants/Mushroom_Textures/Blue.png"}],
    "Support": {"Down": [{"FaceType": "Full"}]},
    "Farming": {
      "Stages": {
        "Default": [
          {"Block": "Plant_Crop_Mushroom_Common_Blue", "Duration": {"Min": 10000, "Max": 20001}},
          {"Type": "Spread", "Executions": [1, 3], "GrowthBehaviours": [...]}
        ]
      }
    }
  }
}
```

**Key Features**:
- 3D model support (.blockymodel files)
- Custom textures for models
- Placement support conditions
- Multi-stage farming mechanics with growth behavior
- Spread mechanics for plants

#### Fluid Block
```json
{
  "MaxFluidLevel": 1,
  "Effect": ["Water"],
  "Opacity": "Transparent",
  "Textures": [{"Weight": 1, "All": "BlockTextures/Fluid_Water.png"}],
  "BlockParticleSetId": "Water",
  "Ticker": {
    "CanDemote": false,
    "SpreadFluid": "Water",
    "Collisions": {
      "Lava": {"BlockToPlace": "Rock_Stone_Cobble", "SoundEvent": "SFX_Flame_Break"}
    }
  }
}
```

**Key Features**:
- Fluid level system
- Spread mechanics
- Collision-based reactions
- Sound effect triggers
- Fluid-fluid interactions

---

## Asset Statistics

| Category | Count | Location |
|----------|-------|----------|
| Block Definition JSON Files | 6,071 | `Server/Item/**/*.json` |
| Individual Block Item Definitions | 2,958 | `Server/Item/Items/**/*.json` |
| Block Texture PNG Files | 688 | `Common/BlockTextures/**/*.png` |
| Total Texture PNG Files | 9,517 | Various |
| Total Files in Assets.zip | 64,450 | Assets.zip |
| Assets Archive Size | 3.5 GB | Single ZIP file |
| Server Installation Size | ~5 GB | Includes build and configs |

---

## Block Types Documented

### Rocks (16 types)
Stone, Shale, Slate, Quartzite, Sandstone, Basalt, Volcanic, Marble, Calcite, Aqua, Chalk, Bedrock, Salt, Stone_Mossy, and variants

### Ores (9 base types x 5-6 rock variants = 45+ combinations)
- Adamantite, Cobalt, Copper, Gold, Iron, Mithril, Onyxium, Silver, Thorium
- Each found in: Stone, Basalt, Shale, Slate, Volcanic, Sandstone

### Plants
- Grasses (15+ biome variants)
- Flowers (100+ color/style variants)
- Trees (multiple wood types)
- Crops (mushrooms, vegetables with growth stages)
- Bushes, Cacti, Moss, Petals

### Fluids (5 types)
- Water (flowing + source block)
- Lava (flowing + source block)
- Poison
- Slime (red variant + source block)
- Tar

### Decorative
- Cloth/Wool (12 colors + light variants)
- Wood variants
- Furniture blocks
- Hay, Bone, and other specialty blocks

---

## Important File Locations (Absolute Paths)

### Block Registry
1. `/home/hytale/server/Assets.zip` → `Server/BlockTypeList/`
2. `/home/hytale/server/Assets.zip` → `Server/Item/Items/`
3. `/home/hytale/server/Assets.zip` → `Server/Item/Block/`

### Textures
- `/home/hytale/server/Assets.zip` → `Common/BlockTextures/`

### World Generation
- `/home/hytale/server/Assets.zip` → `Server/World/Default/`
- `/home/hytale/server/Assets.zip` → `Server/World/Instance_Dungeon_Goblin/`

### Metadata
- `/home/hytale/server/Assets.zip` → `manifest.json`
- `/home/hytale/server/Assets.zip` → `Server/Item/Category/CreativeLibrary/Blocks.json`

### Active Server Configuration
- `/home/hytale/server/Server/config.json`
- `/home/hytale/server/Server/universe/worlds/default/`

---

## Asset Relationships

### Block Definition → Texture Mapping
```
Block Definition (JSON) → BlockType.Textures → BlockTextures/{Name}.png
Example: Cloth_Block_Wool_Black.json → BlockTextures/Cloth_Black.png
```

### Block Type → Block Instance
```
BlockTypeList categories → Individual item definitions → In-game placement
Example: Rock.json includes "Rock_Stone" → Block_Rock_Stone.json → Placeable in world
```

### Crafting Integration
```
Block Item Definition → Recipe section → Crafting Bench requirement
Example: Cloth_Block_Wool_Black requires Plant_Petals_Black + Cloth_Block_Wool_White
```

### World Generation
```
World/Default configuration → BlockTypeList categories → Random placement
Example: PlantsAndTrees.json blocks placed by terrain generator
```

---

## Key Insights

### 1. Hierarchical Organization
- **Top level**: `BlockTypeList` for categorization
- **Mid level**: `Server/Item/Items/` for individual definitions
- **Bottom level**: Textures, models, and interaction configs

### 2. Inheritance System
Many blocks inherit from parent blocks to reduce duplication:
- `Cloth_Block_Wool_Black` inherits from `Cloth_Block_Wool_White`
- Only color-specific properties override parent values

### 3. Dynamic Properties via Components
Blocks support complex behaviors through:
- `BlockEntity` - Dynamic components (farming, crafting)
- `Farming` - Multi-stage growth with spread mechanics
- `Interactions` - Collision, crafting, physics responses
- `Support` - Placement requirements

### 4. Texture Variant System
- Single block type can have multiple texture variants
- Weighted random selection during placement
- Named systematically for identification

### 5. JSON-Based Configuration
- All definitions stored as JSON for easy parsing/modification
- Localization via translation string keys
- Recipe system integrated at block level

---

## Files Available for Reference

### Generated Documentation
1. **HYTALE_ASSET_SUMMARY.md** (13 KB)
   - Comprehensive asset structure analysis
   - Block definition format samples
   - Complete file listings

2. **HYTALE_DIRECTORY_TREE.txt** (20 KB)
   - Complete directory tree visualization
   - File counts and locations
   - Asset statistics

### Original Sources
- `/home/hytale/server/Assets.zip` - All asset data
- `/home/hytale/server/Server/` - Active server configuration
- `/home/hytale/server/QUICKSTART.md` - Server setup guide

---

## Next Steps for Prefab Generator

Based on this exploration, the prefab generator should:

1. **Read Block Registry**
   - Parse `Server/BlockTypeList/` JSON files
   - Load `Server/Item/Items/` block definitions
   - Build block ID → properties mapping

2. **Load Textures**
   - Extract PNG files from `Common/BlockTextures/`
   - Map texture paths to block IDs
   - Cache texture data for UI preview

3. **Parse Block Properties**
   - Extract `BlockType` definitions
   - Identify support conditions (placement requirements)
   - Parse farming/growth stages for plants
   - Load crafting recipes

4. **Generate Prefabs**
   - Use block registry to build prefab data structures
   - Include texture references
   - Support variant selection
   - Validate block compatibility

5. **Integrate with World Generator**
   - Read world generation config
   - Understand biome-specific blocks
   - Implement ore placement rules
   - Support height-based block variations

---

## Conclusion

The Hytale server contains a well-structured, comprehensive asset system with 6,071+ block definition JSON files and 688 block textures. All assets are contained within a single Assets.zip file with clear hierarchical organization and comprehensive metadata. The system supports complex block behaviors through JSON configuration, inheritance, and component-based architecture.

**Status**: Exploration complete. All major asset categories identified and documented.

Generated: 2026-02-05
