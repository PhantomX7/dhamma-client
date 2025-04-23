import { z } from 'zod';

export const roleSchema = z.object({
	id: z.number().optional(), // Optional for creation, present for update
	name: z.string().min(3, 'Name must be at least 3 characters'),
	description: z.string().optional(),
	is_active: z.boolean().default(true),
	_original: z.string().optional()
});