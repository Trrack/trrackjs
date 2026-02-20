module.exports = {
  'packages/**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  'apps/**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  '**/*.{json,html,css,scss,md}': [
    'prettier --write',
  ],
};
