<script lang="ts">
	import { fly } from 'svelte/transition';
	import { sound } from '$lib/utils/audio';
	import { authClient } from '$lib/auth-client';
	import { env } from '$env/dynamic/public';
	import { getProgress, saveProgress, calculateCompletion, resetProgress, completeAllProgress } from '$lib/utils/progress';
	import { User, KeyRound, Mail, Award, LogOut, CheckCircle2, ShieldCheck, Copy, Sparkles, BarChart3, Lock, Check, AlertTriangle, Eye, EyeOff, Volume2, VolumeX, Music } from '@lucide/svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		studentName: string;
		studentEmail?: string;
		certificateId?: string;
		completionPercent: number;
		onUpdateName: (newName: string) => void;
		onLogout: () => void;
		onOpenCertificate?: () => void;
		onTriggerSplash?: () => void;
		defaultTab?: 'progress' | 'profile' | 'audio' | 'security';
	}

	let {
		isOpen,
		onClose,
		studentName,
		studentEmail = '',
		certificateId = 'ICARE-2026-XXXX-XXXX',
		completionPercent,
		onUpdateName,
		onLogout,
		onOpenCertificate,
		onTriggerSplash,
		defaultTab = 'progress'
	}: Props = $props();

	let activeTab = $state<'progress' | 'profile' | 'audio' | 'security'>('progress');
	
	// Environment Dev Tools Feature Flag
	let showDevTools = $derived(env.PUBLIC_SHOW_DEV_TOOLS === 'true');

	// Progress state
	let progressData = $state(getProgress());
	let completionPercentage = $derived(calculateCompletion(progressData));

	// Sound & Audio State
	let isAudioMuted = $state(sound.getMuted());
	let sfxVol = $state(sound.getSfxVolume());
	let bgmVol = $state(sound.getBgmVolume());
	let isMusicPlaying = $state(sound.isMusicOn);

	// Name & Class state
	let editName = $state('');
	let editClass = $state('XI-GEO-1');
	let nameMessage = $state('');
	let isSavingName = $state(false);
	let showSaveToast = $state(false);

	// Password state
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let showCurrentPassword = $state(false);
	let showNewPassword = $state(false);
	let showConfirmPassword = $state(false);
	let passwordMessage = $state('');
	let isChangingPassword = $state(false);

	let copiedCert = $state(false);

	function handleToggleMute() {
		const nextMute = !isAudioMuted;
		isAudioMuted = nextMute;
		sound.setMuted(nextMute);
		isMusicPlaying = sound.isMusicOn;
		try { sound.playClick(); } catch {}
	}

	function handleSfxVolChange() {
		sound.setSfxVolume(sfxVol);
		try { sound.playClick(); } catch {}
	}

	function handleBgmVolChange() {
		sound.setBgmVolume(bgmVol);
		if (!isAudioMuted && bgmVol > 0 && !sound.isMusicOn) {
			sound.startMusic();
		} else if (bgmVol === 0) {
			sound.stopMusic();
		}
		isMusicPlaying = sound.isMusicOn;
	}

	function handleToggleBgm() {
		sound.toggleMusic();
		isMusicPlaying = sound.isMusicOn;
	}

	$effect(() => {
		if (isOpen) {
			activeTab = defaultTab;
			const latestProgress = getProgress();
			progressData = latestProgress;
			editName = studentName || '';
			editClass = latestProgress.studentClass || 'XI-GEO-1';
			nameMessage = '';
			passwordMessage = '';
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			isAudioMuted = sound.getMuted();
			sfxVol = sound.getSfxVolume();
			bgmVol = sound.getBgmVolume();
			isMusicPlaying = sound.isMusicOn;
		}
	});

	function isRoomCompleted(roomId: string): boolean {
		if (roomId === 'intro') return progressData.introCompleted;
		if (roomId === 'connection') return progressData.connectionCompleted;
		if (roomId === 'application') return progressData.applicationCompleted;
		if (roomId === 'reflection') return progressData.reflectionQuizPassed;
		if (roomId === 'extension') return progressData.extensionCompleted;
		return false;
	}

	const roomsList = [
		{ id: 'intro', name: 'Room 1: Introduction', desc: 'Pengenalan Tektonisme, Peta Tektonik, & Bentang Alam Jabung', icon: '📖' },
		{ id: 'connection', name: 'Room 2: Connection', desc: 'Jenis-Jenis Longsoran & Video Kejadian Bencana Jabung', icon: '🔗' },
		{ id: 'application', name: 'Room 3: Application', desc: 'Membaca Peta, Kondisi Geografis, Persebaran, & Mitigasi', icon: '📌' },
		{ id: 'reflection', name: 'Room 4: Reflection', desc: 'Evaluasi Kuis (10 Soal) & Esai Analisis Studi Kasus', icon: '📝' },
		{ id: 'extension', name: 'Room 5: Extension', desc: 'Rangkuman Pembelajaran & Refleksi Penutup Modul', icon: '🌐' }
	];

	async function handleSaveName(e: SubmitEvent) {
		e.preventDefault();
		const trimmedName = editName.trim();
		const trimmedClass = editClass.trim();

		if (!trimmedName) {
			nameMessage = '⚠️ Nama tidak boleh kosong!';
			return;
		}

		isSavingName = true;
		nameMessage = '';

		try {
			// Save name and class to local storage & progress
			saveProgress({ studentName: trimmedName, studentClass: trimmedClass });

			// Also sync server progress if endpoint is online
			try {
				await fetch('/api/progress', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ studentName: trimmedName, studentClass: trimmedClass })
				});
			} catch {}

			// Update in Better Auth
			try {
				await authClient.updateUser({
					name: trimmedName
				});
			} catch {}

			onUpdateName(trimmedName);
			nameMessage = '✅ Nama & Kelas berhasil disimpan!';
			showSaveToast = true;
			setTimeout(() => (showSaveToast = false), 2800);
			try { sound.playClick(); } catch {}
		} catch (err: any) {
			nameMessage = `⚠️ Error: ${err.message || 'Gagal memperbarui nama & kelas'}`;
		} finally {
			isSavingName = false;
		}
	}

	async function handleChangePassword(e: SubmitEvent) {
		e.preventDefault();
		if (!currentPassword) {
			passwordMessage = 'Harap masukkan password saat ini!';
			return;
		}
		if (newPassword.length < 6) {
			passwordMessage = 'Password baru minimal harus 6 karakter!';
			return;
		}
		if (newPassword !== confirmPassword) {
			passwordMessage = 'Konfirmasi password baru tidak cocok!';
			return;
		}

		isChangingPassword = true;
		passwordMessage = '';

		try {
			const res = await authClient.changePassword({
				currentPassword,
				newPassword,
				revokeOtherSessions: true
			});

			if (res.error) {
				const lower = (res.error.message || '').toLowerCase();
				if (lower.includes('incorrect') || lower.includes('invalid') || lower.includes('wrong')) {
					passwordMessage = 'Password saat ini tidak sesuai / salah!';
				} else {
					passwordMessage = res.error.message || 'Gagal mengubah password!';
				}
			} else {
				passwordMessage = '✅ Password berhasil diubah!';
				currentPassword = '';
				newPassword = '';
				confirmPassword = '';
				try { sound.playClick(); } catch {}
			}
		} catch (err: any) {
			passwordMessage = 'Gagal mengubah password!';
		} finally {
			isChangingPassword = false;
		}
	}

	function copyCertificateId() {
		navigator.clipboard.writeText(certificateId);
		copiedCert = true;
		setTimeout(() => (copiedCert = false), 2000);
	}

	async function handleSignOut() {
		try {
			await authClient.signOut();
		} catch {}
		onLogout();
	}

	function handleDevReset() {
		try { sound.playClick(); } catch {}
		progressData = resetProgress();
	}

	function handleDevInstantComplete() {
		try { sound.playClick(); } catch {}
		progressData = completeAllProgress(studentName || 'Faridh Arganatha');
	}
