import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [react, reactDom, typesReact, typesReactDom] = process.argv.slice(2);

if (!react || !reactDom || !typesReact || !typesReactDom) {
    console.error(
        'Usage: node scripts/set-react-toolchain.mjs <react> <react-dom> <@types/react> <@types/react-dom>',
    );
    process.exit(1);
}

const repoRoot = process.cwd();
const files = [
    {
        path: path.join(repoRoot, 'package.json'),
        update(pkg) {
            pkg.devDependencies.react = react;
            pkg.devDependencies['react-dom'] = reactDom;
            pkg.devDependencies['@types/react'] = typesReact;
            pkg.devDependencies['@types/react-dom'] = typesReactDom;
        },
    },
    {
        path: path.join(repoRoot, 'packages/vis-react/package.json'),
        update(pkg) {
            pkg.devDependencies.react = react;
            pkg.devDependencies['react-dom'] = reactDom;
        },
    },
];

for (const file of files) {
    const source = await readFile(file.path, 'utf8');
    const pkg = JSON.parse(source);
    file.update(pkg);
    await writeFile(file.path, `${JSON.stringify(pkg, null, 2)}\n`);
}
