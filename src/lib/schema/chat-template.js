import { z } from 'zod';

/**
 * Zod schema for chat template data.
 */
export const chatTemplateSchema = z.object({
	id: z.number().int().positive().optional(),
	domain_id: z.number({ required_error: 'Domain is required.' }).int().positive('Domain is required.'),
	name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less.'),
	description: z.string().max(65535, 'Description must be 65535 characters or less.').nullable().optional(),
	content: z.string().min(1, 'Template content is required').max(65535, 'Template content must be 65535 characters or less.'),
	is_active: z.boolean().default(true),
	is_default: z.boolean().default(false),
	_original: z.string().optional() // For superforms, to track original state in edit forms
});