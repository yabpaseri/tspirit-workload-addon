import { Consumer } from './util';

/**
 * メソッドチェーン可能なdocument.createElement
 */
export const create = <K extends keyof HTMLElementTagNameMap>(tag: K) => {
	return new UIBuilder(tag);
};

/** document.querySelectorのシンタックスシュガー */
export const find = document.querySelector.bind(document);
/** document.querySelectorAllのシンタックスシュガー */
export const finds = document.querySelectorAll.bind(document);

/** document.evaluate を扱いやすくラップしたもの */
export const evaluate = (xpath: string, node: Node = document): Node[] => {
	const res = document.evaluate(xpath, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	return [...Array(res.snapshotLength)].map((_, i) => res.snapshotItem(i)) as Node[];
};

class UIBuilder<K extends keyof HTMLElementTagNameMap> {
	#e: HTMLElementTagNameMap[K];
	#skip: boolean;
	constructor(tag: K);
	constructor(ele: HTMLElementTagNameMap[K]);
	constructor(val: K | HTMLElementTagNameMap[K]) {
		this.#e = typeof val === 'string' ? document.createElement(val) : val;
		this.#skip = false;
	}

	public readonly if = (test: boolean | (() => boolean)) => {
		this.#skip = typeof test === 'boolean' ? !test : !test();
		return this;
	};
	public readonly fi = () => {
		this.#skip = false;
		return this;
	};

	public readonly id = (id: string) => {
		if (this.#skip) return this;
		this.#e.id = id;
		return this;
	};
	public readonly classes = (...classes: string[]) => {
		if (this.#skip) return this;
		this.#e.classList.add(...classes);
		return this;
	};
	public readonly title = (title: string) => {
		if (this.#skip) return this;
		this.#e.title = title;
		return this;
	};
	public readonly text = (content: string) => {
		if (this.#skip) return this;
		this.#e.textContent = content;
		return this;
	};
	public readonly style = (fy: Consumer<CSSStyleDeclaration>) => {
		if (this.#skip) return this;
		fy(this.#e.style);
		return this;
	};
	public readonly src = (src: string) => {
		if (this.#skip || !('src' in this.#e)) return this;
		this.#e.src = src;
		return this;
	};

	public readonly append = (...nodes: (string | Node)[]) => {
		if (this.#skip) return this;
		this.#e.append(...nodes);
		return this;
	};
	public readonly prepend = (...nodes: (string | Node)[]) => {
		if (this.#skip) return this;
		this.#e.prepend(...nodes);
		return this;
	};

	public readonly appendTo = (parent: HTMLElement) => {
		if (this.#skip) return this;
		parent.append(this.#e);
		return this;
	};
	public readonly prependTo = (parent: HTMLElement) => {
		if (this.#skip) return this;
		parent.prepend(this.#e);
		return this;
	};

	public readonly remove = () => {
		if (this.#skip) return this;
		this.#e.remove();
		return this;
	};

	public readonly done = (): HTMLElementTagNameMap[K] => {
		return this.#e;
	};
}
