<script lang="ts">
	import { onMount } from 'svelte';
	import UMLogo from '$lib/components/UMLogo.svelte';
	import girlCycling from '$lib/assets/GirlCycling.svg';
	import cloudPng from '$lib/assets/Cloud.png';
	import titleLogin from '$lib/assets/TitleLogin.png';

	interface Props {
		onFinish: () => void;
	}

	let { onFinish }: Props = $props();

	let progressPercent = $state(0);
	let loadingStatus = $state('Menyiapkan media pembelajaran...');
	let isFadingOut = $state(false);

	const statusMessages = [
		'Menyiapkan peta tektonik & bentang alam Jabung...',
		'Memuat materi mitigasi bencana longsor...',
		'Menyiapkan media pembelajaran interaktif...',
		'Hampir selesai, menyusun pengalaman belajar...',
		'Siap! Selamat datang di I-CARE LANDSLIDE!'
	];

	onMount(() => {
		const startTime = Date.now();
		const duration = 5000; // 5s loading duration

		const timer = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const ratio = Math.min(elapsed / duration, 1);
			progressPercent = Math.floor(ratio * 100);

			// Update status messages dynamically based on progress
			const statusIdx = Math.min(
				Math.floor(ratio * statusMessages.length),
				statusMessages.length - 1
			);
			loadingStatus = statusMessages[statusIdx];

			if (ratio >= 1) {
				clearInterval(timer);
				isFadingOut = true;
				setTimeout(() => {
					onFinish();
				}, 600); // 600ms smooth ease-out delay
			}
		}, 30);

		return () => clearInterval(timer);
	});
</script>

