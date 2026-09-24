/**
 * Main Application Logic
 * Schedule & Homework Manager + LocalStorage Sync + Shareable Hash URL
 */

const DEFAULT_SCHEDULE = {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: []
};

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
    }

    loadState() {
        try {
            const savedSchedule = localStorage.getItem('curie_schedule');
            this.schedule = savedSchedule ? JSON.parse(savedSchedule) : JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));

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

        // Quick bell check timer every minute
        setInterval(() => this.updateCurrentLessonHighlight(), 60000);
    }

    setActiveDay(day) {
        this.activeDay = day;
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.day === day);
        });
        this.renderSchedule();
    }

    openAddLessonModal(day = null) {
        if (!this.isUserAdmin()) {
            alert('Только администратор может добавлять уроки!');
            return;
        }
        const modal = document.getElementById('lesson-modal');
        const modalTitle = document.getElementById('lesson-modal-title');
        const editIndexInput = document.getElementById('lesson-edit-index');
        const daySelect = document.getElementById('lesson-day-select');
        const subjectInput = document.getElementById('lesson-subject-input');
        const timeInput = document.getElementById('lesson-time-input');
        const roomInput = document.getElementById('lesson-room-input');

        if (modalTitle) modalTitle.innerText = '➕ Добавить урок';
        if (editIndexInput) editIndexInput.value = '-1';
        if (daySelect) daySelect.value = day || this.activeDay;
        if (subjectInput) subjectInput.value = '';
        if (timeInput) timeInput.value = '08:30 - 09:15';
        if (roomInput) roomInput.value = '';

        if (modal) modal.classList.add('active');
        if (window.soundEngine) window.soundEngine.playLaser();
    }

    openEditLessonModal(day, index) {
        if (!this.isUserAdmin()) {
            alert('Только администратор может изменять уроки!');
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

        if (modalTitle) modalTitle.innerText = '✏️ Редактировать урок';
        if (editIndexInput) editIndexInput.value = index;
        if (daySelect) daySelect.value = day;
        if (subjectInput) subjectInput.value = lesson.subject || '';
        if (timeInput) timeInput.value = lesson.time || '08:30 - 09:15';
        if (roomInput) roomInput.value = lesson.room || '';

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
                            <span class="lesson-room ${window.adminAbuse && window.adminAbuse.isLiveEdit ? 'editable' : ''}" data-field="room">Кабинет: <strong>${this.escapeHtml(l.room || '—')}</strong></span>
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
        const percent = total > 0 ? Math.round((done / total) * 100) : 100;

        const statText = document.getElementById('hw-stat-text');
        const progressBar = document.getElementById('hw-progress-bar');
        if (statText) statText.innerText = `${done} из ${total} выполнено (${percent}%)`;
        if (progressBar) progressBar.style.width = `${percent}%`;
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
