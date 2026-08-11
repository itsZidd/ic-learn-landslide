<script lang="ts">
	import { onMount } from 'svelte';
	import { sound } from '$lib/utils/audio';
	import LandscapeBackground from '$lib/components/LandscapeBackground.svelte';
	import girlCharacter2 from '$lib/assets/GirlCharacter2.webp';
	import boyCharacterPassed from '$lib/assets/BoyCharacterPassed.webp';
	import boyCharacterFailed from '$lib/assets/BoyCharacterFailed.webp';
	import petaJabung from '$lib/assets/PetaKerawananLongsorKecamatanJabung.webp';
	import topografiDusunKrajan1 from '$lib/assets/TopografiDusunKrajan1.webp';
	import soal7Gambar from '$lib/assets/Soal7Gambar.webp';
	import soal10Gambar from '$lib/assets/Soal10Gambar.webp';
	import { saveProgress, getProgress } from '$lib/utils/progress';
	import { env } from '$env/dynamic/public';

	let showDevTools = $derived(env.PUBLIC_SHOW_DEV_TOOLS === 'true');

	let activeMode = $state<'menu' | 'quiz' | 'score' | 'review' | 'essay'>('menu');
	let currentQuestionIndex = $state(0);
	let selectedAnswers = $state<number[]>(Array(10).fill(-1));
	
	// Essay Answers state
	let essayAnswerA = $state('');
	let essayAnswerB = $state('');
	let essayAnswerC = $state('');
	
	let isEssayReviewModalOpen = $state(false);
	let isMapZoomed = $state(false);
	let zoomedImage = $state<{ src: string; alt: string; title: string } | null>(null);

	// Dev simulation override for testing passed/failed screens
	let devSimulatePass = $state<boolean | null>(null);

	// AI Essay Evaluation & Attempt Limits state
	let isEvaluatingEssay = $state(false);
	let essayEvaluationResult = $state<{
		score: number;
		feedback: string;
		provider?: string;
		rubric?: { a: number; b: number; c: number };
	} | null>(null);
	let essayErrorMessage = $state('');

	let studentProgressState = $state(getProgress());
	let attemptsCount = $state(0);
	let lastSubmittedTs = $state(0);
	let cooldownRemainingSeconds = $state(0);
	let cooldownTimer: any = null;

	function startCooldownTimer() {
		if (cooldownTimer) clearInterval(cooldownTimer);

		const calculateRemaining = () => {
			if (!lastSubmittedTs) return 0;
			const elapsed = Math.floor((Date.now() - lastSubmittedTs) / 1000);
			return Math.max(0, 60 - elapsed);
		};

		cooldownRemainingSeconds = calculateRemaining();

		if (cooldownRemainingSeconds > 0) {
			cooldownTimer = setInterval(() => {
				const remaining = calculateRemaining();
				cooldownRemainingSeconds = remaining;
				if (remaining <= 0) {
					clearInterval(cooldownTimer);
					cooldownTimer = null;
				}
			}, 1000);
		}
	}

	onMount(() => {
		const latestProgress = getProgress();
		studentProgressState = latestProgress;
		attemptsCount = latestProgress.essayAttemptsCount || 0;
		lastSubmittedTs = latestProgress.lastEssaySubmittedTimestamp || 0;
		startCooldownTimer();

		return () => {
			if (cooldownTimer) clearInterval(cooldownTimer);
		};
	});

	$effect(() => {
		const latestProgress = getProgress();
		studentProgressState = latestProgress;
		attemptsCount = latestProgress.essayAttemptsCount || 0;
		const newLastTs = latestProgress.lastEssaySubmittedTimestamp || 0;
		if (newLastTs !== lastSubmittedTs) {
			lastSubmittedTs = newLastTs;
			startCooldownTimer();
		}
	});

	const quizQuestions = [
		{
			id: 1,
			question: 'Definisi yang paling tepat untuk menjelaskan fenomena tanah longsor adalah?',
			options: [
				'A. Proses terjadinya pergeseran pada permukaan tanah yang disebabkan oleh tektonisme',
				'B. Proses terjadinya pergerakan massa tanah yang disebabkan oleh angin dan air',
				'C. Proses terjadinya pergerakan material tanah menuruni lereng yang disebabkan oleh air hujan',
				'D. Proses pengikisan material tanah yang disebabkan oleh adanya angin'
			],
			correctAnswerIndex: 2
		},
		{
			id: 2,
			question: `Perhatikan poin di bawah ini:
1. Intensitas curah hujan yang tinggi
2. Daerah yang memiliki vegetasi rapat
3. Perkebunan dengan menggunakan sistem agroforestri
4. Pengadaan kegiatan reboisasi di kawasan rentan longsor
5. Daerah yang memiliki kemiringan lereng curam

Faktor utama yang menjadi penyebab terjadinya bencana tanah longsor adalah?`,
			options: ['A. 1,5', 'B. 3,4', 'C. 2,5', 'D. 1,4'],
			correctAnswerIndex: 0
		},
		{
			id: 3,
			question: 'Salah satu faktor yang menyebabkan bencana longsor adalah alih fungsi lahan yang dilakukan oleh manusia. Berikut ini merupakan jenis tutupan lahan yang dapat menyebabkan kebencanaan longsor adalah…',
			options: [
				'A. Tutupan lahan berupa permukiman',
				'B. Tutupan lahan berupa vegetasi rapat',
				'C. Tutupan lahan berupa Terassering',
				'D. Tutupan lahan berupa hutan Lindung'
			],
			correctAnswerIndex: 0
		},
		{
			id: 4,
			question: `Perhatikan poin di bawah ini:
1. Membangun rumah atau bangunan di area rawan risiko tanah longsor
2. Melakukan konservasi lahan dengan menanam pohon
3. Membuka lahan dengan menebang pohon di sekitaran lereng
4. Membangun jalan dengan memotong lereng tanpa memperhitungkan dampaknya
5. Tidak membangun gedung atau rumah di daerah lereng bukit yang curam

Berikut yang termasuk upaya untuk meminimalisir terjadinya kebencanaan longsor adalah…`,
			options: [
				'A. 3, 2',
				'B. 2, 5',
				'C. 1, 4',
				'D. 4, 5'
			],
			correctAnswerIndex: 1
		},
		{
			id: 5,
			question: 'Pergerakan massa batuan atau tanah karena ketidakstabilan akan menyebabkan…',
			options: ['A. Longsor', 'B. Abrasi', 'C. Tsunami', 'D. Erosi'],
			correctAnswerIndex: 0
		},
		{
			id: 6,
			hasTable: true,
			question: 'Perhatikan tabel berikut',
			options: [
				'A. A1, B1, C2',
				'B. A2, B2, C1',
				'C. A3, B3, C3',
				'D. A1, B2, C3'
			],
			correctAnswerIndex: 0
		},
		{
			id: 7,
			hasImage: true,
			imageSrc: soal7Gambar,
			imageAlt: 'Restorasi Lahan Terassering Jabung',
			question: `Perhatikan gambar dibawah ini!
Langkah-langkah untuk merestorasi lahan yang ada di Kecamatan Jabung tersebut adalah…`,
			options: [
				'A. Memangkas lahan menggunakan alat berat',
				'B. Memberikan pupuk kimia',
				'C. Menanami tanaman yang memiliki perakaran kuat',
				'D. Memberikan tutupan berupa paving'
			],
			correctAnswerIndex: 2
		},
		{
			id: 8,
			question: `Di Kecamatan Pujon, telah terjadi bencana tanah longsor dikarenakan intensitas curah hujan yang tinggi dan terjadi selama dua hari berturut-turut. Pemerintah dan masyarakat telah melakukan penanaman pohon dan pembuatan saluran air, tetapi tanah longsor tetap terjadi dan menimbulkan kerugian materi dan menutup akses jalan utama.

Jika anda menjadi seorang geografer, langkah apa yang paling tepat untuk mengevaluasi dan memperbaiki strategi mitigasi, bagaimana agar longsor tidak terjadi kembali?`,
			options: [
				'A. Pemantauan secara berkala area yang memiliki risiko longsor dan memperbaiki saluran air secara tepat',
				'B. Mengandalkan doa dan tradisi masyarakat lokal untuk mencegah terjadinya tanah longsor',
				'C. Menanam lebih banyak pohon tanpa evaluasi tempat kerawanan longsor',
				'D. Menghentikan semua upaya mitigasi kebencanaan longsor karena tidak efektif dan merugikan warga'
			],
			correctAnswerIndex: 0
		},
		{
			id: 9,
			question: `Perhatikan poin di bawah ini:
1. Peta Curah Hujan
2. Peta Administrasi
3. Peta Kadaster
4. Peta Jenis Batuan
5. Peta Kepadatan Penduduk

Sebagai seorang geografer, peta yang dibutuhkan ketika menandai wilayah rawan longsor adalah…`,
			options: [
				'A. 1 dan 2',
				'B. 1 dan 4',
				'C. 1 dan 3',
				'D. 1 dan 5'
			],
			correctAnswerIndex: 1
		},
		{
			id: 10,
			hasImage: true,
			imageSrc: soal10Gambar,
			imageAlt: 'Faktor Longsor Translasi Kecamatan Jabung',
			question: `Perhatikan gambar di bawah ini
Kecamatan Jabung merupakan wilayah yang sering terjadi longsor dengan tipe translasi. Berikut yang merupakan faktor terjadinya longsor di Jabung…`,
			options: [
				'A. Terdapat sistem drainase yang tepat',
				'B. Tanah yang padat serta jenis tanah yang tidak jenuh air',
				'C. Kemiringan lereng kurang dari 40°',
				'D. Pemotongan lereng akibat pembangunan jalan'
			],
			correctAnswerIndex: 3
		}
	];

	// Derived score calculations
	let rawCorrectCount = $derived(
		selectedAnswers.reduce((acc, ans, idx) => {
			return ans === quizQuestions[idx].correctAnswerIndex ? acc + 1 : acc;
		}, 0)
	);

	let scorePercentage = $derived(rawCorrectCount * 10);
	let pointsCount = $derived(rawCorrectCount * 100);

	// Passing threshold: 70%
	let isPassed = $derived(
		devSimulatePass !== null ? devSimulatePass : scorePercentage >= 70
	);

	function startQuiz() {
		sound.playClick();
		selectedAnswers = Array(10).fill(-1);
		currentQuestionIndex = 0;
		devSimulatePass = null;
		activeMode = 'quiz';
	}

	function startEssay() {
		sound.playClick();
		activeMode = 'essay';
	}

	function selectOption(optIndex: number) {
		sound.playClick();
		selectedAnswers[currentQuestionIndex] = optIndex;
	}

	function nextQuestion() {
		sound.playClick();
		if (currentQuestionIndex < quizQuestions.length - 1) {
			currentQuestionIndex++;
		} else {
			const currentBestQuiz = studentProgressState.quizScore || 0;
			const newBestQuiz = Math.max(currentBestQuiz, scorePercentage);
			const passed = isPassed || newBestQuiz >= 70;

			saveProgress({
				reflectionQuizPassed: passed,
				quizScore: newBestQuiz
			});
			studentProgressState = getProgress();
			activeMode = 'score';
		}
	}

	function prevQuestion() {
		sound.playClick();
		if (currentQuestionIndex > 0) {
			currentQuestionIndex--;
		}
	}

	function backToQuizMenu() {
		sound.playClick();
		activeMode = 'menu';
	}

	function openReview() {
		sound.playClick();
		currentQuestionIndex = 0;
		activeMode = 'review';
	}

	function simulateResultScreen(passed: boolean) {
		sound.playClick();
		devSimulatePass = passed;
		activeMode = 'score';
	}

	async function handleSaveEssay() {
		sound.playClick();
		if (!essayAnswerA.trim() || !essayAnswerB.trim() || !essayAnswerC.trim()) {
			essayErrorMessage = '⚠️ Seluruh 3 pertanyaan esai wajib diisi dengan lengkap!';
			return;
		}

		if (attemptsCount >= 3) {
			essayErrorMessage = '⚠️ Anda telah mencapai batas maksimal 3 kali pengiriman esai!';
			return;
		}

		if (cooldownRemainingSeconds > 0) {
			essayErrorMessage = `⏱️ Harap tunggu ${cooldownRemainingSeconds} detik sebelum mengirim kembali!`;
			return;
		}

		isEvaluatingEssay = true;
		essayErrorMessage = '';

		try {
			const res = await fetch('/api/evaluate-essay', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					answerA: essayAnswerA,
					answerB: essayAnswerB,
					answerC: essayAnswerC
				})
			});

			const data = await res.json();
			if (!res.ok || data.status === 'error') {
				essayErrorMessage = data.message || 'Gagal mengevaluasi esai. Silakan coba lagi.';
				isEvaluatingEssay = false;
				return;
			}

			// Calculate new best score
			const currentBest = studentProgressState.essayScore || 0;
			const newBestScore = Math.max(currentBest, data.score);
			const newAttempts = attemptsCount + 1;
			const nowTs = Date.now();

			saveProgress({
				reflectionEssayCompleted: true,
				essayScore: newBestScore,
				essayAttemptsCount: newAttempts,
				lastEssaySubmittedTimestamp: nowTs,
				latestEssayAnswerA: essayAnswerA,
				latestEssayAnswerB: essayAnswerB,
				latestEssayAnswerC: essayAnswerC,
				latestEssayFeedback: data.feedback,
				latestEssayRubric: data.rubric
			});

			studentProgressState = getProgress();
			attemptsCount = newAttempts;
			lastSubmittedTs = nowTs;
			startCooldownTimer();

			essayEvaluationResult = {
				score: data.score,
				feedback: data.feedback,
				provider: data.provider,
				rubric: data.rubric
			};

			isEvaluatingEssay = false;
		} catch (err: any) {
			essayErrorMessage = '⚠️ Gagal terhubung ke server evaluasi AI: ' + (err.message || 'Error');
			isEvaluatingEssay = false;
		}
	}

	function parseQuestionText(q: string) {
		const lines = q.split('\n').map((l) => l.trim()).filter(Boolean);
		const introLines: string[] = [];
		const items: string[] = [];
		const outroLines: string[] = [];

		let inItems = false;
		let doneItems = false;

		for (const line of lines) {
			const match = line.match(/^(\d+)\.\s*(.+)$/);
			if (match && !doneItems) {
				inItems = true;
				items.push(match[2]);
			} else if (inItems && !match) {
				doneItems = true;
				outroLines.push(line);
			} else if (!inItems) {
				introLines.push(line);
			} else if (doneItems) {
				outroLines.push(line);
			}
		}

		if (items.length === 0) {
			return { isList: false, fullText: q };
		}

		return {
			isList: true,
			intro: introLines.join(' '),
			items,
			outro: outroLines.join(' ')
		};
	}
