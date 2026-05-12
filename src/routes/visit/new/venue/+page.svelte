<script lang="ts">
	import { goto } from '$app/navigation';
	import { draft } from '$lib/draft.svelte';
	import { venueSuggestions } from '$lib/db';

	let suggestions = $state<string[]>([]);

	$effect(() => {
		venueSuggestions(draft.venue).then((s) => (suggestions = s));
	});

	const canContinue = $derived(draft.venue.trim().length > 0);

	function next(e: SubmitEvent) {
		e.preventDefault();
		if (!canContinue) return;
		draft.venue = draft.venue.trim();
		goto('/visit/new/when');
	}
</script>

<form onsubmit={next} class="space-y-6">
	<div>
		<h2 class="text-2xl font-semibold tracking-tight">Waar was je?</h2>
		<p class="mt-1 text-sm text-zinc-500">Naam van de bar of het restaurant.</p>
	</div>

	<div>
		<input
			type="text"
			list="venue-suggestions"
			bind:value={draft.venue}
			placeholder="Bv. Café De Garre"
			class="w-full rounded-lg border border-zinc-300 px-3 py-3 text-lg focus:border-zinc-900 focus:ring-zinc-900"
		/>
		<datalist id="venue-suggestions">
			{#each suggestions as s (s)}
				<option value={s}></option>
			{/each}
		</datalist>
	</div>

	<fieldset>
		<legend class="mb-2 text-sm text-zinc-500">Soort zaak (optioneel)</legend>
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
						bind:group={draft.venueType}
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

	<div class="flex justify-end">
		<button
			type="submit"
			disabled={!canContinue}
			class="rounded-full bg-zinc-900 px-6 py-2.5 font-medium text-white enabled:hover:bg-zinc-800 disabled:opacity-40"
		>
			Verder
		</button>
	</div>
</form>
