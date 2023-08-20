import { UIs } from '~/util';
import { AddonInfos, WorkBalanceAddon } from '../addon-base';

/**
 * 工数実績入力ダイアログのフッター領域(+, 登録, キャンセル, 設定)  \
 * のテーブル構造を書き換え、拡張機能が要素を追加しやすい状態にする。
 */
export default class AreaCreator extends WorkBalanceAddon {
	static WORK_DIALOG_FOOTER_LEFT_ID = 'tsw__work_dialog_footer_left' as const;
	static WORK_DIALOG_FOOTER_RIGHT_ID = 'tsw__work_dialog_footer_right' as const;

	get infos(): AddonInfos {
		return { name: 'area creator' };
	}
	inject(empWorkDialog: HTMLElement): void {
		const empWorkOk = empWorkDialog.querySelector<HTMLElement>('#empWorkOk');
		if (!empWorkOk) throw new Error('$("#empWorkOk") not found.');
		// table > tbody > tr > td(centerTd) > div(centerWrapper) > button#empWorkOk
		const centerWrapper = empWorkOk.parentElement;
		const centerTd = centerWrapper?.parentElement;
		const tr = centerTd?.parentElement;
		const leftTd = tr?.querySelector<HTMLElement>(':scope > td:first-of-type');
		const rightTd = tr?.querySelector<HTMLElement>(':scope > td:last-of-type');
		const table = tr?.parentElement?.parentElement;
		if (!centerWrapper || !leftTd || !centerTd || !rightTd || !tr || !table) {
			throw new Error('Ancestor element for $("#empWorkOk") not found.');
		}
		// centerWrapperのwidthをcenterTdのwidth属性として充てる疑似fit-contentをする
		// trの下にはcenterTdを中心に3つのtdが並んでいるが、
		// centerTdの幅を最小限にし、両端のtdに残りの幅を均等に割り振るため。

		// 1. table-layoutはfixedにする
		table.style.tableLayout = 'fixed';

		// 2. centerTdに疑似fit-contentをする
		new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.target !== centerWrapper) continue;
				const width = entry.target.getBoundingClientRect().width;
				if (0 < width) {
					centerTd.style.width = `${width}px`;
				} else {
					// 0を書き込むと getBoundingClientRect();の値が期待通りにならなくなる。
					centerTd.style.width = '';
				}
			}
		}).observe(centerWrapper);

		// 3. 両端のtdのwidthをautoにする
		leftTd.style.width = rightTd.style.width = 'auto';

		// 4. 両端のtdの直下の要素を、divで括る。要素の追加をしやすくするため。
		UIs.create('div')
			.id(AreaCreator.WORK_DIALOG_FOOTER_LEFT_ID)
			.style((css) => (css.display = 'inline-flex'))
			.append(...leftTd.childNodes)
			.appendTo(leftTd);
		UIs.create('div')
			.id(AreaCreator.WORK_DIALOG_FOOTER_RIGHT_ID)
			.style((css) => (css.display = 'inline-flex'))
			.append(...rightTd.childNodes)
			.appendTo(rightTd);
	}
}
