export const clientX2X =(clientX) => {
	return ( clientX / window.innerWidth ) * 2 - 1
}

export const clientY2Y =(clientY) => {
	return - ( clientY / window.innerHeight ) * 2 + 1
}
