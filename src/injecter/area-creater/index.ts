import { UIs } from '../../util';
import { Injecter } from '../injecter';

/**
 * 工数実績入力ダイアログのフッター領域(＋,登録, キャンセル, 設定)のtableの構造を変化させ \
 * 拡張機能がボタンを作りやすい状況を作成する。
 */
export class AreaCreatorWD extends Injecter {
	static readonly FOOTER_RIGHT_ID = 'tswa__work_dialog_footer_right';

	constructor(empWorkDialog: HTMLElement) {
		super(empWorkDialog);
	}

	mount(): void {
		const empWorkOk = this.find('#empWorkOk'); // 「登録」ボタン
		if (!empWorkOk || !(empWorkOk instanceof HTMLElement)) throw new Error('Not found $("#empWorkOk")');
		this.adjustmentTd(empWorkOk);
		this.adjustmentTable(empWorkOk);
		this.wrapLastTd(empWorkOk);
	}
	unmount(): void {
		// 原状復帰は面倒くさいので対応しない
		throw new Error(`${this.constructor.name} cannot unmount`);
	}

	private adjustmentTd(empWorkOk: HTMLElement) {
		const centerWrapper = empWorkOk.parentElement; // div
		const centerTd = centerWrapper?.parentElement; // td
		const tr = centerTd?.parentElement; //         // tr
		if (centerWrapper == null || centerTd == null || tr == null) {
			throw new Error('Failed to find ancestor element for $("#empWorkOk")');
		}
		centerTd.style.width = `${centerWrapper.getBoundingClientRect().width}px`; // 疑似fit-content
		// 他の<td/>に関しては、widthを消す
		for (const td of tr.querySelectorAll<HTMLTableCellElement>(':scope > td')) {
			if (td === centerTd) continue;
			td.style.width = 'auto';
		}
	}
	private adjustmentTable(empWorkOk: HTMLElement) {
		// table > tbody > tr > td > div > button#empWorkOk を辿っている
		const table = empWorkOk.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
		if (table == null || !(table instanceof HTMLTableElement)) {
			throw new Error('Failed to find ancestor table element for $("#empWorkOk")');
		}
		table.style.tableLayout = 'fixed';
	}
	private wrapLastTd(empWorkOk: HTMLElement) {
		const tr = empWorkOk.parentElement?.parentElement?.parentElement;
		if (tr == null) throw new Error('Failed to find ancestor tr element for $("#empWorkOk")');
		const td = tr.querySelector<HTMLTableCellElement>(':scope > td:last-of-type');
		if (td == null) throw new Error('Failed to find sibling td element for $("#empWorkOk")');
		UIs.create('div')
			.id(AreaCreatorWD.FOOTER_RIGHT_ID)
			.style((css) => (css.display = 'inline-flex'))
			.append(...td.childNodes)
			.appendTo(td); // td配下の要素をdivで括る
	}
}
