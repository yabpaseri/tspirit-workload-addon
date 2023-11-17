import { Preference } from '~/preference';
import { UIs, utils } from '~/util';
import { AddonInfos, JobAssignAddon } from '../addon-base';
import { ConditionalSortOption, SortOption, When } from './types';

/**
 * 「ソート」機能
 */
export default class AssignedJobSorter extends JobAssignAddon {
	get infos(): AddonInfos {
		return {
			enabled: true,
			name: 'ジョブソート',
			// options: {
			// 	priority: 1,
			// 	component: () => import('./options').then((v) => v.Index),
			// },
		};
	}
	inject(empJobAssign: HTMLElement): void {
		// tr(parent) > td > button#empJobUp(up)
		const up = empJobAssign.querySelector<HTMLButtonElement>('#empJobUp');
		if (!up) throw new Error('$("#empJobUp") not found.');
		const parent = up.parentElement?.parentElement;
		if (!parent) {
			throw new Error('Ancestor element for $("#empJobUp") not found.');
		}
		const button = UIs.create('button')
			.classes('std-button2')
			.style((css) => (css.margin = '4px'))
			.append(UIs.create('div').text('ソート').done())
			.appendTo(UIs.create('td').appendTo(parent).done())
			.done();
		button.addEventListener('click', this.#handleClick.bind(this, empJobAssign, up));
	}

	async #handleClick(empJobAssign: HTMLElement, empJobUp: HTMLButtonElement) {
		// table#empJobRightTable > tbody > tr[](rows)
		const tbody = empJobAssign.querySelector<HTMLTableSectionElement>('#empJobRightTable > tbody');
		const rows = tbody?.querySelectorAll<HTMLTableRowElement>(':scope > tr');
		if (tbody == null || rows == null) {
			throw new Error('Descendant element for $("#empJobRightTable") not found.');
		}
		if (rows.length === 0) return;

		const infos = Array.from(rows).map(RowInfo.convert);
		const rule = await Preference.getAssignedJobSortRule();
		if (rule.conditional.length === 0) {
			this.#applySort(rule.base, infos);
		} else {
			const tops: RowInfo[] = [];
			const bottoms: RowInfo[] = [];
			for (const cr of rule.conditional) {
				const matched = infos.filter(this.#isMatchWhen.bind(this, cr.when));
				this.#applyConditionalSort(cr.sort, rule.base, matched);
				// 後者優先、topsとbottomsから、同じ要素を落とす
				for (const m of matched) {
					const topsIndex = tops.findIndex((v) => v.ele === m.ele);
					const bottomsIndex = tops.findIndex((v) => v.ele === m.ele);
					if (topsIndex >= 0) tops.splice(topsIndex, 1);
					if (bottomsIndex >= 0) bottoms.splice(bottomsIndex, 1);
				}
				if (cr.moveto === 'TOP') {
					tops.unshift(...matched);
				} else {
					bottoms.push(...matched);
				}
			}
			// topsにもbottomsにも含まれない要素だけをソート
			const sorted = tops.concat(bottoms).map((v) => v.ele);
			const middle = infos.filter((r) => !sorted.includes(r.ele));
			this.#applySort(rule.base, middle);
			infos.length = 0; // jsにおけるremoveAll
			infos.push(...tops, ...middle, ...bottoms);
		}
		const checkedboxes = tbody.querySelectorAll<HTMLInputElement>(':scope > tr > td > input[type="checkbox"]:checked');
		for (const c of checkedboxes) c.checked = false; // チェックを外す(empJobUp空打ちで狂わないように)
		for (const r of infos) tbody.append(r.ele); // tbodyに詰めなおす
		empJobUp.click(); // 上へを空打ちすることで、IDや配色を正す
		for (const c of checkedboxes) c.checked = true;
	}

	#applySort(option: SortOptionPseudo, rowInfos: RowInfo[]) {
		if (option.type === 'KEEP') return;
		const key = option.key;
		const order = option.order === 'ASC' ? 1 : -1;
		rowInfos.sort((a, b) => {
			const [akey, bkey] = key === 'JOB_CODE' ? [a.jobCode, b.jobCode] : [a.jobName, b.jobName];
			if (option.regexp) {
				const amatch = [...akey.matchAll(option.regexp.pattern)].at(option.regexp.matchIndex)?.at(option.regexp.captureIndex);
				const bmatch = [...bkey.matchAll(option.regexp.pattern)].at(option.regexp.matchIndex)?.at(option.regexp.captureIndex);
				if (amatch != null && bmatch != null) {
					return utils.compare(amatch, bmatch) * order;
				}
			}
			return utils.compare(akey, bkey) * order;
		});
	}

	#applyConditionalSort(option: ConditionalSortOption, base: SortOption, rowInfos: RowInfo[]) {
		switch (option.type) {
			case 'KEEP':
				return;
			case 'BASE':
				return this.#applySort(base, rowInfos);
			case 'CUSTOMIZE':
				return this.#applySort(option, rowInfos);
		}
	}

	#isMatchWhen(when: When, rowInfo: RowInfo): boolean {
		const target = when.target === 'JOB_CODE' ? rowInfo.jobCode : rowInfo.jobName;
		const actual = when.value;
		switch (when.condition) {
			case 'MATCH':
				return actual === target;
			case 'NOT_MATCH':
				return actual !== target;
			case 'INCLUDE':
				return target.includes(actual);
			case 'NOT_INCLUDE':
				return !target.includes(actual);
			case 'STARTS_WITH':
				return target.startsWith(actual);
			case 'ENDS_WITH':
				return target.endsWith(actual);
			case 'NOT_STARTS_WITH':
				return !target.startsWith(actual);
			case 'NOT_ENDS_WITH':
				return !target.endsWith(actual);
			case 'MATCH_REGEXP':
				return new RegExp(actual).test(target);
			case 'NOT_MATCH_REGEXP':
				return !new RegExp(actual).test(target);
		}
	}
}

/**
 * 行情報
 */
class RowInfo {
	constructor(
		/** <tr/>要素 */
		public readonly ele: HTMLTableRowElement,
		/** ジョブコード */
		public readonly jobCode: string,
		/** ジョブ名 */
		public readonly jobName: string,
	) {}
	static readonly convert = (row: HTMLTableRowElement): RowInfo => {
		const jobCode = row.querySelector(':scope > td:nth-of-type(2) > div')?.textContent;
		if (jobCode == null || jobCode.length === 0) throw new Error('jobCode not found.');
		const jobName = row.querySelector(':scope > td:nth-of-type(3) > div')?.textContent;
		if (jobName == null || jobName?.length === 0) throw new Error('jobName not found.');
		return new RowInfo(row, jobCode, jobName);
	};
}

type SortOptionPseudo = SortOption;
