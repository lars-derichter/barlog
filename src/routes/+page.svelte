<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { listVisits } from '$lib/db';
	import type { Visit } from '$lib/types';
	import { formatDate } from '$lib/format';
	import { resetDraft } from '$lib/draft.svelte';
	import Stars from '$lib/components/Stars.svelte';

	let visits = $state<Visit[]>([]);
	let query = $state('');
	let loaded = $state(false);

	$effect(() => {
		listVisits().then((rows) => {
			visits = rows;
			loaded = true;
		});
	});

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return visits;
		return visits.filter(
			(v) =>
				v.venue.toLowerCase().includes(q) ||
				v.orders.some((o) => o.toLowerCase().includes(q)) ||
				(v.notes ?? '').toLowerCase().includes(q)
		);
	});

	function startNewVisit() {
		resetDraft();
		goto(`${base}/visit/new/venue`);
	}
</script>

<header class="mb-6 flex items-center justify-between">
	<h1 class="text-3xl font-semibold tracking-tight">Barlog</h1>
	<button
		type="button"
		onclick={startNewVisit}
		class="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
	>
		+ Nieuwe visite
	</button>
</header>

<input
	type="search"
	bind:value={query}
	placeholder="Zoek op zaak, bestelling of notitie"
	class="mb-4 w-full rounded-lg border border-zinc-300 px-3 py-2 text-base focus:border-zinc-900 focus:ring-zinc-900"
/>

{#if !loaded}
	<p class="text-zinc-500">Bezig met laden…</p>
{:else if visits.length === 0}
	<div class="mt-12 text-center text-zinc-500">
		<p class="mb-4">Nog geen visites genoteerd.</p>
		<button
			type="button"
			onclick={startNewVisit}
			class="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
		>
			Begin met je eerste
		</button>
	</div>
{:else if filtered.length === 0}
	<p class="text-zinc-500">Geen visite gevonden voor "{query}".</p>
{:else}
	<ul class="space-y-2">
		{#each filtered as v (v.id)}
			<li>
				<a
					href={`${base}/visit/${v.id}`}
					class="block rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-400"
				>
					<div class="flex items-baseline justify-between gap-3">
						<h2 class="truncate text-lg font-medium">{v.venue}</h2>
						<time class="shrink-0 text-sm text-zinc-500">{formatDate(v.visitedAt)}</time>
					</div>
					{#if v.rating !== undefined}
						<div class="mt-1">
							<Stars value={v.rating} readonly size="sm" />
						</div>
					{/if}
					{#if v.orders.length > 0}
						<p class="mt-1 truncate text-sm text-zinc-600">{v.orders.join(', ')}</p>
					{/if}
					{#if v.notes}
						<p class="mt-1 line-clamp-2 text-sm text-zinc-500">{v.notes}</p>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
{/if}
