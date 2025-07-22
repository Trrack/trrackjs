/* eslint-disable no-template-curly-in-string */

const name = await import("./package.json", { with: { type: "json" } }).name;
const libraryFolderName = await import("./project.json", { with: { type: "json" } }).name;

const srcRoot = `packages/${libraryFolderName}`;

module.exports = {
    extends: '../../release.config.base.js',
    branches: [
        'main',
        'next',
        { name: 'beta', prerelease: true },
        { name: 'alpha', prerelease: true },
        '+([0-9])?(.{+([0-9]),x}).x',
    ],
    pkgRoot: `dist/${srcRoot}`,
    tagFormat: name + '@${version}',
    commitPaths: [`${srcRoot}/*`],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
            '@semantic-release/changelog',
            {
                changelogFile: `${srcRoot}/CHANGELOG.md`,
            },
        ],
        '@semantic-release/npm',
        [
            '@semantic-release/git',
            {
                assets: [`${srcRoot}/package.json`, `${srcRoot}/CHANGELOG.md`],
                message:
                    `release(version): Release ${name} ` +
                    '${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
            },
        ],
    ],
};
