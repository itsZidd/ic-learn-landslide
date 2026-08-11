<script lang="ts">
	import { sound } from '$lib/utils/audio';
	import UMLogo from '$lib/components/UMLogo.svelte';
	import boyCharacterLogin from '$lib/assets/BoyCharacterLogin.webp';
	import girlCharacterLogin from '$lib/assets/GirlCharacterLogin.webp';
	import titleLogin from '$lib/assets/TitleLogin.webp';
	import backgroundLogin from '$lib/assets/BackgroundLogin.webp';
	import cloudPng from '$lib/assets/Cloud.webp';
	import windSvg from '$lib/assets/Wind.svg';
	import { authClient } from '$lib/auth-client';
	import { applyServerProgress } from '$lib/utils/progress';
	import { User, Sparkles, ArrowRight, Mail, Lock, LogIn, UserPlus, AlertTriangle, Eye, EyeOff, GraduationCap, ShieldCheck, KeyRound } from '@lucide/svelte';

	interface Props {
		initialName?: string;
		onLogin: (name: string, email?: string, certId?: string, role?: 'student' | 'teacher', studentClass?: string) => void;
		isEditMode?: boolean;
		onClose?: () => void;
	}

	let { initialName = '', onLogin, isEditMode = false, onClose }: Props = $props();

	let userRole = $state<'student' | 'teacher'>('student');
	let authMode = $state<'login' | 'signup'>('login');
	
	let email = $state('');
	let password = $state('');
	let teacherCode = $state('');
	let studentNameInput = $state('');
	let studentClassInput = $state('XI-GEO-1');
	let showPassword = $state(false);
	
	let errorMessage = $state('');
	let isSubmitting = $state(false);

	$effect(() => {
		if (isEditMode && initialName && initialName !== 'Siswa') {
			studentNameInput = initialName;
		}
	});

	function selectRole(role: 'student' | 'teacher') {
		try { sound.playClick(); } catch {}
		userRole = role;
		errorMessage = '';
		email = '';
		password = '';
		teacherCode = '';
		studentNameInput = '';
	}

	function translateAuthError(msg?: string): string {
		if (!msg) return 'Gagal memproses pendaftaran / masuk akun.';
		const lower = msg.toLowerCase();
		if (lower.includes('invalid email or password') || lower.includes('invalid password') || lower.includes('invalid email')) {
			return 'Email atau password belum terdaftar / salah.';
		}
		if (lower.includes('user already exists') || lower.includes('email already in use') || lower.includes('already exists')) {
			return 'Email ini sudah terdaftar. Silakan pilih menu MASUK.';
		}
		if (lower.includes('password') && (lower.includes('short') || lower.includes('length') || lower.includes('6'))) {
			return 'Password minimal harus 6 karakter.';
		}
		return msg;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';
		
		try { sound.playClick(); } catch {}

		// Configurable Teacher Authentication via Server API (/api/teacher-auth)
		if (userRole === 'teacher') {
			const codeTrimmed = teacherCode.trim();
			if (!codeTrimmed) {
				errorMessage = 'Harap masukkan Kode Identitas Guru!';
				return;
			}
			if (!password) {
				errorMessage = 'Harap masukkan Password Guru!';
				return;
			}

			isSubmitting = true;
			try {
				const res = await fetch('/api/teacher-auth', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ code: codeTrimmed, password })
				});
				const data = await res.json();

				if (!res.ok || data.status === 'error') {
					errorMessage = data.message || 'Kode Identitas atau Password Guru salah!';
					isSubmitting = false;
					return;
				}

				onLogin(data.teacherName || 'Bapak/Ibu Guru Pengajar', data.teacherEmail || 'guru@icare.com', undefined, 'teacher');
			} catch (err: any) {
				errorMessage = 'Gagal memverifikasi akun guru.';
			} finally {
				isSubmitting = false;
			}
			return;
		}

		const emailTrimmed = email.trim();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (authMode === 'signup') {
			const nameTrimmed = studentNameInput.trim();
			if (!nameTrimmed) {
				errorMessage = 'Harap masukkan nama lengkap siswa!';
				return;
			}
			if (!emailTrimmed) {
				errorMessage = 'Harap masukkan alamat email siswa!';
				return;
			}
			if (!emailRegex.test(emailTrimmed)) {
				errorMessage = 'Format email belum sesuai (contoh: nama@email.com)';
				return;
			}
			if (!password) {
				errorMessage = 'Harap masukkan password!';
				return;
			}
			if (password.length < 6) {
				errorMessage = 'Password minimal harus 6 karakter!';
				return;
			}

			isSubmitting = true;

			try {
				const res = await authClient.signUp.email({
					email: emailTrimmed,
					password,
					name: nameTrimmed
				});

				if (res.error) {
					errorMessage = translateAuthError(res.error.message);
					isSubmitting = false;
					return;
				}

				try {
					const progRes = await fetch('/api/progress');
					const progData = await progRes.json();
					if (progData.progress) applyServerProgress(progData.progress, nameTrimmed);
					onLogin(nameTrimmed, emailTrimmed, progData.progress?.certificateId, undefined, progData.progress?.studentClass);
				} catch {
					onLogin(nameTrimmed, emailTrimmed);
				}
			} catch (err: any) {
				errorMessage = translateAuthError(err.message);
			} finally {
				isSubmitting = false;
			}
		} else {
			// LOGIN STUDENT
			if (!emailTrimmed) {
				errorMessage = 'Harap masukkan alamat email siswa!';
				return;
			}
			if (!emailRegex.test(emailTrimmed)) {
				errorMessage = 'Format email belum sesuai (contoh: nama@email.com)';
				return;
			}
			if (!password) {
				errorMessage = 'Harap masukkan password!';
				return;
			}
			if (password.length < 6) {
				errorMessage = 'Password minimal harus 6 karakter!';
				return;
			}

			isSubmitting = true;

			try {
				const res = await authClient.signIn.email({
					email: emailTrimmed,
					password
				});

				if (res.error) {
					errorMessage = translateAuthError(res.error.message);
					isSubmitting = false;
					return;
				}

				const fetchedName = res.data?.user?.name || emailTrimmed.split('@')[0];
				try {
					const progRes = await fetch('/api/progress');
					const progData = await progRes.json();
					if (progData.progress) applyServerProgress(progData.progress, fetchedName);
					onLogin(fetchedName, emailTrimmed, progData.progress?.certificateId, undefined, progData.progress?.studentClass);
				} catch {
					onLogin(fetchedName, emailTrimmed);
				}
			} catch (err: any) {
				errorMessage = translateAuthError(err.message);
			} finally {
				isSubmitting = false;
			}
		}
	}
