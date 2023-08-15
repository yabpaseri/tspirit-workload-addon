import { z } from 'zod';
import { ExceptionalSortOption, MoveTo, SortOption, WhenCondition, WhenTarget } from './types';

export type SortRule = z.infer<typeof SortRule.zod>;
export namespace SortRule {
	export const zod = z.object({
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

	export const defaults = (): SortRule => ({
		basic: {
			type: 'CUSTOM',
			key: 'JOB_CODE',
			order: 'ASC',
		},
		exceptional: [
			{
				when: { target: 'JOB_NAME', condition: 'INCLUDE', value: '通常サポート' },
				sort: { type: 'CUSTOM', key: 'JOB_NAME', order: 'DESC' },
				moveto: 'TOP',
			},
			{
				when: { target: 'JOB_NAME', condition: 'STARTS', value: 'その他業務_' },
				sort: { type: 'KEEP' },
				moveto: 'TOP',
			},
			{
				when: { target: 'JOB_NAME', condition: 'STARTS', value: '[製品開発]' },
				sort: { type: 'BASIC' },
				moveto: 'TOP',
			},
		],
	});
}
