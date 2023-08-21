import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Fragment, FunctionComponent, createRef, useCallback, useEffect, useState } from 'react';
import { ImportInput } from './import-input';
import { C2PMessage, P2CMessage } from './message';

type TProps = {
	origin: string;
};
export const ImportRoot: FunctionComponent<TProps> = ({ origin }) => {
	const [open, setOpen] = useState(true);
	const inputRef = createRef<HTMLInputElement>();

	const sendMessage = useCallback(
		(message: C2PMessage) => {
			window.parent.postMessage(message, origin);
		},
		[origin],
	);
	const receiveMessage = useCallback(
		(e: MessageEvent) => {
			const message: P2CMessage = e.data;
			if (e.origin !== origin || typeof message !== 'object' || !('type' in message)) return;
			switch (message.type) {
				case 'saved':
					break;
			}
		},
		[origin],
	);
	useEffect(() => {
		window.addEventListener('message', receiveMessage);
		return () => {
			window.removeEventListener('message', receiveMessage);
		};
	}, [receiveMessage]);

	const handleClose = useCallback(() => {
		setOpen(false);
		setTimeout(() => sendMessage({ type: 'close' }), 300);
	}, [sendMessage]);

	return (
		<Fragment>
			<CssBaseline />
			<GlobalStyles styles={{ body: { backgroundColor: 'transparent' } }} />
			{/* 閉じるときはiframeのsrcを書き換える想定なので、openのままでOK */}
			<Dialog open={open} fullWidth maxWidth="xl" transitionDuration={300}>
				<DialogContent>
					<ImportInput inputRef={inputRef} />
				</DialogContent>
				<DialogActions>
					{/* TODO: 初期実装見送り */}
					{/* <Button variant="outlined">現在の工数を抽出</Button> */}
					<Button variant="outlined" onClick={handleClose}>
						キャンセル
					</Button>
					<Button variant="contained">保存</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};
