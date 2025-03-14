import { z } from 'zod';

// Define the schema for login form validation
export const loginSchema = z.object({
	username: z.string().min(5, { message: 'Username is required' }),
	password: z.string().min(8, { message: 'Password is required' })
});