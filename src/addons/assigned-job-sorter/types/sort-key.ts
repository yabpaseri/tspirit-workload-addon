import { z } from 'zod';

/**
 * ソートキー
 */
export type SortKey = z.infer<typeof SortKeys.zod>;

/**
 * ソートキー
 */
export class SortKeys {
	static readonly zod = z.enum([
		/** ジョブコード */
		'JOB_CODE',
		/** ジョブ名 */
		'JOB_NAME',
	]);
}
