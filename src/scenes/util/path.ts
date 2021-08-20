export const p = (path: string) => {
    const publicPath = '/odc-monitor';
    if (process.env.NODE_ENV === 'production') return `${publicPath}${path}`;
    return path;
};
