import { crx, defineManifest } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { author, description, version as version_name } from './package.json';
import archive from './plugins/vite-plugin-archive';
import tsconfigPaths from 'vite-tsconfig-paths';

const version = version_name.replace(/[^\d.-]+/g, '').replace('-', '.');
const manifest = defineManifest(({ mode }) => ({
	manifest_version: 3,
	name: 'TSpirit workload addon',
	author,
	description,
	version,
	version_name: `${version_name}${mode !== 'production' ? ` (${mode})` : ''}`,
	icons: {
		'16': 'icons/icon16.png',
		'32': 'icons/icon32.png',
		'48': 'icons/icon48.png',
		'128': 'icons/icon128.png',
	},
	options_page: 'pages/options.html',
	content_scripts: [
		{
			// 勤務表と工数実績のページに対して、拡張機能によるDOM操作を実行する
			// all_frames:true によって、iframeの中でも拡張機能が実行されるようにしている（iframeの内外でそれぞれ拡張機能が実行される形）
			// その上で、matchesで特定のVisualforceページだけを指定することで、目的のタブ(VF)に対して拡張機能を提供できる。
			// iframeタグが挿入される毎に js が走りなおすので、Salesforce直下(?)のコンテンツのように
			// MutationObserverでの要素変化によるページ遷移検知（SPA対策）をしなくてよい。
			all_frames: true,
			matches: [
				'https://*.vf.force.com/apex/AtkEmpJobView?*', // 工数実績タブ
				'https://*.vf.force.com/apex/AtkWorkTimeView?*', // 勤務表タブ
				// 'https://*.vf.force.com/*', // 検証用(全てのVisualforceページ)
			],
			js: ['./src/content.ts'],
		},
	],
	permissions: ['storage'],
}));

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths(), crx({ manifest }), archive()],
	build: {
		minify: false, // chromeの審査に通りやすく
		rollupOptions: {
			// assetsフォルダ配下の生成物のファイル名からハッシュ値を削除する
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`,
			},
		},
	},
});
