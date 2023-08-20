import { z } from 'zod';
import { WhenTargets } from './when-target';
import { WhenConditions } from './when-condition';

/**
 * 条件付きソートの適用条件
 */
export type When = z.infer<typeof Whens.zod>;

/**
 * 条件付きソートの適用条件
 */
export class Whens {
	static readonly zod = z.object({
		/** 判断項目 */
		target: WhenTargets.zod,
		/** 判断方法 */
		condition: WhenConditions.zod,
		value: z.string().min(1),
	});
}
