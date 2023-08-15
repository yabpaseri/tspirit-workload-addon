import { z } from 'zod';
import { SortOption } from './sort-option';

export type ExceptionalSortOption = z.infer<typeof ExceptionalSortOption.zod>;
export namespace ExceptionalSortOption {
	export const zod = SortOption.zod.or(
		z.object({
			type: z.literal('BASIC'),
		}),
	);
}
