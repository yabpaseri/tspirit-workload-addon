import { z } from 'zod';

export type MoveTo = z.infer<typeof MoveTo.zod>;
export namespace MoveTo {
	export const zod = z.enum(['TOP', 'BOTTOM']);
}
