#!/usr/bin/env node

/**
 * Extracts FULL block registry from Hytale server assets
 * Gets all block items from Server/Item/Items/ (not just base types)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
let assetsPath = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--assets-path' && i + 1 < args.length) {
    assetsPath = args[i + 1];
    i++;
  } else if (args[i] === '--help') {
    console.log(`
Usage: node build-block-registry-v2.js [options]

Options:
  --assets-path <path>    Path to Hytale Assets.zip file
  --help                  Show this help message

This extracts ALL block items (including variants like brick, cobble, half, etc.)
`);
    process.exit(0);
  }
}

// Auto-detect Assets.zip location
function findAssetsZip() {
  const searchPaths = [
    '/home/hytale/server/Assets.zip',
    '/opt/hytale/server/Assets.zip',
    process.env.APPDATA && path.join(process.env.APPDATA, 'Hytale', 'install', 'release', 'package', 'game', 'Assets.zip'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Hytale', 'install', 'release', 'package', 'game', 'Assets.zip'),
    'C:\\hytale\\server\\Assets.zip',
    'D:\\hytale\\server\\Assets.zip',
    'C:\\Program Files\\Hytale\\Assets.zip',
    'C:\\Program Files (x86)\\Hytale\\Assets.zip',
    'C:\\Games\\Hytale\\Assets.zip',
  ].filter(Boolean);

  for (const searchPath of searchPaths) {
    if (fs.existsSync(searchPath)) {
      console.log(`✓ Auto-detected Assets.zip at: ${searchPath}\n`);
      return searchPath;
    }
  }
  return null;
}

const HYTALE_ASSETS_ZIP = assetsPath ||
                          process.env.HYTALE_ASSETS_PATH ||
                          findAssetsZip() ||
                          '/home/hytale/server/Assets.zip';
const EXTRACT_DIR = '/tmp/hytale-assets-extract-v2';
const OUTPUT_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🔍 Extracting FULL block registry from Hytale assets...\n');

if (!fs.existsSync(HYTALE_ASSETS_ZIP)) {
  console.error(`❌ Assets file not found: ${HYTALE_ASSETS_ZIP}`);
  process.exit(1);
}

console.log(`📦 Using assets: ${HYTALE_ASSETS_ZIP}\n`);

// Step 1: Extract all block item definitions
console.log('📋 Step 1: Extracting all block items from Server/Item/Items/...');
console.log('  (This may take a minute - extracting ~2,958 block definitions)\n');

try {
  execSync(`unzip -o -q "${HYTALE_ASSETS_ZIP}" "Server/Item/Items/*/*.json" "Server/Item/Items/*/*/*.json" -d "${EXTRACT_DIR}"`, { stdio: 'inherit' });
  console.log('✅ Block item definitions extracted\n');
} catch (error) {
  console.error('❌ Failed to extract block items:', error.message);
  process.exit(1);
}

// Step 2: Read all block item files and extract those with BlockType
console.log('📖 Step 2: Processing block definitions...');

const itemsDir = path.join(EXTRACT_DIR, 'Server/Item/Items');
const blocks = [];
const blocksByCategory = {};

function processDirectory(dir, category = 'Unknown') {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Subdirectory - use its name as category
      const subCategory = entry.name;
      processDirectory(fullPath, subCategory);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      try {
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

        // Only include items that have a BlockType (placeable blocks)
        if (data.BlockType) {
          const blockId = path.basename(entry.name, '.json');

          const block = {
            id: blockId,
            name: blockId.replace(/_/g, ' '),
            category,
            tags: blockId.toLowerCase().split('_'),
            searchText: blockId.toLowerCase(),
          };

          // Extract additional metadata if available
          if (data.Tags && data.Tags.Type) {
            block.type = Array.isArray(data.Tags.Type) ? data.Tags.Type[0] : data.Tags.Type;
          }

          // Check for texture info
          if (data.BlockType.Textures && data.BlockType.Textures[0]) {
            const texture = data.BlockType.Textures[0];
            if (texture.All) {
              block.texture = texture.All;
            }
          }

          blocks.push(block);

          // Group by category
          if (!blocksByCategory[category]) {
            blocksByCategory[category] = [];
          }
          blocksByCategory[category].push(blockId);
        }
      } catch (error) {
        // Skip files that can't be parsed
        console.error(`  ⚠️  Could not parse ${entry.name}: ${error.message}`);
      }
    }
  }
}

processDirectory(itemsDir);

console.log(`\n✅ Found ${blocks.length} placeable blocks\n`);

// Display categories
console.log('📊 Blocks by category:');
Object.entries(blocksByCategory)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([category, blockList]) => {
    console.log(`  ${category}: ${blockList.length} blocks`);
  });
console.log('');

// Step 3: Extract texture list (same as before)
console.log('🎨 Step 3: Extracting texture list...');
try {
  execSync(`unzip -l "${HYTALE_ASSETS_ZIP}" "Common/BlockTextures/*.png" > /tmp/texture-list-v2.txt`, { stdio: 'pipe' });
  const textureList = fs.readFileSync('/tmp/texture-list-v2.txt', 'utf8');
  const textureLines = textureList.split('\n').filter(line => line.includes('BlockTextures/'));

  const textures = textureLines.map(line => {
    const match = line.match(/BlockTextures\/([\w_]+\.png)/);
    return match ? match[1] : null;
  }).filter(Boolean);

  console.log(`✅ Found ${textures.length} block textures\n`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'textures.json'),
    JSON.stringify(textures, null, 2)
  );
} catch (error) {
  console.error('⚠️  Could not extract texture list:', error.message);
}

// Step 4: Build searchable registry
console.log('🏗️  Step 4: Building searchable registry...');

blocks.sort((a, b) => a.id.localeCompare(b.id));

const registryOutput = {
  version: 2,
  generatedAt: new Date().toISOString(),
  totalBlocks: blocks.length,
  categories: Object.keys(blocksByCategory).sort(),
  blocks
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'block-registry.json'),
  JSON.stringify(registryOutput, null, 2)
);

console.log(`✅ Registry saved: ${blocks.length} blocks`);
console.log(`📁 Output: ${OUTPUT_DIR}/block-registry.json\n`);

// Step 5: Generate category index
const categoryIndex = {};
Object.entries(blocksByCategory).forEach(([category, blockList]) => {
  categoryIndex[category] = {
    count: blockList.length,
    blocks: blockList.sort()
  };
});

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'categories.json'),
  JSON.stringify(categoryIndex, null, 2)
);

console.log('✅ Category index saved\n');

// Cleanup
console.log('🧹 Cleaning up temporary files...');
try {
  execSync(`rm -rf "${EXTRACT_DIR}"`);
  console.log('✅ Cleanup complete\n');
} catch (error) {
  console.warn('⚠️  Could not clean up temp files');
}

console.log('✨ Full block registry build complete!\n');
console.log('Summary:');
console.log(`  - Total placeable blocks: ${blocks.length}`);
console.log(`  - Categories: ${Object.keys(blocksByCategory).length}`);
console.log(`  - Includes all variants: brick, cobble, half, stairs, walls, etc.`);
console.log('');
console.log('  Output files:');
console.log('    • block-registry.json (full catalog)');
console.log('    • categories.json');
console.log('    • textures.json');
