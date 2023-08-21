import { RefObject, memo } from 'react';

import TextField from '@mui/material/TextField';

type TProps = {
	inputRef: RefObject<HTMLInputElement>;
};

export const ImportInput = memo<TProps>(({ inputRef }) => {
	return <TextField multiline fullWidth minRows={15} maxRows={15} placeholder="jsonを入力..." inputRef={inputRef} />;
});
ImportInput.displayName = 'ImportInput';
