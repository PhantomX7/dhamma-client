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

// sample of validation error
// {
// 	code: 'E1001',
// 	details: {
// 	  fields: { code: 'Value must be unique', name: 'Value must be unique' },
// 	  total_errors: 2
// 	},
// 	message: 'Validation failed',
// 	request_id: '94973b2e-e417-4bdd-91d3-ff0ff4998c0f',
// 	type: 'VALIDATION_ERROR'
//   }
export function setErrors(form, errors) {
	let structuredError = {};
	Object.entries(errors.details?.fields).forEach(function ([key, val]) {
		structuredError[key] = [val];
	});

	form.errors = structuredError;
	form.valid = false;
}
