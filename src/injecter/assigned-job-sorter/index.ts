import { Preference } from '../../preference';
import { UIs, utils } from '../../util';
import { Injecter } from '../injecter';
import { SortRule } from './sort-rule';
import { ExceptionalSortOption, RowInfo, SortOption } from './types';

/**
 * ジョブアサインダイアログに「ソート」を追加する
 */
export class AssignedJobSorter extends Injecter {
	private mounted!: HTMLElement[];
	private empJobUp!: HTMLElement;
	constructor(empJobAssign: HTMLElement) {
		super(empJobAssign);
	}

	mount(): void {
		// tr > td > button#empJobUp
		const up = this.find<HTMLButtonElement>('#empJobUp');
		const parent = up?.parentElement?.parentElement;
		if (up == null || parent == null) throw new Error('Failed to find ancestor table element for $("#empJobUp")');
		this.empJobUp = up;
		const td = UIs.create('td').appendTo(parent).done();
		const button = UIs.create('button')
			.classes('std-button2')
			.style((css) => (css.margin = '4px'))
			.append(UIs.create('div').text('ソート').done())
			.appendTo(td)
			.done();
		button.addEventListener('click', () => this.handleClick());
		this.mounted = [td];
	}
	unmount(): void {
		for (const e of this.mounted) e.remove();
	}

	private async handleClick() {
		const tbody = this.find<HTMLTableSectionElement>('#empJobRightTable > tbody');
		const rows = tbody?.querySelectorAll<HTMLTableRowElement>(':scope > tr');
		if (tbody == null || rows == null) throw new Error('Not found rows');
		if (rows.length === 0) return;
		const rowInfos = Array.from(rows).map(RowInfo.convert);
		// TODO: 設定からの読込。読み込めなかった場合は、何もしない or basic:KEEPだけのrule適用(=何もしない)
		const rule: SortRule = await Preference.getAssignedJobSortRule();
		if (rule.exceptional.length === 0) {
			this.applyBasicSort(rule.basic, rowInfos);
		} else {
			const tops: RowInfo[] = [];
			const bottoms: RowInfo[] = [];
			for (const er of rule.exceptional) {
				const matched = rowInfos.filter(this.isMatchWhen.bind(this, er.when));
				this.applyExceptionalSort(er.sort, rule.basic, matched);
				// 後者優先、topsとbottomsから、同じ要素を落とす
				for (const m of matched) {
					const topsIndex = tops.findIndex((v) => v.ele === m.ele);
					const bottomsIndex = tops.findIndex((v) => v.ele === m.ele);
					if (topsIndex >= 0) tops.splice(topsIndex, 1);
					if (bottomsIndex >= 0) bottoms.splice(bottomsIndex, 1);
				}
				if (er.moveto === 'TOP') {
					tops.unshift(...matched);
				} else {
					bottoms.push(...matched);
				}
			}
			// topsにもbottomsにも含まれない要素だけをソート
			const sorted = tops.concat(bottoms).map((v) => v.ele);
			const middle = rowInfos.filter((r) => !sorted.includes(r.ele));
			this.applyBasicSort(rule.basic, middle);
			rowInfos.length = 0; // jsにおけるremoveAll
			rowInfos.push(...tops, ...middle, ...bottoms);
		}
		const checkedboxes = tbody.querySelectorAll<HTMLInputElement>(':scope > tr > td > input[type="checkbox"]:checked');
		for (const c of checkedboxes) c.checked = false; // チェックを外す(empJobUp空打ちで狂わないように)
		for (const r of rowInfos) tbody.append(r.ele); // tbodyに詰めなおす
		this.empJobUp.click(); // 上へを空打ちすることで、IDや配色を正す
		for (const c of checkedboxes) c.checked = true;
	}

	private applyBasicSort(option: SortOption, rowInfos: RowInfo[]) {
		if (option.type === 'KEEP') return;
		const key = option.key;
		const order = option.order === 'ASC' ? 1 : -1;
		const regex = option.regexp == null ? void 0 : new RegExp(option.regexp.pattern, 'g');
		rowInfos.sort((a, b) => {
			const [akey, bkey] = key === 'JOB_CODE' ? [a.jobCode, b.jobCode] : [a.jobName, b.jobName];
			if (option.regexp != null && regex) {
				const amatch = [...akey.matchAll(regex)].at(option.regexp.matchIndex)?.at(option.regexp.captureIndex);
				const bmatch = [...bkey.matchAll(regex)].at(option.regexp.matchIndex)?.at(option.regexp.captureIndex);
				if (amatch != null && bmatch != null) {
					console.log(`${amatch} vs ${bmatch}`);
					return utils.compare(amatch, bmatch) * order;
				}
			}
			console.log(`${akey} vs ${bkey}`);
			return utils.compare(akey, bkey) * order;
		});
	}
	private applyExceptionalSort(option: ExceptionalSortOption, basicOption: SortOption, rowInfos: RowInfo[]) {
		if (option.type === 'KEEP') return;
		if (option.type === 'BASIC') {
			this.applyBasicSort(basicOption, rowInfos);
			return;
		}
		this.applyBasicSort(option, rowInfos); // 分岐結果はSortOptionと同じ型なので、流用可能。
	}

	private isMatchWhen(when: When, rowInfo: RowInfo): boolean {
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
			case 'STARTS':
				return target.startsWith(actual);
			case 'ENDS':
				return target.endsWith(actual);
			case 'NOT_STARTS':
				return !target.startsWith(actual);
			case 'NOT_ENDS':
				return !target.endsWith(actual);
			case 'REGEXP_MATCH':
				return new RegExp(actual).test(target);
			case 'REGEXP_NOT_MATCH':
				return !new RegExp(actual).test(target);
		}
	}
}

type When = SortRule['exceptional'][number]['when'];
