# Hytale AI Architect - Prefab Generator

Generate Hytale prefabs using natural language with Claude!

> **Status**: MCP Server Complete ✅ | Preview App 🔜 Next

## What is This?

A tool that lets you describe structures in natural language (or voice) and have Claude generate them as Hytale `.prefab.json` files.

**Example**:
```
You: "Build me a medieval stone tower with a wooden roof"
Claude: *searches for stone/wood blocks* → *generates prefab* → *saves tower.prefab.json*
You: Copy to Hytale → Load in-game → Place!
```

## Quick Start

**5-minute setup** → See [mcp-server/QUICKSTART.md](mcp-server/QUICKSTART.md)

## Architecture

```
You ←→ Claude Desktop ←→ MCP Server ←→ Hytale Block Registry (733 blocks)
                            ↓
                      Generated Prefabs
                            ↓
                    Copy to Hytale Game
```

**Why MCP?**
- ✅ **Zero token overhead** - Claude queries blocks on-demand, not loaded in context
- ✅ **Full library** - All 733 Hytale blocks available
- ✅ **Validation** - Check prefabs before saving
- ✅ **Local-first** - Works offline after setup

## Features

### Current (v1.0)
- ✅ 733 Hytale blocks extracted and searchable
- ✅ MCP server with 7 tools for Claude
- ✅ Block search by name/category/type
- ✅ Prefab validation
- ✅ Save `.prefab.json` files
- ✅ Configurable paths

### Coming Soon
- 🔜 Web preview app (3D visualization)
- 🔜 Texture rendering
- 🔜 Direct export to Hytale folder
- 🔜 Rotation support

## Installation

Choose your setup:

### Option 1: Local (Recommended)
Run the MCP server on your Windows machine.

**Guide**: [INSTALL_LOCAL.md](INSTALL_LOCAL.md)

**Quick version**:
```bash
# Clone this repo
git clone <repo-url>
cd hytale-prefab-generator/mcp-server

# Install dependencies
npm install

# Configure Claude Desktop (see INSTALL_LOCAL.md)
```

### Option 2: Remote (SSH)
Run the MCP server on a remote Linux machine.

**Guide**: [REMOTE_SETUP.md](REMOTE_SETUP.md)

## Documentation

| File | Purpose |
|------|---------|
| [PLAN.md](PLAN.md) | Original project plan and architecture |
| [PROGRESS.md](PROGRESS.md) | Development status and decisions |
| [PREFAB_SCHEMA.md](PREFAB_SCHEMA.md) | Complete `.prefab.json` format spec |
| [CHANGELOG.md](CHANGELOG.md) | What changed and when |
| **MCP Server** | |
| [mcp-server/README.md](mcp-server/README.md) | MCP server full documentation |
| [mcp-server/QUICKSTART.md](mcp-server/QUICKSTART.md) | 5-minute setup guide |
| [mcp-server/CONFIGURATION.md](mcp-server/CONFIGURATION.md) | Path configuration options |
| **Installation** | |
| [INSTALL_LOCAL.md](INSTALL_LOCAL.md) | Local Windows setup |
| [REMOTE_SETUP.md](REMOTE_SETUP.md) | Remote Linux setup (SSH) |

## How It Works

### 1. Block Registry Extraction
```bash
npm run build-registry
# Extracts 733 blocks from Hytale's Assets.zip
# Generates searchable database
```

### 2. MCP Server
Claude Desktop connects to the server and gets access to tools:
- `search_blocks` - Find blocks by name/category
- `get_block_info` - Get block details
- `validate_prefab` - Check prefab structure
- `save_prefab` - Write `.prefab.json` files
- And more...

### 3. Generation Workflow
```
User: "Build a castle tower"
  ↓
Claude: searches for stone/brick blocks
  ↓
Claude: generates prefab JSON
  ↓
Claude: validates structure
  ↓
Claude: saves castle_tower.prefab.json
  ↓
User: copies to Hytale → loads in-game
```

## Example Usage

Once set up, ask Claude things like:

```
"Search for wooden planks in Hytale"
→ Returns: Wood_Oak_Planks, Wood_Softwood_Planks, etc.

"Generate a 10x10x10 stone cube as a prefab"
→ Creates prefab with 1000 Rock_Stone_Brick blocks

"Create a small medieval house with a thatched roof"
→ Searches for appropriate blocks → generates structure → saves file

"What categories of blocks are available?"
→ Lists: Rock, Ores, TreeWood, PlantsAndTrees, Soils, etc.
```

## Project Structure

```
hytale-prefab-generator/
├── README.md                    # This file
├── PLAN.md                      # Original plan
├── PROGRESS.md                  # Development status
├── PREFAB_SCHEMA.md            # Prefab format docs
├── CHANGELOG.md                 # Version history
├── INSTALL_LOCAL.md             # Local setup guide
├── REMOTE_SETUP.md              # Remote setup guide
│
├── mcp-server/                  # MCP Server (main component)
│   ├── src/
│   │   └── index.js            # Server implementation
│   ├── scripts/
│   │   └── build-block-registry.js
│   ├── data/
│   │   ├── block-registry.json  # 733 blocks
│   │   ├── categories.json
│   │   └── textures.json
│   ├── prefabs/                 # Generated prefabs
│   ├── README.md                # MCP server docs
│   ├── QUICKSTART.md            # Quick setup
│   ├── CONFIGURATION.md         # Path config
│   └── package.json
│
└── preview-app/                 # 🔜 Coming soon
    └── (Three.js web preview)
```

## Development Status

- ✅ **Phase 1**: Asset extraction & block registry
- ✅ **Phase 2**: MCP server with tools
- ✅ **Phase 3**: Configuration system
- 🔜 **Phase 4**: Web preview app
- 🔜 **Phase 5**: Texture rendering
- 🔜 **Phase 6**: End-to-end testing

See [PROGRESS.md](PROGRESS.md) for details.

## Requirements

- **Node.js 18.0.0 or higher** (required by MCP SDK)
- Claude Desktop
- Hytale `Assets.zip` (for building registry, auto-detected)
- Windows, Mac, or Linux

**Check your Node version**:
```bash
node --version
# Should show v18.0.0 or higher
```

**Install Node.js**: [nodejs.org](https://nodejs.org/) - Download the LTS version (v20.x recommended)

## Contributing

This is currently a personal project, but suggestions and feedback welcome!

## License

MIT

## Credits

- Built for Hytale by Hypixel Studios
- Uses Anthropic's MCP (Model Context Protocol)
- Powered by Claude

---

**Ready to build?** → Start with [mcp-server/QUICKSTART.md](mcp-server/QUICKSTART.md)
