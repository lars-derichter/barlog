<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { draft, resetDraft } from '$lib/draft.svelte';
	import { createVisit } from '$lib/db';
	import { formatDateTime } from '$lib/format';
	import Stars from '$lib/components/Stars.svelte';

	let saving = $state(false);
	let error = $state<string | undefined>(undefined);

	const canSave = $derived(
		draft.venue.trim().length > 0 && draft.orders.some((o) => o.trim().length > 0)
	);

	const venueTypeLabel: Record<string, string> = {
		bar: 'Bar',
		restaurant: 'Restaurant',
		other: 'Andere'
	};

	async function save() {
		if (!canSave || saving) return;
		saving = true;
		error = undefined;
		try {
			await createVisit({
				venue: draft.venue.trim(),
				venueType: draft.venueType,
				visitedAt: draft.visitedAt,
				orders: draft.orders.map((o) => o.trim()).filter(Boolean),
				rating: draft.rating,
				notes: draft.notes?.trim() || undefined
			});
			resetDraft();
			goto(`${base}/`);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
			saving = false;
		}
	}
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-semibold tracking-tight">Klopt dit?</h2>
		<p class="mt-1 text-sm text-zinc-500">Controleer en sla op.</p>
	</div>

	<dl class="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
		<div>
			<dt class="text-xs uppercase tracking-wide text-zinc-500">Zaak</dt>
			<dd class="text-lg font-medium">
				{draft.venue || '—'}
				{#if draft.venueType}
					<span class="ml-2 text-sm font-normal text-zinc-500"
						>({venueTypeLabel[draft.venueType]})</span
					>
				{/if}
			</dd>
		</div>
		<div>
			<dt class="text-xs uppercase tracking-wide text-zinc-500">Wanneer</dt>
			<dd>{formatDateTime(draft.visitedAt)}</dd>
		</div>
		<div>
			<dt class="text-xs uppercase tracking-wide text-zinc-500">Besteld</dt>
			<dd>
				{#if draft.orders.filter((o) => o.trim()).length > 0}
					<ul class="list-disc pl-5">
						{#each draft.orders.filter((o) => o.trim()) as o, i (i)}
							<li>{o}</li>
						{/each}
					</ul>
				{:else}
					<span class="text-zinc-400">—</span>
				{/if}
			</dd>
		</div>
		<div>
			<dt class="text-xs uppercase tracking-wide text-zinc-500">Score</dt>
			<dd>
				{#if draft.rating !== undefined}
					<Stars value={draft.rating} readonly size="sm" />
				{:else}
					<span class="text-zinc-400">—</span>
				{/if}
			</dd>
		</div>
		<div>
			<dt class="text-xs uppercase tracking-wide text-zinc-500">Notities</dt>
			<dd class="whitespace-pre-wrap">
				{#if draft.notes}{draft.notes}{:else}<span class="text-zinc-400">—</span>{/if}
			</dd>
		</div>
	</dl>

	{#if error}
		<p class="rounded-lg bg-red-50 p-3 text-sm text-red-700">Opslaan mislukt: {error}</p>
	{/if}

	<div class="flex justify-between">
		<a
			href="{base}/visit/new/notes"
			class="rounded-full border border-zinc-300 px-6 py-2.5 font-medium text-zinc-700 hover:border-zinc-900"
		>
			Terug
		</a>
		<button
			type="button"
			onclick={save}
			disabled={!canSave || saving}
			class="rounded-full bg-zinc-900 px-6 py-2.5 font-medium text-white enabled:hover:bg-zinc-800 disabled:opacity-40"
		>
			{saving ? 'Bezig…' : 'Opslaan'}
		</button>
	</div>
</div>
