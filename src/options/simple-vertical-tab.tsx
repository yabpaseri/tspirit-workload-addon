import { styled } from '@mui/material';
import Tab, { TabProps } from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { memo, useCallback } from 'react';

type TProps = {
	values: string[];
	active: string;
	onChange: (next: string) => void;
};

/**
 * 重複のないvaluesで縦方向のタブを作成する
 */
export const SimpleVerticalTab = memo<TProps>(({ values, active, onChange }) => {
	const handleChange = useCallback((_: unknown, value: string) => onChange(value), [onChange]);
	return (
		<S.Tabs orientation="vertical" variant="scrollable" value={active} onChange={handleChange}>
			{values.map((v) => (
				<MemoizedTab key={v} value={v} label={v} />
			))}
		</S.Tabs>
	);
});
SimpleVerticalTab.displayName = 'SimpleVerticalTab';

const MemoizedTab = memo<TabProps>((props) => <Tab {...props} />);
MemoizedTab.displayName = 'MemoizedTab';

const S = {
	Tabs: styled(Tabs)(({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		maxWidth: '130px',
	})),
};
