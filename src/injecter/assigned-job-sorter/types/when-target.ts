import { z } from 'zod';

export type WhenTarget = z.infer<typeof WhenTarget.zod>;
export namespace WhenTarget {
	export const zod = z.enum(['JOB_CODE', 'JOB_NAME']);
}
