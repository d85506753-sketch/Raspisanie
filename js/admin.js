/**
 * Admin Abuse Panel & Troll Controls
 * "Admin Abuse": Светяшки, Музыка, Тако, Смена расписания как захочу
 */

class AdminAbuse {
    constructor() {
        this.isAuthenticated = false;
        this.adminPin = '1337'; // default pin, also accepts 'admin' or 'taco'
        this.isLiveEdit = false;
        this.keyBuffer = '';
        this.logoClicks = 0;
        this.logoClickTimer = null;

        this.excuses = [
            "Мою тетрадь с домашкой съела собака, а остатки унёс голубь в Пентагон.",
            "Я делал дз всю ночь, но кот нажал Ctrl+A и Delete, и затем лёг спать на клавиатуру.",
            "В моем доме отключили гравитацию, и тетрадь улетела в открытый космос.",
            "DeepSeek отказался решать это задание, сказав, что это нарушение Женевской конвенции.",
            "Я перепутал дни недели и сделал домашку на 2028 год.",
            "Учитель, я вам отправил дз мысленным сигналом через 5G вышку, проверьте почту разума.",
            "Тетрадь осталась в параллельной вселенной, где уроки отменили навсегда."
        ];

        this.init();
    }

    init() {
        this.bindShortcuts();
        this.bindUI();
    }

