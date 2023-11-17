import TextField from '@mui/material/TextField';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Preference } from '~/preference';
import { SortRules } from '../types';

export const Index = () => {
	const [rule, setRule] = useState('');
	const [error, setError] = useState<string>();

	useEffect(() => {
		Preference.getAssignedJobSortRule().then((rule) => setRule(JSON.stringify(rule, void 0, 2)));
	}, []);

	const handleChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
		setError(void 0);
		const val = event.target.value;
		setRule(val);
		try {
			Preference.setAssignedJobSortRule(SortRules.parse(JSON.parse(val)));
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError(JSON.stringify(error));
			}
		}
	}, []);

	return <TextField fullWidth value={rule} multiline minRows={15} maxRows={15} onChange={handleChange} error={!!error} helperText={error} />;
};
