import { z } from 'zod';

/**
 * Zod schema for validating role data.
 */
export const roleSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(3, { message: 'Name must be at least 3 characters long' })
		.max(50, { message: 'Name must be no more than 50 characters long' })
		.trim(),
	description: z
		.string()
		.max(255, { message: 'Description must be no more than 255 characters long' })
		.optional()
		.nullable(),
	is_active: z.boolean().default(true),
	domain_id: z.coerce // Use coerce for number conversion from form values
		.number({ required_error: 'Domain is required', invalid_type_error: 'Invalid Domain ID' })
		.int()
		.positive('Domain must be selected'),
	_original: z.string().optional()
});
