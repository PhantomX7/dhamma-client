import { z } from 'zod';

/**
 * Zod schema for assigning/updating a user's role within a domain.
 */
export const userDomainRoleSchema = z.object({
	// Assuming domain_id might come from context or URL, but include if needed in a form
	// domain_id: z.coerce
	// 	.number({ required_error: 'Domain is required', invalid_type_error: 'Invalid Domain ID' })
	// 	.int()
	// 	.positive('Domain ID must be positive'),
	role_id: z.coerce // Use coerce for number conversion from form values
		.number({ required_error: 'Role is required', invalid_type_error: 'Please select a valid role' })
		.int()
		.positive('Please select a role')
});

// Type definition for the schema

/**
 * Zod schema for the form used to assign a user to a new domain with a role.
 */
export const assignUserToDomainSchema = z.object({
	domain_id: z.coerce
		.number({ required_error: 'Domain is required', invalid_type_error: 'Invalid Domain ID' })
		.int()
		.positive('Please select a domain'),
	role_id: z.coerce
		.number({ required_error: 'Role is required', invalid_type_error: 'Please select a valid role' })
		.int()
		.positive('Please select a role')
});

// Type definition for the assignment form schema