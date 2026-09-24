/**
 * Web Audio API Sound & Music Synthesizer Engine
 * Generates all meme sound effects and music procedurally!
 * Works offline, no external audio assets or CORS issues.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.masterVolume = 0.5;
        this.isMuted = false;
        this.currentTrack = null;
        this.isPlayingMusic = false;
        this.musicTimer = null;
        this.bgGain = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolume(val) {
        this.masterVolume = Math.max(0, Math.min(1, val));
        if (this.bgGain && this.ctx) {
            this.bgGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume * 0.4, this.ctx.currentTime);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.bgGain && this.ctx) {
            this.bgGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume * 0.4, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    // 1. Taco Bell DONG! (Classic metallic resonant bell)
    playTacoBell() {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime;
        const freqs = [435, 870, 1310, 1740, 2200, 3100];
        const gains = [0.9, 0.6, 0.4, 0.3, 0.2, 0.1];

        freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = i % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            // Slight detune for metallic chime
            osc.detune.setValueAtTime((Math.random() - 0.5) * 15, now);

            const attack = 0.005;
            const decay = 2.4 - i * 0.25;

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(gains[i] * this.masterVolume * 0.8, now + attack);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.5, decay));

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + decay);
        });
    }

    // 2. Vine Boom (Deep punchy 808 sub bass drop with initial transient)
    playVineBoom() {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime;

        // Sub bass oscillator
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.5);

        gain.gain.setValueAtTime(this.masterVolume * 1.0, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        // Noise click punch
        const bufferSize = this.ctx.sampleRate * 0.08;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(this.masterVolume * 0.8, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        noise.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        osc.start(now);
        noise.start(now);
        osc.stop(now + 1.2);
    }

    // 3. Air Horn (MLG meme horn)
    playAirHorn() {
        this.init();
        if (this.isMuted) return;

        const notes = [
            { f: 466.16, d: 0.12 }, // Bb4
            { f: 466.16, d: 0.12 },
            { f: 466.16, d: 0.12 },
            { f: 466.16, d: 0.45 },
            { f: 622.25, d: 0.35 }  // Eb5
        ];

        let offset = 0;
        notes.forEach((item, idx) => {
            const start = this.ctx.currentTime + offset;
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc1.type = 'sawtooth';
            osc2.type = 'sawtooth';

            osc1.frequency.setValueAtTime(item.f, start);
            osc2.frequency.setValueAtTime(item.f * 1.01, start);

            gain.gain.setValueAtTime(this.masterVolume * 0.45, start);
            gain.gain.setValueAtTime(this.masterVolume * 0.45, start + item.d - 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, start + item.d);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.ctx.destination);

            osc1.start(start);
            osc2.start(start);
            osc1.stop(start + item.d);
            osc2.stop(start + item.d);

            offset += item.d + (idx < 3 ? 0.03 : 0.05);
        });
    }

    // 4. Crunch / Munch (Eating Taco sound)
    playMunch() {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime;
        for (let j = 0; j < 3; j++) {
            const start = now + j * 0.07;
            const bufferSize = this.ctx.sampleRate * 0.05;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1200 + Math.random() * 800, start);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(this.masterVolume * 0.6, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.05);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(start);
        }
    }

    // 5. Level Up / Success sound
    playSuccess() {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.09);

            gain.gain.setValueAtTime(this.masterVolume * 0.4, now + i * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.09);
            osc.stop(now + i * 0.09 + 0.25);
        });
    }

    // 6. Laser / Laser Beam Zap
    playLaser() {
        this.init();
        if (this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(990, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);

        gain.gain.setValueAtTime(this.masterVolume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    // --- PROCEDURAL BACKGROUND MUSIC GENERATOR ---
    // Tracks: 'taco' (Funky Fiesta), 'phonk' (Aggressive Gamer Phonk), 'lofi' (Chill 8-bit homework)
    playMusicTrack(trackName) {
        this.init();
        this.stopMusic();

        this.currentTrack = trackName;
        this.isPlayingMusic = true;

        if (!this.bgGain) {
            this.bgGain = this.ctx.createGain();
            this.bgGain.connect(this.ctx.destination);
        }
        this.bgGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume * 0.35, this.ctx.currentTime);

        let step = 0;
        let tempo = 120; // BPM
        let pattern = [];

        if (trackName === 'taco') {
            // Happy Mexican Salsa / Taco Party Arpeggio
            tempo = 145;
            // Notes in Hz: C5, E5, G5, A5, G5, E5, D5, C5
            pattern = [
                523.25, 0, 659.25, 0, 783.99, 783.99, 880.00, 783.99,
                659.25, 0, 587.33, 0, 523.25, 659.25, 587.33, 0,
                587.33, 0, 659.25, 0, 698.46, 698.46, 783.99, 698.46,
                659.25, 0, 523.25, 0, 587.33, 523.25, 493.88, 0
            ];
        } else if (trackName === 'phonk') {
            // Dark Phonk / Cyber Cowbell riff
            tempo = 140;
            // Cowbell frequencies
            const F1 = 587.33; // D5
            const F2 = 740.00; // F#5
            const F3 = 880.00; // A5
            const F4 = 987.77; // B5
            pattern = [
                F1, F1, 0, F2, 0, F3, F2, 0,
                F1, F1, 0, F4, 0, F3, F2, 0,
                F1, F1, 0, F2, 0, F3, F2, 0,
                880.00, 783.99, 740.00, 587.33, 440.00, 0, F1, 0
            ];
        } else {
            // Lofi 8-bit Chill study melody
            tempo = 95;
            pattern = [
                261.63, 329.63, 392.00, 493.88, 523.25, 392.00, 329.63, 261.63,
                293.66, 349.23, 440.00, 523.25, 587.33, 440.00, 349.23, 293.66,
                220.00, 261.63, 329.63, 392.00, 440.00, 329.63, 261.63, 220.00,
                196.00, 246.94, 293.66, 392.00, 493.88, 392.00, 293.66, 246.94
            ];
        }

        const stepTime = (60 / tempo) / 2; // 8th notes

        const scheduleLoop = () => {
            if (!this.isPlayingMusic) return;

            const noteFreq = pattern[step % pattern.length];
            const now = this.ctx.currentTime;

            if (noteFreq > 0) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                if (trackName === 'phonk') {
                    // Cowbell-like tone
                    osc.type = 'square';
                    const osc2 = this.ctx.createOscillator();
                    osc2.type = 'triangle';
                    osc2.frequency.setValueAtTime(noteFreq * 1.5, now);
                    osc.frequency.setValueAtTime(noteFreq, now);

                    gain.gain.setValueAtTime(0.35, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

                    osc.connect(gain);
                    osc2.connect(gain);
                    gain.connect(this.bgGain);

                    osc.start(now);
                    osc2.start(now);
                    osc.stop(now + 0.14);
                    osc2.stop(now + 0.14);
                } else if (trackName === 'taco') {
                    // Mexican trumpet / synth lead
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(noteFreq, now);

                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 0.85);

                    osc.connect(gain);
                    gain.connect(this.bgGain);

                    osc.start(now);
                    osc.stop(now + stepTime * 0.9);
                } else {
                    // Chill sine/flute
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(noteFreq, now);

                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 1.2);

                    osc.connect(gain);
                    gain.connect(this.bgGain);

                    osc.start(now);
                    osc.stop(now + stepTime * 1.3);
                }
            }

            // Beat / Kick on every 4th step
            if (step % 4 === 0) {
                const kickOsc = this.ctx.createOscillator();
                const kickGain = this.ctx.createGain();
                kickOsc.type = 'sine';
                kickOsc.frequency.setValueAtTime(110, now);
                kickOsc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

                kickGain.gain.setValueAtTime(trackName === 'phonk' ? 0.6 : 0.35, now);
                kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

                kickOsc.connect(kickGain);
                kickGain.connect(this.bgGain);

                kickOsc.start(now);
                kickOsc.stop(now + 0.15);
            }

            // Hi-hat on offbeats
            if (step % 2 === 1) {
                const hatSize = this.ctx.sampleRate * 0.03;
                const hatBuffer = this.ctx.createBuffer(1, hatSize, this.ctx.sampleRate);
                const hatData = hatBuffer.getChannelData(0);
                for (let i = 0; i < hatSize; i++) {
                    hatData[i] = (Math.random() * 2 - 1);
                }
                const hatSource = this.ctx.createBufferSource();
                hatSource.buffer = hatBuffer;
                const hatFilter = this.ctx.createBiquadFilter();
                hatFilter.type = 'highpass';
                hatFilter.frequency.setValueAtTime(7000, now);

                const hatGain = this.ctx.createGain();
                hatGain.gain.setValueAtTime(0.12, now);
                hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

                hatSource.connect(hatFilter);
                hatFilter.connect(hatGain);
                hatGain.connect(this.bgGain);

                hatSource.start(now);
            }

            step++;
            this.musicTimer = setTimeout(scheduleLoop, stepTime * 1000);
        };

        scheduleLoop();
    }

    stopMusic() {
        this.isPlayingMusic = false;
        if (this.musicTimer) {
            clearTimeout(this.musicTimer);
            this.musicTimer = null;
        }
        this.currentTrack = null;
    }
}

// Global instance
window.soundEngine = new SoundEngine();
