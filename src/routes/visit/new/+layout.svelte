<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resetDraft } from '$lib/draft.svelte';

	let { children } = $props();

	const steps = ['venue', 'when', 'orders', 'rating', 'notes', 'review'] as const;
	const currentIndex = $derived.by(() => {
		const segment = page.url.pathname.split('/').filter(Boolean).at(-1) ?? '';
		const i = steps.indexOf(segment as (typeof steps)[number]);
		return i === -1 ? 0 : i;
	});

	function cancel() {
		if (confirm('Deze visite weggooien?')) {
			resetDraft();
			goto('/');
		}
	}
</script>

<header class="mb-6 flex items-center justify-between">
	<a href="/" class="text-sm text-zinc-500 hover:text-zinc-900">← Terug naar overzicht</a>
	<button type="button" onclick={cancel} class="text-sm text-zinc-500 hover:text-zinc-900">
		Annuleer
	</button>
</header>

<div class="mb-8">
	<div class="mb-2 flex justify-between text-xs uppercase tracking-wide text-zinc-500">
		<span>Stap {currentIndex + 1} van {steps.length}</span>
	</div>
	<div class="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
		<div
			class="h-full bg-zinc-900 transition-all"
			style:width="{((currentIndex + 1) / steps.length) * 100}%"
		></div>
	</div>
</div>

{@render children()}
