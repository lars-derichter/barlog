<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { draft } from '$lib/draft.svelte';

	function next(e: SubmitEvent) {
		e.preventDefault();
		draft.notes = (draft.notes ?? '').trim();
		goto(`${base}/visit/new/review`);
	}
</script>

<form onsubmit={next} class="space-y-6">
	<div>
		<h2 class="text-2xl font-semibold tracking-tight">Notities?</h2>
		<p class="mt-1 text-sm text-zinc-500">Optioneel. Sfeer, gezelschap, dingen om te onthouden.</p>
	</div>

	<textarea
		bind:value={draft.notes}
		rows="6"
		placeholder="Bv. terras achteraan, vriendelijke bediening, kom zeker terug voor de stoofvlees."
		class="w-full rounded-lg border border-zinc-300 px-3 py-3 text-base focus:border-zinc-900 focus:ring-zinc-900"
	></textarea>

	<div class="flex justify-between">
		<a
			href="{base}/visit/new/rating"
			class="rounded-full border border-zinc-300 px-6 py-2.5 font-medium text-zinc-700 hover:border-zinc-900"
		>
			Terug
		</a>
		<button
			type="submit"
			class="rounded-full bg-zinc-900 px-6 py-2.5 font-medium text-white hover:bg-zinc-800"
		>
			Verder
		</button>
	</div>
</form>
