import { parse as csvParse } from 'csv-parse/browser/esm/sync';
import { stringify as csvStringify } from 'csv-stringify/browser/esm/sync';
import { z } from 'zod';
import { UIs } from '~/util';
import { AddonInfos, WorkBalanceAddon } from '../addon-base';
import AreaCreator from '../area-creator';

/**
 * 「インポート」「エクスポート」機能
 */
export default class WorkloadImporter extends WorkBalanceAddon {
	get infos(): AddonInfos {
		return {
			enabled: true,
			name: '工数インポート・エクスポート',
		};
	}

	inject(empWorkDialog: HTMLElement): void {
		const id = AreaCreator.WORK_DIALOG_FOOTER_RIGHT_ID;
		const footerRight = empWorkDialog.querySelector<HTMLElement>(`#${id}`);
		if (!footerRight) throw new Error(`$("#${id}") not found.`);
		// [エクスポート][インポート][設定] の順に並べる
		// prependTo を使っているので、より右にあるものから作る
		const importButton = UIs.create('button')
			.classes('std-button2')
			.style((css) => (css.marginLeft = 'auto'))
			.title('工数インポート')
			.append(UIs.create('div').text('インポート').done())
			.prependTo(footerRight)
			.done();
		importButton.addEventListener('click', this.#handleImport.bind(this, empWorkDialog));

		const exportButton = UIs.create('button')
			.classes('std-button2')
			.style((css) => (css.marginLeft = 'auto'))
			.title('工数エクスポート')
			.append(UIs.create('div').text('エクスポート').done())
			.prependTo(footerRight)
			.done();
		exportButton.addEventListener('click', this.#handleExport.bind(this, empWorkDialog));
	}

	// ----- エクスポート系処理 -----
	#handleExport(empWorkDialog: HTMLElement) {
		const rows = empWorkDialog.querySelectorAll<HTMLTableRowElement>('#empWorkTableBody > tr');
		const data = [...rows].map(this.#tableRowToData);
		this.#csvDownload(data);
	}
	#tableRowToData(row: HTMLTableRowElement): Data {
		const name = row.querySelector('td:first-of-type > .name')?.textContent ?? '';
		const time = ((wrapper) => {
			const defTime = '0:00';
			if (!wrapper) return defTime;
			const visible = [...wrapper.children].find((e) => e.checkVisibility());
			if (!visible) {
				return defTime;
			} else if (visible instanceof HTMLInputElement) {
				return visible.value;
			} else if (visible instanceof HTMLDivElement) {
				// -(ハイフン) はインポートの際に「残工数の均等配分」にしたいので、
				const val = visible.textContent ?? defTime;
				return val === '-' ? defTime : val;
			} else {
				return defTime;
			}
		})(row.querySelector('td:nth-of-type(2) > div:nth-of-type(2)'));
		return { name, time };
	}
	#download(contents: string, ext: string, contentType: string): void {
		const blob = new Blob([contents], { type: contentType });
		const a = UIs.create('a').done();
		a.target = '_blank';
		a.download = `workload.${ext}`;
		a.href = URL.createObjectURL(blob);
		a.click();
		URL.revokeObjectURL(a.href);
	}
	#csvDownload(data: Data[]) {
		this.#download(csvStringify(data, { encoding: 'utf-8', header: true, quoted: true }), 'csv', 'text/csv');
	}

	// -----インポート系処理 -----
	async #handleImport(empWorkDialog: HTMLElement) {
		const file = await this.#upload();
		if (!file) return;
		const text = await file.text();
		const data: Data[] | undefined = (() => {
			switch (file.type) {
				case 'text/csv':
					return this.#parseCsv(text);
			}
		})();
		if (!data) return;
		this.#reflectDataInTableRow(empWorkDialog, data);
	}
	#upload(): Promise<File | null> {
		return new Promise<File | null>((ok) => {
			const input = UIs.create('input').done();
			input.type = 'file';
			input.accept = '.csv,';
			input.onchange = () => ok(input.files?.item(0) ?? null);
			input.click();
		});
	}
	#parseCsv(csv: string): Data[] {
		const parsed = csvParse(csv, { encoding: 'utf-8', columns: true });
		const data = ZData.array().parse(parsed);
		return data;
	}
	#reflectDataInTableRow(empWorkDialog: HTMLElement, data: Data[]) {
		// textContent を querySelector 出来ないので、最初にまとめて取得しておく
		const rows = [...empWorkDialog.querySelectorAll<HTMLTableRowElement>('#empWorkTableBody > tr')].reduce((map, row) => {
			const name = row.querySelector('td:first-of-type > .name')?.textContent;
			if (name == null || name === '') return map;
			const wrapper = row.querySelector<HTMLTableCellElement>('td:nth-of-type(2)');
			if (!wrapper) return map;
			try {
				const controller = new TimeController(wrapper);
				controller.reset();
				return map.set(name, controller);
			} catch (e) {
				console.log(e);
				return map;
			}
		}, new Map<string, TimeController>());

		for (const d of data) {
			const controller = rows.get(d.name);
			if (!controller) continue;
			if (d.time === '-') {
				controller.setAsVolume();
			} else {
				controller.setTime(d.time);
			}
		}
	}
}

class TimeController {
	public readonly incrementButton: HTMLDivElement;
	public readonly timeInput: HTMLInputElement;
	public readonly timeLabel: HTMLDivElement;
	public readonly workLock: HTMLDivElement;
	constructor(wrapper: HTMLTableCellElement) {
		const incrementButton = wrapper.querySelector<HTMLDivElement>(
			'div:first-of-type tbody > tr.dijitReset:nth-of-type(2) > td:last-of-type > div',
		);
		const timeInput = wrapper.querySelector<HTMLInputElement>('div:nth-of-type(2) > input');
		const timeLabel = wrapper.querySelector<HTMLDivElement>('div:nth-of-type(2) > div');
		const workLock = wrapper.querySelector<HTMLDivElement>('div:nth-of-type(3).change_input_type');

		if (!(incrementButton && timeInput && timeLabel && workLock)) {
			throw new Error('DOM elements required for operation were not aligned.');
		}

		this.incrementButton = incrementButton;
		this.timeInput = timeInput;
		this.timeLabel = timeLabel;
		this.workLock = workLock;
	}

	/** 時間の直接入力にし、0:00にする */
	reset() {
		this.setTime('0:00');
	}
	changeWorkLock(mode: 'toggle' | 'time' | 'volume' = 'toggle') {
		switch (mode) {
			case 'toggle': {
				this.workLock.click();
				return;
			}
			case 'time': {
				if (this.workLock.classList.contains('pb_btn_clock')) this.workLock.click();
				return;
			}
			case 'volume': {
				if (this.workLock.classList.contains('pb_btn_clockon')) this.workLock.click();
				return;
			}
		}
	}
	setTime(time: string) {
		this.changeWorkLock('time');
		this.timeInput.value = time;
		this.timeInput.dispatchEvent(new MouseEvent('blur')); // 不正値補正が走る
	}
	setAsVolume() {
		this.changeWorkLock('volume');
		this.incrementButton.dispatchEvent(new MouseEvent('mousedown'));
		this.incrementButton.dispatchEvent(new MouseEvent('mouseup'));
	}
}

const ZData = z.object({ name: z.string(), time: z.string() });
type Data = z.infer<typeof ZData>;
