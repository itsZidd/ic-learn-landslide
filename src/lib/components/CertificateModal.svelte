<script lang="ts">
	import { sound } from '$lib/utils/audio';
	import umLogo from '$lib/assets/UMLogo.png';
	import { getProgress, saveProgress } from '$lib/utils/progress';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	let progress = $state(getProgress());
	let isEditingName = $state(false);
	let inputName = $state('');
	let isDownloading = $state(false);
	let certificateEl: HTMLDivElement | undefined;

	$effect(() => {
		if (isOpen) {
			const current = getProgress();
			progress = current;
			inputName = current.studentName;

			// Global ESC Key Listener when modal is open
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

	function handleSaveName() {
		try { sound.playClick(); } catch {}
		progress = saveProgress({ studentName: inputName });
		isEditingName = false;
	}

	async function handleDownloadPdf() {
		try { sound.playClick(); } catch {}
		if (!certificateEl || isDownloading) return;

		isDownloading = true;
		try {
			// html2canvas (even with foreignObjectRendering) proved flaky here — it intermittently
			// dropped the image, signature and diagonal panel depending on image-load timing.
			// html-to-image's toSvg() reliably captures everything, but its own toCanvas() hangs
			// indefinitely afterward: internally it calls HTMLImageElement.decode() on the resulting
			// foreignObject-based SVG, and decode() never resolves for that combination in this
			// browser. So the SVG -> <img> -> <canvas> steps are done manually here using a plain
			// onload handler instead of decode(), which works reliably.
			const { toSvg } = await import('html-to-image');
			const { jsPDF } = await import('jspdf');

			// skipFonts below relies on fonts already being loaded in the page (see comment
			// there). The certificate's "I-CARE" footer badge is the one piece of text using
			// the Fredoka webfont rather than a system font, so if it hadn't finished loading
			// yet (e.g. certificate opened right after a fresh page load), the capture would
			// silently fall back to a generic font just for that badge. Waiting here guarantees
			// it's ready before the snapshot is taken.
			await document.fonts.ready;

			const svgDataUrl = await toSvg(certificateEl, {
				pixelRatio: 2,
				backgroundColor: '#ffffff',
				// Skip html-to-image's automatic web-font embedding: it tries to fetch every font
				// referenced by the page's stylesheets (including the Google Fonts @import in
				// layout.css) and hangs indefinitely if that network request stalls. The certificate
				// still renders with its normal fonts since those are already loaded in the page —
				// this only skips re-embedding font files into the exported image data.
				skipFonts: true
			});

			const svgImage = new Image();
			await new Promise<void>((resolve, reject) => {
				svgImage.onload = () => resolve();
				svgImage.onerror = () => reject(new Error('Failed to load rendered certificate image'));
				svgImage.src = svgDataUrl;
			});

			const pixelRatio = 2;
			const canvas = document.createElement('canvas');
			canvas.width = certificateEl.clientWidth * pixelRatio;
			canvas.height = certificateEl.clientHeight * pixelRatio;
			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error('Canvas 2D context unavailable');
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(svgImage, 0, 0, canvas.width, canvas.height);

			// Use a real, standard page size (A4 landscape) rather than deriving the page's physical
			// dimensions from raw canvas pixel counts — mixing unit:'px' with a pixel-sized format
			// compounds with html2canvas's scale factor into a page many times too large, which
			// PDF viewers then render oddly (cropped/zoomed wrong). The certificate's own aspect
			// ratio (1.414:1) already matches A4, so the image fits the page almost exactly.
			const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();
			const imgAspect = canvas.width / canvas.height;
			const pageAspect = pageWidth / pageHeight;
			const renderWidth = imgAspect > pageAspect ? pageWidth : pageHeight * imgAspect;
			const renderHeight = imgAspect > pageAspect ? pageWidth / imgAspect : pageHeight;
			const offsetX = (pageWidth - renderWidth) / 2;
			const offsetY = (pageHeight - renderHeight) / 2;
			pdf.addImage(canvas.toDataURL('image/png'), 'PNG', offsetX, offsetY, renderWidth, renderHeight);

			const safeName = progress.studentName.trim().replace(/[^a-zA-Z0-9]+/g, '-') || 'Sertifikat';
			pdf.save(`Sertifikat-ICARE-${safeName}.pdf`);
		} catch (e) {
			console.error('Failed to generate certificate PDF', e);
		} finally {
			isDownloading = false;
		}
	}

	function handleClose() {
		try { sound.playClick(); } catch {}
		onClose();
	}
</script>

{#snippet certificate()}
	<!-- CERTIFICATE DOCUMENT CANVAS (EDX SPLIT-SCREEN LAYOUT WITH DISTINCT BACKGROUND COLORS & NON-OVERLAPPING DIAGONAL DIVIDER) -->
	<div bind:this={certificateEl} class="relative w-full aspect-[1.414/1] bg-[#ffffff] p-6 sm:p-10 md:p-12 flex overflow-hidden text-[#1d293d] font-sans border-[10px] border-[#e2e8f0]">

		<!-- RIGHT SIDEBAR DISTINCT BACKGROUND POLYGON (DISTINCT SHADED COLOR ON RIGHT SIDE OF DIAGONAL LINE) -->
		<div
			class="absolute inset-y-0 right-0 w-[35%] bg-[#edf2f7] pointer-events-none z-0"
			style="clip-path: polygon(25% 0, 100% 0, 100% 100%, 0% 100%);"
		>
			<!-- Diagonal Border Line Overlay -->
			<div
				class="absolute inset-y-0 left-0 w-[2px] bg-[#cbd5e1]"
				style="transform-origin: top left;"
			></div>
		</div>

		<!-- LEFT MAIN SECTION (~70% WIDTH) -->
		<div class="flex-1 pr-4 sm:pr-8 md:pr-12 flex flex-col justify-between text-left z-10">

			<!-- TOP TITLE HEADER -->
			<div class="space-y-0.5">
				<h1 class="text-3xl sm:text-5xl md:text-6xl font-black italic tracking-tight text-[#003049] leading-none">
					I-CARE
				</h1>
				<h2 class="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#003049] leading-tight">
					Sertifikat Kelulusan
				</h2>
			</div>

			<!-- RECIPIENT & COURSE NARRATIVE -->
			<div class="my-auto py-2 sm:py-5 space-y-3 sm:space-y-5 max-w-lg md:max-w-xl">
				<div class="space-y-1">
					<p class="text-xs sm:text-sm font-semibold text-[#62748e]">
						Sertifikat ini diberikan kepada
					</p>
					<h3 class="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0f172b] tracking-tight">
						{progress.studentName}
					</h3>
				</div>

				<div class="space-y-1 sm:space-y-1.5">
					<p class="text-xs sm:text-sm font-semibold text-[#62748e] leading-snug">
						telah berhasil menyelesaikan dan lulus evaluasi pada
					</p>
					<h4 class="text-sm sm:text-lg md:text-xl font-black text-[#0f172b] leading-snug">
						E-Modul I-Care Landslide Learning: Materi Kebencanaan Longsor di Kecamatan Jabung
					</h4>
					<p class="text-[10px] sm:text-xs text-[#62748e] leading-relaxed font-medium">
						program pembelajaran interaktif yang dikembangkan sebagai bagian dari tugas akhir (skripsi) Program Studi Pendidikan Geografi, Fakultas Ilmu Sosial, Universitas Negeri Malang.
					</p>
				</div>
			</div>

			<!-- BOTTOM LEFT FOOTER BRANDING & METADATA -->
			<div class="flex items-end space-x-4 pt-3 border-t border-[#e2e8f0]">
				<!-- Logo Badge -->
				<div class="flex items-center space-x-1.5 pl-3 pr-2 py-1.5 bg-[#003049] text-white rounded-lg font-black text-xs sm:text-sm tracking-wider leading-none shrink-0 whitespace-nowrap">
					<span>I-CARE</span>
				</div>

				<!-- Metadata Columns -->
				<div class="flex items-center space-x-4 sm:space-x-6 text-[10px] sm:text-xs text-[#45556c] font-sans">
					<div>
						<span class="block font-bold text-[#1d293d]">Tanggal Diberikan</span>
						<span>{progress.completionDate}</span>
					</div>
					<div>
						<span class="block font-bold text-[#1d293d]">ID Sertifikat</span>
						<span class="font-mono text-[#314158]">{progress.certificateId}</span>
					</div>
				</div>
			</div>

		</div>

		<!-- RIGHT SIDEBAR SECTION (SAFELY CONTAINED WITHIN RIGHT SHADED REGION WITH NO TEXT OVERLAP) -->
		<div class="w-[28%] pl-3 sm:pl-6 flex flex-col justify-between text-right items-end z-10">

			<!-- TOP RIGHT INSTITUTION LOGO -->
			<div class="flex flex-col items-end space-y-1.5 pt-1">
				<img src={umLogo} alt="Logo UM" class="h-10 sm:h-16 md:h-20 w-auto drop-shadow-sm" />
				<div class="text-right">
					<h4 class="text-[9px] sm:text-xs font-black uppercase text-[#1c398e] tracking-wider leading-tight">
						Universitas Negeri Malang
					</h4>
					<p class="text-[8px] sm:text-[10px] font-bold text-[#62748e] uppercase tracking-widest leading-tight">
						Departemen Geografi
					</p>
				</div>
			</div>

			<!-- BOTTOM RIGHT SIGNATURE & SIGNATORY DETAILS (PADDED TO NEVER TOUCH DIAGONAL LINE) -->
			<div class="flex flex-col items-end space-y-0.5 sm:space-y-1 pb-1 pl-2">
				<!-- Handwritten Vector Signature -->
				<div class="h-8 sm:h-12 w-24 sm:w-36 flex items-center justify-end">
					<svg class="h-8 sm:h-11 w-full text-[#0f172b]" viewBox="0 0 150 50" fill="none" stroke="currentColor" stroke-width="2.2">
						<path d="M20 35 C 35 15, 45 40, 60 20 C 70 10, 80 35, 95 25 C 105 15, 120 40, 140 20" />
					</svg>
				</div>

				<h5 class="text-xs sm:text-sm font-extrabold text-[#0f172b] leading-tight">
					Faridh Arganatha D.
				</h5>

				<div class="text-[8px] sm:text-[10px] text-[#45556c] font-medium leading-tight space-y-0.5">
					<p>Pengembang & Peneliti E-Modul</p>
					<p>Departemen Geografi, FIS</p>
					<p>Universitas Negeri Malang</p>
				</div>
			</div>

		</div>

	</div>
{/snippet}

{#if isOpen}
	<!-- MODAL OVERLAY WRAPPER (scrollable so tall content isn't clipped above the viewport) -->
	<div class="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">

		<!-- BACKDROP CLICK DISMISS BUTTON (Sits behind the card, captures clicks outside card) -->
		<button
			type="button"
			aria-label="Tutup Modal Sertifikat"
			onclick={handleClose}
			class="fixed inset-0 w-full h-full bg-transparent border-none cursor-pointer z-0"
		></button>

		<!-- CENTERING WRAPPER: centers the card when it fits, but grows with it so the overlay's scroll can reach every part when it doesn't -->
		<div class="relative z-10 min-h-full flex items-center justify-center">

		<!-- MAIN MODAL CARD CONTAINER (Sits on top z-10) -->
		<div class="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-sky-300/60 flex flex-col">

			<!-- TOP CONTROL TOOLBAR -->
			<div class="px-5 py-3 bg-slate-900 text-white flex items-center justify-between font-bubble">
				<div class="flex items-center space-x-2">
					<span class="text-xl">🎓</span>
					<span class="font-extrabold text-sm sm:text-base">Sertifikat Kelulusan I-CARE</span>
				</div>

				<div class="flex items-center space-x-2">
					{#if !isEditingName}
						<button
							type="button"
							onclick={() => {
								try { sound.playClick(); } catch {}
								isEditingName = true;
							}}
							class="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center space-x-1 cursor-pointer"
						>
							<span>✏️ Edit Nama</span>
						</button>
					{/if}

					<button
						type="button"
						onclick={handleDownloadPdf}
						disabled={isDownloading}
						class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-wait text-white font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center space-x-1 shadow-md cursor-pointer"
					>
						<span>{isDownloading ? '⏳ Memproses...' : '⬇️ Unduh PDF'}</span>
					</button>

					<!-- CLOSE X BUTTON -->
					<button
						type="button"
						onclick={handleClose}
						class="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center text-base transition-colors shadow-md cursor-pointer active:scale-90"
						title="Tutup Modal (Esc)"
					>
						✕
					</button>
				</div>
			</div>

			<!-- EDIT NAME INPUT BAR -->
			{#if isEditingName}
				<div class="p-3 bg-amber-50 border-b border-amber-200 flex items-center justify-center space-x-3">
					<span class="text-xs font-bold text-amber-900">Nama Pada Sertifikat:</span>
					<input
						type="text"
						bind:value={inputName}
						class="px-3 py-1 bg-white border border-amber-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
					/>
					<button
						type="button"
						onclick={handleSaveName}
						class="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-500 cursor-pointer"
					>
						Simpan
					</button>
				</div>
			{/if}

			<!-- SCROLLABLE CONTAINER FOR MOBILE RESPONSIVENESS (PREVENTS ASPECT RATIO & TEXT CUTOFF ON SMALL SCREENS) -->
			<div class="w-full overflow-x-auto p-2 sm:p-4 bg-slate-900/10 flex justify-center">
				<div class="w-full min-w-[640px] sm:min-w-0">
					{@render certificate()}
				</div>
			</div>

		</div>

		</div>

	</div>
{/if}
