import { z } from 'zod';

export const domainSchema = z.object({
    name: z.string().min(4),
    code: z.string().min(4),
    description: z.string().optional(),
    is_active: z.boolean()
});