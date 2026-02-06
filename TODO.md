# TODO - Future Improvements

## High Priority

### 1. Fix Block Registry - Missing Variants
**Status**: In Progress
**Issue**: Only 733 base blocks, missing ~2,000 variants (brick, cobble, half, etc.)

**Action**:
- Extract from `Server/Item/Items/` instead of `Server/BlockTypeList/`
- Should get ~2,958 total placeable blocks
- Pre-build and commit to repo
- Users get complete registry automatically

### 2. Create Release Package (No Git Required)
**Status**: Not Started
**Priority**: High for public release

**Current flow (developer)**:
```
git clone → npm install → configure Claude
```

**Desired flow (end user)**:
```
Download .zip → Extract → Double-click install.ps1 → Done
```

**Package structure**:
```
hytale-mcp-v1.0.0.zip
├── mcp-server/
│   ├── src/
│   ├── data/              ← Pre-built registry
│   ├── node_modules/      ← Pre-bundled dependencies
│   └── package.json
├── install.ps1            ← Auto-configures Claude Desktop
├── README.txt
└── CHANGELOG.txt
```

**Install script should**:
- Auto-detect Node.js (warn if not installed/wrong version)
- Copy files to `%LOCALAPPDATA%\HytaleMCP\`
- Auto-configure Claude Desktop config
- Test connection
- Show "Installation complete!" message

**Distribution**:
- GitHub Releases (primary)
- CurseForge (if Hytale has mod distribution)
- Direct download link

**No git, no npm install, no CLI commands!**

---

## Medium Priority

### 3. Add `rebuild_block_registry` MCP Tool
**Status**: Not Started

Add an MCP tool so Claude can rebuild the registry:

```
User: "Update the Hytale block registry"
Claude: *calls rebuild_block_registry*
Server: *auto-detects Assets.zip, extracts, updates*
Claude: "Done! Found 2,958 blocks."
```

Use cases:
- Hytale game updates
- User manually added custom blocks
- Registry corruption

### 4. Auto-Build Registry on First Run
**Status**: Not Started

If `data/block-registry.json` missing:
1. Show message: "Building block registry (one-time, ~5 seconds)..."
2. Auto-detect Assets.zip
3. Extract blocks
4. Save registry
5. Continue startup

Only runs once, then uses cached registry.

### 5. Build Preview App (Three.js)
**Status**: Not Started
**See**: PLAN.md Phase 3

- React + Three.js
- 3D voxel rendering
- Auto-reloads when prefab changes
- Material counter
- Export button

### 6. Rotation Support
**Status**: Not Started

Document rotation values 1-11:
- Manual testing with test prefabs
- Load in Hytale, observe orientations
- Create mapping (1=North, 2=East, etc.)
- Add to MCP tools

---

## Low Priority

### 7. State-Based Blocks
Complex blocks like `*Furniture_Village_Door_State_Definitions_CloseDoorOut`

Skip for V1, add in V2.

### 8. Hytale Plugin (In-Game Placement)
See PLAN.md Phase 6

### 9. Desktop App (Tauri)
See PLAN.md Phase 5

### 10. Voice Input
Web Speech API for voice-to-prefab

---

## System Requirements

### Minimum
- **Node.js**: 18.0.0 or higher (MCP SDK requirement)
- **OS**: Windows 10+, macOS 10.15+, Linux (any recent distro)
- **RAM**: 512 MB (for MCP server)
- **Disk**: 50 MB (with dependencies)

### Recommended
- **Node.js**: 20.x (LTS)
- **RAM**: 1 GB
- **Hytale**: Installed (for Assets.zip)

### For Development
- **Node.js**: 20.x
- **Git**: Any recent version
- **npm**: 9.x or higher
- **Hytale Server**: For full asset extraction

---

## Distribution Strategy

### Phase 1: Developer Preview (Current)
- GitHub repo
- Git-based installation
- Manual configuration
- For testing and feedback

### Phase 2: Public Beta
- GitHub Releases with .zip downloads
- One-click installer
- Auto-configuration
- Pre-bundled dependencies
- Documentation and video tutorial

### Phase 3: Production Release
- CurseForge/mod hosting (if available)
- Automatic updates
- Crash reporting
- Usage analytics (opt-in)
- Community support

---

## Notes

- **Keep installation dead simple**: Download → Extract → Install → Done
- **No CLI required**: Everything via installer or Claude Desktop UI
- **Pre-build everything**: Registry, dependencies, all included
- **Auto-detect paths**: Find Assets.zip automatically
- **Graceful fallbacks**: If auto-detect fails, guide user
- **Test on fresh Windows install**: Ensure no dependencies assumed

---

Last Updated: 2026-02-05
