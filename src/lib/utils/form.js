export function getChangedFields(original, updated) {
	const changedFields = {};

	Object.keys(updated).forEach((key) => {
		// Skip internal fields that start with underscore
		if (key[0] === '_') return;

		// Compare values and add to result if different
		if (JSON.stringify(original[key]) !== JSON.stringify(updated[key])) {
			changedFields[key] = updated[key];
		}
	});

	return changedFields;
}

export function setErrors(form, errors) {
	let structuredError = {};
	Object.entries(errors).forEach(function ([key, val]) {
		structuredError[key] = [val];
	});

	form.errors = structuredError;
	form.valid = false;
}
