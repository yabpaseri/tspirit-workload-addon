import { UIs } from '~/util';
import { AddonInfos, WorkBalanceAddon } from '../addon-base';
import AreaCreator from '../area-creator';
import { Index } from './options';

/**
 * 「インポート」機能
 */
export default class WorkloadImporter extends WorkBalanceAddon {
	get infos(): AddonInfos {
		return {
			name: '工数インポート',
			options: {
				priority: 0,
				component: Index,
			},
		};
	}
	inject(empWorkDialog: HTMLElement): void {
		const id = AreaCreator.WORK_DIALOG_FOOTER_RIGHT_ID;
		const footerRight = empWorkDialog.querySelector<HTMLElement>(`#${id}`);
		if (!footerRight) throw new Error(`$("#${id}") not found.`);
		const button = UIs.create('button')
			.classes('std-button2')
			.style((css) => (css.marginLeft = 'auto'))
			.title('工数インポート')
			.append(UIs.create('div').text('インポート').done())
			.prependTo(footerRight)
			.done();
		button.addEventListener('click', this.#handleClick.bind(this, empWorkDialog));
	}

	async #handleClick(empWorkDialog: HTMLElement) {
		console.log(empWorkDialog);
		return;
	}
}
