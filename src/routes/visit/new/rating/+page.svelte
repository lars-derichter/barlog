<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { draft } from '$lib/draft.svelte';
	import Stars from '$lib/components/Stars.svelte';

	function next() {
		goto(`${base}/visit/new/notes`);
	}

	function skip() {
		draft.rating = undefined;
		next();
	}
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-semibold tracking-tight">Hoe vond je het?</h2>
		<p class="mt-1 text-sm text-zinc-500">Optioneel. Tik een ster om te kiezen of weer uit te zetten.</p>
	</div>

	<div class="py-6">
		<Stars value={draft.rating} size="lg" onChange={(v) => (draft.rating = v)} />
		{#if draft.rating !== undefined}
			<p class="mt-3 text-sm text-zinc-500">{draft.rating} van 5</p>
		{:else}
			<p class="mt-3 text-sm text-zinc-400">Nog geen score gekozen</p>
		{/if}
	</div>

	<div class="flex items-center justify-between">
		<a
			href="{base}/visit/new/orders"
			class="rounded-full border border-zinc-300 px-6 py-2.5 font-medium text-zinc-700 hover:border-zinc-900"
		>
			Terug
		</a>
		<div class="flex gap-2">
			<button
				type="button"
				onclick={skip}
				class="rounded-full px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-900"
			>
				Overslaan
			</button>
			<button
				type="button"
				onclick={next}
				class="rounded-full bg-zinc-900 px-6 py-2.5 font-medium text-white hover:bg-zinc-800"
			>
				Verder
			</button>
		</div>
	</div>
</div>
