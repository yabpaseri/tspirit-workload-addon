import { z } from 'zod';
import { Whens } from './when';
import { ConditionalMoves } from './conditional-move';
import { ConditionalSortOptions } from './conditional-sort-option';

/**
 * 条件付きソート
 */
export type ConditionalSort = z.infer<typeof ConditionalSorts.zod>;

/**
 * 条件付きソート
 */
export class ConditionalSorts {
	static readonly zod = z.object({
		when: Whens.zod,
		moveto: ConditionalMoves.zod,
		sort: ConditionalSortOptions.zod,
	});
}
