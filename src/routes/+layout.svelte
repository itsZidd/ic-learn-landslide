<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	onMount(() => {
		// If this tab's first page load lands on a module route directly (a
		// refresh of e.g. /reflection, or a bookmarked/shared link) rather than
		// starting from "/", the splash screen never got a chance to mark
		// itself as shown. Without this, the next "Menu Utama" click back to
		// "/" would look like a first-ever visit and replay the splash.
		if (location.pathname !== '/') {
			try { sessionStorage.setItem('icare_splash_shown', 'true'); } catch {}
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
