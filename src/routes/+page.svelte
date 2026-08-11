<script lang="ts">
	import { sound } from '$lib/utils/audio';
	import UMLogo from '$lib/components/UMLogo.svelte';
	import GirlCharacter from '$lib/components/GirlCharacter.svelte';
	import BoyCharacter from '$lib/components/BoyCharacter.svelte';
	import LandscapeBackground from '$lib/components/LandscapeBackground.svelte';
	import Title from '$lib/components/Title.svelte';
	import CloudSpeechBubble from '$lib/components/CloudSpeechBubble.svelte';
	import CertificateModal from '$lib/components/CertificateModal.svelte';
	import ProgressDashboardModal from '$lib/components/ProgressDashboardModal.svelte';
	import ProfileSettingsModal from '$lib/components/ProfileSettingsModal.svelte';
	import TeacherLeaderboardModal from '$lib/components/TeacherLeaderboardModal.svelte';
	import LoginScreen from '$lib/components/LoginScreen.svelte';
	import SplashScreen from '$lib/components/SplashScreen.svelte';
	import { goto } from '$app/navigation';
	import { getProgress, saveProgress, resetProgress, calculateCompletion } from '$lib/utils/progress';

	// Lucide Icons
	import { Search, ArrowLeftRight, Download, Users, Globe, User, Award, GraduationCap } from '@lucide/svelte';

	// Reactive state
	let isMusicActive = $state(sound.isMusicOn);
	$effect(() => {
		isMusicActive = sound.isMusicOn;
	});
	let activeModal = $state<'none' | 'info' | 'exit' | 'edit-name' | 'profile' | 'progress' | 'certificate' | 'developer'>('none');
	let infoTab = $state<'buttons' | 'attribution'>('buttons');

	let progress = $state(getProgress());
	let completion = $derived(calculateCompletion(progress));
	let isFirstVisit = $derived(!progress.studentName || progress.studentName === 'Siswa' || progress.studentName.trim() === '');
	function shouldShowSplash(): boolean {
		if (typeof window === 'undefined') return true;
		// An actual browser refresh always replays the splash, regardless of
		// whether it was already shown earlier in this tab.
		const navType = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
		if (navType?.type === 'reload') return true;
		// Otherwise (first-ever visit, or a client-side "back to main menu" nav
		// from a module page) only show it if it hasn't played yet this tab.
		try {
			return sessionStorage.getItem('icare_splash_shown') !== 'true';
		} catch {
			return true;
		}
	}

	let showSplash = $state(shouldShowSplash());
	let userEmail = $state('');
	let userCertId = $state('');
	let isTeacherModalOpen = $state(false);

	function handleFinishSplash() {
		showSplash = false;
		try { sessionStorage.setItem('icare_splash_shown', 'true'); } catch {}
	}

	function handleLogin(name: string, email?: string, certId?: string, role?: 'student' | 'teacher', studentClass?: string) {
		const resolvedRole = role ?? 'student';
		const updates: Partial<any> = { studentName: name, role: resolvedRole };
		if (certId) updates.certificateId = certId;
		if (studentClass) updates.studentClass = studentClass;
		saveProgress(updates);
		progress = getProgress();
		if (email) userEmail = email;
		if (certId) userCertId = certId;
		if (activeModal === 'edit-name') {
			activeModal = 'none';
		}
	}

	let isTeacherRole = $derived(progress.role === 'teacher');

	function refreshProgress() {
		progress = getProgress();
	}

	function handleCardClick(url: string) {
		sound.playClick();
		goto(url);
	}

	function toggleAudio() {
		sound.playClick();
		isMusicActive = sound.toggleMusic();
	}

	function openModal(type: 'info' | 'exit' | 'edit-name' | 'profile' | 'progress' | 'certificate' | 'developer') {
		sound.playClick();
		activeModal = type;
	}

	function closeModal() {
		sound.playClick();
		activeModal = 'none';
	}

	function saveName(e: SubmitEvent) {
		e.preventDefault();
		sound.playClick();
		activeModal = 'none';
	}
</script>

<svelte:head>
	<title>I-CARE LANDSLIDE - Main Menu</title>
</svelte:head>

