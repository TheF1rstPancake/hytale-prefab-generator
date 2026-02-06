#!/usr/bin/env node

/**
 * Hytale Prefab Generator MCP Server
 * Provides tools for Claude to search blocks and generate prefabs
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration: Support environment variables and defaults
const DATA_DIR = process.env.HYTALE_DATA_DIR || path.join(__dirname, '../data');
const PREFAB_DIR = process.env.HYTALE_PREFAB_DIR || path.join(__dirname, '../prefabs');

// Load block registry
const REGISTRY_PATH = path.join(DATA_DIR, 'block-registry.json');
const CATEGORIES_PATH = path.join(DATA_DIR, 'categories.json');

let blockRegistry = null;
let categories = null;

// Ensure prefab directory exists
if (!fs.existsSync(PREFAB_DIR)) {
  fs.mkdirSync(PREFAB_DIR, { recursive: true });
}

// Load registry on startup
try {
  blockRegistry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  categories = JSON.parse(fs.readFileSync(CATEGORIES_PATH, 'utf8'));
  console.error(`✅ Loaded ${blockRegistry.totalBlocks} blocks from registry`);
  console.error(`📂 Data directory: ${DATA_DIR}`);
  console.error(`💾 Prefabs directory: ${PREFAB_DIR}`);
} catch (error) {
  console.error('❌ Failed to load block registry:', error.message);
  console.error(`📂 Looking in: ${DATA_DIR}`);
  console.error('\nTo specify a custom data directory, set:');
  console.error('  HYTALE_DATA_DIR=/path/to/data');
  process.exit(1);
}

// Initialize MCP server
const server = new Server(
  {
    name: 'hytale-prefab-generator',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Tool: search_blocks
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_blocks',
        description: 'Search for Hytale blocks by name, type, or category. Returns matching block IDs.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (e.g., "stone", "oak wood", "brick")',
            },
            category: {
              type: 'string',
              description: 'Optional: Filter by category (Rock, Ores, PlantsAndTrees, TreeWood, Soils, etc.)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results (default: 20)',
              default: 20,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_block_info',
        description: 'Get detailed information about a specific block by its ID',
        inputSchema: {
          type: 'object',
          properties: {
            blockId: {
              type: 'string',
              description: 'The exact block ID (e.g., "Rock_Stone_Brick")',
            },
          },
          required: ['blockId'],
        },
      },
      {
        name: 'list_categories',
        description: 'List all available block categories with block counts',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_blocks_by_category',
        description: 'Get all blocks in a specific category',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Category name (e.g., "Rock", "Ores", "TreeWood")',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of blocks to return (default: 50)',
              default: 50,
            },
          },
          required: ['category'],
        },
      },
      {
        name: 'validate_prefab',
        description: 'Validate a prefab JSON structure before saving',
        inputSchema: {
          type: 'object',
          properties: {
            prefab: {
              type: 'object',
              description: 'The prefab JSON object to validate',
            },
          },
          required: ['prefab'],
        },
      },
      {
        name: 'save_prefab',
        description: 'Save a prefab JSON file to disk',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Filename without extension',
            },
            prefab: {
              type: 'object',
              description: 'The prefab JSON object',
            },
          },
          required: ['name', 'prefab'],
        },
      },
      {
        name: 'list_prefabs',
        description: 'List all saved prefabs',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Tool implementations
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_blocks': {
        const { query, category, limit = 20 } = args;
        const searchTerm = query.toLowerCase();

        let results = blockRegistry.blocks.filter(block => {
          const matchesQuery = block.searchText.includes(searchTerm) ||
                              block.tags.some(tag => tag.includes(searchTerm));
          const matchesCategory = !category || block.categories.includes(category);
          return matchesQuery && matchesCategory;
        });

        results = results.slice(0, limit);

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              query,
              category: category || 'all',
              found: results.length,
              blocks: results.map(b => ({
                id: b.id,
                name: b.name,
                type: b.type,
                categories: b.categories,
              })),
            }, null, 2),
          }],
        };
      }

      case 'get_block_info': {
        const { blockId } = args;
        const block = blockRegistry.blocks.find(b => b.id === blockId);

        if (!block) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: `Block not found: ${blockId}` }),
            }],
          };
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(block, null, 2),
          }],
        };
      }

      case 'list_categories': {
        const categoryList = Object.entries(categories).map(([name, data]) => ({
          name,
          count: data.count,
        }));

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ categories: categoryList }, null, 2),
          }],
        };
      }

      case 'get_blocks_by_category': {
        const { category, limit = 50 } = args;
        const categoryData = categories[category];

        if (!categoryData) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: `Category not found: ${category}` }),
            }],
          };
        }

        const blocks = categoryData.blocks.slice(0, limit);

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              category,
              total: categoryData.count,
              returned: blocks.length,
              blocks,
            }, null, 2),
          }],
        };
      }

      case 'validate_prefab': {
        const { prefab } = args;
        const errors = [];
        const warnings = [];

        // Validate structure
        if (!prefab.version) errors.push('Missing required field: version');
        if (!prefab.blockIdVersion) errors.push('Missing required field: blockIdVersion');
        if (typeof prefab.anchorX !== 'number') errors.push('Missing or invalid anchorX');
        if (typeof prefab.anchorY !== 'number') errors.push('Missing or invalid anchorY');
        if (typeof prefab.anchorZ !== 'number') errors.push('Missing or invalid anchorZ');
        if (!Array.isArray(prefab.blocks)) errors.push('blocks must be an array');

        // Validate blocks
        if (Array.isArray(prefab.blocks)) {
          const blockCounts = {};
          const unknownBlocks = new Set();

          prefab.blocks.forEach((block, idx) => {
            if (typeof block.x !== 'number') errors.push(`Block ${idx}: missing x coordinate`);
            if (typeof block.y !== 'number') errors.push(`Block ${idx}: missing y coordinate`);
            if (typeof block.z !== 'number') errors.push(`Block ${idx}: missing z coordinate`);
            if (!block.name) errors.push(`Block ${idx}: missing name`);

            // Check if block exists in registry
            if (block.name) {
              const exists = blockRegistry.blocks.some(b => b.id === block.name);
              if (!exists) {
                unknownBlocks.add(block.name);
              } else {
                blockCounts[block.name] = (blockCounts[block.name] || 0) + 1;
              }
            }
          });

          if (unknownBlocks.size > 0) {
            warnings.push(`Unknown block types: ${Array.from(unknownBlocks).join(', ')}`);
          }

          // Calculate dimensions
          if (prefab.blocks.length > 0) {
            const xs = prefab.blocks.map(b => b.x);
            const ys = prefab.blocks.map(b => b.y);
            const zs = prefab.blocks.map(b => b.z);

            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            const minZ = Math.min(...zs);
            const maxZ = Math.max(...zs);

            const stats = {
              totalBlocks: prefab.blocks.length,
              dimensions: {
                width: maxX - minX + 1,
                height: maxY - minY + 1,
                depth: maxZ - minZ + 1,
              },
              bounds: {
                x: [minX, maxX],
                y: [minY, maxY],
                z: [minZ, maxZ],
              },
              materials: blockCounts,
            };

            return {
              content: [{
                type: 'text',
                text: JSON.stringify({
                  valid: errors.length === 0,
                  errors,
                  warnings,
                  stats,
                }, null, 2),
              }],
            };
          }
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              valid: errors.length === 0,
              errors,
              warnings,
            }, null, 2),
          }],
        };
      }

      case 'save_prefab': {
        const { name, prefab } = args;
        const filename = `${name}.prefab.json`;
        const filepath = path.join(PREFAB_DIR, filename);

        fs.writeFileSync(filepath, JSON.stringify(prefab, null, 2));

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Prefab saved: ${filename}`,
              path: filepath,
            }, null, 2),
          }],
        };
      }

      case 'list_prefabs': {
        const files = fs.readdirSync(PREFAB_DIR)
          .filter(f => f.endsWith('.prefab.json'))
          .map(f => ({
            name: f,
            path: path.join(PREFAB_DIR, f),
            size: fs.statSync(path.join(PREFAB_DIR, f)).size,
            modified: fs.statSync(path.join(PREFAB_DIR, f)).mtime,
          }));

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ prefabs: files }, null, 2),
          }],
        };
      }

      default:
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ error: `Unknown tool: ${name}` }),
          }],
        };
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ error: error.message }),
      }],
      isError: true,
    };
  }
});

// Resources: Block registry and categories
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'hytale://blocks/registry',
        name: 'Hytale Block Registry',
        mimeType: 'application/json',
        description: `Complete block registry (${blockRegistry.totalBlocks} blocks)`,
      },
      {
        uri: 'hytale://blocks/categories',
        name: 'Block Categories',
        mimeType: 'application/json',
        description: 'Block categories with counts',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'hytale://blocks/registry') {
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(blockRegistry, null, 2),
      }],
    };
  }

  if (uri === 'hytale://blocks/categories') {
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(categories, null, 2),
      }],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 Hytale MCP Server running');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
