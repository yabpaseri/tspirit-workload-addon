export abstract class Injecter {
	constructor(protected root: HTMLElement) {
		this.find = this.root.querySelector.bind(this.root);
		this.finds = this.root.querySelectorAll.bind(this.root);
	}
	protected find: ParentNode['querySelector'];
	protected finds: ParentNode['querySelectorAll'];

	abstract mount(): void;
	abstract unmount(): void;
}
