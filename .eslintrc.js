module.exports = {
    root: true,
    env: {
        node: true,
    },
    settings: {
        'import/resolver': {
            webpack: {
                config: './node_modules/@vue/cli-service/webpack.config.js',
            },
        },
    },
    extends: ['./node_modules/eslint-sundries/solutions/vue-ts.js'],
    rules: {
        'unicorn/numeric-separators-style': 'off',
        'unicorn/no-array-for-each': 'off',
        'vue/no-multiple-template-root': 'off',
        'import/named': 'off',
    },
    globals: {
        JSX: true,
    },
};
