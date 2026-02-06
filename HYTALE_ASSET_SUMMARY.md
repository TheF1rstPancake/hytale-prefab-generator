# Hytale Server Installation Asset Structure Analysis

## Overview
The Hytale server installation at `/home/hytale/server` contains a comprehensive asset system for blocks, textures, and game content organized within the `Assets.zip` file (3.5GB).

---

## Directory Structure

### Main Server Directory: `/home/hytale/server`
```
/home/hytale/server/
├── Assets.zip                              (3.5 GB - Main asset archive)
├── 2026.01.28-87d03be09.zip               (1.5 GB - Server build)
├── hytale-downloader.zip                  (9.7 MB)
├── QUICKSTART.md
├── start.sh / start.bat
├── Server/                                 (Active server directory)
│   ├── AdminUI/                           (Admin interface configurations)
│   ├── backups/                           (Server backups)
│   ├── Licenses/
│   ├── logs/
│   ├── mods/                              (Server mods)
│   │   ├── Hytale_Shop/
│   │   ├── com.dairymoose_SpawnControl/
│   │   ├── com.gfsbackup_GFSBackup/
│   │   ├── Nitrado_PerformanceSaver/
│   │   ├── Nitrado_WebServer/
│   │   └── com.gfsbackup_WorldKeeper/
│   ├── universe/                          (World data)
│   │   ├── worlds/
│   │   │   └── default/
│   │   │       ├── chunks/                (Block data)
│   │   │       └── resources/             (World-specific resources)
│   │   ├── players/                       (Player data)
│   │   ├── warps.json
│   │   └── memories.json
│   ├── config.json                        (Server config)
│   ├── permissions.json
│   ├── whitelist.json
│   └── bans.json
└── staging_area/                          (Temporary staging directory)
    ├── worlds/
    ├── backups/
    └── players/
```

---

## Asset Organization (Inside Assets.zip)

### 1. BLOCK DEFINITIONS AND REGISTRIES

#### Location: `Server/BlockTypeList/`
JSON files defining block categories and groupings:
- **AllScatter.json** (4.7 KB) - Scattered decorative blocks
- **PlantsAndTrees.json** (18.3 KB) - Plant and tree blocks
- **TreeWoodAndLeaves.json** (6.6 KB) - Wood and leaf variations
- **TreeWood.json** (5.4 KB) - Wood block variants
- **Ores.json** (1.3 KB) - Ore block registry
- **TreeLeaves.json** (1.3 KB) - Leaf block variants
- **Rock.json** (348 bytes) - Rock type blocks
- **Soils.json** (309 bytes) - Soil blocks
- **Gravel.json** (194 bytes)
- **Snow.json** (60 bytes)
- **Empty.json** (34 bytes)

**Purpose**: Category-based block lists grouping similar blocks together for world generation, UI display, and gameplay mechanics.

