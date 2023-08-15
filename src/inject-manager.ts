import { AreaCreatorWD, AssignedJobSorter, ExpiredJobSelector } from './injecter';

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
		new AreaCreatorWD(this.#empWorkDialog).mount();
	}
	setEmpJobAssign(empJobAssign: HTMLElement) {
		if (this.#empJobAssign != null) throw new Error('empJobAssign is already set');
		this.#empJobAssign = empJobAssign;
		new AssignedJobSorter(this.#empJobAssign).mount();
		new ExpiredJobSelector(this.#empJobAssign).mount();
	}
}
