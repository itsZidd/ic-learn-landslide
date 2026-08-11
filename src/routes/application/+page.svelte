<script lang="ts">
	import { sound } from '$lib/utils/audio';
	import { getProgress, saveProgress } from '$lib/utils/progress';
	import LandscapeBackground from '$lib/components/LandscapeBackground.svelte';
	import petaJabung from '$lib/assets/PetaKerawananLongsorKecamatanJabung.webp';
	import skalaPeta from '$lib/assets/SkalaPeta.webp';
	import longsoranTranslasi from '$lib/assets/LongsoranTranslasi.webp';
	import tipeLongsoranTranslasi from '$lib/assets/TipeLongsoranTranslasional.webp';
	import petaPersebaranLongsor from '$lib/assets/PetaPersebaranLongsor.webp';
	import longsorJabung1 from '$lib/assets/LongsorJabung1.webp';
	import longsorJabung2 from '$lib/assets/LongsorJabung2.webp';
	import petaLongsorTranslasional from '$lib/assets/PetaLongsorTranslasional1.webp';
	import petaLongsorTranslasional2 from '$lib/assets/PetaLongsorTranslasional2.webp';
	import bentangAlamJabung from '$lib/assets/BentangAlamKecamatanJabung.webp';
	import bentukPermukaanJabung from '$lib/assets/BentukPermukaanKecamatanJabung.webp';
	import videoIcon from '$lib/assets/VideoIcon.webp';
	import imgCurahHujan from '$lib/assets/CurahHujan.webp';
	import imgKemiringanLereng from '$lib/assets/KemiringanLereng.webp';
	import imgJenisBatuan from '$lib/assets/JenisBatuan.webp';
	import imgJenisTanah from '$lib/assets/JenisTanah.webp';
	import imgPenggunaanLahan from '$lib/assets/PenggunaanLahan.webp';
	import topografiDusunKrajan1 from '$lib/assets/TopografiDusunKrajan1.webp';
	import topografiDusunKrajan2 from '$lib/assets/TopografiDusunKrajan2.webp';
	import mitigasi1 from '$lib/assets/Mitigasi1.webp';
	import mitigasi2 from '$lib/assets/Mitigasi2.webp';
	import mitigasi3 from '$lib/assets/Mitigasi3.webp';
	import mitigasi4 from '$lib/assets/Mitigasi4.webp';
	import mitigasi5 from '$lib/assets/Mitigasi5.webp';

	// Sub-menu selection state
	let activeSubMenu = $state<number | null>(null);
	let readingTab = $state<number>(1);
	let isVideoModalOpen = $state<boolean>(false);
	let zoomedImage = $state<{ src: string; alt: string; title: string } | null>(null);

	$effect(() => {
		if (activeSubMenu !== null) {
			const maxTab = getMaxTabForSubMenu(activeSubMenu);
			if (readingTab === maxTab) {
				const current = getProgress();
				const subCompleted = [...(current.appSubModulesCompleted || [false, false, false, false])];
				subCompleted[activeSubMenu - 1] = true;
				const allSubCompleted = subCompleted.every(Boolean);

				saveProgress({
					appSubModulesCompleted: subCompleted,
					applicationCompleted: allSubCompleted
				});
			}
		}
	});

	function openVideo() {
		sound.playClick();
		isVideoModalOpen = true;
	}

	function closeVideo() {
		sound.playClick();
		isVideoModalOpen = false;
	}

	function getMaxTabForSubMenu(subMenu: number | null): number {
		if (subMenu === 1) return 3;
		if (subMenu === 3 || subMenu === 4) return 2;
		return 1;
	}

	function prevSlide() {
		if (readingTab > 1) {
			sound.playClick();
			readingTab--;
		}
	}

	function nextSlide() {
		const maxTab = getMaxTabForSubMenu(activeSubMenu);
		if (readingTab < maxTab) {
			sound.playClick();
			readingTab++;
		}
	}

	const subMenuItems = [
		{
			id: 1,
			title: 'Mari Belajar Membaca Peta',
			moduleBadge: 'MODUL 1',
			slideCount: '3 Halaman',
			bgClass: 'bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 border-sky-300',
			shadowColor: '#0284c7',
			badgeClass: 'bg-sky-100/90 text-sky-900 border-sky-300',
			iconSvg: `
				<svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
					<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
					<line x1="9" y1="3" x2="9" y2="18" />
					<line x1="15" y1="6" x2="15" y2="21" />
					<circle cx="15" cy="11" r="2" fill="white" />
				</svg>
			`,
			largeIconSvg: `
				<svg class="w-24 h-24" fill="none" stroke="currentColor" stroke-width="1.3" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
					<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
					<line x1="9" y1="3" x2="9" y2="18" />
					<line x1="15" y1="6" x2="15" y2="21" />
				</svg>
			`,
			contentTitle: 'Mari Belajar Membaca Peta',
			description: 'Mempelajari simbol-simbol peta, skala, garis kontur, serta orientasi arah mata angin untuk menganalisis peta.'
		},
		{
			id: 2,
			title: 'Lihat Geografis Kec. Jabung',
			moduleBadge: 'MODUL 2',
			slideCount: '1 Halaman',
			bgClass: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 border-emerald-300',
			shadowColor: '#047857',
			badgeClass: 'bg-emerald-100/90 text-emerald-900 border-emerald-300',
			iconSvg: `
				<svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
					<path d="M8 3l4 8 5-5 4 12H3L8 3z" />
					<path d="M4.15 15l2.85-5.7 3.5 4.7" />
				</svg>
			`,
			largeIconSvg: `
				<svg class="w-24 h-24" fill="none" stroke="currentColor" stroke-width="1.3" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
					<path d="M8 3l4 8 5-5 4 12H3L8 3z" />
				</svg>
			`,
			contentTitle: 'Kondisi Geografis Kecamatan Jabung',
			description: 'Menganalisis kondisi fisik wilayah Kecamatan Jabung yang terletak di lereng gunung Bromo dengan elevasi bervariasi.'
		},
		{
			id: 3,
			title: 'Bencana Longsor di Jabung',
			moduleBadge: 'MODUL 3',
			slideCount: '2 Halaman',
			bgClass: 'bg-gradient-to-br from-rose-500 via-rose-600 to-amber-700 border-rose-300',
			shadowColor: '#be123c',
			badgeClass: 'bg-rose-100/90 text-rose-900 border-rose-300',
			iconSvg: `
				<svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
					<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
					<line x1="12" y1="9" x2="12" y2="13" />
					<line x1="12" y1="17" x2="12.01" y2="17" stroke-width="3" />
				</svg>
			`,
			largeIconSvg: `
				<svg class="w-24 h-24" fill="none" stroke="currentColor" stroke-width="1.3" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
					<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
				</svg>
			`,
			contentTitle: 'Analisis Kebencanaan Longsor di Jabung',
			description: 'Identifikasi titik rawan longsor (terutama Desa Taji), faktor pemicu curah hujan tinggi, dan kelerengan terjal.'
		},
		{
			id: 4,
			title: 'Mitigasi Bencana Longsor',
			moduleBadge: 'MODUL 4',
			slideCount: '2 Halaman',
			bgClass: 'bg-gradient-to-br from-cyan-500 via-cyan-600 to-teal-700 border-cyan-300',
			shadowColor: '#0e7490',
			badgeClass: 'bg-cyan-100/90 text-cyan-900 border-cyan-300',
			iconSvg: `
				<svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
					<path d="M9 12l2 2 4-4" stroke-width="2.5" />
				</svg>
			`,
			largeIconSvg: `
				<svg class="w-24 h-24" fill="none" stroke="currentColor" stroke-width="1.3" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				</svg>
			`,
			contentTitle: 'Strategi & Tindakan Mitigasi Bencana Longsor',
			description: 'Pencegahan pra-bencana (rumput vetiver, dinding penahan, irigasi), tindakan darurat, dan pemulihan pasca-bencana.'
		}
	];

	function selectSubMenu(id: number) {
		sound.playClick();
		activeSubMenu = id;
		readingTab = 1;
	}

	function setReadingTab(tab: number) {
		sound.playClick();
		readingTab = tab;
	}

	function backToMenu() {
		sound.playClick();
		activeSubMenu = null;
	}
</script>

<svelte:head>
	<title>Application - I-CARE LANDSLIDE</title>
</svelte:head>