</script>

<div class="fixed inset-0 z-50 w-full h-full min-h-screen lg:h-screen lg:h-dvh overflow-y-auto lg:overflow-hidden flex flex-col justify-between p-2 sm:p-4 select-none font-bubble bg-sky-900 animate-fade-in relative">
	
	<!-- Background Login Image with Instant High Priority Loading & Solid Fallback -->
	<div class="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-sky-900">
		<img
			src={backgroundLogin}
			alt="Background Scenery Login"
			fetchpriority="high"
			decoding="sync"
			class="w-full h-full object-cover object-center transform-gpu"
		/>
		<div class="absolute inset-0 bg-sky-950/20"></div>
	</div>

	<!-- Hardware Accelerated Animated Wind Overlay -->
	<div class="animate-wind-sweep absolute inset-0 w-full h-full transform-gpu z-0 pointer-events-none">
		<img
			src={windSvg}
			alt="Wind and Leaf Animation"
			decoding="async"
			class="w-full h-full object-cover object-center opacity-85"
		/>
	</div>

	<!-- Animated Floating Cloud Assets -->
	<div class="absolute top-4 left-6 sm:left-16 opacity-85 animate-drift-slow pointer-events-none z-0">
		<img src={cloudPng} alt="Awan 1" class="w-36 sm:w-52 md:w-64 h-auto drop-shadow-md" />
	</div>
	<div class="absolute top-10 right-6 sm:right-20 opacity-75 animate-drift-reverse pointer-events-none z-0">
		<img src={cloudPng} alt="Awan 2" class="w-40 sm:w-60 md:w-72 h-auto drop-shadow-md" />
	</div>

	<!-- TOP HEADER BAR -->
	<header class="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between shrink-0">
		<!-- Top Left: Universitas Negeri Malang Logo -->
		<div class="flex items-center justify-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border-2 border-white/90 shadow-lg">
			<UMLogo className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-md shrink-0" />
			<div class="hidden sm:flex flex-col ml-3 text-left font-bubble">
				<span class="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wide drop-shadow-xs leading-none">UNIVERSITAS NEGERI</span>
				<span class="text-xs sm:text-sm font-black text-amber-500 uppercase tracking-wider drop-shadow-xs leading-none">MALANG</span>
			</div>
		</div>

		{#if isEditMode && onClose}
			<button
				type="button"
				onclick={onClose}
				class="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md border-2 border-white cursor-pointer transition-transform active:scale-95"
			>
				✕ Kembali ke Menu
			</button>
		{/if}
	</header>

	<!-- MAIN LOGIN CONTENT GRID -->
	<div class="relative z-10 w-full max-w-6xl mx-auto my-auto py-1 sm:py-2 flex flex-col items-center justify-center">
		
		<!-- APP TITLE BANNER -->
		<div class="w-full flex flex-col items-center justify-center text-center mb-1 sm:mb-2">
			<div class="animate-title-float transform-gpu">
				<img
					src={titleLogin}
					alt="I-CARE LANDSLIDE Title"
					class="h-32 sm:h-36 md:h-44 lg:h-48 xl:h-52 w-auto max-w-[88vw] sm:max-w-full object-contain mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
				/>
			</div>
			<div class="inline-block mt-1 sm:mt-2 px-4 sm:px-5 py-1 sm:py-1.5 bg-amber-400/95 backdrop-blur-md border-2 border-white shadow-md rounded-full text-amber-950 text-xs sm:text-sm font-extrabold tracking-wide uppercase">
				🗺️ E-Modul Geografi Kebencanaan Longsor Kec. Jabung
			</div>
		</div>

		<!-- CENTER INTERACTIVE ROW -->
		<div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-5 items-center">
			
			<!-- LEFT COLUMN: Boy Character -->
			<div class="hidden lg:flex lg:col-span-3 flex-col items-center justify-center space-y-2">
				<div class="relative bg-white/95 backdrop-blur-md p-3 rounded-2xl border-2 border-amber-300 shadow-xl text-center text-xs font-bold text-slate-800 leading-relaxed max-w-[190px] animate-bounce-short">
					<span>Halo! Pilih login sebagai Siswa atau Guru ya! 🌲</span>
					<div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-10 border-t-white"></div>
				</div>
				<div class="transform hover:scale-105 transition-transform animate-character-float">
					<img
						src={boyCharacterLogin}
						alt="Karakter Laki-Laki Login"
						class="h-44 xl:h-56 w-auto drop-shadow-2xl object-contain"
					/>
				</div>
			</div>

			<!-- CENTER COLUMN: GAMIFIED 3D LOGIN CARD -->
			<div class="lg:col-span-6 w-full max-w-sm sm:max-w-md mx-auto">
				<div class="relative bg-white/95 backdrop-blur-md rounded-3xl border-4 border-amber-400 p-3.5 sm:p-5 shadow-2xl text-center font-sans mt-6" style="box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);">
					
					<!-- Top Avatar Icon Badge (Positioned absolute -top-7, unclipped by overflow) -->
					<div class="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-sky-400 to-sky-600 border-4 border-white shadow-xl flex items-center justify-center text-white z-20">
						{#if userRole === 'teacher'}
							<GraduationCap class="w-8 h-8 text-amber-200 stroke-[2.5]" />
						{:else}
							<User class="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.5]" />
						{/if}
						<div class="absolute -top-1 -right-1 bg-amber-400 text-amber-950 rounded-full p-1 border-2 border-white shadow-sm">
							<Sparkles class="w-3.5 h-3.5 fill-current" />
						</div>
					</div>

					<!-- Inner Scrollable Form Container -->
					<div class="max-h-[68vh] sm:max-h-[75vh] overflow-y-auto custom-scrollbar pt-3 px-0.5">

						<!-- ROLE SELECTOR TAB (Siswa vs Guru) -->
						<div class="mb-2 font-bubble">
							<div class="flex bg-slate-200/80 p-1 rounded-2xl mb-2.5 border border-slate-300">
								<button
									type="button"
									onclick={() => selectRole('student')}
									class={`flex-1 py-1.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all ${
										userRole === 'student'
											? 'bg-amber-400 text-amber-950 shadow-md border-2 border-white'
											: 'text-slate-700 hover:text-slate-900'
									}`}
								>
									<User class="w-4 h-4" />
									<span>AKUN SISWA</span>
								</button>
								<button
									type="button"
									onclick={() => selectRole('teacher')}
									class={`flex-1 py-1.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all ${
										userRole === 'teacher'
											? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md border-2 border-white'
											: 'text-slate-700 hover:text-slate-900'
									}`}
								>
									<GraduationCap class="w-4 h-4" />
									<span>AKUN GURU</span>
								</button>
							</div>

							<!-- Student Sub-Tabs (Masuk / Daftar) -->
							{#if userRole === 'student'}
								<div class="flex bg-slate-100 p-1 rounded-2xl mb-2 border border-slate-200">
									<button
										type="button"
										onclick={() => { authMode = 'login'; errorMessage = ''; email = ''; password = ''; }}
										class={`flex-1 py-1 px-2 rounded-xl font-black text-xs flex items-center justify-center space-x-1 transition-all ${
											authMode === 'login'
												? 'bg-sky-500 text-white shadow-sm border border-white'
												: 'text-slate-600 hover:text-slate-900'
										}`}
									>
										<LogIn class="w-3.5 h-3.5" />
										<span>MASUK</span>
									</button>
									<button
										type="button"
										onclick={() => { authMode = 'signup'; errorMessage = ''; email = ''; password = ''; studentNameInput = ''; }}
										class={`flex-1 py-1 px-2 rounded-xl font-black text-xs flex items-center justify-center space-x-1 transition-all ${
											authMode === 'signup'
												? 'bg-sky-500 text-white shadow-sm border border-white'
												: 'text-slate-600 hover:text-slate-900'
										}`}
									>
										<UserPlus class="w-3.5 h-3.5" />
										<span>DAFTAR BARU</span>
									</button>
								</div>

								<h2 class="text-base sm:text-lg font-black text-amber-500 tracking-wide">
									{authMode === 'signup' ? 'Daftar Akun Siswa Baru' : 'Masuk Akun Siswa'}
								</h2>
								<p class="text-[11px] font-bold text-slate-500 font-sans">
									{authMode === 'signup' ? 'Buat akun siswa untuk menyimpan progres & sertifikat' : 'Masuk dengan email & password terdaftar'}
								</p>
							{:else}
								<div class="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-left font-sans mb-1">
									<div class="flex items-center space-x-1.5 text-amber-900 font-black text-xs">
										<ShieldCheck class="w-4 h-4 text-amber-600 shrink-0" />
										<span>Portal Guru / Pengajar</span>
									</div>
									<p class="text-[11px] font-bold text-amber-800 leading-tight mt-0.5">
										Masukkan Kode Identitas & Password Guru untuk mengakses rekap nilai kuis & esai siswa.
									</p>
								</div>
							{/if}
						</div>

						<!-- Form Fields -->
						<form novalidate onsubmit={handleSubmit} class="space-y-2.5 font-sans text-left">
							{#if userRole === 'teacher'}
								<!-- TEACHER CODE IDENTITY FIELD -->
								<div>
									<label for="teacherCodeInput" class="block text-[11px] font-bold text-slate-700 mb-0.5">KODE IDENTITAS GURU</label>
									<div class="relative">
										<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600">
											<KeyRound class="w-4 h-4" />
										</div>
										<input
											id="teacherCodeInput"
											type="text"
											bind:value={teacherCode}
											placeholder="Masukkan Kode Guru Anda..."
											class="w-full pl-9 pr-3 py-2 bg-amber-50/70 border-2 border-amber-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-100 rounded-xl text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider outline-none"
										/>
									</div>
								</div>
							{:else}
								{#if authMode === 'signup'}
									<div>
										<label for="studentNameInput" class="block text-[11px] font-bold text-slate-700 mb-0.5">NAMA LENGKAP SISWA</label>
										<div class="relative">
											<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sky-600">
												<User class="w-4 h-4" />
											</div>
											<input
												id="studentNameInput"
												type="text"
												bind:value={studentNameInput}
												placeholder="Masukkan nama lengkap Anda..."
												class="w-full pl-9 pr-3 py-2 bg-slate-50 border-2 border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-xl text-xs sm:text-sm font-bold text-slate-800 outline-none"
											/>
										</div>
									</div>

									<div>
										<label for="studentClassInput" class="block text-[11px] font-bold text-slate-700 mb-0.5">KELAS / ROMBEL</label>
										<div class="relative">
											<input
												id="studentClassInput"
												type="text"
												bind:value={studentClassInput}
												placeholder="Ketik nama kelas Anda (contoh: XI GEO 1, XII IPS 2...)"
												class="w-full px-3 py-2 bg-slate-50 border-2 border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-xl text-xs sm:text-sm font-bold text-slate-800 outline-none"
											/>
										</div>
									</div>
								{/if}

								<div>
									<label for="studentEmailInput" class="block text-[11px] font-bold text-slate-700 mb-0.5">EMAIL SISWA</label>
									<div class="relative">
										<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sky-600">
											<Mail class="w-4 h-4" />
										</div>
										<input
											id="studentEmailInput"
											type="email"
											bind:value={email}
											placeholder="email@siswa.com"
											class="w-full pl-9 pr-3 py-2 bg-slate-50 border-2 border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-xl text-xs sm:text-sm font-bold text-slate-800 outline-none"
										/>
									</div>
								</div>
							{/if}

							<div>
								<label for="studentPasswordInput" class="block text-[11px] font-bold text-slate-700 mb-0.5">
									{userRole === 'teacher' ? 'PASSWORD GURU' : 'PASSWORD'}
								</label>
								<div class="relative">
									<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sky-600">
										<Lock class="w-4 h-4" />
									</div>
									<input
										id="studentPasswordInput"
										type={showPassword ? 'text' : 'password'}
										bind:value={password}
										placeholder="••••••••"
										class="w-full pl-9 pr-10 py-2 bg-slate-50 border-2 border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 rounded-xl text-xs sm:text-sm font-bold text-slate-800 outline-none"
									/>
									<button
										type="button"
										onclick={() => (showPassword = !showPassword)}
										class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
										title={showPassword ? 'Sembunyikan Password' : 'Lihat Password'}
									>
										{#if showPassword}
											<EyeOff class="w-4 h-4" />
										{:else}
											<Eye class="w-4 h-4" />
										{/if}
									</button>
								</div>
							</div>

							<!-- Custom Gamified Validation Warning Badge -->
							<div class="min-h-[24px] my-1">
								{#if errorMessage}
									<div class="p-2 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-800 text-[11px] font-bold flex items-center space-x-2 shadow-xs animate-fade-in">
										<AlertTriangle class="w-4 h-4 text-rose-600 shrink-0" />
										<span class="leading-tight">{errorMessage}</span>
									</div>
								{:else if userRole === 'student'}
									<p class="text-[10px] font-semibold text-amber-700 font-sans text-center pt-0.5">
										*) Sertifikat unik akan diterbitkan untuk akun ini
									</p>
								{/if}
							</div>

							<!-- Submit Button -->
							<button
								type="submit"
								disabled={isSubmitting}
								class={`group relative w-full py-3 px-5 border-2 border-white rounded-2xl text-white font-extrabold text-sm sm:text-base tracking-wide uppercase transform active:scale-95 transition-all hover:scale-[1.01] flex items-center justify-center space-x-2 cursor-pointer font-bubble disabled:opacity-50 shadow-md ${
									userRole === 'teacher'
										? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 border-b-4 border-b-amber-800'
										: 'bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 border-b-4 border-b-indigo-800'
								}`}
							>
								<span>
									{isSubmitting
										? 'MEMPROSES...'
										: userRole === 'teacher'
											? 'MASUK SEBAGAI GURU / PENGAJAR'
											: authMode === 'signup'
												? 'DAFTAR SEKARANG'
												: 'MASUK KE E-MODUL'}
								</span>
								<ArrowRight class="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
							</button>
						</form>

					</div>
				</div>
			</div>

			<!-- RIGHT COLUMN: Girl Character -->
			<div class="hidden lg:flex lg:col-span-3 flex-col items-center justify-center space-y-2">
				<div class="relative bg-white/95 backdrop-blur-md p-3 rounded-2xl border-2 border-emerald-300 shadow-xl text-center text-xs font-bold text-slate-800 leading-relaxed max-w-[190px] animate-bounce-short">
					<span>Masuk sesuai peranmu sebagai Siswa atau Guru! 🎒</span>
					<div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-10 border-t-white"></div>
				</div>
				<div class="transform hover:scale-105 transition-transform animate-character-bob">
					<img
						src={girlCharacterLogin}
						alt="Karakter Perempuan Login"
						class="h-44 xl:h-56 w-auto drop-shadow-2xl object-contain"
					/>
				</div>
			</div>

		</div>
	</div>

	<!-- FOOTER attribution -->
	<footer class="relative z-10 text-center py-1 shrink-0 font-bubble">
		<p class="text-[11px] sm:text-xs font-bold text-slate-500 drop-shadow-xs">
			© 2026 Universitas Negeri Malang — All Rights Reserved
		</p>
	</footer>
</div>

<style>
	@keyframes titleFloat {
		0%, 100% {
			transform: translate3d(0, 0px, 0) scale(1);
		}
		50% {
			transform: translate3d(0, -10px, 0) scale(1.02);
		}
	}

	@keyframes characterFloat {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-6px) rotate(1deg); }
	}

	@keyframes characterBob {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-7px) rotate(-1deg); }
	}

	@keyframes driftSlow {
		0% { transform: translateX(0); }
		50% { transform: translateX(30px); }
		100% { transform: translateX(0); }
	}

	@keyframes driftReverse {
		0% { transform: translateX(0); }
		50% { transform: translateX(-30px); }
		100% { transform: translateX(0); }
	}

	@keyframes windSweep {
		0% {
			transform: translate3d(-120%, -30px, 0);
			opacity: 0;
		}
		10% {
			opacity: 0.85;
		}
		55% {
			opacity: 0.85;
		}
		70% {
			transform: translate3d(120%, 30px, 0);
			opacity: 0;
		}
		100% {
			transform: translate3d(120%, 30px, 0);
			opacity: 0;
		}
	}

	.animate-title-float {
		will-change: transform;
		animation: titleFloat 3.2s ease-in-out infinite;
	}

	.animate-character-float {
		animation: characterFloat 3.2s infinite ease-in-out;
	}

	.animate-character-bob {
		animation: characterBob 3.6s infinite ease-in-out;
	}

	.animate-drift-slow {
		animation: driftSlow 14s infinite ease-in-out;
	}

	.animate-drift-reverse {
		animation: driftReverse 16s infinite ease-in-out;
	}

	.animate-wind-sweep {
		will-change: transform, opacity;
		animation: windSweep 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		backface-visibility: hidden;
	}
</style>
