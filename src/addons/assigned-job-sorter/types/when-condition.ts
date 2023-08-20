import { z } from 'zod';

/**
 * 条件付きソートの適用条件の判断方法
 */
export type WhenCondition = z.infer<typeof WhenConditions.zod>;

/**
 * 条件付きソートの適用条件の判断方法
 */
export class WhenConditions {
	static readonly zod = z.enum([
		// 一致する・一致しない
		'MATCH',
		'NOT_MATCH',
		// 含む・含まない
		'INCLUDE',
		'NOT_INCLUDE',
		// 始まる・終わる
		'STARTS_WITH',
		'ENDS_WITH',
		// 始まらない・終わらない
		'NOT_STARTS_WITH',
		'NOT_ENDS_WITH',
		// 正規表現に一致する・一致しない
		'MATCH_REGEXP',
		'NOT_MATCH_REGEXP',
	]);
}
