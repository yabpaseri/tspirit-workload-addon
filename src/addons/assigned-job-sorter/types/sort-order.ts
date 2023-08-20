import { z } from 'zod';

/**
 * ソート順
 */
export type SortOrder = z.infer<typeof SortOrders.zod>;

/**
 * ソート順
 */
export class SortOrders {
	static readonly zod = z.enum([
		/** 昇順 */
		'ASC',
		/** 降順 */
		'DESC',
	]);
}