{#if showSplash}
	<SplashScreen onFinish={handleFinishSplash} />
{:else if isFirstVisit || activeModal === 'edit-name'}
	<LoginScreen
		initialName={progress.studentName !== 'Siswa' ? progress.studentName : ''}
		onLogin={handleLogin}
		isEditMode={activeModal === 'edit-name'}
		onClose={() => (activeModal = 'none')}
	/>
{:else}
<!-- Responsive Container: Fixed height on large screens, Scrollable on mobile/small screens -->
<main class="relative min-h-screen lg:h-screen lg:h-dvh w-full overflow-y-auto lg:overflow-hidden flex flex-col justify-between p-3 sm:p-4 select-none font-bubble print:hidden">
	<!-- Landscape Vector Environment Background -->
	<LandscapeBackground />

	<!-- TOP HEADER BAR -->
	<header class="relative z-10 w-full flex items-center justify-between shrink-0">
		<!-- Top Left: Universitas Negeri Malang Logo -->
		<div class="flex items-center justify-center bg-white/90 backdrop-blur-md p-1.5 sm:px-3.5 sm:py-1.5 rounded-full border-2 border-white/90 shadow-lg">
			<UMLogo className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md shrink-0" />
			<div class="hidden sm:flex flex-col ml-3">
				<span class="text-xs font-bold text-gray-800 uppercase tracking-wide leading-tight">Universitas Negeri</span>
				<span class="text-xs font-extrabold text-blue-900 uppercase tracking-widest leading-tight">Malang</span>
			</div>
		</div>

		<!-- Top Right: Action Buttons (Certificate, Account, Info, Music, Exit) -->
		<div class="flex items-center space-x-2 sm:space-x-3">

			<!-- Quick Certificate Button (Student only, visible when progress is 100%) -->
			{#if !isTeacherRole && completion === 100}
				<button
					onclick={() => openModal('certificate')}
					onmouseenter={() => sound.playCardHover()}
					aria-label="Sertifikat Kelulusan"
					class="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-b from-amber-400 to-yellow-600 border-2 border-white shadow-md flex items-center justify-center text-white transform active:scale-95 transition-all hover:scale-105 animate-bounce cursor-pointer"
					style="box-shadow: 0 5px 0 0 #78350f, 0 8px 15px rgba(0, 0, 0, 0.2);"
					title="Lihat / Unduh Sertifikat Kelulusan"
				>
					<span class="absolute inset-x-2 top-1 h-1.5 bg-white/40 rounded-full"></span>
					<span class="text-xl sm:text-2xl">🎓</span>
				</button>
			{/if}

			<!-- Teacher Leaderboard Button (Teacher role only) -->
			{#if isTeacherRole}
				<button
					onclick={() => {
						try { sound.playClick(); } catch {}
						isTeacherModalOpen = true;
					}}
					onmouseenter={() => sound.playCardHover()}
					aria-label="Dashboard Guru & Leaderboard"
					title="Rekap Nilai Terbaik Siswa (Dashboard Guru)"
					class="group relative w-10 sm:w-auto h-10 sm:h-12 sm:px-3.5 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-white shadow-md flex items-center justify-center gap-1.5 text-amber-950 font-black text-xs sm:text-sm transform active:scale-95 transition-all hover:scale-105 font-bubble"
					style="box-shadow: 0 5px 0 0 #78350f, 0 8px 15px rgba(0, 0, 0, 0.2);"
				>
					<span class="absolute inset-x-2 top-1 h-1.5 bg-white/40 rounded-full"></span>
					<GraduationCap class="w-4 h-4 sm:w-5 sm:h-5 text-amber-950 shrink-0" />
					<span class="hidden sm:inline">Nilai Siswa</span>
				</button>
			{/if}

			<!-- Account Profile Button (Student role only) -->
			{#if !isTeacherRole}
				<button
					onclick={() => openModal('profile')}
					onmouseenter={() => sound.playCardHover()}
					aria-label="Pengaturan Akun & Profil"
					title="Pengaturan Akun & Profil Siswa"
					class="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-b from-sky-400 to-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white transform active:scale-95 transition-all hover:scale-105"
					style="box-shadow: 0 5px 0 0 #1e1b4b, 0 8px 15px rgba(0, 0, 0, 0.2);"
				>
					<span class="absolute inset-x-2 top-1 h-1.5 bg-white/40 rounded-full"></span>
					<User class="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm group-hover:scale-110 transition-transform stroke-[2.5]" />
				</button>
			{/if}

			<!-- Info Button -->
			<button
				onclick={() => openModal('info')}
				onmouseenter={() => sound.playCardHover()}
				aria-label="Informasi"
				class="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-b from-lime-400 to-green-500 border-2 border-white shadow-md flex items-center justify-center text-white transform active:scale-95 transition-all hover:scale-105"
				style="box-shadow: 0 5px 0 0 #3b6807, 0 8px 15px rgba(0, 0, 0, 0.2);"
			>
				<span class="absolute inset-x-2 top-1 h-1.5 bg-white/40 rounded-full"></span>
				<svg class="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm group-hover:rotate-6 transition-transform" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="50" cy="50" r="36" stroke="#ffffff" stroke-width="9" />
					<circle cx="53" cy="33" r="5.5" fill="#ffffff" />
					<path
						d="M 43,46 C 47,44 54,42 54,50 C 54,58 46,62 48,68 C 49,70 53,70 57,68"
						stroke="#ffffff"
						stroke-width="8.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>

			<!-- Music Button -->
			<button
				onclick={toggleAudio}
				onmouseenter={() => sound.playCardHover()}
				aria-label="Toggle Musik"
				class={`group relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border-2 border-white shadow-md flex items-center justify-center text-white transform active:scale-95 transition-all hover:scale-105 ${
					isMusicActive ? 'bg-gradient-to-b from-emerald-400 to-teal-600 ring-4 ring-emerald-300' : 'bg-gradient-to-b from-lime-400 to-green-500'
				}`}
				style="box-shadow: 0 5px 0 0 #3b6807, 0 8px 15px rgba(0, 0, 0, 0.2);"
			>
				<span class="absolute inset-x-2 top-1 h-1.5 bg-white/40 rounded-full"></span>
				<svg class="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
					<path d="M9 18V5l12-2v13" />
					<circle cx="6" cy="18" r="3" />
					<circle cx="18" cy="16" r="3" />
				</svg>
			</button>

			<!-- Exit / Back to Login Screen Button -->
			<button
				onclick={() => openModal('edit-name')}
				onmouseenter={() => sound.playCardHover()}
				aria-label="Kembali ke Layar Login"
				title="Kembali ke Layar Login"
				class="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-b from-red-400 to-rose-600 border-2 border-white shadow-md flex items-center justify-center text-white transform active:scale-95 transition-all hover:scale-105"
				style="box-shadow: 0 5px 0 0 #9f1239, 0 8px 15px rgba(0, 0, 0, 0.2);"
			>
				<span class="absolute inset-x-2 top-1 h-1.5 bg-white/40 rounded-full"></span>
				<svg class="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>
	</header>

	<!-- MAIN CONTENT AREA -->
	<div class="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col items-center justify-between min-h-0 py-1">
		<!-- CENTER TOP TITLE: PROMINENT TITLE GRAPHIC (Larger & Perfectly Centered with generous breathing room) -->
		<div class="w-full flex items-center justify-center text-center shrink-0 my-4 sm:my-3 lg:my-2 py-3 sm:py-2 lg:py-1 font-bubble transform hover:scale-105 transition-transform duration-300">
			<Title className="h-24 sm:h-40 md:h-52 lg:h-60 w-auto max-w-[85vw] sm:max-w-none object-contain mx-auto drop-shadow-2xl" />
		</div>

		{#if isTeacherRole}
			<!-- TEACHER HOME: Dedicated Portal (no access to student modules/certificate) -->
			<div class="w-full flex-1 min-h-0 flex items-center justify-center px-2">
				<div class="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl border-4 border-amber-400 p-6 sm:p-8 shadow-2xl text-center font-sans" style="box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);">
					<div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-4 border-white shadow-xl flex items-center justify-center text-white mb-3">
						<GraduationCap class="w-9 h-9 sm:w-11 sm:h-11" />
					</div>
					<h2 class="text-xl sm:text-2xl font-black text-amber-950 font-bubble">Portal Guru / Pengajar</h2>
					<p class="text-xs sm:text-sm text-slate-600 font-medium mt-1 mb-5">
						Halo, <strong>{progress.studentName}</strong>! Akun ini hanya memiliki akses ke rekap nilai siswa, bukan modul pembelajaran siswa.
					</p>
					<button
						onclick={() => {
							try { sound.playClick(); } catch {}
							isTeacherModalOpen = true;
						}}
						class="w-full py-3 px-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 border-2 border-white shadow-lg rounded-2xl text-white font-extrabold text-sm sm:text-base tracking-wide uppercase transform active:scale-95 transition-all hover:scale-[1.01] flex items-center justify-center space-x-2 cursor-pointer font-bubble"
						style="box-shadow: 0 4px 0 0 #78350f;"
					>
						<Award class="w-5 h-5" />
						<span>Buka Dashboard Nilai Siswa</span>
					</button>
				</div>
			</div>
		{:else}
			<!-- CONTENT BODY: Girl Left (3 cols) - Cards Grid Center (6 cols) - Boy Right (3 cols) -->
			<div class="w-full flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 items-center justify-between gap-3 sm:gap-4 px-2">

				<!-- LEFT COLUMN: Girl & Fluffy Dashed Cloud Thought Bubble Floating Above -->
				<div class="hidden lg:flex lg:col-span-3 flex-col items-center justify-end h-full max-h-full pb-1 sm:pb-2 w-full">
					<!-- Fluffy Cloud Thought Bubble Floating Above Girl -->
					<div class="shrink-0 mb-1 sm:mb-2 z-10">
						<CloudSpeechBubble
							userName={progress.studentName}
							onmouseenter={() => sound.playCardHover()}
						/>
					</div>

					<!-- Girl Character -->
					<div class="transform hover:rotate-1 transition-transform shrink-0">
						<GirlCharacter className="h-44 sm:h-52 md:h-60 lg:h-68 xl:h-76 w-auto drop-shadow-xl" />
					</div>
				</div>

				<!-- CENTER COLUMN: Equal 3-Column Uniform Cards Grid (Mathematically Centered) -->
				<div class="lg:col-span-6 w-full max-w-2xl lg:max-w-3xl grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 my-auto mx-auto">

					<!-- 1. Introduction Card -->
					<button
						onclick={() => handleCardClick('/introduction')}
						onmouseenter={() => sound.playCardHover()}
						class="menu-card-3d bg-[#20b2aa] border-4 border-white text-white p-3 sm:p-4 aspect-square cursor-pointer group"
					>
						<div class="mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
							<Search class="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 text-white stroke-[2.6] drop-shadow-lg" />
						</div>
						<span class="text-sm sm:text-lg md:text-xl font-bold tracking-wide text-shadow">Introduction</span>
					</button>

					<!-- 2. Connection Card -->
					<button
						onclick={() => handleCardClick('/connection')}
						onmouseenter={() => sound.playCardHover()}
						class="menu-card-3d bg-[#ff7043] border-4 border-white text-white p-3 sm:p-4 aspect-square cursor-pointer group"
					>
						<div class="mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
							<ArrowLeftRight class="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 text-white stroke-[2.6] drop-shadow-lg" />
						</div>
						<span class="text-sm sm:text-lg md:text-xl font-bold tracking-wide text-shadow">Connection</span>
					</button>

					<!-- 3. Application Card -->
					<button
						onclick={() => handleCardClick('/application')}
						onmouseenter={() => sound.playCardHover()}
						class="menu-card-3d bg-[#00b0ff] border-4 border-white text-white p-3 sm:p-4 aspect-square cursor-pointer group"
					>
						<div class="mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
							<Download class="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 text-white stroke-[2.6] drop-shadow-lg" />
						</div>
						<span class="text-sm sm:text-lg md:text-xl font-bold tracking-wide text-shadow">Application</span>
					</button>

					<!-- 4. Reflection Card -->
					<button
						onclick={() => handleCardClick('/reflection')}
						onmouseenter={() => sound.playCardHover()}
						class="menu-card-3d bg-[#fbc02d] border-4 border-white text-white p-3 sm:p-4 aspect-square cursor-pointer group"
					>
						<div class="mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
							<Users class="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 text-white stroke-[2.6] drop-shadow-lg" />
						</div>
						<span class="text-sm sm:text-lg md:text-xl font-bold tracking-wide text-shadow">Reflection</span>
					</button>

					<!-- 5. Extension Card -->
					<button
						onclick={() => handleCardClick('/extension')}
						onmouseenter={() => sound.playCardHover()}
						class="menu-card-3d bg-[#7e57c2] border-4 border-white text-white p-3 sm:p-4 aspect-square cursor-pointer group"
					>
						<div class="mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
							<Globe class="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 text-white stroke-[2.6] drop-shadow-lg" />
						</div>
						<span class="text-sm sm:text-lg md:text-xl font-bold tracking-wide text-shadow">Extension</span>
					</button>

					<!-- 6. Profil Pengembang Card -->
					<button
						onclick={() => openModal('developer')}
						onmouseenter={() => sound.playCardHover()}
						class="menu-card-3d bg-[#ec407a] border-4 border-white text-white p-2.5 sm:p-3 aspect-square cursor-pointer group"
					>
						<div class="mb-1 sm:mb-1.5 group-hover:scale-110 transition-transform">
							<User class="w-11 h-11 sm:w-15 sm:h-15 md:w-16 md:h-16 text-white stroke-[2.6] drop-shadow-lg" />
						</div>
						<span class="text-xs sm:text-base md:text-lg font-bold tracking-wide text-center leading-snug text-shadow">Profil<br />Pengembang</span>
					</button>

				</div>

				<!-- RIGHT COLUMN: Boy Character Illustration (Symmetrical 3 cols) -->
				<div class="hidden lg:flex lg:col-span-3 flex-col items-center justify-end h-full max-h-full pb-1 sm:pb-2 w-full">
					<div class="transform hover:-rotate-1 transition-transform shrink-0">
						<BoyCharacter className="h-44 sm:h-52 md:h-60 lg:h-68 xl:h-76 w-auto drop-shadow-xl" />
					</div>
				</div>

			</div>
		{/if}
	</div>

	<!-- FOOTER BAR -->
	<footer class="relative z-10 text-center py-1 shrink-0 font-bubble">
		<p class="text-[11px] sm:text-xs font-bold text-slate-500 drop-shadow-xs">
			© 2026 Universitas Negeri Malang — All Rights Reserved
		</p>
	</footer>
</main>

	<!-- CERTIFICATE MODAL & INTEGRATED PROFILE & PROGRESS DASHBOARD MODAL (Student role only) -->
	<CertificateModal
		isOpen={!isTeacherRole && activeModal === 'certificate'}
		onClose={closeModal}
	/>

	<ProfileSettingsModal
		isOpen={!isTeacherRole && (activeModal === 'profile' || activeModal === 'progress')}
		defaultTab={activeModal === 'progress' ? 'progress' : 'profile'}
		onClose={() => {
			refreshProgress();
			closeModal();
		}}
		studentName={progress.studentName}
		studentEmail={userEmail}
		certificateId={userCertId || progress.certificateId}
		completionPercent={completion}
		onUpdateName={(newName) => {
			saveProgress({ studentName: newName });
			progress = getProgress();
		}}
		onLogout={() => {
			resetProgress();
			progress = getProgress();
			userEmail = '';
			userCertId = '';
			isFirstVisit = true;
			activeModal = 'none';
		}}
		onOpenCertificate={() => {
			refreshProgress();
			activeModal = 'certificate';
		}}
		onTriggerSplash={() => {
			closeModal();
			showSplash = true;
		}}
	/>

	<!-- MODALS -->
	{#if activeModal !== 'none' && activeModal !== 'certificate' && activeModal !== 'progress' && activeModal !== 'profile'}
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
				<!-- INFO MODAL -->
				{#if activeModal === 'info'}
					<div class="relative w-full max-w-2xl bg-white rounded-3xl border-4 border-emerald-400 shadow-2xl text-gray-800 font-sans max-h-[90vh] flex flex-col overflow-hidden">
						
						<!-- FIXED TOP HEADER (shrink-0) -->
						<div class="bg-white/95 backdrop-blur-md px-5 pt-4 md:px-7 md:pt-5 pb-3 border-b-2 border-emerald-100 shadow-xs text-center shrink-0 relative z-20">
							<!-- Close X Button -->
							<button
								onclick={closeModal}
								class="absolute top-4 right-4 sm:top-5 sm:right-6 w-9 h-9 rounded-full bg-rose-500 text-white font-bold text-lg flex items-center justify-center hover:bg-rose-600 transition-colors shadow-md z-30 cursor-pointer"
								title="Tutup Modal"
							>
								✕
							</button>

							<div class="w-12 h-12 md:w-14 md:h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-1.5 border-2 border-emerald-400 shadow-sm">
								<svg class="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
									<circle cx="50" cy="50" r="36" stroke="#059669" stroke-width="9" />
									<circle cx="53" cy="33" r="5.5" fill="#059669" />
									<path
										d="M 43,46 C 47,44 54,42 54,50 C 54,58 46,62 48,68 C 49,70 53,70 57,68"
										stroke="#059669"
										stroke-width="8.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
							<h2 class="text-xl md:text-2xl font-extrabold text-emerald-900 font-bubble">Informasi & Panduan Aplikasi</h2>
							<p class="text-[11px] sm:text-xs text-slate-600 font-sans mt-0.5">
								E-Modul Pembelajaran Kebencanaan Longsor — <strong>I-CARE LANDSLIDE</strong>
							</p>

							<!-- Navigation Tabs (Panduan Tombol | Atribusi) -->
							<div class="mt-2.5 flex items-center justify-center space-x-2 font-bubble">
								<button
									type="button"
									onclick={() => { sound.playClick(); infoTab = 'buttons'; }}
									class={`px-3.5 sm:px-5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer border-2 ${
										infoTab === 'buttons'
											? 'bg-emerald-500 text-white border-white shadow-md scale-105'
											: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
									}`}
								>
									🔘 Panduan Tombol
								</button>
								<button
									type="button"
									onclick={() => { sound.playClick(); infoTab = 'attribution'; }}
									class={`px-3.5 sm:px-5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer border-2 ${
										infoTab === 'attribution'
											? 'bg-emerald-500 text-white border-white shadow-md scale-105'
											: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
									}`}
								>
									📜 Atribusi & Sumber
								</button>
							</div>
						</div>

						<!-- SCROLLABLE BODY CONTENT (flex-1 overflow-y-auto) -->
						<div class="flex-1 overflow-y-auto p-4 sm:p-6 text-left font-bubble space-y-4">
							<!-- TAB 1: PANDUAN TOMBOL NAVIGASI -->
							{#if infoTab === 'buttons'}
								<div class="bg-amber-50/70 rounded-2xl p-3.5 sm:p-4 border border-amber-200 font-sans space-y-3 animate-fade-in">
									<h3 class="font-extrabold text-amber-950 text-sm sm:text-base font-bubble flex items-center space-x-2 border-b border-amber-200 pb-2">
										<span>🔘</span>
										<span>Daftar Fungsi Tombol Navigasi Media:</span>
									</h3>

									<div class="grid grid-cols-1 gap-2.5 text-xs sm:text-sm text-slate-800">
										
										<!-- Exit Button -->
										<div class="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-colors">
											<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-500 border-2 border-white shadow-md flex items-center justify-center text-white font-black text-lg shrink-0">
												✕
											</div>
											<div>
												<strong class="text-rose-950 font-bold font-bubble text-sm sm:text-base">Tombol Untuk Keluar</strong>
												<p class="text-slate-600 text-xs">Menutup modal overlay atau mengonfirmasi keluar dari aplikasi pembelajaran.</p>
											</div>
										</div>

										<!-- Music Audio Toggle Button -->
										<div class="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-colors">
											<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-lime-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold shrink-0">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
													<path d="M9 18V5l12-2v13" />
													<circle cx="6" cy="18" r="3" />
													<circle cx="18" cy="16" r="3" />
												</svg>
											</div>
											<div>
												<strong class="text-lime-950 font-bold font-bubble text-sm sm:text-base">Tombol Untuk Mematikan / Mengaktifkan Musik</strong>
												<p class="text-slate-600 text-xs">Mengontrol musik latar (background music) dan efek suara (audio SFX).</p>
											</div>
										</div>

										<!-- Home Menu Button -->
										<div class="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-colors">
											<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold shrink-0">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
													<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
													<polyline points="9 22 9 12 15 12 15 22" />
												</svg>
											</div>
											<div>
												<strong class="text-emerald-950 font-bold font-bubble text-sm sm:text-base">Tombol Untuk Kembali ke Menu Utama</strong>
												<p class="text-slate-600 text-xs">Mengarahkan siswa kembali ke beranda pemilihan 5 room pembelajaran utama.</p>
											</div>
										</div>

										<!-- Refresh / Back Button -->
										<div class="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-colors">
											<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold shrink-0">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
													<polyline points="1 4 1 10 7 10" />
													<path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
												</svg>
											</div>
											<div>
												<strong class="text-amber-950 font-bold font-bubble text-sm sm:text-base">Tombol Untuk Kembali (Reset / Sub-Menu)</strong>
												<p class="text-slate-600 text-xs">Kembali dari tampilan sub-modul application ke dashboard pemilihan modul.</p>
											</div>
										</div>

										<!-- Previous Slide Arrow Button -->
										<div class="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-colors">
											<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-sky-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold shrink-0">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
													<path d="M15 19l-7-7 7-7" />
												</svg>
											</div>
											<div>
												<strong class="text-sky-950 font-bold font-bubble text-sm sm:text-base">Tombol Untuk Mengganti Slide Sebelumnya</strong>
												<p class="text-slate-600 text-xs">Perpindahan ke slide halaman materi sebelum ini di dalam lembar papan tulis.</p>
											</div>
										</div>

										<!-- Next Slide Arrow Button -->
										<div class="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-colors">
											<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-sky-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold shrink-0">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
													<path d="M9 5l7 7-7 7" />
												</svg>
											</div>
											<div>
												<strong class="text-sky-950 font-bold font-bubble text-sm sm:text-base">Tombol Untuk Mengganti Slide Berikutnya</strong>
												<p class="text-slate-600 text-xs">Perpindahan ke slide halaman materi berikutnya di dalam lembar papan tulis.</p>
											</div>
										</div>

										<!-- Save Floppy Button -->
										<div class="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-colors">
											<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold shrink-0">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
													<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
													<polyline points="17 21 17 13 7 13 7 21" />
													<polyline points="7 3 7 8 15 8" />
												</svg>
											</div>
											<div>
												<strong class="text-emerald-950 font-bold font-bubble text-sm sm:text-base">Tombol Untuk Menyimpan Hasil Quiz & Esai</strong>
												<p class="text-slate-600 text-xs">Menyimpan skor evaluasi kuis dan jawaban esai refleksi ke dalam penyimpanan perangkat.</p>
											</div>
										</div>

										<!-- Zoom Image Button -->
										<div class="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-colors">
											<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-teal-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold shrink-0">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
													<circle cx="11" cy="11" r="8" />
													<line x1="21" y1="21" x2="16.65" y2="16.65" />
													<line x1="11" y1="8" x2="11" y2="14" />
													<line x1="8" y1="11" x2="14" y2="11" />
												</svg>
											</div>
											<div>
												<strong class="text-teal-950 font-bold font-bubble text-sm sm:text-base">Tombol Perbesar Gambar / Peta (🔍)</strong>
												<p class="text-slate-600 text-xs">Membuka gambar peta topografi dan infografis 3D dalam tampilan layar penuh (full-screen modal).</p>
											</div>
										</div>

										<!-- Progress & Certificate Button -->
										<div class="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-colors">
											<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold shrink-0">
												🏆
											</div>
											<div>
												<strong class="text-amber-950 font-bold font-bubble text-sm sm:text-base">Tombol Progres Belajar & Sertifikat (🏆 / 🎓)</strong>
												<p class="text-slate-600 text-xs">Memantau grafik kelulusan modul dan mengunduh sertifikat resmi setelah lulus evaluasi.</p>
											</div>
										</div>

										<!-- Student Account Profile Button -->
										<div class="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-colors">
											<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold shrink-0">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
													<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
													<circle cx="12" cy="7" r="4" />
												</svg>
											</div>
											<div>
												<strong class="text-indigo-950 font-bold font-bubble text-sm sm:text-base">Tombol Pengaturan Akun & Profil Siswa (👤)</strong>
												<p class="text-slate-600 text-xs">Melihat identitas siswa, status progres pengerjaan modul, serta opsi reset akun.</p>
											</div>
										</div>

										<!-- Teacher Dashboard Button -->
										<div class="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-colors">
											<div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold shrink-0">
												🎓
											</div>
											<div>
												<strong class="text-amber-950 font-bold font-bubble text-sm sm:text-base">Tombol Dashboard Guru & Nilai Siswa (🎓)</strong>
												<p class="text-slate-600 text-xs">Melihat rekap data hasil kuis dan jawaban esai seluruh siswa (khusus mode akses guru).</p>
											</div>
										</div>

									</div>
								</div>

							<!-- TAB 2: ATRIBUSI & SUMBER (ATTRIBUTION) -->
							{:else if infoTab === 'attribution'}
								<div class="bg-sky-50/80 rounded-2xl p-4 border border-sky-200 font-sans space-y-3.5 animate-fade-in text-xs sm:text-sm text-slate-800">
									<h3 class="font-extrabold text-sky-950 text-sm sm:text-base font-bubble border-b border-sky-200 pb-1.5 flex items-center space-x-2">
										<span>📜</span>
										<span>Apresiasi & Atribusi Sumber Daya (Credits):</span>
									</h3>

									<!-- Geospatial Map Credits -->
									<div class="bg-white p-3.5 rounded-xl border border-sky-200 shadow-2xs space-y-1.5">
										<strong class="text-sky-900 font-bold block font-bubble text-xs sm:text-sm">🗺️ Data Geospasial & Pemetaan Peta:</strong>
										<ul class="list-disc list-outside ml-4 sm:ml-5 text-xs text-slate-700 space-y-1 font-medium pl-1">
											<li><strong>DEMNAS (Digital Elevation Model Nasional):</strong> Data Digital Elevation Model Elevasi & Ketinggian Topografi.</li>
											<li><strong>Batimetri Nasional (BATNAS):</strong> Pemetaan Batimetri & Morfologi Kedalaman Laut.</li>
											<li><strong>Peta Rupa Bumi Indonesia (RBI) Kab. Malang:</strong> Peta Topografi RBI Badan Informasi Geospasial (BIG).</li>
											<li><strong>Data Curah Hujan CHIRPS (2013–2023):</strong> Data Presipitasi Curah Hujan 10 Tahun (Climate Hazards Group).</li>
											<li><strong>Peta Geologi ESDM:</strong> Formasi & Struktur Geologi Batuan Kementerian ESDM.</li>
											<li><strong>Peta Penggunaan Lahan RBI:</strong> Klasifikasi Tutupan & Penggunaan Lahan Kecamatan Jabung.</li>
											<li><strong>Jenis Tanah (Soil Type FAO):</strong> Klasifikasi Jenis Tanah Food and Agriculture Organization (FAO).</li>
										</ul>
									</div>

									<!-- Audio & Video Credits -->
									<div class="bg-white p-3 rounded-xl border border-sky-200 shadow-2xs space-y-1">
										<strong class="text-sky-900 font-bold block font-bubble">🎬 Dokumentasi Video & Suara:</strong>
										<ul class="list-disc list-outside ml-4 sm:ml-5 text-xs text-slate-700 space-y-1 font-medium pl-1">
											<li>Liputan Berita Longsor Jabung — <em>KompasTV Malang</em> (YouTube Attribution).</li>
											<li>Dokumentasi Lapangan Bencana Longsor — <em>Dokumentasi Mandiri Pengembang (2024)</em>.</li>
											<li>Efek Suara (Audio SFX & BGM) — <em>Freesound.org (Creative Commons Non-Commercial License)</em>.</li>
										</ul>
									</div>

									<!-- UI Assets Credits -->
									<div class="bg-[#f0fdf4] p-3 rounded-xl border border-emerald-200 shadow-2xs space-y-1">
										<strong class="text-emerald-900 font-bold block font-bubble">🎨 Aset Visual & Teknologi Web:</strong>
										<ul class="list-disc list-outside ml-4 sm:ml-5 text-xs text-slate-700 space-y-1 font-medium pl-1">
											<li>Ikon Vector & Simbol — <em>Lucide Icons & Open-source Vector Pack</em>.</li>
											<li>Typography — <em>Google Fonts (Outfit & Bubblegum Sans)</em>.</li>
											<li>Framework Web App — <em>SvelteKit 2 & Vite Bundler (Universitas Negeri Malang)</em>.</li>
										</ul>
									</div>

									<p class="text-xs text-slate-500 italic text-center pt-1">
										Seluruh materi dan aset digunakan khusus untuk kepentingan Pendidikan & Riset Akademis Non-Komersial.
									</p>
								</div>
							{/if}

							<!-- Close Button -->
							<div class="text-center pt-2">
								<button
									onclick={closeModal}
									class="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg border-2 border-white transform active:scale-95 transition-all cursor-pointer font-bubble"
									style="box-shadow: 0 4px 0 0 #047857;"
								>
									Paham, Terima Kasih!
								</button>
							</div>
						</div>
					</div>
				{/if}



				<!-- PROFIL PENGEMBANG MODAL -->
				{#if activeModal === 'developer'}
					<div class="relative w-full max-w-2xl bg-white rounded-3xl border-4 border-pink-400 shadow-2xl text-gray-800 font-sans max-h-[90vh] flex flex-col overflow-hidden">
						<!-- FIXED TOP HEADER -->
						<div class="bg-white/95 backdrop-blur-md px-5 pt-4 md:px-7 md:pt-5 pb-3 border-b-2 border-pink-100 shadow-xs text-center shrink-0 relative z-20 font-bubble">
							<!-- Close X Button -->
							<button
								onclick={closeModal}
								class="absolute top-4 right-4 sm:top-5 sm:right-6 w-9 h-9 rounded-full bg-rose-500 text-white font-bold text-lg flex items-center justify-center hover:bg-rose-600 transition-colors shadow-md z-30 cursor-pointer"
								title="Tutup Profil"
							>
								✕
							</button>

							<div class="w-12 h-12 md:w-14 md:h-14 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-1.5 border-2 border-pink-400 shadow-sm">
								<User size={30} strokeWidth={2.4} />
							</div>
							<h2 class="text-xl md:text-2xl font-extrabold text-pink-700">Profil Pengembang</h2>
							<p class="text-xs font-semibold text-pink-500 uppercase tracking-wider mt-0.5">Universitas Negeri Malang</p>
						</div>

						<!-- SCROLLABLE BODY CONTENT -->
						<div class="flex-1 overflow-y-auto p-4 sm:p-6 text-left font-sans space-y-4">
							<!-- Biodata Grid Card -->
							<div class="bg-pink-50/80 rounded-2xl p-4 sm:p-5 border border-pink-200 text-xs sm:text-sm space-y-2">
								<div class="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1 border-b border-pink-200/60">
									<span class="font-bold text-pink-900">Nama</span>
									<span class="sm:col-span-2 font-semibold text-gray-900">: Faridh Arganatha Dwiangkara</span>
								</div>
								<div class="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1 border-b border-pink-200/60">
									<span class="font-bold text-pink-900">NIM</span>
									<span class="sm:col-span-2 font-semibold text-gray-900">: 210721611732</span>
								</div>
								<div class="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1 border-b border-pink-200/60">
									<span class="font-bold text-pink-900">Email</span>
									<span class="sm:col-span-2 font-semibold text-blue-800 break-all">: faridh.arghanatha.2107216@students.um.ac.id</span>
								</div>
								<div class="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1 border-b border-pink-200/60">
									<span class="font-bold text-pink-900">Program Studi</span>
									<span class="sm:col-span-2 font-semibold text-gray-900">: Pendidikan Geografi</span>
								</div>
								<div class="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1">
									<span class="font-bold text-pink-900">Asal Instansi</span>
									<span class="sm:col-span-2 font-semibold text-gray-900">: Universitas Negeri Malang</span>
								</div>
							</div>

							<!-- Riwayat Pendidikan Section -->
							<div class="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 text-xs sm:text-sm font-bubble">
								<h3 class="font-bold text-amber-900 text-sm sm:text-base mb-2 flex items-center">
									🎓 Riwayat Pendidikan :
								</h3>
								<ol class="list-decimal list-inside space-y-1 font-semibold text-gray-800 pl-2">
									<li>SDN Wonosalam 1</li>
									<li>MTsN 1 Pare (MTsN Model Pare)</li>
									<li>MAN 3 Jombang</li>
								</ol>
							</div>

							<!-- Keterangan & Skripsi Section -->
							<div class="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 text-xs sm:text-sm space-y-3 font-sans">
								<p class="text-gray-700 leading-relaxed font-medium">
									Saat ini pengembang sedang menyelesaikan pendidikan di program S1 Pendidikan Geografi Fakultas Ilmu Sosial Universitas Negeri Malang. Bahan Ajar E-Modul ini dikembangkan oleh penulis dalam rangka menyelesaikan skripsi yang berjudul:
								</p>
								<div class="bg-white rounded-xl p-3.5 border-2 border-emerald-300 shadow-sm text-center">
									<p class="font-extrabold text-emerald-900 italic leading-relaxed text-xs sm:text-sm font-bubble">
										“Pengembangan E-Modul I-Care Landslide Learning Pada Materi Kebencanaan Longsor Di Kecamatan Jabung Pada Mata Pelajaran Geografi kelas XI”
									</p>
								</div>
							</div>

							<!-- Bottom Close Button -->
							<div class="text-center pt-2">
								<button
									onclick={closeModal}
									class="px-8 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-extrabold rounded-2xl shadow-lg border-2 border-white transform active:scale-95 transition-all font-bubble cursor-pointer"
								>
									Tutup Profil
								</button>
							</div>
						</div>
					</div>
				{/if}

				<!-- EXIT MODAL -->
				{#if activeModal === 'exit'}
					<div class="relative w-full max-w-md bg-white rounded-3xl border-4 border-rose-400 p-6 shadow-2xl text-center font-bubble">
						<div class="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-rose-400 shadow-sm">
							<svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</div>
						<h2 class="text-2xl font-extrabold text-rose-700 mb-2">Konfirmasi Keluar</h2>
						<p class="text-sm text-gray-600 mb-6 font-sans">Apakah Anda yakin ingin keluar dari media pembelajaran ini?</p>
						<div class="flex justify-center space-x-4">
							<button
								onclick={closeModal}
								class="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl cursor-pointer"
							>
								Batal
							</button>
							<button
								onclick={() => alert('Terima kasih telah belajar bersama I-CARE LANDSLIDE!')}
								class="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
							>
								Ya, Keluar
							</button>
						</div>
					</div>
				{/if}

		</div>
	{/if}

	<!-- TEACHER LEADERBOARD DASHBOARD MODAL -->
	<TeacherLeaderboardModal
		isOpen={isTeacherModalOpen}
		onClose={() => (isTeacherModalOpen = false)}
	/>
{/if}
