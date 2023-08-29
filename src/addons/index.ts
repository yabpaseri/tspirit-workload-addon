import { Addon } from './addon-base';
import AreaCreator from './area-creator';
import AssignedJobSorter from './assigned-job-sorter';
import ExpiredJobSelector from './expired-job-selector';
import WorkloadImporter from './workload-importer';

export const ALL_ADDONS: Readonly<Addon[]> = [
	// WorkBalanceAddon
	new AreaCreator(),
	new WorkloadImporter(),
	// JobAssignAddon
	new AssignedJobSorter(),
	new ExpiredJobSelector(),
].filter((addon) => addon.infos.enabled);
