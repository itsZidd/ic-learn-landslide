<script lang="ts">
	import { sound } from '$lib/utils/audio';
	import {
		Award,
		Search,
		User,
		GraduationCap,
		TrendingUp,
		X,
		Sparkles,
		Download,
		CheckCircle2,
		ShieldCheck,
		FileSpreadsheet
	} from '@lucide/svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	let searchQuery = $state('');
	let sortBy = $state<'score' | 'name' | 'date'>('score');
	let selectedClass = $state<string>('All');

	interface StudentRecord {
		id: string;
		name: string;
		email: string;
		studentClass: string;
		certId: string;
		quizScore: number;
		essayScore: number;
		latestEssayAnswerA?: string;
		latestEssayAnswerB?: string;
		latestEssayAnswerC?: string;
		latestEssayFeedback?: string;
		latestEssayRubric?: { a: number; b: number; c: number };
		completion: number;
		lastUpdated: string;
		isCurrentStudent?: boolean;
	}

	let studentRecords = $state<StudentRecord[]>([]);
	let expandedStudentId = $state<string | null>(null);
	let isLoadingStudents = $state(false);
	let loadError = $state('');

	async function loadStudentData() {
		isLoadingStudents = true;
		loadError = '';
		try {
			const res = await fetch('/api/students');
			if (!res.ok) throw new Error(`Request failed: ${res.status}`);
			const data = await res.json();
			studentRecords = (data.students ?? []) as StudentRecord[];
		} catch (e) {
			loadError = 'Gagal memuat data siswa dari server.';
			studentRecords = [];
		} finally {
			isLoadingStudents = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			loadStudentData();
		}
	});

	// Derive available class categories self-filled by students
	let availableClasses = $derived<string[]>([
		'All',
		...Array.from(new Set(studentRecords.map((s) => s.studentClass).filter(Boolean))).sort()
	]);

	function getFinalScore(s: StudentRecord): number {
		return Math.round((s.quizScore + s.essayScore) / 2);
	}

	let filteredStudents = $derived(
		studentRecords
			.filter((s) => {
				const matchesSearch =
					s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
					s.certId.toLowerCase().includes(searchQuery.toLowerCase()) ||
					s.studentClass.toLowerCase().includes(searchQuery.toLowerCase());
				const matchesClass = selectedClass === 'All' || s.studentClass === selectedClass;
				return matchesSearch && matchesClass;
			})
			.sort((a, b) => {
				if (sortBy === 'score') return getFinalScore(b) - getFinalScore(a);
				if (sortBy === 'name') return a.name.localeCompare(b.name);
				return b.lastUpdated.localeCompare(a.lastUpdated);
			})
	);

	let avgScore = $derived(
		Math.round(
			filteredStudents.reduce((acc, s) => acc + getFinalScore(s), 0) / (filteredStudents.length || 1)
		)
	);

	let completedCount = $derived(filteredStudents.filter((s) => s.completion === 100).length);

	// Pagination State
	let itemsPerPage = $state<number>(10);
	let currentPage = $state<number>(1);

	let totalPages = $derived(Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage)));

	let startIndex = $derived((currentPage - 1) * itemsPerPage);
	let endIndex = $derived(Math.min(filteredStudents.length, currentPage * itemsPerPage));

	let paginatedStudents = $derived(
		filteredStudents.slice(startIndex, endIndex)
	);

	$effect(() => {
		// Reset page when filters or items per page change
		searchQuery; selectedClass; sortBy; itemsPerPage;
		currentPage = 1;
	});

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			try { sound.playClick(); } catch {}
		}
	}

	function exportToCSV() {
		try { sound.playClick(); } catch {}
		const headers = [
			'Peringkat',
			'Nama Siswa',
			'Email',
			'Kelas',
			'ID Sertifikat',
			'Nilai Kuis',
			'Nilai Esai AI',
			'Nilai Akhir Rata-Rata',
			'Jawaban Esai A',
			'Jawaban Esai B',
			'Jawaban Esai C',
			'Feedback AI',
			'Progres (%)',
			'Terakhir Diperbarui'
		];
		const rows = filteredStudents.map((s, idx) => [
			idx + 1,
			`"${s.name.replace(/"/g, '""')}"`,
			`"${s.email.replace(/"/g, '""')}"`,
			`"${s.studentClass.replace(/"/g, '""')}"`,
			`"${s.certId}"`,
			s.quizScore,
			s.essayScore,
			getFinalScore(s),
			`"${(s.latestEssayAnswerA || '').replace(/"/g, '""')}"`,
			`"${(s.latestEssayAnswerB || '').replace(/"/g, '""')}"`,
			`"${(s.latestEssayAnswerC || '').replace(/"/g, '""')}"`,
			`"${(s.latestEssayFeedback || '').replace(/"/g, '""')}"`,
			`${s.completion}%`,
			`"${s.lastUpdated}"`
		]);

		const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		const classSuffix = selectedClass === 'All' ? 'Semua_Kelas' : selectedClass.replace(/\s+/g, '_');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', `Rekap_Nilai_Dan_Jawaban_Esai_Kelas_${classSuffix}_ICARE.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function handleClose() {
		onClose();
		try { sound.playClick(); } catch {}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (isOpen && e.key === 'Escape') {
			handleClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -- Escape is already handled by the svelte:window listener above -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in font-sans"
		onclick={(e) => {
			if (e.target === e.currentTarget) handleClose();
		}}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="relative w-full max-w-[96vw] xl:max-w-7xl lg:max-w-6xl bg-white rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
			
			<!-- STICKY TOP HEADER -->
			<div class="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 sm:p-6 shrink-0 relative">
				<button
					type="button"
					onclick={handleClose}
					class="absolute top-4 right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center text-lg backdrop-blur-xs transition-transform active:scale-95 cursor-pointer"
					title="Tutup Dashboard"
				>
					<X class="w-5 h-5" />
				</button>

				<div class="flex items-center space-x-3 pr-10">
					<div class="p-3 bg-white/20 rounded-2xl backdrop-blur-xs shrink-0">
						<GraduationCap class="w-7 h-7 sm:w-9 sm:h-9 text-amber-200" />
					</div>
					<div>
						<div class="flex flex-wrap items-center gap-2">
							<span class="shrink-0 whitespace-nowrap px-2.5 py-0.5 bg-amber-300 text-amber-950 rounded-full text-[10px] font-black uppercase tracking-wider font-bubble">
								Dashboard Guru / Pengajar
							</span>
							<span class="shrink-0 whitespace-nowrap px-2 py-0.5 bg-emerald-400 text-emerald-950 rounded-full text-[10px] font-black uppercase tracking-wider">
								● Online
							</span>
						</div>
						<h2 class="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5 font-bubble">
							Rekap Nilai Terbaik & Sertifikat Siswa
						</h2>
						<p class="text-xs text-amber-100 font-medium">
							Sistem Penilaian Otomatis Kuis & Evaluasi Esai AI Geografi E-Modul Kebencanaan Longsor
						</p>
					</div>
				</div>

				<!-- SUMMARY METRIC CARDS -->
				<div class="grid grid-cols-3 gap-2.5 sm:gap-4 mt-4 pt-3 border-t border-white/20 text-slate-800 font-bubble">
					<div class="bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl shadow-md flex items-center space-x-3">
						<div class="p-2 bg-sky-100 text-sky-700 rounded-xl hidden sm:block">
							<User class="w-5 h-5" />
						</div>
						<div>
							<span class="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase block">Total Siswa</span>
							<span class="text-base sm:text-2xl font-black text-slate-800">{filteredStudents.length} <span class="text-xs font-bold text-slate-500 font-sans">Siswa</span></span>
						</div>
					</div>

					<div class="bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl shadow-md flex items-center space-x-3">
						<div class="p-2 bg-amber-100 text-amber-700 rounded-xl hidden sm:block">
							<TrendingUp class="w-5 h-5" />
						</div>
						<div>
							<span class="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase block">Rata-Rata Nilai</span>
							<span class="text-base sm:text-2xl font-black text-amber-600">{avgScore} <span class="text-xs font-bold text-slate-500 font-sans">/ 100</span></span>
						</div>
					</div>

					<div class="bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl shadow-md flex items-center space-x-3">
						<div class="p-2 bg-emerald-100 text-emerald-700 rounded-xl hidden sm:block">
							<Award class="w-5 h-5" />
						</div>
						<div>
							<span class="text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase block">Lulus Sertifikat</span>
							<span class="text-base sm:text-2xl font-black text-emerald-600">{completedCount} <span class="text-xs font-bold text-slate-500 font-sans">Siswa</span></span>
						</div>
					</div>
				</div>
			</div>

			<!-- INTERACTIVE CONTROLS BAR -->
			<div class="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-2.5 shrink-0">
				<!-- Search Bar -->
				<div class="relative w-full md:w-72">
					<Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Cari nama, email, atau ID sertifikat..."
						class="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 rounded-xl text-xs font-semibold text-slate-800 outline-none transition-all shadow-xs"
					/>
				</div>

				<!-- Class Filter, Sorting & Export -->
				<div class="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
					<!-- Class Filter Dropdown (Dynamically populated from student self-filled classes) -->
					<select
						bind:value={selectedClass}
						class="px-2.5 py-2 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-xl outline-none shadow-xs cursor-pointer"
					>
						<option value="All">🏫 Semua Kelas ({studentRecords.length})</option>
						{#each availableClasses.filter((c) => c !== 'All') as c}
							<option value={c}>Kelas {c}</option>
						{/each}
					</select>

					<!-- Sort Selector -->
					<select
						bind:value={sortBy}
						class="px-2.5 py-2 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-xl outline-none shadow-xs cursor-pointer"
					>
						<option value="score">🏆 Skor Terbaik</option>
						<option value="name">🔤 Nama A-Z</option>
						<option value="date">⏱️ Waktu Terbaru</option>
					</select>

					<!-- Items Per Page Selector -->
					<select
						bind:value={itemsPerPage}
						class="px-2.5 py-2 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-xl outline-none shadow-xs cursor-pointer"
						title="Jumlah data per halaman"
					>
						<option value={10}>📄 10 / Hal</option>
						<option value={25}>📄 25 / Hal</option>
						<option value={50}>📄 50 / Hal</option>
						<option value={100}>📄 100 / Hal</option>
					</select>

					<!-- Export Button -->
					<button
						type="button"
						onclick={exportToCSV}
						class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-sm border border-emerald-500 flex items-center space-x-1.5 transition-transform cursor-pointer font-bubble whitespace-nowrap"
						title={selectedClass === 'All' ? 'Export CSV Seluruh Kelas' : `Export CSV Khusus Kelas ${selectedClass}`}
					>
						<FileSpreadsheet class="w-4 h-4" />
						<span>Export CSV ({selectedClass === 'All' ? 'Semua' : selectedClass})</span>
					</button>
				</div>
			</div>

			<!-- SHADCN STYLED LEADERBOARD TABLE BODY -->
			<div class="flex-1 overflow-y-auto p-3 sm:p-5">
				{#if isLoadingStudents}
					<div class="text-center py-10 text-sm font-bold text-slate-500">Memuat data siswa...</div>
				{:else if loadError}
					<div class="text-center py-10 text-sm font-bold text-rose-600">{loadError}</div>
				{:else if studentRecords.length === 0}
					<div class="text-center py-10 text-sm font-bold text-slate-500">Belum ada siswa yang terdaftar.</div>
				{:else}
				<!-- MOBILE CARD VIEW (< md / 768px screens) -->
				<div class="block md:hidden space-y-3 font-sans">
					{#each paginatedStudents as student, index}
						<div class="bg-white rounded-2xl border-2 border-slate-200 p-3.5 shadow-xs space-y-2.5">
							<!-- TOP BAR: RANK & STUDENT INFO -->
							<div class="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
								<div class="flex items-center space-x-2.5">
									<span class="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shrink-0 font-bubble">
										#{startIndex + index + 1}
									</span>
									<div>
										<h4 class="font-extrabold text-slate-900 text-sm leading-tight font-bubble">
											{student.name}
											{#if student.isCurrentStudent}
												<span class="ml-1 text-[9px] bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded-md font-extrabold">Anda</span>
											{/if}
										</h4>
										<p class="text-[11px] text-slate-500 font-medium">{student.email}</p>
									</div>
								</div>

								<span class="px-2.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-800 font-extrabold rounded-lg text-[10px] whitespace-nowrap shrink-0">
									{student.studentClass}
								</span>
							</div>

							<!-- SCORE METRICS BADGES ROW -->
							<div class="grid grid-cols-3 gap-1.5 text-center font-bubble">
								<div class="bg-sky-50 p-1.5 rounded-xl border border-sky-200">
									<span class="text-[9px] font-bold text-sky-800 block uppercase">Kuis</span>
									<span class="text-xs font-black text-sky-900 font-mono">{student.quizScore}/100</span>
								</div>

								<div class="bg-purple-50 p-1.5 rounded-xl border border-purple-200">
									<span class="text-[9px] font-bold text-purple-800 block uppercase">Esai AI</span>
									<span class="text-xs font-black text-purple-900 font-mono">{student.essayScore}/100</span>
								</div>

								<div class="bg-amber-100 p-1.5 rounded-xl border border-amber-300">
									<span class="text-[9px] font-bold text-amber-900 block uppercase">Rata-Rata</span>
									<span class="text-xs font-black text-amber-950 font-mono">🏆 {getFinalScore(student)}</span>
								</div>
							</div>

							<!-- BOTTOM ACTION ROW: STATUS BADGE & REVIEW BUTTON -->
							<div class="flex items-center justify-between pt-1">
								{#if student.completion === 100}
									<span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px] inline-flex items-center space-x-1">
										<CheckCircle2 class="w-3 h-3 text-emerald-600" />
										<span>🎓 Lulus (100%)</span>
									</span>
								{:else}
									<span class="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-full text-[10px]">
										📖 {student.completion}% Selesai
									</span>
								{/if}

								<button
									type="button"
									onclick={() => {
										try { sound.playClick(); } catch {}
										expandedStudentId = expandedStudentId === student.id ? null : student.id;
									}}
									class="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center space-x-1 font-bubble"
								>
									<span>{expandedStudentId === student.id ? '✕ Tutup' : '📝 Detail Jawaban'}</span>
								</button>
							</div>

							<!-- EXPANDABLE REVIEW CONTENT IN MOBILE CARD -->
							{#if expandedStudentId === student.id}
								<div class="bg-purple-50 p-3 rounded-xl border-2 border-purple-200 space-y-2.5 text-left font-sans text-xs">
									<div class="border-b border-purple-200 pb-1.5 flex items-center justify-between">
										<span class="font-bold text-purple-950 font-bubble">Jawaban Esai Siswa</span>
										<span class="text-[10px] font-bold text-slate-500 font-mono">ID: {student.certId}</span>
									</div>

									<div class="bg-white p-2.5 rounded-lg border border-purple-100 space-y-1">
										<div class="flex items-center justify-between">
											<strong class="text-[11px] font-bold text-purple-950">Soal A: Kerawanan</strong>
											<span class="text-[9px] font-black text-purple-900 bg-purple-100 px-1.5 py-0.5 rounded font-mono">
												Sub-skor: {student.latestEssayRubric?.a || 0}/35
											</span>
										</div>
										<p class="text-[11px] text-slate-700 font-medium whitespace-pre-wrap">{student.latestEssayAnswerA || '(Belum mengisi)'}</p>
									</div>

									<div class="bg-white p-2.5 rounded-lg border border-purple-100 space-y-1">
										<div class="flex items-center justify-between">
											<strong class="text-[11px] font-bold text-purple-950">Soal B: Peta Tematik</strong>
											<span class="text-[9px] font-black text-purple-900 bg-purple-100 px-1.5 py-0.5 rounded font-mono">
												Sub-skor: {student.latestEssayRubric?.b || 0}/35
											</span>
										</div>
										<p class="text-[11px] text-slate-700 font-medium whitespace-pre-wrap">{student.latestEssayAnswerB || '(Belum mengisi)'}</p>
									</div>

									<div class="bg-white p-2.5 rounded-lg border border-purple-100 space-y-1">
										<div class="flex items-center justify-between">
											<strong class="text-[11px] font-bold text-purple-950">Soal C: Mitigasi Warga</strong>
											<span class="text-[9px] font-black text-purple-900 bg-purple-100 px-1.5 py-0.5 rounded font-mono">
												Sub-skor: {student.latestEssayRubric?.c || 0}/30
											</span>
										</div>
										<p class="text-[11px] text-slate-700 font-medium whitespace-pre-wrap">{student.latestEssayAnswerC || '(Belum mengisi)'}</p>
									</div>

									{#if student.latestEssayFeedback}
										<div class="bg-purple-100/80 p-2.5 rounded-lg border border-purple-200 text-[11px] text-purple-950 space-y-1">
											<strong class="font-bold block text-purple-900 font-bubble">📋 Feedback AI:</strong>
											<p class="font-medium leading-relaxed">{student.latestEssayFeedback}</p>
										</div>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>

				<!-- DESKTOP / TABLET FULL TABLE VIEW (>= md / 768px screens) -->
				<div class="hidden md:block border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white overflow-x-auto">
					<table class="w-full text-left border-collapse min-w-[700px]">
						<thead>
							<tr class="bg-slate-900 border-b border-slate-800 text-[10px] sm:text-[11px] font-black text-white uppercase tracking-wider">
								<th class="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">Peringkat</th>
								<th class="py-2.5 px-2.5 sm:px-3 whitespace-nowrap">Siswa</th>
								<th class="py-2.5 px-2.5 sm:px-3 whitespace-nowrap">Kelas</th>
								<th class="py-2.5 px-2.5 sm:px-3 whitespace-nowrap">ID Sertifikat</th>
								<th class="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">Kuis</th>
								<th class="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">Esai AI</th>
								<th class="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">Nilai Akhir</th>
								<th class="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">Status</th>
								<th class="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">Aksi Guru</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-200 text-xs font-medium text-slate-700">
							{#each paginatedStudents as student, index}
								<tr class={`hover:bg-amber-50/60 transition-colors ${student.isCurrentStudent ? 'bg-amber-50/80 font-semibold' : ''}`}>
									<!-- RANK NUMBER -->
									<td class="py-2.5 px-2.5 sm:px-3 text-center font-bold whitespace-nowrap">
										<span class="text-slate-500 font-extrabold">{startIndex + index + 1}</span>
									</td>

									<!-- STUDENT NAME & EMAIL -->
									<td class="py-2.5 px-2.5 sm:px-3">
										<div class="flex items-center space-x-2">
											<div class={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 ${student.isCurrentStudent ? 'bg-amber-500' : 'bg-sky-600'}`}>
												{student.name.charAt(0)}
											</div>
											<div>
												<span class="font-extrabold text-slate-900 block leading-tight text-xs sm:text-sm">
													{student.name}
													{#if student.isCurrentStudent}
														<span class="ml-1 text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-md font-extrabold">Anda</span>
													{/if}
												</span>
												<span class="text-[10px] sm:text-[11px] text-slate-500 block">{student.email}</span>
											</div>
										</div>
									</td>

									<!-- KELAS / ROMBEL -->
									<td class="py-2.5 px-2.5 sm:px-3 whitespace-nowrap">
										<span class="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-100 border border-slate-300 text-slate-800 font-extrabold rounded-lg text-[10px] sm:text-[11px]">
											{student.studentClass}
										</span>
									</td>

									<!-- CERTIFICATE ID -->
									<td class="py-2.5 px-2.5 sm:px-3 font-mono font-bold text-slate-600 text-[10px] sm:text-[11px] whitespace-nowrap">
										{student.certId}
									</td>

									<!-- QUIZ SCORE -->
									<td class="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">
										<span class="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-sky-50 text-sky-700 font-extrabold rounded-lg border border-sky-200 inline-block text-[11px] whitespace-nowrap">
											{student.quizScore} / 100
										</span>
									</td>

									<!-- ESSAY AI SCORE -->
									<td class="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">
										<span class="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-purple-50 text-purple-700 font-extrabold rounded-lg border border-purple-200 inline-block text-[11px] whitespace-nowrap">
											{student.essayScore} / 100
										</span>
									</td>

									<!-- FINAL SCORE (AVERAGE) -->
									<td class="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">
										<span class="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-amber-400 text-amber-950 font-black rounded-xl shadow-xs text-xs inline-block whitespace-nowrap font-bubble">
											🏆 {getFinalScore(student)}
										</span>
									</td>

									<!-- STATUS BADGE -->
									<td class="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">
										{#if student.completion === 100}
											<span class="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-full text-[10px] sm:text-[11px] inline-flex items-center space-x-1 whitespace-nowrap">
												<CheckCircle2 class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
												<span>🎓 Lulus (100%)</span>
											</span>
										{:else}
											<span class="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-slate-100 text-slate-700 font-bold rounded-full text-[10px] sm:text-[11px] whitespace-nowrap">
												📖 {student.completion}% Selesai
											</span>
										{/if}
									</td>

									<!-- AKSI GURU: REVIEW JAWABAN -->
									<td class="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">
										<button
											type="button"
											onclick={() => {
												try { sound.playClick(); } catch {}
												expandedStudentId = expandedStudentId === student.id ? null : student.id;
											}}
											class="px-2 py-1 sm:px-2.5 sm:py-1 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] sm:text-[11px] rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center space-x-1 font-bubble"
										>
											<span>{expandedStudentId === student.id ? '✕ Tutup' : '📝 Detail Jawaban'}</span>
										</button>
									</td>
								</tr>

								<!-- EXPANDABLE ESSAY REVIEW PANEL ROW -->
								{#if expandedStudentId === student.id}
									<tr class="bg-purple-50/80 border-b-2 border-purple-300">
										<td colspan="9" class="p-4 sm:p-5 text-left font-sans">
											<div class="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-md space-y-3">
												<div class="flex items-center justify-between border-b border-purple-200 pb-2">
													<div class="flex items-center space-x-2">
														<span class="text-xl">📝</span>
														<div>
															<h4 class="font-extrabold text-sm text-purple-950 font-bubble">
																Review Jawaban & Ulasan Esai AI — {student.name} ({student.studentClass})
															</h4>
															<p class="text-[11px] text-slate-500 font-medium">Email: {student.email} | ID Sertifikat: {student.certId}</p>
														</div>
													</div>
													<span class="px-3 py-1 bg-purple-200 text-purple-950 rounded-xl font-mono text-xs font-extrabold">
														Skor Esai: {student.essayScore} / 100
													</span>
												</div>

												<!-- SOAL A -->
												<div class="bg-slate-50 p-3 rounded-xl border border-purple-100 space-y-1">
													<div class="flex items-center justify-between">
														<span class="text-xs font-bold text-purple-950 font-bubble">Soal A: Kerawanan Longsor Jabung</span>
														{#if student.latestEssayRubric}
															<span class="text-[10px] font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md font-mono">
																Sub-skor: {student.latestEssayRubric.a || 0} / 35
															</span>
														{/if}
													</div>
													<p class="text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 whitespace-pre-wrap font-medium">
														{student.latestEssayAnswerA || '(Siswa belum mengirim jawaban Soal A)'}
													</p>
												</div>

												<!-- SOAL B -->
												<div class="bg-slate-50 p-3 rounded-xl border border-purple-100 space-y-1">
													<div class="flex items-center justify-between">
														<span class="text-xs font-bold text-purple-950 font-bubble">Soal B: Peta Tematik Yang Dibutuhkan</span>
														{#if student.latestEssayRubric}
															<span class="text-[10px] font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md font-mono">
																Sub-skor: {student.latestEssayRubric.b || 0} / 35
															</span>
														{/if}
													</div>
													<p class="text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 whitespace-pre-wrap font-medium">
														{student.latestEssayAnswerB || '(Siswa belum mengirim jawaban Soal B)'}
													</p>
												</div>

												<!-- SOAL C -->
												<div class="bg-slate-50 p-3 rounded-xl border border-purple-100 space-y-1">
													<div class="flex items-center justify-between">
														<span class="text-xs font-bold text-purple-950 font-bubble">Soal C: Mitigasi & Konservasi Lahan Warga</span>
														{#if student.latestEssayRubric}
															<span class="text-[10px] font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md font-mono">
																Sub-skor: {student.latestEssayRubric.c || 0} / 30
															</span>
														{/if}
													</div>
													<p class="text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 whitespace-pre-wrap font-medium">
														{student.latestEssayAnswerC || '(Siswa belum mengirim jawaban Soal C)'}
													</p>
												</div>

												<!-- FEEDBACK AI NOTE -->
												{#if student.latestEssayFeedback}
													<div class="bg-purple-100/70 p-3 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-1">
														<strong class="font-bold flex items-center space-x-1 text-purple-900 font-bubble">
															<span>📋 Ulasan Evaluasi AI Pengajar:</span>
														</strong>
														<p class="leading-relaxed font-medium">
															{student.latestEssayFeedback}
														</p>
													</div>
												{/if}
											</div>
										</td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>

				<!-- PAGINATION CONTROLS BAR -->
				{#if filteredStudents.length > 0}
					<div class="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-600 font-bubble">
						<div>
							Menampilkan <strong class="text-slate-900">{filteredStudents.length === 0 ? 0 : startIndex + 1}</strong> - <strong class="text-slate-900">{endIndex}</strong> dari <strong class="text-slate-900">{filteredStudents.length}</strong> siswa
						</div>

						<div class="flex items-center space-x-1.5">
							<button
								type="button"
								onclick={() => goToPage(currentPage - 1)}
								disabled={currentPage === 1}
								class="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-bold transition-colors cursor-pointer"
							>
								« Sebelumnya
							</button>

							<div class="flex items-center space-x-1">
								{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
									{#if totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1}
										<button
											type="button"
											onclick={() => goToPage(page)}
											class={`w-7 h-7 rounded-lg font-extrabold text-xs transition-colors cursor-pointer ${
												currentPage === page
													? 'bg-amber-500 text-amber-950 shadow-xs border border-amber-600'
													: 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-700'
											}`}
										>
											{page}
										</button>
									{:else if page === 2 && currentPage > 3 || page === totalPages - 1 && currentPage < totalPages - 2}
										<span class="px-0.5 text-slate-400 font-bold">...</span>
									{/if}
								{/each}
							</div>

							<button
								type="button"
								onclick={() => goToPage(currentPage + 1)}
								disabled={currentPage === totalPages}
								class="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-bold transition-colors cursor-pointer"
							>
								Selanjutnya »
							</button>
						</div>
					</div>
				{/if}
				{/if}
			</div>

			<!-- FOOTER BAR -->
			<div class="p-3 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs font-medium text-slate-500 font-bubble">
				<span>* Rekap nilai menyimpan skor terbaik (Best Score) untuk tiap akun siswa</span>
				<button
					type="button"
					onclick={handleClose}
					class="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-sm cursor-pointer"
				>
					Tutup
				</button>
			</div>

		</div>
	</div>
{/if}
