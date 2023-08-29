import { UIs } from '~/util';
import { AddonInfos, JobAssignAddon } from '../addon-base';

/**
 * 「終了を全選択」機能
 */
export default class ExpiredJobSelector extends JobAssignAddon {
	get infos(): AddonInfos {
		return { enabled: true, name: 'expired job selector' };
	}
	inject(empJobAssign: HTMLElement): void {
		// tr(parent) > td > button#empJobDel
		const parent = empJobAssign.querySelector('#empJobDel')?.parentElement?.parentElement;
		if (!parent) throw new Error('$("#empJobDel") not found.');
		const button = UIs.create('button')
			.classes('std-button2')
			.style((css) => (css.margin = '4px'))
			.append(UIs.create('div').text('終了を全選択').done())
			.appendTo(UIs.create('td').appendTo(parent).done())
			.done();
		button.addEventListener('click', this.#handleClick.bind(this, empJobAssign));
	}

	#handleClick(empJobAssign: HTMLElement) {
		const items = empJobAssign.querySelectorAll('#empJobRightTable > tbody > tr');
		itemLoop: for (const item of items) {
			const input = item.querySelector<HTMLInputElement>('input[type="checkbox"]');
			if (!input) continue;
			const divs = item.querySelectorAll('div > div');
			for (const div of divs) {
				if (div.textContent === '(終了)') {
					input.checked = true;
					continue itemLoop;
				}
			}
			input.checked = false; // (終了ではないもののチェックは外しておく)
		}
	}
}
