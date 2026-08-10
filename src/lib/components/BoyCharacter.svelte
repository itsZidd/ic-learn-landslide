<script lang="ts">
	import boyImg from '$lib/assets/BoyCharacter.png';

	interface Props {
		className?: string;
	}
	let { className = "h-80 w-auto" }: Props = $props();
</script>

<div class="animate-boy-sway transform-gpu">
	<img src={boyImg} alt="Boy Character" decoding="async" class={`${className} object-contain`} />
</div>

<style>
	@keyframes boySway {
		0%, 100% {
			transform: translate3d(0, 0px, 0) rotate(0deg) scale(1);
		}
		50% {
			transform: translate3d(0, -14px, 0) rotate(-3deg) scale(1.02);
		}
	}

	.animate-boy-sway {
		will-change: transform;
		animation: boySway 3.8s ease-in-out infinite 0.4s;
		backface-visibility: hidden;
	}
</style>
