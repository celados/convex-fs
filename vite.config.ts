import { harness } from '@celados/harness'
import { defineConfig } from 'vite-plus'

export default defineConfig(
	harness({
		react: ['src/react/**', 'example/src/**'],
		convex: {
			files: ['src/component/**', 'src/client/**', 'example/convex/**'],
			components: ['src/component/**'],
			tests: ['**/*.test.ts'],
		},
		ignore: [
			// Astro docs site: its own package and lockfile.
			'docs/**',
			'dist/**',
			'**/_generated/**',
		],
		// Upstream fork: formatting stays Prettier's (`bunx prettier`, see
		// AGENTS.md) so merges from upstream stay conflict-free.
		fmt: false,
		// `vp check` stops on a formatter with no target file, so the hook and
		// `check` run lint only.
		staged: { '*': 'vp lint --fix' },
	}),
)
