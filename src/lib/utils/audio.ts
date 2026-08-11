// Web Audio API synthesizer for sound effects and background music

class SoundManager {
	private ctx: AudioContext | null = null;
	private isBgPlaying = false;
	private bgInterval: number | null = null;

	private isMuted = false;
	private sfxVolume = 0.8; // 0.0 to 1.0
	private bgmVolume = 0.5; // 0.0 to 1.0
	private shouldAutoPlayMusic = false;
	private hasAttachedInteractionListener = false;

	constructor() {
		if (typeof localStorage !== 'undefined') {
			this.isMuted = localStorage.getItem('icare_sound_muted') === 'true';
			const sfx = localStorage.getItem('icare_sfx_volume');
			if (sfx !== null) this.sfxVolume = parseFloat(sfx);
			const bgm = localStorage.getItem('icare_bgm_volume');
			if (bgm !== null) this.bgmVolume = parseFloat(bgm);
			this.shouldAutoPlayMusic = localStorage.getItem('icare_music_active') === 'true';
		}
		if (typeof window !== 'undefined') {
			this.attachUserInteractionListener();
		}
	}

	private attachUserInteractionListener() {
		if (this.hasAttachedInteractionListener || typeof window === 'undefined') return;
		this.hasAttachedInteractionListener = true;

		const handleUserInteraction = () => {
			this.init();
			if (this.shouldAutoPlayMusic && !this.isBgPlaying && !this.isMuted && this.bgmVolume > 0) {
				this.startMusic();
			}
		};

		window.addEventListener('pointerdown', handleUserInteraction, { passive: true });
		window.addEventListener('click', handleUserInteraction, { passive: true });
		window.addEventListener('keydown', handleUserInteraction, { passive: true });
		window.addEventListener('touchstart', handleUserInteraction, { passive: true });
	}

	setMuted(muted: boolean) {
		this.isMuted = muted;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('icare_sound_muted', String(muted));
		}
		if (muted && this.isBgPlaying) {
			this.stopMusic();
		}
	}

	setSfxVolume(vol: number) {
		this.sfxVolume = Math.max(0, Math.min(1, vol));
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('icare_sfx_volume', String(this.sfxVolume));
		}
	}

	setBgmVolume(vol: number) {
		this.bgmVolume = Math.max(0, Math.min(1, vol));
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('icare_bgm_volume', String(this.bgmVolume));
		}
		if (this.bgmVolume > 0 && this.shouldAutoPlayMusic && !this.isBgPlaying) {
			this.startMusic();
		}
	}

	getMuted() { return this.isMuted; }
	getSfxVolume() { return this.sfxVolume; }
	getBgmVolume() { return this.bgmVolume; }

	private init() {
		if (!this.ctx && typeof window !== 'undefined') {
			const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			this.ctx = new AudioCtx();
		}
		if (this.ctx && this.ctx.state === 'suspended') {
			this.ctx.resume().catch(() => {});
		}
	}

	playPop(freq = 440, type: OscillatorType = 'sine') {
		if (this.isMuted || this.sfxVolume <= 0) return;
		try {
			this.init();
			if (!this.ctx) return;

			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();

			osc.type = type;
			osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.08);

			const peakGain = 0.3 * this.sfxVolume;
			gain.gain.setValueAtTime(peakGain, this.ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

			osc.connect(gain);
			gain.connect(this.ctx.destination);

			osc.start();
			osc.stop(this.ctx.currentTime + 0.08);
		} catch (e) {
			console.error(e);
		}
	}

	playClick() {
		this.playPop(523.25, 'triangle'); // C5 pop
	}

	playCardHover() {
		this.playPop(659.25, 'sine'); // E5 gentle chime
	}

	toggleMusic(): boolean {
		this.init();
		if (this.isBgPlaying) {
			this.stopMusic();
			return false;
		} else {
			this.startMusic();
			return true;
		}
	}

	startMusic() {
		this.shouldAutoPlayMusic = true;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('icare_music_active', 'true');
		}
		if (this.isMuted || this.bgmVolume <= 0) return;
		this.init();
		if (!this.ctx) return;
		if (this.isBgPlaying) return;
		this.isBgPlaying = true;

		// Gentle I-vi-IV-V7 chord progression, arpeggiated, so the loop cycles
		// through four different chords instead of repeating the same notes.
		const chords = [
			{ notes: [261.63, 329.63, 392.00, 493.88], bass: 130.81 }, // Cmaj7
			{ notes: [220.00, 261.63, 329.63, 392.00], bass: 110.00 }, // Am7
			{ notes: [174.61, 220.00, 261.63, 329.63], bass: 87.31 },  // Fmaj7
			{ notes: [196.00, 246.94, 293.66, 349.23], bass: 98.00 }   // G7
		];
		const arpPattern = [0, 1, 2, 3, 2, 1]; // up then down, no repeated endpoints
		let chordIdx = 0;
		let stepIdx = 0;

		const playNote = (freq: number, startTime: number, duration: number, peakGain: number, type: OscillatorType) => {
			if (!this.ctx) return;
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();
			osc.type = type;
			osc.frequency.setValueAtTime(freq, startTime);
			gain.gain.setValueAtTime(peakGain, startTime);
			gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
			osc.connect(gain);
			gain.connect(this.ctx.destination);
			osc.start(startTime);
			osc.stop(startTime + duration);
		};

		this.bgInterval = window.setInterval(() => {
			if (!this.isBgPlaying || !this.ctx || this.isMuted || this.bgmVolume <= 0) return;
			try {
				const chord = chords[chordIdx];
				const now = this.ctx.currentTime;

				// New chord: lay a soft sustained bass note under the arpeggio
				if (stepIdx === 0) {
					playNote(chord.bass, now, arpPattern.length * 0.34, 0.05 * this.bgmVolume, 'triangle');
				}

				playNote(chord.notes[arpPattern[stepIdx]], now, 0.32, 0.09 * this.bgmVolume, 'sine');

				stepIdx++;
				if (stepIdx >= arpPattern.length) {
					stepIdx = 0;
					chordIdx = (chordIdx + 1) % chords.length;
				}
			} catch (e) {
				console.error(e);
			}
		}, 340);
	}

	stopMusic() {
		this.shouldAutoPlayMusic = false;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('icare_music_active', 'false');
		}
		this.isBgPlaying = false;
		if (this.bgInterval !== null) {
			clearInterval(this.bgInterval);
			this.bgInterval = null;
		}
	}

	get isMusicOn() {
		return this.isBgPlaying || (this.shouldAutoPlayMusic && !this.isMuted && this.bgmVolume > 0);
	}
}

export const sound = new SoundManager();
