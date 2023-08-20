import { z } from 'zod';

/**
 * 条件付きソート適用後の追加位置
 */
export type ConditionalMoveTo = z.infer<typeof ConditionalMoves.zod>;

/**
 * 条件付きソート適用後の追加位置
 */
export class ConditionalMoves {
	static readonly zod = z.enum(['TOP', 'BOTTOM']);
}
