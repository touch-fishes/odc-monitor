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
        'unicorn/number-literal-case': 'off',
    },
};
