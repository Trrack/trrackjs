import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const packageDir = process.cwd();
const distDir = path.join(packageDir, 'dist');
const packageJsonPath = path.join(packageDir, 'package.json');
const rootDir = path.resolve(packageDir, '../..');

if (!existsSync(distDir)) {
    throw new Error(`Build output not found: ${distDir}`);
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

delete packageJson.private;
delete packageJson.scripts;
delete packageJson.devDependencies;
delete packageJson.workspaces;
delete packageJson.resolutions;

writeFileSync(
    path.join(distDir, 'package.json'),
    `${JSON.stringify(packageJson, null, 2)}\n`
);

for (const fileName of ['README.md', 'CHANGELOG.md']) {
    const sourcePath = path.join(packageDir, fileName);

    if (existsSync(sourcePath)) {
        copyFileSync(sourcePath, path.join(distDir, fileName));
    }
}

const licensePath = path.join(rootDir, 'LICENSE');

if (existsSync(licensePath)) {
    mkdirSync(distDir, { recursive: true });
    copyFileSync(licensePath, path.join(distDir, 'LICENSE'));
}
