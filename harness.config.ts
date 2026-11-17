import { defineHarnessConfig } from '@celados/harness'

export default defineHarnessConfig({
	doctor: {
		allowLegacy: {
			prettier:
				'upstream fork: Prettier stays the formatter so merges from upstream stay conflict-free (AGENTS.md)',
		},
	},
	typecheck: {
		exclude: {
			'tsconfig.test.json':
				'Config for `vitest --typecheck`, which reads only *.test-d.ts; src, tests included, is checked by tsconfig.json.',
			'docs/tsconfig.json':
				'Astro docs site with its own package.json and npm lockfile; its dependencies are not installed in this workspace.',
		},
	},
})
