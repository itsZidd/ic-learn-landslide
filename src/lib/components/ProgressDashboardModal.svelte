<script lang="ts">
	import { sound } from '$lib/utils/audio';
	import { getProgress, calculateCompletion, resetProgress, completeAllProgress } from '$lib/utils/progress';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		onOpenCertificate: () => void;
		onProgressUpdate?: () => void;
		onTriggerSplash?: () => void;
	}

	let { isOpen, onClose, onOpenCertificate, onProgressUpdate, onTriggerSplash }: Props = $props();

	let progress = $state(getProgress());
	let completionPercentage = $derived(calculateCompletion(progress));

	$effect(() => {
		if (isOpen) {
			progress = getProgress();

			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					handleClose();
				}
			};

			window.addEventListener('keydown', handleKeyDown);
			return () => {
				window.removeEventListener('keydown', handleKeyDown);
			};
		}
	});

	function isRoomCompleted(roomId: string): boolean {
		if (roomId === 'intro') return progress.introCompleted;
		if (roomId === 'connection') return progress.connectionCompleted;
		if (roomId === 'application') return progress.applicationCompleted;
		if (roomId === 'reflection') return progress.reflectionQuizPassed;
		if (roomId === 'extension') return progress.extensionCompleted;
		return false;
	}

	const roomsList = [
		{ id: 'intro', name: 'Room 1: Introduction', desc: 'Pengenalan Tektonisme, Peta Tektonik, & Bentang Alam Jabung', icon: '📖' },
		{ id: 'connection', name: 'Room 2: Connection', desc: 'Jenis-Jenis Longsoran & Video Kejadian Bencana Jabung', icon: '🔗' },
		{ id: 'application', name: 'Room 3: Application', desc: 'Membaca Peta, Kondisi Geografis, Persebaran, & Mitigasi', icon: '📌' },
		{ id: 'reflection', name: 'Room 4: Reflection', desc: 'Evaluasi Kuis (10 Soal) & Esai Analisis Studi Kasus', icon: '📝' },
		{ id: 'extension', name: 'Room 5: Extension', desc: 'Rangkuman Pembelajaran & Refleksi Penutup Modul', icon: '🌐' }
	];

	function handleClose() {
		try { sound.playClick(); } catch {}
		onProgressUpdate?.();
		onClose();
	}

	function handleDevReset() {
		try { sound.playClick(); } catch {}
		progress = resetProgress();
		onProgressUpdate?.();
	}

	function handleDevInstantComplete() {
		try { sound.playClick(); } catch {}
		progress = completeAllProgress(progress.studentName || 'Faridh Arganatha');
		onProgressUpdate?.();
	}
</script>

{#if isOpen}
	<!-- MODAL OVERLAY BACKDROP -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
		
		<!-- BACKDROP CLICK DISMISS BUTTON (Sits behind the card) -->
		<button
			type="button"
			aria-label="Tutup Dashboard Progres"
			onclick={handleClose}
			class="absolute inset-0 w-full h-full bg-transparent border-none cursor-pointer z-0"
		></button>

		<!-- MAIN MODAL CARD CONTAINER (Sits on top z-10) -->
		<div class="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-400/80 flex flex-col">
			
			<!-- MODAL TOP BAR -->
			<div class="px-6 py-4 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white flex items-center justify-between font-bubble">
				<div class="flex items-center space-x-2">
					<span class="text-2xl">📊</span>
					<div>
						<h3 class="font-extrabold text-base sm:text-lg leading-tight">Progres Pembelajaran Student</h3>
						<p class="text-xs text-amber-200 font-sans font-medium">EDX-Style Student Dashboard</p>
					</div>
				</div>

				<button
					type="button"
					onclick={handleClose}
					class="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center text-base transition-colors shadow-md cursor-pointer active:scale-90"
					title="Tutup (Esc)"
				>
					✕
				</button>
			</div>

			<!-- MODAL BODY CONTENT -->
			<div class="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
				
				<!-- STUDENT INFORMATION HEADER CARD -->
				<div class="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
					<div class="flex items-center space-x-3 text-left">
						<div class="w-12 h-12 rounded-full bg-amber-500 text-white font-black text-xl flex items-center justify-center shadow-md">
							{progress.studentName.charAt(0).toUpperCase()}
						</div>
						<div>
							<h4 class="font-bold text-gray-900 text-base sm:text-lg">{progress.studentName}</h4>
							<span class="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
								Siswa / Mahasiswa Active
							</span>
						</div>
					</div>

					<div class="text-right flex flex-col items-center sm:items-end">
						<span class="text-xs font-bold text-gray-500 uppercase tracking-wider font-bubble">TOTAL PROGRES</span>
						<span class="text-3xl font-black text-amber-600 font-bubble">{completionPercentage}%</span>
					</div>
				</div>

				<!-- PROGRESS BAR COMPONENT -->
				<div class="space-y-2">
					<div class="flex justify-between items-center text-xs font-bold text-gray-700">
						<span>Kelengkapan Modul I-CARE</span>
						<span>{completionPercentage}% Selesai</span>
					</div>
					<div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden p-0.5 border border-gray-300">
						<div
							class="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500 shadow-inner"
							style="width: {completionPercentage}%;"
						></div>
					</div>
				</div>

				<!-- ROOM STATUS BREAKDOWN -->
				<div class="space-y-3 pt-2">
					<h5 class="text-xs font-extrabold uppercase text-gray-400 tracking-wider font-bubble">
						STATUS TIAP ROOM PEMBELAJARAN
					</h5>

					<div class="grid grid-cols-1 gap-2.5">
						{#each roomsList as room}
							{@const isDone = isRoomCompleted(room.id)}
							<div class={`p-3 rounded-xl border-2 flex items-center justify-between transition-all ${
								isDone ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-gray-50 border-gray-200 text-gray-700'
							}`}>
								<div class="flex items-center space-x-3 text-left">
									<span class="text-xl">{room.icon}</span>
									<div>
										<h6 class="font-bold text-sm leading-tight">{room.name}</h6>
										<p class="text-xs text-gray-500 font-medium">{room.desc}</p>
									</div>
								</div>

								<div class="shrink-0 pl-2">
									{#if isDone}
										<span class="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-lg shadow-sm flex items-center space-x-1">
											<span>✓</span>
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
				<div class="pt-3 font-bubble">
					{#if completionPercentage === 100}
						<button
							onclick={() => {
								handleClose();
								onOpenCertificate();
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
							class="w-full py-3.5 px-6 bg-slate-100 border-3 border-slate-300 shadow-sm rounded-2xl text-slate-400 font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center space-x-2 cursor-not-allowed opacity-85"
						>
							<span class="text-lg sm:text-xl">🔒</span>
							<span>SELESAIKAN 100% MODUL UNTUK MEMBUKA SERTIFIKAT</span>
						</button>
					{/if}
				</div>

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
								onTriggerSplash?.();
							}}
							class="w-full mt-2 px-3 py-2.5 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md border-2 border-white flex items-center justify-center space-x-2 cursor-pointer transition-transform active:scale-95 font-sans uppercase tracking-wider"
						>
							<span>🎬</span>
							<span>Trigger Splash Screen (Dev Tool)</span>
						</button>
					</div>
				</div>

			</div>

		</div>

	</div>
{/if}
