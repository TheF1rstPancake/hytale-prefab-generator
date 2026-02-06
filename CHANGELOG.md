# Changelog

## 2026-02-05 - Configuration Made Flexible

### Added

#### Environment Variable Support
- **`HYTALE_DATA_DIR`**: Specify custom location for block registry data
- **`HYTALE_PREFAB_DIR`**: Specify custom location for generated prefabs
- **`HYTALE_ASSETS_PATH`**: Specify custom location for Assets.zip (build script)

#### Command-Line Arguments
- `build-block-registry.js --assets-path <path>`: Build registry from custom Assets.zip location
- `build-block-registry.js --help`: Show usage instructions

#### Enhanced Logging
- Server now logs which directories it's using on startup:
  ```
  ✅ Loaded 733 blocks from registry
  📂 Data directory: /path/to/data
  💾 Prefabs directory: /path/to/prefabs
  🚀 Hytale MCP Server running
  ```
- Build script shows which Assets.zip it's reading from
- Better error messages with suggestions when paths are incorrect

#### Documentation
- **CONFIGURATION.md**: Comprehensive guide for all configuration options
- **QUICKSTART.md**: 5-minute setup guide for new users
- **Updated README.md**: Now includes configuration examples
- **Updated INSTALL_LOCAL.md**: Added environment variable examples

### Why This Matters

**Before**: Paths were hardcoded - only worked if assets were at `/home/hytale/server/Assets.zip`

**After**: Flexible configuration supports:
- ✅ Local Windows installations
- ✅ Custom installation paths
- ✅ Network mounted assets
- ✅ Multiple Hytale versions
- ✅ Different data/prefab directories

### Examples

#### Default (no configuration needed)
```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "node",
      "args": ["C:\\hytale-mcp\\src\\index.js"]
    }
  }
}
```

#### Custom paths
```json
{
  "mcpServers": {
    "hytale-prefab-generator": {
      "command": "node",
      "args": ["C:\\hytale-mcp\\src\\index.js"],
      "env": {
        "HYTALE_DATA_DIR": "D:\\HytaleData",
        "HYTALE_PREFAB_DIR": "C:\\Users\\Giovanni\\Documents\\Prefabs"
      }
    }
  }
}
```

#### Build from custom location
```bash
node scripts/build-block-registry.js --assets-path "C:\\GameServers\\Hytale\\Assets.zip"
```

### Technical Details

**Priority order** for configuration:
1. Command-line arguments (highest priority)
2. Environment variables
3. Defaults (lowest priority)

**Default values**:
- Data directory: `../data` (relative to server's `src/` directory)
- Prefab directory: `../prefabs` (relative to server's `src/` directory)
- Assets path: `/home/hytale/server/Assets.zip`

### Breaking Changes

None! The server remains backward compatible with existing setups.

---

## 2026-02-05 - Initial Release

### Core Features

- **Block Registry**: 733 Hytale blocks extracted and searchable
- **MCP Server**: 7 tools for Claude to query blocks and generate prefabs
- **Categories**: 12 block categories (Rock, Ores, TreeWood, etc.)
- **Prefab Generation**: Validate and save `.prefab.json` files
- **Texture Index**: 653 block textures catalogued

### Tools Provided

1. `search_blocks` - Find blocks by name/category/type
2. `get_block_info` - Get detailed block information
3. `list_categories` - Browse block categories
4. `get_blocks_by_category` - Get all blocks in a category
5. `validate_prefab` - Validate prefab JSON structure
6. `save_prefab` - Save prefabs to disk
7. `list_prefabs` - List saved prefabs

### Documentation

- **PLAN.md**: Original project plan
- **PREFAB_SCHEMA.md**: Complete `.prefab.json` format documentation
- **PROGRESS.md**: Development progress and architecture decisions
- **README.md**: Setup and usage guide
- **REMOTE_SETUP.md**: Guide for SSH-based remote setup
- **INSTALL_LOCAL.md**: Guide for local Windows installation

### Architecture

- **MCP-based**: Query blocks on-demand (zero token overhead)
- **Sparse storage**: Only solid blocks stored in prefabs
- **Simple format**: JSON with coordinate-based blocks
- **733 blocks**: Full Hytale block library available

---

## Roadmap

### Phase 1: Foundation ✅ (Complete)
- [x] Extract block registry
- [x] Build MCP server
- [x] Implement search tools
- [x] Prefab validation
- [x] Documentation
- [x] Configurable paths

### Phase 2: Preview App 🔜 (Next)
- [ ] Three.js renderer
- [ ] Texture atlas from Hytale assets
- [ ] Local web app with file watcher
- [ ] Material counter
- [ ] Export to Hytale folder

### Phase 3: Testing & Polish 🔜
- [ ] Test generated prefabs in Hytale
- [ ] Rotation support
- [ ] State-based blocks
- [ ] Error handling improvements

### Phase 4: Distribution 🔜
- [ ] npm package
- [ ] Installation wizard
- [ ] Video tutorials
- [ ] Example prompts library

---

## Version History

- **v1.0.0** (2026-02-05): Initial release with MCP server
- **v1.0.1** (2026-02-05): Added configurable paths