<!-- OFF-WHITE DEDICATED STANDALONE SPLASH CONTAINER -->
<div class={`fixed inset-0 z-50 w-full h-full min-h-screen lg:h-screen lg:h-dvh flex flex-col justify-between p-4 sm:p-6 select-none font-bubble overflow-hidden bg-[#faf9f5] transition-all duration-700 ease-in-out ${isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
	
	<!-- SUBTLE OFF-WHITE DECORATION ACCENTS -->
	<div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-200/25 blur-3xl pointer-events-none animate-pulse-glow"></div>
	
	<!-- Floating Cloud.png Assets -->
	<div class="absolute top-10 left-6 sm:left-16 opacity-80 animate-drift-slow pointer-events-none">
		<img src={cloudPng} alt="Awan 1" class="w-36 sm:w-56 md:w-64 h-auto drop-shadow-md" />
	</div>
	<div class="absolute top-24 right-6 sm:right-20 opacity-70 animate-drift-reverse pointer-events-none">
		<img src={cloudPng} alt="Awan 2" class="w-44 sm:w-64 md:w-72 h-auto drop-shadow-md" />
	</div>

	<!-- TOP HEADER BAR: UNIVERSITAS NEGERI MALANG SHOWCASE WITH EASE IN/OUT ANIMATION -->
	<header class="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between shrink-0">
		
		<!-- UNIVERSITAS NEGERI MALANG LOGO & TITLE BADGE (Animated Ease-In/Out) -->
		<div class="flex items-center space-x-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border-3 border-amber-300 shadow-xl animate-logo-ease">
			<!-- Glowing UM Logo Badge -->
			<div class="relative flex items-center justify-center">
				<div class="absolute inset-0 rounded-full bg-amber-400/30 blur-md animate-ping-slow"></div>
				<UMLogo className="w-11 h-11 sm:w-14 sm:h-14 drop-shadow-md relative z-10 shrink-0" />
			</div>
			<!-- Animated Typography -->
			<div class="flex flex-col text-left font-bubble">
				<span class="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wide drop-shadow-xs leading-none">
					UNIVERSITAS NEGERI
				</span>
				<span class="text-sm sm:text-base font-black text-amber-500 uppercase tracking-wider drop-shadow-xs leading-tight">
					MALANG
				</span>
				<span class="text-[10px] sm:text-[11px] font-bold text-amber-700 tracking-wide pt-0.5">
					S1 Pendidikan Geografi
				</span>
			</div>
		</div>

		<!-- TOP RIGHT BADGE -->
		<div class="px-3.5 py-1.5 bg-amber-400 text-amber-950 rounded-full font-extrabold text-xs sm:text-sm border-2 border-white shadow-md uppercase tracking-wider animate-pulse">
			⚡ Splash Loading
		</div>
	</header>

	<!-- CENTER MAIN ANIMATED CONTENT -->
	<div class="relative z-10 w-full max-w-4xl mx-auto my-auto flex flex-col items-center justify-center text-center py-2">
		
		<!-- APP TITLE BANNER (Extra Large Prominent Title) -->
		<div class="mb-3 sm:mb-4 transform hover:scale-105 transition-transform animate-title-bounce">
			<img
				src={titleLogin}
				alt="I-CARE LANDSLIDE Title"
				class="h-28 sm:h-40 md:h-52 lg:h-60 w-auto object-contain mx-auto drop-shadow-2xl"
			/>
			<div class="inline-block mt-2 px-5 py-1.5 bg-amber-400 text-amber-950 border-2 border-white shadow-md rounded-full text-xs sm:text-sm font-extrabold tracking-wide uppercase">
				🗺️ E-Modul Kebencanaan Longsor Kec. Jabung
			</div>
		</div>

		<!-- FEATURED ANIMATED GIRL CYCLING ILLUSTRATION (Proper scale & proportions on off-white canvas) -->
		<div class="relative w-full max-w-md sm:max-w-lg lg:max-w-xl my-2 flex items-center justify-center">
			<img
				src={girlCycling}
				alt="Gadis Bersepeda Interaktif"
				class="w-72 sm:w-96 md:w-[460px] h-auto object-contain drop-shadow-xl animate-cycling-float"
			/>
		</div>

		<!-- GAME 3D PROGRESS BAR & STATUS -->
		<div class="w-full max-w-md sm:max-w-lg px-4 mt-2 space-y-2 font-sans">
			<!-- Percentage Badge & Status Text -->
			<div class="flex items-center justify-between font-bubble text-xs sm:text-sm font-black text-slate-800 px-1">
				<span class="flex items-center space-x-2 truncate">
					<span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
					<span class="truncate text-slate-700 font-extrabold">{loadingStatus}</span>
				</span>
				<span class="text-sm sm:text-base text-amber-950 bg-amber-400 px-3.5 py-0.5 rounded-full border-2 border-white shadow-md">
					{progressPercent}%
				</span>
			</div>

			<!-- 3D Chunky Progress Bar Track -->
			<div class="w-full h-5 sm:h-6 bg-slate-200/90 rounded-full p-1 border-3 border-white shadow-xl relative overflow-hidden">
				<div
					class="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-500 rounded-full transition-all duration-75 relative overflow-hidden shadow-md"
					style="width: {progressPercent}%"
				>
					<!-- Inner Shimmer Light Line -->
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
				</div>
			</div>

			<!-- Footer Tip -->
			<p class="text-[11px] sm:text-xs font-bold text-slate-500 italic text-center">
				Dikembangkan untuk Riset Pembelajaran Geografi Kebencanaan
			</p>
		</div>

	</div>

	<!-- FOOTER attribution -->
	<footer class="relative z-10 text-center py-1 shrink-0">
		<p class="text-[11px] font-bold text-slate-500 drop-shadow-xs">
			© 2026 Universitas Negeri Malang — All Rights Reserved
		</p>
	</footer>
</div>

<style>
	/* LOGO & TITLE EASE IN & OUT KEYFRAMES */
	@keyframes logoEase {
		0% {
			opacity: 0;
			transform: translateY(-20px) scale(0.92);
		}
		50% {
			opacity: 1;
			transform: translateY(0) scale(1.03);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes titleBounce {
		0%, 100% { transform: translateY(0) scale(1); }
		50% { transform: translateY(-4px) scale(1.01); }
	}

	@keyframes cyclingFloat {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-8px) rotate(-1deg); }
	}

	@keyframes driftSlow {
		0% { transform: translateX(0); }
		50% { transform: translateX(25px); }
		100% { transform: translateX(0); }
	}

	@keyframes driftReverse {
		0% { transform: translateX(0); }
		50% { transform: translateX(-25px); }
		100% { transform: translateX(0); }
	}

	@keyframes pulseGlow {
		0%, 100% { opacity: 0.4; transform: translateX(-50%) scale(1); }
		50% { opacity: 0.7; transform: translateX(-50%) scale(1.15); }
	}

	@keyframes shimmer {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}

	.animate-logo-ease {
		animation: logoEase 1.2s ease-in-out forwards;
	}

	.animate-title-bounce {
		animation: titleBounce 3s infinite ease-in-out;
	}

	.animate-cycling-float {
		animation: cyclingFloat 2.8s infinite ease-in-out;
	}

	.animate-drift-slow {
		animation: driftSlow 12s infinite ease-in-out;
	}

	.animate-drift-reverse {
		animation: driftReverse 14s infinite ease-in-out;
	}

	.animate-pulse-glow {
		animation: pulseGlow 4s infinite ease-in-out;
	}

	.animate-shimmer {
		animation: shimmer 1.8s infinite linear;
	}

	.animate-ping-slow {
		animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
	}
</style>
