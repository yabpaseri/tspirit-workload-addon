import { UIs } from '~/util';
import { AddonInfos, WorkBalanceAddon } from '../addon-base';
import AreaCreator from '../area-creator';
import { C2PMessage, P2CMessage } from './iframe/message';
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

		// iframeを使用している理由は、同フォルダ内のREADME.txtを参照
		const manager = new IFrameManager(empWorkDialog);
		button.addEventListener('click', this.#handleClick.bind(this, manager));
	}

	async #handleClick(manager: IFrameManager) {
		manager.open();
		return;
	}
}

class IFrameManager {
	#src: string;
	#origin: string;
	// 操作しやすいので、UIBuilderのまま保持しておく
	#iframe: ReturnType<typeof UIs.create<'iframe'>>;
	#wrapper: ReturnType<typeof UIs.create<'div'>>;
	constructor(private empWorkDialog: HTMLElement) {
		this.#src = chrome.runtime.getURL('pages/workload-import.html');
		this.#origin = new URL(this.#src).origin;
		this.#handleMessage = this.#handleMessage.bind(this);
		this.#iframe = UIs.create('iframe') //
			.style((css) => {
				css.width = '100%';
				css.height = '100%';
				css.border = 'none';
			});
		this.#wrapper = UIs.create('div')
			.style((css) => {
				css.inset = '0';
				css.zIndex = '999';
				css.position = 'fixed';
			})
			.append(this.#iframe.done());
	}

	open(): void {
		this.#wrapper.appendTo(document.body);
		this.#iframe.src(`${this.#src}?origin=${encodeURIComponent(window.location.origin)}`);
		window.addEventListener('message', this.#handleMessage);
	}
	close(): void {
		this.#wrapper.remove();
		this.#iframe.src('about:blank');
		this.empWorkDialog;
		window.removeEventListener('message', this.#handleMessage);
	}

	#handleMessage = (e: MessageEvent) => {
		const data = e.data;
		console.log(data);
		if (e.origin === this.#origin && typeof data === 'object' && 'type' in data) {
			this.#receive(data);
		}
	};

	#receive(message: C2PMessage) {
		switch (message.type) {
			case 'close': {
				this.close();
				this.#send({ type: 'saved' });
				break;
			}
		}
	}
	#send(message: P2CMessage) {
		this.#iframe.done().contentWindow?.postMessage(message, this.#origin);
	}
}
