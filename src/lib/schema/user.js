import { z } from 'zod';

/**
 * Zod schema for creating a new user (simplified).
 */
export const userSchema = z.object({
	username: z
		.string({ required_error: 'Username is required' })
		.min(3, 'Username must be at least 3 characters long')
		.max(50, 'Username cannot exceed 50 characters')
		.trim(),
	password: z
		.string({ required_error: 'Password is required' })
		.min(8, 'Password must be at least 8 characters long') // Keep minimum length requirement
});
