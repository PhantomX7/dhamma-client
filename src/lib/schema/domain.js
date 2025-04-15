import { z } from 'zod';

export const domainSchema = z.object({
	name: z.string().min(4, { message: 'Name length is at least 4' }),
	code: z.string().min(4, { message: 'Code length is at least 4' }),
	description: z.string().optional(),
	is_active: z.boolean(),
	_original: z.string().optional()
});
