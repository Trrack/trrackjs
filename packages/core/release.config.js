/* eslint-disable no-template-curly-in-string */
const name = require('./package.json').name;
const libraryFolderName = require('./project.json').name;
const srcRoot = `packages/${libraryFolderName}`;

module.exports = {
    extends: 'release.config.base.js',
    branches: [
        '+([0-9])?(.{+([0-9]),x}).x',
        'main',
        { name: 'beta', prerelease: true },
        { name: 'alpha', prerelease: true },
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
