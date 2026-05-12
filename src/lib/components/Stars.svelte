<script lang="ts">
	type Props = {
		value: number | undefined;
		onChange?: (value: number | undefined) => void;
		readonly?: boolean;
		size?: 'sm' | 'md' | 'lg';
	};

	let { value, onChange, readonly = false, size = 'md' }: Props = $props();

	const sizeClass = $derived(
		size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-4xl' : 'text-2xl'
	);

	function set(n: number) {
		if (readonly) return;
		onChange?.(value === n ? undefined : n);
	}
</script>

<div class="flex items-center gap-1 {sizeClass}" role={readonly ? undefined : 'radiogroup'}>
	{#each [1, 2, 3, 4, 5] as n (n)}
		{@const filled = value !== undefined && n <= value}
		{#if readonly}
			<span class={filled ? 'text-amber-500' : 'text-zinc-300'}>★</span>
		{:else}
			<button
				type="button"
				role="radio"
				aria-checked={value === n}
				aria-label={`${n} ster${n === 1 ? '' : 'ren'}`}
				class="leading-none transition-colors {filled
					? 'text-amber-500'
					: 'text-zinc-300 hover:text-amber-300'}"
				onclick={() => set(n)}
			>
				★
			</button>
		{/if}
	{/each}
</div>
