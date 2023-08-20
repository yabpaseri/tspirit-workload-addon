import { z } from 'zod';
import { SortKeys } from './sort-key';
import { SortOrders } from './sort-order';
import { SortRegExps } from './sort-regexp';

/**
 * ソート方法
 */
export type SortOption = z.infer<typeof SortOptions.zod>;

/**
 * ソート方法
 */
export class SortOptions {
	static readonly zod = z.union([
		/** 現在の並びを維持する */
		z.object({ type: z.literal('KEEP') }),
		/** 設定に従って並び変える */
		z.object({
			type: z.literal('CUSTOMIZE'),
			key: SortKeys.zod,
			order: SortOrders.zod,
			regexp: SortRegExps.zod.nullish(),
		}),
	]);
}
