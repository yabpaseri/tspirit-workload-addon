import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ALL_ADDONS } from '~/addons';
import { OptionsComponent } from '~/addons/addon-base';
import { UIs, utils } from '~/util';
import { OptionRoot } from './option-root';

(async function main() {
	const components = new Map<string, OptionsComponent>();
	const presort_options: { name: string; priority: number }[] = [];
	for (const addon of ALL_ADDONS) {
		const { name, options } = addon.infos;
		if (options == null) continue;
		components.set(name, await options.component());
		presort_options.push({ name, priority: options.priority });
	}
	const options = presort_options.sort((a, b) => utils.compare(a.priority, b.priority) * -1).map((v) => v.name);
	const container = UIs.create('div').appendTo(document.body).done();
	const root = createRoot(container);
	root.render(createElement(OptionRoot, { options, components }));
})();
