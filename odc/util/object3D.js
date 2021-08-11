export const setHex = (obj, content) => {
	if (obj.material) {
		if (Array.isArray(obj.material)) {
			obj.material.forEach((material) => {
				material.emissive.setHex( content )
			});
		}
		if (obj.material.emissive) {
			obj.material.emissive.setHex( content );
		}
	}
}

export const getHex = (object) => {
	if (object.material && object.material.emissive) {
		return object.material.emissive.getHex();
	}
	return '';
}
