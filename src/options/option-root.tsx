import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { Fragment } from 'react';
import { OptionsComponent } from '~/addons/addon-base';
import { OptionContent } from './option-content';
import { OptionHeader } from './option-header';

type TProps = {
	options: string[];
	components: Map<string, OptionsComponent>;
};
export const OptionRoot: React.FunctionComponent<TProps> = (props) => {
	return (
		<Fragment>
			<CssBaseline />
			<Stack height="100vh" width="100vw">
				<OptionHeader />
				<OptionContent {...props} />
			</Stack>
		</Fragment>
	);
};
