"use strict";
// =========================================================
// AUDIO SERVICE - WEB AUDIO SYNTHESIZER FOR RPG SOUND EFFECTS & BGM
// =========================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioService = void 0;
class AudioService {
    static instance;
    audioCtx = null;
    isBgmPlaying = true; // DEFAULT ON AS REQUESTED!
    isSfxEnabled = true; // DEFAULT ON FOR SOUND EFFECTS
    masterVolume = 0.8; // HIGHER DEFAULT VOLUME (80%)
    bgmAudio = null;
    constructor() {
        this.initAudioElement();
        if (typeof window !== 'undefined') {
            const savedSfx = localStorage.getItem('minimikyu_sfx_enabled');
            if (savedSfx !== null) {
                this.isSfxEnabled = savedSfx === 'true';
            }
        }
    }
    static getInstance() {
        if (!AudioService.instance) {
            AudioService.instance = new AudioService();
        }
        return AudioService.instance;
    }
    toggleSFX() {
        this.isSfxEnabled = !this.isSfxEnabled;
        if (typeof window !== 'undefined') {
            localStorage.setItem('minimikyu_sfx_enabled', this.isSfxEnabled ? 'true' : 'false');
        }
        return this.isSfxEnabled;
    }
    isSfxActive() {
        return this.isSfxEnabled;
    }
    setSFXEnabled(enabled) {
        this.isSfxEnabled = enabled;
        if (typeof window !== 'undefined') {
            localStorage.setItem('minimikyu_sfx_enabled', enabled ? 'true' : 'false');
        }
    }
    initAudioElement() {
        if (typeof window === 'undefined')
            return;
        if (!this.bgmAudio) {
            this.bgmAudio = new Audio('assets/game_music/bgm_cyberpunk.mp3');
            this.bgmAudio.loop = true;
            this.bgmAudio.volume = this.masterVolume;
        }
    }
    initCtx() {
        if (!this.audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContextClass();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        return this.audioCtx;
    }
    toggleBGM() {
        if (this.isBgmPlaying) {
            this.stopBGM();
            return false;
        }
        else {
            this.isBgmPlaying = true;
            this.startBGM(true);
            return true;
        }
    }
    isBgmActive() {
        return this.isBgmPlaying;
    }
    setVolume(vol) {
        this.masterVolume = Math.max(0, Math.min(1, vol));
        if (this.bgmAudio) {
            this.bgmAudio.volume = this.masterVolume;
        }
    }
    getVolume() {
        return this.masterVolume;
    }
    startBGM(force = false) {
        this.isBgmPlaying = true;
        this.initAudioElement();
        if (this.bgmAudio) {
            this.bgmAudio.volume = this.masterVolume;
            const playPromise = this.bgmAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.warn('[AUDIO] Autoplay prevented, waiting for user interaction:', err);
                });
            }
        }
    }
    stopBGM() {
        this.isBgmPlaying = false;
        if (this.bgmAudio) {
            this.bgmAudio.pause();
        }
    }
    playSound(type) {
        if (!this.isSfxEnabled)
            return;
        try {
            const ctx = this.initCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            const now = ctx.currentTime;
            if (type === 'attack') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(450, now);
                osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
                gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            }
            else if (type === 'hit') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(180, now);
                osc.frequency.linearRampToValueAtTime(60, now + 0.12);
                gain.gain.setValueAtTime(0.4 * this.masterVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            }
            else if (type === 'levelup') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523, now);
                osc.frequency.setValueAtTime(659, now + 0.1);
                osc.frequency.setValueAtTime(783, now + 0.2);
                osc.frequency.setValueAtTime(1046, now + 0.3);
                gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
            }
            else if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(600, now + 0.2);
                gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            }
            else if (type === 'gacha') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.linearRampToValueAtTime(880, now + 0.4);
                gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            }
            else if (type === 'victory') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(587.33, now);
                osc.frequency.setValueAtTime(739.99, now + 0.15);
                osc.frequency.setValueAtTime(880, now + 0.3);
                gain.gain.setValueAtTime(0.4 * this.masterVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
            }
        }
        catch (e) {
            console.warn('[AUDIO] Error playing sound effect:', e);
        }
    }
}
exports.AudioService = AudioService;
