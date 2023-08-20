import { createElement } from 'react';

export abstract class Addon {
	/**
	 * アドオンの情報を返す
	 */
	abstract infos(): AddonInfos;

	/**
	 * TeamSpiritに要素を注入する
	 */
	abstract inject(root: HTMLElement): void;
}

/** 工数実績入力のアドオン */
export abstract class WorkBalanceAddon extends Addon {
	abstract override inject(empWorkDialog: HTMLElement): void;
}

/** ジョブアサインのアドオン */
export abstract class JobAssignAddon extends Addon {
	abstract override inject(empJobAssign: HTMLElement): void;
}

export type AddonInfos = {
	/** アドオン名 */
	name: string;
	/** 有効フラグ */
	active: boolean;
	/** 設定ページ用コンポーネント */
	options?: Parameters<typeof createElement>[0];
};
