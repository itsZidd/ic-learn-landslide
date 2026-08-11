<script lang="ts">
	import girlImg from '$lib/assets/GirlCharacter.webp';

	interface Props {
		className?: string;
	}
	let { className = "h-80 w-auto" }: Props = $props();
</script>

<div class="animate-girl-sway transform-gpu">
	<img src={girlImg} alt="Girl Character" decoding="async" class={`${className} object-contain`} />
</div>

<style>
	@keyframes girlSway {
		0%, 100% {
			transform: translate3d(0, 0px, 0) rotate(0deg) scale(1);
		}
		50% {
			transform: translate3d(0, -14px, 0) rotate(3deg) scale(1.02);
		}
	}

	.animate-girl-sway {
		will-change: transform;
		animation: girlSway 3.6s ease-in-out infinite;
		backface-visibility: hidden;
	}
</style>
