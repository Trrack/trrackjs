module.exports = function (config) {
    if (config.output.format.includes('cjs')) {
        // change extension
        config.output.entryFileNames = config.output.entryFileNames.replace(
            'cjs',
            'umd.js'
        );
        config.output.format = 'umd';
        config.output.name = 'Trrack';
        // bundle everything in the UMD bundle so we can use it in a CDN
        config.external = [];
    }
    return config;
};
