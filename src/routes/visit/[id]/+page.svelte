<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { getVisit, updateVisit, deleteVisit } from '$lib/db';
	import type { Visit, VenueType } from '$lib/types';
	import { toLocalInputValue, fromLocalInputValue } from '$lib/format';
	import Stars from '$lib/components/Stars.svelte';

	const id = $derived(page.params.id ?? '');

	let visit = $state<Visit | undefined>(undefined);
	let loaded = $state(false);
	let saving = $state(false);
	let error = $state<string | undefined>(undefined);

	let venue = $state('');
	let venueType = $state<VenueType | undefined>(undefined);
	let visitedAtLocal = $state('');
	let orders = $state<string[]>(['']);
	let rating = $state<number | undefined>(undefined);
	let notes = $state('');

	$effect(() => {
		if (!id) return;
		getVisit(id).then((v) => {
			visit = v;
			loaded = true;
			if (v) {
				venue = v.venue;
				venueType = v.venueType;
				visitedAtLocal = toLocalInputValue(v.visitedAt);
				orders = v.orders.length > 0 ? [...v.orders] : [''];
				rating = v.rating;
				notes = v.notes ?? '';
			}
		});
	});

	const canSave = $derived(
		venue.trim().length > 0 && orders.some((o) => o.trim().length > 0)
	);

	function addOrder() {
		orders = [...orders, ''];
	}

	function removeOrder(i: number) {
		orders = orders.filter((_, idx) => idx !== i);
		if (orders.length === 0) orders = [''];
	}

	async function save(e: SubmitEvent) {
		e.preventDefault();
		if (!canSave || saving || !visit) return;
		saving = true;
		error = undefined;
		try {
			await updateVisit(visit.id, {
				venue: venue.trim(),
				venueType,
				visitedAt: fromLocalInputValue(visitedAtLocal),
				orders: orders.map((o) => o.trim()).filter(Boolean),
				rating,
				notes: notes.trim() || undefined
			});
			goto(`${base}/`);
		} catch (err) {
			error = err instanceof Error ? err.message : String(err);
			saving = false;
		}
	}

	async function remove() {
		if (!visit) return;
		if (!confirm(`Visite bij "${visit.venue}" verwijderen?`)) return;
		await deleteVisit(visit.id);
		goto('/');
	}
</script>

<header class="mb-6">
	<a href="{base}/" class="text-sm text-zinc-500 hover:text-zinc-900">← Terug naar overzicht</a>
</header>

{#if !loaded}
	<p class="text-zinc-500">Bezig met laden…</p>
{:else if !visit}
	<p class="text-zinc-500">Visite niet gevonden.</p>
{:else}
	<form onsubmit={save} class="space-y-6">
		<h1 class="text-2xl font-semibold tracking-tight">Visite bewerken</h1>

		<div>
			<label for="venue" class="mb-1 block text-sm text-zinc-500">Zaak</label>
			<input
				id="venue"
				type="text"
				bind:value={venue}
				class="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base focus:border-zinc-900 focus:ring-zinc-900"
			/>
		</div>

		<fieldset>
			<legend class="mb-2 text-sm text-zinc-500">Soort zaak</legend>
			<div class="flex flex-wrap gap-2">
				{#each [
					{ value: 'bar', label: 'Bar' },
					{ value: 'restaurant', label: 'Restaurant' },
					{ value: 'other', label: 'Andere' }
				] as opt (opt.value)}
					<label class="cursor-pointer">
						<input
							type="radio"
							name="venueType"
							value={opt.value}
							bind:group={venueType}
							class="peer sr-only"
						/>
						<span
							class="block rounded-full border border-zinc-300 px-4 py-1.5 text-sm peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:text-white"
						>
							{opt.label}
						</span>
					</label>
				{/each}
			</div>
		</fieldset>

		<div>
			<label for="when" class="mb-1 block text-sm text-zinc-500">Wanneer</label>
			<input
				id="when"
				type="datetime-local"
				bind:value={visitedAtLocal}
				class="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base focus:border-zinc-900 focus:ring-zinc-900"
			/>
		</div>

		<div>
			<span class="mb-2 block text-sm text-zinc-500">Besteld</span>
			<div class="space-y-2">
				{#each orders as _, i (i)}
					<div class="flex gap-2">
						<input
							type="text"
							bind:value={orders[i]}
							class="flex-1 rounded-lg border border-zinc-300 px-3 py-2.5 text-base focus:border-zinc-900 focus:ring-zinc-900"
						/>
						{#if orders.length > 1}
							<button
								type="button"
								onclick={() => removeOrder(i)}
								aria-label="Verwijder"
								class="rounded-lg border border-zinc-300 px-3 text-zinc-500 hover:border-red-500 hover:text-red-600"
							>
								✕
							</button>
						{/if}
					</div>
				{/each}
			</div>
			<button
				type="button"
				onclick={addOrder}
				class="mt-2 text-sm font-medium text-zinc-700 underline-offset-4 hover:text-zinc-900 hover:underline"
			>
				+ Nog iets toevoegen
			</button>
		</div>

		<div>
			<span class="mb-2 block text-sm text-zinc-500">Score</span>
			<Stars value={rating} size="md" onChange={(v) => (rating = v)} />
		</div>

		<div>
			<label for="notes" class="mb-1 block text-sm text-zinc-500">Notities</label>
			<textarea
				id="notes"
				bind:value={notes}
				rows="6"
				class="w-full rounded-lg border border-zinc-300 px-3 py-3 text-base focus:border-zinc-900 focus:ring-zinc-900"
			></textarea>
		</div>

		{#if error}
			<p class="rounded-lg bg-red-50 p-3 text-sm text-red-700">Opslaan mislukt: {error}</p>
		{/if}

		<div class="flex justify-between">
			<button
				type="button"
				onclick={remove}
				class="rounded-full border border-red-300 px-6 py-2.5 font-medium text-red-700 hover:border-red-600 hover:bg-red-50"
			>
				Verwijderen
			</button>
			<button
				type="submit"
				disabled={!canSave || saving}
				class="rounded-full bg-zinc-900 px-6 py-2.5 font-medium text-white enabled:hover:bg-zinc-800 disabled:opacity-40"
			>
				{saving ? 'Bezig…' : 'Opslaan'}
			</button>
		</div>
	</form>
{/if}
