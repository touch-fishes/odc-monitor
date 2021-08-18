module.exports = {
    presets: ['@vue/cli-plugin-babel/preset'],
    plugins: [
        [
            'import',
            {
                libraryName: 'element-plus',
                customStyleName: (name) => {
                    return `element-plus/packages/theme-chalk/src/${name.slice(3)}.scss`;
                },
            },
        ],
    ],
};
