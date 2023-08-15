/** 行情報 */
export type RowInfo = {
	/** <tr/>要素 */
	ele: HTMLTableRowElement;
	/** ジョブコード */
	jobCode: string;
	/** ジョブ名 */
	jobName: string;
};

export namespace RowInfo {
	export const convert = (row: HTMLTableRowElement): RowInfo => {
		const jobCode = row.querySelector(':scope > td:nth-of-type(2) > div')?.textContent;
		if (jobCode == null || jobCode.length === 0) throw new Error('Not found jobCode');
		const jobName = row.querySelector(':scope > td:nth-of-type(3) > div')?.textContent;
		if (jobName == null || jobName?.length === 0) throw new Error('Not found jobName');
		return { ele: row, jobCode, jobName };
	};
}
