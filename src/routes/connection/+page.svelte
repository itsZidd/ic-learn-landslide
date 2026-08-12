<script lang="ts">
	import { onMount } from 'svelte';
	import { sound } from '$lib/utils/audio';
	import { saveProgress } from '$lib/utils/progress';
	import LandscapeBackground from '$lib/components/LandscapeBackground.svelte';
	import videoIcon from '$lib/assets/VideoIcon.webp';
	import longsoranTranslasi from '$lib/assets/LongsoranTranslasi.webp';
	import longsoranRotasi from '$lib/assets/LongsoranRotasi.webp';
	import longsoranPergerakanBlok from '$lib/assets/LongsoranPergerakanBlok.webp';
	import jatuhanBatuan from '$lib/assets/JatuhanBatuan.webp';
	import rayapanTanah from '$lib/assets/RayapanTanah.webp';
	import aliranBahanRombakan from '$lib/assets/AliranBahanRombakan.webp';
	import videoBencanaTanahLongsor from '$lib/assets/video/VideoBencanaTanahLongsor.mp4';

	// Slide state (2 Slides Total)
	let currentSlide = $state(1);
	const totalSlides = 2;

	$effect(() => {
		if (currentSlide === totalSlides) {
			saveProgress({ connectionCompleted: true });
		}
	});

	// Active Video Modal state
	let activeVideo = $state<'video1' | 'video2' | 'bencanaLongsor' | null>(null);

	// Image Zoom Modal state
	let zoomedImage = $state<{ src: string; alt: string; title: string } | null>(null);

	const videoLinks = {
		video1: {
			title: 'Video 1: Fenomena Kebencanaan Tanah Longsor',
			embedUrl: 'https://www.youtube.com/embed/zQkFFujICOg?autoplay=1',
			directUrl: 'https://www.youtube.com/watch?v=zQkFFujICOg'
		},
		video2: {
			title: 'Video 2: Faktor Penyebab Bencana Longsor',
			embedUrl: 'https://www.youtube.com/embed/48wfAFbNab8?autoplay=1',
			directUrl: 'https://www.youtube.com/watch?v=48wfAFbNab8'
		}
	};

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

	function openVideo(video: 'video1' | 'video2' | 'bencanaLongsor') {
		sound.playClick();
		activeVideo = video;
	}

	function closeVideo() {
		sound.playClick();
		activeVideo = null;
	}

	function openZoom(src: string, alt: string, title: string) {
		sound.playClick();
		zoomedImage = { src, alt, title };
	}

	function closeZoom() {
		sound.playClick();
		zoomedImage = null;
	}

	const tipeLongsorData = [
		{
			no: 1,
			nama: 'Longsoran Translasi',
			img: longsoranTranslasi,
			keterangan: 'Longsoran translasi merupakan bergeraknya massa tanah dan batuan pada bidang gelincir/ berbentuk rata atau bergelombang.'
		},
		{
			no: 2,
			nama: 'Longsoran Rotasi',
			img: longsoranRotasi,
			keterangan: 'Longsoran rotasi merupakan bergeraknya massa tanah atau batuan pada bidang gelincir berbentuk cekung.'
		},
		{
			no: 3,
			nama: 'Longsoran Pergerakan Blok',
			img: longsoranPergerakanBlok,
			keterangan: 'Longsoran pergerakan blok merupakan tipe longsoran yang terjadi pada suatu massa batuan atau tanah besar (blok) yang bergerak menuruni lereng pada bidang gelincir yang berbentuk rata. Longsoran ini terjadi pada bidang patahan, atau bidang kontak antara two jenis material berbeda seperti lapisan bawah berupa batuan dengan lapisan permukaan atas berupa tanah.'
		},
		{
			no: 4,
			nama: 'Jatuhan Batuan',
			img: jatuhanBatuan,
			keterangan: 'Runtuhan batu merupakan runtuhnya sejumlah batuan atau material yang bergerak kebawah dengan cara jatuh bebas, dan sering terjadi pada daerah lereng batuan yang terjal dan menggantung.'
		},
		{
			no: 5,
			nama: 'Rayapan Tanah',
			img: rayapanTanah,
			keterangan: 'Tipe longsoran ini terjadi akibat adanya gerakan massa tanah yang bergerak lambat, tipe longsoran ini seringkali sulit untuk dikenali, tetapi bisa di tandai dengan miringnya benda berupa pohon, tiang listrik di daerah longsoran.'
		},
		{
			no: 6,
			nama: 'Aliran Bahan Rombakan',
			img: aliranBahanRombakan,
			keterangan: 'Kecepatan longsoran ini dipengaruhi oleh kemiringan lereng dan volume maupun tekanan air. Hasil material yang terangkut oleh longsoran ini menyebar hingga ratusan meter, sehingga sering menelan korban jiwa.'
		}
	];
