import { z } from 'zod';

// Define the schema for login form validation
export const loginSchema = z.object({
	username: z.string().min(4, { message: 'Username length is at least 4' }),
	password: z.string().min(8, { message: 'Password length is at least 8' })
});
