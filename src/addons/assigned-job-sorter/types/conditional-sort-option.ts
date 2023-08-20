import { z } from 'zod';
import { SortOptions } from './sort-option';

/**
 * 条件付きソートのソート方法
 */
export type ConditionalSortOption = z.infer<typeof ConditionalSortOptions.zod>;

/**
 * 条件付きソートのソート方法
 */
export class ConditionalSortOptions {
	static readonly zod = SortOptions.zod.or(
		/** 基本ソートを使用 */
		z.object({ type: z.literal('BASE') }),
	);
}
