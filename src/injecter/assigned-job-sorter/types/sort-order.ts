import { z } from 'zod';

export type SortOrder = z.infer<typeof SortOrder.zod>;
export namespace SortOrder {
	export const zod = z.enum(['ASC', 'DESC']);
}
