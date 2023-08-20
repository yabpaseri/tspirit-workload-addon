import { CssBaseline, Link, Stack } from '@mui/material';
import React, { Component, Fragment, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { ALL_ADDONS } from './addons';
import { AddonInfos } from './addons/addon-base';
import { UIs } from './util';

// MUIのTabs(orientation="vertical")を使おうかな...

type TProps = {
	addons: Map<string, AddonInfos>;
};
type TState = {
	now?: string;
};

(class Options extends Component<TProps, TState> {
	static main() {
		const container = UIs.create('div').appendTo(document.body).done();
		const root = createRoot(container);
		// 設定ページを持つアドオンだけ抽出
		const addons = ALL_ADDONS.reduce((map, addon) => {
			const infos = addon.infos();
			if (infos.options != null && infos.active) map.set(infos.name, infos);
			return map;
		}, new Map<string, AddonInfos>());

		root.render(<Options addons={addons} />);
	}

	constructor(props: TProps) {
		super(props);
		this.state = {};
	}

	handleSelect(key: string) {
		this.setState({ now: key });
	}

	render(): ReactNode {
		const now = this.props.addons.get(this.state.now ?? '')?.options;
		return (
			<Fragment>
				<CssBaseline />
				<Stack direction="row">
					{[...this.props.addons.keys()].map((v) => (
						<Link key={v} onClick={this.handleSelect.bind(this, v)}>
							{v}
						</Link>
					))}
				</Stack>
				{!now ? void 0 : React.createElement(now)}
			</Fragment>
		);
	}
}).main();
