import { SortRule, SortRules } from './addons/assigned-job-sorter/types';

export class Preference {
	static #ASSIGNED_JOB_SORT_RULE = 'ASSIGNED_JOB_SORT_RULE';
	static async getAssignedJobSortRule(): Promise<SortRule> {
		const data = (await chrome.storage.local.get(this.#ASSIGNED_JOB_SORT_RULE))[this.#ASSIGNED_JOB_SORT_RULE];
		if (data == null) {
			const v = SortRules.defaults();
			await this.setAssignedJobSortRule(v);
			return v;
		}
		return SortRules.parse(JSON.parse(data));
	}
	static async setAssignedJobSortRule(rule: SortRule) {
		const val = rule == null ? null : JSON.stringify(rule);
		return chrome.storage.local.set({ [this.#ASSIGNED_JOB_SORT_RULE]: val });
	}
}
