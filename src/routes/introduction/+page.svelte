<script lang="ts">
	import { onMount } from 'svelte';
	import { sound } from '$lib/utils/audio';
	import { saveProgress } from '$lib/utils/progress';
	import LandscapeBackground from '$lib/components/LandscapeBackground.svelte';
	import videoPembentukanGunung from '$lib/assets/video/VideoPembentukanGunung.mp4';
	import videoIcon from '$lib/assets/VideoIcon.png';
	import petaTektonikIndonesia from '$lib/assets/PetaTektonikIndonesia.png';
	import lempengTektonik from '$lib/assets/LempengTektonik.png';
	import petaTopografiKabupatenMalang from '$lib/assets/PetaTopografiKabupatenMalang.png';
	import bentukPermukaanKecamatanJabung from '$lib/assets/BentukPermukaanKecamatanJabung.png';

	// Slide state (4 Slides Total)
	let currentSlide = $state(1);
	const totalSlides = 4;
	let isVideoModalOpen = $state(false);
	let zoomedImage = $state<{ src: string; alt: string; title: string } | null>(null);

	$effect(() => {
		if (currentSlide === totalSlides) {
			saveProgress({ introCompleted: true });
		}
	});

	function nextSlide() {
		if (currentSlide < totalSlides) {
			sound.playClick();
			currentSlide++;
		}
	}

	function prevSlide() {
		if (currentSlide > 1) {
			sound.playClick();
			currentSlide--;
		}
	}

	function goToSlide(slide: number) {
		sound.playClick();
		currentSlide = slide;
	}

	function openVideo() {
		sound.playClick();
		isVideoModalOpen = true;
	}

	function closeVideo() {
		sound.playClick();
		isVideoModalOpen = false;
	}

	function openZoom(src: string, alt: string, title: string) {
		sound.playClick();
		zoomedImage = { src, alt, title };
	}

	function closeZoom() {
		sound.playClick();
		zoomedImage = null;
	}
</script>

<svelte:head>
	<title>Introduction - I-CARE LANDSLIDE</title>
</svelte:head>

