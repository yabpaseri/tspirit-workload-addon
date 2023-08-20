import { z } from 'zod';
import { SortOptions } from './sort-option';
import { ConditionalSorts } from './conditional-sort';

/**
 * アサイン済みジョブのソートルール
 */
export type SortRule = z.infer<typeof SortRules.zod>;

/**
 * アサイン済みジョブのソートルール
 */
export class SortRules {
	static readonly zod = z.object({
		version: z.literal(2),
		base: SortOptions.zod,
		conditional: ConditionalSorts.zod.array(),
	});

	static readonly parse = this.zod.parse.bind(this);

	static readonly defaults = (): SortRule => ({
		version: 2,
		base: {
			type: 'CUSTOMIZE',
			key: 'JOB_CODE',
			order: 'ASC',
		},
		conditional: [
			{
				when: { target: 'JOB_NAME', condition: 'ENDS_WITH', value: '(終了)' },
				sort: { type: 'KEEP' },
				moveto: 'BOTTOM',
			},
		],
	});
}
