import { z } from 'zod';

export const permissionSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
    code: z.string().min(3, { message: 'Code must be at least 3 characters' }),
    object: z.string().min(1, { message: 'Object is required' }),
    action: z.string().min(1, { message: 'Action is required' }),
    type: z.string().min(1, { message: 'Type is required' }),
    description: z.string().optional(),
    is_domain_specific: z.boolean().default(false),
    domain_id: z.number().nullable().optional()
});