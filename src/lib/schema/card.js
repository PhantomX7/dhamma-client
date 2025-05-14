import { z } from 'zod';

/**
 * Zod schema for card validation.
 * The 'code' field is required.
 */
export const cardSchema = z.object({
	code: z.string().min(1, 'Card code is required')
	// follower_id will be derived from the route parameters, not part of the form data itself.
});