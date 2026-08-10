<script lang="ts">
	import titleImg from '$lib/assets/Title.png';

	interface Props {
		className?: string;
	}
	let { className = "h-28 sm:h-36 md:h-44 lg:h-52 w-auto" }: Props = $props();
</script>

<div class="flex items-center justify-center w-full animate-title-float transform-gpu">
	<img
		src={titleImg}
		alt="I-CARE LANDSLIDE"
		decoding="async"
		fetchpriority="high"
		class={`${className} object-contain mx-auto filter drop-shadow-2xl`}
	/>
</div>

<style>
	@keyframes titleFloat {
		0%, 100% {
			transform: translate3d(0, 0px, 0) scale(1);
		}
		50% {
			transform: translate3d(0, -10px, 0) scale(1.02);
		}
	}

	.animate-title-float {
		will-change: transform;
		animation: titleFloat 3.2s ease-in-out infinite;
		backface-visibility: hidden;
	}
</style>
