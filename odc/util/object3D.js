export const setHex = (obj, content) => {
	if (obj.material && obj.material.emissive) {
		obj.material.emissive.setHex( content );
	}
}

export const getHex = (object) => {
	if (object.material && object.material.emissive) {
		return object.material.emissive.getHex();
	}
	return '';
}
