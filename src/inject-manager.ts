import { ALL_ADDONS } from './addons';
import { Addon, JobAssignAddon, WorkBalanceAddon } from './addons/addon-base';

export class InjectManager {
	/** 工数実績入力ダイアログ */
	#empWorkDialog?: HTMLElement;
	/** ジョブアサインダイアログ */
	#empJobAssign?: HTMLElement;

	/** 要素が揃っているか */
	get iscomplete(): boolean {
		return this.#empWorkDialog != null && this.#empJobAssign != null;
	}

	setEmpWorkDialog(empWorkDialog: HTMLElement) {
		if (this.#empWorkDialog != null) throw new Error('empWorkDialog is already set');
		this.#empWorkDialog = empWorkDialog;
		this.#inject(WorkBalanceAddon, empWorkDialog);
	}
	setEmpJobAssign(empJobAssign: HTMLElement) {
		if (this.#empJobAssign != null) throw new Error('empJobAssign is already set');
		this.#empJobAssign = empJobAssign;
		this.#inject(JobAssignAddon, empJobAssign);
	}
	#inject(c: typeof Addon, ele: HTMLElement) {
		for (const addon of ALL_ADDONS) {
			if (addon instanceof c) addon.inject(ele);
		}
	}
}
