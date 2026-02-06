# Hytale Prefab Generator - MCP Server

MCP (Model Context Protocol) server that provides Claude with tools to search Hytale blocks and generate prefabs.

## Features

✅ **733 Hytale blocks** extracted from game assets
✅ **Smart search** - Find blocks by name, type, or category
✅ **Block validation** - Verify prefabs before saving
✅ **Prefab management** - Save and list generated structures

## Installation

### Prerequisites
- Node.js 18+ installed
- Hytale server `Assets.zip` file (local or remote)
- Claude Desktop (for using the MCP server)

### Setup

1. **Build the block registry** (first time only):

**If Assets.zip is in the default location** (`/home/hytale/server/Assets.zip`):
```bash
npm run build-registry
```

**If Assets.zip is elsewhere**:
```bash
# Using command-line argument
node scripts/build-block-registry.js --assets-path /path/to/Assets.zip

# Or using environment variable
HYTALE_ASSETS_PATH=/path/to/Assets.zip npm run build-registry
```

**Windows example**:
```cmd
node scripts\build-block-registry.js --assets-path "C:\HytaleServer\Assets.zip"
```

This extracts block data from Hytale assets and creates:
- `data/block-registry.json` - 733 searchable blocks
- `data/categories.json` - Block categories
- `data/textures.json` - Texture list

💡 **Note**: See [CONFIGURATION.md](CONFIGURATION.md) for advanced path configuration options.

2. **Configure Claude Desktop**:

Add this to your Claude Desktop MCP config file:

**Linux**: `~/.config/Claude/claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "node",
      "args": [
        "/home/giovanni/scratch/hytale-prefab-generator/mcp-server/src/index.js"
      ]
    }
  }
}
```

3. **Restart Claude Desktop**

4. **Test it**:

Open Claude Desktop and ask:
```
Can you search for stone blocks in Hytale?
```

Claude should now have access to the Hytale tools!

## Available Tools

### `search_blocks`
Search for blocks by name, type, or category.

**Example**:
```
Search for "oak wood" blocks
```

**Parameters**:
- `query` (required): Search term
- `category` (optional): Filter by category
- `limit` (optional): Max results (default: 20)

### `get_block_info`
Get detailed information about a specific block.

**Example**:
```
Get info for block "Rock_Stone_Brick"
```

### `list_categories`
List all available block categories with counts.

**Example**:
```
List all block categories
```

### `get_blocks_by_category`
Get all blocks in a specific category.

**Example**:
```
Get all blocks in the "Rock" category
```

### `create_prefab` ⭐ Recommended
Create and save a prefab from just a blocks array. The MCP server automatically adds version numbers, block ID version, and anchor points.

**Example**:
```
Create a prefab named "stone_tower" with these blocks:
[
  {x: 0, y: 0, z: 0, name: "Rock_Stone_Brick"},
  {x: 1, y: 0, z: 0, name: "Rock_Stone_Brick"},
  {x: 0, y: 1, z: 0, name: "Rock_Stone_Brick"}
]
```

**Parameters**:
- `name` (required): Filename without extension
- `blocks` (required): Array of `{x, y, z, name, rotation?}` objects
- `anchorX`, `anchorY`, `anchorZ` (optional): Anchor coordinates (default: 0, 0, 0)

**Returns**:
- Success status
- File path
- Stats (dimensions, block counts, materials)
- Warnings (if any unknown blocks)

**Why use this?** Much simpler than `save_prefab` - you don't need to remember version numbers or structure. Just provide the blocks!

### `validate_prefab` (Advanced)
Validate a complete prefab JSON structure.

**Example**:
```
Validate this prefab: {...}
```

Returns:
- Valid/invalid status
- Errors (if any)
- Warnings (unknown blocks, etc.)
- Stats (dimensions, block counts)

### `save_prefab` (Advanced)
Save a complete prefab JSON file with version, blockIdVersion, anchors, and blocks already specified.

**Example**:
```
Save this prefab as "medieval_tower"
```

Saves to: `mcp-server/prefabs/medieval_tower.prefab.json`

### `list_prefabs`
List all saved prefabs.

## Example Workflow

```
User: Build me a small stone house

Claude: Let me search for suitable stone blocks...
        [uses search_blocks("stone")]

        I'll create a 8x6x8 house using Rock_Stone_Brick.
        [generates prefab JSON]

        Let me validate it first...
        [uses validate_prefab(...)]

        ✅ Valid! Dimensions: 8x6x8, 245 blocks

        Saving as "stone_house"...
        [uses save_prefab("stone_house", ...)]

        Done! Your prefab is ready.
```

## Block Categories

- **Rock** (16 blocks): Stone, Basalt, Marble, Chalk, etc.
- **Ores** (48 blocks): Copper, Iron, Gold, Mithril, etc.
- **TreeWood** (183 blocks): Oak, Pine, Birch, etc.
- **PlantsAndTrees** (601 blocks): Flowers, crops, trees
- **Soils** (13 blocks): Dirt, grass, clay, sand
- **Gravel** (7 blocks): Various gravel types
- **Snow** (2 blocks): Snow and ice
- **Empty** (1 block): Air

## Development

### Run in dev mode (auto-reload):
```bash
npm run dev
```

### Test directly:
```bash
npm start
```

### Rebuild registry:
```bash
npm run build-registry
```

## File Structure

```
mcp-server/
├── src/
│   └── index.js           # MCP server implementation
├── scripts/
│   └── build-block-registry.js  # Extract blocks from Hytale assets
├── data/
│   ├── block-registry.json      # 733 searchable blocks
│   ├── categories.json          # Category index
│   └── textures.json            # Texture list
├── prefabs/                     # Saved prefabs (generated)
└── package.json
```

## Troubleshooting

### "Failed to load block registry"
Run: `npm run build-registry`

### "Claude Desktop doesn't see the tools"
1. Check config path is correct
2. Restart Claude Desktop completely
3. Check logs in Claude Desktop settings

### "Block not found"
The block might not exist in this Hytale version. Use `search_blocks` to find similar alternatives.

## Next Steps

- [ ] Create web preview app to visualize prefabs
- [ ] Add rotation support for oriented blocks
- [ ] Extract actual block textures for rendering
- [ ] Add texture atlas support
- [ ] Hytale plugin for in-game placement

## License

MIT
