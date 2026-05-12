<script lang="ts">
	import { goto } from '$app/navigation';
	import { draft } from '$lib/draft.svelte';

	if (draft.orders.length === 0) draft.orders = [''];

	const canContinue = $derived(draft.orders.some((o) => o.trim().length > 0));

	function add() {
		draft.orders = [...draft.orders, ''];
	}

	function remove(i: number) {
		draft.orders = draft.orders.filter((_, idx) => idx !== i);
		if (draft.orders.length === 0) draft.orders = [''];
	}

	function next(e: SubmitEvent) {
		e.preventDefault();
		draft.orders = draft.orders.map((o) => o.trim()).filter((o) => o.length > 0);
		if (draft.orders.length === 0) return;
		goto('/visit/new/rating');
	}
</script>

<form onsubmit={next} class="space-y-6">
	<div>
		<h2 class="text-2xl font-semibold tracking-tight">Wat heb je besteld?</h2>
		<p class="mt-1 text-sm text-zinc-500">Eén drankje of gerecht per regel.</p>
	</div>

	<div class="space-y-2">
		{#each draft.orders as _, i (i)}
			<div class="flex gap-2">
				<input
					type="text"
					bind:value={draft.orders[i]}
					placeholder="Bv. Westmalle tripel"
					class="flex-1 rounded-lg border border-zinc-300 px-3 py-2.5 text-base focus:border-zinc-900 focus:ring-zinc-900"
				/>
				{#if draft.orders.length > 1}
					<button
						type="button"
						onclick={() => remove(i)}
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
		onclick={add}
		class="text-sm font-medium text-zinc-700 underline-offset-4 hover:text-zinc-900 hover:underline"
	>
		+ Nog iets toevoegen
	</button>

	<div class="flex justify-between">
		<a
			href="/visit/new/when"
			class="rounded-full border border-zinc-300 px-6 py-2.5 font-medium text-zinc-700 hover:border-zinc-900"
		>
			Terug
		</a>
		<button
			type="submit"
			disabled={!canContinue}
			class="rounded-full bg-zinc-900 px-6 py-2.5 font-medium text-white enabled:hover:bg-zinc-800 disabled:opacity-40"
		>
			Verder
		</button>
	</div>
</form>
