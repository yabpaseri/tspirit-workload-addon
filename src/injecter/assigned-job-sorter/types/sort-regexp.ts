import { z } from 'zod';

export namespace SortRegexp {
	export const zod = z.object({
		pattern: z.string(),
		matchIndex: z.number().min(0),
		captureIndex: z.number().min(0),
	});
}
