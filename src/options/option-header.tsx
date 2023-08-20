import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

export const OptionHeader = memo(() => {
	return (
		<AppBar position="static">
			<Toolbar variant="dense">
				<Typography variant="h6" color="inherit" component="div">
					設定
				</Typography>
			</Toolbar>
		</AppBar>
	);
});
OptionHeader.displayName = 'OptionHeader';
