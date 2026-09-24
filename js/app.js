/**
 * Official School Bell Schedule Presets
 * Regular days: 40 min lessons
 * Wednesday: Lesson 1 is strictly 20 minutes (08:00 - 08:20)
 */
const BELL_TIMES = {
    regular: {
        1: '08:00 - 08:40',
        2: '08:55 - 09:35',
        3: '09:55 - 10:35',
        4: '10:55 - 11:35',
        5: '11:55 - 12:35',
        6: '12:50 - 13:30',
        7: '13:40 - 14:20',
        8: '14:30 - 15:10'
    },
    wednesday: {
        1: '08:00 - 08:20', // В среду всегда 1 урок 20 минут!
        2: '08:55 - 09:35',
        3: '09:55 - 10:35',
        4: '10:55 - 11:35',
        5: '11:55 - 12:35',
        6: '12:50 - 13:30',
        7: '13:40 - 14:20',
        8: '14:30 - 15:10'
    }
};
window.BELL_TIMES = BELL_TIMES;

const OFFICIAL_SCHOOL_SCHEDULE = {
    mon: [
        { id: 'mon_1', num: 1, time: '08:00 - 08:40', subject: 'Разговоры о важном (РоВ)', room: '34' },
        { id: 'mon_2', num: 2, time: '08:55 - 09:35', subject: 'История', room: '23' },
        { id: 'mon_3', num: 3, time: '09:55 - 10:35', subject: 'Русский язык', room: '36' },
        { id: 'mon_4', num: 4, time: '10:55 - 11:35', subject: 'Вероятность и статистика', room: '16' },
        { id: 'mon_5', num: 5, time: '11:55 - 12:35', subject: 'Алгебра', room: '16' },
        { id: 'mon_6', num: 6, time: '12:50 - 13:30', subject: 'Английский язык', room: '33, 39' },
        { id: 'mon_7', num: 7, time: '13:40 - 14:20', subject: 'Практикум по русскому языку', room: '36' }
    ],
    tue: [
        { id: 'tue_1', num: 1, time: '08:00 - 08:40', subject: 'Биология', room: '21' },
        { id: 'tue_2', num: 2, time: '08:55 - 09:35', subject: 'Русский язык', room: '36' },
        { id: 'tue_3', num: 3, time: '09:55 - 10:35', subject: 'Геометрия', room: '16' },
        { id: 'tue_4', num: 4, time: '10:55 - 11:35', subject: 'Физика', room: '32' },
        { id: 'tue_5', num: 5, time: '11:55 - 12:35', subject: 'Математический практикум', room: '16' },
        { id: 'tue_6', num: 6, time: '12:50 - 13:30', subject: 'Информатика / Английский', room: '34, 39' }
    ],
    wed: [
        { id: 'wed_1', num: 1, time: '08:00 - 08:20', subject: 'Классный час (20 мин)', room: '34' }, // Wednesday 1st lesson: strictly 20 min!
        { id: 'wed_2', num: 2, time: '08:55 - 09:35', subject: 'География', room: '25' },
        { id: 'wed_3', num: 3, time: '09:55 - 10:35', subject: 'Алгебра', room: '16' },
        { id: 'wed_4', num: 4, time: '10:55 - 11:35', subject: 'Биология', room: '21' },
        { id: 'wed_5', num: 5, time: '11:55 - 12:35', subject: 'Английский / Информатика', room: '33, 34' },
        { id: 'wed_6', num: 6, time: '12:50 - 13:30', subject: 'Химия', room: '21' },
        { id: 'wed_7', num: 7, time: '13:40 - 14:20', subject: 'Физкультура', room: 'Спортзал (Е)' },
        { id: 'wed_8', num: 8, time: '14:30 - 15:10', subject: 'История', room: '23' }
    ],
    thu: [
        { id: 'thu_1', num: 1, time: '08:00 - 08:40', subject: 'Физика', room: '32' },
        { id: 'thu_2', num: 2, time: '08:55 - 09:35', subject: 'География', room: '25' },
        { id: 'thu_3', num: 3, time: '09:55 - 10:35', subject: 'РМГ', room: '34' },
        { id: 'thu_4', num: 4, time: '10:55 - 11:35', subject: 'Геометрия', room: '16' },
        { id: 'thu_5', num: 5, time: '11:55 - 12:35', subject: 'Английский язык', room: '33, 39' },
        { id: 'thu_6', num: 6, time: '12:50 - 13:30', subject: 'Литература', room: '36' }
    ],
    fri: [
        { id: 'fri_3', num: 3, time: '09:55 - 10:35', subject: 'Алгебра', room: '16' },
        { id: 'fri_4', num: 4, time: '10:55 - 11:35', subject: 'Физкультура', room: 'Спортзал (Е)' },
        { id: 'fri_5', num: 5, time: '11:55 - 12:35', subject: 'Химия', room: '21' },
        { id: 'fri_6', num: 6, time: '12:50 - 13:30', subject: 'Труд (тех., маст.)', room: 'Мастерские' },
        { id: 'fri_7', num: 7, time: '13:40 - 14:20', subject: 'Русский язык', room: '36' }
    ],
    sat: []
};
window.OFFICIAL_SCHOOL_SCHEDULE = OFFICIAL_SCHOOL_SCHEDULE;
const DEFAULT_SCHEDULE = OFFICIAL_SCHOOL_SCHEDULE;

const DEFAULT_HOMEWORK = [
    {
        id: 'hw_1',
        subject: 'Алгебра',
        text: '§14, решить №14.3 (а, б), №14.7, повторить формулы сокращенного умножения',
        deadline: 'Завтра',
        urgent: true,
        completed: false,
        deepseekLink: 'https://chat.deepseek.com',
        aliceLink: '',
        gdzLink: 'https://gdz.ru',
        solution: {
            source: 'DeepSeek AI',
            text: '№14.3:\nа) x² - 9 = (x - 3)(x + 3)\nб) 4a² - 25 = (2a - 5)(2a + 5)\n\n№14.7:\n(x + 2)² - 4 = x² + 4x + 4 - 4 = x(x + 4)',
            link: 'https://chat.deepseek.com',
            deepseekLink: 'https://chat.deepseek.com',
            aliceLink: '',
            gdzLink: 'https://gdz.ru'
        },
        createdAt: Date.now() - 3600000 * 4
    },
    {
        id: 'hw_2',
        subject: 'Физика',
        text: 'Задачи 3.12-3.15 из задачника Перышкина. Подготовиться к лабораторной работе',
        deadline: 'Через 2 дня',
        urgent: false,
        completed: false,
        deepseekLink: '',
        aliceLink: 'https://a.ya.ru',
        gdzLink: 'https://gdz.ru',
        solution: {
            source: 'ГДЗ',
            text: 'Задача 3.12: F = m * g = 5 кг * 9.8 Н/кг = 49 Н.\nОтвет: Сила тяжести равна 49 Н.',
            link: 'https://gdz.ru',
            deepseekLink: '',
            aliceLink: 'https://a.ya.ru',
            gdzLink: 'https://gdz.ru'
        },
        createdAt: Date.now() - 3600000 * 8
    },
    {
        id: 'hw_3',
        subject: 'Русский язык',
        text: 'Упражнение 189 (вставить пропущенные буквы и знаки препинания), выучить правило на стр. 94',
        deadline: 'Завтра',
        urgent: true,
        completed: true,
        deepseekLink: '',
        aliceLink: '',
        gdzLink: '',
        createdAt: Date.now() - 3600000 * 12
    },
    {
        id: 'hw_4',
        subject: 'История',
        text: 'Прочитать §21, ответить на вопросы 1-4 устно, подготовить доклад про Реформы',
        deadline: 'Пятница',
        urgent: false,
        completed: false,
        deepseekLink: '',
        aliceLink: '',
        gdzLink: '',
        createdAt: Date.now() - 3600000 * 20
    }
];

class AppManager {
    constructor() {
        this.schedule = {};
        this.homework = [];
        this.activeDay = 'mon';
        this.hwFilter = 'all';
        this.bannerAnnouncement = '';
        this.chatTimer = null;

        // Cloud Firestore Synchronization
        this.db = null;
        this.cloudStatus = 'connecting';
        this.lastChatTimestamp = 0;
        this.cloudSyncDebounceTimer = null;
        this.hasLoadedCloudOnce = false;

        this.dayNames = {
            mon: 'Понедельник',
            tue: 'Вторник',
            wed: 'Среда',
            thu: 'Четверг',
            fri: 'Пятница',
            sat: 'Суббота'
        };

        this.init();
    }

    isUserAdmin() {
        return (window.authManager && window.authManager.isAdmin) || 
               (window.adminAbuse && window.adminAbuse.isAuthenticated);
    }

    init() {
        this.loadState();
        this.detectCurrentDay();
        this.renderSchedule();
        this.renderHomework();
        this.bindUI();
        this.updateStats();
        this.checkUrlImport();
        this.checkActiveAdminChat();
        this.setupCrossTabChatSync();
        this.initFirestore();
        this.setupMobileBottomNav();
        this.setupMobileSwipeGestures();
    }

    // --- CLOUD FIRESTORE REAL-TIME SYNCHRONIZATION ---
    initFirestore() {
        if (!window.firebase || !window.firebase.firestore || !window.isFirebaseConfigured || !window.isFirebaseConfigured()) {
            this.updateCloudStatus('offline', 'Облако: Не настроено');
            return;
        }

        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(window.FIREBASE_CONFIG);
            }
            this.db = firebase.firestore();

            // Enable multi-tab persistence if supported
            try {
                this.db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
            } catch (e) {}

