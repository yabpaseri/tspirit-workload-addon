import { z } from 'zod';

export type WhenCondition = z.infer<typeof WhenCondition.zod>;
export namespace WhenCondition {
	export const zod = z.enum([
		// 一致する・一致しない
		'MATCH',
		'NOT_MATCH',
		// 含む・含まない
		'INCLUDE',
		'NOT_INCLUDE',
		// 始まる・終わる
		'STARTS',
		'ENDS',
		// 始まらない・終わらない
		'NOT_STARTS',
		'NOT_ENDS',
		// 正規表現に一致する・一致しない
		'REGEXP_MATCH',
		'REGEXP_NOT_MATCH',
	]);
}
