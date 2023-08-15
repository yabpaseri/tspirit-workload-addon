import { UIs } from '../../util';
import { Injecter } from '../injecter';

/**
 * ジョブアサインダイアログに「終了を全選択」を追加する
 */
export class ExpiredJobSelector extends Injecter {
	private mounted!: HTMLElement[];
	constructor(empJobAssign: HTMLElement) {
		super(empJobAssign);
	}

	mount(): void {
		// tr > td > button#empJobDel
		const parent = this.find('#empJobDel')?.parentElement?.parentElement;
		if (parent == null) throw new Error('Failed to find ancestor table element for $("#empJobDel")');
		const td = UIs.create('td').appendTo(parent).done();
		const button = UIs.create('button')
			.classes('std-button2')
			.style((css) => (css.margin = '4px'))
			.append(UIs.create('div').text('終了を全選択').done())
			.appendTo(td)
			.done();
		button.addEventListener('click', this.handleClick.bind(this));
		this.mounted = [td];
	}
	unmount(): void {
		for (const e of this.mounted) e.remove();
	}

	private handleClick() {
		const items = this.finds('#empJobRightTable > tbody > tr');
		itemsLoop: for (const item of items) {
			const divs = item.querySelectorAll('div > div'); // 少しでも絞り込む
			for (const d of divs) {
				if (d.textContent === '(終了)') {
					const input = item.querySelector<HTMLInputElement>('input[type="checkbox"]');
					if (input) input.checked = true;
					continue itemsLoop;
				}
			}
		}
	}
}
