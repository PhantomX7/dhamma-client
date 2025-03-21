export function getChangedFields(original, updated) {
	updated = Object.fromEntries(updated);
	const formData = new FormData();

	Object.keys(updated).forEach((key) => {
		if (key[0] === '_') return;
		if (JSON.stringify(original[key]) !== JSON.stringify(updated[key])) {
			formData.append(key, updated[key]);
		}
	});

	return formData;
}

export function setErrors(form, errors) {
	let structuredError = {};
	Object.entries(errors).forEach(function ([key, val]) {
		structuredError[key] = [val];
	});

	form.errors = structuredError;
	form.valid = false;
}
