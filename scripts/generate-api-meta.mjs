/**
 * Post-processes TypeDoc-generated markdown for Nextra compatibility:
 *  1. Generates _meta.json files so Nextra shows the API pages in the sidebar.
 *  2. Strips `.md` from internal markdown links (Next.js routing omits extensions).
 *
 * Run after `typedoc` via `yarn docs:api`.
 */

import {
  existsSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const apiDir = join(__dirname, '../apps/docs/content/api-reference');

/** Friendly display name for top-level section directories */
const SECTION_TITLES = {
  classes: 'Classes',
  interfaces: 'Interfaces',
  functions: 'Functions',
  types: 'Type Aliases',
  enums: 'Enumerations',
  'type-aliases': 'Type Aliases',
  enumerations: 'Enumerations',
};

function writeMeta(dir, meta) {
  writeFileSync(join(dir, '_meta.json'), JSON.stringify(meta, null, 2) + '\n');
}

function normalizeMarkdownLinkTarget(target) {
  const withoutExtension = target.replace(/\.md$/, '');

  if (withoutExtension === 'README') {
    return 'index';
  }

  return withoutExtension.replace(/\/README$/, '/index');
}

/** Strip .md extension from markdown link targets so Next.js routing works. */
function fixLinks(content) {
  // Matches markdown links: [text](path), [text](path.md), or either with #anchor.
  return content.replace(/\]\(([^)#]+?)(\.md)?(#[^)]+?)?\)/g, (match, path, _extension, anchor) => {
    const normalizedPath = normalizeMarkdownLinkTarget(path);
    return `](${normalizedPath}${anchor ?? ''})`;
  });
}

function processMarkdownFiles(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      processMarkdownFiles(fullPath);
    } else if (extname(entry) === '.md') {
      const content = readFileSync(fullPath, 'utf-8');
      const fixed = fixLinks(content);
      if (fixed !== content) {
        writeFileSync(fullPath, fixed);
      }
    }
  }
}

function processLeafDir(dir) {
  const files = readdirSync(dir)
    .filter((f) => extname(f) === '.md')
    .sort();

  const meta = {};
  for (const file of files) {
    const name = basename(file, '.md');
    meta[name] = name;
  }
  writeMeta(dir, meta);
}

function processApiDir(dir) {
  const entries = readdirSync(dir);
  const meta = {};

  // Index page hidden from sidebar (the section nav acts as the overview)
  if (entries.includes('index.md')) {
    meta.index = {
      title: 'Overview',
      display: 'hidden',
    };
  }

  if (entries.includes('README.md')) {
    meta.README = {
      title: 'Overview',
      display: 'hidden',
    };
  }

  // Add each subdirectory as a collapsible section
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      const title = SECTION_TITLES[entry] ?? entry.charAt(0).toUpperCase() + entry.slice(1);
      meta[entry] = title;
      processLeafDir(fullPath);
    }
  }

  writeMeta(dir, meta);
}

function normalizeOverviewFile(dir) {
  const readmePath = join(dir, 'README.md');
  const indexPath = join(dir, 'index.md');

  if (existsSync(readmePath) && !existsSync(indexPath)) {
    renameSync(readmePath, indexPath);
  }
}

normalizeOverviewFile(apiDir);

// Fix .md links first, then generate navigation metadata
processMarkdownFiles(apiDir);
processApiDir(apiDir);

// Clean the overview file: remove the redundant plain-text module name on line 1
for (const overviewFile of ['index.md', 'README.md']) {
  const overviewPath = join(apiDir, overviewFile);

  try {
    const overviewContent = readFileSync(overviewPath, 'utf-8');
    // TypeDoc can put "@trrack/core\n\n# @trrack/core\n..." — strip the first paragraph if it
    // duplicates the H1 title that follows.
    const cleaned = overviewContent.replace(/^[^\n]+\n\n(#+ )/, '$1');
    if (cleaned !== overviewContent) {
      writeFileSync(overviewPath, cleaned);
    }
  } catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') {
      continue;
    }

    throw error;
  }
}
console.log('Generated Nextra _meta.json files and fixed links in apps/docs/content/api-reference/');
