/* eslint-disable no-template-curly-in-string */
const path = require('path');

const name = require('./package.json').name;
const packageDirName = path.basename(__dirname);
const repoPackagePath = `packages/${packageDirName}`;

module.exports = {
    extends: 'release.config.base.js',
    branches: [
        'main',
        'next',
        { name: 'beta', prerelease: true },
        { name: 'alpha', prerelease: true },
        '+([0-9])?(.{+([0-9]),x}).x',
    ],
    pkgRoot: 'dist',
    tagFormat: name + '@${version}',
    commitPaths: [`${repoPackagePath}/**/*`],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
            '@semantic-release/changelog',
            {
                changelogFile: 'CHANGELOG.md',
            },
        ],
        '@semantic-release/npm',
        [
            '@semantic-release/git',
            {
                assets: ['CHANGELOG.md'],
                message:
                    `release(version): Release ${name} ` +
                    '${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
            },
        ],
    ],
};
