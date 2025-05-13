import { z } from 'zod';

/**
 * Schema for creating and updating a follower.
 * - `id`, `created_at`, `updated_at` are typically handled by the backend.
 * - `_original` is used by superforms for change detection on edit.
 */
export const followerSchema = z.object({
	id: z.number().optional(), // Optional for creation, present for updates/display
	domain_id: z.number({ required_error: 'Domain ID is required.' }).int().positive({ message: 'Domain ID must be a positive number.' }),
	name: z.string({ required_error: 'Name is required.' }).min(1, { message: 'Name cannot be empty.' }).trim(),
	phone: z.string().nullable().optional().transform(val => val === '' ? null : val), // Allow empty string to become null
	is_blood_donor: z.boolean().default(false),
	is_youth: z.boolean().default(false),
	_original: z.string().optional() // For superforms to track original data on edit
});