</script>

{#if showSaveToast}
	<div
		class="fixed top-5 left-1/2 -translate-x-1/2 z-[70] flex items-center space-x-2.5 px-5 py-3 bg-emerald-600 text-white font-bold text-sm rounded-2xl shadow-2xl border-2 border-white font-bubble"
		transition:fly={{ y: -30, duration: 300 }}
	>
		<CheckCircle2 class="w-5 h-5 shrink-0" />
		<span>Nama & Kelas berhasil disimpan!</span>
	</div>
{/if}

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
		<div class="relative w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-400 shadow-2xl text-slate-800 max-h-[90vh] flex flex-col font-bubble overflow-hidden">
			
			<!-- STICKY TOP HEADER CONTAINER (Fixed at top when scrolling) -->
			<div class="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 sm:px-7 pt-4 sm:pt-5 pb-3 border-b border-slate-200 shrink-0 shadow-xs">
				
				<!-- Close X Button -->
				<button
					type="button"
					onclick={onClose}
					class="absolute top-4 right-4 sm:top-5 sm:right-6 w-9 h-9 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-lg flex items-center justify-center transition-colors shadow-md z-20 cursor-pointer"
				>
					✕
				</button>

				<!-- HEADER BADGE -->
				<div class="flex items-center space-x-3 mb-3 pr-10">
					<div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shrink-0">
						<User class="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
					</div>
					<div>
						<h2 class="text-lg sm:text-2xl font-black text-slate-800 leading-tight">Dashboard & Profil Akun Siswa</h2>
						<p class="text-[11px] sm:text-xs font-semibold text-slate-500 font-sans">Kelola progres pembelajaran, akun, password, dan sertifikat</p>
					</div>
				</div>

				<!-- UNIQUE CERTIFICATE ID BADGE -->
				<div class="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-3 sm:p-4 rounded-2xl shadow-md mb-3 font-sans relative overflow-hidden">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div class="p-1.5 sm:p-2 bg-white/20 rounded-xl backdrop-blur-xs">
								<Award class="w-5 h-5 sm:w-7 sm:h-7 text-amber-200" />
							</div>
							<div>
								<span class="text-[10px] sm:text-[11px] uppercase font-bold text-amber-200 tracking-wider block">ID SERTIFIKAT UNIK AKUN</span>
								<span class="text-sm sm:text-lg font-black tracking-widest font-mono text-white drop-shadow-xs">{certificateId}</span>
							</div>
						</div>
						<button
							type="button"
							onclick={copyCertificateId}
							class="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl backdrop-blur-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
						>
							<Copy class="w-3.5 h-3.5" />
							<span>{copiedCert ? 'Tercopy!' : 'Salin'}</span>
						</button>
					</div>
					<!-- Progress Summary Bar -->
					<div class="mt-2 pt-2 border-t border-white/20 flex items-center justify-between text-xs">
						<span class="font-medium text-amber-100 text-[11px] sm:text-xs">Progres Pembelajaran: <strong class="text-white font-bold">{completionPercentage}%</strong></span>
						<span class="bg-white/20 px-2 py-0.5 rounded-full font-bold text-[10px] sm:text-[11px]">
							{completionPercentage === 100 ? '🎓 Sertifikat Siap' : '📖 Dalam Proses'}
						</span>
					</div>
				</div>

				<!-- NAVIGATION TABS -->
				<div class="flex space-x-1.5 sm:space-x-2 font-bubble">
					<button
						type="button"
						onclick={() => (activeTab = 'progress')}
						class={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
							activeTab === 'progress'
								? 'bg-amber-400 text-amber-950 shadow-md border-2 border-white'
								: 'bg-slate-100 hover:bg-slate-200 text-slate-600'
						}`}
					>
						<BarChart3 class="w-4 h-4 shrink-0" />
						<span>Progres Belajar</span>
					</button>
					<button
						type="button"
						onclick={() => (activeTab = 'profile')}
						class={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
							activeTab === 'profile'
								? 'bg-amber-400 text-amber-950 shadow-md border-2 border-white'
								: 'bg-slate-100 hover:bg-slate-200 text-slate-600'
						}`}
					>
						<User class="w-4 h-4 shrink-0" />
						<span>Profil & Nama</span>
					</button>
					<button
						type="button"
						onclick={() => (activeTab = 'audio')}
						class={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
							activeTab === 'audio'
								? 'bg-amber-400 text-amber-950 shadow-md border-2 border-white'
								: 'bg-slate-100 hover:bg-slate-200 text-slate-600'
						}`}
					>
						<Volume2 class="w-4 h-4 shrink-0" />
						<span>Suara</span>
					</button>
					<button
						type="button"
						onclick={() => (activeTab = 'security')}
						class={`flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
							activeTab === 'security'
								? 'bg-amber-400 text-amber-950 shadow-md border-2 border-white'
								: 'bg-slate-100 hover:bg-slate-200 text-slate-600'
						}`}
					>
						<ShieldCheck class="w-4 h-4 shrink-0" />
						<span>Password</span>
					</button>
				</div>
			</div>

			<!-- SCROLLABLE TAB CONTENT BODY -->
			<div class="flex-1 overflow-y-auto p-5 sm:p-7">

			<!-- TAB 1: PROGRES PEMBELAJARAN SISWA -->
			{#if activeTab === 'progress'}
				<div class="space-y-4 font-sans text-left">
					<!-- PROGRESS BAR COMPONENT -->
					<div class="space-y-2">
						<div class="flex justify-between items-center text-xs font-bold text-gray-700">
							<span>Kelengkapan Modul I-CARE</span>
							<span class="text-amber-600 font-extrabold">{completionPercentage}% Selesai</span>
						</div>
						<div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden p-0.5 border border-gray-300">
							<div
								class="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500 shadow-inner"
								style="width: {completionPercentage}%;"
							></div>
						</div>
					</div>

					<!-- REKAP NILAI TERBAIK (BEST SCORES DASHBOARD) -->
					<div class="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-purple-500/10 rounded-2xl p-4 border-2 border-amber-300 space-y-3 font-sans">
						<div class="flex items-center justify-between">
							<h5 class="text-xs font-black uppercase text-amber-950 tracking-wider flex items-center space-x-1.5 font-bubble">
								<span>🏆</span>
								<span>Rekap Nilai Terbaik Siswa</span>
							</h5>
							<span class="text-[10px] font-extrabold px-2 py-0.5 bg-amber-400 text-amber-950 rounded-full font-bubble">
								Skor Tertinggi
							</span>
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
							<!-- KUIS SCORE -->
							<div class="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs flex flex-col justify-between">
								<span class="text-[11px] font-bold text-slate-500 block">Kuis Pilihan Ganda</span>
								<div class="flex items-baseline justify-between mt-1">
									<span class="text-xl font-black text-amber-600 font-mono">{progressData.quizScore || 0}</span>
									<span class="text-xs font-bold text-slate-400 font-mono">/ 100</span>
								</div>
								<span class="mt-1 text-[10px] font-extrabold inline-block text-emerald-700">
									{progressData.reflectionQuizPassed ? '✅ Lulus Kuis' : '⏳ Lum Lulus'}
								</span>
							</div>

							<!-- ESSAY SCORE -->
							<div class="bg-white p-3 rounded-xl border border-purple-200 shadow-2xs flex flex-col justify-between">
								<span class="text-[11px] font-bold text-slate-500 block">Esai AI Studi Kasus</span>
								<div class="flex items-baseline justify-between mt-1">
									<span class="text-xl font-black text-purple-600 font-mono">{progressData.essayScore || 0}</span>
									<span class="text-xs font-bold text-slate-400 font-mono">/ 100</span>
								</div>
								<span class="mt-1 text-[10px] font-extrabold inline-block text-purple-700">
									{progressData.reflectionEssayCompleted ? '✨ Evaluasi AI' : '⏳ Belum Mengisi'}
								</span>
							</div>

							<!-- TOTAL AVERAGE -->
							<div class="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs flex flex-col justify-between">
								<span class="text-[11px] font-bold text-slate-500 block">Rata-Rata Akhir</span>
								<div class="flex items-baseline justify-between mt-1">
									<span class="text-xl font-black text-emerald-600 font-mono">
										{Math.round(((progressData.quizScore || 0) + (progressData.essayScore || 0)) / 2)}
									</span>
									<span class="text-xs font-bold text-slate-400 font-mono">/ 100</span>
								</div>
								<span class="mt-1 text-[10px] font-extrabold inline-block text-emerald-700">
									📊 Nilai Gabungan
								</span>
							</div>
						</div>
					</div>

					<!-- REVIEW JAWABAN & FEEDBACK ESAI TERBARU -->
					{#if progressData.latestEssayAnswerA || progressData.reflectionEssayCompleted}
						<div class="bg-purple-50/80 rounded-2xl p-4 border-2 border-purple-200 space-y-3 font-sans">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-purple-200 pb-2">
								<h5 class="text-xs font-black uppercase text-purple-950 tracking-wider flex items-center space-x-1.5 font-bubble">
									<span>📝</span>
									<span>Review Jawaban & Ulasan Esai Terbaru</span>
								</h5>
								<span class="text-[10px] font-bold px-2.5 py-1 bg-purple-200 text-purple-900 rounded-full font-mono whitespace-nowrap shrink-0 self-start sm:self-auto shadow-2xs">
									Room 4
								</span>
							</div>

							<!-- SOAL A -->
							<div class="bg-white p-3 rounded-xl border border-purple-100 space-y-1.5 shadow-2xs">
								<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
									<span class="text-xs font-extrabold text-purple-950 font-bubble">Soal A: Kerawanan Longsor</span>
									{#if progressData.latestEssayRubric}
										<span class="text-[10px] font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md font-mono self-start sm:self-auto">
											Sub-skor: {progressData.latestEssayRubric.a || 0} / 35
										</span>
									{/if}
								</div>
								<p class="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium whitespace-pre-wrap">
									{progressData.latestEssayAnswerA || '(Tidak ada jawaban)'}
								</p>
							</div>

							<!-- SOAL B -->
							<div class="bg-white p-3 rounded-xl border border-purple-100 space-y-1.5 shadow-2xs">
								<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
									<span class="text-xs font-extrabold text-purple-950 font-bubble">Soal B: Peta Tematik</span>
									{#if progressData.latestEssayRubric}
										<span class="text-[10px] font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md font-mono self-start sm:self-auto">
											Sub-skor: {progressData.latestEssayRubric.b || 0} / 35
										</span>
									{/if}
								</div>
								<p class="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium whitespace-pre-wrap">
									{progressData.latestEssayAnswerB || '(Tidak ada jawaban)'}
								</p>
							</div>

							<!-- SOAL C -->
							<div class="bg-white p-3 rounded-xl border border-purple-100 space-y-1.5 shadow-2xs">
								<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
									<span class="text-xs font-extrabold text-purple-950 font-bubble">Soal C: Mitigasi & Konservasi</span>
									{#if progressData.latestEssayRubric}
										<span class="text-[10px] font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md font-mono self-start sm:self-auto">
											Sub-skor: {progressData.latestEssayRubric.c || 0} / 30
										</span>
									{/if}
								</div>
								<p class="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium whitespace-pre-wrap">
									{progressData.latestEssayAnswerC || '(Tidak ada jawaban)'}
								</p>
							</div>

							<!-- FEEDBACK -->
							{#if progressData.latestEssayFeedback}
								<div class="bg-purple-100/60 p-3 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-1">
									<strong class="font-bold flex items-center space-x-1 text-purple-900 font-bubble">
										<span>📋 Feedback Evaluasi Pengajar AI:</span>
									</strong>
									<p class="leading-relaxed font-medium">
										{progressData.latestEssayFeedback}
									</p>
								</div>
							{/if}
						</div>
					{/if}

					<!-- ROOM STATUS BREAKDOWN -->
					<div class="space-y-2.5 pt-2">
						<h5 class="text-xs font-extrabold uppercase text-gray-400 tracking-wider font-bubble">
							STATUS TIAP ROOM PEMBELAJARAN
						</h5>

						<div class="grid grid-cols-1 gap-2">
							{#each roomsList as room}
								{@const isDone = isRoomCompleted(room.id)}
								<div class={`p-3 rounded-xl border-2 flex items-center justify-between transition-all ${
									isDone ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-gray-50 border-gray-200 text-gray-700'
								}`}>
									<div class="flex items-center space-x-3 text-left">
										<span class="text-xl">{room.icon}</span>
										<div>
											<h6 class="font-bold text-xs sm:text-sm leading-tight">{room.name}</h6>
											<p class="text-[11px] text-gray-500 font-medium">{room.desc}</p>
										</div>
									</div>

									<div class="shrink-0 pl-2">
										{#if isDone}
											<span class="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-lg shadow-xs flex items-center space-x-1">
												<Check class="w-3.5 h-3.5" />
												<span>Selesai</span>
											</span>
										{:else}
											<span class="px-2.5 py-1 bg-gray-200 text-gray-600 font-bold text-xs rounded-lg">
												Belum
											</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>

					<!-- CLAIM CERTIFICATE BUTTON (Locked when < 100%) -->
					<div class="pt-2 font-bubble">
						{#if completionPercentage === 100}
							<button
								type="button"
								onclick={() => {
									onClose();
									onOpenCertificate?.();
								}}
								class="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 border-3 border-white shadow-xl rounded-2xl text-amber-950 font-extrabold text-base sm:text-lg tracking-wide transform active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer animate-pulse"
								style="box-shadow: 0 4px 0 0 #78350f, 0 8px 20px rgba(0, 0, 0, 0.2);"
							>
								<span class="text-xl sm:text-2xl">🎓</span>
								<span>LIHAT & UNDUH SERTIFIKAT KELULUSAN</span>
							</button>
						{:else}
							<button
								disabled
								class="w-full py-3 px-6 bg-slate-100 border-2 border-slate-300 rounded-2xl text-slate-400 font-extrabold text-xs sm:text-sm tracking-wide flex items-center justify-center space-x-2 cursor-not-allowed opacity-85"
							>
								<Lock class="w-4 h-4 text-slate-400" />
								<span>SELESAIKAN 100% MODUL UNTUK MEMBUKA SERTIFIKAT</span>
							</button>
						{/if}
					</div>

					{#if showDevTools}
						<!-- DEVELOPER TESTING TOOLS PANEL -->
						<div class="pt-3 border-t-2 border-dashed border-amber-200 font-bubble">
							<div class="bg-amber-100/70 p-3.5 rounded-2xl border-2 border-amber-300 space-y-2.5">
								<div class="flex items-center justify-between">
									<span class="text-xs font-black text-amber-950 flex items-center space-x-1.5 uppercase tracking-wide">
										<span>🛠️</span>
										<span>Developer Testing Tools</span>
									</span>
									<span class="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-md font-sans font-bold uppercase tracking-wider">
										Dev Controls
									</span>
								</div>
								<div class="grid grid-cols-2 gap-2.5 font-sans">
									<button
										type="button"
										onclick={handleDevReset}
										class="px-3 py-2 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md border-2 border-white flex items-center justify-center space-x-1.5 cursor-pointer transition-transform active:scale-95"
									>
										<span>🔄</span>
										<span>Reset Progress (0%)</span>
									</button>
									<button
										type="button"
										onclick={handleDevInstantComplete}
										class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md border-2 border-white flex items-center justify-center space-x-1.5 cursor-pointer transition-transform active:scale-95"
									>
										<span>⚡</span>
										<span>Instant Complete (100%)</span>
									</button>
								</div>
								<button
									type="button"
									onclick={() => {
										try { sound.playClick(); } catch {}
										onClose();
										onTriggerSplash?.();
									}}
									class="w-full mt-2 px-3 py-2 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md border-2 border-white flex items-center justify-center space-x-2 cursor-pointer transition-transform active:scale-95 font-sans uppercase tracking-wider"
								>
									<span>🎬</span>
									<span>Trigger Splash Screen (Dev Tool)</span>
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- TAB 2: PROFILE & NAME -->
			{#if activeTab === 'profile'}
				<form novalidate onsubmit={handleSaveName} class="space-y-4 font-sans text-left">
					{#if studentEmail}
						<div>
							<label for="studentEmail" class="block text-xs font-bold text-slate-600 mb-1">Email Terdaftar</label>
							<div class="flex items-center space-x-2 bg-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold">
								<Mail class="w-4 h-4 text-slate-400 shrink-0" />
								<span id="studentEmail">{studentEmail}</span>
							</div>
						</div>
					{/if}

					<div>
						<label for="editNameInput" class="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Siswa (Dicetak di Sertifikat)</label>
						<input
							id="editNameInput"
							type="text"
							bind:value={editName}
							required
							placeholder="Masukkan nama lengkap Anda..."
							class="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-300 focus:border-amber-500 rounded-xl text-sm font-bold text-slate-800 outline-none transition-colors"
						/>
					</div>

					<div>
						<label for="editClassInput" class="block text-xs font-bold text-slate-700 mb-1">Kelas / Rombel Siswa</label>
						<input
							id="editClassInput"
							type="text"
							bind:value={editClass}
							placeholder="Ketik nama kelas Anda (contoh: XI GEO 1, XII IPS 2...)"
							class="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-300 focus:border-amber-500 rounded-xl text-sm font-bold text-slate-800 outline-none transition-colors"
						/>
					</div>

					{#if nameMessage}
						<p class={`text-xs font-bold ${nameMessage.startsWith('✅') ? 'text-emerald-600' : 'text-rose-600'}`}>
							{nameMessage}
						</p>
					{/if}

					<div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 font-bubble">
						<button
							type="submit"
							disabled={isSavingName}
							class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md border-2 border-white cursor-pointer transition-transform active:scale-95 disabled:opacity-50 whitespace-nowrap"
						>
							{isSavingName ? 'Menyimpan...' : 'Simpan Perubahan Nama & Kelas'}
						</button>

						<button
							type="button"
							onclick={handleSignOut}
							class="w-full sm:w-auto px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer whitespace-nowrap"
						>
							<LogOut class="w-4 h-4" />
							<span>Keluar Akun (Logout)</span>
						</button>
					</div>
				</form>
			{/if}

			<!-- TAB 3: AUDIO & SOUND SETTINGS -->
			{#if activeTab === 'audio'}
				<div class="space-y-4 font-sans text-left animate-fade-in">
					
					<!-- Master Audio Mute Toggle Card -->
					<div class="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
						<div class="flex items-center space-x-3">
							<div class={`p-2.5 rounded-xl text-white font-bold ${isAudioMuted ? 'bg-rose-500' : 'bg-emerald-500'}`}>
								{#if isAudioMuted}
									<VolumeX class="w-5 h-5" />
								{:else}
									<Volume2 class="w-5 h-5" />
								{/if}
							</div>
							<div>
								<h3 class="text-sm font-extrabold text-slate-800">Master Audio & Suara</h3>
								<p class="text-xs text-slate-500 font-medium">
									{isAudioMuted ? 'Seluruh efek suara dan musik dimatikan (Mute)' : 'Seluruh suara & musik aktif'}
								</p>
							</div>
						</div>
						
						<button
							type="button"
							onclick={handleToggleMute}
							class={`px-3.5 py-2 rounded-xl font-extrabold text-xs sm:text-sm font-bubble border-2 border-white shadow-md transition-all cursor-pointer ${
								isAudioMuted
									? 'bg-rose-500 text-white hover:bg-rose-600'
									: 'bg-emerald-500 text-white hover:bg-emerald-600'
							}`}
						>
							{isAudioMuted ? '🔇 Unmute' : '🔊 Mute Suara'}
						</button>
					</div>

					<!-- SFX Volume Control Card -->
					<div class="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-xs">
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-2.5">
								<div class="p-2 bg-sky-100 text-sky-700 rounded-lg">
									<Volume2 class="w-4 h-4" />
								</div>
								<div>
									<h4 class="text-xs font-bold text-slate-800 uppercase tracking-wide">Volume Efek Suara (SFX)</h4>
									<p class="text-[11px] text-slate-500">Suara klik tombol, interaksi kartu, dan jawaban quiz</p>
								</div>
							</div>
							<span class="text-xs font-extrabold text-sky-700 font-mono bg-sky-100 px-2 py-0.5 rounded-md">
								{Math.round(sfxVol * 100)}%
							</span>
						</div>

						<div class="flex items-center space-x-3 pt-1">
							<VolumeX class="w-4 h-4 text-slate-400 shrink-0" />
							<input
								type="range"
								min="0"
								max="1"
								step="0.05"
								bind:value={sfxVol}
								oninput={handleSfxVolChange}
								disabled={isAudioMuted}
								class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500 disabled:opacity-40"
							/>
							<Volume2 class="w-4 h-4 text-sky-600 shrink-0" />
						</div>
					</div>

					<!-- BGM Volume Control Card -->
					<div class="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-xs">
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-2.5">
								<div class="p-2 bg-purple-100 text-purple-700 rounded-lg">
									<Music class="w-4 h-4" />
								</div>
								<div>
									<h4 class="text-xs font-bold text-slate-800 uppercase tracking-wide">Volume Musik Latar (BGM)</h4>
									<p class="text-[11px] text-slate-500">Musik melodi latar belakang E-Modul</p>
								</div>
							</div>
							<span class="text-xs font-extrabold text-purple-700 font-mono bg-purple-100 px-2 py-0.5 rounded-md">
								{Math.round(bgmVol * 100)}%
							</span>
						</div>

						<div class="flex items-center space-x-3 pt-1">
							<VolumeX class="w-4 h-4 text-slate-400 shrink-0" />
							<input
								type="range"
								min="0"
								max="1"
								step="0.05"
								bind:value={bgmVol}
								oninput={handleBgmVolChange}
								disabled={isAudioMuted}
								class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-40"
							/>
							<Volume2 class="w-4 h-4 text-purple-600 shrink-0" />
						</div>

						<div class="pt-1 flex items-center justify-between border-t border-slate-200 mt-2">
							<span class="text-[11px] text-slate-600 font-medium">Status Musik Latar: <strong>{isMusicPlaying ? '▶️ Sedang Memutar' : '⏸️ Berhenti'}</strong></span>
							<button
								type="button"
								onclick={handleToggleBgm}
								disabled={isAudioMuted}
								class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-transform active:scale-95 cursor-pointer disabled:opacity-40 font-bubble"
							>
								<span>{isMusicPlaying ? '⏸️ Jeda Musik' : '▶️ Putar Musik'}</span>
							</button>
						</div>
					</div>

				</div>
			{/if}

			<!-- TAB 4: CHANGE PASSWORD -->
			{#if activeTab === 'security'}
				<form novalidate onsubmit={handleChangePassword} class="space-y-3.5 font-sans text-left">
					<div>
						<label for="currPass" class="block text-xs font-bold text-slate-700 mb-1">Password Saat Ini</label>
						<div class="relative">
							<input
								id="currPass"
								type={showCurrentPassword ? 'text' : 'password'}
								bind:value={currentPassword}
								placeholder="••••••••"
								class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-2 border-slate-300 focus:border-amber-500 rounded-xl text-sm font-semibold text-slate-800 outline-none"
							/>
							<button
								type="button"
								onclick={() => (showCurrentPassword = !showCurrentPassword)}
								class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
								title={showCurrentPassword ? 'Sembunyikan Password' : 'Lihat Password'}
							>
								{#if showCurrentPassword}
									<EyeOff class="w-4 h-4" />
								{:else}
									<Eye class="w-4 h-4" />
								{/if}
							</button>
						</div>
					</div>

					<div>
						<label for="newPass" class="block text-xs font-bold text-slate-700 mb-1">Password Baru (Min 6 Karakter)</label>
						<div class="relative">
							<input
								id="newPass"
								type={showNewPassword ? 'text' : 'password'}
								bind:value={newPassword}
								placeholder="••••••••"
								class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-2 border-slate-300 focus:border-amber-500 rounded-xl text-sm font-semibold text-slate-800 outline-none"
							/>
							<button
								type="button"
								onclick={() => (showNewPassword = !showNewPassword)}
								class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
								title={showNewPassword ? 'Sembunyikan Password' : 'Lihat Password'}
							>
								{#if showNewPassword}
									<EyeOff class="w-4 h-4" />
								{:else}
									<Eye class="w-4 h-4" />
								{/if}
							</button>
						</div>
					</div>

					<div>
						<label for="confirmPass" class="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Password Baru</label>
						<div class="relative">
							<input
								id="confirmPass"
								type={showConfirmPassword ? 'text' : 'password'}
								bind:value={confirmPassword}
								placeholder="••••••••"
								class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-2 border-slate-300 focus:border-amber-500 rounded-xl text-sm font-semibold text-slate-800 outline-none"
							/>
							<button
								type="button"
								onclick={() => (showConfirmPassword = !showConfirmPassword)}
								class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
								title={showConfirmPassword ? 'Sembunyikan Password' : 'Lihat Password'}
							>
								{#if showConfirmPassword}
									<EyeOff class="w-4 h-4" />
								{:else}
									<Eye class="w-4 h-4" />
								{/if}
							</button>
						</div>
					</div>

					{#if passwordMessage}
						{#if passwordMessage.startsWith('✅')}
							<div class="p-2.5 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fade-in">
								<CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
								<span>{passwordMessage.replace('✅ ', '')}</span>
							</div>
						{:else}
							<div class="p-2.5 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-800 text-xs font-bold flex items-center space-x-2 animate-fade-in">
								<AlertTriangle class="w-4 h-4 text-rose-600 shrink-0" />
								<span>{passwordMessage}</span>
							</div>
						{/if}
					{/if}

					<div class="pt-2 font-bubble">
						<button
							type="submit"
							disabled={isChangingPassword}
							class="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-md border-2 border-white cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
						>
							{isChangingPassword ? 'Memproses...' : 'Ubah Password'}
						</button>
					</div>
				</form>
			{/if}

			</div>
		</div>
	</div>
{/if}
