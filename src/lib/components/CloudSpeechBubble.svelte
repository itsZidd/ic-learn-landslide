<script lang="ts">
	interface Props {
		userName?: string;
		onmouseenter?: () => void;
	}
	let { userName = "Siswa", onmouseenter }: Props = $props();
</script>

<div
	class="relative group border-none bg-transparent p-0 outline-none text-left select-none"
	role="presentation"
	{onmouseenter}
>
	<!-- SVG Cloud Thought Bubble Container with Hardware Accelerated Zoom Pulse -->
	<div class="animate-cloud-pulse relative w-60 sm:w-68 md:w-76 filter drop-shadow-xl transform-gpu hover:scale-105 transition-transform duration-300">
		<svg viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
			<!-- Main Cloud Background Fill (White) -->
			<path
				d="M 80 150 C 30 150 10 110 30 70 C 30 30 80 10 130 30 C 170 0 230 0 270 30 C 320 10 370 30 370 70 C 390 110 370 150 320 160 C 330 200 280 230 230 220 C 180 240 120 230 90 190 C 50 190 30 170 80 150 Z"
				fill="#ffffff"
			/>
			
			<!-- Thick Outer Dark Stroke -->
			<path
				d="M 80 150 C 30 150 10 110 30 70 C 30 30 80 10 130 30 C 170 0 230 0 270 30 C 320 10 370 30 370 70 C 390 110 370 150 320 160 C 330 200 280 230 230 220 C 180 240 120 230 90 190 C 50 190 30 170 80 150 Z"
				stroke="#111827"
				stroke-width="8"
				stroke-linejoin="round"
				stroke-linecap="round"
			/>

			<!-- Inner Cyan Dashed Outline -->
			<path
				d="M 82 145 C 37 145 20 110 37 73 C 37 37 82 18 128 36 C 165 9 222 9 265 36 C 310 18 355 37 355 73 C 373 110 355 145 312 153 C 320 190 275 218 230 209 C 185 227 130 218 102 182 C 65 182 47 164 82 145 Z"
				stroke="#00e5ff"
				stroke-width="3.5"
				stroke-dasharray="9 6"
				stroke-linejoin="round"
				stroke-linecap="round"
			/>

			<!-- Thought Bubble Drops (Small Ovals Below Cloud) -->
			<!-- Drop 1 (Medium) -->
			<ellipse cx="100" cy="225" rx="18" ry="11" fill="#ffffff" stroke="#111827" stroke-width="5" transform="rotate(-15 100 225)" />
			<ellipse cx="100" cy="225" rx="13" ry="7" fill="none" stroke="#00e5ff" stroke-width="2.5" stroke-dasharray="4 3" transform="rotate(-15 100 225)" />

			<!-- Drop 2 (Smallest) -->
			<ellipse cx="65" cy="242" rx="12" ry="7" fill="#ffffff" stroke="#111827" stroke-width="4.5" transform="rotate(-25 65 242)" />
			<ellipse cx="65" cy="242" rx="8" ry="4" fill="none" stroke="#00e5ff" stroke-width="2" stroke-dasharray="3 2" transform="rotate(-25 65 242)" />
		</svg>

		<!-- Content Text Centered Inside Cloud -->
		<div class="absolute inset-0 pb-6 px-6 flex flex-col items-center justify-center text-center font-bubble">
			<p class="text-xs sm:text-sm md:text-base font-extrabold leading-tight">
				<span class="text-[#ff9800]">Hallo,</span>
				<span class="text-[#2e7d32]"> Selamat Datang</span>
			</p>
			<p class="text-sm sm:text-base md:text-lg font-black text-[#c62828]">
				{userName}
			</p>
		</div>
	</div>
</div>

<style>
	@keyframes cloudZoomPulse {
		0%, 100% {
			transform: translate3d(0, 0, 0) scale(1);
		}
		50% {
			transform: translate3d(0, 0, 0) scale(1.05);
		}
	}

	.animate-cloud-pulse {
		will-change: transform;
		animation: cloudZoomPulse 4s ease-in-out infinite;
		backface-visibility: hidden;
	}
</style>
