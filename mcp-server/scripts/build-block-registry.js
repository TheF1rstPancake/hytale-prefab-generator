#!/usr/bin/env node

/**
 * Extracts block registry from Hytale server assets
 * Generates a consolidated, searchable block database
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
Usage: node build-block-registry.js [options]

Options:
  --assets-path <path>    Path to Hytale Assets.zip file
  --help                  Show this help message

Environment Variables:
  HYTALE_ASSETS_PATH     Path to Assets.zip (alternative to --assets-path)

Examples:
  node build-block-registry.js --assets-path /path/to/Assets.zip
  HYTALE_ASSETS_PATH=/path/to/Assets.zip node build-block-registry.js
  node build-block-registry.js --assets-path "C:\\hytale-assets\\Assets.zip"
`);
    process.exit(0);
  }
}

// Determine assets path: CLI arg > env var > default
const HYTALE_ASSETS_ZIP = assetsPath ||
                          process.env.HYTALE_ASSETS_PATH ||
                          '/home/hytale/server/Assets.zip';
const EXTRACT_DIR = '/tmp/hytale-assets-extract';
const OUTPUT_DIR = path.join(__dirname, '../data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🔍 Extracting block data from Hytale assets...\n');

// Verify assets file exists
if (!fs.existsSync(HYTALE_ASSETS_ZIP)) {
  console.error(`❌ Assets file not found: ${HYTALE_ASSETS_ZIP}`);
  console.error('\nTry specifying the path with:');
  console.error(`  node build-block-registry.js --assets-path /path/to/Assets.zip`);
  console.error('or');
  console.error(`  HYTALE_ASSETS_PATH=/path/to/Assets.zip node build-block-registry.js`);
  process.exit(1);
}

console.log(`📦 Using assets: ${HYTALE_ASSETS_ZIP}\n`);

// Step 1: Extract BlockTypeList files
console.log('📋 Step 1: Extracting block type lists...');
try {
  execSync(`unzip -o -q "${HYTALE_ASSETS_ZIP}" "Server/BlockTypeList/*.json" -d "${EXTRACT_DIR}"`, { stdio: 'inherit' });
  console.log('✅ Block type lists extracted\n');
} catch (error) {
  console.error('❌ Failed to extract block type lists:', error.message);
  process.exit(1);
}

// Step 2: Read all BlockTypeList files
console.log('📖 Step 2: Reading block type lists...');
const blockTypeListDir = path.join(EXTRACT_DIR, 'Server/BlockTypeList');
const blockTypeFiles = fs.readdirSync(blockTypeListDir).filter(f => f.endsWith('.json'));

const blocksByCategory = {};
const allBlockIds = new Set();

blockTypeFiles.forEach(file => {
  const categoryName = path.basename(file, '.json');
  const filePath = path.join(blockTypeListDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (data.Blocks && Array.isArray(data.Blocks)) {
    blocksByCategory[categoryName] = data.Blocks;
    data.Blocks.forEach(blockId => allBlockIds.add(blockId));
    console.log(`  ${categoryName}: ${data.Blocks.length} blocks`);
  }
});

console.log(`\n✅ Total unique blocks: ${allBlockIds.size}\n`);

// Step 3: Extract texture list
console.log('🎨 Step 3: Extracting texture list...');
try {
  execSync(`unzip -l "${HYTALE_ASSETS_ZIP}" "Common/BlockTextures/*.png" > /tmp/texture-list.txt`, { stdio: 'pipe' });
  const textureList = fs.readFileSync('/tmp/texture-list.txt', 'utf8');
  const textureLines = textureList.split('\n').filter(line => line.includes('BlockTextures/'));

  const textures = textureLines.map(line => {
    const match = line.match(/BlockTextures\/([\w_]+\.png)/);
    return match ? match[1] : null;
  }).filter(Boolean);

  console.log(`✅ Found ${textures.length} block textures\n`);

  // Save texture list
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'textures.json'),
    JSON.stringify(textures, null, 2)
  );
} catch (error) {
  console.error('⚠️  Could not extract texture list:', error.message);
}

// Step 4: Build searchable block registry
console.log('🏗️  Step 4: Building searchable registry...');

const blockRegistry = Array.from(allBlockIds).map(blockId => {
  // Determine categories this block belongs to
  const categories = Object.entries(blocksByCategory)
    .filter(([_, blocks]) => blocks.includes(blockId))
    .map(([category]) => category);

  // Parse block ID for searchable tags
  const parts = blockId.split('_');
  const type = parts[0]; // e.g., "Rock", "Ore", "Plant"
  const material = parts[1]; // e.g., "Stone", "Copper", "Oak"

  return {
    id: blockId,
    name: blockId.replace(/_/g, ' '),
    type,
    material,
    categories,
    tags: parts.map(p => p.toLowerCase()),
    searchText: blockId.toLowerCase()
  };
});

// Sort alphabetically
blockRegistry.sort((a, b) => a.id.localeCompare(b.id));

// Step 5: Save registry
console.log('💾 Step 5: Saving block registry...');

const registryOutput = {
  version: 1,
  generatedAt: new Date().toISOString(),
  totalBlocks: blockRegistry.length,
  categories: Object.keys(blocksByCategory).sort(),
  blocks: blockRegistry
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'block-registry.json'),
  JSON.stringify(registryOutput, null, 2)
);

console.log(`✅ Registry saved: ${blockRegistry.length} blocks`);
console.log(`📁 Output: ${OUTPUT_DIR}/block-registry.json\n`);

// Step 6: Generate category index
const categoryIndex = {};
Object.entries(blocksByCategory).forEach(([category, blocks]) => {
  categoryIndex[category] = {
    count: blocks.length,
    blocks: blocks.sort()
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

console.log('✨ Block registry build complete!\n');
console.log('Summary:');
console.log(`  - Total blocks: ${blockRegistry.length}`);
console.log(`  - Categories: ${Object.keys(blocksByCategory).length}`);
console.log(`  - Output files:`);
console.log(`    • block-registry.json`);
console.log(`    • categories.json`);
console.log(`    • textures.json`);
