import { InjectManager } from './inject-manager';

(function main() {
	const manager = new InjectManager();
	function mutationCallback(mutations: MutationRecord[], observer: MutationObserver) {
		// 追加された要素の中から「empWorkDialog」または「empJobAssign」のIDを持つ要素を探す
		for (const node of mutations.flatMap((r) => Array.from(r.addedNodes))) {
			if (!(node instanceof HTMLElement)) continue;
			if (node.id === 'empWorkDialog') {
				manager.setEmpWorkDialog(node);
			} else if (node.id === 'empJobAssign') {
				manager.setEmpJobAssign(node);
			}
			if (manager.iscomplete) {
				observer.disconnect();
				break;
			}
		}
	}
	new MutationObserver(mutationCallback).observe(document.body, { childList: true, subtree: true });
})();