<script lang="ts">
	import { onMount } from 'svelte';
	import { sound } from '$lib/utils/audio';
	import { saveProgress } from '$lib/utils/progress';
	import LandscapeBackground from '$lib/components/LandscapeBackground.svelte';

	// Slide state
	let currentSlide = $state(1);
	const totalSlides = 2;

	$effect(() => {
		if (currentSlide === totalSlides) {
			saveProgress({ extensionCompleted: true });
		}
	});

	function goToSlide(slide: number) {
		sound.playClick();
		currentSlide = slide;
	}

	function nextSlide() {
		sound.playClick();
		if (currentSlide < totalSlides) currentSlide++;
	}

	function prevSlide() {
		sound.playClick();
		if (currentSlide > 1) currentSlide--;
	}
</script>

<svelte:head>
	<title>Extension - I-CARE LANDSLIDE</title>
</svelte:head>

<!-- Responsive Container: Fixed height on large screens, Scrollable on mobile/small screens -->
<main class="relative min-h-screen lg:h-screen lg:h-dvh w-full overflow-y-auto flex flex-col justify-between p-3 sm:p-5 select-none font-bubble">
	<!-- Landscape Vector Environment Background -->
	<LandscapeBackground />

	<!-- TOP HEADER BAR -->
	<header class="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between shrink-0">
		<div class="flex items-center space-x-3 bg-white/85 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/90 shadow-lg">
			<div class="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold">
				🌐
			</div>
			<div class="flex flex-col">
				<span class="text-xs font-bold text-purple-800 uppercase tracking-wide leading-tight">Room 5</span>
				<span class="text-base sm:text-lg font-extrabold text-purple-900 leading-tight">Extension</span>
			</div>
		</div>

		<!-- Back to Main Menu Button -->
		<a
			href="/"
			onclick={() => sound.playClick()}
			onmouseenter={() => sound.playCardHover()}
			aria-label="Menu Utama"
			class="group relative px-3 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-gradient-to-b from-purple-400 to-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold transform active:scale-95 transition-all hover:scale-105"
			style="box-shadow: 0 4px 0 0 #4c1d95, 0 8px 15px rgba(0, 0, 0, 0.2);"
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

	<!-- MAIN WHITEBOARD SLIDE DISPLAY -->
	<div class="relative z-10 w-full max-w-5xl mx-auto flex-1 min-h-0 flex flex-col items-center justify-center py-2 sm:py-4">
		
		<!-- Wooden Frame Outer Box -->
		<div class="relative w-full bg-[#d7995b] rounded-3xl p-3 sm:p-5 border-4 border-[#8c5222] shadow-2xl flex flex-col">
			
			<!-- Wood Texture Shadow Bevel -->
			<div class="absolute inset-0 rounded-2xl border-4 border-black/10 pointer-events-none"></div>

			<!-- Top Floating Title Banner -->
			<div class="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
				<div class="px-6 sm:px-10 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-700 border-3 border-white shadow-xl text-white font-extrabold text-base sm:text-2xl tracking-wide text-shadow whitespace-nowrap">
					{#if currentSlide === 1}
						Rangkuman Materi
					{:else}
						Daftar Pustaka
					{/if}
				</div>
			</div>

			<!-- Whiteboard Inner Content Canvas -->
			<div class="relative w-full flex-1 bg-[#fffdf7] rounded-2xl border-3 border-[#c4b5a5] p-4 sm:p-8 md:p-10 pt-8 sm:pt-10 text-gray-800 font-sans shadow-inner overflow-y-auto min-h-[380px] sm:min-h-[440px] max-h-[62vh] flex flex-col justify-between">
				
				<!-- SLIDE 1: RANGKUMAN CONTENT -->
				{#if currentSlide === 1}
					<div class="space-y-5 animate-fade-in text-justify text-sm sm:text-base leading-relaxed text-gray-800 pr-1">
						<h2 class="text-base sm:text-2xl font-extrabold text-gray-900 border-b-2 border-purple-200 pb-1.5 font-bubble text-left">
							Rangkuman
						</h2>

						<p>
							Indonesia merupakan wilayah dengan topografi yang kompleks,dikarenakan Indonesia merupakan daerah pertemuan 3 lempeng besar, yaitu lempeng Eurasia, Lempeng Indo-Australia, dan Lempeng Pasifik, hal ini menjadikan Wilayah Indonesia berada di area subduksi lempeng dan menyebabkan pembentukan gunungapi. Dari adanya hal ini Indonesia memiliki bahaya ancaman bencana seperti gempa bumi, tsunami, banjir rob, tanah longsor dsb.
						</p>

						<p>
							Pada wilayah Kabupaten Malang, tepatnya di Kecamatan Jabung merupakan wilayah yang memiliki bencana yang mengancam yaitu tanah longsor, dimana tanah longsor ini terjadi akibat tanah tidak mampu menahan beban air dan mengakibatkan tanah menjadi tidak stabil. Sehingga pada saat tanah kehilangan kekuatan untuk menahan beban air dan tidak stabil menyebabkan tanah menjadi turun ke lereng dan mengakibatkan tanah longsor. Selain curah hujan yang tinggi, longsor yang ada di Kecamatan Jabung juga diakibatkan beberapa faktor, yaitu faktor alam dan faktor manusia. Faktor alam seperti keadaan topografi yang ada di Kecamatan Jabung yang variatif dari landai hingga berbukit dan memiliki lereng curam, jenis tanah yang kurang kuat untuk menahan beban air, serta tutupan lahan berupa lahan pertanian dan perkebunan dengan jenis tanaman berupa sayuran. Sehingga wilayah Kecamatan Jabung, Terutama di Desa Taji sangat rawan terhadap risiko kebencanaan tanah longsor. Sedangkan faktor dari aktivitas manusia yaitu pembukaan lahan di daerah lereng untuk digunakan menjadi lahan pertanian, perkebunan, permukiman, dan fasilitas umum tanpa memperhitungkan kerawanan bencana yang akan datang.
						</p>

						<p>
							Langkah yang di ambil untuk meminimalisir terjadinya kebencanaan longsor yang ada di Kecamatan Jabung yaitu pengelolaan dan konservasi lahan dengan reboisasi dan menanami tanaman yang memiliki akar serabut seperti vetiver dan bambu, membangun sistem irigasi atau drainase air yang tepat, pembangunan tembok penahan tanah dan mengedukasi masyarakat terkait mitigasi bencana tanah longsor mulai dari pra bencana, saat bencana, dan setelah bencana. Sehingga masyarakat mampu mengetahui tanda-tanda peringatan dini sebelum bencana longsor, dan cara untuk meminimalisir terjadinya bencana longsor.
						</p>
					</div>

				<!-- SLIDE 2: DAFTAR PUSTAKA CONTENT -->
				{:else if currentSlide === 2}
					<div class="space-y-4 animate-fade-in text-justify text-xs sm:text-sm leading-relaxed text-gray-800 pr-1">
						<h2 class="text-base sm:text-2xl font-extrabold text-gray-900 border-b-2 border-purple-200 pb-1.5 font-bubble text-left flex items-center justify-between">
							<span>Daftar Pustaka</span>
							<span class="text-xs font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">Referensi</span>
						</h2>

						<div class="space-y-3 font-sans pt-1">
							<p class="pl-6 -indent-6">
								Agusman, R., Hayana, N. H., & Stiano, D. D. (2023). Pemanfaatan Sistem Informasi Geografis (SIG) untuk pemetaan tingkat rawan longsor menggunakan metode skoring dan overlay di Kabupaten Serang, Banten. <em>Jurnal Sains Geografi</em>, 1(2), 1-11.
							</p>

							<p class="pl-6 -indent-6">
								BMKG Wilayah III (2024). BMKG | Balai Besar MKG Wilayah III Denpasar. Bmkg.go.id. <a href="https://bbmkg3.bmkg.go.id/tentang-gempa" target="_blank" rel="noopener noreferrer" class="text-sky-600 underline hover:text-sky-800">https://bbmkg3.bmkg.go.id/tentang-gempa</a>
							</p>

							<p class="pl-6 -indent-6">
								Haribulan, R., Gosal, P. H., & Karongkong, H. H. (2019). Kajian kerentanan fisik bencana longsor di kecamatan Tomohon Utara. <em>Spasial</em>, 6(3), 714-724.
							</p>

							<p class="pl-6 -indent-6">
								Irawan, L. Y., Syafi'i, I. R., Rosyadi, I., Siswanto, Y., Munawaroh, A., Wardhani, A. K., & Saifanto, B. A. (2020). Analisis Kerawanan Longsor di Kecamatan Jabung, Kabupaten Malang. <em>Jurnal Pendidikan Geografi: Kajian, Teori, dan Praktek dalam Bidang Pendidikan dan Ilmu Geografi</em>, 25(2), 2.
							</p>

							<p class="pl-6 -indent-6">
								Kinanti, A., Awaluddin, M., & Yusuf, M. A. (2023). Analisis Pemetaan Risiko Bencana Tanah Longsor Berbasis Sistem Informasi Geografis (Studi Kasus: Kecamatan Candisari, Kota Semarang). <em>Jurnal Geodesi Undip</em>, 11(3), 121-130.
							</p>

							<p class="pl-6 -indent-6">
								Klaten. (2022). Kesiapsiagaan Menghadapi Bencana Tanah Longsor, Kenali Pra, Saat, dan Pasca Bencananya. BPBD Kab.Klaten. <a href="https://bpbd.klaten.go.id/kenali-pra-saat-dan-pasca-bencana-tanah-longsor" target="_blank" rel="noopener noreferrer" class="text-sky-600 underline hover:text-sky-800">https://bpbd.klaten.go.id/kenali-pra-saat-dan-pasca-bencana-tanah-longsor</a>
							</p>

							<p class="pl-6 -indent-6">
								MAPID. (2023, April 26). [GEODATA] Tanah Longsor. Mapid.co.id. <a href="https://mapid.co.id/blog/[geodata]-tanah-longsor" target="_blank" rel="noopener noreferrer" class="text-sky-600 underline hover:text-sky-800">https://mapid.co.id/blog/[geodata]-tanah-longsor</a>
							</p>

							<p class="pl-6 -indent-6">
								Menteri Pekerjaan Umum. (2007). Peraturan Menteri Pekerjaan Umum No 22/PRT/M/2007 Tentang Pedoman Penataan Ruang Kawasan Rawan Bencana Longsor. <em>Peraturan Menteri Pekerjaan Umum No.22/Prt/M/2007</em>, 22, 1-148.
							</p>

							<p class="pl-6 -indent-6">
								Mitigasi Bencana Tanah Longsor. (2024). Jogjaprov.go.id. <a href="https://bpbd.jogjaprov.go.id/berita/mitigasi-bencana-tanah-longsor-1" target="_blank" rel="noopener noreferrer" class="text-sky-600 underline hover:text-sky-800">https://bpbd.jogjaprov.go.id/berita/mitigasi-bencana-tanah-longsor-1</a>
							</p>

							<p class="pl-6 -indent-6">
								Setiawan, A. R. (2024). Pendugaan Daerah Rawan Bencana Tanah Longsor Berbantuan Sistem Informasi Geografis di Kecamatan Pujon Kabupaten Malang. <em>Geodika: Jurnal Kajian Ilmu dan Pendidikan Geografi</em>, 8(1), 1-10.
							</p>
						</div>
					</div>
				{/if}

				<!-- Whiteboard Footer Navigation Bar -->
				<div class="mt-4 pt-3 border-t border-purple-200 flex items-center justify-between font-bubble">
					<!-- Slide Indicator Dots -->
					<div class="flex items-center space-x-2">
						{#each Array(totalSlides) as _, idx}
							<button
								onclick={() => goToSlide(idx + 1)}
								aria-label={`Go to slide ${idx + 1}`}
								class={`h-2.5 sm:h-3 rounded-full transition-all cursor-pointer ${
									currentSlide === idx + 1 ? 'w-7 sm:w-8 bg-purple-600 shadow-2xs' : 'w-2.5 sm:w-3 bg-slate-300 hover:bg-slate-400'
								}`}
							></button>
						{/each}
					</div>

					<span class="text-xs sm:text-sm font-extrabold text-purple-950 tracking-wide font-bubble">
						Halaman {currentSlide} / {totalSlides}
					</span>
				</div>
			</div>

			<!-- Whiteboard Navigation Arrows (3D Floating Circular Buttons) -->
			<!-- Previous Slide Arrow (Bottom Left) -->
			<button
				onclick={prevSlide}
				onmouseenter={() => sound.playCardHover()}
				disabled={currentSlide === 1}
				aria-label="Halaman Sebelumnya"
				class={`absolute -bottom-5 left-4 sm:left-6 w-11 h-11 sm:w-14 sm:h-14 rounded-full border-3 border-white shadow-xl flex items-center justify-center text-white font-bold transition-all transform active:scale-90 z-30 ${
					currentSlide === 1
						? 'bg-gray-400 opacity-50 cursor-not-allowed'
						: 'bg-gradient-to-b from-purple-400 via-indigo-500 to-purple-700 hover:scale-105 cursor-pointer'
				}`}
				style={currentSlide === 1 ? '' : 'box-shadow: 0 4px 0 0 #4c1d95, 0 8px 15px rgba(0, 0, 0, 0.25);'}
			>
				<svg class="w-6 h-6 sm:w-8 sm:h-8 drop-shadow" fill="none" stroke="currentColor" stroke-width="3.5" viewBox="0 0 24 24">
					<path d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<!-- Next Slide Arrow (Bottom Right) -->
			<button
				onclick={nextSlide}
				onmouseenter={() => sound.playCardHover()}
				disabled={currentSlide === totalSlides}
				aria-label="Halaman Selanjutnya"
				class={`absolute -bottom-5 right-4 sm:right-6 w-11 h-11 sm:w-14 sm:h-14 rounded-full border-3 border-white shadow-xl flex items-center justify-center text-white font-bold transition-all transform active:scale-90 z-30 ${
					currentSlide === totalSlides
						? 'bg-gray-400 opacity-50 cursor-not-allowed'
						: 'bg-gradient-to-b from-purple-400 via-indigo-500 to-purple-700 hover:scale-105 cursor-pointer'
				}`}
				style={currentSlide === totalSlides ? '' : 'box-shadow: 0 4px 0 0 #4c1d95, 0 8px 15px rgba(0, 0, 0, 0.25);'}
			>
				<svg class="w-6 h-6 sm:w-8 sm:h-8 drop-shadow" fill="none" stroke="currentColor" stroke-width="3.5" viewBox="0 0 24 24">
					<path d="M9 5l7 7-7 7" />
				</svg>
			</button>

		</div>

	</div>

	<!-- FOOTER BAR -->
	<footer class="relative z-10 text-center py-1 shrink-0 font-bubble">
		<p class="text-[11px] sm:text-xs font-bold text-slate-500 drop-shadow-xs">
			© 2026 Universitas Negeri Malang — All Rights Reserved
		</p>
	</footer>
</main>