            this.updateCloudStatus('syncing', 'Облако: Подключение...');
            this.setupFirestoreListeners();
        } catch (err) {
            console.error('Firestore init error:', err);
            this.handleFirestoreError(err);
        }
    }

    setupFirestoreListeners() {
        if (!this.db) return;

        // 1. Real-time Schedule Snapshot
        this.db.collection('curie_data').doc('schedule').onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data && data.schedule && typeof data.schedule === 'object') {
                    this.schedule = data.schedule;
                    try {
                        localStorage.setItem('curie_schedule', JSON.stringify(this.schedule));
                    } catch (e) {}
                    this.renderSchedule();
                    this.updateCloudStatus('online', '🟢 Облако: Синхронизировано');
                    this.hasLoadedCloudOnce = true;
                }
            } else {
                // If doc doesn't exist yet and user is admin, seed current schedule
                if (this.isUserAdmin()) {
                    this.syncScheduleToFirestore(false);
                }
                this.updateCloudStatus('online', '🟢 Облако: Подключено');
            }
        }, (err) => {
            this.handleFirestoreError(err);
        });

        // 2. Real-time Homework Snapshot
        this.db.collection('curie_data').doc('homework').onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data && Array.isArray(data.homework)) {
                    this.homework = data.homework;
                    try {
                        localStorage.setItem('curie_homework', JSON.stringify(this.homework));
                    } catch (e) {}
                    this.renderHomework();
                    this.updateStats();
                    this.updateCloudStatus('online', '🟢 Облако: Синхронизировано');
                }
            } else {
                if (this.isUserAdmin()) {
                    this.syncHomeworkToFirestore(false);
                }
            }
        }, (err) => {
            this.handleFirestoreError(err);
        });

        // 3. Real-time Admin Chat Popup Broadcast
        this.db.collection('curie_data').doc('chat').onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data && data.text && data.timestamp) {
                    const elapsed = Date.now() - data.timestamp;
                    const duration = data.duration || 25000;
                    const remaining = duration - elapsed;
                    if (remaining > 1500 && data.timestamp !== this.lastChatTimestamp) {
                        this.lastChatTimestamp = data.timestamp;
                        this.showAdminChatMessage(data.text, data.author || 'Админ', data.avatar, remaining, false);
                    }
                }
            }
        }, (err) => {
            console.warn('Firestore chat listener notice:', err);
        });
    }

    updateCloudStatus(status, text) {
        this.cloudStatus = status;
        const dot = document.getElementById('cloud-status-dot');
        const txt = document.getElementById('cloud-status-text');
        const adminIndicator = document.getElementById('admin-cloud-indicator');
        const modalIcon = document.getElementById('cloud-modal-status-icon');
        const modalTitle = document.getElementById('cloud-modal-status-title');
        const modalDesc = document.getElementById('cloud-modal-status-desc');
        const setupInstructions = document.getElementById('cloud-setup-instructions');

        if (dot) {
            dot.className = 'cloud-status-dot';
            if (status === 'online') dot.classList.add('status-online');
            else if (status === 'syncing') dot.classList.add('status-syncing');
            else dot.classList.add('status-offline');
        }

        if (txt) {
            txt.innerText = text;
        }

        if (adminIndicator) {
            if (status === 'online') {
                adminIndicator.innerText = '🟢 Онлайн';
                adminIndicator.style.color = '#22c55e';
                adminIndicator.style.background = 'rgba(34, 197, 94, 0.15)';
                adminIndicator.style.borderColor = 'rgba(34, 197, 94, 0.3)';
            } else if (status === 'syncing') {
                adminIndicator.innerText = '🟡 Синхронизация...';
                adminIndicator.style.color = '#eab308';
                adminIndicator.style.background = 'rgba(234, 179, 8, 0.15)';
                adminIndicator.style.borderColor = 'rgba(234, 179, 8, 0.3)';
            } else {
                adminIndicator.innerText = '🔴 Не подключено';
                adminIndicator.style.color = '#ef4444';
                adminIndicator.style.background = 'rgba(239, 68, 68, 0.15)';
                adminIndicator.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }
        }

        if (modalIcon && modalTitle && modalDesc) {
            if (status === 'online') {
                modalIcon.innerText = '🟢';
                modalTitle.innerText = 'Облако синхронизировано (raspisanie-3a39d)';
                modalDesc.innerText = 'Все изменения расписания и ДЗ мгновенно транслируются на устройства всех учеников в реальном времени.';
                if (setupInstructions) setupInstructions.style.display = 'none';
            } else if (status === 'syncing') {
                modalIcon.innerText = '🟡';
                modalTitle.innerText = 'Подключение к облаку...';
                modalDesc.innerText = 'Устанавливается соединение с Firestore сервером...';
            } else {
                modalIcon.innerText = '🔴';
                modalTitle.innerText = 'База данных не найдена или требует создания';
                modalDesc.innerText = 'В Firebase Console проекта raspisanie-3a39d требуется нажать «Создать базу данных». См. инструкцию ниже:';
                if (setupInstructions) setupInstructions.style.display = 'block';
            }
        }
    }

    handleFirestoreError(err) {
        console.warn('Firestore notice:', err);
        const msg = (err && err.message) || String(err);
        const code = (err && err.code) || '';

        if (code === 'permission-denied') {
            this.updateCloudStatus('error', '🔒 Доступ ограничен');
            const setupInstructions = document.getElementById('cloud-setup-instructions');
            if (setupInstructions) setupInstructions.style.display = 'block';
        } else if (code === 'not-found' || code === 'failed-precondition' || msg.includes('does not exist') || msg.includes('404')) {
            this.updateCloudStatus('error', '🔴 Облако: Создайте базу (Клик)');
            const setupInstructions = document.getElementById('cloud-setup-instructions');
            if (setupInstructions) setupInstructions.style.display = 'block';
        } else {
            this.updateCloudStatus('offline', '🔴 Автономный режим');
        }
    }

    syncScheduleToFirestore(forceToast = false) {
        if (!this.db || !this.isUserAdmin()) return;

        this.updateCloudStatus('syncing', '🟡 Синхронизация...');
        const userEmail = (window.authManager && window.authManager.currentUser && window.authManager.currentUser.email) || 'admin';

        this.db.collection('curie_data').doc('schedule').set({
            schedule: this.schedule,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: userEmail
        }).then(() => {
            this.updateCloudStatus('online', '🟢 Облако: Синхронизировано');
            if (forceToast) {
                this.showToast('Расписание успешно загружено в облако! Все ученики его видят 🚀', '☁️');
                if (window.soundEngine) window.soundEngine.playSuccess();
            }
        }).catch((err) => {
            this.handleFirestoreError(err);
            if (forceToast) {
                this.showToast('Ошибка сохранения в облако. Проверьте Firestore в консоли!', '⚠️');
                this.openCloudModal();
            }
        });
    }

    syncHomeworkToFirestore(forceToast = false) {
        if (!this.db || !this.isUserAdmin()) return;

        this.updateCloudStatus('syncing', '🟡 Синхронизация...');
        const userEmail = (window.authManager && window.authManager.currentUser && window.authManager.currentUser.email) || 'admin';

        this.db.collection('curie_data').doc('homework').set({
            homework: this.homework,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: userEmail
        }).then(() => {
            this.updateCloudStatus('online', '🟢 Облако: Синхронизировано');
            if (forceToast) {
                this.showToast('Домашнее задание загружено в облако! 🚀', '☁️');
                if (window.soundEngine) window.soundEngine.playSuccess();
            }
        }).catch((err) => {
            this.handleFirestoreError(err);
            if (forceToast) {
                this.showToast('Ошибка сохранения ДЗ в облако.', '⚠️');
                this.openCloudModal();
            }
        });
    }

    syncAllToFirestore(forceToast = false) {
        if (!this.db) {
            this.showToast('Firebase не инициализирован. Нажмите на статус облака для справки.', '⚠️');
            this.openCloudModal();
            return;
        }
        if (!this.isUserAdmin()) {
            this.showToast('Только администратор может отправлять изменения в облако!', '🔒');
            return;
        }

        this.updateCloudStatus('syncing', '🟡 Синхронизация...');
        const userEmail = (window.authManager && window.authManager.currentUser && window.authManager.currentUser.email) || 'admin';

        const p1 = this.db.collection('curie_data').doc('schedule').set({
            schedule: this.schedule,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: userEmail
        });

        const p2 = this.db.collection('curie_data').doc('homework').set({
            homework: this.homework,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: userEmail
        });

        Promise.all([p1, p2]).then(() => {
            this.updateCloudStatus('online', '🟢 Облако: Синхронизировано');
            if (forceToast) {
                this.showToast('Все данные (расписание и ДЗ) синхронизированы в облаке! 🎉', '☁️');
                if (window.soundEngine) window.soundEngine.playSuccess();
                if (window.effectsManager) window.effectsManager.confettiBurst();
            }
        }).catch((err) => {
            this.handleFirestoreError(err);
            if (forceToast) {
                this.showToast('Не удалось отправить в облако. Проверьте консоль Firebase.', '⚠️');
                this.openCloudModal();
            }
        });
    }

    pullFromFirestore(forceToast = false) {
        if (!this.db) {
            this.showToast('Firebase не подключен.', '⚠️');
            return;
        }

        this.updateCloudStatus('syncing', '🟡 Загрузка из облака...');

        const p1 = this.db.collection('curie_data').doc('schedule').get();
        const p2 = this.db.collection('curie_data').doc('homework').get();

        Promise.all([p1, p2]).then(([schedDoc, hwDoc]) => {
            let updated = false;
            if (schedDoc.exists && schedDoc.data().schedule) {
                this.schedule = schedDoc.data().schedule;
                localStorage.setItem('curie_schedule', JSON.stringify(this.schedule));
                this.renderSchedule();
                updated = true;
            }
            if (hwDoc.exists && Array.isArray(hwDoc.data().homework)) {
                this.homework = hwDoc.data().homework;
                localStorage.setItem('curie_homework', JSON.stringify(this.homework));
                this.renderHomework();
                this.updateStats();
                updated = true;
            }

            this.updateCloudStatus('online', '🟢 Облако: Синхронизировано');
            if (forceToast) {
                this.showToast(updated ? 'Данные успешно обновлены из облака!' : 'В облаке пока нет сохраненных данных.', '📥');
                if (window.soundEngine) window.soundEngine.playSuccess();
            }
        }).catch((err) => {
            this.handleFirestoreError(err);
            if (forceToast) {
                this.showToast('Ошибка загрузки данных из облака.', '⚠️');
                this.openCloudModal();
            }
        });
    }

    openCloudModal() {
        const modal = document.getElementById('cloud-modal');
        if (modal) modal.classList.add('active');
    }

    closeCloudModal() {
        const modal = document.getElementById('cloud-modal');
        if (modal) modal.classList.remove('active');
    }

    loadState() {
        try {
            // Auto-migration to official school schedule from photo
            const schedVer = localStorage.getItem('curie_schedule_version');
            if (schedVer !== 'v4_cards_official') {
                this.schedule = JSON.parse(JSON.stringify(OFFICIAL_SCHOOL_SCHEDULE));
                localStorage.setItem('curie_schedule_version', 'v4_cards_official');
                try {
                    localStorage.setItem('curie_schedule', JSON.stringify(this.schedule));
                } catch (e) {}
            } else {
                const savedSchedule = localStorage.getItem('curie_schedule');
                this.schedule = savedSchedule ? JSON.parse(savedSchedule) : JSON.parse(JSON.stringify(OFFICIAL_SCHOOL_SCHEDULE));
            }

            // Clean out any teacher references from stored schedule
            if (this.schedule) {
                Object.keys(this.schedule).forEach(day => {
                    if (Array.isArray(this.schedule[day])) {
                        this.schedule[day].forEach(l => {
                            delete l.teacher;
                        });
                    }
                });
            }

            // If stored schedule has 0 lessons, populate with OFFICIAL_SCHOOL_SCHEDULE
            const totalLessons = Object.values(this.schedule || {}).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
            if (totalLessons === 0) {
                this.schedule = JSON.parse(JSON.stringify(OFFICIAL_SCHOOL_SCHEDULE));
            }

            // Ensure Wednesday lesson 1 adheres to the 20-minute rule (08:00 - 08:20)
            if (this.schedule && Array.isArray(this.schedule.wed) && this.schedule.wed.length > 0) {
                if (this.schedule.wed[0].time === '08:30 - 09:15' || this.schedule.wed[0].time === '08:00 - 08:40') {
                    this.schedule.wed[0].time = '08:00 - 08:20';
                }
            }

            const savedHw = localStorage.getItem('curie_homework');
            this.homework = savedHw ? JSON.parse(savedHw) : JSON.parse(JSON.stringify(DEFAULT_HOMEWORK));

            // Migration / ensure link properties exist
            if (Array.isArray(this.homework)) {
                this.homework.forEach(hw => {
                    hw.deepseekLink = hw.deepseekLink || (hw.solution && hw.solution.deepseekLink) || '';
                    hw.aliceLink = hw.aliceLink || (hw.solution && hw.solution.aliceLink) || '';
                    hw.gdzLink = hw.gdzLink || (hw.solution && hw.solution.gdzLink) || '';
                });
            }

            const savedBanner = localStorage.getItem('curie_banner');
            this.bannerAnnouncement = savedBanner || '';
            if (this.bannerAnnouncement) {
                this.showAnnouncement(this.bannerAnnouncement, false);
            }
        } catch (e) {
            console.error('Error loading localStorage:', e);
            this.schedule = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
            this.homework = JSON.parse(JSON.stringify(DEFAULT_HOMEWORK));
        }
    }

    saveState() {
        try {
            localStorage.setItem('curie_schedule', JSON.stringify(this.schedule));
            localStorage.setItem('curie_homework', JSON.stringify(this.homework));
            if (this.bannerAnnouncement) {
                localStorage.setItem('curie_banner', this.bannerAnnouncement);
            } else {
                localStorage.removeItem('curie_banner');
            }
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }

        // Auto Sync with Firestore for Admin
        if (this.db && this.isUserAdmin()) {
            if (this.cloudSyncDebounceTimer) clearTimeout(this.cloudSyncDebounceTimer);
            this.cloudSyncDebounceTimer = setTimeout(() => {
                this.syncScheduleToFirestore(false);
                this.syncHomeworkToFirestore(false);
            }, 300);
        }
    }

    detectCurrentDay() {
        const jsDay = new Date().getDay(); // 0 is Sun, 1 is Mon...
        const map = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat', 0: 'mon' };
        this.activeDay = map[jsDay] || 'mon';
    }

    bindUI() {
        // Day selector tabs
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const day = btn.dataset.day;
                this.setActiveDay(day);
            });
        });

        // Add Homework button and form
        const addHwBtn = document.getElementById('add-hw-btn');
        const hwModal = document.getElementById('hw-modal');
        const closeHwModal = document.getElementById('close-hw-modal');
        const hwForm = document.getElementById('hw-form');

        if (addHwBtn && hwModal) {
            addHwBtn.addEventListener('click', () => {
                if (!this.isUserAdmin()) {
                    this.showToast('Только администратор может добавлять домашнее задание!', '🔒');
                    return;
                }
                this.openAddHomeworkModal();
            });
        }
        if (closeHwModal && hwModal) {
            closeHwModal.addEventListener('click', () => {
                hwModal.classList.remove('active');
            });
        }
        if (hwModal) {
            hwModal.addEventListener('click', (e) => {
                if (e.target === hwModal) hwModal.classList.remove('active');
            });
        }

        if (hwForm) {
            hwForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!this.isUserAdmin()) {
                    this.showToast('Только администратор может сохранять задания!', '🔒');
                    return;
                }
                const editId = (document.getElementById('hw-edit-id')?.value || '').trim();
                const subject = document.getElementById('hw-subject-input').value.trim();
                const text = document.getElementById('hw-text-input').value.trim();
                const deadline = document.getElementById('hw-deadline-input').value.trim() || 'Скоро';
                const urgent = document.getElementById('hw-urgent-input').checked;
                const deepseekLink = (document.getElementById('hw-deepseek-link')?.value || '').trim();
                const aliceLink = (document.getElementById('hw-alice-link')?.value || '').trim();
                const gdzLink = (document.getElementById('hw-gdz-link')?.value || '').trim();

                if (!subject || !text) return;

                if (editId) {
                    const existing = this.homework.find(h => h.id === editId);
                    if (existing) {
                        existing.subject = subject;
                        existing.text = text;
                        existing.deadline = deadline;
                        existing.urgent = urgent;
                        existing.deepseekLink = deepseekLink;
                        existing.aliceLink = aliceLink;
                        existing.gdzLink = gdzLink;
                        if (existing.solution) {
                            if (deepseekLink) existing.solution.deepseekLink = deepseekLink;
                            if (aliceLink) existing.solution.aliceLink = aliceLink;
                            if (gdzLink) existing.solution.gdzLink = gdzLink;
                        } else if (deepseekLink || aliceLink || gdzLink) {
                            existing.solution = {
                                source: deepseekLink ? 'DeepSeek AI' : (aliceLink ? 'Яндекс Алиса' : 'ГДЗ'),
                                text: 'Готовые решения и материалы прикреплены по ссылкам выше.',
                                link: deepseekLink || aliceLink || gdzLink,
                                deepseekLink,
                                aliceLink,
                                gdzLink
                            };
                        }
                        this.saveState();
                        this.renderHomework();
                        this.showToast(`Задание "${subject}" обновлено!`, '✏️');
                    }
                } else {
                    const newItem = {
                        id: 'hw_' + Date.now(),
                        subject,
                        text,
                        deadline,
                        urgent,
                        completed: false,
                        deepseekLink,
                        aliceLink,
                        gdzLink,
                        createdAt: Date.now()
                    };

                    if (deepseekLink || aliceLink || gdzLink) {
                        newItem.solution = {
                            source: deepseekLink ? 'DeepSeek AI' : (aliceLink ? 'Яндекс Алиса' : 'ГДЗ'),
                            text: 'Готовые решения и материалы прикреплены по ссылкам выше.',
                            link: deepseekLink || aliceLink || gdzLink,
                            deepseekLink,
                            aliceLink,
                            gdzLink
                        };
                    }

                    this.addHomework(newItem);
                    this.showToast(`Задание "${subject}" добавлено!`, '📝');
                }

                hwForm.reset();
                const editIdInput = document.getElementById('hw-edit-id');
                if (editIdInput) editIdInput.value = '';
                hwModal.classList.remove('active');
                if (window.effectsManager) window.effectsManager.confettiBurst();
                if (window.soundEngine) window.soundEngine.playSuccess();
            });
        }

        // Homework filter tabs
        document.querySelectorAll('.hw-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.hw-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.hwFilter = btn.dataset.filter;
                this.renderHomework();
            });
        });

        // Export / Import
        const exportBtn = document.getElementById('export-json-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        const importInput = document.getElementById('import-file-input');
        if (importInput) {
            importInput.addEventListener('change', (e) => this.importData(e));
        }

        const shareBtn = document.getElementById('share-link-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.generateShareLink());
        }

        const soundToggleBtn = document.getElementById('toggle-sound-btn');
        if (soundToggleBtn) {
            soundToggleBtn.addEventListener('click', () => {
                if (!window.soundEngine) return;
                const isMuted = window.soundEngine.toggleMute();
                soundToggleBtn.innerHTML = isMuted ? '🔇 Без звука' : '🔊 Звук';
                this.showToast(isMuted ? 'Звук отключен' : 'Звук включен', isMuted ? '🔇' : '🔊');
            });
        }

        // Reset Schedule button
        const resetBtn = document.getElementById('reset-data-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Сбросить расписание и ДЗ до стандартных настроек?')) {
                    this.schedule = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
                    this.homework = JSON.parse(JSON.stringify(DEFAULT_HOMEWORK));
                    this.bannerAnnouncement = '';
                    this.saveState();
                    this.renderSchedule();
                    this.renderHomework();
                    this.updateStats();
                    this.hideAnnouncement();
                    alert('Данные успешно сброшены!');
                }
            });
        }

        // Add Lesson buttons
        const addLessonBtn = document.getElementById('add-lesson-btn');
        const quickAddBtn = document.getElementById('quick-add-lesson-btn');
        const lessonModal = document.getElementById('lesson-modal');
        const closeLessonModal = document.getElementById('close-lesson-modal');
        const lessonForm = document.getElementById('lesson-form');

        if (addLessonBtn) {
            addLessonBtn.addEventListener('click', () => {
                this.openAddLessonModal(this.activeDay);
            });
        }
        if (quickAddBtn) {
            quickAddBtn.addEventListener('click', () => {
                this.openAddLessonModal(this.activeDay);
            });
        }
        if (closeLessonModal && lessonModal) {
            closeLessonModal.addEventListener('click', () => lessonModal.classList.remove('active'));
        }
        if (lessonModal) {
            lessonModal.addEventListener('click', (e) => {
                if (e.target === lessonModal) lessonModal.classList.remove('active');
            });
        }
        if (lessonForm) {
            lessonForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const daySelect = document.getElementById('lesson-day-select');
                const targetDay = daySelect ? daySelect.value : this.activeDay;

                const subject = document.getElementById('lesson-subject-input').value.trim();
                const time = document.getElementById('lesson-time-input').value.trim() || '08:30 - 09:15';
                const room = document.getElementById('lesson-room-input').value.trim() || '—';
                const editIndexInput = document.getElementById('lesson-edit-index');
                const editIndex = editIndexInput ? parseInt(editIndexInput.value, 10) : -1;

                if (!subject) return;

                if (editIndex >= 0 && this.schedule[targetDay] && this.schedule[targetDay][editIndex]) {
                    // Update existing lesson
                    this.schedule[targetDay][editIndex].subject = subject;
                    this.schedule[targetDay][editIndex].time = time;
                    this.schedule[targetDay][editIndex].room = room;
                    this.saveState();
                    this.renderSchedule();
                    this.showToast(`Урок «${subject}» обновлен!`, '✏️');
                    if (window.soundEngine) window.soundEngine.playSuccess();
                } else {
                    // Add new lesson
                    const curLessons = this.schedule[targetDay] || [];
                    const newNum = curLessons.length + 1;
                    this.addLesson(targetDay, {
                        id: `${targetDay}_${Date.now()}`,
                        num: newNum,
                        time,
                        subject,
                        room
                    });
                }

                // Switch to that day to view the updated lesson
                this.setActiveDay(targetDay);

                lessonForm.reset();
                if (editIndexInput) editIndexInput.value = '-1';
                lessonModal.classList.remove('active');
            });
        }

        // Answer Modal Handling
        const answerModal = document.getElementById('answer-modal');
        const closeAnswerModal = document.getElementById('close-answer-modal');
        const answerForm = document.getElementById('answer-form');

        if (closeAnswerModal && answerModal) {
            closeAnswerModal.addEventListener('click', () => answerModal.classList.remove('active'));
        }
        if (answerModal) {
            answerModal.addEventListener('click', (e) => {
                if (e.target === answerModal) answerModal.classList.remove('active');
            });
        }
        if (answerForm) {
            answerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!this.isUserAdmin()) {
                    this.showToast('Только администратор может публиковать решения!', '🔒');
                    return;
                }
                const hwId = document.getElementById('answer-hw-id').value;
                const source = document.getElementById('answer-source-select').value;
                let text = document.getElementById('answer-text-input').value.trim();
                const deepseekLink = (document.getElementById('answer-deepseek-link')?.value || '').trim();
                const aliceLink = (document.getElementById('answer-alice-link')?.value || '').trim();
                const gdzLink = (document.getElementById('answer-gdz-link')?.value || '').trim();
                const link = (document.getElementById('answer-link-input')?.value || '').trim();

                if (!hwId) return;

                if (!text && !deepseekLink && !aliceLink && !gdzLink && !link) {
                    this.showToast('Укажите текст решения или ссылку на чат / ГДЗ!', '⚠️');
                    return;
                }

                if (!text) {
                    text = 'Готовые материалы и решения прикреплены ссылками выше.';
                }

                this.attachSolution(hwId, {
                    source,
                    text,
                    deepseekLink,
                    aliceLink,
                    gdzLink,
                    link
                });
                answerForm.reset();
                answerModal.classList.remove('active');
            });
        }

        // Close Admin Chat Popup button
        const closeChatBtn = document.getElementById('close-chat-popup');
        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', () => this.hideAdminChatMessage(true));
        }

        // Lesson Number / Bell Presets in Add/Edit Lesson modal
        document.querySelectorAll('.preset-num-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const num = parseInt(btn.dataset.num, 10);
                const daySelect = document.getElementById('lesson-day-select');
                const day = daySelect ? daySelect.value : this.activeDay;
                this.selectLessonPresetNum(num, day, true);
            });
        });

        const lessonDaySelect = document.getElementById('lesson-day-select');
        if (lessonDaySelect) {
            lessonDaySelect.addEventListener('change', () => {
                const activeBtn = document.querySelector('.preset-num-btn.active');
                const num = activeBtn ? parseInt(activeBtn.dataset.num, 10) : 1;
                this.selectLessonPresetNum(num, lessonDaySelect.value, true);
            });
        }

        // Quick Subject chips
        document.querySelectorAll('.subject-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const subjInput = document.getElementById('lesson-subject-input');
                if (subjInput) {
                    subjInput.value = chip.dataset.subj;
                    subjInput.focus();
                }
            });
        });

        // Bells Table Modal (Расписание звонков)
        const openBellsBtn = document.getElementById('open-bells-modal-btn');
        const bellsModal = document.getElementById('bells-modal');
        const closeBellsBtn = document.getElementById('close-bells-modal');

        if (openBellsBtn && bellsModal) {
            openBellsBtn.addEventListener('click', () => {
                bellsModal.classList.add('active');
                if (window.soundEngine) window.soundEngine.playTacoBell();
            });
        }
        if (closeBellsBtn && bellsModal) {
            closeBellsBtn.addEventListener('click', () => {
                bellsModal.classList.remove('active');
            });
        }
        if (bellsModal) {
            bellsModal.addEventListener('click', (e) => {
                if (e.target === bellsModal) bellsModal.classList.remove('active');
            });
        }

        // Admin Bell Presets
        const applyBellsBtn = document.getElementById('admin-apply-bells-btn');
        if (applyBellsBtn) {
            applyBellsBtn.addEventListener('click', () => this.applyBellSchedule());
        }

        const fillFullSchedBtn = document.getElementById('admin-fill-full-schedule-btn');
        if (fillFullSchedBtn) {
            fillFullSchedBtn.addEventListener('click', () => this.fillFullStandardSchedule());
        }

        const fillDaySlotsBtn = document.getElementById('admin-fill-day-slots-btn');
        if (fillDaySlotsBtn) {
            fillDaySlotsBtn.addEventListener('click', () => this.fillDaySlots());
        }

        // Cloud Real-time Sync UI & Modal
        const cloudBtn = document.getElementById('cloud-sync-btn');
        const cloudModal = document.getElementById('cloud-modal');
        const closeCloudBtn = document.getElementById('close-cloud-modal');
        const cloudSyncBtn = document.getElementById('cloud-modal-sync-btn');
        const cloudPullBtn = document.getElementById('cloud-modal-pull-btn');
        const copyRulesBtn = document.getElementById('copy-firestore-rules-btn');
        const adminPushCloudBtn = document.getElementById('admin-force-push-cloud-btn');
        const adminPullCloudBtn = document.getElementById('admin-force-pull-cloud-btn');

        if (cloudBtn) {
            cloudBtn.addEventListener('click', () => {
                this.openCloudModal();
                if (window.soundEngine) window.soundEngine.playLaser();
            });
        }
        if (closeCloudBtn) {
            closeCloudBtn.addEventListener('click', () => this.closeCloudModal());
        }
        if (cloudModal) {
            cloudModal.addEventListener('click', (e) => {
                if (e.target === cloudModal) this.closeCloudModal();
            });
        }
        if (cloudSyncBtn) {
            cloudSyncBtn.addEventListener('click', () => this.syncAllToFirestore(true));
        }
        if (cloudPullBtn) {
            cloudPullBtn.addEventListener('click', () => this.pullFromFirestore(true));
        }
        if (adminPushCloudBtn) {
            adminPushCloudBtn.addEventListener('click', () => this.syncAllToFirestore(true));
        }
        if (adminPullCloudBtn) {
            adminPullCloudBtn.addEventListener('click', () => this.pullFromFirestore(true));
        }
        if (copyRulesBtn) {
            copyRulesBtn.addEventListener('click', () => {
                const rulesEl = document.getElementById('firestore-rules-snippet');
                const rulesText = rulesEl ? rulesEl.innerText : '';
                if (rulesText) {
                    this.copyText(rulesText).then(() => {
                        this.showToast('Правила Firestore скопированы! Вставьте их в Firebase Console -> Rules', '📋');
                        if (window.soundEngine) window.soundEngine.playSuccess();
                    });
                }
            });
        }

        // Official School Schedule Preset Button
        const officialSchedBtn = document.getElementById('admin-fill-official-schedule-btn');
        if (officialSchedBtn) {
            officialSchedBtn.addEventListener('click', () => this.fillOfficialSchoolSchedule());
        }

        // Smart Text Schedule Importer Modal
        const openSmartImportBtn = document.getElementById('admin-open-smart-import-btn');
        const smartModal = document.getElementById('smart-schedule-modal');
        const closeSmartBtn = document.getElementById('close-smart-schedule-modal');
        const smartTextarea = document.getElementById('smart-schedule-textarea');
        const smartSampleBtn = document.getElementById('smart-schedule-sample-btn');
        const smartParseBtn = document.getElementById('smart-schedule-parse-btn');

        if (openSmartImportBtn && smartModal) {
            openSmartImportBtn.addEventListener('click', () => {
                smartModal.classList.add('active');
                if (smartTextarea && !smartTextarea.value.trim()) {
                    smartTextarea.value = this.getOfficialScheduleSampleText();
                }
            });
        }
        if (closeSmartBtn && smartModal) {
            closeSmartBtn.addEventListener('click', () => smartModal.classList.remove('active'));
        }
        if (smartModal) {
            smartModal.addEventListener('click', (e) => {
                if (e.target === smartModal) smartModal.classList.remove('active');
            });
        }
        if (smartSampleBtn && smartTextarea) {
            smartSampleBtn.addEventListener('click', () => {
                smartTextarea.value = this.getOfficialScheduleSampleText();
                this.showToast('Данные с фото вставлены в поле!', '📋');
            });
        }
        if (smartParseBtn && smartTextarea) {
            smartParseBtn.addEventListener('click', () => {
                const ok = this.parseSmartScheduleText(smartTextarea.value);
                if (ok && smartModal) {
                    smartModal.classList.remove('active');
                }
            });
        }

        // Quick bell check timer every minute
        setInterval(() => this.updateCurrentLessonHighlight(), 60000);
    }

    setupMobileBottomNav() {
        const navSchedule = document.getElementById('mob-nav-schedule');
        const navHomework = document.getElementById('mob-nav-homework');
        const navBells = document.getElementById('mob-nav-bells');
        const navCloud = document.getElementById('mob-nav-cloud');
        const navAdmin = document.getElementById('mob-nav-admin');
        const navAuth = document.getElementById('mob-nav-auth');

        const setNavActive = (activeEl) => {
            document.querySelectorAll('.mobile-nav-item').forEach(el => el.classList.remove('active'));
            if (activeEl) activeEl.classList.add('active');
        };

        if (navSchedule) {
            navSchedule.addEventListener('click', () => {
                setNavActive(navSchedule);
                const schedEl = document.getElementById('schedule-section');
                if (schedEl) {
                    schedEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        if (navHomework) {
            navHomework.addEventListener('click', () => {
                setNavActive(navHomework);
                const hwEl = document.getElementById('homework-section');
                if (hwEl) {
                    hwEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        if (navBells) {
            navBells.addEventListener('click', () => {
                const bellsModal = document.getElementById('bells-modal');
                if (bellsModal) {
                    bellsModal.classList.add('active');
                    if (window.soundEngine) window.soundEngine.playTacoBell();
                }
            });
        }

        if (navCloud) {
            navCloud.addEventListener('click', () => {
                this.openCloudModal();
                if (window.soundEngine) window.soundEngine.playLaser();
            });
        }

        if (navAdmin) {
            navAdmin.addEventListener('click', () => {
                if (window.adminAbuse) {
                    window.adminAbuse.openModal();
                }
            });
        }

        if (navAuth) {
            navAuth.addEventListener('click', () => {
                if (window.authManager && window.authManager.currentUser) {
                    this.showToast(`Вы вошли как: ${window.authManager.currentUser.email}`, '👤');
                } else {
                    const authModal = document.getElementById('auth-modal');
                    if (authModal) authModal.classList.add('active');
                }
            });
        }
    }

    setupMobileSwipeGestures() {
        const scheduleSection = document.getElementById('schedule-section');
        if (!scheduleSection) return;

        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

        scheduleSection.addEventListener('touchstart', (e) => {
            if (!e.changedTouches || !e.changedTouches.length) return;
            startX = e.changedTouches[0].clientX;
            startY = e.changedTouches[0].clientY;
        }, { passive: true });

        scheduleSection.addEventListener('touchend', (e) => {
            if (!e.changedTouches || !e.changedTouches.length) return;
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;

            const diffX = endX - startX;
            const diffY = endY - startY;

            // Horizontal swipe of at least 45px, predominantly horizontal
            if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
                const curIdx = days.indexOf(this.activeDay);
                if (diffX < 0) {
                    // Swipe Left -> Next Day
                    const nextDay = days[(curIdx + 1) % days.length];
                    this.setActiveDay(nextDay);
                    if (window.soundEngine) window.soundEngine.playLaser();
                } else {
                    // Swipe Right -> Prev Day
                    const prevDay = days[(curIdx - 1 + days.length) % days.length];
                    this.setActiveDay(prevDay);
                    if (window.soundEngine) window.soundEngine.playLaser();
                }
            }
        }, { passive: true });
    }

    fillOfficialSchoolSchedule() {
        if (!this.isUserAdmin()) {
            this.showToast('Только администратор может изменять расписание!', '🔒');
            return;
        }
        if (confirm('Применить официальное школьное расписание (по стикерам на фото)? Все уроки Пн-Пт будут заполнены.')) {
            this.schedule = JSON.parse(JSON.stringify(OFFICIAL_SCHOOL_SCHEDULE));
            this.saveState();
            this.renderSchedule();
            this.showToast('Официальное школьное расписание применено и сохранено!', '⚡');
            if (window.effectsManager) window.effectsManager.confettiBurst();
            if (window.soundEngine) window.soundEngine.playSuccess();
        }
    }

    getOfficialScheduleSampleText() {
        return `Понедельник (21 Сентября)
8:00
1. РоВ (34)
2. история (23)
3. рус. язык (36)
4. вер.и стат. (16)
5. алгебра (16)
6. англ. (33,39)
7. практ. по РЯ (36)

Вторник (22 Сентября)
8:00
1. биология (21)
2. рус. язык (36)
3. геом. (16)
4. физика (32)
5. мат.практ. (16)
6. инф./англ. (34,39)

Среда (23 Сентября)
8:00
1. кл.час (34)
2. геогр. (25)
3. алгебра (16)
4. биология (21)
5. англ./инф. (33,34)
6. химия (21)
7. физ-ра (Е)
8. история (23)

Четверг (24 Сентября)
8:00
1. физика (32)
2. геогр. (25)
3. РМГ (34)
4. геом. (16)
5. англ. (33,39)
6. литер. (36)

Пятница (25 Сентября)
9:55
3. алгебра (16)
4. физ-ра (Е)
5. химия (21)
6. труд (тех.,маст.)
7. рус. язык (36)`;
    }

    parseSmartScheduleText(rawText) {
        if (!this.isUserAdmin()) {
            this.showToast('Только администратор может изменять расписание!', '🔒');
            return false;
        }
        if (!rawText || !rawText.trim()) {
            this.showToast('Пожалуйста, вставьте текст расписания!', '⚠️');
            return false;
        }

        const lines = rawText.split('\n');
        let currentDay = 'mon';
        const newSchedule = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [] };
        let countParsed = 0;

        const dayKeywords = [
            { key: 'mon', regex: /(понедельник|monday|пн\b|mon\b)/i },
            { key: 'tue', regex: /(вторник|tuesday|вт\b|tue\b)/i },
            { key: 'wed', regex: /(среда|среду|wednesday|ср\b|wed\b)/i },
            { key: 'thu', regex: /(четверг|thursday|чт\b|thu\b)/i },
            { key: 'fri', regex: /(пятница|пятницу|friday|пт\b|fri\b)/i },
            { key: 'sat', regex: /(суббота|субботу|saturday|сб\b|sat\b)/i }
        ];

        const expandSubject = (subj) => {
            let s = subj.trim();
            const lower = s.toLowerCase();
            if (lower === 'ров' || lower === 'разговоры о важном') return 'Разговоры о важном (РоВ)';
            if (lower === 'вер.и стат.' || lower === 'вер. и стат.' || lower === 'вероятность') return 'Вероятность и статистика';
            if (lower === 'мат.практ.' || lower === 'мат. практ.') return 'Математический практикум';
            if (lower === 'практ. по ря' || lower === 'практ. по р.я.') return 'Практикум по русскому языку';
            if (lower === 'кл.час' || lower === 'кл. час' || lower === 'классный час') return 'Классный час (20 мин)';
            if (lower === 'геом.' || lower === 'геометрия') return 'Геометрия';
            if (lower === 'геогр.' || lower === 'география') return 'География';
            if (lower === 'физ-ра' || lower === 'физкультура') return 'Физкультура';
            if (lower === 'литер.' || lower === 'литература') return 'Литература';
            if (lower === 'инф.' || lower === 'информатика') return 'Информатика';
            if (lower === 'труд (тех.,маст.)' || lower === 'труд' || lower === 'технология') return 'Труд (тех., маст.)';
            if (lower === 'рус. язык' || lower === 'русский язык') return 'Русский язык';
            if (lower === 'англ.' || lower === 'английский') return 'Английский язык';
            return s;
        };

        const expandRoom = (r) => {
            let room = (r || '').trim();
            if (room.toLowerCase() === 'е') return 'Спортзал (Е)';
            return room;
        };

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            // Check if line indicates day name
            let matchedDay = false;
            for (const d of dayKeywords) {
                if (d.regex.test(line) && !/^\d+[\.\)]/.test(line)) {
                    currentDay = d.key;
                    matchedDay = true;
                    break;
                }
            }
            if (matchedDay) continue;

            // Match lesson number line: e.g. "1. РоВ (34)" or "3. алгебра (16)"
            const lessonMatch = line.match(/^(\d+)[\.\)]\s*(.+?)(?:\s*[\(\[]([^\)\]]+)[\)\]])?\s*$/);
            if (lessonMatch) {
                const num = parseInt(lessonMatch[1], 10);
                const rawSubj = lessonMatch[2].trim();
                const rawRoom = lessonMatch[3] ? lessonMatch[3].trim() : '—';

                const subject = expandSubject(rawSubj);
                const room = expandRoom(rawRoom);
                const time = this.getBellTime(currentDay, num);

                newSchedule[currentDay].push({
                    id: `${currentDay}_${num}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                    num,
                    time,
                    subject,
                    room
                });
                countParsed++;
            }
        }

        if (countParsed === 0) {
            this.showToast('Не удалось распознать уроки. Проверьте формат текста.', '⚠️');
            return false;
        }

        this.schedule = newSchedule;
        this.saveState();
        this.renderSchedule();
        this.showToast(`Успешно загружено уроков: ${countParsed}!`, '🎉');
        if (window.effectsManager) window.effectsManager.confettiBurst();
        if (window.soundEngine) window.soundEngine.playSuccess();
        return true;
    }

    getBellTime(day, lessonNum) {
        const isWed = day === 'wed';
        const times = isWed ? BELL_TIMES.wednesday : BELL_TIMES.regular;
        return times[lessonNum] || times[1] || '08:00 - 08:40';
    }

    selectLessonPresetNum(num, day, setTime = true) {
        const timeInput = document.getElementById('lesson-time-input');
        const wedHint = document.getElementById('lesson-wed-hint');

        document.querySelectorAll('.preset-num-btn').forEach(b => {
            b.classList.toggle('active', parseInt(b.dataset.num, 10) === num);
        });

        const isWedFirst = (day === 'wed' && num === 1);
        if (wedHint) {
            wedHint.style.display = isWedFirst ? 'inline-block' : 'none';
        }

        if (setTime && timeInput) {
            timeInput.value = this.getBellTime(day, num);
        }
    }

    applyBellSchedule() {
        if (!this.isUserAdmin()) {
            this.showToast('Только администратор может изменять звонки!', '🔒');
            return;
        }
        let count = 0;
        Object.keys(this.schedule).forEach(day => {
            const list = this.schedule[day] || [];
            list.forEach((l, index) => {
                const lessonNum = index + 1;
                l.num = lessonNum;
                l.time = this.getBellTime(day, lessonNum);
                count++;
            });
        });
        this.saveState();
        this.renderSchedule();
        this.showToast(`Обновлено ${count} уроков по звонкам (в среду 1 урок = 20 мин)!`, '🔔');
        if (window.soundEngine) window.soundEngine.playSuccess();
        if (window.effectsManager) window.effectsManager.confettiBurst();
    }

    fillFullStandardSchedule() {
        if (!this.isUserAdmin()) {
            this.showToast('Только администратор может загружать расписание!', '🔒');
            return;
        }
        if (!confirm('Заполнить полное школьное расписание на всю неделю по официальным звонкам?')) return;
        this.schedule = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
        this.saveState();
        this.renderSchedule();
        this.showToast('Школьное расписание успешно загружено!', '📚');
        if (window.soundEngine) window.soundEngine.playSuccess();
        if (window.effectsManager) window.effectsManager.confettiBurst();
    }

    fillDaySlots(day = null) {
        if (!this.isUserAdmin()) {
            this.showToast('Только администратор может добавлять уроки!', '🔒');
            return;
        }
        const targetDay = day || this.activeDay;
        const slotsCount = 7;
        const newLessons = [];
        for (let i = 1; i <= slotsCount; i++) {
            newLessons.push({
                id: `${targetDay}_${Date.now()}_${i}`,
                num: i,
                time: this.getBellTime(targetDay, i),
                subject: (targetDay === 'wed' && i === 1) ? 'Классный час (20 мин)' : `Урок ${i}`,
                room: '—'
            });
        }
        this.schedule[targetDay] = newLessons;
        this.saveState();
        this.renderSchedule();
        this.showToast(`Добавлено 7 уроков на ${this.dayNames[targetDay]}!`, '➕');
        if (window.soundEngine) window.soundEngine.playSuccess();
    }

    setActiveDay(day) {
        this.activeDay = day;
        document.querySelectorAll('.day-btn').forEach(btn => {
            const isActive = btn.dataset.day === day;
            btn.classList.toggle('active', isActive);
            if (isActive) {
                try {
                    btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                } catch (e) {}
            }
        });
        this.renderSchedule();
    }

    openAddLessonModal(day = null) {
        if (!this.isUserAdmin()) {
            this.showToast('Только администратор может добавлять уроки!', '🔒');
            return;
        }
        const modal = document.getElementById('lesson-modal');
        const modalTitle = document.getElementById('lesson-modal-title');
        const editIndexInput = document.getElementById('lesson-edit-index');
        const daySelect = document.getElementById('lesson-day-select');
        const subjectInput = document.getElementById('lesson-subject-input');
        const roomInput = document.getElementById('lesson-room-input');

        const targetDay = day || this.activeDay;
        const currentCount = (this.schedule[targetDay] || []).length;
        const nextNum = Math.min(currentCount + 1, 8);

        if (modalTitle) modalTitle.innerText = '➕ Добавить урок';
        if (editIndexInput) editIndexInput.value = '-1';
        if (daySelect) daySelect.value = targetDay;
        if (subjectInput) subjectInput.value = '';
        if (roomInput) roomInput.value = '';

        this.selectLessonPresetNum(nextNum, targetDay, true);

        if (modal) modal.classList.add('active');
        if (window.soundEngine) window.soundEngine.playLaser();
    }

    openEditLessonModal(day, index) {
        if (!this.isUserAdmin()) {
            this.showToast('Только администратор может изменять уроки!', '🔒');
            return;
        }
        const lesson = (this.schedule[day] || [])[index];
        if (!lesson) return;

        const modal = document.getElementById('lesson-modal');
        const modalTitle = document.getElementById('lesson-modal-title');
        const editIndexInput = document.getElementById('lesson-edit-index');
        const daySelect = document.getElementById('lesson-day-select');
        const subjectInput = document.getElementById('lesson-subject-input');
        const timeInput = document.getElementById('lesson-time-input');
        const roomInput = document.getElementById('lesson-room-input');

        const lessonNum = lesson.num || (index + 1);

        if (modalTitle) modalTitle.innerText = `✏️ Редактировать урок №${lessonNum}`;
        if (editIndexInput) editIndexInput.value = index;
        if (daySelect) daySelect.value = day;
        if (subjectInput) subjectInput.value = lesson.subject || '';
        if (timeInput) timeInput.value = lesson.time || this.getBellTime(day, lessonNum);
        if (roomInput) roomInput.value = lesson.room || '';

        this.selectLessonPresetNum(lessonNum, day, false);

        if (modal) modal.classList.add('active');
        if (window.soundEngine) window.soundEngine.playLaser();
    }

    renderSchedule() {
        const container = document.getElementById('schedule-lessons-list');
        const dayTitle = document.getElementById('current-day-title');
        const quickAddBtn = document.getElementById('quick-add-lesson-btn');
        const adminBadge = document.getElementById('admin-badge-indicator');
        if (!container) return;

        const isAdmin = this.isUserAdmin();

        if (quickAddBtn) {
            quickAddBtn.style.display = isAdmin ? 'inline-flex' : 'none';
        }
        if (adminBadge) {
            adminBadge.style.display = isAdmin ? 'flex' : 'none';
        }

        if (dayTitle) {
            dayTitle.innerText = `${this.dayNames[this.activeDay]} (${(this.schedule[this.activeDay] || []).length} уроков)`;
        }

        const lessons = this.schedule[this.activeDay] || [];
        if (lessons.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🏖️</span>
                    <h3>На этот день уроков нет</h3>
                    <p>${isAdmin ? 'Нажмите «+ Добавить урок», чтобы добавить уроки в расписание' : 'Уроков пока не добавлено'}</p>
                    ${isAdmin ? `<button class="cool-btn primary" style="margin-top: 12px;" onclick="app.openAddLessonModal('${this.activeDay}')">+ Добавить урок</button>` : ''}
                </div>
            `;
            return;
        }

        let html = '';
        lessons.forEach((l, index) => {
            html += `
                <div class="lesson-card" data-id="${l.id}" data-day="${this.activeDay}" data-index="${index}">
                    <div class="lesson-number-badge">${l.num}</div>
                    <div class="lesson-content">
                        <div class="lesson-header-row">
                            <h4 class="lesson-subject ${window.adminAbuse && window.adminAbuse.isLiveEdit ? 'editable' : ''}" data-field="subject">${this.escapeHtml(l.subject)}</h4>
                            <span class="lesson-time">⏰ ${this.escapeHtml(l.time)}</span>
                        </div>
                        <div class="lesson-details">
                            <span class="lesson-room ${window.adminAbuse && window.adminAbuse.isLiveEdit ? 'editable' : ''}" data-field="room">Кабинет: <strong class="lesson-room-pill">${this.escapeHtml(l.room || '—')}</strong></span>
                        </div>
                    </div>
                    <div class="lesson-actions">
                        <button class="icon-btn" title="Искать ГДЗ" onclick="app.searchGDZ('${this.escapeQuotes(l.subject)}')">📚 ГДЗ</button>
                        <button class="icon-btn" title="Спросить DeepSeek" onclick="app.askAIForSubject('${this.escapeQuotes(l.subject)}')">🤖 AI</button>
                        ${isAdmin ? `
                            <button class="icon-btn edit-lesson-btn" title="Редактировать урок" onclick="app.openEditLessonModal('${this.activeDay}', ${index})">✏️</button>
                            <button class="icon-btn delete-lesson-btn" title="Удалить урок" onclick="app.deleteLesson('${this.activeDay}', ${index})">🗑️</button>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        this.updateCurrentLessonHighlight();

        if (window.adminAbuse && window.adminAbuse.isLiveEdit) {
            window.adminAbuse.attachInlineEditHandlers();
        }
    }

    renderHomework() {
        const container = document.getElementById('homework-list');
        if (!container) return;

        const isAdmin = this.isUserAdmin();

        let filtered = this.homework;
        if (this.hwFilter === 'active') {
            filtered = this.homework.filter(h => !h.completed);
        } else if (this.hwFilter === 'completed') {
            filtered = this.homework.filter(h => h.completed);
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🎉</span>
                    <h3>ДЗ нет! Чиллим</h3>
                    <p>Все задачи сделаны или еще не добавлены</p>
                </div>
            `;
            this.updateStats();
            return;
        }

        // Sort: uncompleted first, then urgent
        filtered.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            if (a.urgent !== b.urgent) return a.urgent ? -1 : 1;
            return b.createdAt - a.createdAt;
        });

        let html = '';
        filtered.forEach(hw => {
            const deepseekUrl = hw.deepseekLink || (hw.solution && hw.solution.deepseekLink) || '';
            const aliceUrl = hw.aliceLink || (hw.solution && hw.solution.aliceLink) || '';
            const gdzUrl = hw.gdzLink || (hw.solution && hw.solution.gdzLink) || '';
            const hasSolution = Boolean(hw.solution && (hw.solution.text || hw.solution.link || hw.solution.deepseekLink || hw.solution.aliceLink || hw.solution.gdzLink));

            html += `
                <div class="hw-card ${hw.completed ? 'completed' : ''} ${hw.urgent ? 'urgent-border' : ''}" data-id="${hw.id}">
                    <div class="hw-checkbox-wrapper">
                        <input type="checkbox" id="check_${hw.id}" ${hw.completed ? 'checked' : ''} onchange="app.toggleHomework('${hw.id}')">
                        <label for="check_${hw.id}"></label>
                    </div>
                    <div class="hw-content">
                        <div class="hw-top-line">
                            <span class="hw-subject-badge">${this.escapeHtml(hw.subject)}</span>
                            <span class="hw-deadline-badge ${hw.urgent ? 'urgent-badge' : ''}">⏳ ${this.escapeHtml(hw.deadline)}</span>
                        </div>
                        <p class="hw-task-text">${this.escapeHtml(hw.text)}</p>

                        <!-- Attached Solution / Answer section -->
                        ${hasSolution ? `
                            <div class="hw-solution-container">
                                <button class="solution-toggle-btn" onclick="app.toggleSolutionView('${hw.id}')">
                                    💡 Решение (${this.escapeHtml(hw.solution.source || 'Ответ')}) ▾
                                </button>
                                <div id="solution_box_${hw.id}" class="solution-content-box" style="display: none;">
                                    <div class="solution-header">
                                        <span class="solution-source-badge">${this.escapeHtml(hw.solution.source || 'Решение')}</span>
                                        <div class="solution-links-chips">
                                            ${deepseekUrl ? `<a href="${this.escapeHtml(deepseekUrl)}" target="_blank" rel="noopener noreferrer" class="solution-source-link deepseek-chip" title="Открыть чат решения в DeepSeek">🧠 Чат в DeepSeek ↗</a>` : ''}
                                            ${aliceUrl ? `<a href="${this.escapeHtml(aliceUrl)}" target="_blank" rel="noopener noreferrer" class="solution-source-link alice-chip" title="Открыть диалог с Алисой">🟣 Чат в Алисе ↗</a>` : ''}
                                            ${gdzUrl ? `<a href="${this.escapeHtml(gdzUrl)}" target="_blank" rel="noopener noreferrer" class="solution-source-link gdz-chip" title="Открыть страницу решения на ГДЗ">📚 Страница ГДЗ ↗</a>` : ''}
                                            ${(hw.solution.link && hw.solution.link !== deepseekUrl && hw.solution.link !== aliceUrl && hw.solution.link !== gdzUrl) ? `<a href="${this.escapeHtml(hw.solution.link)}" target="_blank" rel="noopener noreferrer" class="solution-source-link">🔗 Источник</a>` : ''}
                                        </div>
                                        ${hw.solution.text ? `<button class="mini-tool-btn" onclick="app.copySolution('${hw.id}')">📋 Скопировать</button>` : ''}
                                    </div>
                                    ${hw.solution.text ? `<div class="solution-text">${this.escapeHtml(hw.solution.text)}</div>` : ''}
                                </div>
                            </div>
                        ` : ''}

                        <div class="hw-card-footer">
                            <div class="hw-ai-helpers">
                                ${deepseekUrl ? `
                                    <a href="${this.escapeHtml(deepseekUrl)}" target="_blank" rel="noopener noreferrer" class="mini-tool-btn active-link deepseek-btn" title="Перейти в готовый чат DeepSeek с решением">
                                        🧠 Чат DeepSeek ↗
                                    </a>
                                ` : `
                                    <button class="mini-tool-btn" onclick="app.openDeepSeekWithPrompt('${this.escapeQuotes(hw.subject)}', '${this.escapeQuotes(hw.text)}')" title="Сгенерировать промпт и открыть DeepSeek">
                                        🧠 DeepSeek
                                    </button>
                                `}

                                ${aliceUrl ? `
                                    <a href="${this.escapeHtml(aliceUrl)}" target="_blank" rel="noopener noreferrer" class="mini-tool-btn active-link alice-btn" title="Перейти в готовый диалог с Алисой">
                                        🟣 Чат Алисы ↗
                                    </a>
                                ` : `
                                    <button class="mini-tool-btn" onclick="app.openAliceWithPrompt('${this.escapeQuotes(hw.subject)}', '${this.escapeQuotes(hw.text)}')" title="Сгенерировать вопрос и открыть Алису">
                                        🟣 Алиса
                                    </button>
                                `}

                                ${gdzUrl ? `
                                    <a href="${this.escapeHtml(gdzUrl)}" target="_blank" rel="noopener noreferrer" class="mini-tool-btn active-link gdz-btn" title="Перейти на страницу с готовым ГДЗ">
                                        📚 Страница ГДЗ ↗
                                    </a>
                                ` : `
                                    <button class="mini-tool-btn" onclick="app.searchGDZ('${this.escapeQuotes(hw.subject)}')" title="Искать ГДЗ">
                                        📚 ГДЗ
                                    </button>
                                `}

                                ${isAdmin ? `
                                    <button class="mini-tool-btn admin-upload-btn" onclick="app.openAnswerModal('${hw.id}')" title="Загрузить или изменить готовый ответ и ссылки на чаты">
                                        📥 ${hasSolution || deepseekUrl || aliceUrl || gdzUrl ? 'Изменить ответ/ссылки' : 'Загрузить ответ/ссылки'}
                                    </button>
                                ` : ''}
                            </div>
                            ${isAdmin ? `
                                <div style="display: flex; gap: 4px; align-items: center;">
                                    <button class="edit-hw-btn" title="Редактировать задание" onclick="app.openEditHomeworkModal('${hw.id}')">✏️</button>
                                    <button class="delete-hw-btn" title="Удалить задачу" onclick="app.deleteHomework('${hw.id}')">🗑️</button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        this.updateStats();
    }

    openAddHomeworkModal() {
        if (!this.isUserAdmin()) {
            this.showToast('Только администратор может добавлять домашнее задание!', '🔒');
            return;
        }
        const modal = document.getElementById('hw-modal');
        const titleEl = document.getElementById('hw-modal-title');
        const editIdInput = document.getElementById('hw-edit-id');
        const form = document.getElementById('hw-form');
        if (form) form.reset();
        if (editIdInput) editIdInput.value = '';
        if (titleEl) titleEl.innerText = '📝 Добавить задание';
        if (modal) modal.classList.add('active');
        if (window.soundEngine) window.soundEngine.playLaser();
    }

    openEditHomeworkModal(hwId) {
        if (!this.isUserAdmin()) {
            this.showToast('Только администратор может редактировать задания!', '🔒');
            return;
        }
        const item = this.homework.find(h => h.id === hwId);
        if (!item) return;

        const modal = document.getElementById('hw-modal');
        const titleEl = document.getElementById('hw-modal-title');
        const editIdInput = document.getElementById('hw-edit-id');
        const subjectInput = document.getElementById('hw-subject-input');
        const textInput = document.getElementById('hw-text-input');
        const deadlineInput = document.getElementById('hw-deadline-input');
        const urgentInput = document.getElementById('hw-urgent-input');
        const deepseekInput = document.getElementById('hw-deepseek-link');
        const aliceInput = document.getElementById('hw-alice-link');
        const gdzInput = document.getElementById('hw-gdz-link');

        if (editIdInput) editIdInput.value = hwId;
        if (titleEl) titleEl.innerText = `✏️ Редактировать: ${item.subject}`;
        if (subjectInput) subjectInput.value = item.subject || '';
        if (textInput) textInput.value = item.text || '';
        if (deadlineInput) deadlineInput.value = item.deadline || '';
        if (urgentInput) urgentInput.checked = Boolean(item.urgent);

        const dLink = item.deepseekLink || (item.solution && item.solution.deepseekLink) || '';
        const aLink = item.aliceLink || (item.solution && item.solution.aliceLink) || '';
        const gLink = item.gdzLink || (item.solution && item.solution.gdzLink) || '';

        if (deepseekInput) deepseekInput.value = dLink;
        if (aliceInput) aliceInput.value = aLink;
        if (gdzInput) gdzInput.value = gLink;

        if (modal) modal.classList.add('active');
        if (window.soundEngine) window.soundEngine.playLaser();
    }

    addHomework(item) {
        this.homework.unshift(item);
        this.saveState();
        this.renderHomework();
    }

    toggleHomework(id) {
        const item = this.homework.find(h => h.id === id);
        if (item) {
            item.completed = !item.completed;
            this.saveState();
            this.renderHomework();

            if (item.completed) {
                if (window.soundEngine) window.soundEngine.playSuccess();
                if (window.effectsManager) window.effectsManager.confettiBurst();
            }
        }
    }

    deleteHomework(id) {
        this.homework = this.homework.filter(h => h.id !== id);
        this.saveState();
        this.renderHomework();
        if (window.soundEngine) window.soundEngine.playLaser();
    }

    // --- SOLUTION & ANSWERS (DeepSeek, Алиса, ГДЗ) ---
    toggleSolutionView(hwId) {
        const box = document.getElementById(`solution_box_${hwId}`);
        if (!box) return;
        const isShown = box.style.display !== 'none';
        box.style.display = isShown ? 'none' : 'block';
    }

    copySolution(hwId) {
        const item = this.homework.find(h => h.id === hwId);
        if (item && item.solution) {
            this.copyText(item.solution.text).then(() => {
                this.showToast('Решение скопировано в буфер обмена!', '📋');
            });
        }
    }

    openAnswerModal(hwId) {
        if (!this.isUserAdmin()) {
            this.showToast('Только администратор может загружать решения!', '🔒');
            return;
        }

        const item = this.homework.find(h => h.id === hwId);
        if (!item) return;

        const modal = document.getElementById('answer-modal');
        const titleEl = document.getElementById('answer-modal-title');
        const taskPreview = document.getElementById('answer-task-preview');
        const idInput = document.getElementById('answer-hw-id');
        const sourceSelect = document.getElementById('answer-source-select');
        const textInput = document.getElementById('answer-text-input');
        const linkInput = document.getElementById('answer-link-input');
        const deepseekInput = document.getElementById('answer-deepseek-link');
        const aliceInput = document.getElementById('answer-alice-link');
        const gdzInput = document.getElementById('answer-gdz-link');

        if (!modal) return;

        idInput.value = hwId;
        if (titleEl) titleEl.innerText = `💡 Загрузить ответ & ссылки: ${item.subject}`;
        if (taskPreview) taskPreview.innerText = item.text;

        const dLink = item.deepseekLink || (item.solution && item.solution.deepseekLink) || '';
        const aLink = item.aliceLink || (item.solution && item.solution.aliceLink) || '';
        const gLink = item.gdzLink || (item.solution && item.solution.gdzLink) || '';
        const eLink = (item.solution && item.solution.link) || '';

        if (deepseekInput) deepseekInput.value = dLink;
        if (aliceInput) aliceInput.value = aLink;
        if (gdzInput) gdzInput.value = gLink;
        if (linkInput) linkInput.value = (eLink && eLink !== dLink && eLink !== aLink && eLink !== gLink) ? eLink : '';

        if (item.solution) {
            if (sourceSelect) sourceSelect.value = item.solution.source || 'DeepSeek AI';
            if (textInput) textInput.value = item.solution.text || '';
        } else {
            if (textInput) textInput.value = '';
        }

        modal.classList.add('active');
        if (window.soundEngine) window.soundEngine.playLaser();
    }

    attachSolution(hwId, solutionData) {
        if (!this.isUserAdmin()) {
            this.showToast('Только администратор может загружать решения!', '🔒');
            return;
        }

        const item = this.homework.find(h => h.id === hwId);
        if (item) {
            item.deepseekLink = solutionData.deepseekLink || item.deepseekLink || '';
            item.aliceLink = solutionData.aliceLink || item.aliceLink || '';
            item.gdzLink = solutionData.gdzLink || item.gdzLink || '';

            item.solution = {
                source: solutionData.source || 'Решение',
                text: solutionData.text || '',
                deepseekLink: solutionData.deepseekLink || item.deepseekLink || '',
                aliceLink: solutionData.aliceLink || item.aliceLink || '',
                gdzLink: solutionData.gdzLink || item.gdzLink || '',
                link: solutionData.link || solutionData.deepseekLink || solutionData.aliceLink || solutionData.gdzLink || ''
            };

            this.saveState();
            this.renderHomework();
            this.showToast(`Ответ и ссылки сохранены!`, '💡');
            if (window.soundEngine) window.soundEngine.playSuccess();
            if (window.effectsManager) window.effectsManager.confettiBurst();
        }
    }

    updateStats() {
        const total = this.homework.length;
        const done = this.homework.filter(h => h.completed).length;
        const pending = total - done;
        const percent = total > 0 ? Math.round((done / total) * 100) : 100;

        const statText = document.getElementById('hw-stat-text');
        const progressBar = document.getElementById('hw-progress-bar');
        const mobHwBadge = document.getElementById('mob-hw-badge');

        if (statText) statText.innerText = `${done} из ${total} выполнено (${percent}%)`;
        if (progressBar) progressBar.style.width = `${percent}%`;

        if (mobHwBadge) {
            if (pending > 0) {
                mobHwBadge.innerText = pending;
                mobHwBadge.style.display = 'flex';
            } else {
                mobHwBadge.style.display = 'none';
            }
        }
    }

    updateCurrentLessonHighlight() {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const nowMins = currentHours * 60 + currentMinutes;

        document.querySelectorAll('.lesson-card').forEach(card => {
            const timeSpan = card.querySelector('.lesson-time');
            if (!timeSpan) return;

            const timeText = timeSpan.innerText.replace('⏰', '').trim();
            const parts = timeText.split('-');
            if (parts.length === 2) {
                const [startH, startM] = parts[0].trim().split(':').map(Number);
                const [endH, endM] = parts[1].trim().split(':').map(Number);

                const startMins = startH * 60 + startM;
                const endMins = endH * 60 + endM;

                if (nowMins >= startMins && nowMins <= endMins) {
                    card.classList.add('current-active-lesson');
                } else {
                    card.classList.remove('current-active-lesson');
                }
            }
        });
    }

    // --- TOAST NOTIFICATIONS (Replaces ugly alerts) ---
    showToast(message, icon = '✨') {
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'cool-toast';
        toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-msg">${this.escapeHtml(message)}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3200);
    }

    // Safe clipboard copy that works anywhere (HTTP, HTTPS, file://)
    copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).catch(() => this.fallbackCopyText(text));
        } else {
            return this.fallbackCopyText(text);
        }
    }

    fallbackCopyText(text) {
        return new Promise((resolve, reject) => {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                textArea.remove();
                resolve();
            } catch (err) {
                textArea.remove();
                reject(err);
            }
        });
    }

    // --- QUICK AI & GDZ HELPERS ---
    openDeepSeekWithPrompt(subject, task) {
        const prompt = `Привет, DeepSeek! Помоги решить и подробно объясни решение для школьного задания по предмету "${subject}":\n\n${task}`;
        this.copyText(prompt).then(() => {
            this.showToast('Промпт скопирован! Открываем DeepSeek...', '🧠');
            window.open('https://chat.deepseek.com', '_blank');
        }).catch(() => {
            window.open('https://chat.deepseek.com', '_blank');
        });
    }

    openAliceWithPrompt(subject, task) {
        const prompt = `Алиса, реши задание по предмету ${subject}: ${task}`;
        this.copyText(prompt).then(() => {
            this.showToast('Вопрос скопирован! Открываем Алису...', '🟣');
            window.open('https://a.ya.ru', '_blank');
        }).catch(() => {
            window.open('https://a.ya.ru', '_blank');
        });
    }

    askAIForSubject(subject) {
        const prompt = `Объясни мне тему и помоги с практическими заданиями по предмету "${subject}"`;
        this.copyText(prompt).then(() => {
            this.showToast(`Вопрос по предмету "${subject}" скопирован! Открываем DeepSeek...`, '🤖');
            window.open('https://chat.deepseek.com', '_blank');
        }).catch(() => {
            window.open('https://chat.deepseek.com', '_blank');
        });
    }

    searchGDZ(subject) {
        const query = encodeURIComponent(`ГДЗ ${subject} учебник ответы`);
        window.open(`https://yandex.ru/search/?text=${query}`, '_blank');
    }

    // --- LESSON CRUD ---
    addLesson(day, lessonData) {
        if (!this.schedule[day]) this.schedule[day] = [];
        this.schedule[day].push(lessonData);
        this.saveState();
        this.renderSchedule();
        this.showToast(`Урок "${lessonData.subject}" добавлен в расписание!`, '✅');
        if (window.soundEngine) window.soundEngine.playSuccess();
    }

    deleteLesson(day, index) {
        if (!this.schedule[day]) return;
        const removed = this.schedule[day].splice(index, 1);
        // re-number lessons
        this.schedule[day].forEach((l, i) => l.num = i + 1);
        this.saveState();
        this.renderSchedule();
        this.showToast(`Урок удален из расписания`, '🗑️');
        if (window.soundEngine) window.soundEngine.playLaser();
    }

    // --- ADMIN CHAT MESSAGE BOX (20-25s) ---
    showAdminChatMessage(text, authorName = 'Админ', avatar = null, duration = 25000, saveToStorage = true) {
        if (!text) return;

        const chatPopup = document.getElementById('admin-chat-popup');
        const chatAuthor = document.getElementById('chat-popup-author');
        const chatText = document.getElementById('chat-popup-text');
        const chatAvatar = document.getElementById('chat-popup-avatar');
        const progressBar = document.getElementById('chat-popup-progress-bar');
        const timeLabel = document.getElementById('chat-time-label');

        if (!chatPopup) return;

        if (saveToStorage) {
            const payload = {
                text,
                author: authorName,
                avatar: avatar || '👑',
                timestamp: Date.now(),
                duration: duration
            };
            try {
                localStorage.setItem('curie_admin_chat', JSON.stringify(payload));
            } catch (e) {}

            // Broadcast to Firestore for all connected classmates!
            if (this.db && this.isUserAdmin()) {
                this.db.collection('curie_data').doc('chat').set(payload).catch(e => {
                    console.warn('Chat broadcast cloud error:', e);
                });
            }
        }

        if (chatAuthor) chatAuthor.innerText = authorName;
        if (chatText) chatText.innerText = text;
        if (timeLabel) timeLabel.innerText = 'только что';

        if (chatAvatar) {
            if (avatar && avatar.startsWith('http')) {
                chatAvatar.innerHTML = `<img src="${this.escapeHtml(avatar)}" alt="Avatar">`;
            } else {
                chatAvatar.innerHTML = `<span>${this.escapeHtml(avatar || '👑')}</span>`;
            }
        }

        chatPopup.classList.remove('closing');
        chatPopup.style.display = 'block';

        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = '100%';
            setTimeout(() => {
                progressBar.style.transition = `width ${duration}ms linear`;
                progressBar.style.width = '0%';
            }, 40);
        }

        if (window.soundEngine) {
            window.soundEngine.playSuccess();
        }

        if (this.chatTimer) clearTimeout(this.chatTimer);
        this.chatTimer = setTimeout(() => {
            this.hideAdminChatMessage(saveToStorage);
        }, duration);
    }

    hideAdminChatMessage(clearStorage = true) {
        const chatPopup = document.getElementById('admin-chat-popup');
        if (!chatPopup) return;

        chatPopup.classList.add('closing');
        setTimeout(() => {
            chatPopup.style.display = 'none';
            chatPopup.classList.remove('closing');
        }, 280);

        if (this.chatTimer) {
            clearTimeout(this.chatTimer);
            this.chatTimer = null;
        }

        if (clearStorage) {
            localStorage.removeItem('curie_admin_chat');
            if (this.db && this.isUserAdmin()) {
                this.db.collection('curie_data').doc('chat').delete().catch(e => {});
            }
        }
    }

    checkActiveAdminChat() {
        try {
            const raw = localStorage.getItem('curie_admin_chat');
            if (raw) {
                const data = JSON.parse(raw);
                const elapsed = Date.now() - data.timestamp;
                const remaining = (data.duration || 25000) - elapsed;
                if (remaining > 1500) {
                    this.showAdminChatMessage(data.text, data.author, data.avatar, remaining, false);
                } else {
                    localStorage.removeItem('curie_admin_chat');
                }
            }
        } catch (e) {}
    }

    setupCrossTabChatSync() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'curie_admin_chat') {
                if (e.newValue) {
                    try {
                        const data = JSON.parse(e.newValue);
                        const elapsed = Date.now() - data.timestamp;
                        const remaining = (data.duration || 25000) - elapsed;
                        if (remaining > 1500) {
                            this.showAdminChatMessage(data.text, data.author, data.avatar, remaining, false);
                        }
                    } catch (err) {}
                } else {
                    this.hideAdminChatMessage(false);
                }
            }
        });
    }

    // Backwards compatibility wrappers
    showAnnouncement(text, save = true) {
        this.showAdminChatMessage(text, 'Админ', '👑', 25000, save);
    }

    hideAnnouncement() {
        this.hideAdminChatMessage(true);
    }

    // --- EXPORT & SHARE ---
    exportData() {
        const data = {
            version: '2.0',
            exportedAt: new Date().toISOString(),
            schedule: this.schedule,
            homework: this.homework,
            announcement: this.bannerAnnouncement
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `schedule_curie_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Файл расписания скачан!', '💾');
        if (window.soundEngine) window.soundEngine.playSuccess();
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (parsed.schedule) this.schedule = parsed.schedule;
                if (parsed.homework) this.homework = parsed.homework;
                if (parsed.announcement) this.showAnnouncement(parsed.announcement, false);

                this.saveState();
                this.renderSchedule();
                this.renderHomework();
                this.showToast('Расписание успешно загружено!', '🎉');
                if (window.effectsManager) window.effectsManager.confettiBurst();
                if (window.soundEngine) window.soundEngine.playSuccess();
            } catch (err) {
                this.showToast('Ошибка чтения JSON файла', '⚠️');
            }
        };
        reader.readAsText(file);
    }

    generateShareLink() {
        const payload = {
            s: this.schedule,
            h: this.homework,
            b: this.bannerAnnouncement
        };
        try {
            const jsonStr = JSON.stringify(payload);
            const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
            const fullUrl = `${window.location.origin}${window.location.pathname}#share=${encoded}`;

            this.copyText(fullUrl).then(() => {
                this.showToast('Ссылка скопирована! Отправьте её одноклассникам 🚀', '🔗');
                if (window.soundEngine) window.soundEngine.playTacoBell();
            }).catch(() => {
                prompt('Скопируйте ссылку вручную:', fullUrl);
            });
        } catch (err) {
            console.error(err);
            this.showToast('Не удалось сформировать ссылку', '⚠️');
        }
    }

    checkUrlImport() {
        if (window.location.hash.startsWith('#share=')) {
            const raw = window.location.hash.replace('#share=', '');
            try {
                const decoded = decodeURIComponent(escape(atob(raw)));
                const data = JSON.parse(decoded);
                if (confirm('Обнаружено расписание по ссылке! Загрузить его на ваш сайт?')) {
                    if (data.s) this.schedule = data.s;
                    if (data.h) this.homework = data.h;
                    if (data.b) this.showAnnouncement(data.b, false);
                    this.saveState();
                    this.renderSchedule();
                    this.renderHomework();
                    this.showToast('Расписание загружено из ссылки!', '🎉');
                    if (window.effectsManager) window.effectsManager.confettiBurst();
                }
                // Clear hash cleanly
                history.replaceState(null, null, window.location.pathname);
            } catch (e) {
                console.error('Failed to parse share url', e);
            }
        }
    }

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    escapeQuotes(str) {
        if (!str) return '';
        return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
    }
}

// Global App instance
window.app = new AppManager();
