// Web Audio API synthesizer for sound effects and background music

class SoundManager {
	private ctx: AudioContext | null = null;
	private bgOsc: OscillatorNode | null = null;
	private bgGain: GainNode | null = null;
	private isBgPlaying = false;
	private bgInterval: number | null = null;

	private isMuted = false;
	private sfxVolume = 0.8; // 0.0 to 1.0
	private bgmVolume = 0.5; // 0.0 to 1.0

	constructor() {
		if (typeof localStorage !== 'undefined') {
			this.isMuted = localStorage.getItem('icare_sound_muted') === 'true';
			const sfx = localStorage.getItem('icare_sfx_volume');
			if (sfx !== null) this.sfxVolume = parseFloat(sfx);
			const bgm = localStorage.getItem('icare_bgm_volume');
			if (bgm !== null) this.bgmVolume = parseFloat(bgm);
		}
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
			this.ctx.resume();
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
		if (!this.ctx) return false;

		if (this.isBgPlaying) {
			this.stopMusic();
			return false;
		} else {
			this.startMusic();
			return true;
		}
	}

	startMusic() {
		if (this.isMuted || this.bgmVolume <= 0) return;
		this.init();
		if (!this.ctx) return;
		if (this.isBgPlaying) return;
		this.isBgPlaying = true;

		// Play a friendly playful 4-note arpeggio loop (C major 7th: C4, E4, G4, B4)
		const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 392.00, 329.63];
		let noteIdx = 0;

		this.bgInterval = window.setInterval(() => {
			if (!this.isBgPlaying || !this.ctx || this.isMuted || this.bgmVolume <= 0) return;
			try {
				const osc = this.ctx.createOscillator();
				const gain = this.ctx.createGain();
				osc.type = 'sine';
				osc.frequency.setValueAtTime(notes[noteIdx], this.ctx.currentTime);
				const peakGain = 0.05 * this.bgmVolume;
				gain.gain.setValueAtTime(peakGain, this.ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

				osc.connect(gain);
				gain.connect(this.ctx.destination);

				osc.start();
				osc.stop(this.ctx.currentTime + 0.35);

				noteIdx = (noteIdx + 1) % notes.length;
			} catch (e) {
				console.error(e);
			}
		}, 400);
	}

	stopMusic() {
		this.isBgPlaying = false;
		if (this.bgInterval !== null) {
			clearInterval(this.bgInterval);
			this.bgInterval = null;
		}
	}

	get isMusicOn() {
		return this.isBgPlaying;
	}
}

export const sound = new SoundManager();
