import { styled } from '@mui/material';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { memo, useMemo, useState } from 'react';
import { OptionsComponent } from '~/addons/addon-base';
import { SimpleVerticalTab } from './simple-vertical-tab';

type TProps = {
	options: string[];
	components: Map<string, OptionsComponent>;
};
export const OptionContent = memo<TProps>(({ options, components }) => {
	const [active, setActive] = useState(options[0]);
	const TabContent = useMemo(() => components.get(active), [active, components]);

	return (
		<S.Wrapper square elevation={0}>
			<SimpleVerticalTab values={options} active={active} onChange={setActive} />
			<S.TabContentWrapper>{TabContent != null && <TabContent />}</S.TabContentWrapper>
		</S.Wrapper>
	);
});
OptionContent.displayName = 'OptionContent';

const S = {
	Wrapper: styled(Paper)({
		display: 'flex',
		flexGrow: 1,
		overflow: 'hidden',
	}),
	TabContentWrapper: styled(Box)({
		padding: '10px',
		flex: '1 1 0',
		overflow: 'auto',
	}),
};