<!-- FULL-SCREEN IMAGE ZOOM MODAL -->
{#if zoomedImage}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-sans">
		<button
			type="button"
			onclick={closeZoom}
			class="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center text-xl shadow-xl cursor-pointer"
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
			<div class="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold">
				🔍
			</div>
			<div class="flex flex-col">
				<span class="text-xs font-bold text-teal-800 uppercase tracking-wide leading-tight">Room 1</span>
				<span class="text-base sm:text-lg font-extrabold text-teal-900 leading-tight">Introduction</span>
			</div>
		</div>

		<!-- Back to Main Menu Button -->
		<a
			href="/"
			onclick={() => sound.playClick()}
			onmouseenter={() => sound.playCardHover()}
			aria-label="Menu Utama"
			class="group relative px-3 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-gradient-to-b from-teal-400 to-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold transform active:scale-95 transition-all hover:scale-105"
			style="box-shadow: 0 4px 0 0 #065f46, 0 8px 15px rgba(0, 0, 0, 0.2);"
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
				<div class="px-6 sm:px-10 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-700 border-3 border-white shadow-xl text-white font-extrabold text-base sm:text-2xl tracking-wide text-shadow whitespace-nowrap">
					{#if currentSlide === 1 || currentSlide === 2}
						Informasi Umum
					{:else if currentSlide === 3}
						Peta Konsep Pemahaman
					{:else}
						Pendahuluan
					{/if}
				</div>
			</div>

			<!-- Whiteboard Inner Content Canvas -->
			<div class="relative w-full flex-1 bg-[#fffdf7] rounded-2xl border-3 border-[#c4b5a5] p-4 sm:p-8 md:p-10 pt-8 sm:pt-10 text-gray-800 font-sans shadow-inner overflow-y-auto min-h-[380px] sm:min-h-[440px] max-h-[62vh] flex flex-col justify-between">
				
				<!-- SLIDE 1: INFORMATION UMUM (PETUNJUK & TUJUAN) -->
				{#if currentSlide === 1}
					<div class="space-y-6 animate-fade-in text-justify">
						<div>
							<h2 class="text-base sm:text-xl font-extrabold text-gray-900 border-b-2 border-amber-200 pb-1.5 mb-2">
								Petunjuk Penggunaan Modul
							</h2>
							<p class="text-sm sm:text-base font-medium text-gray-700 leading-relaxed mb-2">
								Untuk mempelajari E-Modul ini, hal hal yang perlu anda lakukan adalah sebagai berikut :
							</p>

							<ol class="list-decimal list-outside pl-5 space-y-1.5 text-sm sm:text-base text-gray-800 leading-relaxed font-normal">
								<li>
									Harus berurutan, karena materi yang mendahului merupakan persyaratan untuk materi selanjutnya.
								</li>
								<li>
									Pahami materi setiap tahapan di setiap room, jika anda mengalami kesulitan, maka pelajari lagi materi yang bersangkutan.
								</li>
								<li>
									Jika ada materi yang susah untuk dipahami, maka diskusikan dengan temanmu, jika masih mendapat kesulitan maka tanyakan kepada guru yang ada pada saat pembelajaran berlangsung.
								</li>
							</ol>
						</div>

						<div>
							<h2 class="text-base sm:text-xl font-extrabold text-gray-900 border-b-2 border-emerald-200 pb-1.5 mb-2">
								Tujuan
							</h2>
							<ol class="list-decimal list-outside pl-5 space-y-1 text-sm sm:text-base text-gray-800 leading-relaxed font-normal">
								<li>Kemampuan memahami data dan informasi geografis.</li>
								<li>Mampu menganalisa secara spasial fenomena geografi dalam kehidupan sehari-hari dan menarik manfaatnya.</li>
								<li>Memahami karakteristik wilayah tempat tinggal dan lingkungan sekitar.</li>
								<li>Memahami proses fenomena tanah longsor yang dipengaruhi oleh lingkungan fisik dan sosial.</li>
								<li>Mengenal cara mitigasi dan adaptasi terhadap bencana alam di lingkungan tempat tinggal.</li>
							</ol>
						</div>
					</div>
				{/if}

				<!-- SLIDE 2: ATP & CP Pemahaman Konsep -->
				{#if currentSlide === 2}
					<div class="space-y-6 animate-fade-in text-justify">
						<div class="bg-amber-50/80 p-4 sm:p-5 rounded-2xl border-2 border-amber-200 shadow-sm">
							<h2 class="text-sm sm:text-base md:text-lg font-black text-amber-900 tracking-wide uppercase mb-2">
								ATP FASE F KELAS XI
							</h2>
							<div class="flex items-start space-x-3 pl-2 text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-relaxed">
								<span class="text-amber-700 font-extrabold shrink-0">11.14</span>
								<span>Merekomendasikan mitigasi bencana berbasis sumberdaya yang didasarkan pada karakteristik wilayah</span>
							</div>
						</div>

						<div class="bg-emerald-50/80 p-4 sm:p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
							<h2 class="text-sm sm:text-base md:text-lg font-black text-emerald-900 tracking-wide uppercase mb-2">
								CP Pemahaman Konsep
							</h2>
							<p class="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed font-medium pl-2">
								Pada akhir fase, peserta didik mampu mengidentifikasi, memahami, mengolah dan menganalisis, serta mengevaluasi secara keruangan tentang Posisi Strategis, Pola Keanekaragaman Hayati Indonesia dan Dunia, Kebencanaan dan Lingkungan Hidup, Kewilayahan dan Pembangunan, serta Kerja sama antar Wilayah, memaparkan ide, dan memublikasikannya.
							</p>
						</div>
					</div>
				{/if}

				<!-- SLIDE 3: Interactive Peta Konsep Concept Map Diagram -->
				{#if currentSlide === 3}
					<div class="space-y-3 animate-fade-in">
						<h2 class="text-center text-base sm:text-xl font-extrabold text-teal-900 mb-1">
							Peta Konsep Pemahaman Materi Kebencanaan Longsor
						</h2>

						<!-- Concept Map Diagram Tree Container -->
						<div class="flex flex-col items-center py-1 font-sans text-xs sm:text-sm max-w-2xl mx-auto w-full">
							
							<!-- Level 1: Top Main Node -->
							<div class="w-full max-w-sm bg-white border-2 border-slate-700 rounded-xl p-2.5 text-center shadow-md font-bold text-slate-800">
								Materi Mitigasi dan Kebencanaan Longsor
							</div>

							<!-- Connector 1: Straight Down Arrow -->
							<div class="flex justify-center my-0.5">
								<svg class="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
									<line x1="12" y1="0" x2="12" y2="18" />
									<polygon points="12,24 7,16 17,16" fill="currentColor" />
								</svg>
							</div>

							<!-- Level 2: Sub Goal Node -->
							<div class="w-full max-w-lg bg-white border-2 border-slate-700 rounded-xl p-2.5 text-center shadow-md font-medium text-slate-700">
								Siswa mampu memahami dan menganalisis kebencanaan longsor berdasarkan karakteristik wilayah
							</div>

							<!-- Connector 2: Fork Split SVG -->
							<div class="w-full flex justify-center my-0.5">
								<svg class="w-full max-w-md h-8 text-slate-700 overflow-visible" viewBox="0 0 400 32" fill="none" stroke="currentColor" stroke-width="2.5">
									<line x1="200" y1="0" x2="200" y2="14" />
									<line x1="75" y1="14" x2="325" y2="14" />
									<line x1="75" y1="14" x2="75" y2="24" />
									<polygon points="75,32 70,22 80,22" fill="currentColor" stroke="none" />
									<line x1="325" y1="14" x2="325" y2="24" />
									<polygon points="325,32 320,22 330,22" fill="currentColor" stroke="none" />
								</svg>
							</div>

							<!-- Level 3: Introduction & Connection Side-by-Side Nodes -->
							<div class="w-full grid grid-cols-2 gap-3 sm:gap-6">
								<!-- Introduction Node -->
								<div class="bg-[#e0f7fa] border-2 border-[#20b2aa] rounded-xl p-2.5 sm:p-3 text-center shadow-md">
									<h3 class="font-extrabold text-[#00796b] text-xs sm:text-sm mb-1">Introduction</h3>
									<p class="text-[11px] sm:text-xs text-gray-700 leading-snug">Siswa diperkenalkan memahami kebencanaan longsor</p>
								</div>

								<!-- Connection Node -->
								<div class="bg-[#fbe9e7] border-2 border-[#ff7043] rounded-xl p-2.5 sm:p-3 text-center shadow-md">
									<h3 class="font-extrabold text-[#d84315] text-xs sm:text-sm mb-1">Connection</h3>
									<p class="text-[11px] sm:text-xs text-gray-700 leading-snug">Siswa menghubungkan fenomena kebencanaan longsor dengan kehidupan sehari-hari</p>
								</div>
							</div>

							<!-- Connector 3: Merge SVG -->
							<div class="w-full flex justify-center my-0.5">
								<svg class="w-full max-w-md h-8 text-slate-700 overflow-visible" viewBox="0 0 400 32" fill="none" stroke="currentColor" stroke-width="2.5">
									<line x1="75" y1="0" x2="75" y2="14" />
									<line x1="325" y1="0" x2="325" y2="14" />
									<line x1="75" y1="14" x2="325" y2="14" />
									<line x1="200" y1="14" x2="200" y2="24" />
									<polygon points="200,32 195,22 205,22" fill="currentColor" stroke="none" />
								</svg>
							</div>

							<!-- Level 4: Application Node -->
							<div class="w-full max-w-lg bg-[#e1f5fe] border-2 border-[#00b0ff] rounded-xl p-2.5 sm:p-3 text-center shadow-md">
								<h3 class="font-extrabold text-[#0277bd] text-xs sm:text-sm mb-1">Application</h3>
								<p class="text-[11px] sm:text-xs text-gray-700 leading-snug">
									Siswa menerapkan pengetahuan sebelumnya dengan pengetahuan yang sudah didapatkan mengenai kebencanaan longsor di Jabung
								</p>
							</div>

							<!-- Connector 4: Straight Down Arrow -->
							<div class="flex justify-center my-0.5">
								<svg class="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
									<line x1="12" y1="0" x2="12" y2="18" />
									<polygon points="12,24 7,16 17,16" fill="currentColor" />
								</svg>
							</div>

							<!-- Level 5: Reflection Node -->
							<div class="w-full max-w-md bg-[#fffde7] border-2 border-[#fbc02d] rounded-xl p-2.5 sm:p-3 text-center shadow-md">
								<h3 class="font-extrabold text-[#f57f17] text-xs sm:text-sm mb-1">Reflection</h3>
								<p class="text-[11px] sm:text-xs text-gray-700 leading-snug">
									Siswa diberikan soal evaluasi ataupun kuis mengenai kebencanaan longsor
								</p>
							</div>

						</div>
					</div>
				{/if}

				<!-- SLIDE 4: UNIFIED PENDAHULUAN SLIDE WITH REAL IMAGE ASSETS -->
				{#if currentSlide === 4}
					<div class="space-y-6 animate-fade-in font-sans text-sm sm:text-base leading-relaxed text-gray-800 text-justify pr-1">
						
						<!-- SECTION A: PENDAHULUAN ASTRONOMIS & GEOLOGIS -->
						<div class="space-y-3">
							<h2 class="text-base sm:text-2xl font-extrabold text-gray-900 border-b-2 border-teal-200 pb-1.5 uppercase font-bubble text-left">
								PENDAHULUAN
							</h2>
							
							<p>
								Indonesia merupakan negara yang memiliki kepulauan terbesar, dan terletak di lintang rendah, dengan di lewati garis equator, dan secara astronomis Indonesia berada di <strong>6° LU - 11° LS</strong> dan <strong>95° BT - 141° BT</strong>, dan berada di antara Samudra Hindia dan Pasifik, serta diantara Benua Asia dan Australia. Indonesia merupakan negara yang beriklim tropis dengan memiliki dua cuaca, yaitu kemarau dan penghujan. Musim kemarau terjadi antara bulan April-September, sedangkan musim penghujan terjadi antara bulan Oktober-April.
							</p>

							<p class="font-medium text-teal-900">
								Mengingat Indonesia merupakan pertemuan dari tiga lempeng besar, yaitu <strong>Lempeng Eurasia</strong>, <strong>Lempeng Indo-Australia</strong>, dan <strong>Lempeng Pasifik</strong>.
							</p>

							<!-- GAMBAR 1: PETA TEKTONIK INDONESIA IMAGE CARD -->
							<div class="my-3 p-3 sm:p-4 bg-gradient-to-br from-amber-50 via-teal-50 to-emerald-50 rounded-2xl border-2 border-teal-300 shadow-md flex flex-col items-center">
								<div class="w-full max-w-2xl bg-white p-2.5 rounded-xl border border-teal-400 shadow-sm relative group flex flex-col items-center text-center">
									<img
										src={petaTektonikIndonesia}
										alt="Gambar 1 Peta Tektonik Indonesia"
										class="w-full h-auto max-h-[280px] sm:max-h-[360px] object-contain rounded-lg shadow-sm"
									/>
									<button
										type="button"
										onclick={() => openZoom(petaTektonikIndonesia, 'Gambar 1 Peta Tektonik Indonesia', 'Gambar 1 Peta Tektonik Indonesia (BMKG Wilayah III)')}
										class="absolute bottom-10 right-4 bg-teal-900/90 hover:bg-teal-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-xs flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
									>
										<span>🔍 Perbesar Gambar</span>
									</button>
									<p class="text-xs sm:text-sm font-bold text-teal-900 italic mt-2.5 font-bubble">
										Gambar 1 Peta Tektonik Indonesia (BMKG Wilayah III)
									</p>
								</div>
							</div>
						</div>

						<!-- SECTION B: TEKTONIK, RING OF FIRE & VIDEO BUTTON -->
						<div class="space-y-3 pt-3 border-t-2 border-dashed border-gray-200">
							<p>
								Dapat diketahui dari gambar tersebut Negara Indonesia berada di wilayah strategis pertemuan lempeng, sehingga menyebabkan adanya tumbukan lempeng <em>subduksi</em>.
							</p>

							<!-- Interactive Video Card Button styled with glossy 3D app aesthetic -->
							<div class="my-4 flex flex-col items-center justify-center space-y-2 font-bubble">
								<button
									onclick={openVideo}
									onmouseenter={() => sound.playCardHover()}
									class="group relative px-6 py-3.5 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-700 border-3 border-white shadow-xl rounded-2xl text-white font-extrabold text-xs sm:text-base flex items-center space-x-3.5 transform active:scale-95 transition-all hover:scale-105 cursor-pointer"
									style="box-shadow: 0 5px 0 0 #047857, 0 10px 25px rgba(0, 0, 0, 0.25);"
								>
									<!-- 3D Glossy White Clapperboard Pill Icon with VideoIcon.png -->
									<div class="w-10 h-10 rounded-xl bg-white border-2 border-teal-300 p-1 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
										<img src={videoIcon} alt="Video Icon" class="w-8 h-8 object-contain" />
									</div>
									<span class="tracking-wide text-shadow">Video Proses Pembentukan Gunung</span>
								</button>
								<span class="text-xs font-bold text-teal-950 italic">
									Klik untuk menonton video proses pembentukan gunung
								</span>
							</div>

							<p class="leading-relaxed">
								Dapat dilihat pada gambar diatas, negara Indonesia berada pada area penunjaman (<em>subduksi</em>) lempeng, sehingga dari adanya tumbukan lempeng tersebut mengakibatkan lempeng Indo-Australia mengalami penunjaman kebawah dan menyebabkan dataran Indonesia terangkat dan membentuk Pegunungan Aktif (<em>Ring Of Fire</em>), dimana pada serangkaian tersebut menyebabkan topografi negara Indonesia memiliki bentuk yang bergelombang dan memiliki banyak pegunungan, serta dari adanya tumbukan lempeng tersebut menyebabkan permukaan bumi mengalami proses lipatan dan pengangkatan. Hal ini menyebabkan Indonesia memiliki ancaman bencana yang kompleks, mulai dari gempa bumi, gunung meletus, tsunami, tanah longsor.
							</p>

							<!-- GAMBAR 2: LEMPENG TEKTONIK IMAGE CARD -->
							<div class="my-3 p-3 sm:p-4 bg-amber-50/80 rounded-2xl border-2 border-amber-200 shadow-sm flex flex-col items-center">
								<div class="w-full max-w-2xl bg-white p-2.5 rounded-xl border border-amber-300 shadow-sm relative group flex flex-col items-center text-center">
									<img
										src={lempengTektonik}
										alt="Gambar 2 Lempeng Tektonik"
										class="w-full h-auto max-h-[280px] sm:max-h-[360px] object-contain rounded-lg shadow-sm"
									/>
									<button
										type="button"
										onclick={() => openZoom(lempengTektonik, 'Gambar 2 Lempeng Tektonik', 'Gambar 2 Lempeng Tektonik (BMKG Wilayah III)')}
										class="absolute bottom-10 right-4 bg-amber-900/90 hover:bg-amber-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-xs flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
									>
										<span>🔍 Perbesar Gambar</span>
									</button>
									<p class="text-xs sm:text-sm font-bold text-amber-900 italic mt-2.5 font-bubble">
										Gambar 2 Lempeng Tektonik (BMKG Wilayah III)
									</p>
								</div>
							</div>
						</div>

						<!-- SECTION C: TOPOGRAFI KABUPATEN MALANG & KECAMATAN JABUNG -->
						<div class="space-y-3 pt-3 border-t-2 border-dashed border-gray-200">
							<h3 class="text-sm sm:text-lg font-bold text-teal-900 uppercase text-left">
								WILAYAH STUDI (KABUPATEN MALANG & KECAMATAN JABUNG)
							</h3>

							<!-- GAMBAR 3: PETA TOPOGRAFI KABUPATEN MALANG IMAGE CARD -->
							<div class="p-3 sm:p-4 bg-amber-50/80 rounded-2xl border-2 border-amber-200 shadow-sm flex flex-col items-center">
								<div class="w-full max-w-2xl bg-white p-2.5 rounded-xl border border-amber-300 shadow-sm relative group flex flex-col items-center text-center">
									<img
										src={petaTopografiKabupatenMalang}
										alt="Gambar 3 Peta Topografi Kabupaten Malang"
										class="w-full h-auto max-h-[280px] sm:max-h-[360px] object-contain rounded-lg shadow-sm"
									/>
									<button
										type="button"
										onclick={() => openZoom(petaTopografiKabupatenMalang, 'Gambar 3 Peta Topografi Kabupaten Malang', 'Gambar 3 Peta Topografi Kabupaten Malang (Peta tematik Indonesia)')}
										class="absolute bottom-10 right-4 bg-amber-900/90 hover:bg-amber-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-xs flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
									>
										<span>🔍 Perbesar Gambar</span>
									</button>
									<p class="text-xs sm:text-sm font-bold text-amber-900 italic mt-2 font-bubble">
										Gambar 3 Peta Topografi Kabupaten Malang (Peta tematik Indonesia)
									</p>
								</div>
							</div>

							<p class="leading-relaxed">
								Dapat dilihat pada peta topografi Kabupaten Malang yang merupakan wilayah yang memiliki permukaan bervariasi mulai dataran hingga bergelombang akibat hasil dari adanya proses endogen atau aktivitas lempeng, sehingga menciptakan pegunungan api aktif salah satunya yaitu gunung Bromo. Pada saat musim penghujan, bencana yang sering mengancam masyarakat di Kecamatan Jabung yaitu bencana tanah longsor, dikarenakan wilayah ini memiliki kemiringan lereng yang cukup terjal dan didukung dengan parameter (faktor lain) lain seperti curah hujan, jenis tanah, tutupan dan penggunaan lahan akibat aktivitas manusia. Terutama di wilayah Kecamatan Jabung yang wilayahnya berada pada lereng serangkaian gunung Bromo.
							</p>

							<!-- GAMBAR 4: BENTUK PERMUKAAN KECAMATAN JABUNG IMAGE CARD -->
							<div class="p-3 sm:p-4 bg-emerald-50/80 rounded-2xl border-2 border-emerald-200 shadow-sm flex flex-col items-center">
								<div class="w-full max-w-2xl bg-white p-2.5 rounded-xl border border-emerald-300 shadow-sm relative group flex flex-col items-center text-center">
									<img
										src={bentukPermukaanKecamatanJabung}
										alt="Gambar 4 Bentuk Permukaan Kecamatan Jabung"
										class="w-full h-auto max-h-[280px] sm:max-h-[360px] object-contain rounded-lg shadow-sm"
									/>
									<button
										type="button"
										onclick={() => openZoom(bentukPermukaanKecamatanJabung, 'Gambar 4 Bentuk Permukaan Kecamatan Jabung', 'Gambar 4 Bentuk Permukaan Kecamatan Jabung')}
										class="absolute bottom-10 right-4 bg-emerald-900/90 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-xs flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer font-bubble"
									>
										<span>🔍 Perbesar Gambar</span>
									</button>
									<p class="text-xs sm:text-sm font-bold text-emerald-900 italic mt-2.5 font-bubble">
										Gambar 4 Bentuk Permukaan Kecamatan Jabung
									</p>
								</div>
							</div>

							<!-- Non-bold Jabung concluding sentence -->
							<p class="text-gray-800 leading-relaxed font-normal">
								Dapat dilihat bahwa topografi di wilayah Kecamatan Jabung memiliki bentukan topografi yang sangat terjal.
							</p>
						</div>

					</div>
				{/if}

				<!-- Whiteboard Footer Navigation Bar -->
				<div class="mt-4 pt-3 border-t border-teal-200 flex items-center justify-between font-bubble">
					<!-- Slide Indicator Dots -->
					<div class="flex items-center space-x-2">
						{#each Array(totalSlides) as _, idx}
							<button
								onclick={() => goToSlide(idx + 1)}
								aria-label={`Go to slide ${idx + 1}`}
								class={`h-2.5 sm:h-3 rounded-full transition-all cursor-pointer ${
									currentSlide === idx + 1 ? 'w-7 sm:w-8 bg-teal-600 shadow-2xs' : 'w-2.5 sm:w-3 bg-slate-300 hover:bg-slate-400'
								}`}
							></button>
						{/each}
					</div>

					<span class="text-xs sm:text-sm font-extrabold text-teal-950 tracking-wide font-bubble">
						Halaman {currentSlide} / {totalSlides}
					</span>
				</div>
			</div>

			<!-- Whiteboard Navigation Arrows -->
			<!-- Previous Slide Arrow (Bottom Left) -->
			<button
				onclick={prevSlide}
				onmouseenter={() => sound.playCardHover()}
				disabled={currentSlide === 1}
				aria-label="Halaman Sebelumnya"
				class={`absolute -bottom-5 left-4 sm:left-6 w-11 h-11 sm:w-14 sm:h-14 rounded-full border-3 border-white shadow-xl flex items-center justify-center text-white font-bold transition-all transform active:scale-90 z-30 ${
					currentSlide === 1
						? 'bg-gray-400 opacity-50 cursor-not-allowed'
						: 'bg-gradient-to-b from-teal-400 via-emerald-500 to-teal-700 hover:scale-105 cursor-pointer'
				}`}
				style={currentSlide === 1 ? '' : 'box-shadow: 0 4px 0 0 #047857, 0 8px 15px rgba(0, 0, 0, 0.25);'}
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
						: 'bg-gradient-to-b from-teal-400 via-emerald-500 to-teal-700 hover:scale-105 cursor-pointer'
				}`}
				style={currentSlide === totalSlides ? '' : 'box-shadow: 0 4px 0 0 #047857, 0 8px 15px rgba(0, 0, 0, 0.25);'}
			>
				<svg class="w-6 h-6 sm:w-8 sm:h-8 drop-shadow" fill="none" stroke="currentColor" stroke-width="3.5" viewBox="0 0 24 24">
					<path d="M9 5l7 7-7 7" />
				</svg>
			</button>

		</div>

	</div>

	<!-- REAL MP4 VIDEO MODAL PLAYER -->
	{#if isVideoModalOpen}
		<div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
			<div class="relative w-full max-w-4xl bg-slate-900 rounded-3xl border-4 border-emerald-400 p-4 sm:p-6 shadow-2xl text-white font-sans text-center flex flex-col items-center">
				<!-- Close X Button -->
				<button
					onclick={closeVideo}
					class="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-rose-500 border-2 border-white text-white font-black text-xl flex items-center justify-center hover:bg-rose-600 transition-colors shadow-lg z-20 cursor-pointer"
				>
					✕
				</button>

				<h3 class="text-lg sm:text-2xl font-extrabold text-emerald-400 mb-3 font-bubble">
					🎥 Video Proses Pembentukan Gunung
				</h3>

				<!-- Real HTML5 Video Player playing VideoPembentukanGunung.mp4 -->
				<div class="w-full aspect-video bg-black rounded-2xl border-2 border-slate-700 overflow-hidden shadow-inner flex items-center justify-center">
					<!-- svelte-ignore a11y_media_has_caption -->
					<video
						src={videoPembentukanGunung}
						controls
						autoplay
						playsinline
						class="w-full h-full object-contain"
					>
						Browser Anda tidak mendukung pemutar video MP4.
					</video>
				</div>

				<div class="flex items-center justify-center space-x-3 mt-4 font-bubble">
					<button
						onclick={closeVideo}
						class="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl border-2 border-white shadow-lg cursor-pointer text-xs sm:text-sm transition-all hover:scale-105 active:scale-95"
						style="box-shadow: 0 4px 0 0 #047857;"
					>
						Tutup Video
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- FOOTER BAR -->
	<footer class="relative z-10 text-center py-1 shrink-0 font-bubble">
		<p class="text-[11px] sm:text-xs font-bold text-slate-500 drop-shadow-xs">
			© 2026 Universitas Negeri Malang — All Rights Reserved
		</p>
	</footer>
</main>
