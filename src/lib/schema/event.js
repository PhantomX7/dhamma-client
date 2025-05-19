import { z } from 'zod';
/**
 * Zod schema for event data.
 */
export const eventSchema = z.object({
	id: z.number().int().positive().optional(),
	domain_id: z.number({ required_error: 'Domain is required.' }).int().positive('Domain is required.'),
	name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less.'),
	description: z.string().max(65535, 'Description must be 65535 characters or less.').nullable().optional(),
	points_awarded: z.number({ invalid_type_error: 'Points awarded must be a number.' }).int('Points awarded must be an integer.').min(0, 'Points awarded cannot be negative.').default(0),
	_original: z.string().optional() // For superforms, to track original state in edit forms
});