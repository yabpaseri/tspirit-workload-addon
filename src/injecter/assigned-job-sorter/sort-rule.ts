import { z } from 'zod';
import { ExceptionalSortOption, MoveTo, SortOption, WhenCondition, WhenTarget } from './types';

export type SortRule = z.infer<typeof SortRule.zod>;
export namespace SortRule {
	export const zod = z.object({
		version: z.literal(1),
		basic: SortOption.zod,
		exceptional: z
			.object({
				when: z.object({
					target: WhenTarget.zod,
					value: z.string().min(1),
					condition: WhenCondition.zod,
				}),
				moveto: MoveTo.zod,
				sort: ExceptionalSortOption.zod,
			})
			.array(),
	});

	export const parse = zod.parse.bind(zod);

	export const defaults = (): SortRule => ({
		version: 1,
		basic: {
			type: 'CUSTOM',
			key: 'JOB_CODE',
			order: 'ASC',
		},
		exceptional: [
			{
				when: { target: 'JOB_NAME', condition: 'ENDS', value: '(終了)' },
				sort: { type: 'KEEP' },
				moveto: 'BOTTOM',
			},
		],
	});
}
