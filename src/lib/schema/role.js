import { z } from 'zod';

export const roleSchema = z.object({
	id: z.number().optional(), // Optional for creation, present for update
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	is_active: z.boolean().default(true),
	created_at: z.string().optional(), // Readonly from API
	updated_at: z.string().optional() // Readonly from API
});

export const createRoleSchema = roleSchema.omit({ id: true, created_at: true, updated_at: true });
export const updateRoleSchema = roleSchema.omit({ created_at: true, updated_at: true });