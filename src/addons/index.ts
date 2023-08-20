import { Addon } from './addon-base';
import AreaCreator from './area-creator';
import AssignedJobSorter from './assigned-job-sorter';
import ExpiredJobSelector from './expired-job-selector';

export const ALL_ADDONS: Readonly<Addon[]> = [
	// WorkBalanceAddon
	new AreaCreator(),
	// JobAssignAddon
	new AssignedJobSorter(),
	new ExpiredJobSelector(),
];
