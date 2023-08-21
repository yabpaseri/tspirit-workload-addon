import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { UIs } from '~/util';
import { ImportRoot } from './import-root';

(function main() {
	const params = new URLSearchParams(window.location.search);
	const origin = params.get('origin');
	if (origin == null) {
		throw new Error('URL parameter "origin" not found.');
	}
	const container = UIs.create('div').appendTo(document.body).done();
	const root = createRoot(container);
	root.render(createElement(ImportRoot, { origin }));
})();
