import { ALL_ADDONS } from './addons';
import { Addon, JobAssignAddon, WorkBalanceAddon } from './addons/addon-base';
import { Preference } from './preference';

// content-script用

declare const window: Window['window'] & {
	tsw: {
		preference?: typeof Preference;
	};
};

(function main() {
	window.tsw = window.tsw ?? {};
	window.tsw.preference = Preference;

	// DOM要素管理
	const elements = new (class {
		public empWorkDialog: HTMLElement | undefined;
		public empJobAssign: HTMLElement | undefined;
		get isComplete() {
			return this.empJobAssign != null && this.empJobAssign != null;
		}
	})();

	// Addon#inject実行
	const inject = (clazz: typeof Addon, ele: HTMLElement) => {
		for (const addon of ALL_ADDONS) {
			if (addon instanceof clazz) addon.inject(ele);
		}
	};

	function mutationCallback(mutations: MutationRecord[], observer: MutationObserver) {
		// 追加された要素の中から「empWorkDialog」または「empJobAssign」のIDを持つ要素を探す
		for (const node of mutations.flatMap((r) => Array.from(r.addedNodes))) {
			if (!(node instanceof HTMLElement)) continue;
			if (node.id === 'empWorkDialog') {
				elements.empWorkDialog = node;
				inject(WorkBalanceAddon, node);
			} else if (node.id === 'empJobAssign') {
				elements.empJobAssign = node;
				inject(JobAssignAddon, node);
			}
			if (elements.isComplete) {
				observer.disconnect();
				break;
			}
		}
	}
	new MutationObserver(mutationCallback).observe(document.body, { childList: true, subtree: true });
})();
