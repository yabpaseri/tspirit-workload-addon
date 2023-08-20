import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ALL_ADDONS } from '~/addons';
import { OptionsComponent } from '~/addons/addon-base';
import { UIs, utils } from '~/util';
import { OptionRoot } from './option-root';

(function main() {
	const components = new Map<string, OptionsComponent>();
	const options = ALL_ADDONS.filter((addon) => addon.infos.options != null)
		.sort((a, b) => utils.compare(a.infos.options!.priority, b.infos.options!.priority) * -1)
		.map((addon) => {
			components.set(addon.infos.name, addon.infos.options!.component);
			return addon.infos.name;
		});

	const container = UIs.create('div').appendTo(document.body).done();
	const root = createRoot(container);
	root.render(createElement(OptionRoot, { options, components }));
})();
