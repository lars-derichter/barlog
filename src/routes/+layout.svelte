<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Barlog</title>
</svelte:head>

<div class="mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-8 pt-6">
	{@render children()}
</div>
