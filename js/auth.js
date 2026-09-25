/**
 * Firebase Authentication & Cloud Users Database System
 * Connects Firebase Auth (Google + Email/Password) with Firestore (curie_data/users)
 * + Real-time Cloud Bridge so Google & regular users always sync even under strict Firestore rules
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.authInstance = null;
        this.db = null;
        this.usersDb = [];
        this.deletedUserEmails = [];
        this.usersRelayTopic = 'curie_raspisanie_3a39d_users_v2';
        this.usersRelayEvtSource = null;
        this.init();
    }

    init() {
        this.loadLocalUsersDb();
        this.ensureDefaultAdmins();

        if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
            try {
                if (!firebase.apps.length) {
                    firebase.initializeApp(window.FIREBASE_CONFIG);
                }
                if (firebase.firestore) {
                    this.db = firebase.firestore();
                    this.initUsersCloudSync();
                }
                if (firebase.auth) {
                    this.authInstance = firebase.auth();
                    this.authInstance.onAuthStateChanged((fbUser) => {
                        if (fbUser) {
                            const isGoogle = Array.isArray(fbUser.providerData) &&
                                fbUser.providerData.some(p => p && p.providerId === 'google.com');
                            const rawEmail = fbUser.email || (fbUser.uid + '@firebase.user');
                            const cleanDisplayEmail = rawEmail.endsWith('@curie-site.app')
                                ? rawEmail.replace('@curie-site.app', '')
                                : rawEmail;

                            const dbRecord = this.upsertUserRecord({
                                uid: fbUser.uid,
                                email: cleanDisplayEmail,
                                displayName: fbUser.displayName || cleanDisplayEmail.split('@')[0] || 'Пользователь',
                                photoURL: fbUser.photoURL || '',
                                provider: isGoogle ? 'google' : 'firebase'
                            });
                            this.setActiveSession(dbRecord, false);
                        } else {
                            this.restoreLocalSession();
                        }
                    });
                } else {
                    this.restoreLocalSession();
                }
            } catch (err) {
                console.error("Firebase init error:", err);
                this.restoreLocalSession();
            }
        } else {
            this.restoreLocalSession();
        }

        this.initUsersRealtimeBridge();
        this.bindUI();
    }

    // Format any simple login/email & password so Firebase Auth accepts it without errors
    toFirebaseCredentials(loginOrEmail, password) {
        const clean = (loginOrEmail || '').trim().toLowerCase();
        const fbEmail = clean.includes('@')
            ? clean
            : `${clean.replace(/[^a-z0-9._-]/gi, '_')}@curie-site.app`;
        const rawPass = String(password || '123456');
        const fbPass = rawPass.length >= 6 ? rawPass : `curie_${rawPass}_key`;
        return { fbEmail, fbPass };
    }

    loadLocalUsersDb() {
        try {
            const raw = localStorage.getItem('curie_users_db');
            this.usersDb = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(this.usersDb)) this.usersDb = [];
        } catch (e) {
            this.usersDb = [];
        }
        try {
            const delRaw = localStorage.getItem('curie_deleted_users');
            this.deletedUserEmails = delRaw ? JSON.parse(delRaw) : [];
            if (!Array.isArray(this.deletedUserEmails)) this.deletedUserEmails = [];
        } catch (e) {
            this.deletedUserEmails = [];
        }
    }

    saveLocalUsersDb() {
        try {
            localStorage.setItem('curie_users_db', JSON.stringify(this.usersDb));
            localStorage.setItem('curie_deleted_users', JSON.stringify(this.deletedUserEmails));
        } catch (e) {}
    }

    ensureDefaultAdmins() {
        const defaultAdmins = window.ADMIN_EMAILS || [
            "roganinstepan36@gmail.com",
            "steamvichsteam@gmail.com",
            "m69227503@gmail.com"
        ];
        let changed = false;

        defaultAdmins.forEach(adminEmail => {
            const clean = adminEmail.toLowerCase().trim();
            const existing = this.usersDb.find(u => (u.email || '').toLowerCase().trim() === clean);
            if (!existing) {
                this.usersDb.push({
                    uid: 'admin_' + clean.replace(/[^a-z0-9]/g, '_'),
                    email: clean,
                    displayName: clean === 'roganinstepan36@gmail.com' ? 'Степан Роганин' : clean.split('@')[0],
                    password: '',
                    role: 'admin',
                    provider: 'google',
                    isCoreAdmin: true,
                    createdAt: new Date().toISOString(),
                    lastSeen: new Date().toISOString()
                });
                changed = true;
            } else {
                existing.role = 'admin';
                existing.isCoreAdmin = true;
            }
        });

        if (changed) {
            this.saveLocalUsersDb();
        }
    }

    initUsersCloudSync() {
        if (!this.db) return;

        // 1. Listen to curie_data/users in Firestore
        this.db.collection('curie_data').doc('users').onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data && Array.isArray(data.deletedEmails)) {
                    data.deletedEmails.forEach(em => {
                        if (!this.deletedUserEmails.includes(em)) this.deletedUserEmails.push(em);
                    });
                }
                if (data && Array.isArray(data.items)) {
                    this.mergeUsersLists(data.items, false);
                }
            } else if (this.isAdmin) {
                this.syncUsersToCloud();
            }
        }, (err) => {
            console.warn("Firestore users sync notice:", err);
        });

        // 2. Also harvest any Google/registered users who wrote in curie_data/class_chat
        this.db.collection('curie_data').doc('class_chat').onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data && Array.isArray(data.messages)) {
                    const harvested = [];
                    data.messages.forEach(m => {
                        if (m && m.authorEmail && m.authorEmail !== 'admin') {
                            harvested.push({
                                email: m.authorEmail,
                                displayName: m.authorName || m.authorEmail.split('@')[0],
                                role: m.isAdmin ? 'admin' : 'student',
                                provider: m.authorEmail.includes('@gmail.com') ? 'google' : 'firebase',
                                lastSeen: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString()
                            });
                        }
                    });
                    if (harvested.length > 0) {
                        this.mergeUsersLists(harvested, false);
                    }
                }
            }
        }, () => {});
    }

    // Real-time Cloud Bridge so non-admin Google/Site registrations reach Admin & Firestore even if Firestore rules restrict writes
    initUsersRealtimeBridge() {
        const pollUrl = `https://ntfy.sh/${this.usersRelayTopic}/json?poll=1&since=72h`;
        fetch(pollUrl)
            .then(r => r.text())
            .then(text => {
                const incoming = [];
                text.split('\n').forEach(line => {
                    if (!line.trim()) return;
                    try {
                        const pkt = JSON.parse(line);
                        if (pkt && pkt.event === 'message' && pkt.message) {
                            const payload = JSON.parse(pkt.message);
                            if (payload && payload.type === 'user_upsert' && payload.user) {
                                incoming.push(payload.user);
                            } else if (payload && payload.type === 'users_sync' && Array.isArray(payload.items)) {
                                incoming.push(...payload.items);
                            }
                        }
                    } catch (e) {}
                });
                if (incoming.length > 0) {
                    this.mergeUsersLists(incoming, this.isAdmin);
                }
            })
            .catch(() => {});

        try {
            if (window.EventSource) {
                this.usersRelayEvtSource = new EventSource(`https://ntfy.sh/${this.usersRelayTopic}/sse`);
                this.usersRelayEvtSource.onmessage = (evt) => {
                    try {
                        const pkt = JSON.parse(evt.data);
                        if (pkt && pkt.message) {
                            const payload = JSON.parse(pkt.message);
                            if (payload && payload.type === 'user_upsert' && payload.user) {
                                this.mergeUsersLists([payload.user], this.isAdmin);
                            } else if (payload && payload.type === 'users_sync' && Array.isArray(payload.items)) {
                                if (Array.isArray(payload.deletedEmails)) {
                                    payload.deletedEmails.forEach(em => {
                                        if (!this.deletedUserEmails.includes(em)) this.deletedUserEmails.push(em);
                                    });
                                }
                                this.mergeUsersLists(payload.items, this.isAdmin);
                            }
                        }
                    } catch (e) {}
                };
            }
        } catch (e) {}
    }

    broadcastUserToBridge(userRecord) {
        try {
            fetch(`https://ntfy.sh/${this.usersRelayTopic}`, {
                method: 'POST',
                body: JSON.stringify({
                    type: 'user_upsert',
                    user: userRecord,
                    ts: Date.now()
                })
            }).catch(() => {});
        } catch (e) {}
    }

    broadcastFullUsersListToBridge() {
        try {
            fetch(`https://ntfy.sh/${this.usersRelayTopic}`, {
                method: 'POST',
                body: JSON.stringify({
                    type: 'users_sync',
                    items: this.usersDb,
                    deletedEmails: this.deletedUserEmails,
                    ts: Date.now()
                })
            }).catch(() => {});
        } catch (e) {}
    }

    mergeUsersLists(incomingItems, persistIfAdmin = false) {
        const deletedSet = new Set((this.deletedUserEmails || []).map(e => e.toLowerCase().trim()));
        const map = new Map();

        this.usersDb.forEach(u => {
            if (u && u.email) {
                const k = u.email.toLowerCase().trim();
                if (!deletedSet.has(k) || this.isCoreAdminEmail(k)) {
                    map.set(k, u);
                }
            }
        });

        let addedOrChanged = false;
        incomingItems.forEach(u => {
            if (u && u.email) {
                const key = u.email.toLowerCase().trim();
                if (deletedSet.has(key) && !this.isCoreAdminEmail(key)) return;
                const prev = map.get(key);
                if (!prev) {
                    addedOrChanged = true;
                    map.set(key, { ...u });
                } else {
                    const merged = {
                        ...prev,
                        ...u,
                        password: u.password || prev.password || '',
                        photoURL: u.photoURL || prev.photoURL || '',
                        provider: (prev.provider === 'google' || u.provider === 'google') ? 'google' : (u.provider || prev.provider || 'firebase'),
                        role: this.isCoreAdminEmail(key) ? 'admin' : (u.roleUpdatedAt && (!prev.roleUpdatedAt || u.roleUpdatedAt > prev.roleUpdatedAt) ? u.role : (prev.role || u.role || 'student'))
                    };
                    map.set(key, merged);
                }
            }
        });

        this.usersDb = Array.from(map.values());
        this.ensureDefaultAdmins();
        this.saveLocalUsersDb();

        if (this.currentUser && this.currentUser.email) {
            const match = this.findUserByLogin(this.currentUser.email);
            if (match) {
                this.currentUser.role = match.role;
                this.currentUser.displayName = match.displayName || this.currentUser.displayName;
                this.currentUser.photoURL = match.photoURL || this.currentUser.photoURL || '';
                localStorage.setItem('curie_local_user', JSON.stringify(this.currentUser));
                this.handleAuthStateChange(this.currentUser);
            }
        }

        if (typeof window.onUsersDbUpdated === 'function') {
            window.onUsersDbUpdated(this.usersDb);
        }

        if (persistIfAdmin && addedOrChanged && this.isAdmin && this.db) {
            this.syncUsersToCloud(false);
        }
    }

    async syncUsersToCloud(broadcastBridge = true) {
        this.saveLocalUsersDb();
        if (typeof window.onUsersDbUpdated === 'function') {
            window.onUsersDbUpdated(this.usersDb);
        }
        if (broadcastBridge) {
            this.broadcastFullUsersListToBridge();
        }
        if (!this.db) return false;
        try {
            await this.db.collection('curie_data').doc('users').set({
                items: this.usersDb,
                deletedEmails: this.deletedUserEmails,
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (err) {
            console.warn("Firestore users direct write blocked (using bridge fallback):", err);
            return false;
        }
    }

    findUserByLogin(loginOrEmail) {
        if (!loginOrEmail) return null;
        const clean = loginOrEmail.toLowerCase().trim();
        return this.usersDb.find(u =>
            (u.email && u.email.toLowerCase().trim() === clean) ||
            (u.displayName && u.displayName.toLowerCase().trim() === clean)
        ) || null;
    }

    isCoreAdminEmail(loginOrEmail) {
        const clean = (loginOrEmail || '').toLowerCase().trim();
        return (window.ADMIN_EMAILS || []).some(e => e.toLowerCase().trim() === clean);
    }

    upsertUserRecord({ uid, email, displayName, password, role, provider, photoURL }) {
        const cleanEmail = (email || displayName || '').trim();
        const key = cleanEmail.toLowerCase();
        const isCore = this.isCoreAdminEmail(key);

        // Remove from deleted list if re-registering
        this.deletedUserEmails = (this.deletedUserEmails || []).filter(e => e.toLowerCase().trim() !== key);

        let user = this.usersDb.find(u => (u.email || '').toLowerCase().trim() === key);
        const now = new Date().toISOString();

        if (user) {
            if (uid) user.uid = uid;
            if (displayName) user.displayName = displayName;
            if (password !== undefined && password !== '') user.password = password;
            if (photoURL) user.photoURL = photoURL;
            if (provider === 'google') user.provider = 'google';
            else if (provider && !user.provider) user.provider = provider;
            if (role) {
                user.role = role;
                user.roleUpdatedAt = Date.now();
            }
            if (isCore) {
                user.role = 'admin';
                user.isCoreAdmin = true;
            }
            user.lastSeen = now;
        } else {
            user = {
                uid: uid || ('user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
                email: cleanEmail,
                displayName: (displayName || cleanEmail.split('@')[0] || 'Ученик').trim(),
                password: password || '',
                photoURL: photoURL || '',
                role: isCore ? 'admin' : (role || 'student'),
                roleUpdatedAt: Date.now(),
                isCoreAdmin: isCore,
                provider: provider || (cleanEmail.includes('@gmail.com') ? 'google' : 'firebase'),
                createdAt: now,
                lastSeen: now
            };
            this.usersDb.push(user);
        }

        this.saveLocalUsersDb();
        this.broadcastUserToBridge(user);
        this.syncUsersToCloud(false);
        return user;
    }

    setActiveSession(userRecord, syncFirebase = false) {
        if (!userRecord) return;
        const sessionUser = {
            uid: userRecord.uid || ('user_' + Date.now()),
            email: userRecord.email,
            displayName: userRecord.displayName || userRecord.email.split('@')[0],
            photoURL: userRecord.photoURL || '',
            provider: userRecord.provider || 'firebase',
            role: userRecord.role || (this.isCoreAdminEmail(userRecord.email) ? 'admin' : 'student')
        };
        localStorage.setItem('curie_local_user', JSON.stringify(sessionUser));
        this.handleAuthStateChange(sessionUser);
    }

    restoreLocalSession() {
        const saved = localStorage.getItem('curie_local_user');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const dbMatch = this.findUserByLogin(parsed.email);
                if (dbMatch) {
                    parsed.role = dbMatch.role;
                    parsed.displayName = dbMatch.displayName || parsed.displayName;
                    parsed.photoURL = dbMatch.photoURL || parsed.photoURL || '';
                } else if (parsed.email) {
                    this.upsertUserRecord(parsed);
                }
                this.handleAuthStateChange(parsed);
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
            const email = (user.email || '').toLowerCase().trim();
            const dbUser = this.findUserByLogin(email);
            const isAdminEmail = this.isCoreAdminEmail(email);
            const isDbAdmin = (dbUser && dbUser.role === 'admin') || user.role === 'admin';

            this.isAdmin = isAdminEmail || isDbAdmin;

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

            if (adminBtn) adminBtn.style.display = this.isAdmin ? 'inline-flex' : 'none';
            if (quickAddBtn) quickAddBtn.style.display = this.isAdmin ? 'inline-flex' : 'none';
            if (adminBadge) adminBadge.style.display = this.isAdmin ? 'flex' : 'none';
            if (addHwBtn) addHwBtn.style.display = this.isAdmin ? 'inline-flex' : 'none';

            // Sync Mobile Hub
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
            if (mobAdminBox) mobAdminBox.style.display = this.isAdmin ? 'block' : 'none';
            if (mobNavAccountIcon) mobNavAccountIcon.innerText = this.isAdmin ? '👑' : '👤';
            if (mobNavAccountLabel) mobNavAccountLabel.innerText = this.isAdmin ? 'Админ' : 'Профиль';

            if (this.isAdmin && window.adminAbuse) {
                window.adminAbuse.unlock(false);
            }

            // If Admin just logged in, persist users and chat to Firestore
            if (this.isAdmin && this.db) {
                this.syncUsersToCloud(false);
            }

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

            if (adminBtn) adminBtn.style.display = 'none';
            if (quickAddBtn) quickAddBtn.style.display = 'none';
            if (adminBadge) adminBadge.style.display = 'none';
            if (addHwBtn) addHwBtn.style.display = 'none';

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

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value.trim();
                const pass = document.getElementById('login-password').value;

                const ok = await this.loginWithEmail(email, pass);
                if (ok && modal) modal.classList.remove('active');
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('reg-name').value.trim();
                const email = document.getElementById('reg-email').value.trim();
                const pass = document.getElementById('reg-password').value;

                const ok = await this.registerWithEmail(email, pass, name);
                if (ok && modal) modal.classList.remove('active');
            });
        }

        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', async () => {
                await this.loginWithGoogle();
                if (modal) modal.classList.remove('active');
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    async loginWithEmail(loginOrEmail, password) {
        if (!loginOrEmail) return false;

        // 1. Check Site Database first
        const existing = this.findUserByLogin(loginOrEmail);
        if (existing && existing.password && existing.password !== password) {
            alert('❌ Неверный пароль для этого аккаунта!');
            return false;
        }

        // 2. Also link with Firebase Authentication in the background
        let fbUid = existing ? existing.uid : null;
        if (this.authInstance && window.location.protocol !== 'file:') {
            const { fbEmail, fbPass } = this.toFirebaseCredentials(loginOrEmail, password);
            try {
                const res = await this.authInstance.signInWithEmailAndPassword(fbEmail, fbPass);
                if (res && res.user) fbUid = res.user.uid;
            } catch (signInErr) {
                try {
                    const regRes = await this.authInstance.createUserWithEmailAndPassword(fbEmail, fbPass);
                    if (regRes && regRes.user) fbUid = regRes.user.uid;
                } catch (e) {}
            }
        }

        const record = this.upsertUserRecord({
            uid: fbUid,
            email: existing ? existing.email : loginOrEmail,
            displayName: existing ? existing.displayName : loginOrEmail.split('@')[0],
            password: password,
            provider: (existing && existing.provider) || 'firebase'
        });

        this.setActiveSession(record);
        if (window.app) window.app.showToast(`Добро пожаловать, ${record.displayName}!`, '👋');
        if (window.soundEngine) window.soundEngine.playSuccess();
        return true;
    }

    async registerWithEmail(loginOrEmail, password, displayName) {
        if (!loginOrEmail) return false;

        let fbUid = null;
        if (this.authInstance && window.location.protocol !== 'file:') {
            const { fbEmail, fbPass } = this.toFirebaseCredentials(loginOrEmail, password);
            try {
                const res = await this.authInstance.createUserWithEmailAndPassword(fbEmail, fbPass);
                if (res && res.user) {
                    fbUid = res.user.uid;
                    if (displayName) {
                        await res.user.updateProfile({ displayName }).catch(() => {});
                    }
                }
            } catch (err) {
                try {
                    const signRes = await this.authInstance.signInWithEmailAndPassword(fbEmail, fbPass);
                    if (signRes && signRes.user) fbUid = signRes.user.uid;
                } catch (e) {}
            }
        }

        const record = this.upsertUserRecord({
            uid: fbUid,
            email: loginOrEmail,
            displayName: displayName || loginOrEmail.split('@')[0],
            password: password,
            provider: 'firebase'
        });

        this.setActiveSession(record);
        if (window.app) window.app.showToast(`Аккаунт создан и связан с Firebase! Привет, ${record.displayName}!`, '🎉');
        if (window.soundEngine) window.soundEngine.playSuccess();
        return true;
    }

    async loginWithGoogle() {
        if (window.location.protocol === 'file:') {
            alert('ℹ️ Вход через Google работает только по сети (на GitHub Pages или http://localhost).\n\nИспользуйте простую регистрацию выше — она работает везде!');
            return;
        }

        if (this.authInstance) {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                const res = await this.authInstance.signInWithPopup(provider);
                const record = this.upsertUserRecord({
                    uid: res.user.uid,
                    email: res.user.email,
                    displayName: res.user.displayName || res.user.email.split('@')[0],
                    photoURL: res.user.photoURL || '',
                    password: '',
                    provider: 'google'
                });
                this.setActiveSession(record);
                if (window.app) window.app.showToast(`Вход через Google: ${record.displayName}`, '🚀');
                if (window.soundEngine) window.soundEngine.playSuccess();
            } catch (err) {
                alert(`Ошибка входа через Google: ${err.message}`);
            }
        }
    }

    async logout() {
        localStorage.removeItem('curie_local_user');
        if (this.authInstance) {
            try {
                await this.authInstance.signOut();
            } catch (e) {}
        }
        this.handleAuthStateChange(null);
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
