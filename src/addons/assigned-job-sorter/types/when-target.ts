import { z } from 'zod';

/**
 * 条件付きソートの適用条件を判断する項目
 */
export type WhenTarget = z.infer<typeof WhenTargets.zod>;

/**
 * 条件付きソートの適用条件を判断する項目
 */
export class WhenTargets {
	static readonly zod = z.enum([
		/** ジョブコード */
		'JOB_CODE',
		/** ジョブ名 */
		'JOB_NAME',
	]);
}