</script>

<!-- Essay Review Per Soal Modal Component -->
{#if isEssayReviewModalOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in font-sans"
		onclick={(e) => {
			if (e.target === e.currentTarget) isEssayReviewModalOpen = false;
		}}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="relative w-full max-w-3xl bg-white rounded-3xl border-4 border-purple-400 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
			
			<!-- STICKY HEADER -->
			<div class="bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 text-white p-4 sm:p-5 shrink-0 relative">
				<button
					type="button"
					onclick={() => (isEssayReviewModalOpen = false)}
					class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center text-lg backdrop-blur-xs transition-transform active:scale-95 cursor-pointer"
					title="Tutup Modal"
				>
					✕
				</button>
				<div class="flex items-center space-x-3 pr-10">
					<div class="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs shrink-0 text-2xl">
						📝
					</div>
					<div>
						<h3 class="text-base sm:text-xl font-black font-bubble leading-tight">
							Review Evaluasi Jawaban Esai Per Soal
						</h3>
						<p class="text-[11px] sm:text-xs text-purple-100 font-medium">
							Review jawaban Anda & ulasan saran AI. (Kunci jawaban tidak ditampilkan untuk mendorong kemandirian belajar)
						</p>
					</div>
				</div>
			</div>

			<!-- BODY CONTENT -->
			<div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-left">
				
				<!-- SOAL A -->
				<div class="bg-purple-50/70 rounded-2xl p-4 border border-purple-200 space-y-2">
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-purple-200 pb-2">
						<h4 class="font-extrabold text-xs sm:text-sm text-purple-950 font-bubble">
							Soal A: Interpretasi Tingkat Kerawanan Longsor Kecamatan Jabung
						</h4>
						{#if essayEvaluationResult?.rubric}
							<span class="inline-flex items-center px-2.5 py-1 bg-purple-100 border border-purple-300 text-purple-900 font-mono text-[11px] font-black rounded-lg whitespace-nowrap shrink-0 self-start sm:self-auto shadow-2xs">
								Sub-skor: {essayEvaluationResult.rubric.a} / 35
							</span>
						{/if}
					</div>

					<div>
						<span class="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-0.5">✍️ Jawaban Anda:</span>
						<p class="p-3 bg-white rounded-xl border border-purple-100 text-xs sm:text-sm text-slate-800 font-medium whitespace-pre-wrap leading-relaxed shadow-2xs">
							{essayAnswerA || '(Belum mengisi)'}
						</p>
					</div>
				</div>

				<!-- SOAL B -->
				<div class="bg-purple-50/70 rounded-2xl p-4 border border-purple-200 space-y-2">
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-purple-200 pb-2">
						<h4 class="font-extrabold text-xs sm:text-sm text-purple-950 font-bubble">
							Soal B: Peta Tematik Yang Dibutuhkan Dalam Pembuatan Peta Kerawanan
						</h4>
						{#if essayEvaluationResult?.rubric}
							<span class="inline-flex items-center px-2.5 py-1 bg-purple-100 border border-purple-300 text-purple-900 font-mono text-[11px] font-black rounded-lg whitespace-nowrap shrink-0 self-start sm:self-auto shadow-2xs">
								Sub-skor: {essayEvaluationResult.rubric.b} / 35
							</span>
						{/if}
					</div>

					<div>
						<span class="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-0.5">✍️ Jawaban Anda:</span>
						<p class="p-3 bg-white rounded-xl border border-purple-100 text-xs sm:text-sm text-slate-800 font-medium whitespace-pre-wrap leading-relaxed shadow-2xs">
							{essayAnswerB || '(Belum mengisi)'}
						</p>
					</div>
				</div>

				<!-- SOAL C -->
				<div class="bg-purple-50/70 rounded-2xl p-4 border border-purple-200 space-y-2">
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-purple-200 pb-2">
						<h4 class="font-extrabold text-xs sm:text-sm text-purple-950 font-bubble">
							Soal C: Tindakan Mitigasi & Konservasi Lahan Warga Jabung
						</h4>
						{#if essayEvaluationResult?.rubric}
							<span class="inline-flex items-center px-2.5 py-1 bg-purple-100 border border-purple-300 text-purple-900 font-mono text-[11px] font-black rounded-lg whitespace-nowrap shrink-0 self-start sm:self-auto shadow-2xs">
								Sub-skor: {essayEvaluationResult.rubric.c} / 30
							</span>
						{/if}
					</div>

					<div>
						<span class="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-0.5">✍️ Jawaban Anda:</span>
						<p class="p-3 bg-white rounded-xl border border-purple-100 text-xs sm:text-sm text-slate-800 font-medium whitespace-pre-wrap leading-relaxed shadow-2xs">
							{essayAnswerC || '(Belum mengisi)'}
						</p>
					</div>
				</div>

				<!-- SUMMARY FEEDBACK FROM AI -->
				{#if essayEvaluationResult?.feedback}
					<div class="bg-white p-3.5 rounded-2xl border-2 border-purple-300 shadow-sm space-y-1">
						<strong class="text-xs sm:text-sm font-extrabold text-purple-950 font-bubble block">
							📋 Ringkasan Feedback Keseluruhan Pengajar AI:
						</strong>
						<p class="text-xs text-slate-700 font-medium leading-relaxed">
							{essayEvaluationResult.feedback}
						</p>
					</div>
				{/if}

			</div>

			<!-- FOOTER -->
			<div class="p-3 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end shrink-0 font-bubble">
				<button
					type="button"
					onclick={() => (isEssayReviewModalOpen = false)}
					class="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs cursor-pointer"
				>
					Tutup Review
				</button>
			</div>

		</div>
	</div>
{/if}

<!-- MAP FULL-SCREEN ZOOM MODAL -->
{#if isMapZoomed}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-sans">
		<button
			type="button"
			onclick={() => (isMapZoomed = false)}
			class="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center text-xl shadow-xl cursor-pointer"
		>
			✕
		</button>

		<div class="relative max-w-5xl max-h-[90vh] overflow-auto rounded-2xl border-4 border-white shadow-2xl p-2 bg-white">
			<img
				src={petaJabung}
				alt="Peta Kerawanan Longsor Kecamatan Jabung Large"
				class="w-full h-auto object-contain rounded-xl"
			/>
			<p class="text-center text-xs font-bold text-slate-600 py-2">
				Peta Kerawanan Longsor Kecamatan Jabung (Skala 1:65.000)
			</p>
		</div>
	</div>
{/if}

<!-- GENERIC IMAGE ZOOM MODAL FOR QUIZ -->
{#if zoomedImage}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-sans">
		<button
			type="button"
			onclick={() => (zoomedImage = null)}
			class="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center text-xl shadow-xl cursor-pointer"
		>
			✕
		</button>

		<div class="relative max-w-5xl max-h-[90vh] overflow-auto rounded-2xl border-4 border-white shadow-2xl p-2 bg-white">
			<img
				src={zoomedImage.src}
				alt={zoomedImage.alt}
				class="w-full h-auto object-contain rounded-xl max-h-[80vh]"
			/>
			<p class="text-center text-xs sm:text-sm font-bold text-slate-700 py-2 font-bubble">
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
			<div class="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
				📝
			</div>
			<div class="flex flex-col">
				<span class="text-xs font-bold text-amber-800 uppercase tracking-wide leading-tight">Room 4</span>
				<span class="text-base sm:text-lg font-extrabold text-amber-950 leading-tight">Reflection</span>
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
				<div class="px-6 sm:px-14 py-1.5 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 border-3 border-white shadow-xl text-white font-extrabold text-base sm:text-3xl tracking-wide text-shadow whitespace-nowrap">
					{#if activeMode === 'menu'}
						Quiz & Essay
					{:else if activeMode === 'quiz'}
						Soal Evaluasi ({currentQuestionIndex + 1}/10)
					{:else if activeMode === 'review'}
						Pembahasan Soal ({currentQuestionIndex + 1}/10)
					{:else if activeMode === 'score'}
						Hasil Quiz
					{:else}
						Soal Evaluasi Essay
					{/if}
				</div>
			</div>

			<!-- Close Button Icon (Top Left Corner of Frame) -->
			{#if activeMode !== 'menu'}
				<button
					onclick={backToQuizMenu}
					aria-label="Tutup dan Kembali"
					class="absolute -top-4 -left-2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-rose-400 to-red-600 border-3 border-white shadow-xl text-white font-extrabold flex items-center justify-center transform active:scale-90 hover:scale-110 transition-all cursor-pointer"
					style="box-shadow: 0 4px 0 0 #9f1239, 0 6px 12px rgba(0,0,0,0.3);"
				>
					<svg class="w-6 h-6 stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			{/if}

			<!-- Whiteboard Inner Content Canvas -->
			<div class="relative w-full flex-1 bg-[#fffdf7] rounded-2xl border-3 border-[#c4b5a5] p-3 sm:p-8 md:p-10 pt-7 sm:pt-10 text-gray-800 font-sans shadow-inner overflow-y-auto min-h-[380px] sm:min-h-[440px] max-h-[62vh] flex flex-col justify-between px-3 sm:px-8 md:px-10">
				
				{#if activeMode === 'menu'}
					<!-- QUIZ INSTRUCTIONS & SELECTION BUTTONS -->
					<div class="space-y-5 sm:space-y-7 animate-fade-in text-center my-auto px-1 sm:px-4">
						<h2 class="text-base sm:text-xl md:text-2xl font-black text-gray-900 tracking-wide uppercase">
							PENGANTAR/PETUNJUK PENGERJAAN SOAL
						</h2>

						<p class="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed font-medium text-justify max-w-3xl mx-auto">
							Hai {studentProgressState.studentName}!, Pada halaman ini kamu akan mengerjakan soal evaluasi dalam bentuk soal pilihan ganda sebanyak 10 soal dan soal essay analisis. Pilihlah jawaban dengan mengeklik jawaban yang kamu anggap paling benar. Untuk mulai mengerjakan soal, silahkan klik tombol di bawah ini:
						</p>

						<!-- 3D Blue Action Buttons Side-by-Side -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10 max-w-2xl mx-auto pt-2 font-bubble">
							<!-- Mulai Quiz Button -->
							<button
								onclick={startQuiz}
								onmouseenter={() => sound.playCardHover()}
								class="group relative py-3.5 sm:py-4 px-6 bg-gradient-to-r from-[#00b0ff] to-[#0288d1] border-3 border-white shadow-xl rounded-2xl text-white font-extrabold text-lg sm:text-2xl tracking-wide transform active:scale-95 transition-all hover:scale-105 cursor-pointer"
								style="box-shadow: 0 5px 0 0 #01579b, 0 10px 20px rgba(0, 0, 0, 0.2);"
							>
								<div class="absolute top-1 left-4 right-4 h-1.5 bg-white/40 rounded-full pointer-events-none"></div>
								<span class="text-shadow block">Mulai Quiz</span>
							</button>

							<!-- Mulai Essay Button -->
							<button
								onclick={startEssay}
								onmouseenter={() => sound.playCardHover()}
								class="group relative py-3.5 sm:py-4 px-6 bg-gradient-to-r from-[#00b0ff] to-[#0288d1] border-3 border-white shadow-xl rounded-2xl text-white font-extrabold text-lg sm:text-2xl tracking-wide transform active:scale-95 transition-all hover:scale-105 cursor-pointer"
								style="box-shadow: 0 5px 0 0 #01579b, 0 10px 20px rgba(0, 0, 0, 0.2);"
							>
								<div class="absolute top-1 left-4 right-4 h-1.5 bg-white/40 rounded-full pointer-events-none"></div>
								<span class="text-shadow block">Mulai Essay</span>
							</button>
						</div>

						{#if showDevTools}
							<!-- DEV SIMULATION QUICK TOOLBAR -->
							<div class="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-center gap-2 text-xs">
								<span class="font-bold text-gray-400 font-mono">⚡ Dev Tools:</span>
								<button
									onclick={() => simulateResultScreen(true)}
									class="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 hover:bg-emerald-200"
								>
									Simulasi Lulus (100%)
								</button>
								<button
									onclick={() => simulateResultScreen(false)}
									class="px-2.5 py-1 bg-rose-100 text-rose-800 font-bold rounded-lg border border-rose-300 hover:bg-rose-200"
								>
									Simulasi Gagal (0%)
								</button>
							</div>
						{/if}
					</div>

				{:else if activeMode === 'quiz'}
					<!-- ACTIVE QUIZ ENGINE -->
					<div class="space-y-4 animate-fade-in my-auto">
						<div class="flex items-center justify-between border-b-2 border-sky-200 pb-2">
							<span class="text-xs sm:text-sm font-extrabold text-sky-800 uppercase tracking-wide bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
								Soal {currentQuestionIndex + 1} dari 10
							</span>
						</div>

						<!-- Question Prompt (With HTML Table for Question 6) -->
						{#if quizQuestions[currentQuestionIndex].hasTable}
							<div class="bg-amber-50/90 p-3.5 sm:p-4 rounded-2xl border-2 border-amber-200 shadow-sm text-xs sm:text-sm font-medium text-gray-900 space-y-2">
								<p class="font-extrabold text-gray-900 text-sm sm:text-base">Perhatikan tabel berikut:</p>
								
								<!-- STYLED HTML TABLE -->
								<div class="overflow-x-auto rounded-xl border border-sky-300 shadow-sm my-2">
									<table class="w-full min-w-[480px] text-xs sm:text-sm text-left border-collapse bg-white">
										<thead>
											<tr class="bg-[#4b85d3] text-white text-center font-extrabold divide-x divide-sky-200">
												<th class="py-2 px-3 w-1/3 text-center">A</th>
												<th class="py-2 px-3 w-1/3 text-center">B</th>
												<th class="py-2 px-3 w-1/3 text-center">C</th>
											</tr>
										</thead>
										<tbody class="divide-y divide-sky-100 text-slate-800">
											<tr class="divide-x divide-sky-100 hover:bg-sky-50/50">
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">1.</span>
														<span>Banyak pepohonan berbatang basah</span>
													</div>
												</td>
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">1.</span>
														<span>Perumahaan di atas tebing</span>
													</div>
												</td>
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">1.</span>
														<span>Penggantian pohon batang basah dengan batang kayu</span>
													</div>
												</td>
											</tr>
											<tr class="divide-x divide-sky-100 hover:bg-sky-50/50 bg-slate-50/50">
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">2.</span>
														<span>Memiliki sistem pertanian berbentuk sengkedan</span>
													</div>
												</td>
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">2.</span>
														<span>Drainase yang stabil</span>
													</div>
												</td>
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">2.</span>
														<span>Penggantian pohon batang kayu dengan batang basah</span>
													</div>
												</td>
											</tr>
											<tr class="divide-x divide-sky-100 hover:bg-sky-50/50">
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">3.</span>
														<span>Pemasangan beton di kaki tebing</span>
													</div>
												</td>
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">3.</span>
														<span>Curah hujan rendah</span>
													</div>
												</td>
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">3.</span>
														<span>Pembuatan terasering</span>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>

								<p class="font-bold text-gray-900 text-xs sm:text-sm pt-1">
									Dari beberapa pernyataan di atas, karakteristik wilayah genting atau rawan longsor dapat terjadi pada …
								</p>
							</div>
						{:else if quizQuestions[currentQuestionIndex].hasImage}
							{@const qLines = quizQuestions[currentQuestionIndex].question.split('\n').filter(Boolean)}
							<div class="bg-amber-50/80 p-3.5 sm:p-4 rounded-2xl border-2 border-amber-200 shadow-sm text-sm sm:text-base font-medium text-gray-900 leading-relaxed space-y-2.5">
								{#if qLines.length > 0}
									<p class="font-bold text-gray-900">{qLines[0]}</p>
								{/if}
								
								<div class="relative max-w-md mx-auto rounded-xl overflow-hidden border-2 border-amber-300 shadow-md group">
									<img
										src={quizQuestions[currentQuestionIndex].imageSrc}
										alt={quizQuestions[currentQuestionIndex].imageAlt || 'Gambar Soal'}
										class="w-full h-auto object-cover max-h-48 sm:max-h-56"
									/>
									<button
										type="button"
										onclick={() => (zoomedImage = { src: quizQuestions[currentQuestionIndex].imageSrc || soal10Gambar, alt: quizQuestions[currentQuestionIndex].imageAlt || 'Gambar Soal', title: quizQuestions[currentQuestionIndex].imageAlt || 'Gambar Soal' })}
										class="absolute bottom-2 right-2 bg-black/65 hover:bg-black/85 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 backdrop-blur-xs transition-colors cursor-pointer"
									>
										<span class="text-sm">🔍</span>
										<span>Perbesar</span>
									</button>
								</div>

								{#if qLines.length > 1}
									<p class="font-bold text-gray-900 pt-1">
										{qLines.slice(1).join(' ')}
									</p>
								{/if}
							</div>
						{:else}
							{@const parsed = parseQuestionText(quizQuestions[currentQuestionIndex].question)}
							{#if parsed.isList}
								<div class="bg-amber-50/80 p-3.5 sm:p-4 rounded-2xl border-2 border-amber-200 shadow-sm text-sm sm:text-base font-medium text-gray-900 leading-relaxed space-y-2">
									{#if parsed.intro}
										<p class="font-bold text-gray-900">{parsed.intro}</p>
									{/if}
									<ol class="list-decimal list-outside ml-5 sm:ml-6 space-y-1.5 font-medium text-slate-800">
										{#each parsed.items as item}
											<li class="pl-1 text-left sm:text-justify leading-relaxed">{item}</li>
										{/each}
									</ol>
									{#if parsed.outro}
										<p class="font-bold text-gray-900 pt-1">{parsed.outro}</p>
									{/if}
								</div>
							{:else}
								<div class="bg-amber-50/80 p-3.5 sm:p-4 rounded-2xl border-2 border-amber-200 shadow-sm text-sm sm:text-base font-medium text-gray-900 leading-relaxed text-justify whitespace-pre-line">
									{quizQuestions[currentQuestionIndex].question}
								</div>
							{/if}
						{/if}

						<!-- Options Grid -->
						<div class="grid grid-cols-1 gap-2 sm:gap-2.5 font-sans pt-1">
							{#each quizQuestions[currentQuestionIndex].options as option, optIdx}
								<button
									onclick={() => selectOption(optIdx)}
									class={`p-3 rounded-xl border-2 text-xs sm:text-sm text-left transition-all font-medium flex items-center justify-between cursor-pointer ${
										selectedAnswers[currentQuestionIndex] === optIdx
											? 'bg-sky-100 border-sky-600 text-sky-950 font-bold shadow-md'
											: 'bg-white hover:bg-sky-50 border-slate-300 text-gray-800'
									}`}
								>
									<span>{option}</span>
									{#if selectedAnswers[currentQuestionIndex] === optIdx}
										<span class="w-4 h-4 rounded-full bg-sky-600 border-2 border-white shadow-inner inline-block"></span>
									{/if}
								</button>
							{/each}
						</div>

						<!-- Question Navigation Controls -->
						<div class="flex items-center justify-between pt-3 border-t border-gray-200 font-bubble">
							<button
								onclick={prevQuestion}
								disabled={currentQuestionIndex === 0}
								class={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
									currentQuestionIndex === 0
										? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
										: 'bg-amber-400 border-amber-500 text-amber-950 hover:bg-amber-300 cursor-pointer'
								}`}
							>
								⬅ Soal Sebelumnya
							</button>

							<button
								onclick={nextQuestion}
								disabled={selectedAnswers[currentQuestionIndex] === -1}
								class={`px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border-2 transition-all ${
									selectedAnswers[currentQuestionIndex] === -1
										? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
										: 'bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-400 cursor-pointer shadow-md'
								}`}
							>
								{currentQuestionIndex === quizQuestions.length - 1 ? 'Selesai & Lihat Hasil 🏆' : 'Soal Selanjutnya ➔'}
							</button>
						</div>
					</div>

				{:else if activeMode === 'score'}
					<!-- EXACT RESULT SCREEN WITH CERTIFICATE DOWNLOAD BUTTON -->
					<div class="space-y-3 sm:space-y-4 animate-fade-in text-center my-auto py-1 max-w-xl mx-auto w-full">
						
						<!-- Teal Header Pill: "Hasil" -->
						<div class="inline-block px-7 sm:px-12 py-1 sm:py-1.5 bg-[#26a69a] border-2 border-white rounded-full text-white font-extrabold text-base sm:text-2xl shadow-md font-bubble mt-1">
							Hasil
						</div>

						<!-- Outcome Circle Icon -->
						<div class="flex justify-center pt-0.5">
							{#if isPassed}
								<div class="w-12 h-12 sm:w-18 sm:h-18 rounded-full bg-emerald-600 border-3 border-white shadow-xl flex items-center justify-center">
									<svg class="w-7 h-7 sm:w-10 sm:h-10 text-white stroke-[4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<polyline points="20 6 9 17 4 12" />
									</svg>
								</div>
							{:else}
								<div class="w-12 h-12 sm:w-18 sm:h-18 rounded-full bg-[#880e4f] border-3 border-white shadow-xl flex items-center justify-center">
									<svg class="w-7 h-7 sm:w-10 sm:h-10 text-white stroke-[4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<line x1="18" y1="6" x2="6" y2="18" />
										<line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</div>
							{/if}
						</div>

						<!-- Status Text -->
						<p class="text-sm sm:text-xl font-bold text-gray-800 font-sans">
							{isPassed ? `Selamat ${studentProgressState.studentName}, kamu lulus!` : `Maaf ${studentProgressState.studentName}, kamu belum lulus`}
						</p>

						<!-- Two Metric Cards -->
						<div class="grid grid-cols-2 gap-3 sm:gap-6 pt-0.5 font-sans">
							<!-- Card 1: SKOR KAMU -->
							<div class="bg-[#f8f9fa] p-3 sm:p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
								<span class="text-[11px] sm:text-sm font-black text-gray-900 uppercase tracking-wider mb-0.5 font-bubble">
									SKOR KAMU
								</span>
								<div class={`text-2xl sm:text-5xl font-black border-b-2 border-gray-300 pb-0.5 w-full text-center ${
									isPassed ? 'text-[#2e7d32]' : 'text-[#880e4f]'
								}`}>
									{scorePercentage}%
								</div>
							</div>

							<!-- Card 2: POIN KAMU -->
							<div class="bg-[#f8f9fa] p-3 sm:p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
								<span class="text-[11px] sm:text-sm font-black text-gray-900 uppercase tracking-wider mb-0.5 font-bubble">
									POIN KAMU
								</span>
								<div class={`text-2xl sm:text-5xl font-black border-b-2 border-gray-300 pb-0.5 w-full text-center ${
									isPassed ? 'text-[#2e7d32]' : 'text-[#880e4f]'
								}`}>
									{pointsCount}
								</div>
							</div>
						</div>

						<!-- Bottom Action Buttons: COBA LAGI & LIHAT PEMBAHASAN -->
						<div class="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 pt-1 font-bubble">
							<button
								onclick={startQuiz}
								onmouseenter={() => sound.playCardHover()}
								class="w-full sm:w-auto relative px-7 py-2.5 sm:py-3 bg-gradient-to-r from-[#81c784] via-[#4caf50] to-[#388e3c] border-3 border-white shadow-xl rounded-2xl text-white font-extrabold text-base sm:text-xl tracking-wide transform active:scale-95 transition-all hover:scale-105 cursor-pointer uppercase"
								style="box-shadow: 0 4px 0 0 #1b5e20, 0 8px 15px rgba(0, 0, 0, 0.2);"
							>
								COBA LAGI
							</button>

							<button
								onclick={openReview}
								onmouseenter={() => sound.playCardHover()}
								class="w-full sm:w-auto relative px-7 py-2.5 sm:py-3 bg-gradient-to-r from-[#00b0ff] to-[#0288d1] border-3 border-white shadow-xl rounded-2xl text-white font-extrabold text-base sm:text-xl tracking-wide transform active:scale-95 transition-all hover:scale-105 cursor-pointer uppercase"
								style="box-shadow: 0 4px 0 0 #01579b, 0 8px 15px rgba(0, 0, 0, 0.2);"
							>
								LIHAT PEMBAHASAN
							</button>
						</div>

						{#if showDevTools}
							<!-- DEV TOGGLE BADGE -->
							<div class="pt-1 flex items-center justify-center space-x-2 text-[10px] sm:text-xs opacity-70 hover:opacity-100 transition-opacity">
								<span class="font-mono text-gray-400">⚡ Dev View Toggle:</span>
								<button
									onclick={() => (devSimulatePass = true)}
									class={`px-2 py-0.5 rounded font-bold border transition-colors ${
										isPassed ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-gray-100 text-gray-700 border-gray-300'
									}`}
								>
									Passed View (Lulus)
								</button>
								<button
									onclick={() => (devSimulatePass = false)}
									class={`px-2 py-0.5 rounded font-bold border transition-colors ${
										!isPassed ? 'bg-rose-600 text-white border-rose-700' : 'bg-gray-100 text-gray-700 border-gray-300'
									}`}
								>
									Failed View (Gagal)
								</button>
							</div>
						{/if}

					</div>

				{:else if activeMode === 'review'}
					<!-- REVIEW SESSION ENGINE -->
					<div class="space-y-4 animate-fade-in my-auto">
						<div class="flex items-center justify-start border-b-2 border-sky-200 pb-2">
							<span class="text-xs sm:text-sm font-extrabold text-sky-800 uppercase tracking-wide bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
								Pembahasan Soal {currentQuestionIndex + 1} dari 10
							</span>
						</div>

						<!-- Question Prompt (With HTML Table for Question 6) -->
						{#if quizQuestions[currentQuestionIndex].hasTable}
							<div class="bg-amber-50/90 p-3.5 sm:p-4 rounded-2xl border-2 border-amber-200 shadow-sm text-xs sm:text-sm font-medium text-gray-900 space-y-2">
								<p class="font-extrabold text-gray-900 text-sm sm:text-base">Perhatikan tabel berikut:</p>
								
								<!-- STYLED HTML TABLE -->
								<div class="overflow-x-auto rounded-xl border border-sky-300 shadow-sm my-2">
									<table class="w-full min-w-[480px] text-xs sm:text-sm text-left border-collapse bg-white">
										<thead>
											<tr class="bg-[#4b85d3] text-white text-center font-extrabold divide-x divide-sky-200">
												<th class="py-2 px-3 w-1/3 text-center">A</th>
												<th class="py-2 px-3 w-1/3 text-center">B</th>
												<th class="py-2 px-3 w-1/3 text-center">C</th>
											</tr>
										</thead>
										<tbody class="divide-y divide-sky-100 text-slate-800">
											<tr class="divide-x divide-sky-100 hover:bg-sky-50/50">
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">1.</span>
														<span>Banyak pepohonan berbatang basah</span>
													</div>
												</td>
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">1.</span>
														<span>Perumahaan di atas tebing</span>
													</div>
												</td>
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">1.</span>
														<span>Penggantian pohon batang basah dengan batang kayu</span>
													</div>
												</td>
											</tr>
											<tr class="divide-x divide-sky-100 hover:bg-sky-50/50 bg-slate-50/50">
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">2.</span>
														<span>Memiliki sistem pertanian berbentuk sengkedan</span>
													</div>
												</td>
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">2.</span>
														<span>Drainase yang stabil</span>
													</div>
												</td>
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">2.</span>
														<span>Penggantian pohon batang kayu dengan batang basah</span>
													</div>
												</td>
											</tr>
											<tr class="divide-x divide-sky-100 hover:bg-sky-50/50">
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">3.</span>
														<span>Pemasangan beton di kaki tebing</span>
													</div>
												</td>
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">3.</span>
														<span>Curah hujan rendah</span>
													</div>
												</td>
												<td class="py-2 px-2.5">
													<div class="flex items-start space-x-1.5">
														<span class="font-bold text-sky-900 shrink-0">3.</span>
														<span>Pembuatan terasering</span>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>

								<p class="font-bold text-gray-900 text-xs sm:text-sm pt-1">
									Dari beberapa pernyataan di atas, karakteristik wilayah genting atau rawan longsor dapat terjadi pada …
								</p>
							</div>
						{:else if quizQuestions[currentQuestionIndex].hasImage}
							{@const qLines = quizQuestions[currentQuestionIndex].question.split('\n').filter(Boolean)}
							<div class="bg-amber-50/80 p-3.5 sm:p-4 rounded-2xl border-2 border-amber-200 shadow-sm text-sm sm:text-base font-medium text-gray-900 leading-relaxed space-y-2.5">
								{#if qLines.length > 0}
									<p class="font-bold text-gray-900">{qLines[0]}</p>
								{/if}
								
								<div class="relative max-w-md mx-auto rounded-xl overflow-hidden border-2 border-amber-300 shadow-md group">
									<img
										src={quizQuestions[currentQuestionIndex].imageSrc}
										alt={quizQuestions[currentQuestionIndex].imageAlt || 'Gambar Soal'}
										class="w-full h-auto object-cover max-h-48 sm:max-h-56"
									/>
									<button
										type="button"
										onclick={() => (zoomedImage = { src: quizQuestions[currentQuestionIndex].imageSrc || soal10Gambar, alt: quizQuestions[currentQuestionIndex].imageAlt || 'Gambar Soal', title: quizQuestions[currentQuestionIndex].imageAlt || 'Gambar Soal' })}
										class="absolute bottom-2 right-2 bg-black/65 hover:bg-black/85 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 backdrop-blur-xs transition-colors cursor-pointer"
									>
										<span class="text-sm">🔍</span>
										<span>Perbesar</span>
									</button>
								</div>

								{#if qLines.length > 1}
									<p class="font-bold text-gray-900 pt-1">
										{qLines.slice(1).join(' ')}
									</p>
								{/if}
							</div>
						{:else}
							{@const parsed = parseQuestionText(quizQuestions[currentQuestionIndex].question)}
							{#if parsed.isList}
								<div class="bg-amber-50/80 p-3.5 sm:p-4 rounded-2xl border-2 border-amber-200 shadow-sm text-sm sm:text-base font-medium text-gray-900 leading-relaxed space-y-2">
									{#if parsed.intro}
										<p class="font-bold text-gray-900">{parsed.intro}</p>
									{/if}
									<ol class="list-decimal list-outside ml-5 sm:ml-6 space-y-1.5 font-medium text-slate-800">
										{#each parsed.items as item}
											<li class="pl-1 text-left sm:text-justify leading-relaxed">{item}</li>
										{/each}
									</ol>
									{#if parsed.outro}
										<p class="font-bold text-gray-900 pt-1">{parsed.outro}</p>
									{/if}
								</div>
							{:else}
								<div class="bg-amber-50/80 p-3.5 sm:p-4 rounded-2xl border-2 border-amber-200 shadow-sm text-sm sm:text-base font-medium text-gray-900 leading-relaxed text-justify whitespace-pre-line">
									{quizQuestions[currentQuestionIndex].question}
								</div>
							{/if}
						{/if}

						<!-- Options Grid with Review Marks -->
						<div class="grid grid-cols-1 gap-2 sm:gap-2.5 font-sans pt-1">
							{#each quizQuestions[currentQuestionIndex].options as option, optIdx}
								<div
									class={`p-3 rounded-xl border-2 text-xs sm:text-sm text-left transition-all font-medium flex items-center justify-between ${
										optIdx === quizQuestions[currentQuestionIndex].correctAnswerIndex
											? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-md'
											: selectedAnswers[currentQuestionIndex] === optIdx
												? 'bg-rose-100 border-rose-500 text-rose-950 shadow-md'
												: 'bg-white border-slate-300 text-gray-700'
									}`}
								>
									<span>{option}</span>
									<span class="font-extrabold text-sm ml-2">
										{#if optIdx === quizQuestions[currentQuestionIndex].correctAnswerIndex}
											✅ (Jawaban Benar)
										{:else if selectedAnswers[currentQuestionIndex] === optIdx}
											❌ (Jawaban Kamu)
										{/if}
									</span>
								</div>
							{/each}
						</div>



						<!-- Review Navigation Controls -->
						<div class="flex items-center justify-between pt-3 border-t border-gray-200 font-bubble">
							<button
								onclick={prevQuestion}
								disabled={currentQuestionIndex === 0}
								class={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
									currentQuestionIndex === 0
										? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
										: 'bg-amber-400 border-amber-500 text-amber-950 hover:bg-amber-300 cursor-pointer'
								}`}
							>
								⬅ Soal Sebelumnya
							</button>

							<button
								onclick={nextQuestion}
								disabled={currentQuestionIndex === quizQuestions.length - 1}
								class={`px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border-2 transition-all ${
									currentQuestionIndex === quizQuestions.length - 1
										? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
										: 'bg-sky-500 border-sky-600 text-white hover:bg-sky-400 cursor-pointer shadow-md'
								}`}
							>
								Soal Selanjutnya ➔
							</button>
						</div>
					</div>

				{:else}
					<!-- EXACT ESSAY EVALUATION MODULE WITH MAP PetaKerawananLongsorKecamatanJabung -->
					<div class="space-y-4 animate-fade-in my-auto py-1 font-sans">
						
						<!-- TOP ATTEMPTS & RATE LIMIT STATUS HEADER -->
						<div class="flex flex-col sm:flex-row items-center justify-between bg-white/90 p-3 rounded-2xl border-2 border-amber-300 shadow-xs font-bubble gap-2">
							<div class="flex items-center space-x-2">
								<span class="text-base">🎯</span>
								<span class="text-xs sm:text-sm font-extrabold text-slate-800">
									Batas Pengiriman: <span class="text-amber-700 font-black">{Math.max(0, 3 - attemptsCount)} / 3</span> Kesempatan
								</span>
							</div>

							<div class="flex items-center space-x-2">
								{#if cooldownRemainingSeconds > 0}
									<span class="px-2.5 py-1 bg-rose-100 text-rose-800 font-extrabold rounded-xl text-xs flex items-center space-x-1 animate-pulse">
										<span>⏱️ Tunggu:</span>
										<span class="font-mono text-xs">{cooldownRemainingSeconds} dtk</span>
									</span>
								{:else if attemptsCount >= 3}
									<span class="px-2.5 py-1 bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs">
										⛔ Batas Terpakai
									</span>
								{:else}
									<span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-xl text-xs">
										✅ Siap Dikirim
									</span>
								{/if}
							</div>
						</div>

						<!-- AI EVALUATION RESULTS CARD (WHEN SUBMITTED) -->
						{#if essayEvaluationResult}
							<div class="bg-gradient-to-br from-purple-50 via-sky-50 to-amber-50 p-4 sm:p-5 rounded-2xl border-3 border-purple-300 shadow-lg space-y-3 animate-fade-in font-sans">
								<!-- TOP HEADER: RESPONSIVE FLEX WRAP FOR SMALL SCREENS -->
								<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-purple-200 pb-2.5">
									<div class="flex items-center space-x-2">
										<span class="text-2xl shrink-0">🤖</span>
										<div>
											<h4 class="text-xs sm:text-sm font-black text-purple-950 font-bubble flex flex-wrap items-center gap-1.5 leading-tight">
												<span>Hasil Penilaian Otomatis Gemini AI</span>
												{#if essayEvaluationResult.provider === 'gemini-ai'}
													<span class="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-[9px] font-black uppercase tracking-wide whitespace-nowrap">✨ Gemini AI</span>
												{:else}
													<span class="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-wide whitespace-nowrap">📐 Sistem Rubrik</span>
												{/if}
											</h4>
											<p class="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Evaluasi obyektif berbasis rubrik E-Modul Kebencanaan Jabung</p>
										</div>
									</div>

									<div class="px-3 py-1.5 bg-purple-600 text-white font-black rounded-xl text-xs sm:text-sm font-bubble shadow-md whitespace-nowrap shrink-0 self-start sm:self-auto">
										🏆 Skor: {essayEvaluationResult.score} / 100
									</div>
								</div>

								<div class="bg-white/80 p-3 rounded-xl border border-purple-100 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
									<strong class="text-purple-900 block mb-1 font-bubble text-xs sm:text-sm">📝 Evaluasi & Feedback Pengajar AI:</strong>
									<p>{essayEvaluationResult.feedback}</p>
								</div>

								<!-- BOTTOM ROW: RESPONSIVE FLEX WRAP -->
								<div class="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
									<span class="text-xs font-bold text-slate-700 font-bubble leading-snug">
										Skor Terbaik Tersimpan: <strong class="text-purple-900">{studentProgressState.essayScore || essayEvaluationResult.score} / 100</strong>
									</span>
									<button
										type="button"
										onclick={() => (isEssayReviewModalOpen = true)}
										class="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md border-2 border-white flex items-center justify-center space-x-1.5 transition-transform active:scale-95 cursor-pointer font-bubble whitespace-nowrap"
									>
										<span>📝 Review Jawaban per Soal</span>
									</button>
								</div>
							</div>
						{/if}

						<!-- INTRO TEXT & MAP IMAGE CARD -->
						<div class="bg-amber-50/90 p-4 sm:p-5 rounded-2xl border-2 border-amber-200 space-y-3 text-justify">
							<p class="text-sm sm:text-base font-bold text-gray-900">
								Perhatikan peta di bawah ini:
							</p>

							<!-- EMBEDDED MAP WITH ZOOM BUTTON -->
							<div class="relative group my-2 max-w-2xl mx-auto bg-white p-2 rounded-xl border border-amber-300 shadow-md">
								<img
									src={petaJabung}
									alt="Peta Kerawanan Longsor Kecamatan Jabung"
									class="w-full h-auto max-h-[220px] sm:max-h-[280px] object-contain rounded-lg mx-auto"
								/>
								<button
									type="button"
									onclick={() => (isMapZoomed = true)}
									class="absolute bottom-4 right-4 bg-sky-900/90 hover:bg-sky-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm flex items-center space-x-1 transition-transform hover:scale-105 cursor-pointer"
								>
									<span>🔍 Perbesar Peta</span>
								</button>
							</div>

							<p class="text-sm sm:text-base font-medium text-gray-900 leading-relaxed">
								Peta di atas adalah peta kerawanan longsor di kecamatan Jabung. Sebagai seorang geografer:
							</p>

							<!-- 3 ESSAY QUESTIONS & RESPONSE TEXTAREAS -->
							<div class="space-y-4 pt-2">
								<!-- Question A -->
								<div class="space-y-1.5">
									<label for="essay-a" class="block text-xs sm:text-sm font-bold text-slate-900 leading-normal">
										a. Interpretasikan tingkat kerawanan longsor di Kecamatan Jabung!
									</label>
									<textarea
										id="essay-a"
										bind:value={essayAnswerA}
										disabled={isEvaluatingEssay || attemptsCount >= 3}
										rows="2"
										class="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-inner disabled:opacity-50"
										placeholder="Tuliskan analisis interpretasi tingkat kerawanan longsor..."
									></textarea>
								</div>

								<!-- Question B -->
								<div class="space-y-1.5">
									<label for="essay-b" class="block text-xs sm:text-sm font-bold text-slate-900 leading-normal">
										b. Sebutkan peta yang dibutuhkan dalam pembuatan peta kerawanan di atas!
									</label>
									<textarea
										id="essay-b"
										bind:value={essayAnswerB}
										disabled={isEvaluatingEssay || attemptsCount >= 3}
										rows="2"
										class="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-inner disabled:opacity-50"
										placeholder="Sebutkan peta-peta tematik yang dibutuhkan (misal: Peta Curah Hujan, Kemiringan Lereng...)..."
									></textarea>
								</div>

								<!-- Question C -->
								<div class="space-y-1.5">
									<label for="essay-c" class="block text-xs sm:text-sm font-bold text-slate-900 leading-normal">
										c. Sebutkan tindakan mitigasi yang harus dilakukan warga Jabung!
									</label>
									<textarea
										id="essay-c"
										bind:value={essayAnswerC}
										disabled={isEvaluatingEssay || attemptsCount >= 3}
										rows="2"
										class="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-inner disabled:opacity-50"
										placeholder="Tuliskan tindakan mitigasi vegetatif & struktural..."
									></textarea>
								</div>
							</div>
						</div>

						<!-- ERROR / WARNING MESSAGE -->
						{#if essayErrorMessage}
							<div class="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-800 text-xs font-bold shadow-xs animate-fade-in">
								{essayErrorMessage}
							</div>
						{/if}

						<!-- ACTION BUTTON: SIMPAN JAWABAN & EVALUASI GEMINI AI -->
						<div class="pt-1 font-bubble">
							<button
								onclick={handleSaveEssay}
								disabled={isEvaluatingEssay || attemptsCount >= 3 || cooldownRemainingSeconds > 0}
								class="w-full py-3 px-6 bg-gradient-to-r from-purple-500 via-sky-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 border-3 border-white shadow-xl rounded-2xl text-white font-extrabold text-base sm:text-lg tracking-wide transform active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
								style="box-shadow: 0 4px 0 0 #1e1b4b, 0 8px 20px rgba(0, 0, 0, 0.3);"
							>
								{#if isEvaluatingEssay}
									<span class="animate-spin text-xl">🤖</span>
									<span>MENILAI ESAI DENGAN GEMINI AI...</span>
								{:else if cooldownRemainingSeconds > 0}
									<span class="text-xl">⏱️</span>
									<span>TUNGGU {cooldownRemainingSeconds} DETIK UNTUK MENGIRIM KEMBALI</span>
								{:else if attemptsCount >= 3}
									<span class="text-xl">⛔</span>
									<span>BATAS 3 KALI PENGIRIMAN ESAI TELAH HABIS</span>
								{:else}
									<span class="text-xl">✨</span>
									<span>KIRIM & EVALUASI ESAI DENGAN GEMINI AI</span>
								{/if}
							</button>
						</div>
					</div>
				{/if}

				<!-- Whiteboard Footer Navigation Bar -->
				<div class="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
					<span class="text-xs sm:text-sm font-bold text-gray-500 font-bubble">
						Kuis & Essay Evaluasi — Room 4
					</span>
				</div>
			</div>

			<!-- OVERLAY CHARACTER AT BOTTOM RIGHT FOR RESULT SCREEN OR BOTTOM LEFT FOR OTHERS -->
			{#if activeMode === 'score'}
				<img
					src={isPassed ? boyCharacterPassed : boyCharacterFailed}
					alt={isPassed ? "Boy Character Passed" : "Boy Character Failed"}
					class="hidden sm:block absolute -bottom-4 -right-3 sm:-right-8 w-20 sm:w-36 md:w-44 h-auto z-10 pointer-events-none drop-shadow-xl animate-sway"
					style="will-change: transform; transform-origin: bottom center;"
				/>
			{:else}
				<img
					src={girlCharacter2}
					alt="Girl Character"
					class="hidden lg:block absolute -bottom-6 -left-12 xl:-left-16 w-32 md:w-40 lg:w-44 h-auto z-0 pointer-events-none drop-shadow-xl animate-sway"
					style="will-change: transform; transform-origin: bottom center;"
				/>
			{/if}

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
	@keyframes sway {
		0%, 100% {
			transform: rotate(0deg) translate3d(0, 0, 0);
		}
		50% {
			transform: rotate(1.5deg) translate3d(0, -3px, 0);
		}
	}
	.animate-sway {
		animation: sway 4s ease-in-out infinite;
	}
</style>
