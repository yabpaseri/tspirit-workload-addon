最初、@mui/material/Dialog を使用するつもりだった。
---
const container = UIs.create('div').appendTo(document.body);
const root = createRoot(container);
root.render(
	<Dialog>
		<DialogContent>
			<TextField/>
		</DialogContent>
	</Dialog>
);
---
「インポート」の押下時に、Dialog.open = true; で開く。
これを実装してみたところ、
> 「Uncaught RangeError: Maximum call stack size exceeded.
が大量発生した。Reactの中でエラーの大量検知をされてしまっている。
dojo.js というファイルがStackTraceに見られたので、TeamSpiritが使用するライブラリ
から吐かれたエラーだとは思うが、詳細は不明なまま。onFocus時のエラーのように見受けられた。
また、TextFieldをクリックして入力を始めようとすると、
工数実績のダイアログにフォーカスを奪われて文字が一切入力できない（工数入力側の入力欄に文字が入っていく）
mousedownやclickなど、React側で preventDefault(); や stopPropagation(); をしてみたが改善されず。
2つともフォーカスが絡んでいるので、
先のエラーの件も予期しない場所にフォーカスを取られてエラーしているのだろうと思う。


次に、Dialogの廉価版的なポジションのBackdropを使用してみた。
エラーは発生しなくなったのだが、フォーカスが取られてしまう問題だけは直らなかった。
---
root.render(
	<Backdrop>
		<Paper>
			<TextField/>
		</Paper>
	</Backdrop>
);
---


TeamSpiritの影響が及ばない範囲にしないと無理そうだということでiframeを追加することでの実装を考えた。
---
const iframe = UIs.create('iframe')
	.appendTo(document.body)
	.src(chrome.runtime.getURL('拡張機能が持つHTML'));
---
エラーはもちろん、フォーカスが取られてしまう問題も解決ができたので一旦これで進める。
iframe内外での情報の伝達は、postMessageとaddEventListener('message')で行う。
