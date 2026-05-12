<script lang="ts">
	import { goto } from '$app/navigation';
	import { draft } from '$lib/draft.svelte';
	import { toLocalInputValue, fromLocalInputValue } from '$lib/format';

	let local = $state(toLocalInputValue(draft.visitedAt));

	function next(e: SubmitEvent) {
		e.preventDefault();
		draft.visitedAt = fromLocalInputValue(local);
		goto('/visit/new/orders');
	}
</script>

<form onsubmit={next} class="space-y-6">
	<div>
		<h2 class="text-2xl font-semibold tracking-tight">Wanneer was dat?</h2>
		<p class="mt-1 text-sm text-zinc-500">Standaard nu — pas aan indien nodig.</p>
	</div>

	<input
		type="datetime-local"
		bind:value={local}
		class="w-full rounded-lg border border-zinc-300 px-3 py-3 text-lg focus:border-zinc-900 focus:ring-zinc-900"
	/>

	<div class="flex justify-between">
		<a
			href="/visit/new/venue"
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
