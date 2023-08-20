import { z } from 'zod';

/**
 * ソートキーの値を変換するために使用する正規表現の情報
 */
export type SortRegExp = z.infer<typeof SortRegExps.zod>;

/**
 * ソートキーの値を変換するために使用する正規表現の情報
 * ```
 * ("ソートキーの値".matchAll(pattern))[matchIndex][captureIndex]
 * ```
 * の値がソートに使用されるようになる。
 */
export class SortRegExps {
	static readonly zod = z.object({
		pattern: z
			.string()
			.min(1)
			.transform((p) => new RegExp(p, 'g')),
		matchIndex: z.number().int().min(0),
		captureIndex: z.number().int().min(0),
	});
}
