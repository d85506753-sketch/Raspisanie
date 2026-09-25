/**
 * Firebase Authentication & User Account System
 * Supports Email/Password, Google Sign-in, and Role Checking (Admin vs Student)
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.authInstance = null;
        this.init();
    }

    init() {
        if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
            try {
                if (!firebase.apps.length) {
                    firebase.initializeApp(window.FIREBASE_CONFIG);
                }
                this.authInstance = firebase.auth();
                this.authInstance.onAuthStateChanged((user) => this.handleAuthStateChange(user));
            } catch (err) {
                console.error("Firebase init error:", err);
                this.initLocalFallback();
            }
        } else {
            console.log("Firebase is not configured yet. Running in offline/demo mode.");
            this.initLocalFallback();
        }

        this.bindUI();
    }

    initLocalFallback() {
        // Load local user from localStorage if exists
        const saved = localStorage.getItem('curie_local_user');
        if (saved) {
            try {
                this.handleAuthStateChange(JSON.parse(saved));
            } catch (e) {
                this.handleAuthStateChange(null);
            }
        } else {
            this.handleAuthStateChange(null);
        }
    }

    handleAuthStateChange(user) {
        this.currentUser = user;

        const authBtn = document.getElementById('header-auth-btn');
        const userBadge = document.getElementById('header-user-badge');
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const userRole = document.getElementById('user-role');
        const adminBtn = document.getElementById('open-admin-btn');
        const quickAddBtn = document.getElementById('quick-add-lesson-btn');
        const adminBadge = document.getElementById('admin-badge-indicator');
        const addHwBtn = document.getElementById('add-hw-btn');

        if (user) {
            // Check if user is Admin
            const email = (user.email || '').toLowerCase().trim();
            const adminList = (window.ADMIN_EMAILS || []).map(e => e.toLowerCase().trim());
            const isAdminEmail = adminList.includes(email);
            const isLocalAdmin = user.role === 'admin';

            this.isAdmin = isAdminEmail || isLocalAdmin;

            if (authBtn) authBtn.style.display = 'none';
            if (userBadge) {
                userBadge.style.display = 'flex';
                if (userAvatar) userAvatar.innerText = (user.displayName || user.email || 'U')[0].toUpperCase();
                if (userName) userName.innerText = user.displayName || user.email.split('@')[0];
                if (userRole) {
                    userRole.innerText = this.isAdmin ? '👑 Админ' : '🎓 Ученик';
                    userRole.className = `role-badge ${this.isAdmin ? 'admin-role' : 'student-role'}`;
                    if (this.isAdmin) {
                        userRole.style.cursor = 'pointer';
                        userRole.title = 'Нажмите, чтобы открыть Панель Админа';
                        userRole.onclick = () => {
                            if (window.adminAbuse) window.adminAbuse.openModal();
                        };
                    } else {
                        userRole.style.cursor = 'default';
                        userRole.title = '';
                        userRole.onclick = null;
                    }
                }
            }

            // REVEAL ADMIN BUTTONS ONLY IF ADMIN
            if (adminBtn) {
                adminBtn.style.display = this.isAdmin ? 'inline-flex' : 'none';
            }
            if (quickAddBtn) {
                quickAddBtn.style.display = this.isAdmin ? 'inline-flex' : 'none';
            }
            if (adminBadge) {
                adminBadge.style.display = this.isAdmin ? 'flex' : 'none';
            }
            if (addHwBtn) {
                addHwBtn.style.display = this.isAdmin ? 'inline-flex' : 'none';
            }

            // Sync Mobile Hub (3rd tab: Account & Admin Panel)
            const mobGuest = document.getElementById('mob-hub-guest');
            const mobUser = document.getElementById('mob-hub-user');
            const mobAvatar = document.getElementById('mob-hub-avatar');
            const mobName = document.getElementById('mob-hub-name');
            const mobEmail = document.getElementById('mob-hub-email');
            const mobRole = document.getElementById('mob-hub-role');
            const mobAdminBox = document.getElementById('mob-hub-admin-box');
            const mobNavAccountIcon = document.getElementById('mob-nav-account-icon');
            const mobNavAccountLabel = document.getElementById('mob-nav-account-label');

            if (mobGuest) mobGuest.style.display = 'none';
            if (mobUser) mobUser.style.display = 'flex';
            if (mobAvatar) mobAvatar.innerText = (user.displayName || user.email || 'U')[0].toUpperCase();
            if (mobName) mobName.innerText = user.displayName || (user.email ? user.email.split('@')[0] : 'Пользователь');
            if (mobEmail) mobEmail.innerText = user.email || '';
            if (mobRole) {
                mobRole.innerText = this.isAdmin ? '👑 Админ' : '🎓 Ученик';
                mobRole.className = `role-badge ${this.isAdmin ? 'admin-role' : 'student-role'}`;
            }
            if (mobAdminBox) {
                mobAdminBox.style.display = this.isAdmin ? 'block' : 'none';
            }
            if (mobNavAccountIcon) {
                mobNavAccountIcon.innerText = this.isAdmin ? '👑' : '👤';
            }
            if (mobNavAccountLabel) {
                mobNavAccountLabel.innerText = this.isAdmin ? 'Админ' : 'Профиль';
            }

            // Auto-unlock admin abuse panel
            if (this.isAdmin && window.adminAbuse) {
                window.adminAbuse.unlock(false);
            }

            // Auto-seed cloud schedule if cloud is empty
            if (this.isAdmin && window.app && window.app.db) {
                window.app.db.collection('curie_data').doc('schedule').get().then(doc => {
                    if (!doc.exists) {
                        window.app.syncAllToFirestore(false);
                    }
                }).catch(() => {});
            }

            const chatLockPill = document.getElementById('header-chat-lock-pill');
            if (chatLockPill) chatLockPill.innerText = '🟢';

            if (window.app) {
                window.app.renderSchedule();
                window.app.renderHomework();
                if (typeof window.app.syncClassChatAuthUI === 'function') {
                    window.app.syncClassChatAuthUI();
                }
            }
        } else {
            this.isAdmin = false;
            if (authBtn) authBtn.style.display = 'inline-flex';
            if (userBadge) userBadge.style.display = 'none';

            // Hidden for guests
            if (adminBtn) adminBtn.style.display = 'none';
            if (quickAddBtn) quickAddBtn.style.display = 'none';
            if (adminBadge) adminBadge.style.display = 'none';
            if (addHwBtn) addHwBtn.style.display = 'none';

            // Sync Mobile Hub for Guest
            const mobGuest = document.getElementById('mob-hub-guest');
            const mobUser = document.getElementById('mob-hub-user');
            const mobAdminBox = document.getElementById('mob-hub-admin-box');
            const mobNavAccountIcon = document.getElementById('mob-nav-account-icon');
            const mobNavAccountLabel = document.getElementById('mob-nav-account-label');
            const chatLockPill = document.getElementById('header-chat-lock-pill');

            if (mobGuest) mobGuest.style.display = 'flex';
            if (mobUser) mobUser.style.display = 'none';
            if (mobAdminBox) mobAdminBox.style.display = 'none';
            if (mobNavAccountIcon) mobNavAccountIcon.innerText = '👤';
            if (mobNavAccountLabel) mobNavAccountLabel.innerText = 'Кабинет';
            if (chatLockPill) chatLockPill.innerText = '🔒';

            if (window.adminAbuse) {
                window.adminAbuse.isAuthenticated = false;
            }

            if (window.app) {
                window.app.renderSchedule();
                window.app.renderHomework();
                if (typeof window.app.syncClassChatAuthUI === 'function') {
                    window.app.syncClassChatAuthUI();
                }
            }
        }
    }

    bindUI() {
        const authBtn = document.getElementById('header-auth-btn');
        const logoutBtn = document.getElementById('user-logout-btn');
        const modal = document.getElementById('auth-modal');
        const closeBtn = document.getElementById('close-auth-modal');

        const loginTabBtn = document.getElementById('tab-login-btn');
        const registerTabBtn = document.getElementById('tab-register-btn');
        const loginForm = document.getElementById('auth-login-form');
        const registerForm = document.getElementById('auth-register-form');
        const googleLoginBtn = document.getElementById('google-login-btn');

        if (authBtn && modal) {
            authBtn.addEventListener('click', () => modal.classList.add('active'));
        }
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }

        // Tab Switching
        if (loginTabBtn && registerTabBtn) {
            loginTabBtn.addEventListener('click', () => {
                loginTabBtn.classList.add('active');
                registerTabBtn.classList.remove('active');
                if (loginForm) loginForm.style.display = 'block';
                if (registerForm) registerForm.style.display = 'none';
            });
            registerTabBtn.addEventListener('click', () => {
                registerTabBtn.classList.add('active');
                loginTabBtn.classList.remove('active');
                if (registerForm) registerForm.style.display = 'block';
                if (loginForm) loginForm.style.display = 'none';
            });
        }

        // Login Submit
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value.trim();
                const pass = document.getElementById('login-password').value;

                await this.loginWithEmail(email, pass);
                if (modal) modal.classList.remove('active');
            });
        }

        // Register Submit
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('reg-name').value.trim();
                const email = document.getElementById('reg-email').value.trim();
                const pass = document.getElementById('reg-password').value;

                await this.registerWithEmail(email, pass, name);
                if (modal) modal.classList.remove('active');
            });
        }

        // Google Login
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', async () => {
                await this.loginWithGoogle();
                if (modal) modal.classList.remove('active');
            });
        }

        // Logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    async loginWithEmail(email, password) {
        if (this.authInstance && window.location.protocol !== 'file:') {
            try {
                const res = await this.authInstance.signInWithEmailAndPassword(email, password);
                if (window.app) window.app.showToast(`Добро пожаловать, ${res.user.email}!`, '👋');
                if (window.soundEngine) window.soundEngine.playSuccess();
            } catch (err) {
                // If protocol error, fallback to local
                if (err.code === 'auth/operation-not-supported-in-this-environment') {
                    this.executeLocalLogin(email);
                } else {
                    alert(`Ошибка входа: ${err.message}`);
                }
            }
        } else {
            this.executeLocalLogin(email);
        }
    }

    async registerWithEmail(email, password, displayName) {
        if (this.authInstance && window.location.protocol !== 'file:') {
            try {
                const res = await this.authInstance.createUserWithEmailAndPassword(email, password);
                if (displayName) {
                    await res.user.updateProfile({ displayName });
                }
                if (window.app) window.app.showToast(`Аккаунт создан! Привет, ${displayName || email}!`, '🎉');
                if (window.soundEngine) window.soundEngine.playSuccess();
            } catch (err) {
                if (err.code === 'auth/operation-not-supported-in-this-environment') {
                    this.executeLocalRegister(email, displayName);
                } else {
                    alert(`Ошибка регистрации: ${err.message}`);
                }
            }
        } else {
            this.executeLocalRegister(email, displayName);
        }
    }

    executeLocalLogin(email) {
        const isAdmin = (window.ADMIN_EMAILS || []).some(e => e.toLowerCase() === email.toLowerCase());
        const fakeUser = {
            uid: 'local_' + Date.now(),
            email,
            displayName: email.split('@')[0],
            role: isAdmin ? 'admin' : 'student'
        };
        localStorage.setItem('curie_local_user', JSON.stringify(fakeUser));
        this.handleAuthStateChange(fakeUser);
        if (window.app) window.app.showToast(`Вход выполнен: ${email}`, '👋');
        if (window.soundEngine) window.soundEngine.playSuccess();
    }

    executeLocalRegister(email, displayName) {
        const isAdmin = (window.ADMIN_EMAILS || []).some(e => e.toLowerCase() === email.toLowerCase());
        const fakeUser = {
            uid: 'local_' + Date.now(),
            email,
            displayName: displayName || email.split('@')[0],
            role: isAdmin ? 'admin' : 'student'
        };
        localStorage.setItem('curie_local_user', JSON.stringify(fakeUser));
        this.handleAuthStateChange(fakeUser);
        if (window.app) window.app.showToast(`Аккаунт зарегистрирован: ${fakeUser.displayName}!`, '🎉');
        if (window.soundEngine) window.soundEngine.playSuccess();
    }

    async loginWithGoogle() {
        if (window.location.protocol === 'file:') {
            alert('ℹ️ Вход через Google работает только по сети (на GitHub Pages или http://localhost), потому что Google блокирует OAuth при открытии локального файла (file:///).\n\nНа GitHub Pages он будет работать!\nА для проверки локально: введите любой email и пароль во вкладках "Войти" или "Регистрация".');
            return;
        }

        if (this.authInstance) {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                const res = await this.authInstance.signInWithPopup(provider);
                if (window.app) window.app.showToast(`Вход через Google: ${res.user.displayName}`, '🚀');
                if (window.soundEngine) window.soundEngine.playSuccess();
            } catch (err) {
                alert(`Ошибка входа через Google: ${err.message}`);
            }
        }
    }

    async logout() {
        if (this.authInstance) {
            await this.authInstance.signOut();
        } else {
            localStorage.removeItem('curie_local_user');
            this.handleAuthStateChange(null);
        }
        this.isAdmin = false;
        if (window.adminAbuse) {
            window.adminAbuse.isAuthenticated = false;
        }
        if (window.app) {
            window.app.renderSchedule();
            window.app.renderHomework();
            window.app.showToast('Вы вышли из аккаунта', '🔒');
        }
    }

    // Force reveal admin button (called by secret gesture taco/Ctrl+Shift+A)
    revealAdminButton() {
        const adminBtn = document.getElementById('open-admin-btn');
        if (adminBtn) {
            adminBtn.style.display = 'inline-flex';
            adminBtn.classList.add('admin-glow');
        }
    }
}

// Global Auth instance
window.authManager = new AuthManager();
