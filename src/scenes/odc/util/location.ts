export const clientX2X = (clientX: number) => {
    return (clientX / window.innerWidth) * 2 - 1;
};

export const clientY2Y = (clientY: number) => {
    return -(clientY / window.innerHeight) * 2 + 1;
};