    bindShortcuts() {
        // Typing 'taco' or 'admin' activates modal
        window.addEventListener('keydown', (e) => {
            // Ignore when typing in inputs/textareas
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            this.keyBuffer += e.key.toLowerCase();
            if (this.keyBuffer.length > 10) {
                this.keyBuffer = this.keyBuffer.slice(-10);
            }

            if (this.keyBuffer.endsWith('taco') || this.keyBuffer.endsWith('admin')) {
                this.openModal();
                if (window.soundEngine) window.soundEngine.playTacoBell();
            }

            // Ctrl + Shift + A
            if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'Ф' || e.key === 'ф')) {
                e.preventDefault();
                this.openModal();
            }
        });
    }

    bindUI() {
        const adminBtn = document.getElementById('open-admin-btn');
        const modal = document.getElementById('admin-modal');
        const closeBtn = document.getElementById('close-admin-modal');
        const loginForm = document.getElementById('admin-login-form');
        const bypassBtn = document.getElementById('admin-bypass-btn');

        // Logo 5-click easter egg
        const logo = document.getElementById('site-logo');
        if (logo) {
            logo.addEventListener('click', () => {
                this.logoClicks++;
                clearTimeout(this.logoClickTimer);
                this.logoClickTimer = setTimeout(() => { this.logoClicks = 0; }, 2000);

                if (this.logoClicks >= 5) {
                    this.logoClicks = 0;
                    this.openModal();
                    if (window.soundEngine) window.soundEngine.playVineBoom();
                    if (window.effectsManager) window.effectsManager.screenShake();
                }
            });
        }

        if (adminBtn) {
            adminBtn.addEventListener('click', () => this.openModal());
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const pin = document.getElementById('admin-pin-input').value.trim();
                if (pin === this.adminPin || pin.toLowerCase() === 'admin' || pin.toLowerCase() === 'taco' || pin === '777') {
                    this.unlock();
                } else {
                    alert('Неверный PIN! Попробуй 1337 или "admin", либо жми "Взломщик".');
                    if (window.soundEngine) window.soundEngine.playVineBoom();
                }
            });
        }

        if (bypassBtn) {
            bypassBtn.addEventListener('click', () => {
                this.unlock();
                if (window.soundEngine) window.soundEngine.playVineBoom();
                if (window.effectsManager) window.effectsManager.screenShake();
            });
        }

        // Feature toggles inside panel
        const toggleLiveEdit = document.getElementById('toggle-live-edit');
        if (toggleLiveEdit) {
            toggleLiveEdit.addEventListener('change', (e) => {
                this.isLiveEdit = e.target.checked;
                window.app.renderSchedule();
                if (this.isLiveEdit) {
                    alert('РЕЖИМ РЕДАКТИРОВАНИЯ ВКЛЮЧЕН!\nНажмите на название любого предмета, кабинета или учителя прямо в расписании для изменения.');
                }
            });
        }

        const toggleRgb = document.getElementById('toggle-rgb-glow');
        if (toggleRgb) {
            toggleRgb.addEventListener('change', (e) => {
                window.effectsManager.toggleRGB(e.target.checked);
                if (window.soundEngine) window.soundEngine.playLaser();
            });
        }

        const toggleDisco = document.getElementById('toggle-disco-party');
        if (toggleDisco) {
            toggleDisco.addEventListener('change', (e) => {
                window.effectsManager.toggleDisco(e.target.checked);
                if (e.target.checked && window.soundEngine) {
                    window.soundEngine.playMusicTrack('phonk');
                }
            });
        }

        const toggleTacoRain = document.getElementById('toggle-taco-rain');
        if (toggleTacoRain) {
            toggleTacoRain.addEventListener('change', (e) => {
                window.effectsManager.toggleTacoRain(e.target.checked);
                if (e.target.checked && window.soundEngine) {
                    window.soundEngine.playTacoBell();
                    window.soundEngine.playMusicTrack('taco');
                }
            });
        }

        // Admin Live Chat Broadcast (20-25s)
        const sendChatBtn = document.getElementById('send-chat-btn');
        const clearChatBtn = document.getElementById('clear-chat-btn');
        const chatInput = document.getElementById('admin-chat-input');

        if (sendChatBtn && chatInput) {
            const sendHandler = () => {
                const val = chatInput.value.trim();
                if (val) {
                    const author = (window.authManager && window.authManager.currentUser && window.authManager.currentUser.displayName) || 'Админ';
                    const avatar = (window.authManager && window.authManager.currentUser && window.authManager.currentUser.photoURL) || '👑';
                    window.app.showAdminChatMessage(val, author, avatar, 25000);
                    if (window.effectsManager) window.effectsManager.confettiBurst();
                    window.app.showToast('Сообщение отправлено в чат на 25 секунд!', '💬');
                    chatInput.value = '';

                    // Close admin modal so admin sees the chat box immediately
                    const modal = document.getElementById('admin-modal');
                    if (modal) modal.classList.remove('active');
                }
            };

            sendChatBtn.addEventListener('click', sendHandler);

            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendHandler();
                }
            });
        }

        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => {
                window.app.hideAdminChatMessage();
                if (chatInput) chatInput.value = '';
                window.app.showToast('Чат-бокс скрыт', '🗑️');
            });
        }

        // Soundboard Buttons
        document.querySelectorAll('.soundboard-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const snd = btn.dataset.sound;
                if (!window.soundEngine) return;

                switch (snd) {
                    case 'tacobell':
                        window.soundEngine.playTacoBell();
                        break;
                    case 'vineboom':
                        window.soundEngine.playVineBoom();
                        window.effectsManager.screenShake();
                        break;
                    case 'airhorn':
                        window.soundEngine.playAirHorn();
                        break;
                    case 'munch':
                        window.soundEngine.playMunch();
                        break;
                    case 'laser':
                        window.soundEngine.playLaser();
                        break;
                    case 'success':
                        window.soundEngine.playSuccess();
                        window.effectsManager.confettiBurst();
                        break;
                }
            });
        });

        // Music Buttons
        document.querySelectorAll('.music-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const track = btn.dataset.track;
                if (!window.soundEngine) return;
                if (track === 'stop') {
                    window.soundEngine.stopMusic();
                } else {
                    window.soundEngine.playMusicTrack(track);
                }
            });
        });

        // Schedule Troll Presets
        const presetLunch = document.getElementById('preset-lunch-btn');
        if (presetLunch) {
            presetLunch.addEventListener('click', () => this.applyPresetLunch());
        }

        const presetVacation = document.getElementById('preset-vacation-btn');
        if (presetVacation) {
            presetVacation.addEventListener('click', () => this.applyPresetVacation());
        }

        const presetGym = document.getElementById('preset-gym-btn');
        if (presetGym) {
            presetGym.addEventListener('click', () => this.applyPresetGym());
        }

        const presetCybersport = document.getElementById('preset-cybersport-btn');
        if (presetCybersport) {
            presetCybersport.addEventListener('click', () => this.applyPresetCybersport());
        }

        const presetSecretRooms = document.getElementById('preset-secret-rooms-btn');
        if (presetSecretRooms) {
            presetSecretRooms.addEventListener('click', () => this.applyPresetSecretRooms());
        }

        // Admin Schedule Management buttons
        const adminAddLesson = document.getElementById('admin-add-lesson-btn');
        if (adminAddLesson) {
            adminAddLesson.addEventListener('click', () => {
                const modal = document.getElementById('admin-modal');
                if (modal) modal.classList.remove('active');

                if (window.app) {
                    window.app.openAddLessonModal(window.app.activeDay);
                }
            });
        }

        const adminClearDay = document.getElementById('admin-clear-day-btn');
        if (adminClearDay) {
            adminClearDay.addEventListener('click', () => {
                const curDay = window.app.activeDay;
                if (confirm(`Очистить все уроки на ${window.app.dayNames[curDay]}?`)) {
                    window.app.schedule[curDay] = [];
                    window.app.saveState();
                    window.app.renderSchedule();
                    window.app.showToast(`Уроки на ${window.app.dayNames[curDay]} удалены`, '🗑️');
                    if (window.soundEngine) window.soundEngine.playLaser();
                }
            });
        }

        const adminResetSchedule = document.getElementById('admin-reset-schedule-btn');
        if (adminResetSchedule) {
            adminResetSchedule.addEventListener('click', () => {
                if (confirm('Очистить ВСЁ расписание на всю неделю?')) {
                    window.app.schedule = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [] };
                    window.app.saveState();
                    window.app.renderSchedule();
                    window.app.showToast('Всё расписание очищено!', '🔄');
                    if (window.soundEngine) window.soundEngine.playLaser();
                }
            });
        }

        // Excuses generator
        const excuseBtn = document.getElementById('generate-excuse-btn');
        const excuseOutput = document.getElementById('excuse-output');
        if (excuseBtn && excuseOutput) {
            excuseBtn.addEventListener('click', () => {
                const random = this.excuses[Math.floor(Math.random() * this.excuses.length)];
                excuseOutput.innerText = `«${random}»`;
                navigator.clipboard.writeText(random);
                if (window.soundEngine) window.soundEngine.playMunch();
            });
        }

        // Grades 5+ hack
        const hackGradesBtn = document.getElementById('hack-grades-btn');
        if (hackGradesBtn) {
            hackGradesBtn.addEventListener('click', () => this.hackGrades());
        }

        const restoreOfficialBtn = document.getElementById('preset-restore-official-btn');
        if (restoreOfficialBtn) {
            restoreOfficialBtn.addEventListener('click', () => {
                if (window.app) window.app.fillOfficialSchoolSchedule();
            });
        }

        const stopAllAbuseBtn = document.getElementById('stop-all-abuse-btn');
        if (stopAllAbuseBtn) {
            stopAllAbuseBtn.addEventListener('click', () => {
                if (window.effectsManager) {
                    window.effectsManager.toggleRGB(false);
                    window.effectsManager.toggleDisco(false);
                    window.effectsManager.toggleTacoRain(false);
                }
                if (window.soundEngine) {
                    window.soundEngine.stopMusic();
                }
                const rgbChk = document.getElementById('toggle-rgb-glow');
                const discoChk = document.getElementById('toggle-disco-party');
                const tacoChk = document.getElementById('toggle-taco-rain');
                if (rgbChk) rgbChk.checked = false;
                if (discoChk) discoChk.checked = false;
                if (tacoChk) tacoChk.checked = false;
                if (window.app) window.app.showToast('Все спецэффекты и музыка отключены', '🛑');
            });
        }
    }

    applyRemoteAbuseData(data) {
        if (!data) return;
        if (window.effectsManager) {
            if (typeof data.rgb === 'boolean') window.effectsManager.toggleRGB(data.rgb);
            if (typeof data.disco === 'boolean') window.effectsManager.toggleDisco(data.disco);
            if (typeof data.tacoRain === 'boolean') window.effectsManager.toggleTacoRain(data.tacoRain);
        }
    }

    openModal() {
        const isAdmin = (window.authManager && window.authManager.isAdmin) || this.isAuthenticated;
        const loginSection = document.getElementById('admin-login-section');
        const panelSection = document.getElementById('admin-panel-section');

        if (isAdmin) {
            this.unlock(false);
            if (loginSection) loginSection.style.display = 'none';
            if (panelSection) panelSection.style.display = 'block';
        } else {
            if (loginSection) loginSection.style.display = 'block';
            if (panelSection) panelSection.style.display = 'none';
        }

        const modal = document.getElementById('admin-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    unlock(showCelebration = true) {
        this.isAuthenticated = true;
        const loginSection = document.getElementById('admin-login-section');
        const panelSection = document.getElementById('admin-panel-section');
        if (loginSection) loginSection.style.display = 'none';
        if (panelSection) panelSection.style.display = 'block';

        const adminBtn = document.getElementById('open-admin-btn');
        if (adminBtn) {
            adminBtn.style.display = 'inline-flex';
        }

        const quickAddBtn = document.getElementById('quick-add-lesson-btn');
        if (quickAddBtn) {
            quickAddBtn.style.display = 'inline-flex';
        }

        const addHwBtn = document.getElementById('add-hw-btn');
        if (addHwBtn) {
            addHwBtn.style.display = 'inline-flex';
        }

        const badge = document.getElementById('admin-badge-indicator');
        if (badge) badge.style.display = 'flex';

        const mobAdminBox = document.getElementById('mob-hub-admin-box');
        if (mobAdminBox) mobAdminBox.style.display = 'block';

        const mobNavAccountIcon = document.getElementById('mob-nav-account-icon');
        const mobNavAccountLabel = document.getElementById('mob-nav-account-label');
        if (mobNavAccountIcon) mobNavAccountIcon.innerText = '👑';
        if (mobNavAccountLabel) mobNavAccountLabel.innerText = 'Админ';

        if (window.app) {
            window.app.renderSchedule();
            window.app.renderHomework();
        }

        if (showCelebration && window.app) {
            window.app.showToast('Панель администратора активирована', '⚙️');
            if (window.soundEngine) window.soundEngine.playSuccess();
        }
    }

    // --- INLINE LIVE EDIT ---
    attachInlineEditHandlers() {
        document.querySelectorAll('.lesson-card .editable').forEach(el => {
            el.style.cursor = 'pointer';
            el.classList.add('live-editable-active');

            el.onclick = (e) => {
                e.stopPropagation();
                const card = el.closest('.lesson-card');
                const day = card.dataset.day;
                const index = parseInt(card.dataset.index, 10);
                const field = el.dataset.field; // subject or room

                const currentVal = window.app.schedule[day][index][field] || '';
                const newVal = prompt(`Изменить ${field === 'subject' ? 'название урока' : 'кабинет'}:`, currentVal);

                if (newVal !== null && newVal.trim() !== '') {
                    window.app.schedule[day][index][field] = newVal.trim();
                    window.app.saveState();
                    window.app.renderSchedule();
                    if (window.soundEngine) window.soundEngine.playSuccess();
                }
            };
        });
    }

    // --- TROLL PRESETS (Без учителей) ---
    applyPresetLunch() {
        const curDay = window.app.activeDay;
        const lessons = window.app.schedule[curDay] || [];
        lessons.forEach((l, i) => {
            l.subject = i === 0 ? 'Завтрак с Тако 🌮' : 'Большая перемена & Обед 🍕';
            l.room = 'Кафетерий';
            delete l.teacher;
        });
        window.app.saveState();
        window.app.renderSchedule();
        window.app.showAnnouncement('🌮 ВНИМАНИЕ: Все уроки заменены на Обед с Тако!');
        if (window.soundEngine) window.soundEngine.playTacoBell();
        if (window.effectsManager) window.effectsManager.confettiBurst();
    }

    applyPresetVacation() {
        const curDay = window.app.activeDay;
        window.app.schedule[curDay] = [];
        window.app.saveState();
        window.app.renderSchedule();
        window.app.showAnnouncement('🏖️ ПРИКАЗ АДМИНА: Сегодня объявлен официальный выходной и Каникулы!');
        if (window.soundEngine) window.soundEngine.playAirHorn();
        if (window.effectsManager) {
            window.effectsManager.toggleTacoRain(true);
            window.effectsManager.confettiBurst();
        }
    }

    applyPresetGym() {
        const curDay = window.app.activeDay;
        const count = 7;
        const list = [];
        for (let i = 0; i < count; i++) {
            list.push({
                id: `${curDay}_gym_${i}`,
                num: i + 1,
                time: window.app.getBellTime(curDay, i + 1),
                subject: 'Физкультура (Марафон 42 км) 🏃‍♂️',
                room: 'Стадион'
            });
        }
        window.app.schedule[curDay] = list;
        window.app.saveState();
        window.app.renderSchedule();
        window.app.showAnnouncement('💪 ДЕНЬ СПОРТА: 7 уроков физкультуры подряд!');
        if (window.soundEngine) window.soundEngine.playVineBoom();
    }

    applyPresetCybersport() {
        const curDay = window.app.activeDay;
        const games = ['CS 2 (Разминка на Mirage)', 'Dota 2 (Мид или фид)', 'Minecraft (Строительство школы)', 'Brawl Stars (Турнир 3v3)', 'Roblox', 'Кибер-Час с чаем'];
        window.app.schedule[curDay] = games.map((g, i) => ({
            id: `${curDay}_cyber_${i}`,
            num: i + 1,
            time: window.app.getBellTime(curDay, i + 1),
            subject: g,
            room: 'Компьютерный клуб 310'
        }));
        window.app.saveState();
        window.app.renderSchedule();
        window.app.showAnnouncement('🎮 УРОКИ ОТМЕНЕНЫ: Начался чемпионат школы по киберспорту!');
        if (window.soundEngine) window.soundEngine.playAirHorn();
        if (window.effectsManager) window.effectsManager.toggleDisco(true);
    }

    applyPresetSecretRooms() {
        const curDay = window.app.activeDay;
        const secretRooms = ['Бункер №77', 'Секретная Зона 51', 'Лунная База NASA', 'Башня Хогвартса', 'Кибер-лаборатория', 'Штаб Тако'];
        (window.app.schedule[curDay] || []).forEach((l, i) => {
            l.room = secretRooms[i % secretRooms.length];
            delete l.teacher;
        });
        window.app.saveState();
        window.app.renderSchedule();
        if (window.soundEngine) window.soundEngine.playVineBoom();
        window.app.showToast('Кабинеты заменены на секретные локации!', '🏰');
    }

    hackGrades() {
        if (window.soundEngine) window.soundEngine.playVineBoom();
        if (window.effectsManager) {
            window.effectsManager.screenShake();
            window.effectsManager.confettiBurst();
        }

        const overlay = document.createElement('div');
        overlay.className = 'matrix-hacked-overlay';
        overlay.innerHTML = `
            <div class="hacked-box">
                <h1 class="glitch-text" data-text="СИСТЕМА ВЗЛОМАНА">СИСТЕМА ВЗЛОМАНА</h1>
                <p>Все двойки и тройки удалены из базы школы!</p>
                <div class="big-grade">⭐ 5+ АБСОЛЮТ ⭐</div>
                <p>ДЗ автоматически засчитано как идеальное!</p>
                <button class="cool-btn" id="close-hack-btn">УРА! СПАСИБО АДМИНУ</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // Mark all homework completed
        window.app.homework.forEach(h => h.completed = true);
        window.app.saveState();
        window.app.renderHomework();

        document.getElementById('close-hack-btn').addEventListener('click', () => {
            overlay.remove();
        });
    }

    // --- DANCING TACO MASCOT ---
    setupTacoMascot() {
        const mascot = document.createElement('div');
        mascot.id = 'taco-mascot';
        mascot.className = 'floating-taco-mascot';
        mascot.title = 'Привет! Я Тако-помощник! Нажми на меня!';
        mascot.innerHTML = `
            <div class="taco-emoji">🌮</div>
            <div class="taco-speech-bubble" id="taco-bubble">Жми на меня!</div>
        `;
        document.body.appendChild(mascot);

        const phrases = [
            "Хрум! Тако вкуснее геометрии!",
            "Уроки? Лучше перекуси!",
            "DeepSeek уже решил всё ДЗ!",
            "Нажми Ctrl+Shift+A для Админки!",
            "Дон-дон-дон Taco Bell!",
            "Алиса, сделай за меня физику!",
            "Сегодня день чилла!"
        ];

        mascot.addEventListener('click', () => {
            if (window.soundEngine) {
                window.soundEngine.playMunch();
                window.soundEngine.playTacoBell();
            }
            if (window.effectsManager) {
                window.effectsManager.confettiBurst(window.innerWidth - 60, window.innerHeight - 60);
            }

            const bubble = document.getElementById('taco-bubble');
            const random = phrases[Math.floor(Math.random() * phrases.length)];
            bubble.innerText = random;
            bubble.classList.add('visible');

            setTimeout(() => {
                bubble.classList.remove('visible');
            }, 3500);
        });
    }
}

// Global instance
window.adminAbuse = new AdminAbuse();
