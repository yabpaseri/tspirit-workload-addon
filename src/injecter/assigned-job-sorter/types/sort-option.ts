import { z } from 'zod';
import { SortKey } from './sort-key';
import { SortOrder } from './sort-order';
import { SortRegexp } from './sort-regexp';

export type SortOption = z.infer<typeof SortOption.zod>;
export namespace SortOption {
	export const zod = z.union([
		z.object({ type: z.literal('KEEP') }),
		z.object({ type: z.literal('CUSTOM'), key: SortKey.zod, order: SortOrder.zod, regexp: SortRegexp.zod.nullish() }),
	]);
}
