import { z } from 'zod';

export type SortKey = z.infer<typeof SortKey.zod>;
export namespace SortKey {
	export const zod = z.enum(['JOB_CODE', 'JOB_NAME']);
}
