<script lang="ts">
	import bgImg from '$lib/assets/LandscapeBackground.webp';
	import windSvg from '$lib/assets/Wind.svg';
</script>

<div class="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
	<!-- Background Scenery Base with High-Priority GPU Rendering -->
	<img
		src={bgImg}
		alt="Background Scenery"
		decoding="async"
		fetchpriority="high"
		class="w-full h-full object-cover object-center transform-gpu"
	/>

	<!-- Hardware Accelerated Animated Wind & Leaves SVG Overlay -->
	<div class="animate-wind-sweep absolute inset-0 w-full h-full transform-gpu">
		<img
			src={windSvg}
			alt="Wind and Leaf Animation"
			decoding="async"
			class="w-full h-full object-cover object-center opacity-90"
		/>
	</div>
</div>

<style>
	/* Sweeps from off-screen left (-120%) to off-screen right (+120%), with a pause/delay at the end before looping */
	@keyframes windSweep {
		0% {
			transform: translate3d(-120%, -30px, 0);
			opacity: 0;
		}
		10% {
			opacity: 0.9;
		}
		55% {
			opacity: 0.9;
		}
		70% {
			transform: translate3d(120%, 30px, 0);
			opacity: 0;
		}
		100% {
			transform: translate3d(120%, 30px, 0);
			opacity: 0;
		}
	}

	.animate-wind-sweep {
		will-change: transform, opacity;
		animation: windSweep 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		backface-visibility: hidden;
	}
</style>
