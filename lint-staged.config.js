module.exports = {
  'packages/**/*.{js,jsx,ts,tsx,json,html,css,scss}': [
    'nx affected:lint --uncommitted --fix=true',
    'nx affected:test --uncommitted',
    'nx format:write --uncommitted',
  ],
};