<!-- FULLSCREEN IMAGE ZOOM MODAL -->
{#if zoomedImage !== null}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
		<button
			onclick={() => (zoomedImage = null)}
			aria-label="Tutup Pratinjau Gambar"
			class="absolute top-4 right-4 w-11 h-11 rounded-full bg-rose-500 hover:bg-rose-600 border-2 border-white text-white font-black text-xl flex items-center justify-center shadow-xl z-50 cursor-pointer"
		>
			✕
		</button>

		<div class="relative max-w-5xl max-h-[90vh] overflow-auto rounded-2xl border-4 border-white shadow-2xl p-2 bg-white flex flex-col items-center">
			<img
				src={zoomedImage.src}
				alt={zoomedImage.alt}
				class="w-full h-auto max-h-[80vh] object-contain rounded-xl"
			/>
			<p class="text-center text-xs sm:text-sm font-bold text-slate-800 py-2.5 font-bubble">
				{zoomedImage.title}
			</p>
		</div>
	</div>
{/if}

<!-- Responsive Container: Fixed height on large screens, Scrollable on mobile/small screens -->
<main class="relative min-h-screen lg:h-screen lg:h-dvh w-full overflow-y-auto lg:overflow-hidden flex flex-col justify-between p-3 sm:p-5 select-none font-bubble">
	<!-- Landscape Vector Environment Background -->
	<LandscapeBackground />

	<!-- TOP HEADER BAR -->
	<header class="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between shrink-0">
		<div class="flex items-center space-x-3 bg-white/85 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/90 shadow-lg">
			<div class="w-9 h-9 rounded-xl bg-[#00b0ff] text-white flex items-center justify-center font-bold">
				📌
			</div>
			<div class="flex flex-col">
				<span class="text-xs font-bold text-sky-800 uppercase tracking-wide leading-tight">Room 3</span>
				<span class="text-base sm:text-lg font-extrabold text-sky-950 leading-tight">Application</span>
			</div>
		</div>

		<!-- Back to Main Menu Button -->
		<a
			href="/"
			onclick={() => sound.playClick()}
			onmouseenter={() => sound.playCardHover()}
			aria-label="Menu Utama"
			class="group relative px-3 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-gradient-to-b from-[#00e5ff] via-[#00b0ff] to-[#0284c7] border-2 border-white shadow-md flex items-center justify-center text-white font-bold transform active:scale-95 transition-all hover:scale-105"
			style="box-shadow: 0 4px 0 0 #0369a1, 0 8px 15px rgba(0, 0, 0, 0.2);"
		>
			<!-- Mobile View (< sm): Lucide Home Icon -->
			<svg class="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
				<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
				<polyline points="9 22 9 12 15 12 15 22"/>
			</svg>

			<!-- Desktop View (>= sm): Arrow SVG + Menu Utama Text -->
			<div class="hidden sm:flex items-center space-x-2">
				<svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
					<path d="M19 12H5M12 19l-7-7 7-7" />
				</svg>
				<span>Menu Utama</span>
			</div>
		</a>
	</header>

	<!-- MAIN WHITEBOARD DISPLAY -->
	<div class="relative z-10 w-full max-w-5xl mx-auto flex-1 min-h-0 flex flex-col items-center justify-center py-2 sm:py-4">
		
		<!-- Wooden Frame Outer Box -->
		<div class="relative w-full bg-[#d7995b] rounded-3xl p-3 sm:p-5 border-4 border-[#8c5222] shadow-2xl flex flex-col">
			
			<!-- Wood Texture Shadow Bevel -->
			<div class="absolute inset-0 rounded-2xl border-4 border-black/10 pointer-events-none"></div>

			<!-- Top Floating Title Banner -->
			<div class="absolute -top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
				<div class={`px-6 sm:px-10 py-2 sm:py-2.5 rounded-2xl border-3 border-white shadow-xl text-white font-extrabold text-base sm:text-2xl tracking-wide text-shadow whitespace-nowrap ${
					activeSubMenu === 1
						? 'bg-gradient-to-r from-sky-500 via-sky-600 to-blue-700'
						: activeSubMenu === 2
						? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-700'
						: activeSubMenu === 3
						? 'bg-gradient-to-r from-rose-500 via-rose-600 to-amber-700'
						: activeSubMenu === 4
						? 'bg-gradient-to-r from-cyan-500 via-cyan-600 to-teal-700'
						: 'bg-gradient-to-r from-[#00b0ff] via-[#0284c7] to-[#00b0ff]'
				}`}>
					{activeSubMenu === 1 ? 'Mari Belajar Membaca Peta' : activeSubMenu === 2 ? 'Kondisi Geografis Kec. Jabung' : activeSubMenu === 3 ? 'Bencana Longsor di Kec. Jabung' : activeSubMenu === 4 ? 'Mitigasi Bencana Longsor' : 'Capaian Pembelajaran'}
				</div>
			</div>

			<!-- Whiteboard Inner Content Canvas -->
			<div class="relative w-full flex-1 bg-[#fffdf7] rounded-2xl border-3 border-[#c4b5a5] p-4 sm:p-6 md:p-8 pt-6 sm:pt-8 text-gray-800 font-sans shadow-inner overflow-y-auto min-h-[380px] sm:min-h-[440px] max-h-[62vh]">
				
				{#if activeSubMenu === null}
					<!-- DASHBOARD GRID OF 4 VIBRANT INTERACTIVE MODULE CARDS -->
					<div class="w-full max-w-4xl mx-auto py-1 sm:py-2 animate-fade-in font-bubble space-y-3">
						<!-- Subheader Banner -->
						<div class="text-center space-y-0.5 mb-2">
							<h2 class="text-base sm:text-xl font-extrabold text-sky-950 flex items-center justify-center space-x-2">
								<span>🎯</span>
								<span>Pilih Modul Pembelajaran Aplikasi</span>
							</h2>
							<p class="text-xs sm:text-sm font-sans text-slate-600 font-medium">
								Pilih salah satu modul pembelajaran interaktif di bawah ini:
							</p>
						</div>

						<!-- 2x2 Card Grid -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
							{#each subMenuItems as item}
								<button
									onclick={() => selectSubMenu(item.id)}
									onmouseenter={() => sound.playCardHover()}
									class={`group relative w-full p-4 rounded-2xl text-left border-3 transition-all duration-200 transform active:scale-95 hover:-translate-y-1 hover:brightness-105 cursor-pointer flex flex-col justify-between overflow-hidden shadow-md ${item.bgClass}`}
									style={`box-shadow: 0 5px 0 0 ${item.shadowColor}, 0 8px 16px rgba(0,0,0,0.12);`}
								>
									<!-- Subtle Top Specular Light Effect -->
									<div class="absolute top-0 left-0 right-0 h-1.5 bg-white/35 rounded-t-2xl pointer-events-none"></div>

									<!-- Decorative Watermark Icon Background -->
									<div class="absolute -right-3 -bottom-3 opacity-15 group-hover:opacity-25 transition-opacity text-white pointer-events-none transform group-hover:scale-110 group-hover:rotate-6">
										{@html item.largeIconSvg}
									</div>

									<div>
										<!-- Top Badge Row -->
										<div class="flex items-center justify-between mb-2.5">
											<span class={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase border shadow-2xs ${item.badgeClass}`}>
												{item.moduleBadge}
											</span>
											<span class="text-[11px] font-semibold text-white/90 bg-black/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
												{item.slideCount}
											</span>
										</div>

										<!-- Icon & Title Row -->
										<div class="flex items-start space-x-3 mb-1.5">
											<div class="p-2 bg-white/20 backdrop-blur-xs rounded-xl text-white border border-white/30 shrink-0 group-hover:scale-110 transition-transform">
												{@html item.iconSvg}
											</div>
											<div class="flex-1 min-w-0">
												<h3 class="text-sm sm:text-base font-extrabold text-white leading-tight drop-shadow-xs truncate">
													{item.title}
												</h3>
												<p class="text-xs text-white/90 font-sans font-medium line-clamp-2 mt-1 leading-snug">
													{item.description}
												</p>
											</div>
										</div>
									</div>

									<!-- Bottom Action Bar -->
									<div class="mt-3 pt-2.5 border-t border-white/25 flex items-center justify-between text-xs font-bold text-white">
										<span class="flex items-center space-x-1">
											<span>Mulai Belajar</span>
										</span>
										<div class="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-sky-900 flex items-center justify-center transition-all group-hover:translate-x-1 shadow-xs">
											<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
												<path d="M9 5l7 7-7 7" />
											</svg>
										</div>
									</div>
								</button>
							{/each}
						</div>
					</div>

				{:else if activeSubMenu === 1}
					<!-- SUB-MENU 1: MARI BELAJAR MEMBACA PETA (3 READING MODULE TABS) -->
					<div class="w-full space-y-4 animate-fade-in">
						
						<!-- Header & Back Button (Sticky Pinned Bar with Top Mask) -->
						<div class="sticky top-0 -mx-4 sm:-mx-6 md:-mx-8 mb-3 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-[#fffdf7] z-20 border-b-2 border-sky-200 flex items-center justify-between font-bubble shadow-xs before:content-[''] before:absolute before:-top-20 before:left-0 before:right-0 before:h-20 before:bg-[#fffdf7]">
							<h2 class="text-xs sm:text-base font-extrabold text-sky-950 flex items-center space-x-2 relative z-10">
								<span>🗺️</span>
								<span>Mari Belajar Membaca Peta</span>
							</h2>
							<button
								onclick={backToMenu}
								onmouseenter={() => sound.playCardHover()}
								class="relative z-10 px-3.5 py-1.5 bg-gradient-to-b from-[#00e5ff] via-[#00b0ff] to-[#0284c7] hover:brightness-110 text-white font-bold rounded-xl text-xs sm:text-sm transition-all border border-white flex items-center space-x-1 cursor-pointer font-bubble shadow-md transform active:scale-95 shrink-0"
								style="box-shadow: 0 3px 0 0 #01579b;"
							>
								<span>↩ Kembali</span>
							</button>
						</div>


						<!-- READING TAB 1 CONTENT -->
						{#if readingTab === 1}
							<div class="space-y-4 pt-2 text-justify animate-fade-in font-sans">
								<!-- EMBEDDED MAP DISPLAY ON PETA 1 -->
								<div class="relative group my-2 max-w-2xl mx-auto bg-white p-2 rounded-xl border border-amber-300 shadow-md">
									<img
										src={petaJabung}
										alt="Peta Kerawanan Longsor Kecamatan Jabung"
										class="w-full h-auto max-h-[200px] sm:max-h-[260px] object-contain rounded-lg mx-auto"
									/>
									<button
										type="button"
										onclick={() => (zoomedImage = { src: petaJabung, alt: 'Peta Kerawanan Longsor Kecamatan Jabung', title: 'Peta Kerawanan Longsor Kecamatan Jabung' })}
										class="absolute bottom-4 right-4 bg-amber-900/90 hover:bg-amber-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
									>
										<span>🔍 Perbesar Peta</span>
									</button>
								</div>

								<div class="bg-amber-50/90 p-4 rounded-2xl border-2 border-amber-200 shadow-sm space-y-3">
									<h3 class="text-base sm:text-lg font-extrabold text-amber-950 border-b border-amber-300 pb-1.5 font-bubble flex items-center space-x-2">
										<span>📌</span>
										<span>Unsur Penting dalam Peta</span>
									</h3>
									
									<div class="space-y-3 text-xs sm:text-sm leading-relaxed text-gray-800">
										<!-- 1. Judul -->
										<div class="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs flex items-start space-x-2.5">
											<span class="font-bold text-amber-900 text-sm shrink-0">1.</span>
											<div class="flex-1">
												<strong class="text-amber-900 font-bold">Judul:</strong>
												Berfungsi untuk memberikan gambaran umum mengenai isi atau topik utama dari peta tersebut.
											</div>
										</div>

										<!-- 2. Skala Peta -->
										<div class="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs flex items-start space-x-2.5">
											<span class="font-bold text-amber-900 text-sm shrink-0">2.</span>
											<div class="flex-1 space-y-2">
												<p>
													<strong class="text-amber-900 font-bold">Skala Peta:</strong>
													Menunjukkan perbandingan jarak pada peta dengan jarak sebenarnya di lapangan, misalnya <code class="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-mono font-bold">1:200.000</code> menunjukkan 1cm di peta sama dengan 200.000 cm / 2 km di lapangan.
												</p>

												<!-- SKALA PETA IMAGE ASSET -->
												<div class="my-2 max-w-md mx-auto bg-white p-1.5 rounded-xl border border-amber-300 shadow-xs">
													<img
														src={skalaPeta}
														alt="Skala Batang Peta"
														class="w-full h-auto max-h-24 sm:max-h-32 object-contain rounded-lg mx-auto"
													/>
												</div>

												<div class="bg-amber-100/70 p-2.5 rounded-lg border border-amber-300 text-xs text-amber-950 font-medium">
													💡 <strong>Cara membaca skala batang:</strong> Panjang batang mewakili 0 hingga 8,1 km, dengan tiap segmen utama menunjukkan jarak 2,02 km. Ukur jarak antara dua titik di peta menggunakan penggaris, lalu bandingkan panjangnya dengan skala batang untuk mengetahui jarak sebenarnya.
												</div>
											</div>
										</div>

										<!-- 3. Arah (Orientasi) -->
										<div class="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs flex items-start space-x-2.5">
											<span class="font-bold text-amber-900 text-sm shrink-0">3.</span>
											<div class="flex-1">
												<strong class="text-amber-900 font-bold">Arah (Orientasi):</strong>
												Biasanya ditandai dengan simbol kompas seperti panah ke utara, digunakan untuk menunjukkan arah geografis agar pembaca tidak salah dalam menentukan posisi.
											</div>
										</div>

										<!-- 4. Garis Koordinat -->
										<div class="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs flex items-start space-x-2.5">
											<span class="font-bold text-amber-900 text-sm shrink-0">4.</span>
											<div class="flex-1">
												<strong class="text-amber-900 font-bold">Garis Koordinat:</strong>
												Biasanya berupa garis lintang dan bujur, mempermudah penentuan lokasi spesifik pada peta secara lebih presisi.
											</div>
										</div>

										<!-- 5. Simbol -->
										<div class="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs flex items-start space-x-2.5">
											<span class="font-bold text-amber-900 text-sm shrink-0">5.</span>
											<div class="flex-1">
												<strong class="text-amber-900 font-bold">Simbol:</strong>
												Gambar kecil atau tanda khusus yang mewakili fitur seperti jalan, batas administrasi, atau sungai.
											</div>
										</div>

										<!-- 6. Legenda -->
										<div class="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs flex items-start space-x-2.5">
											<span class="font-bold text-amber-900 text-sm shrink-0">6.</span>
											<div class="flex-1">
												<strong class="text-amber-900 font-bold">Legenda:</strong>
												Berisi penjelasan tentang simbol-simbol yang digunakan pada peta sehingga setiap unsur dalam peta dapat dimengerti dengan mudah.
											</div>
										</div>

										<!-- 7. Warna Peta -->
										<div class="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs flex items-start space-x-2.5">
											<span class="font-bold text-amber-900 text-sm shrink-0">7.</span>
											<div class="flex-1">
												<strong class="text-amber-900 font-bold">Warna Peta:</strong>
												Bentuk penonjolan untuk menggambarkan perbedaan objek pada peta.
											</div>
										</div>

										<!-- 8. Lettering -->
										<div class="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs flex items-start space-x-2.5">
											<span class="font-bold text-amber-900 text-sm shrink-0">8.</span>
											<div class="flex-1">
												<strong class="text-amber-900 font-bold">Lettering:</strong>
												Seluruh tulisan yang berkaitan pada peta, meliputi huruf kapital seperti nama wilayah, huruf kecil, dan kombinasi keduanya.
											</div>
										</div>

										<!-- 9. Inset Peta -->
										<div class="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs flex items-start space-x-2.5">
											<span class="font-bold text-amber-900 text-sm shrink-0">9.</span>
											<div class="flex-1">
												<strong class="text-amber-900 font-bold">Inset Peta:</strong>
												Menunjukkan peta tambahan kecil yang memberikan konteks dari peta utama.
											</div>
										</div>

										<!-- 10. Sumber Peta dan Tahun Pembuatan -->
										<div class="p-3.5 bg-white rounded-xl border border-amber-200 shadow-xs flex items-start space-x-2.5">
											<span class="font-bold text-amber-900 text-sm shrink-0">10.</span>
											<div class="flex-1">
												<strong class="text-amber-900 font-bold">Sumber Peta dan Tahun Pembuatan:</strong>
												Menyebutkan dari mana data peta diambil dan kapan dibuat untuk memastikan keakuratan dan relevansi informasi.
											</div>
										</div>
									</div>
								</div>
							</div>

						<!-- READING TAB 2 CONTENT -->
						{:else if readingTab === 2}
							<div class="space-y-4 pt-2 text-justify animate-fade-in font-sans">
								<!-- EMBEDDED MAP DISPLAY -->
								<div class="relative group my-2 max-w-2xl mx-auto bg-white p-2 rounded-xl border border-emerald-300 shadow-md">
									<img
										src={petaJabung}
										alt="Peta Kerawanan Longsor Kecamatan Jabung"
										class="w-full h-auto max-h-[200px] sm:max-h-[260px] object-contain rounded-lg mx-auto"
									/>
									<button
										type="button"
										onclick={() => (zoomedImage = { src: petaJabung, alt: 'Peta Kerawanan Longsor Kecamatan Jabung', title: 'Peta Kerawanan Longsor Kecamatan Jabung' })}
										class="absolute bottom-4 right-4 bg-emerald-900/90 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
									>
										<span>🔍 Perbesar Peta</span>
							</button>
						</div>

						<div class="bg-emerald-50/90 p-4 rounded-2xl border-2 border-emerald-200 shadow-sm space-y-3">
							<h3 class="text-base sm:text-lg font-extrabold text-emerald-950 border-b border-emerald-300 pb-1.5 font-bubble flex items-center space-x-2">
								<span>🗺️</span>
								<span>Implementasi Unsur Peta Pada Peta Kerawanan Longsor Kecamatan Jabung</span>
							</h3>

							<div class="space-y-3 text-xs sm:text-sm leading-relaxed text-gray-800">
								<!-- 1. Judul Peta -->
								<div class="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs flex items-start space-x-2.5">
									<span class="font-bold text-emerald-900 text-sm shrink-0">1.</span>
									<div class="flex-1">
										<strong class="text-emerald-900 font-bold">Judul Peta:</strong>
										Judul peta tertulis jelas di bagian atas: <em class="font-semibold text-emerald-950 font-sans">"Peta Kerawanan Longsor Kecamatan Jabung"</em>. Judul ini menunjukkan bahwa peta menggambarkan tingkat risiko longsor di wilayah Kecamatan Jabung.
									</div>
								</div>

								<!-- 2. Skala Peta -->
								<div class="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs flex items-start space-x-2.5">
									<span class="font-bold text-emerald-900 text-sm shrink-0">2.</span>
									<div class="flex-1">
										<strong class="text-emerald-900 font-bold">Skala Peta:</strong>
										Skala peta adalah <code class="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900 font-mono font-bold">1:65.000</code>, artinya 1 cm di peta setara dengan 650 meter di lapangan. Selain skala angka, ada juga skala batang di samping judul, yang memudahkan Anda mengukur jarak sebenarnya tanpa perlu menghitung. Setiap segmen batang menunjukkan jarak 2.02 km.
									</div>
								</div>

								<!-- 3. Legenda -->
								<div class="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs flex items-start space-x-2.5">
									<span class="font-bold text-emerald-900 text-sm shrink-0">3.</span>
									<div class="flex-1 space-y-2">
										<strong class="text-emerald-900 font-bold block text-sm">Legenda:</strong>
										<p class="text-xs">Legenda menjelaskan simbol dan warna pada peta:</p>
										<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold pt-1">
											<div class="flex items-center space-x-2 bg-emerald-100/60 p-1.5 rounded-lg border border-emerald-200">
												<span class="w-3.5 h-3.5 rounded-full bg-[#1b5e20] inline-block shadow-xs shrink-0"></span>
												<span>Hijau Tua: Sangat Rendah</span>
											</div>
											<div class="flex items-center space-x-2 bg-lime-100/60 p-1.5 rounded-lg border border-lime-200">
												<span class="w-3.5 h-3.5 rounded-full bg-[#7cb342] inline-block shadow-xs shrink-0"></span>
												<span>Hijau Muda: Rendah</span>
											</div>
											<div class="flex items-center space-x-2 bg-amber-100/60 p-1.5 rounded-lg border border-amber-200">
												<span class="w-3.5 h-3.5 rounded-full bg-[#fbc02d] inline-block shadow-xs shrink-0"></span>
												<span>Kuning: Sedang</span>
											</div>
											<div class="flex items-center space-x-2 bg-orange-100/60 p-1.5 rounded-lg border border-orange-200">
												<span class="w-3.5 h-3.5 rounded-full bg-[#fb8c00] inline-block shadow-xs shrink-0"></span>
												<span>Oranye: Tinggi</span>
											</div>
											<div class="flex items-center space-x-2 bg-rose-100/60 p-1.5 rounded-lg border border-rose-200 sm:col-span-2">
												<span class="w-3.5 h-3.5 rounded-full bg-[#e53935] inline-block shadow-xs shrink-0"></span>
												<span>Merah: Sangat Tinggi</span>
											</div>
										</div>
										<div class="text-xs pt-1 space-y-1">
											<p class="font-bold text-gray-900">Garis Batas Administratif:</p>
											<div class="space-y-1 text-gray-700">
												<div class="flex items-start space-x-2">
													<span class="shrink-0">•</span>
													<span class="flex-1">Garis tebal warna hitam: Batas Kabupaten</span>
												</div>
												<div class="flex items-start space-x-2">
													<span class="shrink-0">•</span>
													<span class="flex-1">Garis putus-putus: Batas Kecamatan</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- 4. Distribusi Kerawanan Longsor -->
								<div class="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs flex items-start space-x-2.5">
									<span class="font-bold text-emerald-900 text-sm shrink-0">4.</span>
									<div class="flex-1 space-y-2">
										<strong class="text-emerald-900 font-bold block text-sm">Distribusi Kerawanan Longsor:</strong>
										<div class="space-y-2 text-xs text-gray-800">
											<div class="flex items-start space-x-2">
												<span class="shrink-0 text-base leading-none">📍</span>
												<div class="flex-1">
													<strong>Wilayah utara</strong> (Kemiri, Jabung, Slamparejo): Kerawanan rendah hingga tinggi (warna hijau muda hingga oranye).
												</div>
											</div>

											<div class="flex items-start space-x-2">
												<span class="shrink-0 text-base leading-none">📍</span>
												<div class="flex-1">
													<strong>Wilayah tengah</strong> (Argosari, Gading Kembar, Sidomulyo): Kerawanan rendah hingga tinggi (warna hijau tua hingga oranye).
												</div>
											</div>

											<div class="flex items-start space-x-2">
												<span class="shrink-0 text-base leading-none">📍</span>
												<div class="flex-1">
													<strong>Wilayah timur</strong> (Taji, Pandansari Lor, Ngadirejo): Kerawanan tinggi hingga sangat tinggi (warna oranye dan merah), terutama di daerah lereng deretan pegunungan Bromo.
												</div>
											</div>

											<div class="flex items-start space-x-2">
												<span class="shrink-0 text-base leading-none">📍</span>
												<div class="flex-1">
													<strong>Wilayah barat</strong> (Kemantren, Sukolilo, Gunungjati, Sidomulyo): Kerawanan rendah (warna hijau muda hingga hijau tua).
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- 5. Parameter -->
								<div class="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs flex items-start space-x-2.5">
									<span class="font-bold text-emerald-900 text-sm shrink-0">5.</span>
									<div class="flex-1 space-y-1.5">
										<strong class="text-emerald-900 font-bold block text-sm">Parameter:</strong>
										<p class="text-xs text-gray-700">Di sisi kanan peta, terdapat parameter utama yang memengaruhi kerawanan longsor, yaitu:</p>
										<div class="space-y-1.5 text-xs text-gray-800 pt-0.5">
											<div class="flex items-start space-x-2">
												<span class="shrink-0">🌧️</span>
												<div class="flex-1"><strong>Curah hujan:</strong> Daerah dengan intensitas hujan tinggi lebih rentan longsor.</div>
											</div>
											<div class="flex items-start space-x-2">
												<span class="shrink-0">📐</span>
												<div class="flex-1"><strong>Kemiringan lereng:</strong> Wilayah berbukit atau pegunungan lebih berisiko.</div>
											</div>
											<div class="flex items-start space-x-2">
												<span class="shrink-0">🪨</span>
												<div class="flex-1"><strong>Jenis batuan:</strong> Batuan tertentu lebih mudah longsor dibandingkan yang lain.</div>
											</div>
											<div class="flex items-start space-x-2">
												<span class="shrink-0">🌾</span>
												<div class="flex-1"><strong>Penggunaan lahan:</strong> Aktivitas manusia, seperti pembukaan lahan, dapat meningkatkan risiko.</div>
											</div>
											<div class="flex items-start space-x-2">
												<span class="shrink-0">🏔️</span>
												<div class="flex-1"><strong>Jenis tanah:</strong> Tanah tertentu memiliki stabilitas lebih rendah, sehingga mudah lepas dan longsor.</div>
											</div>
										</div>
									</div>
								</div>

								<!-- 6. Data Statistik -->
								<div class="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs flex items-start space-x-2.5">
									<span class="font-bold text-emerald-900 text-sm shrink-0">6.</span>
									<div class="flex-1 space-y-1.5">
										<strong class="text-emerald-900 font-bold block text-sm">Data Statistik:</strong>
										<p class="text-xs text-gray-700">Luas masing-masing kategori kerawanan ditampilkan dalam tabel di legenda:</p>
										<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-center font-bold pt-1">
											<div class="bg-emerald-50 p-2 rounded-lg border border-emerald-200">Sangat Rendah: 566,95 Ha²</div>
											<div class="bg-lime-50 p-2 rounded-lg border border-lime-200">Rendah: 2.458,09 Ha²</div>
											<div class="bg-amber-50 p-2 rounded-lg border border-amber-200">Sedang: 2.325,25 Ha²</div>
											<div class="bg-orange-50 p-2 rounded-lg border border-orange-200">Tinggi: 5.649,91 Ha²</div>
											<div class="bg-rose-50 p-2 rounded-lg border border-rose-200 col-span-2 sm:col-span-1">Sangat Tinggi: 893,71 Ha²</div>
										</div>
									</div>
								</div>

								<!-- 7. Inset Peta -->
								<div class="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs flex items-start space-x-2.5">
									<span class="font-bold text-emerald-900 text-sm shrink-0">7.</span>
									<div class="flex-1">
										<strong class="text-emerald-900 font-bold">Inset Peta:</strong>
										Inset peta di sebelah kanan atas menunjukkan lokasi Kecamatan Jabung dalam skala lebih luas, memberikan konteks geografis wilayah.
									</div>
								</div>

								<!-- 8. Sumber Data -->
								<div class="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs flex items-start space-x-2.5">
									<span class="font-bold text-emerald-900 text-sm shrink-0">8.</span>
									<div class="flex-1">
										<strong class="text-emerald-900 font-bold">Sumber Data:</strong>
										Sumber data mencakup curah hujan CHIRPS 2013-2023, elevasi, jenis tanah, penggunaan lahan, dan lain-lain, yang berasal dari lembaga terpercaya seperti Demnas, Geologi ESDM, RBI, FAO.
									</div>
								</div>
							</div>
						</div>
					</div>

				<!-- READING TAB 2 CONTENT -->
				{:else if readingTab === 2}
					<div class="space-y-4 pt-2 text-justify animate-fade-in font-sans">
						<!-- EMBEDDED MAP DISPLAY ON PETA 2 -->
						<div class="relative group my-2 max-w-2xl mx-auto bg-white p-2 rounded-xl border border-sky-300 shadow-md">
							<img
								src={petaLongsorTranslasional}
								alt="Peta Kerawanan Longsor Kecamatan Jabung (Implementasi)"
								class="w-full h-auto max-h-[200px] sm:max-h-[260px] object-contain rounded-lg mx-auto"
							/>
							<button
								type="button"
								onclick={() => (zoomedImage = { src: petaLongsorTranslasional, alt: 'Peta Kerawanan Longsor Kecamatan Jabung (Implementasi)', title: 'Peta Kerawanan Longsor Kecamatan Jabung (Implementasi)' })}
								class="absolute bottom-4 right-4 bg-sky-900/90 hover:bg-sky-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
							>
								<span>🔍 Perbesar Peta</span>
							</button>
						</div>

						<div class="bg-sky-50/90 p-4 rounded-2xl border-2 border-sky-200 shadow-sm space-y-3">
							<h3 class="text-base sm:text-lg font-extrabold text-sky-950 border-b border-sky-300 pb-1.5 font-bubble flex items-center space-x-2">
								<span>🗺️</span>
								<span>Implementasi Peta di Kecamatan Jabung</span>
							</h3>
							
							<p class="text-xs sm:text-sm leading-relaxed text-gray-800">
								Peta ini menyajikan hasil pemetaan wilayah Kecamatan Jabung, Kabupaten Malang, yang menggambarkan tingkat kerawanan tanah longsor di berbagai desa. Berdasarkan analisis lima parameter utama (curah hujan, kemiringan lereng, jenis batuan, penggunaan lahan, dan jenis tanah), wilayah Kecamatan Jabung terbagi menjadi lima zona tingkat kerawanan.
							</p>
						</div>
					</div>

				<!-- READING TAB 3 CONTENT -->
				{:else if readingTab === 3}
					<div class="space-y-4 pt-2 text-justify animate-fade-in font-sans">
						<!-- EMBEDDED MAP DISPLAY -->
						<div class="relative group my-2 max-w-2xl mx-auto bg-white p-2 rounded-xl border border-sky-300 shadow-md">
							<img
								src={petaJabung}
								alt="Peta Kerawanan Longsor Kecamatan Jabung"
								class="w-full h-auto max-h-[200px] sm:max-h-[260px] object-contain rounded-lg mx-auto"
							/>
							<button
								type="button"
								onclick={() => (zoomedImage = { src: petaJabung, alt: 'Peta Kerawanan Longsor Kecamatan Jabung', title: 'Peta Kerawanan Longsor Kecamatan Jabung' })}
								class="absolute bottom-4 right-4 bg-sky-900/90 hover:bg-sky-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
							>
								<span>🔍 Perbesar Peta</span>
							</button>
						</div>

						<div class="bg-sky-50/90 p-4 rounded-2xl border-2 border-sky-200 shadow-sm space-y-3">
							<h3 class="text-base sm:text-lg font-extrabold text-sky-950 border-b border-sky-300 pb-1.5 font-bubble flex items-center space-x-2">
								<span>📊</span>
								<span>Cara Membaca Peta Kerawanan Longsor</span>
							</h3>

							<p class="text-xs sm:text-sm leading-relaxed text-gray-800">
								Peta kerawanan longsor Kecamatan Jabung adalah alat penting untuk memahami tingkat risiko longsor di wilayah ini, yang terbagi ke dalam lima kategori: sangat rendah, rendah, sedang, tinggi, dan sangat tinggi. Peta ini menggunakan berbagai warna untuk menunjukkan tingkat kerawanan, dengan <strong>hijau tua</strong> untuk kategori sangat rendah, <strong>hijau muda</strong> untuk rendah, <strong>kuning</strong> untuk sedang, <strong>orange</strong> untuk tinggi, dan <strong>merah</strong> untuk sangat tinggi. Dengan memahami warna-warna ini, dapat dengan mudah mengidentifikasi wilayah-wilayah yang lebih rentan terhadap bencana longsor, seperti wilayah timur Kecamatan Jabung, terutama Desa Taji, yang sebagian besar berada di zona merah atau sangat tinggi. Hal ini juga berkaitan dengan kondisi topografi wilayah berada pada lereng dan kaki gunung.
							</p>

							<!-- TREE MAP BOX -->
							<div class="p-3.5 bg-white rounded-xl border border-sky-200 shadow-xs space-y-2">
								<strong class="text-sky-900 font-bold block text-sm">🌳 Analisis Tree Map & Luas Wilayah:</strong>
								<p class="text-xs text-gray-800 leading-relaxed">
									Untuk membaca luas kerawanan longsor berdasarkan tree map yang ditampilkan pada peta, perlu memahami representasi setiap kategori risiko melalui warna dan ukuran kotak. Tree map ini membagi wilayah Kecamatan Jabung ke dalam lima kategori tingkat kerawanan dengan masing-masing kotak menunjukkan luas wilayah yang dimiliki oleh setiap kategori. Semakin besar kotak lingkaran, semakin luas area yang masuk dalam kategori tersebut.
								</p>
								<div class="space-y-1.5 text-xs text-gray-800 pt-1 font-medium">
									<div class="flex items-start space-x-2">
										<span class="w-2.5 h-2.5 rounded-full bg-[#7cb342] shrink-0 mt-1"></span>
										<div class="flex-1">
											Kategori <strong>Rendah</strong> (warna hijau muda) memiliki lingkaran sedang, menunjukkan luas wilayahnya mencapai <strong>2.458,09 Ha²</strong> (mewakili <strong>20.7%</strong> dari total luas).
										</div>
									</div>
									<div class="flex items-start space-x-2">
										<span class="w-2.5 h-2.5 rounded-full bg-[#1b5e20] shrink-0 mt-1"></span>
										<div class="flex-1">
											Kategori <strong>Sangat Rendah</strong> (warna hijau tua) memiliki kotak terkecil dengan luas hanya <strong>566,95 Ha²</strong>.
										</div>
									</div>
									<div class="flex items-start space-x-2">
										<span class="w-2.5 h-2.5 rounded-full bg-[#e53935] shrink-0 mt-1"></span>
										<div class="flex-1">
											Kategori <strong>Sangat Tinggi</strong> (warna merah) memiliki luas <strong>893,71 Ha²</strong> (<strong>7.5%</strong> dari luas total). Hal ini menunjukkan bahwa wilayah ini memiliki cakupan termasuk kecil tetapi berisiko paling besar terhadap longsor.
										</div>
									</div>
								</div>
							</div>

							<!-- 5 PARAMETER LONGSOR BOX -->
							<div class="p-3.5 bg-white rounded-xl border border-sky-200 shadow-xs space-y-3">
								<strong class="text-sky-900 font-bold block text-sm border-b border-sky-100 pb-1">
									⛰️ Parameter Longsor dalam Peta:
								</strong>
								<p class="text-xs text-gray-700">
									Parameter longsor yang ditampilkan dalam peta terdiri dari beberapa aspek penting yang memengaruhi risiko tanah longsor:
								</p>

								<div class="space-y-2.5 text-xs text-gray-800">
									<div class="p-2.5 bg-sky-50/70 rounded-lg border border-sky-200 flex items-start space-x-2.5">
										<span class="font-bold text-sky-900 text-sm shrink-0">1.</span>
										<div class="flex-1 space-y-0.5">
											<strong class="text-sky-900 font-bold block text-sm">Curah Hujan:</strong>
											Curah hujan adalah faktor utama yang memengaruhi tingkat kejenuhan tanah. Dalam peta, curah hujan dibagi ke dalam lima kategori, mulai dari <code class="bg-sky-100 px-1 py-0.5 rounded font-mono font-bold">&lt;1500 mm/tahun</code> (biru muda) hingga <code class="bg-sky-200 px-1 py-0.5 rounded font-mono font-bold text-sky-950">&gt;2500 mm/tahun</code> (biru gelap). Wilayah dengan curah hujan tinggi, terutama di timur Kecamatan Jabung, lebih rentan terhadap longsor karena air hujan dapat meningkatkan tekanan pori tanah dan mengurangi kestabilan tanah.
										</div>
									</div>

									<div class="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 flex items-start space-x-2.5">
										<span class="font-bold text-amber-900 text-sm shrink-0">2.</span>
										<div class="flex-1 space-y-0.5">
											<strong class="text-amber-900 font-bold block text-sm">Kemiringan Lereng:</strong>
											Kemiringan lereng berkontribusi besar terhadap risiko longsor. Dalam peta ini, lereng dikategorikan ke dalam lima tingkatan, dari landai (<code class="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">0-8%</code>, krem muda) hingga sangat curam (<code class="bg-rose-100 px-1 py-0.5 rounded font-mono font-bold text-rose-900">&gt;45%</code>, merah tua). Wilayah selatan dengan kemiringan curam lebih berisiko karena gravitasi memengaruhi kestabilan massa tanah.
										</div>
									</div>

									<div class="p-2.5 bg-slate-50/80 rounded-lg border border-slate-200 flex items-start space-x-2.5">
										<span class="font-bold text-slate-900 text-sm shrink-0">3.</span>
										<div class="flex-1 space-y-0.5">
											<strong class="text-slate-900 font-bold block text-sm">Jenis Batuan:</strong>
											Jenis batuan di suatu wilayah juga memengaruhi stabilitas tanah. Peta menunjukkan berbagai formasi geologi, seperti jenis batuan gunungapi Tengger, batuan gunungapi Kuarter bawah, dan Tuf Malang. Batuan yang tidak stabil atau mudah lapuk akan meningkatkan risiko longsor.
										</div>
									</div>

									<div class="p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200 flex items-start space-x-2.5">
										<span class="font-bold text-emerald-900 text-sm shrink-0">4.</span>
										<div class="flex-1 space-y-0.5">
											<strong class="text-emerald-900 font-bold block text-sm">Penggunaan Lahan:</strong>
											Aktivitas manusia pada penggunaan lahan turut memengaruhi risiko. Peta ini mencakup beberapa kategori, seperti sawah, hutan rimba, pemukiman, dan tanah terbuka.
										</div>
									</div>

									<div class="p-2.5 bg-orange-50/70 rounded-lg border border-orange-200 flex items-start space-x-2.5">
										<span class="font-bold text-orange-900 text-sm shrink-0">5.</span>
										<div class="flex-1 space-y-0.5">
											<strong class="text-orange-900 font-bold block text-sm">Jenis Tanah:</strong>
											Jenis tanah memengaruhi daya serap dan kekuatan tanah. Beberapa jenis tanah Andosol yang terbagi menjadi 3 jenis yaitu Andosol Molik, Okrik, dan Vitrik. Dimana jenis tanah Andosol ini merupakan jenis tanah yang berasal dari material erupsi gunung berapi. Jenis tanah tersebut mempengaruhi terjadinya tanah longsor, semakin kuat jenis tanah, maka bencana longsor kemungkinan kecil terjadi.
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/if}

						<!-- SLIDE FOOTER INDICATOR (Sub-Menu 1: Mari Belajar Membaca Peta) -->
						<div class="w-full pt-4 mt-6 border-t border-sky-200 flex items-center justify-between font-bubble">
							<!-- Left: Pagination Dots & Active Elongated Pill -->
							<div class="flex items-center space-x-1.5 sm:space-x-2">
								{#each Array(3) as _, idx}
									{#if readingTab === idx + 1}
										<!-- Active Slide Pill -->
										<div class="w-7 sm:w-8 h-2.5 sm:h-3 rounded-full bg-sky-600 transition-all duration-300 shadow-2xs"></div>
									{:else}
										<!-- Inactive Slide Dot -->
										<button
											type="button"
											onclick={() => setReadingTab(idx + 1)}
											onmouseenter={() => sound.playCardHover()}
											aria-label={`Ke Halaman ${idx + 1}`}
											class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-300 hover:bg-slate-400 transition-all cursor-pointer"
										></button>
									{/if}
								{/each}
							</div>

							<!-- Right: Page Counter Text -->
							<div class="font-extrabold text-sky-950 tracking-wide text-xs sm:text-sm">
								Halaman {readingTab} / 3
							</div>
						</div>

					</div>

				{:else if activeSubMenu === 2}
					<!-- SUB-MENU 2: KONDISI GEOGRAFIS KECAMATAN JABUNG -->
					<div class="w-full space-y-4 animate-fade-in text-justify font-sans">
						<!-- Header & Back Button (Sticky Pinned Bar with Top Mask) -->
						<div class="sticky top-0 -mx-4 sm:-mx-6 md:-mx-8 mb-3 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-[#fffdf7] z-20 border-b-2 border-emerald-200 flex items-center justify-between font-bubble shadow-xs before:content-[''] before:absolute before:-top-20 before:left-0 before:right-0 before:h-20 before:bg-[#fffdf7]">
							<h2 class="text-xs sm:text-base font-extrabold text-emerald-900 flex items-center space-x-2 relative z-10">
								<span>🏔️</span>
								<span>Geografis Kecamatan Jabung</span>
							</h2>
							<button
								onclick={backToMenu}
								onmouseenter={() => sound.playCardHover()}
								class="relative z-10 px-3.5 py-1.5 bg-gradient-to-b from-[#00e5ff] via-[#00b0ff] to-[#0284c7] hover:brightness-110 text-white font-bold rounded-xl text-xs sm:text-sm transition-all border border-white flex items-center space-x-1 cursor-pointer font-bubble shadow-md transform active:scale-95 shrink-0"
								style="box-shadow: 0 3px 0 0 #01579b;"
							>
								<span>↩ Kembali</span>
							</button>
						</div>

						<div class="bg-emerald-50/90 p-4 rounded-2xl border-2 border-emerald-200 shadow-sm space-y-4">
							<!-- PARAGRAPH 1 -->
							<p class="text-xs sm:text-sm leading-relaxed text-gray-800">
								Kecamatan Jabung merupakan wilayah yang berada di Kabupaten Malang Jawa Timur, secara geografis Kecamatan Jabung terletak diantara <code class="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900 font-mono font-bold">112°43’78″ - 112°49’24″ BT</code> dan <code class="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-900 font-mono font-bold">7°54’48″ - 7°59’67″ LS</code>. Secara topografis, Kecamatan Jabung ini terletak di serangkaian lereng gunung Bromo dengan ketinggian sekitar <strong class="text-emerald-950 font-bold">548-768 Mdpl</strong>, sehingga Kecamatan Jabung ini memiliki keberagaman bentuk topografi yang beragam, mulai dari dataran rendah, bergelombang, perbukitan hingga pegunungan.
							</p>

							<!-- SIDE-BY-SIDE IMAGES: GAMBAR 2.1 & GAMBAR 2.2 -->
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto my-2">
								<!-- GAMBAR 2.1: BENTANG ALAM GOOGLE EARTH -->
								<div class="relative group bg-white p-2.5 rounded-xl border border-emerald-300 shadow-md flex flex-col items-center justify-between">
									<img
										src={bentangAlamJabung}
										alt="Gambar 2.1 Citra Satelit Wilayah Kecamatan Jabung di Lereng Gunung Bromo"
										class="w-full h-auto max-h-[180px] sm:max-h-[220px] object-contain rounded-lg mx-auto"
									/>
									<button
										type="button"
										onclick={() => (zoomedImage = { src: bentangAlamJabung, alt: 'Gambar 2.1 Citra Satelit Wilayah Kecamatan Jabung', title: 'Gambar 2.1: Citra Satelit Google Earth Wilayah Kecamatan Jabung (Lereng Gunung Bromo & Garis Merah Batas Wilayah)' })}
										class="absolute bottom-9 right-3 bg-emerald-900/90 hover:bg-emerald-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
									>
										<span>🔍 Perbesar</span>
									</button>
									<p class="text-center text-xs font-semibold text-emerald-950 pt-2 font-bubble">
										Gambar 2.1: Citra Google Earth Lereng Gunung Cemara (Bromo)
									</p>
								</div>

								<!-- GAMBAR 2.2: BENTUKAN PERMUKAAN TANAH -->
								<div class="relative group bg-white p-2.5 rounded-xl border border-emerald-300 shadow-md flex flex-col items-center justify-between">
									<img
										src={bentukPermukaanJabung}
										alt="Gambar 2.2 Bentukan Permukaan Tanah Kecamatan Jabung"
										class="w-full h-auto max-h-[180px] sm:max-h-[220px] object-contain rounded-lg mx-auto"
									/>
									<button
										type="button"
										onclick={() => (zoomedImage = { src: bentukPermukaanJabung, alt: 'Gambar 2.2 Bentukan Permukaan Tanah Kecamatan Jabung', title: 'Gambar 2.2 & 2.3: Peta Bentukan Permukaan Tanah & Topografi Wilayah Kecamatan Jabung' })}
										class="absolute bottom-9 right-3 bg-emerald-900/90 hover:bg-emerald-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
									>
										<span>🔍 Perbesar</span>
									</button>
									<p class="text-center text-xs font-semibold text-emerald-950 pt-2 font-bubble">
										Gambar 2.2: Peta Bentukan Permukaan Tanah Jabung
									</p>
								</div>
							</div>

							<!-- PARAGRAPH 2 -->
							<p class="text-xs sm:text-sm leading-relaxed text-gray-800">
								Dapat dilihat pada <strong class="text-emerald-950 font-bold">Gambar 2.1</strong> diatas yang diambil dari Google Earth menunjukkan pada garis merah yang merupakan wilayah Kecamatan Jabung yang berada di lereng gunung Cemara yang juga merupakan serangkaian gunung Bromo, pada <strong class="text-emerald-950 font-bold">Gambar 2.2</strong> menunjukkan bahwa Kecamatan Jabung memiliki bentukan permukaan tanah mulai dari dataran hingga bergelombang dan berbukit.
							</p>

							<!-- GAMBAR 2.3: TOPOGRAFI DUSUN KRAJAN DESA TAJI -->
							<div class="relative group my-3 max-w-2xl mx-auto bg-white p-2.5 rounded-xl border border-emerald-300 shadow-md flex flex-col items-center">
								<img
									src={topografiDusunKrajan2}
									alt="Gambar 2.3 Topografi Dusun Krajan, Desa Taji, Kecamatan Jabung"
									class="w-full h-auto max-h-[260px] sm:max-h-[320px] object-contain rounded-lg mx-auto"
								/>
								<button
									type="button"
									onclick={() => (zoomedImage = { src: topografiDusunKrajan2, alt: 'Gambar 2.3 Topografi Dusun Krajan, Desa Taji, Kecamatan Jabung', title: 'Gambar 2.3 Topografi Dusun Krajan, Desa Taji, Kecamatan Jabung' })}
									class="absolute bottom-9 right-4 bg-emerald-900/90 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
								>
									<span>🔍 Perbesar Gambar 2.3</span>
								</button>
								<p class="text-center text-xs sm:text-sm font-semibold text-emerald-950 pt-2 font-bubble italic">
									Gambar 2.3 Topografi Dusun Krajan, Desa Taji, Kecamatan Jabung
								</p>
							</div>

							<!-- PARAGRAPH 3 -->
							<p class="text-xs sm:text-sm leading-relaxed text-gray-800">
								Dapat dilihat pada <strong class="text-emerald-950 font-bold">Gambar 2.3</strong> pada wilayah Kecamatan Jabung memiliki bentukan topografi mulai dari dataran hingga perbukitan dan pegunungan, pada beberapa desa di Kecamatan Jabung termasuk <strong class="text-emerald-950 font-bold">Desa Taji</strong> dan <strong class="text-emerald-950 font-bold">Desa Pandansari Lor</strong> memiliki bentuk topografi berupa perbukitan dan pegunungan, dengan kemiringan lereng yang curam. Selain itu dari tutupan lahan yang ada di wilayah Kecamatan Jabung terutama pada Desa Taji dan Pandansari Lor sebagian didominasi oleh lahan pertanian dan perkebunan warga, dengan jenis tanaman berupa singkong, sayuran dan buah-buahan.
							</p>

							<!-- PARAGRAPH 4 -->
							<p class="text-xs sm:text-sm leading-relaxed text-gray-800">
								Meskipun wilayah Kecamatan Jabung sebagian didominasi oleh tutupan lahan berupa lahan pertanian dan perkebunan, dilihat pada <strong class="text-emerald-950 font-bold">Gambar 2.4</strong> yang memiliki garis merah, Kecamatan Jabung juga memiliki batas vegetasi berupa vegetasi hutan yang berada pada daerah puncak bukit.
							</p>

							<!-- SUMMARY BOX: FAKTOR KERAWANAN LONGSOR -->
							<div class="p-3.5 bg-white rounded-xl border border-emerald-300 shadow-xs space-y-1.5 text-xs sm:text-sm leading-relaxed text-gray-800">
								<h3 class="font-extrabold text-emerald-950 font-bubble flex items-center space-x-2 border-b border-emerald-100 pb-1">
									<span>⚠️</span>
									<span>Faktor Penyebab Kerawanan Longsor:</span>
								</h3>
								<p>
									Kerawanan kebencanaan longsor terjadi dikarenakan oleh beberapa faktor, diantaranya karena faktor kemiringan lereng yang curam, intensitas hujan yang tinggi dan jenis tanah, serta hasil aktivitas manusia berupa penggunaan lahan.
								</p>
							</div>
						</div>

						<!-- SLIDE FOOTER INDICATOR (Sub-Menu 2: Geografis Kecamatan Jabung) -->
						<div class="w-full pt-4 mt-6 border-t border-emerald-200 flex items-center justify-between font-bubble">
							<!-- Left: Active Slide Pill -->
							<div class="flex items-center space-x-1.5 sm:space-x-2">
								<div class="w-7 sm:w-8 h-2.5 sm:h-3 rounded-full bg-emerald-600 transition-all duration-300 shadow-2xs"></div>
							</div>

							<!-- Right: Page Counter Text -->
							<div class="font-extrabold text-emerald-950 tracking-wide text-xs sm:text-sm">
								Halaman 1 / 1
							</div>
						</div>

					</div>

				{:else if activeSubMenu === 3}
					<!-- SUB-MENU 3: BENCANA LONGSOR DI KECAMATAN JABUNG -->
					<div class="w-full space-y-4 animate-fade-in text-justify font-sans">
						
						<!-- Header & Back Button (Sticky Pinned Bar with Top Mask) -->
						<div class="sticky top-0 -mx-4 sm:-mx-6 md:-mx-8 mb-3 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-[#fffdf7] z-20 border-b-2 border-rose-200 flex items-center justify-between font-bubble shadow-xs before:content-[''] before:absolute before:-top-20 before:left-0 before:right-0 before:h-20 before:bg-[#fffdf7]">
							<h2 class="text-xs sm:text-base font-extrabold text-rose-900 flex items-center space-x-2 relative z-10">
								<span>⚠️</span>
								<span>Bencana Longsor di Kecamatan Jabung</span>
							</h2>
							<button
								onclick={backToMenu}
								onmouseenter={() => sound.playCardHover()}
								class="relative z-10 px-3.5 py-1.5 bg-gradient-to-b from-[#00e5ff] via-[#00b0ff] to-[#0284c7] hover:brightness-110 text-white font-bold rounded-xl text-xs sm:text-sm transition-all border border-white flex items-center space-x-1 cursor-pointer font-bubble shadow-md transform active:scale-95 shrink-0"
								style="box-shadow: 0 3px 0 0 #01579b;"
							>
								<span>↩ Kembali</span>
							</button>
						</div>

						<!-- TAB 1 CONTENT: KEJADIAN & TIPE LONGSOR -->
						{#if readingTab === 1}
							<div class="bg-rose-50/80 p-4 rounded-2xl border-2 border-rose-200 shadow-sm space-y-4 animate-fade-in">
								<!-- SECTION 1: PERSEBARAN 13 TITIK LONGSOR -->
								<div class="space-y-3">
									<p class="text-xs sm:text-sm leading-relaxed text-gray-800">
										Kecamatan Jabung merupakan wilayah yang memiliki topografi yang bervariasi, dengan kondisi wilayah yang berada pada lereng serangkaian gunung Bromo. Sehingga Kecamatan Jabung memiliki risiko kebencanaan, salah satunya yaitu bencana tanah longsor. Pada tahun 2024 Kecamatan Jabung telah terjadi kebencanaan longsor di <strong class="text-rose-900 font-bold">13 titik</strong>, dimana 13 titik tersebut terbagi di dua wilayah, yaitu pada <strong class="text-rose-900 font-bold">Desa Pandansari Lor</strong> dan <strong class="text-rose-900 font-bold">Desa Taji</strong>.
									</p>

									<!-- GAMBAR 3.1: PETA PERSEBARAN LONGSOR KECAMATAN JABUNG -->
									<div class="relative group my-3 max-w-2xl mx-auto bg-white p-2 rounded-xl border border-rose-300 shadow-md">
										<img
											src={petaPersebaranLongsor}
											alt="Gambar 3.1 Peta Persebaran Longsor Kecamatan Jabung"
											class="w-full h-auto max-h-[220px] sm:max-h-[280px] object-contain rounded-lg mx-auto"
										/>
										<button
											type="button"
											onclick={() => (zoomedImage = { src: petaPersebaranLongsor, alt: 'Peta Persebaran Longsor Kecamatan Jabung', title: 'Gambar 3.1 Peta Persebaran Longsor Kecamatan Jabung (13 Titik Longsor)' })}
											class="absolute bottom-4 right-4 bg-rose-900/90 hover:bg-rose-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
										>
											<span>🔍 Perbesar Gambar 3.1</span>
										</button>
										<p class="text-center text-xs font-semibold text-rose-900 pt-2 font-bubble">
											Gambar 3.1: Peta Persebaran Longsor Kecamatan Jabung
										</p>
									</div>

									<p class="text-xs sm:text-sm leading-relaxed text-gray-800">
										Dapat dilihat pada <strong class="text-rose-950 font-bold">Gambar 3.1</strong> yang menunjukkan bahwa kebencanaan longsor tersebar di 13 titik yang terkonsentrasi di Desa Taji, wilayah yang terletak di daerah tertinggi Kecamatan Jabung. Desa Pandansari Lor dan Desa Taji disimbolkan warna hijau hingga merah, menunjukkan kedua desa tersebut memiliki ketinggian <code class="bg-rose-100 px-1.5 py-0.5 rounded text-rose-900 font-mono font-bold">494 Mdpl</code> hingga <code class="bg-rose-100 px-1.5 py-0.5 rounded text-rose-900 font-mono font-bold">2.263 Mdpl</code>, dengan batas permukiman pada ketinggian <code class="bg-rose-100 px-1.5 py-0.5 rounded text-rose-900 font-mono font-bold">1.200 Mdpl</code>.
									</p>

									<div class="p-3 bg-white rounded-xl border border-rose-200 shadow-xs flex items-start space-x-2.5">
										<span class="text-rose-600 font-bold text-base shrink-0">📌</span>
										<div class="flex-1 text-xs sm:text-sm text-gray-800">
											Pada 13 titik longsoran yang ada di Kecamatan Jabung, seluruhnya memiliki <strong class="text-rose-900 font-bold">tipe longsoran translasional</strong>.
										</div>
									</div>
								</div>

								<!-- SECTION 2: TIPE LONGSORAN TRANSLASIONAL (GAMBAR 3.2 & DEFINISI) -->
								<div class="space-y-3 pt-2">
									<h3 class="text-base sm:text-lg font-extrabold text-amber-950 border-b border-amber-300 pb-1.5 font-bubble flex items-center space-x-2">
										<span>⛰️</span>
										<span>Tipe Longsoran Translasional</span>
									</h3>

									<div class="space-y-3 text-xs sm:text-sm leading-relaxed text-gray-800">
										<!-- GAMBAR 3.2 DIAGRAM -->
										<div class="relative group my-3 max-w-xl mx-auto bg-white p-2.5 rounded-xl border border-amber-300 shadow-md">
											<img
												src={tipeLongsoranTranslasi}
												alt="Gambar 3.2 Tipe Longsoran Translasional"
												class="w-full h-auto max-h-[220px] sm:max-h-[280px] object-contain rounded-lg mx-auto"
											/>
											<button
												type="button"
												onclick={() => (zoomedImage = { src: tipeLongsoranTranslasi, alt: 'Gambar 3.2 Tipe Longsoran Translasional', title: 'Gambar 3.2 Tipe Longsoran Translasional' })}
												class="absolute bottom-4 right-4 bg-amber-900/90 hover:bg-amber-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
											>
												<span>🔍 Perbesar Gambar 3.2</span>
											</button>
											<p class="text-center text-xs font-semibold text-amber-900 pt-2 font-bubble">
												Gambar 3.2: Tipe Longsoran Translasional
											</p>
										</div>

										<p>
											Tipe longsoran translasional (<em>translational slide</em>) merupakan longsoran dengan bergeraknya massa tanah dan batuan pada bidang gelincir berbentuk rata atau bergelombang. Di Indonesia longsoran ini bisa terjadi di lereng yang curam maupun lereng yang cenderung agak landai, dan sering memakan korban jiwa serta kerugian materi maupun non-materi.
										</p>

										<!-- SIDE-BY-SIDE FIELD PHOTOS (GAMBAR 3.3 & GAMBAR 3.4) -->
										<div class="space-y-2 pt-1">
											<h4 class="font-bold text-amber-950 text-xs sm:text-sm flex items-center space-x-1.5 font-bubble">
												<span>📷</span>
												<span>Dokumentasi Lapangan Longsoran Translasional Jabung:</span>
											</h4>
											<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
												<div class="relative group bg-white p-2 rounded-xl border border-amber-300 shadow-sm flex flex-col items-center">
													<img
														src={longsorJabung1}
														alt="Gambar 3.3 Dokumentasi Longsoran Jabung 1"
														class="w-full h-36 sm:h-44 object-cover rounded-lg"
													/>
													<button
														type="button"
														onclick={() => (zoomedImage = { src: longsorJabung1, alt: 'Gambar 3.3 Dokumentasi Lapangan Longsoran Translasional Jabung 1', title: 'Gambar 3.3: Dokumentasi Lapangan Longsoran Translasional di Jabung (Bidang Gelincir Rata)' })}
														class="absolute bottom-9 right-3 bg-amber-900/90 hover:bg-amber-800 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
													>
														<span>🔍 Perbesar</span>
													</button>
													<p class="text-center text-xs font-semibold text-amber-900 pt-2 font-bubble">
														Gambar 3.3: Dokumentasi Lapangan Longsor 1
													</p>
												</div>

												<div class="relative group bg-white p-2 rounded-xl border border-amber-300 shadow-sm flex flex-col items-center">
													<img
														src={longsorJabung2}
														alt="Gambar 3.4 Dokumentasi Longsoran Jabung 2"
														class="w-full h-36 sm:h-44 object-cover rounded-lg"
													/>
													<button
														type="button"
														onclick={() => (zoomedImage = { src: longsorJabung2, alt: 'Gambar 3.4 Dokumentasi Lapangan Longsoran Translasional Jabung 2', title: 'Gambar 3.4: Dokumentasi Lapangan Longsoran Translasional di Jabung (Arah Panah Putih)' })}
														class="absolute bottom-9 right-3 bg-amber-900/90 hover:bg-amber-800 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
													>
														<span>🔍 Perbesar</span>
													</button>
													<p class="text-center text-xs font-semibold text-amber-900 pt-2 font-bubble">
														Gambar 3.4: Dokumentasi Lapangan Longsor 2
													</p>
												</div>
											</div>

											<p class="text-xs text-amber-950 font-medium bg-amber-100/70 p-2.5 rounded-lg border border-amber-300 leading-relaxed">
												Dari gambar diatas terlihat bahwa longsoran dengan tipe translasional, dengan area yang di tandai dengan garis panah warna putih yang merupakan arah longsoran tanah dengan memiliki permukaan bidang gelincir yang bergelombang dan rata.
											</p>
										</div>

										<!-- GAMBAR 3.5: PETA 3D INFOGRAFIK TITIK LONGSOR DUSUN KRAJAN DESA TAJI 1 -->
										<div class="relative group my-3 max-w-2xl mx-auto bg-white p-2.5 rounded-xl border border-amber-300 shadow-md">
											<img
												src={petaLongsorTranslasional}
												alt="Gambar 3.5 Peta 3D Titik Longsor Dusun Krajan Desa Taji"
												class="w-full h-auto max-h-[240px] sm:max-h-[300px] object-contain rounded-lg mx-auto"
											/>
											<button
												type="button"
												onclick={() => (zoomedImage = { src: petaLongsorTranslasional, alt: 'Gambar 3.5 Peta 3D Titik Longsor Dusun Krajan Desa Taji', title: 'Gambar 3.5: Peta & Infografis 3D Titik Longsor Dusun Krajan, Desa Taji (Kecamatan Jabung)' })}
												class="absolute bottom-4 right-4 bg-amber-900/90 hover:bg-amber-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
											>
												<span>🔍 Perbesar Peta 3D</span>
											</button>
											<p class="text-center text-xs font-semibold text-amber-900 pt-2 font-bubble">
												Gambar 3.5: Peta & Infografis 3D Titik Longsor Dusun Krajan, Desa Taji (Kecamatan Jabung)
											</p>
										</div>

										<!-- GAMBAR 3.6: PETA 3D INFOGRAFIK TITIK LONGSOR DUSUN KRAJAN DESA TAJI 2 -->
										<div class="relative group my-3 max-w-2xl mx-auto bg-white p-2.5 rounded-xl border border-amber-300 shadow-md">
											<img
												src={petaLongsorTranslasional2}
												alt="Gambar 3.6 Peta 3D Infografis Titik Longsor Dusun Krajan Desa Taji 2"
												class="w-full h-auto max-h-[240px] sm:max-h-[300px] object-contain rounded-lg mx-auto"
											/>
											<button
												type="button"
												onclick={() => (zoomedImage = { src: petaLongsorTranslasional2, alt: 'Gambar 3.6 Peta 3D Infografis Titik Longsor Dusun Krajan Desa Taji 2', title: 'Gambar 3.6: Peta & Infografis 3D Titik Longsor Dusun Krajan, Desa Taji (Detail Lereng)' })}
												class="absolute bottom-4 right-4 bg-amber-900/90 hover:bg-amber-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
											>
												<span>🔍 Perbesar Peta 3D</span>
											</button>
											<p class="text-center text-xs font-semibold text-amber-900 pt-2 font-bubble">
												Gambar 3.6: Peta & Infografis 3D Titik Longsor Dusun Krajan, Desa Taji (Detail Lereng & Permukiman)
											</p>
										</div>

										<p>
											Longsoran yang terjadi di Kecamatan Jabung banyak terjadi di area lahan yang mengalami pemotongan tanah akibat pembangunan jalan, didukung oleh tutupan lahan di atasnya berupa lahan pertanian dan perkebunan. Pemotongan lahan ini dapat merubah struktur tanah dan kemiringan lereng menjadi lebih curam, sehingga tanah mudah longsor dan kestabilan tanah menjadi terganggu.
										</p>
									</div>
								</div>

								<!-- SECTION 3: TINGKAT KERAWANAN -->
								<div class="space-y-3 pt-2">
									<h3 class="text-base sm:text-lg font-extrabold text-emerald-950 border-b border-emerald-300 pb-1.5 font-bubble flex items-center space-x-2">
										<span>🛡️</span>
										<span>Tingkat Kerawanan</span>
									</h3>

									<div class="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-xs space-y-2 text-xs sm:text-sm leading-relaxed text-gray-800">
										<p>
											Kecamatan Jabung yang terletak pada area lereng bukit dan serangkaian Gunung Bromo memiliki tingkat kerawanan longsor mulai dari rendah hingga tinggi, dipengaruhi oleh topografi wilayahnya. Peta kerawanan menunjukkan 5 simbol warna, mulai dari hijau (kerawanan rendah) hingga merah (kerawanan tinggi). Desa Taji, yang bersimbol oranye dan merah, menandakan kerawanan longsor tinggi hingga sangat tinggi.
										</p>
									</div>
								</div>

								<!-- VIDEO ILUSTRASI LONGSOR BUTTON (Standardized 3D Pill Button) -->
								<div class="my-4 flex flex-col items-center justify-center space-y-2 font-bubble">
									<button
										type="button"
										onclick={openVideo}
										onmouseenter={() => sound.playCardHover()}
										class="group relative px-6 py-3.5 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 border-3 border-white shadow-xl rounded-2xl text-white font-extrabold text-xs sm:text-base flex items-center space-x-3.5 transform active:scale-95 transition-all hover:scale-105 cursor-pointer"
										style="box-shadow: 0 5px 0 0 #be123c, 0 10px 25px rgba(0, 0, 0, 0.25);"
										aria-label="Play Video Ilustrasi Longsor"
									>
										<div class="w-10 h-10 rounded-xl bg-white border-2 border-rose-300 p-1 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
											<img src={videoIcon} alt="Video Icon" class="w-8 h-8 object-contain" />
										</div>
										<span class="tracking-wide text-shadow">Video Ilustrasi Bencana Tanah Longsor</span>
									</button>
									<span class="text-xs font-bold text-rose-950 italic">
										Klik untuk menonton video ilustrasi bencana tanah longsor
									</span>
								</div>
							</div>

						<!-- TAB 2 CONTENT: PARAMETER BENCANA TANAH LONGSOR -->
						{:else if readingTab === 2}
							<div class="bg-rose-50/80 p-4 rounded-2xl border-2 border-rose-200 shadow-sm space-y-4 animate-fade-in">
								<!-- INTRO TEXT -->
								<p class="text-xs sm:text-sm leading-relaxed text-gray-800">
									Dapat dilihat pada tabel dibawah ini, yang merupakan parameter atau faktor pendukung yang menyebabkan terjadinya bencana tanah longsor yang ada di Kecamatan Jabung.
								</p>

								<!-- PARAMETER DISPLAY (Dual Responsive: Mobile Cards & Desktop Table) -->
								
								<!-- MOBILE CARD VIEW (< sm) -->
								<div class="block sm:hidden space-y-3 font-sans">
									<!-- ITEM 1: CURAH HUJAN -->
									<div class="p-3 bg-white rounded-2xl border-2 border-[#d7a15c] shadow-sm space-y-2">
										<h4 class="text-sm font-extrabold text-amber-950 font-bubble text-center bg-[#f5d5a4] py-1.5 px-3 rounded-xl border border-[#d7a15c]">
											Curah Hujan
										</h4>
										<div class="relative group max-w-[220px] mx-auto bg-white p-1 rounded-xl border border-amber-200 shadow-xs my-2">
											<img
												src={imgCurahHujan}
												alt="Peta Curah Hujan Kecamatan Jabung"
												class="w-full h-auto max-h-40 object-contain rounded-lg mx-auto"
											/>
											<button
												type="button"
												onclick={() => (zoomedImage = { src: imgCurahHujan, alt: 'Peta Curah Hujan Kecamatan Jabung', title: 'Peta Parameter Curah Hujan Kecamatan Jabung' })}
												class="absolute bottom-2 right-2 bg-amber-900/90 hover:bg-amber-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
											>
												<span>🔍 Perbesar</span>
											</button>
										</div>
										<p class="text-xs leading-relaxed text-gray-800 bg-[#fffbf5] p-2.5 rounded-xl border border-amber-100">
											Intensitas curah hujan Kecamatan Jabung pertahun yaitu 1500-2500 mm/tahun, curah hujan tertinggi yaitu 2000-2500 mm/tahun terjadi di daerah dataran tinggi, yaitu di Desa Ngadirejo, Taji, Pandansari lor, Gading Kembar, Argosari, Slamparejo. Curah hujan ini dibedakan berdasarkan warna sesuai dengan intensitasnya.
										</p>
									</div>

									<!-- ITEM 2: KEMIRINGAN LERENG -->
									<div class="p-3 bg-white rounded-2xl border-2 border-[#d7a15c] shadow-sm space-y-2">
										<h4 class="text-sm font-extrabold text-amber-950 font-bubble text-center bg-[#f5d5a4] py-1.5 px-3 rounded-xl border border-[#d7a15c]">
											Kemiringan Lereng
										</h4>
										<div class="relative group max-w-[220px] mx-auto bg-white p-1 rounded-xl border border-amber-200 shadow-xs my-2">
											<img
												src={imgKemiringanLereng}
												alt="Peta Kemiringan Lereng Kecamatan Jabung"
												class="w-full h-auto max-h-40 object-contain rounded-lg mx-auto"
											/>
											<button
												type="button"
												onclick={() => (zoomedImage = { src: imgKemiringanLereng, alt: 'Peta Kemiringan Lereng Kecamatan Jabung', title: 'Peta Parameter Kemiringan Lereng Kecamatan Jabung' })}
												class="absolute bottom-2 right-2 bg-amber-900/90 hover:bg-amber-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
											>
												<span>🔍 Perbesar</span>
											</button>
										</div>
										<p class="text-xs leading-relaxed text-gray-800 bg-[#fffbf5] p-2.5 rounded-xl border border-amber-100">
											Kemiringan lereng di Kecamatan Jabung ini sangat bervariasi, pada legenda peta disamping, kemiringan Kec. Jabung yaitu mulai dari kurang 8% hingga lebih dari 45%. Kemiringan lereng paling curam di simbolkan dengan warna coklat tua yang berada di wilayah Desa Taji dan Ngadirejo.
										</p>
									</div>

									<!-- ITEM 3: JENIS BATUAN -->
									<div class="p-3 bg-white rounded-2xl border-2 border-[#d7a15c] shadow-sm space-y-2">
										<h4 class="text-sm font-extrabold text-amber-950 font-bubble text-center bg-[#f5d5a4] py-1.5 px-3 rounded-xl border border-[#d7a15c]">
											Jenis Batuan
										</h4>
										<div class="relative group max-w-[220px] mx-auto bg-white p-1 rounded-xl border border-amber-200 shadow-xs my-2">
											<img
												src={imgJenisBatuan}
												alt="Peta Jenis Batuan Kecamatan Jabung"
												class="w-full h-auto max-h-40 object-contain rounded-lg mx-auto"
											/>
											<button
												type="button"
												onclick={() => (zoomedImage = { src: imgJenisBatuan, alt: 'Peta Jenis Batuan Kecamatan Jabung', title: 'Peta Parameter Jenis Batuan Kecamatan Jabung' })}
												class="absolute bottom-2 right-2 bg-amber-900/90 hover:bg-amber-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
											>
												<span>🔍 Perbesar</span>
											</button>
										</div>
										<p class="text-xs leading-relaxed text-gray-800 bg-[#fffbf5] p-2.5 rounded-xl border border-amber-100">
											Jenis batuan yang ada di Kec. Jabung ini merupakan jenis batuan gunungapi tengger, batuan gunungapi kuarter bawah, dan Tuf malang. Batuan ini mempengaruhi tanah longsor dikarenakan batuan ini mudah mengalami pelapukan, dan umumnya rentan terhadap tanah longsor.
										</p>
									</div>

									<!-- ITEM 4: JENIS TANAH -->
									<div class="p-3 bg-white rounded-2xl border-2 border-[#d7a15c] shadow-sm space-y-2">
										<h4 class="text-sm font-extrabold text-amber-950 font-bubble text-center bg-[#f5d5a4] py-1.5 px-3 rounded-xl border border-[#d7a15c]">
											Jenis Tanah
										</h4>
										<div class="relative group max-w-[220px] mx-auto bg-white p-1 rounded-xl border border-amber-200 shadow-xs my-2">
											<img
												src={imgJenisTanah}
												alt="Peta Jenis Tanah Kecamatan Jabung"
												class="w-full h-auto max-h-40 object-contain rounded-lg mx-auto"
											/>
											<button
												type="button"
												onclick={() => (zoomedImage = { src: imgJenisTanah, alt: 'Peta Jenis Tanah Kecamatan Jabung', title: 'Peta Parameter Jenis Tanah Kecamatan Jabung' })}
												class="absolute bottom-2 right-2 bg-amber-900/90 hover:bg-amber-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
											>
												<span>🔍 Perbesar</span>
											</button>
										</div>
										<p class="text-xs leading-relaxed text-gray-800 bg-[#fffbf5] p-2.5 rounded-xl border border-amber-100">
											Jenis tanah yang ada di Kecamatan Jabung ini yaitu jenis tanah Andosol yang terbagi menjadi 3 jenis yaitu andosol molik, okrik dan vitrik. Dimana jenis tanah andosol ini merupakan jenis tanah yang berasal dari material erupsi gunung berapi, ciri dari tanah ini yaitu berwarna coklat tua, memiliki kadar organik tinggi, berstruktur remah dan licin. Jenis tanah ini memiliki kontribusi yang sangat besar terhadap longsor.
										</p>
									</div>

									<!-- ITEM 5: PENGGUNAAN LAHAN -->
									<div class="p-3 bg-white rounded-2xl border-2 border-[#d7a15c] shadow-sm space-y-2">
										<h4 class="text-sm font-extrabold text-amber-950 font-bubble text-center bg-[#f5d5a4] py-1.5 px-3 rounded-xl border border-[#d7a15c]">
											Penggunaan Lahan
										</h4>
										<div class="relative group max-w-[220px] mx-auto bg-white p-1 rounded-xl border border-amber-200 shadow-xs my-2">
											<img
												src={imgPenggunaanLahan}
												alt="Peta Penggunaan Lahan Kecamatan Jabung"
												class="w-full h-auto max-h-40 object-contain rounded-lg mx-auto"
											/>
											<button
												type="button"
												onclick={() => (zoomedImage = { src: imgPenggunaanLahan, alt: 'Peta Penggunaan Lahan Kecamatan Jabung', title: 'Peta Parameter Penggunaan Lahan Kecamatan Jabung' })}
												class="absolute bottom-2 right-2 bg-amber-900/90 hover:bg-amber-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
											>
												<span>🔍 Perbesar</span>
											</button>
										</div>
										<p class="text-xs leading-relaxed text-gray-800 bg-[#fffbf5] p-2.5 rounded-xl border border-amber-100">
											Penggunaan lahan di Kecamatan Jabung ini sangat bevariasi, pada daerah rawan longsor, di Desa Taji dan Pandansari Lor. Penggunaan lahan di dominasi oleh lahan pertanian dan perkebunan dan sebagian pada simbol warna biru merupakan lahan yang masih terjaga, yaitu hutan.
										</p>
									</div>
								</div>

								<!-- DESKTOP TABLE VIEW (>= sm) -->
								<div class="hidden sm:block w-full overflow-x-auto rounded-2xl border-2 border-[#d7a15c] shadow-md bg-white">
									<table class="w-full text-xs sm:text-sm text-left text-gray-800 border-collapse min-w-[540px]">
										<thead>
											<tr class="bg-[#f5d5a4] text-amber-950 font-extrabold text-center font-bubble border-b-2 border-[#d7a15c]">
												<th class="py-3 px-3 w-1/5 border-r border-[#d7a15c]">Keterangan</th>
												<th class="py-3 px-3 w-2/5 border-r border-[#d7a15c]">Gambar</th>
												<th class="py-3 px-3 w-2/5">Penjelasan</th>
											</tr>
										</thead>
										<tbody class="divide-y divide-amber-200/70 font-sans">
											<!-- ROW 1: CURAH HUJAN -->
											<tr class="bg-[#fffbf5] hover:bg-amber-50/50 transition-colors">
												<td class="p-3 font-extrabold text-amber-950 text-center border-r border-amber-200 font-bubble align-middle">
													Curah Hujan
												</td>
												<td class="p-2 border-r border-amber-200 text-center align-middle">
													<div class="relative group max-w-[200px] mx-auto bg-white p-1 rounded-xl border border-amber-200 shadow-xs">
														<img
															src={imgCurahHujan}
															alt="Peta Curah Hujan Kecamatan Jabung"
															class="w-full h-auto max-h-36 sm:max-h-44 object-contain rounded-lg mx-auto"
														/>
														<button
															type="button"
															onclick={() => (zoomedImage = { src: imgCurahHujan, alt: 'Peta Curah Hujan Kecamatan Jabung', title: 'Peta Parameter Curah Hujan Kecamatan Jabung' })}
															class="absolute bottom-2 right-2 bg-amber-900/90 hover:bg-amber-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
														>
															<span>🔍 Perbesar</span>
														</button>
													</div>
												</td>
												<td class="p-3 text-xs leading-relaxed align-middle">
													Intensitas curah hujan Kecamatan Jabung pertahun yaitu 1500-2500 mm/tahun, curah hujan tertinggi yaitu 2000-2500 mm/tahun terjadi di daerah dataran tinggi, yaitu di Desa Ngadirejo, Taji, Pandansari lor, Gading Kembar, Argosari, Slamparejo. Curah hujan ini dibedakan berdasarkan warna sesuai dengan intensitasnya.
												</td>
											</tr>

											<!-- ROW 2: KEMIRINGAN LERENG -->
											<tr class="bg-white hover:bg-amber-50/50 transition-colors">
												<td class="p-3 font-extrabold text-amber-950 text-center border-r border-amber-200 font-bubble align-middle">
													Kemiringan Lereng
												</td>
												<td class="p-2 border-r border-amber-200 text-center align-middle">
													<div class="relative group max-w-[200px] mx-auto bg-white p-1 rounded-xl border border-amber-200 shadow-xs">
														<img
															src={imgKemiringanLereng}
															alt="Peta Kemiringan Lereng Kecamatan Jabung"
															class="w-full h-auto max-h-36 sm:max-h-44 object-contain rounded-lg mx-auto"
														/>
														<button
															type="button"
															onclick={() => (zoomedImage = { src: imgKemiringanLereng, alt: 'Peta Kemiringan Lereng Kecamatan Jabung', title: 'Peta Parameter Kemiringan Lereng Kecamatan Jabung' })}
															class="absolute bottom-2 right-2 bg-amber-900/90 hover:bg-amber-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
														>
															<span>🔍 Perbesar</span>
														</button>
													</div>
												</td>
												<td class="p-3 text-xs leading-relaxed align-middle">
													Kemiringan lereng di Kecamatan Jabung ini sangat bervariasi, pada legenda peta disamping, kemiringan Kec. Jabung yaitu mulai dari kurang 8% hingga lebih dari 45%. Kemiringan lereng paling curam di simbolkan dengan warna coklat tua yang berada di wilayah Desa Taji dan Ngadirejo.
												</td>
											</tr>

											<!-- ROW 3: JENIS BATUAN -->
											<tr class="bg-[#fffbf5] hover:bg-amber-50/50 transition-colors">
												<td class="p-3 font-extrabold text-amber-950 text-center border-r border-amber-200 font-bubble align-middle">
													Jenis Batuan
												</td>
												<td class="p-2 border-r border-amber-200 text-center align-middle">
													<div class="relative group max-w-[200px] mx-auto bg-white p-1 rounded-xl border border-amber-200 shadow-xs">
														<img
															src={imgJenisBatuan}
															alt="Peta Jenis Batuan Kecamatan Jabung"
															class="w-full h-auto max-h-36 sm:max-h-44 object-contain rounded-lg mx-auto"
														/>
														<button
															type="button"
															onclick={() => (zoomedImage = { src: imgJenisBatuan, alt: 'Peta Jenis Batuan Kecamatan Jabung', title: 'Peta Parameter Jenis Batuan Kecamatan Jabung' })}
															class="absolute bottom-2 right-2 bg-amber-900/90 hover:bg-amber-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
														>
															<span>🔍 Perbesar</span>
														</button>
													</div>
												</td>
												<td class="p-3 text-xs leading-relaxed align-middle">
													Jenis batuan yang ada di Kec. Jabung ini merupakan jenis batuan gunungapi tengger, batuan gunungapi kuarter bawah, dan Tuf malang. Batuan ini mempengaruhi tanah longsor dikarenakan batuan ini mudah mengalami pelapukan, dan umumnya rentan terhadap tanah longsor.
												</td>
											</tr>

											<!-- ROW 4: JENIS TANAH -->
											<tr class="bg-white hover:bg-amber-50/50 transition-colors">
												<td class="p-3 font-extrabold text-amber-950 text-center border-r border-amber-200 font-bubble align-middle">
													Jenis Tanah
												</td>
												<td class="p-2 border-r border-amber-200 text-center align-middle">
													<div class="relative group max-w-[200px] mx-auto bg-white p-1 rounded-xl border border-amber-200 shadow-xs">
														<img
															src={imgJenisTanah}
															alt="Peta Jenis Tanah Kecamatan Jabung"
															class="w-full h-auto max-h-36 sm:max-h-44 object-contain rounded-lg mx-auto"
														/>
														<button
															type="button"
															onclick={() => (zoomedImage = { src: imgJenisTanah, alt: 'Peta Jenis Tanah Kecamatan Jabung', title: 'Peta Parameter Jenis Tanah Kecamatan Jabung' })}
															class="absolute bottom-2 right-2 bg-amber-900/90 hover:bg-amber-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
														>
															<span>🔍 Perbesar</span>
														</button>
													</div>
												</td>
												<td class="p-3 text-xs leading-relaxed align-middle">
													Jenis tanah yang ada di Kecamatan Jabung ini yaitu jenis tanah Andosol yang terbagi menjadi 3 jenis yaitu andosol molik, okrik dan vitrik. Dimana jenis tanah andosol ini merupakan jenis tanah yang berasal dari material erupsi gunung berapi, ciri dari tanah ini yaitu berwarna coklat tua, memiliki kadar organik tinggi, berstruktur remah dan licin. Jenis tanah ini memiliki kontribusi yang sangat besar terhadap longsor.
												</td>
											</tr>

											<!-- ROW 5: PENGGUNAAN LAHAN -->
											<tr class="bg-[#fffbf5] hover:bg-amber-50/50 transition-colors">
												<td class="p-3 font-extrabold text-amber-950 text-center border-r border-amber-200 font-bubble align-middle">
													Penggunaan Lahan
												</td>
												<td class="p-2 border-r border-amber-200 text-center align-middle">
													<div class="relative group max-w-[200px] mx-auto bg-white p-1 rounded-xl border border-amber-200 shadow-xs">
														<img
															src={imgPenggunaanLahan}
															alt="Peta Penggunaan Lahan Kecamatan Jabung"
															class="w-full h-auto max-h-36 sm:max-h-44 object-contain rounded-lg mx-auto"
														/>
														<button
															type="button"
															onclick={() => (zoomedImage = { src: imgPenggunaanLahan, alt: 'Peta Penggunaan Lahan Kecamatan Jabung', title: 'Peta Parameter Penggunaan Lahan Kecamatan Jabung' })}
															class="absolute bottom-2 right-2 bg-amber-900/90 hover:bg-amber-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
														>
															<span>🔍 Perbesar</span>
														</button>
													</div>
												</td>
												<td class="p-3 text-xs leading-relaxed align-middle">
													Penggunaan lahan di Kecamatan Jabung ini sangat bevariasi, pada daerah rawan longsor, di Desa Taji dan Pandansari Lor. Penggunaan lahan di dominasi oleh lahan pertanian dan perkebunan dan sebagian pada simbol warna biru merupakan lahan yang masih terjaga, yaitu hutan.
												</td>
											</tr>
										</tbody>
									</table>
								</div>

								<!-- SUMMARY BOX 1 -->
								<div class="p-4 bg-amber-50/90 rounded-2xl border-2 border-amber-200 shadow-xs text-xs sm:text-sm leading-relaxed text-amber-950 font-medium space-y-2">
									<p>
										Parameter diatas merupakan faktor-faktor pendukung dari adanya fenomena tanah longsor. Jadi tanah longsor bisa terjadi karena adanya curah hujan, kemiringan lereng, penggunaan lahan, jenis tanah, dan jenis batuan. Sehingga kecamatan Jabung ini memiliki variasi kerentanan longsor yang tinggi.
									</p>
								</div>

								<!-- GAMBAR TOPOGRAFI DUSUN KRAJAN DESA TAJI (1 & 2) -->
								<div class="space-y-4 pt-1">
									<!-- IMAGE 1 -->
									<div class="relative group max-w-2xl mx-auto bg-white p-2.5 rounded-xl border border-rose-300 shadow-md">
										<img
											src={topografiDusunKrajan1}
											alt="Gambar Topografi Dusun Krajan, Desa Taji"
											class="w-full h-auto max-h-[260px] sm:max-h-[320px] object-contain rounded-lg mx-auto"
										/>
										<button
											type="button"
											onclick={() => (zoomedImage = { src: topografiDusunKrajan1, alt: 'Peta Topografi Dusun Krajan, Desa Taji', title: 'Gambar Topografi Dusun Krajan, Desa Taji (Kondisi Relief Wilayah & Peta 3D Topografi)' })}
											class="absolute bottom-4 right-4 bg-rose-900/90 hover:bg-rose-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
										>
											<span>🔍 Perbesar Gambar</span>
										</button>
										<p class="text-center text-xs sm:text-sm font-semibold text-rose-900 pt-2 font-bubble italic">
											Gambar Topografi Dusun Krajan, Desa Taji
										</p>
									</div>

									<!-- IMAGE 2 -->
									<div class="relative group max-w-2xl mx-auto bg-white p-2.5 rounded-xl border border-rose-300 shadow-md">
										<img
											src={topografiDusunKrajan2}
											alt="Gambar Topografi Dusun Krajan, Desa Taji (Detail)"
											class="w-full h-auto max-h-[260px] sm:max-h-[320px] object-contain rounded-lg mx-auto"
										/>
										<button
											type="button"
											onclick={() => (zoomedImage = { src: topografiDusunKrajan2, alt: 'Peta Topografi Dusun Krajan, Desa Taji (Detail)', title: 'Gambar Topografi Dusun Krajan, Desa Taji (Analisis Kemiringan Lereng & Kontur Tanah)' })}
											class="absolute bottom-4 right-4 bg-rose-900/90 hover:bg-rose-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
										>
											<span>🔍 Perbesar Gambar</span>
										</button>
										<p class="text-center text-xs sm:text-sm font-semibold text-rose-900 pt-2 font-bubble italic">
											Gambar Topografi Dusun Krajan, Desa Taji (Detail)
										</p>
									</div>
								</div>

								<!-- SUMMARY BOX 2: ANALISIS KHUSUS DESA TAJI -->
								<div class="p-4 bg-rose-50/90 rounded-2xl border-2 border-rose-200 shadow-xs text-xs sm:text-sm leading-relaxed text-rose-950 space-y-2">
									<h3 class="font-extrabold text-rose-900 font-bubble text-sm sm:text-base flex items-center space-x-2 border-b border-rose-200 pb-1">
										<span>📍</span>
										<span>Analisis Khusus Wilayah Desa Taji:</span>
									</h3>
									<p>
										Dapat dilihat gambar diatas merupakan Desa Taji yang berada di Kecamatan Jabung, dapat diketahui melalui gambar peta parameter atau faktor-faktor penyebab tanah longsor diatas bahwasannya Desa Taji memiliki curah hujan 2000-2500 mm/tahun dengan kemiringan lereng lebih dari 40%, dengan rata-rata penggunaan lahan berupa ladang atau perkebunan sayuran, dan memiliki jenis tanah Andosol molik yang memiliki karakterisitik tanah mudah lepas dan terbentuk dari adanya hasil erupsi gunung berapi dan memiliki batuan Gunungapi Tengger sehingga mudah mengalami pelapukan. Sehingga dapat disimpulkan bahwa Desa Taji ini memiliki kerawanan longsor yang sangat tinggi.
									</p>
								</div>
							</div>
						{/if}

						<!-- SLIDE FOOTER INDICATOR (Sub-Menu 3: Bencana Longsor di Kecamatan Jabung) -->
						<div class="w-full pt-4 mt-6 border-t border-rose-200 flex items-center justify-between font-bubble">
							<!-- Left: Pagination Dots & Active Elongated Pill -->
							<div class="flex items-center space-x-1.5 sm:space-x-2">
								{#each Array(2) as _, idx}
									{#if readingTab === idx + 1}
										<!-- Active Slide Pill -->
										<div class="w-7 sm:w-8 h-2.5 sm:h-3 rounded-full bg-rose-600 transition-all duration-300 shadow-2xs"></div>
									{:else}
										<!-- Inactive Slide Dot -->
										<button
											type="button"
											onclick={() => setReadingTab(idx + 1)}
											onmouseenter={() => sound.playCardHover()}
											aria-label={`Ke Halaman ${idx + 1}`}
											class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-300 hover:bg-slate-400 transition-all cursor-pointer"
										></button>
									{/if}
								{/each}
							</div>

							<!-- Right: Page Counter Text -->
							<div class="font-extrabold text-rose-950 tracking-wide text-xs sm:text-sm">
								Halaman {readingTab} / 2
							</div>
						</div>

					</div>

				{:else if activeSubMenu === 4}
					<!-- SUB-MENU 4: MITIGASI BENCANA LONGSOR -->
					<div class="w-full space-y-4 animate-fade-in text-justify font-sans">
						
						<!-- Header & Back Button (Sticky Pinned Bar with Top Mask) -->
						<div class="sticky top-0 -mx-4 sm:-mx-6 md:-mx-8 mb-3 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-[#fffdf7] z-20 border-b-2 border-cyan-200 flex items-center justify-between font-bubble shadow-xs before:content-[''] before:absolute before:-top-20 before:left-0 before:right-0 before:h-20 before:bg-[#fffdf7]">
							<h2 class="text-xs sm:text-base font-extrabold text-cyan-950 flex items-center space-x-2 relative z-10">
								<span>🛡️</span>
								<span>Mitigasi Bencana Longsor</span>
							</h2>
							<button
								onclick={backToMenu}
								onmouseenter={() => sound.playCardHover()}
								class="relative z-10 px-3.5 py-1.5 bg-gradient-to-b from-[#00e5ff] via-[#00b0ff] to-[#0284c7] hover:brightness-110 text-white font-bold rounded-xl text-xs sm:text-sm transition-all border border-white flex items-center space-x-1 cursor-pointer font-bubble shadow-md transform active:scale-95 shrink-0"
								style="box-shadow: 0 3px 0 0 #01579b;"
							>
								<span>↩ Kembali</span>
							</button>
						</div>

						<!-- SLIDE 1: LANGKAH-LANGKAH MENGETAHUI KEBENCANAAN LONGSOR -->
						{#if readingTab === 1}
							<div class="bg-sky-50/80 p-4 rounded-2xl border-2 border-sky-200 shadow-sm space-y-4 animate-fade-in">
								<!-- INTRO BOX -->
								<div class="p-3.5 bg-white rounded-xl border border-sky-200 shadow-xs space-y-2 text-xs sm:text-sm leading-relaxed text-gray-800">
									<p>
										Mitigasi bencana longsor merupakan suatu upaya yang dilakukan untuk meminimalisir jatuhnya korban jiwa serta memperkecil dampak kerugian baik dari segi materi (harta benda) dan non materi (korban jiwa) akibat dari adanya peristiwa bencana longsor yang disebabkan oleh alam, aktivitas manusia, maupun keduanya.
									</p>
									<p>
										Mitigasi kebencanaan longsor prinsipnya bertujuan untuk meminimalisir dampak yang diberikan dari bencana longsor. Untuk kegiatan peringatan dini (<em>early warning</em>) sangat penting dilakukan, mulai dari prediksi cuaca dan iklim sebagai salah satu faktor yang menyebabkan kebencanaan longsor.
									</p>
								</div>

								<!-- STEPS HEADER -->
								<div class="space-y-3 pt-1">
									<h3 class="text-xs sm:text-sm font-extrabold text-sky-950 font-bubble flex items-center space-x-2 border-b border-sky-200 pb-1">
										<span>📌</span>
										<span>Langkah-Langkah Mengetahui Kebencanaan Longsor:</span>
									</h3>
									<p class="text-xs sm:text-sm leading-relaxed text-gray-800">
										Dalam mengetahui dan memahami kebencanaan longsor maka perlu adanya pendekatan yang melibatkan analisis, serta pengamatan dari adanya kondisi lapangan. Ada beberapa langkah-langkah dalam mengetahui kebencanaan longsor, yaitu:
									</p>

									<div class="space-y-3 pt-1">
										<!-- STEP 1 -->
										<div class="p-3.5 bg-white rounded-xl border border-sky-200 shadow-xs space-y-2 text-xs sm:text-sm leading-relaxed text-gray-800">
											<strong class="text-sky-950 font-bold text-sm block font-bubble">
												1. Mengidentifikasi lokasi rawan longsor
											</strong>
											<ul class="space-y-1.5 pl-2">
												<li class="flex items-start space-x-2">
													<span class="font-bold text-sky-800 shrink-0">a.</span>
													<div class="flex-1">
														Identifikasi kerawanan longsor bisa melalui pemetaan dengan menggunakan data geospasial (GIS) untuk mengetahui topografi daerah rawan longsor. Pemetaan risiko bencana bisa diakses melalui lembaga resmi, seperti BNPB.
													</div>
												</li>
												<li class="flex items-start space-x-2">
													<span class="font-bold text-sky-800 shrink-0">b.</span>
													<div class="flex-1">
														Selain melalui pemetaan, identifikasi rawan longsor dapat dilakukan dengan observasi ke lapangan terkait adanya tanda-tanda rawan longsor, seperti retakan tanah dan pohon menjadi miring.
													</div>
												</li>
											</ul>
										</div>

										<!-- STEP 2 -->
										<div class="p-3.5 bg-white rounded-xl border border-sky-200 shadow-xs space-y-2 text-xs sm:text-sm leading-relaxed text-gray-800">
											<strong class="text-sky-950 font-bold text-sm block font-bubble">
												2. Analisis penyebab longsor
											</strong>
											<div class="flex items-start space-x-2 pl-2">
												<span class="font-bold text-sky-800 shrink-0">a.</span>
												<div class="flex-1">
													Tanah longsor dapat diakibatkan oleh faktor alam dan pengaruh manusia. Faktor alam meliputi kemiringan lereng, jenis tanah, curah hujan, jenis batuan. Sedangkan faktor pengaruh aktivitas manusia yaitu adanya pembukaan lahan pertanian, permukiman, serta pembangunan fasilitas tanpa ada perhitungan risiko bencana kedepannya, seperti pemotongan lereng dalam pembangunan jalan yang ada di Kecamatan Jabung.
												</div>
											</div>
										</div>

										<!-- STEP 3 -->
										<div class="p-3.5 bg-white rounded-xl border border-sky-200 shadow-xs space-y-2 text-xs sm:text-sm leading-relaxed text-gray-800">
											<strong class="text-sky-950 font-bold text-sm block font-bubble">
												3. Pengumpulan data historis
											</strong>
											<div class="flex items-start space-x-2 pl-2">
												<span class="font-bold text-sky-800 shrink-0">a.</span>
												<div class="flex-1">
													Pengumpulan data dapat dilakukan dengan melakukan analisis kejadian longsor yang pernah terjadi sebelumnya, termasuk menganalisis penyebab dan dampaknya. Tahap ini membantu dalam mengevaluasi lahan agar dapat dikonservasi secara tepat, agar dapat meminimalisir terjadinya longsor kedepannya.
												</div>
											</div>
										</div>

										<!-- STEP 4 -->
										<div class="p-3.5 bg-white rounded-xl border border-sky-200 shadow-xs space-y-2 text-xs sm:text-sm leading-relaxed text-gray-800">
											<strong class="text-sky-950 font-bold text-sm block font-bubble">
												4. Pemantauan secara berkala
											</strong>
											<ul class="space-y-1.5 pl-2">
												<li class="flex items-start space-x-2">
													<span class="font-bold text-sky-800 shrink-0">a.</span>
													<div class="flex-1">
														Pemantauan dapat dilakukan dengan melihat area rawan longsor terkait adanya tanda-tanda awal longsor, dan dapat diketahui melalui perubahan fisik seperti retakan tanah, pohon/tiang listrik nampak miring, serta pergeseran tanah yang meluncur perlahan kebawah.
													</div>
												</li>
												<li class="flex items-start space-x-2">
													<span class="font-bold text-sky-800 shrink-0">b.</span>
													<div class="flex-1">
														Pemantauan fasilitas, seperti tembok/dinding penahan tanah, saluran irigasi di lereng. Hal ini bertujuan untuk meminimalisir kerusakan fasilitas perlindungan bencana.
													</div>
												</li>
											</ul>
										</div>

										<!-- STEP 5 -->
										<div class="p-3.5 bg-white rounded-xl border border-sky-200 shadow-xs space-y-2 text-xs sm:text-sm leading-relaxed text-gray-800">
											<strong class="text-sky-950 font-bold text-sm block font-bubble">
												5. Melakukan kerja sama
											</strong>
											<div class="flex items-start space-x-2 pl-2">
												<span class="font-bold text-sky-800 shrink-0">a.</span>
												<div class="flex-1">
													Kerja sama dalam pengurangan risiko bencana longsor dan meminimalisir terjadinya bencana longsor, harus melibatkan semua kalangan, mulai dari masyarakat lokal, ahli dan instansi pendidikan, hingga pemerintah. Hal ini bertujuan untuk meminimalisir terjadinya bencana, serta dampak yang disebabkan oleh longsoran.
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- CLOSING SUMMARY -->
								<div class="p-3.5 bg-sky-100/80 rounded-xl border border-sky-300 shadow-xs text-xs sm:text-sm leading-relaxed text-sky-950 font-medium">
									<p>
										Dengan mengetahui langkah-langkah ini, risiko dan dampak kebencanaan longsor dapat memberikan manfaat kepada masyarakat. Sehingga upaya mitigasi dan respon terhadap bencana longsor dapat berjalan secara efektif.
									</p>
								</div>
							</div>

						<!-- SLIDE 2: TAHAPAN MITIGASI BENCANA & IMPLEMENTASI KECAMATAN JABUNG -->
						{:else if readingTab === 2}
							<div class="bg-sky-50/80 p-4 rounded-2xl border-2 border-sky-200 shadow-sm space-y-4 animate-fade-in">
								<p class="text-xs sm:text-sm leading-relaxed text-gray-800 font-medium">
									Langkah yang dilakukan pada mitigasi kebencanaan longsor yang harus dilakukan pada saat sebelum terjadinya tanah longsor (Pra Bencana), saat bencana tanah longsor terjadi, dan pasca bencana tanah longsor.
								</p>

								<!-- 3 STAGES CARDS -->
								<div class="space-y-3.5">
									<!-- PRA BENCANA -->
									<div class="p-4 bg-white rounded-2xl border-2 border-emerald-300 shadow-xs space-y-2">
										<h4 class="text-sm font-extrabold text-emerald-950 font-bubble flex items-center space-x-2 border-b border-emerald-200 pb-1.5">
											<span>🟢</span>
											<span>Pra Bencana (Sebelum Terjadi Tanah Longsor):</span>
										</h4>
										<ul class="space-y-1.5 text-xs sm:text-sm text-gray-800">
											<li class="flex items-start space-x-2">
												<span class="font-bold text-emerald-700 shrink-0">a.</span>
												<div class="flex-1">Pembuatan dinding bangunan penahan longsor.</div>
											</li>
											<li class="flex items-start space-x-2">
												<span class="font-bold text-emerald-700 shrink-0">b.</span>
												<div class="flex-1">Tidak membangun bangunan berupa permukiman, fasilitas sarana dan prasarana di area rawan longsor dibawah tebing maupun lereng.</div>
											</li>
											<li class="flex items-start space-x-2">
												<span class="font-bold text-emerald-700 shrink-0">c.</span>
												<div class="flex-1">Membuat sistem terasering atau guludan secara vertikal untuk tanaman pertanian seperti sayuran, dan membuat sistem drainase yang tepat.</div>
											</li>
											<li class="flex items-start space-x-2">
												<span class="font-bold text-emerald-700 shrink-0">d.</span>
												<div class="flex-1">Melakukan kegiatan penghijauan atau reboisasi pada daerah lereng dengan menggunakan tanaman yang memiliki perakaran serabut atau dalam seperti tanaman (rumput vetiver, bambu), serta pohon yang memiliki perakaran yang mampu menahan tanah dan menjaga kesetabilan tanah (nangka, mahoni, alpukat).</div>
											</li>
											<li class="flex items-start space-x-2">
												<span class="font-bold text-emerald-700 shrink-0">e.</span>
												<div class="flex-1">Pengenalan daerah yang memiliki kerawanan longsor kepada masyarakat sekitar.</div>
											</li>
											<li class="flex items-start space-x-2">
												<span class="font-bold text-emerald-700 shrink-0">f.</span>
												<div class="flex-1">Menambah jenis tanaman berupa pepohonan berakar dalam dan tanaman rumput vetiver di lahan pertanian.</div>
											</li>
											<li class="flex items-start space-x-2">
												<span class="font-bold text-emerald-700 shrink-0">g.</span>
												<div class="flex-1">Tidak menebang pohon secara sembarangan untuk keperluan alih fungsi lahan pertanian maupun perkebunan di area sekitaran lereng.</div>
											</li>
										</ul>
									</div>

									<!-- SAAT BENCANA -->
									<div class="p-4 bg-white rounded-2xl border-2 border-amber-300 shadow-xs space-y-2">
										<h4 class="text-sm font-extrabold text-amber-950 font-bubble flex items-center space-x-2 border-b border-amber-200 pb-1.5">
											<span>🟡</span>
											<span>Saat Bencana Tanah Longsor Terjadi:</span>
										</h4>
										<ul class="space-y-1.5 text-xs sm:text-sm text-gray-800">
											<li class="flex items-start space-x-2">
												<span class="font-bold text-amber-800 shrink-0">a.</span>
												<div class="flex-1">Segera mengevakuasi diri dan keluarga ke arah jalur evakuasi, atau menjauhi daerah sekitaran bencana.</div>
											</li>
											<li class="flex items-start space-x-2">
												<span class="font-bold text-amber-800 shrink-0">b.</span>
												<div class="flex-1">Mencari pertolongan pertama dengan mencari bantuan medis, serta melaporkan ke pihak berwajib, seperti perangkat desa, polisi, tentara, BPBD.</div>
											</li>
										</ul>
									</div>

									<!-- PASCA BENCANA -->
									<div class="p-4 bg-white rounded-2xl border-2 border-rose-300 shadow-xs space-y-2">
										<h4 class="text-sm font-extrabold text-rose-950 font-bubble flex items-center space-x-2 border-b border-rose-200 pb-1.5">
											<span>🔴</span>
											<span>Pasca Bencana Tanah Longsor:</span>
										</h4>
										<ul class="space-y-1.5 text-xs sm:text-sm text-gray-800">
											<li class="flex items-start space-x-2">
												<span class="font-bold text-rose-800 shrink-0">a.</span>
												<div class="flex-1">Apabila hujan turun setelah terjadi longsor, mengantisipasi longsor susulan.</div>
											</li>
											<li class="flex items-start space-x-2">
												<span class="font-bold text-rose-800 shrink-0">b.</span>
												<div class="flex-1">Menyiapkan tempat pengungsian serta membangun dapur umum darurat bencana.</div>
											</li>
											<li class="flex items-start space-x-2">
												<span class="font-bold text-rose-800 shrink-0">c.</span>
												<div class="flex-1">Membersihkan material pasca bencana longsor.</div>
											</li>
											<li class="flex items-start space-x-2">
												<span class="font-bold text-rose-800 shrink-0">d.</span>
												<div class="flex-1">Penyelamatan harta dan benda yang penting dan masih bisa diselamatkan.</div>
											</li>
											<li class="flex items-start space-x-2">
												<span class="font-bold text-rose-800 shrink-0">e.</span>
												<div class="flex-1">Upaya pemulihan dampak dari kebencanaan longsor, seperti fasilitas umum, permukiman, serta pemulihan trauma kepada korban.</div>
											</li>
											<li class="flex items-start space-x-2">
												<span class="font-bold text-rose-800 shrink-0">f.</span>
												<div class="flex-1">Menghindari daerah rawan longsor, dan membangun permukiman, fasilitas umum ke tempat yang lebih aman.</div>
											</li>
										</ul>
										<p class="text-xs italic text-gray-700 pt-1">
											Setelah terjadi bencana melakukan pemulihan (recovery) dengan melibatkan masyarakat.
										</p>
									</div>
								</div>

								<!-- SECTION IMPLEMENTASI KECAMATAN JABUNG -->
								<div class="space-y-3 pt-3 border-t border-sky-200">
									<h3 class="text-xs sm:text-sm font-extrabold text-sky-950 font-bubble flex items-center space-x-2 border-b border-sky-200 pb-1">
										<span>🏞️</span>
										<span>Implementasi Mitigasi Berdasarkan Tutupan Lahan Kecamatan Jabung:</span>
									</h3>
									<p class="text-xs sm:text-sm leading-relaxed text-gray-800">
										Pada wilayah Kecamatan Jabung memiliki tutupan lahan berbeda-beda yang menyebabkan Kecamatan Jabung memiliki kerentanan longsor yang bermacam-macam, tutupan lahan tersebut juga dapat dipengaruhi oleh hasil aktivitas manusia.
									</p>

									<!-- MOBILE CARDS VIEW (block sm:hidden) -->
									<div class="block sm:hidden space-y-3.5 pt-1">
										<!-- ROW 1: BENTANG ALAM PERTANIAN / PERKEBUNAN -->
										<div class="p-3.5 bg-white rounded-xl border border-amber-300 shadow-xs space-y-2.5">
											<strong class="text-amber-950 font-bold text-sm block font-bubble border-b border-amber-200 pb-1">
												🌾 Bentang Alam Pertanian / Perkebunan
											</strong>
											<div class="grid grid-cols-2 gap-2">
												<div class="relative group bg-amber-50 p-1 rounded-lg border border-amber-200">
													<img src={mitigasi1} alt="Terasering Lahan Pertanian" class="w-full h-auto max-h-[140px] object-contain rounded mx-auto" />
													<button type="button" onclick={() => (zoomedImage = { src: mitigasi1, alt: 'Terasering Lahan Pertanian', title: 'Metode Terasering di Lahan Pertanian Pegunungan' })} class="absolute bottom-2 right-2 bg-amber-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md flex items-center space-x-1 font-bubble cursor-pointer">
														<span>🔍</span>
													</button>
												</div>
												<div class="relative group bg-amber-50 p-1 rounded-lg border border-amber-200">
													<img src={mitigasi2} alt="Guludan & Drainase" class="w-full h-auto max-h-[140px] object-contain rounded mx-auto" />
													<button type="button" onclick={() => (zoomedImage = { src: mitigasi2, alt: 'Guludan & Drainase', title: 'Metode Guludan dan Saluran Irigasi' })} class="absolute bottom-2 right-2 bg-amber-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md flex items-center space-x-1 font-bubble cursor-pointer">
														<span>🔍</span>
													</button>
												</div>
											</div>
											<p class="text-xs leading-relaxed text-gray-800 text-justify">
												Pada bentang alam pegunungan dengan penggunaan lahan pertanian atau perkebunan perlu adanya langkah mitigasi untuk meminimalisir terjadinya bencana longsor, seperti mengatur lahan dengan metode terasering dan guludan, serta didukung dengan penanaman pohon berakar kuat, perdu serta pembuatan saluran irigasi yang baik.
											</p>
										</div>

										<!-- ROW 2: LERENG RAWAN AKIBAT PEMANGKASAN JALAN -->
										<div class="p-3.5 bg-white rounded-xl border border-sky-300 shadow-xs space-y-2.5">
											<strong class="text-sky-950 font-bold text-sm block font-bubble border-b border-sky-200 pb-1">
												🛣️ Lereng Rawan Akibat Pemangkasan Jalan
											</strong>
											<div class="grid grid-cols-2 gap-2">
												<div class="relative group bg-sky-50 p-1 rounded-lg border border-sky-200">
													<img src={mitigasi3} alt="Dinding Penahan Tanah" class="w-full h-auto max-h-[140px] object-contain rounded mx-auto" />
													<button type="button" onclick={() => (zoomedImage = { src: mitigasi3, alt: 'Dinding Penahan Tanah', title: 'Pembangunan Dinding Penahan Tanah (DPT)' })} class="absolute bottom-2 right-2 bg-sky-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md flex items-center space-x-1 font-bubble cursor-pointer">
														<span>🔍</span>
													</button>
												</div>
												<div class="relative group bg-sky-50 p-1 rounded-lg border border-sky-200">
													<img src={mitigasi4} alt="Rumput Vetiver" class="w-full h-auto max-h-[140px] object-contain rounded mx-auto" />
													<button type="button" onclick={() => (zoomedImage = { src: mitigasi4, alt: 'Penanaman Rumput Vetiver', title: 'Penanaman Rumput Vetiver Berakar Kuat & Serabut' })} class="absolute bottom-2 right-2 bg-sky-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md flex items-center space-x-1 font-bubble cursor-pointer">
														<span>🔍</span>
													</button>
												</div>
											</div>
											<p class="text-xs leading-relaxed text-gray-800 text-justify">
												Pada daerah lereng yang memiliki kerawanan longsor yang tinggi akibat pemangkasan pembuatan jalan, baik daerah yang sudah terjadi longsor atau belum mengalami longsor perlu adanya mitigasi seperti pembangunan Dinding Penahan Tanah, serta pembangunan saluran irigasi yang baik untuk meminimalisir air tertahan di tanah, dan bisa didukung dengan penanaman tanaman pohon dan tanaman berakar serabut dan kuat seperti tanaman vetiver, serai, dsb.
											</p>
										</div>

										<!-- ROW 3: DATARAN TINGGI PERMUKIMAN -->
										<div class="p-3.5 bg-white rounded-xl border border-emerald-300 shadow-xs space-y-2.5">
											<strong class="text-emerald-950 font-bold text-sm block font-bubble border-b border-emerald-200 pb-1">
												🏡 Dataran Tinggi Permukiman
											</strong>
											<div class="relative group bg-emerald-50 p-1 rounded-lg border border-emerald-200 max-w-[200px] mx-auto">
												<img src={mitigasi5} alt="Permukiman Dataran Tinggi" class="w-full h-auto max-h-[150px] object-contain rounded mx-auto" />
												<button type="button" onclick={() => (zoomedImage = { src: mitigasi5, alt: 'Permukiman Dataran Tinggi', title: 'Permukiman di Dataran Tinggi & Perbukitan' })} class="absolute bottom-2 right-2 bg-emerald-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md flex items-center space-x-1 font-bubble cursor-pointer">
													<span>🔍</span>
												</button>
											</div>
											<p class="text-xs leading-relaxed text-gray-800 text-justify">
												Pada bentang alam berupa dataran tinggi atau pegunungan yang digunakan sebagai lahan pertanian dan permukiman, perlu adanya mitigasi berupa edukasi terhadap warga dan pemahaman terkait mitigasi kebencanaan longsor atau dapat merelokasi permukiman ke tempat yang lebih aman, agar dapat meminimalisir kerugian baik berupa materi harta benda dan non materi seperti korban jiwa, edukasi kepada masyarakat dapat dilakukan oleh semua kalangan, baik masyarakat itu sendiri, pemerintah maupun instansi pendidikan.
											</p>
										</div>
									</div>

									<!-- DESKTOP TABLE VIEW (hidden sm:block) -->
									<div class="hidden sm:block overflow-x-auto rounded-xl border-2 border-amber-300 shadow-md bg-white my-2">
										<table class="w-full text-left border-collapse font-sans text-xs sm:text-sm">
											<thead>
												<tr class="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 text-amber-950 font-bubble text-sm sm:text-base border-b-2 border-amber-400">
													<th class="py-2.5 px-4 font-extrabold text-center w-[42%] border-r border-amber-300">Gambar</th>
													<th class="py-2.5 px-4 font-extrabold text-center w-[58%]">Mitigasi</th>
												</tr>
											</thead>
											<tbody class="divide-y divide-amber-200">
												<!-- ROW 1 -->
												<tr class="hover:bg-amber-50/50 transition-colors">
													<td class="p-3 border-r border-amber-200 align-middle">
														<div class="space-y-2.5 max-w-[240px] mx-auto">
															<div class="relative group bg-white p-1 rounded-lg border border-amber-300 shadow-xs">
																<img src={mitigasi1} alt="Terasering Lahan Pertanian" class="w-full h-auto max-h-[160px] object-contain rounded mx-auto" />
																<button type="button" onclick={() => (zoomedImage = { src: mitigasi1, alt: 'Terasering Lahan Pertanian', title: 'Metode Terasering di Lahan Pertanian Pegunungan' })} class="absolute bottom-2 right-2 bg-amber-900/90 hover:bg-amber-800 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-md flex items-center space-x-1 font-bubble cursor-pointer">
																	<span>🔍 Perbesar</span>
																</button>
															</div>
															<div class="relative group bg-white p-1 rounded-lg border border-amber-300 shadow-xs">
																<img src={mitigasi2} alt="Guludan & Drainase" class="w-full h-auto max-h-[160px] object-contain rounded mx-auto" />
																<button type="button" onclick={() => (zoomedImage = { src: mitigasi2, alt: 'Guludan & Drainase', title: 'Metode Guludan dan Saluran Irigasi' })} class="absolute bottom-2 right-2 bg-amber-900/90 hover:bg-amber-800 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-md flex items-center space-x-1 font-bubble cursor-pointer">
																	<span>🔍 Perbesar</span>
																</button>
															</div>
														</div>
													</td>
													<td class="p-4 align-middle leading-relaxed text-gray-800 text-justify">
														Pada bentang alam pegunungan dengan penggunaan lahan pertanian atau perkebunan perlu adanya langkah mitigasi untuk meminimalisir terjadinya bencana longsor, seperti mengatur lahan dengan metode terasering dan guludan, serta didukung dengan penanaman pohon berakar kuat, perdu serta pembuatan saluran irigasi yang baik.
													</td>
												</tr>

												<!-- ROW 2 -->
												<tr class="hover:bg-amber-50/50 transition-colors">
													<td class="p-3 border-r border-amber-200 align-middle">
														<div class="space-y-2.5 max-w-[240px] mx-auto">
															<div class="relative group bg-white p-1 rounded-lg border border-sky-300 shadow-xs">
																<img src={mitigasi3} alt="Dinding Penahan Tanah" class="w-full h-auto max-h-[160px] object-contain rounded mx-auto" />
																<button type="button" onclick={() => (zoomedImage = { src: mitigasi3, alt: 'Dinding Penahan Tanah', title: 'Pembangunan Dinding Penahan Tanah (DPT)' })} class="absolute bottom-2 right-2 bg-sky-900/90 hover:bg-sky-800 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-md flex items-center space-x-1 font-bubble cursor-pointer">
																	<span>🔍 Perbesar</span>
																</button>
															</div>
															<div class="relative group bg-white p-1 rounded-lg border border-sky-300 shadow-xs">
																<img src={mitigasi4} alt="Rumput Vetiver" class="w-full h-auto max-h-[160px] object-contain rounded mx-auto" />
																<button type="button" onclick={() => (zoomedImage = { src: mitigasi4, alt: 'Penanaman Rumput Vetiver', title: 'Penanaman Rumput Vetiver Berakar Kuat & Serabut' })} class="absolute bottom-2 right-2 bg-sky-900/90 hover:bg-sky-800 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-md flex items-center space-x-1 font-bubble cursor-pointer">
																	<span>🔍 Perbesar</span>
																</button>
															</div>
														</div>
													</td>
													<td class="p-4 align-middle leading-relaxed text-gray-800 text-justify">
														Pada daerah lereng yang memiliki kerawanan longsor yang tinggi akibat pemangkasan pembuatan jalan, baik daerah yang sudah terjadi longsor atau belum mengalami longsor perlu adanya mitigasi seperti pembangunan Dinding Penahan Tanah, serta pembangunan saluran irigasi yang baik untuk meminimalisir air tertahan di tanah, dan bisa didukung dengan penanaman tanaman pohon dan tanaman berakar serabut dan kuat seperti tanaman vetiver, serai, dsb.
													</td>
												</tr>

												<!-- ROW 3 -->
												<tr class="hover:bg-amber-50/50 transition-colors">
													<td class="p-3 border-r border-amber-200 align-middle">
														<div class="max-w-[240px] mx-auto">
															<div class="relative group bg-white p-1 rounded-lg border border-emerald-300 shadow-xs">
																<img src={mitigasi5} alt="Permukiman Dataran Tinggi" class="w-full h-auto max-h-[170px] object-contain rounded mx-auto" />
																<button type="button" onclick={() => (zoomedImage = { src: mitigasi5, alt: 'Permukiman Dataran Tinggi', title: 'Permukiman di Dataran Tinggi & Perbukitan' })} class="absolute bottom-2 right-2 bg-emerald-900/90 hover:bg-emerald-800 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-md flex items-center space-x-1 font-bubble cursor-pointer">
																	<span>🔍 Perbesar</span>
																</button>
															</div>
														</div>
													</td>
													<td class="p-4 align-middle leading-relaxed text-gray-800 text-justify">
														Pada bentang alam berupa dataran tinggi atau pegunungan yang digunakan sebagai lahan pertanian dan permukiman, perlu adanya mitigasi berupa edukasi terhadap warga dan pemahaman terkait mitigasi kebencanaan longsor atau dapat merelokasi permukiman ke tempat yang lebih aman, agar dapat meminimalisir kerugian baik berupa materi harta benda dan non materi seperti korban jiwa, edukasi kepada masyarakat dapat dilakukan oleh semua kalangan, baik masyarakat itu sendiri, pemerintah maupun instansi pendidikan.
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						{/if}

						<!-- SLIDE FOOTER INDICATOR (Dots/Pill + Page Counter) -->
						<div class="w-full pt-4 mt-6 border-t border-cyan-200 flex items-center justify-between font-bubble">
							<!-- Left: Pagination Dots & Active Elongated Pill -->
							<div class="flex items-center space-x-1.5 sm:space-x-2">
								{#each Array(getMaxTabForSubMenu(activeSubMenu)) as _, idx}
									{#if readingTab === idx + 1}
										<!-- Active Slide Pill -->
										<div class="w-7 sm:w-8 h-2.5 sm:h-3 rounded-full bg-cyan-600 transition-all duration-300 shadow-2xs"></div>
									{:else}
										<!-- Inactive Slide Dot -->
										<button
											type="button"
											onclick={() => (readingTab = idx + 1)}
											onmouseenter={() => sound.playCardHover()}
											aria-label={`Ke Halaman ${idx + 1}`}
											class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-300 hover:bg-slate-400 transition-all cursor-pointer"
										></button>
									{/if}
								{/each}
							</div>

							<!-- Right: Page Counter Text -->
							<div class="font-extrabold text-cyan-950 tracking-wide text-xs sm:text-sm">
								Halaman {readingTab} / {getMaxTabForSubMenu(activeSubMenu)}
							</div>
						</div>

					</div>

				{/if}

			</div>

			<!-- Whiteboard Floating Navigation Arrows (Themed Accent) -->
			{#if activeSubMenu !== null && getMaxTabForSubMenu(activeSubMenu) > 1}
				<!-- Previous Slide Arrow (Bottom Left) -->
				<button
					type="button"
					onclick={prevSlide}
					onmouseenter={() => sound.playCardHover()}
					disabled={readingTab === 1}
					aria-label="Halaman Sebelumnya"
					class={`absolute -bottom-5 left-4 sm:left-6 w-11 h-11 sm:w-14 sm:h-14 rounded-full border-3 border-white shadow-xl flex items-center justify-center text-white font-bold transition-all transform active:scale-90 z-30 ${
						readingTab === 1
							? 'bg-gray-400 opacity-50 cursor-not-allowed'
							: activeSubMenu === 2
							? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-700 hover:scale-105 cursor-pointer'
							: activeSubMenu === 3
							? 'bg-gradient-to-b from-rose-400 via-rose-500 to-amber-700 hover:scale-105 cursor-pointer'
							: activeSubMenu === 4
							? 'bg-gradient-to-b from-cyan-400 via-cyan-500 to-teal-700 hover:scale-105 cursor-pointer'
							: 'bg-gradient-to-b from-[#00e5ff] via-[#00b0ff] to-[#0284c7] hover:scale-105 cursor-pointer'
					}`}
					style={readingTab === 1 ? '' : `box-shadow: 0 4px 0 0 ${activeSubMenu === 2 ? '#047857' : activeSubMenu === 3 ? '#be123c' : activeSubMenu === 4 ? '#0e7490' : '#0369a1'}, 0 8px 15px rgba(0, 0, 0, 0.25);`}
				>
					<svg class="w-6 h-6 sm:w-8 sm:h-8 drop-shadow" fill="none" stroke="currentColor" stroke-width="3.5" viewBox="0 0 24 24">
						<path d="M15 19l-7-7 7-7" />
					</svg>
				</button>

				<!-- Next Slide Arrow (Bottom Right) -->
				<button
					type="button"
					onclick={nextSlide}
					onmouseenter={() => sound.playCardHover()}
					disabled={readingTab === getMaxTabForSubMenu(activeSubMenu)}
					aria-label="Halaman Selanjutnya"
					class={`absolute -bottom-5 right-4 sm:right-6 w-11 h-11 sm:w-14 sm:h-14 rounded-full border-3 border-white shadow-xl flex items-center justify-center text-white font-bold transition-all transform active:scale-90 z-30 ${
						readingTab === getMaxTabForSubMenu(activeSubMenu)
							? 'bg-gray-400 opacity-50 cursor-not-allowed'
							: activeSubMenu === 2
							? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-700 hover:scale-105 cursor-pointer'
							: activeSubMenu === 3
							? 'bg-gradient-to-b from-rose-400 via-rose-500 to-amber-700 hover:scale-105 cursor-pointer'
							: activeSubMenu === 4
							? 'bg-gradient-to-b from-cyan-400 via-cyan-500 to-teal-700 hover:scale-105 cursor-pointer'
							: 'bg-gradient-to-b from-[#00e5ff] via-[#00b0ff] to-[#0284c7] hover:scale-105 cursor-pointer'
					}`}
					style={readingTab === getMaxTabForSubMenu(activeSubMenu) ? '' : `box-shadow: 0 4px 0 0 ${activeSubMenu === 2 ? '#047857' : activeSubMenu === 3 ? '#be123c' : activeSubMenu === 4 ? '#0e7490' : '#0369a1'}, 0 8px 15px rgba(0, 0, 0, 0.25);`}
				>
					<svg class="w-6 h-6 sm:w-8 sm:h-8 drop-shadow" fill="none" stroke="currentColor" stroke-width="3.5" viewBox="0 0 24 24">
						<path d="M9 5l7 7-7 7" />
					</svg>
				</button>
			{/if}

		</div>

	</div>

	<!-- FOOTER BAR -->
	<footer class="relative z-10 text-center py-1 shrink-0 font-bubble">
		<p class="text-[11px] sm:text-xs font-bold text-slate-500 drop-shadow-xs">
			© 2026 Universitas Negeri Malang — All Rights Reserved
		</p>
	</footer>

	<!-- YOUTUBE VIDEO MODAL -->
	{#if isVideoModalOpen}
		<div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
			<div class="relative w-full max-w-4xl bg-slate-900 rounded-3xl border-4 border-emerald-400 p-4 sm:p-6 shadow-2xl text-white text-center flex flex-col items-center">
				<!-- Close X Button -->
				<button
					type="button"
					onclick={closeVideo}
					class="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-rose-500 border-2 border-white text-white font-black text-xl flex items-center justify-center hover:bg-rose-600 transition-colors shadow-lg z-20 cursor-pointer"
				>
					✕
				</button>

				<div class="w-full flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
					<h3 class="text-base sm:text-xl font-extrabold text-emerald-400 font-bubble flex items-center space-x-2">
						<span>🎥</span>
						<span>Video Ilustrasi Bencana Tanah Longsor</span>
					</h3>
					<span class="text-xs bg-red-600 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-sans">YouTube</span>
				</div>

				<!-- YouTube Responsive Embed Iframe -->
				<div class="w-full aspect-video bg-black rounded-2xl border-2 border-slate-700 overflow-hidden shadow-inner">
					<iframe
						src="https://www.youtube.com/embed/uv1lv1U4hVU?autoplay=1"
						title="Video Ilustrasi Bencana Tanah Longsor"
						class="w-full h-full border-0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				</div>

				<!-- Control Buttons -->
				<div class="flex items-center justify-center space-x-3 mt-4">
					<a
						href="https://www.youtube.com/watch?v=uv1lv1U4hVU"
						target="_blank"
						rel="noopener noreferrer"
						class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl border-2 border-white shadow-lg font-bubble flex items-center space-x-2 text-xs sm:text-sm transition-transform hover:scale-105"
					>
						<span>▶ Buka di YouTube</span>
					</a>
					<button
						type="button"
						onclick={closeVideo}
						class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl border-2 border-white shadow-lg font-bubble cursor-pointer text-xs sm:text-sm transition-transform hover:scale-105 active:scale-95"
					>
						Tutup Video
					</button>
				</div>
			</div>
		</div>
	{/if}
</main>
