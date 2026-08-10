<script lang="ts">
	interface Props {
		onclick?: () => void;
		onmouseenter?: () => void;
		className?: string;
	}
	let { onclick, onmouseenter, className = "w-12 h-12 sm:w-14 sm:h-14" }: Props = $props();
</script>

<button
	{onclick}
	{onmouseenter}
	aria-label="Informasi"
	class={`group relative ${className} rounded-[22px] bg-gradient-to-b from-[#88c226] via-[#74b319] to-[#5a980e] border-3 border-white shadow-xl flex items-center justify-center text-white transform active:scale-95 transition-all hover:scale-105 overflow-hidden`}
	style="box-shadow: 0 6px 0 0 #3b6807, 0 10px 18px rgba(0, 0, 0, 0.25);"
>
	<!-- Top Specular Glossy Reflection Oval -->
	<span class="absolute top-1.5 left-2 right-2 h-4 bg-white/40 rounded-full blur-[0.5px]"></span>
	<!-- Bottom Highlight Reflection -->
	<span class="absolute bottom-1 right-2 w-4 h-2 bg-white/30 rounded-full blur-[0.5px]"></span>

	<!-- SVG Circle Ring + Stylized Italic "i" -->
	<svg class="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-md group-hover:rotate-6 transition-transform" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
		<!-- White Circular Ring -->
		<circle cx="50" cy="50" r="36" stroke="#ffffff" stroke-width="10" />
		
		<!-- Italic "i" Dot -->
		<circle cx="53" cy="33" r="5.5" fill="#ffffff" />
		
		<!-- Italic "i" Curved Stem -->
		<path
			d="M 43,46 C 47,44 54,42 54,50 C 54,58 46,62 48,68 C 49,70 53,70 57,68"
			stroke="#ffffff"
			stroke-width="9"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</button>