#### Location: `Server/Item/Block/`
Detailed block definitions and configurations:
- **Fluids/** - Fluid block definitions (Water, Lava, Poison, Slime, Tar)
- **Blocks/** - Special block definitions (Debug blocks, editor blocks)
- **Hitboxes/** - Collision and interaction hitboxes
- **BreakingDecals/** - Breaking/destruction effects
- **FluidFX/** - Fluid visual effects

#### Location: `Server/Item/Items/` (2,958+ JSON files)
Individual block item definitions organized by category:
- **Cloth/Wool/** - Colored wool blocks (multiple variants)
- **Plant/Crop/** - Crop and farming blocks
- **Plant/Bushes/** - Bush vegetation
- **Plant/Cacti/** - Cactus varieties
- **Plant/Flowers/** - Flower blocks
- **Plant/Grass/** - Grass blocks
- **Furniture/** - Furniture and decorative blocks
- **Categories/** - Item category definitions

### 2. BLOCK TEXTURE ASSETS

#### Location: `Common/BlockTextures/`
**Total**: 688 PNG texture files

Organized by block type:
- **Clay blocks** - Multiple color variants (Black, Blue, Cyan, Green, Grey, Lime, Orange, Pink, Purple, Red, White, Yellow)
  - Regular and smooth variants
  - Example: `Clay_Black.png`, `Clay_Smooth_Blue.png`

- **Cloth blocks** - Colored textile blocks with light variants
  - Standard and "Light" versions of each color
  - Example: `Cloth_Blue.png`, `Cloth_Blue_Light.png`

- **Wood blocks** - Various wood types and styles
  - Trunks, logs, village walls, decorative woods
  - Example: `Wood_Oak_Side.png`, `Wood_Village_Wall_Red.png`

- **Ore blocks** - Metal and ore textures
  - Example: `Ore_Copper_Stone.png`, `Ore_Gold_Basalt.png`

- **Rock types** - Stone, marble, calcite, basalt, volcanic, etc.
  - Multiple variants per type
  - Example: `Rock_Stone.png`, `Calcite_Brick_Decorative.png`

- **Fluid textures**
  - `Fluid_Lava.png`, `Fluid_Water.png`, `Fluid_Slime.png`, `Fluid_Poison.png`

- **Decorator textures**
  - Hay, greenscreen, and miscellaneous blocks

- **Breaking crack animations** (24 textures)
  - Separate crack stages for Dirt, Generic, Stone, and Wood
  - Used for block destruction visual feedback

- **Debug textures** (6 colored direction indicators)
  - Up, Down, North, South, East, West

### 3. METADATA AND MANIFESTS

#### Location: `manifest.json` (45 bytes)
```json
{
  "Group": "Hytale",
  "Name": "Hytale"
}
```
Identifies the asset package group.

#### Location: `Server/Item/Category/CreativeLibrary/Blocks.json` (1.2 KB)
Block category hierarchy for creative mode/creative library:
```json
{
  "Icon": "Icons/ItemCategories/Natural.png",
  "Order": 0,
  "Children": [
    {"Id": "Rocks", "Name": "server.ui.itemcategory.rocks"},
    {"Id": "Structural", "Name": "server.ui.itemcategory.structural"},
    {"Id": "Soils", "Name": "server.ui.itemcategory.soils"},
    {"Id": "Ores", "Name": "server.ui.itemcategory.ores"},
    {"Id": "Plants", "Name": "server.ui.itemcategory.plants"},
    {"Id": "Fluids", "Name": "server.ui.itemcategory.fluids"},
    {"Id": "Portals", "Name": "server.ui.itemcategory.portals"},
    {"Id": "Deco", "Name": "server.ui.itemcategory.deco"}
  ]
}
```

#### World and Generation Data
- **Server/World/Default/** - Default world generation configuration
  - Ore placement configs (Copper, Iron, Gold, Silver, Mithril, etc.)
  - Climate masks and biome definitions
  - Terrain generation parameters
- **Server/World/Instance_Dungeon_Goblin/** - Goblin dungeon instance data
- **Server/World/Instance_Forgotten_Temple/** - Temple instance data
- **Server/World/Void/** - Void dimension data

---

## Block Definition Format

### Sample 1: Wool Block Definition
**File**: `Server/Item/Items/Cloth/Wool/Cloth_Block_Wool_Black.json`

```json
{
  "TranslationProperties": {
    "Name": "server.items.Cloth_Block_Wool_Black.name"
  },
  "Parent": "Cloth_Block_Wool_White",
  "Icon": "Icons/ItemsGenerated/Cloth_Black.png",
  "ItemLevel": 4,
  "Recipe": {
    "Input": [
      {
        "ItemId": "Plant_Petals_Black",
        "Quantity": 1
      },
      {
        "ItemId": "Cloth_Block_Wool_White",
        "Quantity": 1
      }
    ],
    "OutputQuantity": 1,
    "BenchRequirement": [
      {
        "Type": "Crafting",
        "Id": "Furniture_Bench",
        "Categories": ["Furniture_Textiles"]
      }
    ]
  },
  "BlockType": {
    "Textures": [
      {
        "Weight": 1,
        "All": "BlockTextures/Cloth_Black.png"
      }
    ],
    "ParticleColor": "#1e1c1c"
  }
}
```

**Key Properties**:
- `Name`: Localization string for UI display
- `Parent`: Inherits properties from parent block
- `Icon`: UI preview icon path
- `ItemLevel`: Item tier/progression level
- `Recipe`: Crafting requirements
- `BlockType.Textures`: Texture file references
- `ParticleColor`: Color for particle effects when broken

### Sample 2: Plant/Crop Block Definition
**File**: `Server/Item/Items/Plant/Crop/Plant_Crop_Mushroom_Common_Blue.json`

```json
{
  "TranslationProperties": {
    "Name": "server.items.Plant_Crop_Mushroom_Common_Blue.name"
  },
  "Icon": "Icons/ItemsGenerated/Plant_Crop_Mushroom_Common_Blue.png",
  "Categories": ["Blocks.Plants"],
  "Consumable": false,
  "BlockType": {
    "DrawType": "Model",
    "Opacity": "Transparent",
    "CustomModel": "Blocks/Foliage/Plants/Mushroom.blockymodel",
    "CustomModelTexture": [
      {
        "Texture": "Blocks/Foliage/Plants/Mushroom_Textures/Blue.png",
        "Weight": 1
      }
    ],
    "Group": "Plant",
    "HitboxType": "Plant_Large",
    "Flags": {
      "IsStackable": false
    },
    "RandomRotation": "YawStep1",
    "Gathering": {
      "Harvest": {},
      "Soft": {}
    },
    "Support": {
      "Down": [{"FaceType": "Full"}]
    },
    "BlockEntity": {
      "Components": {
        "FarmingBlock": {}
      }
    },
    "Farming": {
      "Stages": {
        "Default": [
          {
            "Block": "Plant_Crop_Mushroom_Common_Blue",
            "Duration": {"Min": 10000, "Max": 20001},
            "Type": "BlockType"
          },
          {
            "Type": "Spread",
            "Executions": [1, 3],
            "SpreadDecayPercent": [50, 50],
            "GrowthBehaviours": [...]
          }
        ]
      }
    }
  }
}
```

**Key Properties**:
- `DrawType`: How block is rendered (Model, Standard, Sprite, etc.)
- `Opacity`: Transparency level
- `CustomModel`: Reference to block model file (.blockymodel)
- `CustomModelTexture`: Texture paths for models
- `HitboxType`: Collision box shape
- `Support`: Block placement requirements
- `Farming`: Growth stages and mechanics for crops
- `BlockEntity`: Dynamic components (FarmingBlock for crops)

### Sample 3: Fluid Block Definition
**File**: `Server/Item/Block/Fluids/Water_Source.json`

```json
{
  "MaxFluidLevel": 1,
  "Effect": ["Water"],
  "Opacity": "Transparent",
  "Textures": [
    {
      "Weight": 1,
      "All": "BlockTextures/Fluid_Water.png"
    }
  ],
  "BlockParticleSetId": "Water",
  "BlockSoundSetId": "Water",
  "FluidFXId": "Water",
  "Interactions": {
    "Collision": {
      "Cooldown": {"Id": "ClearBurn", "Cooldown": 1},
      "Interactions": [
        {"Type": "ClearEntityEffect", "EntityEffectId": "Burn"},
        {"Type": "ClearEntityEffect", "EntityEffectId": "Lava_Burn"},
        {"Type": "ClearEntityEffect", "EntityEffectId": "Flame_Staff_Burn"}
      ]
    }
  },
  "Ticker": {
    "CanDemote": false,
    "SpreadFluid": "Water",
    "Collisions": {
      "Lava": {
        "BlockToPlace": "Rock_Stone_Cobble",
        "SoundEvent": "SFX_Flame_Break"
      },
      "Lava_Source": {
        "BlockToPlace": "Rock_Magma_Cooled",
        "SoundEvent": "SFX_Flame_Break"
      }
    }
  },
  "Tags": {
    "Fluid": ["Water"]
  }
}
```

**Key Properties**:
- `MaxFluidLevel`: Fluid depth levels
- `Interactions`: Physics/collision behaviors
- `Ticker`: Fluid spread and tick behavior
- `Collisions`: Reactions with other blocks

---

## Summary Statistics

| Category | Count | Location |
|----------|-------|----------|
| Block Definition JSON Files | 6,071 | `Server/Item/**/*.json` |
| Individual Item Files | 2,958 | `Server/Item/Items/**/*.json` |
| Block Texture PNG Files | 688 | `Common/BlockTextures/**/*.png` |
| All Texture PNG Files | 9,517 | Various |
| Total Files in Assets.zip | 64,450 | - |
| Asset Archive Size | 3.5 GB | Assets.zip |

---

## Key Findings

### Block Registry System
1. **Hierarchical Organization**: Blocks organized by type (rocks, plants, fluids, ores, etc.)
2. **Inheritance Model**: Many blocks inherit from parent definitions to reduce duplication
3. **Dynamic Components**: Blocks support complex behaviors via:
   - Farming (crops with growth stages)
   - Support conditions (placement requirements)
   - Interactions (collision, crafting)
   - Block entities (dynamic properties)

### Texture System
1. **PNG-based**: All textures are PNG format
2. **Named systematically**: Texture names match block types
3. **Variant support**: Multiple texture variants per block type
4. **Color variants**: Cloth, clay, and dye blocks have full color palettes
5. **Special effects**: Animated crack textures for block destruction

### Asset Relationships
1. **Cross-references**: Block definitions reference texture paths
2. **Item integration**: Blocks exist as placeable items with recipes
3. **World generation**: Ore and biome definitions determine placement
4. **Category system**: Creative library organizes blocks by function

### Configuration Hierarchy
- Global block types (BlockTypeList)
- Individual block definitions (Server/Item/Items)
- Texture assignments (BlockTextures)
- Behavior/Interaction configs (Farming, Interactions)
- World generation rules (Server/World)

---

## Most Important Files for Block System

1. **`Server/BlockTypeList/`** - Block categorization and grouping
2. **`Server/Item/Items/`** - Individual block definitions with properties
3. **`Common/BlockTextures/`** - Visual texture assets
4. **`Server/Item/Block/Fluids/`** - Special fluid block mechanics
5. **`Server/World/`** - World generation and placement rules
6. **`manifest.json`** - Asset package metadata