</script>

<svelte:head>
	<title>Connection - I-CARE LANDSLIDE</title>
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

<!-- VIDEO PLAYER MODAL OVERLAY -->
{#if activeVideo}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
		<div class="relative w-full max-w-4xl bg-slate-900 rounded-3xl border-4 border-amber-400 p-4 sm:p-6 shadow-2xl text-white text-center flex flex-col items-center">
			<!-- Close X Button -->
			<button
				type="button"
				onclick={closeVideo}
				class="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-rose-500 border-2 border-white text-white font-black text-xl flex items-center justify-center hover:bg-rose-600 transition-colors shadow-lg z-20 cursor-pointer"
			>
				✕
			</button>

			{#if activeVideo === 'bencanaLongsor'}
				<h3 class="text-lg sm:text-2xl font-extrabold text-amber-400 mb-3 font-bubble flex items-center space-x-2">
					<span>🎥</span>
					<span>Video Bencana Tanah Longsor</span>
				</h3>

				<!-- Local HTML5 Video Player playing VideoBencanaTanahLongsor.mp4 -->
				<div class="w-full aspect-video bg-black rounded-2xl border-2 border-slate-700 overflow-hidden shadow-inner flex items-center justify-center">
					<!-- svelte-ignore a11y_media_has_caption -->
					<video
						src={videoBencanaTanahLongsor}
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
						type="button"
						onclick={closeVideo}
						class="px-8 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl border-2 border-white shadow-lg cursor-pointer text-xs sm:text-sm transition-all hover:scale-105 active:scale-95"
						style="box-shadow: 0 4px 0 0 #b45309;"
					>
						Tutup Video
					</button>
				</div>
			{:else}
				<div class="w-full flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
					<h3 class="text-base sm:text-xl font-extrabold text-amber-400 font-bubble flex items-center space-x-2">
						<span>🎥</span>
						<span>{videoLinks[activeVideo].title}</span>
					</h3>
					<span class="text-xs bg-red-600 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-sans">YouTube</span>
				</div>

				<div class="w-full aspect-video bg-black rounded-2xl border-2 border-slate-700 overflow-hidden shadow-inner">
					<iframe
						src={videoLinks[activeVideo].embedUrl}
						title={videoLinks[activeVideo].title}
						class="w-full h-full border-0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				</div>

				<!-- Control Buttons (Open on YouTube + Close) -->
				<div class="flex items-center justify-center space-x-3 mt-4 font-bubble">
					<a
						href={videoLinks[activeVideo].directUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl border-2 border-white shadow-lg flex items-center space-x-2 text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
						style="box-shadow: 0 4px 0 0 #991b1b;"
					>
						<span>▶ Buka di YouTube</span>
					</a>
					<button
						type="button"
						onclick={closeVideo}
						class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl border-2 border-white shadow-lg cursor-pointer text-xs sm:text-sm transition-all hover:scale-105 active:scale-95"
						style="box-shadow: 0 4px 0 0 #b45309;"
					>
						Tutup Video
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!-- Responsive Container: Fixed height on large screens, Scrollable on mobile/small screens -->
<main class="relative min-h-screen lg:h-screen lg:h-dvh w-full overflow-y-auto flex flex-col justify-between p-3 sm:p-5 select-none font-bubble">
	<!-- Landscape Vector Environment Background -->
	<LandscapeBackground />

	<!-- TOP HEADER BAR -->
	<header class="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between shrink-0">
		<div class="flex items-center space-x-3 bg-white/85 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/90 shadow-lg">
			<div class="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
				🔗
			</div>
			<div class="flex flex-col">
				<span class="text-xs font-bold text-orange-800 uppercase tracking-wide leading-tight">Room 2</span>
				<span class="text-base sm:text-lg font-extrabold text-orange-950 leading-tight">Connection</span>
			</div>
		</div>

		<!-- Back to Main Menu Button -->
		<a
			href="/"
			onclick={() => sound.playClick()}
			onmouseenter={() => sound.playCardHover()}
			aria-label="Menu Utama"
			class="group relative px-3 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold transform active:scale-95 transition-all hover:scale-105"
			style="box-shadow: 0 4px 0 0 #b45309, 0 8px 15px rgba(0, 0, 0, 0.2);"
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
				<div class="px-6 sm:px-10 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-700 border-3 border-white shadow-xl text-white font-extrabold text-base sm:text-2xl tracking-wide text-shadow whitespace-nowrap">
					Capaian Pembelajaran
				</div>
			</div>

			<!-- Whiteboard Inner Content Canvas -->
			<div class="relative w-full flex-1 bg-[#fffdf7] rounded-2xl border-3 border-[#c4b5a5] p-4 sm:p-8 md:p-10 pt-8 sm:pt-10 text-gray-800 font-sans shadow-inner overflow-y-auto min-h-[380px] sm:min-h-[440px] max-h-[62vh] flex flex-col justify-between">
				
				<!-- SLIDE 1: VIDEO EMBEDS & CAUSAL FACTOR PARAGRAPHS -->
				{#if currentSlide === 1}
					<div class="space-y-6 animate-fade-in font-sans text-sm sm:text-base leading-relaxed text-gray-800 text-justify">
						
						<h2 class="text-base sm:text-xl font-extrabold text-gray-900 border-b-2 border-sky-200 pb-1.5 font-bubble text-left">
							Lihat Video Berikut
						</h2>

						<!-- 3D Glossy Video Button Cards -->
						<div class="my-4 flex items-center justify-center space-x-6 sm:space-x-12">
							
							<!-- Video 1 Button -->
							<button
								type="button"
								onclick={() => openVideo('video1')}
								onmouseenter={() => sound.playCardHover()}
								class="group flex flex-col items-center cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
							>
								<div
									class="relative w-28 sm:w-36 md:w-40 h-22 sm:h-28 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 border-3 border-white shadow-xl rounded-2xl flex items-center justify-center p-2 transition-all group-hover:brightness-105"
									style="box-shadow: 0 5px 0 0 #b45309, 0 8px 15px rgba(0, 0, 0, 0.2);"
								>
									<!-- White Rounded Square Badge Container -->
									<div class="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-amber-300 rounded-2xl shadow-md flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform">
										<img src={videoIcon} alt="Video 1 Icon" class="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
									</div>
								</div>
								<span class="mt-2 text-xs sm:text-sm font-extrabold text-orange-950 italic group-hover:text-orange-600 transition-colors font-bubble">
									Video 1
								</span>
							</button>

							<!-- Video 2 Button -->
							<button
								type="button"
								onclick={() => openVideo('video2')}
								onmouseenter={() => sound.playCardHover()}
								class="group flex flex-col items-center cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
							>
								<div
									class="relative w-28 sm:w-36 md:w-40 h-22 sm:h-28 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 border-3 border-white shadow-xl rounded-2xl flex items-center justify-center p-2 transition-all group-hover:brightness-105"
									style="box-shadow: 0 5px 0 0 #b45309, 0 8px 15px rgba(0, 0, 0, 0.2);"
								>
									<!-- White Rounded Square Badge Container -->
									<div class="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-amber-300 rounded-2xl shadow-md flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform">
										<img src={videoIcon} alt="Video 2 Icon" class="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
									</div>
								</div>
								<span class="mt-2 text-xs sm:text-sm font-extrabold text-orange-950 italic group-hover:text-orange-600 transition-colors font-bubble">
									Video 2
								</span>
							</button>

						</div>

						<p>
							Dapat dicermati bahwa video tersebut menunjukkan adanya fenomena kebencanaan longsor, dan kita tau bahwa longsor merupakan perpindahan atau gerakan massa material berupa tanah, batuan ataupun percampuran antara keduanya yang bergerak kebawah menuruni lereng.
						</p>

						<p>
							Dari video diatas dapat diketahui bahwa kebencanaan longsor yang terjadi merupakan bencana longsor yang diakibatkan oleh faktor alam dan faktor manusia, faktor alam bisa terjadi karena adanya getaran akibat pergeseran lempeng(gempa bumi) maupun runtuhan material batuan dari atas bukit atau aktivitas gunungapi sehingga menyebabkan getaran di permukaan tanah.
						</p>

						<p>
							Selain itu faktor lain yang menyebabkan bencana tanah longsor yaitu adanya intensitas curah hujan yang sangat tinggi, kemiringan lereng yang sangat curam, faktor jenis tanah yang memiliki karakteristik gembur, sehingga tanah mudah menyerap air, mengakibatkan tanah tidak mampu menahan beban air dan menyebabkan tanah tidak stabil, dan kurangnya vegetasi tumbuhan yang memiliki akar dengan daya cengkram yang kuat terhadap tanah seperti pohon berkayu dan tanaman perdu. Sedangkan faktor manusia diakibatkan oleh aktivitas pembukaan lahan baik untuk pertanian, perkebunan, perumahan, dan fasilitas umum seperti jalan dan gedung perkantoran.
						</p>
					</div>
				{/if}

				<!-- SLIDE 2: TIPE LONGSORAN TABLE & DAMPAK BENCANA LANDSLIDE -->
				{#if currentSlide === 2}
					<div class="space-y-5 animate-fade-in font-sans text-sm sm:text-base leading-relaxed text-gray-800">
						
						<p class="text-justify font-medium text-gray-800">
							Tipe tanah longsoran yang paling banyak di Indonesia yaitu tipe longsoran translasi dan rotasi. Semua tipe longsoran ini memiliki potensi untuk memakan korban jiwa dan merugikan dari segi materi dan non materi.
						</p>

						<h3 class="text-center text-sm sm:text-lg font-bold text-gray-900 font-bubble">
							Berikut merupakan tipe longsoran pada tabel
						</h3>

						<!-- MOBILE CARD VIEW (For Small Screens / Mobile Viewports) -->
						<div class="block sm:hidden space-y-3.5">
							{#each tipeLongsorData as item}
								<div class="bg-white border-2 border-amber-300 rounded-2xl p-3.5 shadow-sm space-y-2.5">
									<!-- Number & Name Header Badge -->
									<div class="flex items-center space-x-2.5 bg-gradient-to-r from-amber-100 to-amber-200 p-2 rounded-xl border border-amber-300">
										<span class="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs shrink-0">
											{item.no}
										</span>
										<h4 class="font-extrabold text-xs sm:text-sm text-amber-950 font-bubble">
											{item.nama}
										</h4>
									</div>

									<!-- Illustration Image & Zoom Button -->
									<div class="flex flex-col items-center p-2 bg-amber-50/60 rounded-xl border border-amber-200">
										<img
											src={item.img}
											alt={item.nama}
											class="w-full max-w-[220px] h-auto max-h-36 object-contain rounded-lg shadow-xs"
										/>
										<button
											type="button"
											onclick={() => openZoom(item.img, item.nama, `Ilustrasi ${item.nama}`)}
											class="mt-1.5 bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow flex items-center space-x-1 cursor-pointer font-bubble"
										>
											<span>🔍 Perbesar Gambar</span>
										</button>
									</div>

									<!-- Keterangan Text -->
									<div class="text-xs text-gray-800 text-justify leading-relaxed font-sans pt-1">
										<span class="font-extrabold text-amber-900 block mb-0.5 font-bubble">Keterangan:</span>
										{item.keterangan}
									</div>
								</div>
							{/each}
						</div>

						<!-- DESKTOP / TABLET HTML TABLE VIEW (For Larger Screens) -->
						<div class="hidden sm:block overflow-x-auto rounded-2xl border-2 border-amber-300 shadow-md">
							<table class="w-full min-w-[640px] text-left border-collapse bg-white">
								<thead>
									<tr class="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 text-amber-950 font-extrabold text-xs sm:text-sm uppercase tracking-wider border-b-2 border-amber-400">
										<th class="py-3 px-3 sm:px-4 text-center w-12 border-r border-amber-300 font-bubble">No</th>
										<th class="py-3 px-3 sm:px-4 w-36 sm:w-44 text-center border-r border-amber-300 font-bubble">Tipe Longsor</th>
										<th class="py-3 px-3 sm:px-4 w-48 sm:w-56 text-center border-r border-amber-300 font-bubble">Ilustrasi</th>
										<th class="py-3 px-3 sm:px-4 font-bubble">Keterangan</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-amber-200 text-xs sm:text-sm">
									{#each tipeLongsorData as item}
										<tr class="hover:bg-amber-50/60 transition-colors">
											<!-- No Column (Yellow background like reference image) -->
											<td class="py-3 px-2 text-center align-middle font-bold text-gray-900 bg-amber-100/70 border-r border-amber-200">
												{item.no}
											</td>
											
											<!-- Tipe Longsor Column (Centered Horizontally & Vertically) -->
											<td class="py-3 px-3 sm:px-4 text-center align-middle font-bold text-gray-900 border-r border-amber-200">
												{item.nama}
											</td>

											<!-- Ilustrasi Image Column with Click to Zoom -->
											<td class="py-2 px-2 text-center align-middle border-r border-amber-200">
												<div class="relative group mx-auto w-36 sm:w-48 bg-white p-1 rounded-xl border border-amber-200 shadow-xs flex flex-col items-center">
													<img
														src={item.img}
														alt={item.nama}
														class="w-full h-auto max-h-28 sm:max-h-36 object-contain rounded-lg"
													/>
													<button
														type="button"
														onclick={() => openZoom(item.img, item.nama, `Ilustrasi ${item.nama}`)}
														class="mt-1 bg-amber-700/90 hover:bg-amber-800 text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded shadow flex items-center space-x-1 cursor-pointer font-bubble"
													>
														<span>🔍 Perbesar</span>
													</button>
												</div>
											</td>

											<!-- Keterangan Column -->
											<td class="py-3 px-3 sm:px-4 text-gray-800 text-justify align-middle leading-relaxed">
												{item.keterangan}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						<!-- Table Source Citation -->
						<p class="text-center text-xs sm:text-sm italic font-medium text-gray-600">
							Sumber: (Menteri PUPR Peraturan No.22/Prt/M/2007 dengan modifikasi penulis)
						</p>

						<!-- Section on Landslide Impacts -->
						<div class="space-y-3 pt-2 text-justify">
							<p>
								Dapat dipahami bahwa bencana tanah longsor ini memiliki dampak terhadap masyarakat maupun lingkungan, dikarenakan dari adanya runtuhan material berupa tanah, batuan, maupun campuran keduanya ini dapat menimbun sesuatu yang ada dibawahnya. Dampak yang terjadi akibat dari adanya tanah longsor ini yaitu kerugian material maupun non material, kerugian material meliputi
							</p>

							<!-- Sub-list (a, b, c) -->
							<ol class="list-lower-alpha pl-6 space-y-1.5 text-gray-800 font-medium">
								<li>
									Kerusakan bangunan seperti perkantoran, perumahan, dan tempat ibadah
								</li>
								<li>
									Kerusakan pada lingkungan seperti kerusakan lahan pertanian dan perkebunan, hilangnya vegetasi tutupan lahan, krisis air bersih
								</li>
								<li>
									Kerusakan pada fasilitas umum meliputi jalan, jembatan dan lain sebagainya
								</li>
							</ol>

							<p>
								Dari adanya bencana tanah longsor tentunya dari dampak yang ditimbulkan yaitu terhambatnya perekonomian setempat, dikarenakan akses jalan terputus dan rusaknya harta benda.
							</p>

							<p>
								Sedangkan kerugian non materil merupakan dampak yang mengakibatkan hilangnya nyawa manusia, dari adanya kebencanaan longsor juga dapat merenggut korban jiwa, dan juga memberikan dampak mental dan psikologis terhadap korban selamat, dikarenakan adanya rasa trauma terhadap kebencanaan yang sudah terjadi.
							</p>
						</div>

						<!-- Video Bencana Tanah Longsor Button Card -->
						<div class="my-6 flex flex-col items-center justify-center space-y-2 font-bubble">
							<button
								type="button"
								onclick={() => openVideo('bencanaLongsor')}
								onmouseenter={() => sound.playCardHover()}
								class="group relative px-6 py-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 border-3 border-white shadow-xl rounded-2xl text-white font-extrabold text-xs sm:text-base flex items-center space-x-3.5 transform active:scale-95 transition-all hover:scale-105 cursor-pointer"
								style="box-shadow: 0 5px 0 0 #b45309, 0 10px 25px rgba(0, 0, 0, 0.25);"
							>
								<div class="w-10 h-10 rounded-xl bg-white border-2 border-amber-300 p-1 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
									<img src={videoIcon} alt="Video Icon" class="w-8 h-8 object-contain" />
								</div>
								<span class="tracking-wide text-shadow">Video Bencana Tanah Longsor</span>
							</button>
							<span class="text-xs font-bold text-orange-950 italic">
								Klik untuk menonton video bencana tanah longsor
							</span>
						</div>

					</div>
				{/if}

				<!-- Whiteboard Footer Navigation Bar -->
				<div class="mt-4 pt-3 border-t border-orange-200 flex items-center justify-between font-bubble">
					<!-- Slide Indicator Dots -->
					<div class="flex items-center space-x-2">
						{#each Array(totalSlides) as _, idx}
							<button
								onclick={() => goToSlide(idx + 1)}
								aria-label={`Go to slide ${idx + 1}`}
								class={`h-2.5 sm:h-3 rounded-full transition-all cursor-pointer ${
									currentSlide === idx + 1 ? 'w-7 sm:w-8 bg-orange-600 shadow-2xs' : 'w-2.5 sm:w-3 bg-slate-300 hover:bg-slate-400'
								}`}
							></button>
						{/each}
					</div>

					<span class="text-xs sm:text-sm font-extrabold text-orange-950 tracking-wide font-bubble">
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
						: 'bg-gradient-to-b from-amber-400 via-orange-500 to-amber-700 hover:scale-105 cursor-pointer'
				}`}
				style={currentSlide === 1 ? '' : 'box-shadow: 0 4px 0 0 #b45309, 0 8px 15px rgba(0, 0, 0, 0.25);'}
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
						: 'bg-gradient-to-b from-amber-400 via-orange-500 to-amber-700 hover:scale-105 cursor-pointer'
				}`}
				style={currentSlide === totalSlides ? '' : 'box-shadow: 0 4px 0 0 #b45309, 0 8px 15px rgba(0, 0, 0, 0.25);'}
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

<style>
	.list-lower-alpha {
		list-style-type: lower-alpha;
	}
</style>
