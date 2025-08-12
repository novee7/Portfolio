    const chkMiniOut = document.getElementById('settingMiniOut');
    if (chkMiniOut) {
        const isMobile = window.matchMedia('(max-width: 600px)').matches;
        if (isMobile) {
            chkMiniOut.checked = false;
            chkMiniOut.disabled = true;
            localStorage.setItem('setting:miniOut', 'false');
        } else {
            chkMiniOut.disabled = false;
        }
    }
async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {}
    }
    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return true;
    } catch (e) {
        return false;
    }
}
let songs = [];
let currentSong = 0;
let lastPlayedSongs = [];
const audio = document.getElementById('audio');
audio.volume = 0.10;
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');

function getRandomSong() {
    const indices = songs.map((_, i) => i).filter(i => i !== currentSong);
    const songIndex = indices[Math.floor(Math.random() * Math.max(1, indices.length))] ?? currentSong;
    lastPlayedSongs.push(songIndex);
    return songIndex;
}

volumeSlider.value = audio.volume * 100;

function updateVolumeSliderBg(val) {
    const percent = val;
    const color1 = '#ffd277';
    const color2 = '#444';
    volumeSlider.style.background = `linear-gradient(90deg, ${color1} 0%, ${color1} ${percent}%, ${color2} ${percent}%, ${color2} 100%)`;
}

volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    audio.volume = value / 100;
    updateVolumeIcon(value);
    updateVolumeSliderBg(value);
});

updateVolumeSliderBg(volumeSlider.value);

let previousVolume = 0.10;

function updateVolumeIcon(value) {
    const icon = volumeBtn.querySelector('svg');
    if (value == 0) {
        icon.innerHTML = '<path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"/>';
    } else if (value < 50) {
        icon.innerHTML = '<path d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"/>';
    } else {
        icon.innerHTML = '<path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>';
    }
}

volumeBtn.addEventListener('click', () => {
    if (audio.volume > 0) {
        previousVolume = audio.volume;
        audio.volume = 0;
        volumeSlider.value = 0;
        updateVolumeSliderBg(0);
    } else {
        audio.volume = previousVolume;
        volumeSlider.value = previousVolume * 100;
        updateVolumeSliderBg(volumeSlider.value);
    }
    updateVolumeIcon(volumeSlider.value);
});

const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const rewind5Btn = document.getElementById('rewind5Btn');
const forward5Btn = document.getElementById('forward5Btn');
const progressBar = document.getElementById('progressBar');
const progressContainer = progressBar.parentElement;
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const albumCover = document.getElementById('albumCover');

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    if (e.code === 'Space') {
    e.preventDefault();
        if (audio.paused) {
            audio.play();
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
        } else {
            audio.pause();
            playBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
        }
    }
});

let isDragging = false;
let dragPointerId = null;
progressContainer.addEventListener('pointerdown', (e) => {
    dragPointerId = e.pointerId;
    isDragging = true;
    progressContainer.setPointerCapture?.(dragPointerId);
    updateProgress(e);
});

progressContainer.addEventListener('pointermove', (e) => {
    if (!isDragging || (dragPointerId !== null && e.pointerId !== dragPointerId)) return;
    updateProgress(e);
});

const endDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    if (dragPointerId !== null) {
        try { progressContainer.releasePointerCapture?.(dragPointerId); } catch(_) {}
    }
    dragPointerId = null;
};
progressContainer.addEventListener('pointerup', endDrag);
progressContainer.addEventListener('pointercancel', endDrag);

function updateProgress(e) {
    const progressRect = progressContainer.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const percent = (clientX - progressRect.left) / progressRect.width;
    const time = percent * audio.duration;
    if (!isNaN(time)) {
        audio.currentTime = Math.min(Math.max(time, 0), audio.duration);
        progressBar.style.width = `${percent * 100}%`;
    }
}


const MANUAL_PLAYLISTS = {
    it: [
        { title: 'Comfort', artist: 'Slings (feat. TonyBoy)', src: 'mp3/it/songs/song1.mp3', cover: 'mp3/it/cover/cover1.jpg' },
        { title: 'Stare Senza', artist: 'Glocky (feat. Fashion Forty)', src: 'mp3/it/songs/song2.mp3', cover: 'mp3/it/cover/cover2.jpg' },
        { title: 'Wet', artist: 'TonyBot (feat. Glocky)', src: 'mp3/it/songs/song3.mp3', cover: 'mp3/it/cover/cover3.jpg' },
        { title: 'EVIL TWINS 2', artist: 'Sadturs, KIID (feat. Melons, Faneto)', src: 'mp3/it/songs/song4.mp3', cover: 'mp3/it/cover/cover4.jpg' },
        { title: 'SPOILER 2', artist: 'Niky Savage (feat. 22simba)', src: 'mp3/it/songs/song5.mp3', cover: 'mp3/it/cover/cover5.jpg' },
        { title: 'PLAYA', artist: 'Zefe', src: 'mp3/it/songs/song6.mp3', cover: 'mp3/it/cover/cover6.jpg' },
        { title: 'A casa del ladro', artist: 'TonyBoy (feat. Rafilù, Kevin)', src: 'mp3/it/songs/song7.mp3', cover: 'mp3/it/cover/cover7.jpg' },
    ],
    en: [
        { title: '500lbs', artist: 'Lil Tecca', src: 'mp3/en/songs/song1.mp3', cover: 'mp3/en/cover/cover1.jpg' },
        { title: 'Alright', artist: 'Kendrick Lamar', src: 'mp3/en/songs/song2.mp3', cover: 'mp3/en/cover/cover2.jpg' },
        { title: 'Billion Streams Freestyle', artist: 'Central Cee', src: 'mp3/en/songs/song3.mp3', cover: 'mp3/en/cover/cover3.jpg' },
        { title: 'DILEMMA', artist: 'Nemzzz (feat. Centra Cee)', src: 'mp3/en/songs/song4.mp3', cover: 'mp3/en/cover/cover4.jpg' },
        { title: 'I KNOW', artist: 'Travis Scott', src: 'mp3/en/songs/song5.mp3', cover: 'mp3/en/cover/cover5.jpg' },
        { title: 'LOT OF ME', artist: 'Lil Tecca', src: 'mp3/en/songs/song6.mp3', cover: 'mp3/en/cover/cover6.jpg' },
        { title: 'Spinnin', artist: 'Segway (feat. Nemzzz)', src: 'mp3/en/songs/song7.mp3', cover: 'mp3/en/cover/cover7.jpg' },
        { title: 'The Race', artist: 'Tay-K', src: 'mp3/en/songs/song8.mp3', cover: 'mp3/en/cover/cover8.jpg' },
    ],
    fr: [
        { title: 'MAMACITA', artist: 'GIMS, Sfera Ebbasta', src: 'mp3/fr/songs/song2.mp3', cover: 'mp3/fr/cover/cover2.jpg' },
        { title: 'J\'comprends pas', artist: 'PNL', src: 'mp3/fr/songs/song1.mp3', cover: 'mp3/fr/cover/cover1.jpg' },
        { title: 'Solitaire', artist: 'Werenoi', src: 'mp3/fr/songs/song3.mp3', cover: 'mp3/fr/cover/cover3.jpg' },
        { title: 'Mocro Mafia', artist: 'Baby Gang (feat. Mares)', src: 'mp3/fr/songs/song4.mp3', cover: 'mp3/fr/cover/cover4.jpg' }

    ],
    es: [
        { title: 'Sigue', artist: 'Beny Jr, Morad', src: 'mp3/sp/songs/song2.mp3', cover: 'mp3/sp/cover/cover2.jpg' },
        { title: 'Paris Como Hakimi', artist: 'Morad', src: 'mp3/sp/songs/song1.mp3', cover: 'mp3/sp/cover/cover1.jpg' },
        { title: 'Contento', artist: 'Morad', src: 'mp3/sp/songs/song3.mp3', cover: 'mp3/sp/cover/cover3.jpg' },
    ]
};

function resolvePlaylistForLang(lang) {
    const preferred = ['en','it','fr','es'].includes(lang) ? lang : 'en';
    const order = [preferred, 'it', 'en', 'fr', 'es'];
    for (const code of order) {
        const arr = MANUAL_PLAYLISTS[code] || [];
        if (arr.length > 0) return arr.map(item => ({ ...item }));
    }
    return [];
}

async function loadSongsForLang(lang) {
    const baseList = resolvePlaylistForLang(lang);
    songs = baseList.map((s, i) => ({
        title: (s.title && s.title.trim()) ? s.title : `Track ${i+1}`,
        artist: (s.artist && s.artist.trim()) ? s.artist : '—',
        src: s.src,
        cover: s.cover || 'png/hero.png',
    }));
}

const loadingScreen = document.getElementById('loadingScreen');
const overlay = document.getElementById('overlay');
const mainContent = document.querySelector('.main-content');

function showOverlay() {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
    }, 500);
}

async function updateDiscordStatus() {
    const discordStatus = document.getElementById('discord-status');
    const statusTip = document.getElementById('statusTip');
    const DISCORD_ID = '779084859548368937';
    
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();
        discordStatus.classList.remove('online', 'idle', 'dnd', 'offline');
        
        if (data.success) {
            const status = data.data.discord_status;
            discordStatus.classList.add(status);
            const titlePrefix = (window.i18n?.t('dynamic.discord.titlePrefix')) || 'Discord status: ';
            const mapStatus = (st) => (window.i18n?.t(`dynamic.discord.status.${st}`)) || st;
            const tipText = (window.i18n?.t(`dynamic.discord.tooltip.${status}`)) || '';
            discordStatus.setAttribute('title', `${titlePrefix}${mapStatus(status)}`);
            if (statusTip) statusTip.textContent = tipText || (window.i18n?.t('profile.statusTooltip') || 'Discord status');
            window.__lastDiscordStatus = status;
        }
    } catch (error) {
        console.error((window.i18n?.t('dynamic.discord.fetchError') || 'Discord status fetch error:'), error);
    discordStatus.classList.add('offline');
        const titlePrefix = (window.i18n?.t('dynamic.discord.titlePrefix')) || 'Discord status: ';
        const offline = (window.i18n?.t('dynamic.discord.status.offline')) || 'Offline';
        discordStatus.setAttribute('title', `${titlePrefix}${offline}`);
        if (statusTip) statusTip.textContent = (window.i18n?.t('dynamic.discord.tooltip.offline')) || 'Offline';
        window.__lastDiscordStatus = 'offline';
    }
}

function connectWebSocket() {
    const DISCORD_ID = '779084859548368937';
    const socket = new WebSocket('wss://api.lanyard.rest/socket');
    
    socket.onopen = () => {
        socket.send(JSON.stringify({
            op: 2,
            d: {
                subscribe_to_id: DISCORD_ID
            }
        }));
    };
    
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE') {
            const discordStatus = document.getElementById('discord-status');
            const statusTip = document.getElementById('statusTip');
            let status;

            if (data.t === 'INIT_STATE' && data.d && data.d[DISCORD_ID]) {
                status = data.d[DISCORD_ID].discord_status;
            } else if (data.t === 'PRESENCE_UPDATE' && data.d && data.d.discord_status) {
                status = data.d.discord_status;
            }

            if (status) {
                discordStatus.classList.remove('online', 'idle', 'dnd', 'offline');
                discordStatus.classList.add(status);
                const titlePrefix = (window.i18n?.t('dynamic.discord.titlePrefix')) || 'Discord status: ';
                const mapStatus = (st) => (window.i18n?.t(`dynamic.discord.status.${st}`)) || st;
                const tipText = (window.i18n?.t(`dynamic.discord.tooltip.${status}`)) || '';
                discordStatus.setAttribute('title', `${titlePrefix}${mapStatus(status)}`);
                if (statusTip) statusTip.textContent = tipText || (window.i18n?.t('profile.statusTooltip') || 'Discord status');
                window.__lastDiscordStatus = status;
            }
        }
    };
    
    socket.onclose = () => {
        setTimeout(connectWebSocket, 5000);
    };
}

window.addEventListener('load', async () => {
    if (location.hash !== '#home') {
        history.replaceState(null, '', '#home');
    }
    await loadSongsForLang((window.i18n?.lang) || 'en');
    if (songs.length > 0) {
        currentSong = Math.floor(Math.random() * songs.length);
        lastPlayedSongs.push(currentSong);
        loadSong(currentSong);
    updatePrevButtonState();
    } else {
        songTitle.textContent = (window.i18n?.t('player.noSongs')) || 'No songs found';
        songArtist.textContent = (window.i18n?.t('player.addMp3')) || 'Add mp3 files into the mp3 folder';
    }

    setTimeout(() => {
        showOverlay();
        document.querySelector('.glass-radio-group').classList.add('blurred');
    }, 2000);

    updateDiscordStatus();
    connectWebSocket();

    const sections = {
        home: document.querySelector('.section-home'),
        contact: document.querySelector('.section-contact'),
        misc: document.querySelector('.section-misc'),
        obs: document.querySelector('.section-obs'),
        vegas: document.querySelector('.section-vegas'),
        smoothie: document.querySelector('.section-smoothie'),
    };
    const navTabs = ['home','contact','misc'];
    function setNavActive(key) {
        ['nav-home','nav-contact','nav-misc'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.checked = false;
        });
        if (navTabs.includes(key)) {
            const target = document.getElementById(`nav-${key}`);
            if (target) target.checked = true;
        }
    }
    const mini = {
        root: document.getElementById('miniPlayer'),
        title: document.getElementById('miniTitle'),
    cover: document.getElementById('miniCover'),
        btnPlay: document.getElementById('miniPlay'),
        btnPause: document.getElementById('miniPause'),
        btnNext: document.getElementById('miniNext'),
        btnPrev: document.getElementById('miniPrev'),
    };

    function setMiniVisible(visible) {
        if (!mini.root) return;
        mini.root.style.display = visible ? 'block' : 'none';
        mini.root.setAttribute('aria-hidden', visible ? 'false' : 'true');
    }
    let currentSection = 'home';

    function toggleObsVideos(playing) {
        const vids = document.querySelectorAll('.section-obs video');
        vids.forEach(v => {
            try {
                if (playing) v.play(); else v.pause();
            } catch(_) {}
        });
    }

    function showSection(key) {
        Object.values(sections).forEach(el => el && el.classList.remove('active'));
        sections[key]?.classList.add('active');
        if (key === 'home') document.body.classList.add('home');
        else document.body.classList.remove('home');
        setNavActive(key);
        const storedMiniOut = localStorage.getItem('setting:miniOut');
        const allowMiniOut = storedMiniOut === null ? true : storedMiniOut === 'true';
        setMiniVisible(key !== 'home' && allowMiniOut);
        const targetId = key === 'home' ? '#home' : `#${key}`;
        if (location.hash !== targetId) {
            history.replaceState(null, '', targetId);
        }
        currentSection = key;
        toggleObsVideos(key === 'obs');
        if (key === 'obs') {
            ensureObsPreload();
            enableObsScreenshotZoom();
        }
    }
    const hash = (location.hash || '#home').replace('#','');
    if (['home','contact','misc','obs','vegas','smoothie'].includes(hash)) {
        showSection(hash);
    } else {
        showSection('home');
    }

    document.getElementById('nav-home')?.addEventListener('change', e => { if (e.target.checked) showSection('home'); });
    document.getElementById('nav-contact')?.addEventListener('change', e => { if (e.target.checked) showSection('contact'); });
    document.getElementById('nav-misc')?.addEventListener('change', e => { if (e.target.checked) showSection('misc'); });

    const earlyBtn = document.getElementById('earlyAccessBtn');
    if (earlyBtn) {
        earlyBtn.addEventListener('click', () => {
            const contactRadio = document.getElementById('nav-contact');
            if (contactRadio) contactRadio.checked = true;
            showSection('contact');
            const typeSelEl = document.getElementById('cf-type');
            if (typeSelEl) {
                typeSelEl.value = 'Portfolio';
                typeSelEl.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    window.addEventListener('hashchange', () => {
        const h = (location.hash || '#home').replace('#','');
        if (['home','contact','misc','obs','vegas','smoothie'].includes(h)) {
            showSection(h);
        }
    });


function enableObsScreenshotZoom() {
    if (window.__obsZoomOverlay) return;
    const imgs = document.querySelectorAll('.obs-screenshots .fullscreenable');
    if (!imgs.length) return;
    let overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.88)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.cursor = 'zoom-out';
    overlay.style.transition = 'opacity 0.18s';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    let img = document.createElement('img');
    img.style.maxWidth = '96vw';
    img.style.maxHeight = '92vh';
    img.style.borderRadius = '14px';
    img.style.boxShadow = '0 4px 32px #000b';
    img.style.background = '#222';
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    window.__obsZoomOverlay = overlay;
    let open = false;
    function show(src, alt) {
        img.src = src;
        img.alt = alt || '';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        open = true;
        document.body.style.overflow = 'hidden';
    }
    function hide() {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        open = false;
        document.body.style.overflow = '';
    }
    imgs.forEach(i => {
        i.addEventListener('click', e => {
            show(i.src, i.alt);
        });
    });
    overlay.addEventListener('click', hide);
    document.addEventListener('keydown', e => {
        if (open && (e.key === 'Escape' || e.key === 'Esc')) hide();
    });
}
    const obsVideos = Array.from(document.querySelectorAll('.section-obs video'));
    function attachLoading(v) {
        const card = v.closest('.obs-card');
        const bar = card?.querySelector('.obs-progress-bar');
        const pct = card?.querySelector('.obs-progress-pct');
        if (!card) return;
        const update = (p) => {
            const clamped = Math.max(0, Math.min(100, Math.round(p)));
            if (bar) bar.style.width = clamped + '%';
            if (pct) pct.textContent = clamped + '%';
            card.dataset.progress = String(clamped);
        };
        let total = 0, loaded = 0;
        const onProgress = (e) => {
            if (!e.lengthComputable) return;
            total = e.total; loaded = e.loaded;
            update(loaded / total * 100);
        };
        const onReady = () => {
            update(100);
            card.classList.remove('loading');
            card.classList.add('ready');
            v.muted = true; v.loop = true;
            if (currentSection === 'obs') v.play().catch(()=>{});
        };
        const src = v.dataset.src;
        if (!src) return;
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', src, true);
            xhr.responseType = 'blob';
            xhr.onprogress = onProgress;
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const blob = xhr.response;
                    const url = URL.createObjectURL(blob);
                    v.src = url;
                    let readyFired = false;
                    const fireOnce = () => { if (readyFired) return; readyFired = true; onReady(); };
                    v.addEventListener('canplaythrough', fireOnce, { once: true });
                    v.addEventListener('loadeddata', fireOnce, { once: true });
                    v.load();
                } else {
                    update(0);
                }
            };
            xhr.onerror = () => update(0);
            xhr.send();
        } catch(_) {
            v.src = src;
            v.addEventListener('canplaythrough', onReady, { once: true });
            v.addEventListener('loadeddata', onReady, { once: true });
            v.load();
        }
    }

    function initObsLazy() {
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const v = entry.target;
                    if (entry.isIntersecting && v.dataset.src && !v.src) {
                        attachLoading(v);
                        io.unobserve(v);
                    }
                });
            }, { root: null, threshold: 0.2 });
            obsVideos.forEach(v => io.observe(v));
        } else {
            obsVideos.forEach(v => attachLoading(v));
        }
    }
    initObsLazy();

    function ensureObsPreload() {
        obsVideos.forEach(v => { if (v.dataset.src && !v.src) attachLoading(v); });
    }

    const tryFullscreen = (el) => {
        const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen || el.mozRequestFullScreen;
        if (req) req.call(el);
    };
    obsVideos.forEach(v => {
        v.muted = true;
        v.loop = true;
        v.controls = false;
        v.addEventListener('play', () => { v.muted = true; });
    });



    const copyDiscordBtn = document.getElementById('copyDiscord');
    if (copyDiscordBtn) {
        copyDiscordBtn.addEventListener('click', async () => {
            const ok = await copyToClipboard('novee7');
            if (ok) {
                copyDiscordBtn.textContent = (window.i18n?.t('dynamic.copy.ok')) || 'Copied! (novee7)';
            } else {
                copyDiscordBtn.textContent = (window.i18n?.t('dynamic.copy.fail')) || 'Copy failed';
            }
            setTimeout(() => { copyDiscordBtn.textContent = (window.i18n?.t('contact.copyDiscordId')) || 'Copy Discord ID'; }, 1600);
        });
    }

    const copyReqBtn = document.getElementById('contactCopyBtn');
    const nameEl = document.getElementById('cf-name');
    const emailUserEl = document.getElementById('cf-email-user');
    const emailDomainEl = document.getElementById('cf-email-domain');
    const typeEl = document.getElementById('cf-type');
    const budgetEl = document.getElementById('cf-budget');
    const timeEl = document.getElementById('cf-time');
    const msgEl2 = document.getElementById('cf-message');

    const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
    let cooldownTimer = null;
    const getCooldownUntil = () => {
        const raw = localStorage.getItem('contact:cooldownUntil') || '0';
        const n = parseInt(raw, 10);
        return isNaN(n) ? 0 : n;
    };
    const isCooldownActive = () => Date.now() < getCooldownUntil();
    const startCooldown = () => {
        const until = Date.now() + COOLDOWN_MS;
        localStorage.setItem('contact:cooldownUntil', String(until));
        return until;
    };
    const fmtRemaining = (ms) => {
        const total = Math.max(0, Math.ceil(ms / 1000));
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    };
    const updateCooldownUI = () => {
        if (!copyReqBtn) return;
        const until = getCooldownUntil();
        const active = Date.now() < until;
        if (active) {
            copyReqBtn.disabled = true;
            const tick = () => {
                const left = until - Date.now();
                if (left <= 0) {
                    clearInterval(cooldownTimer);
                    cooldownTimer = null;
                    copyReqBtn.textContent = (window.i18n?.t('contact.sendDiscord')) || 'Send to Discord';
                    updateSubmitEnabled();
                } else {
                    copyReqBtn.textContent = `Wait ${fmtRemaining(left)}`;
                }
            };
            if (!cooldownTimer) cooldownTimer = setInterval(tick, 1000);
            tick();
        } else {
            if (cooldownTimer) { clearInterval(cooldownTimer); cooldownTimer = null; }
            copyReqBtn.textContent = (window.i18n?.t('contact.sendDiscord')) || 'Send to Discord';
        }
    };

    function updateSubmitEnabled() {
        if (!copyReqBtn) return;
    const nameOk = (nameEl?.value || '').trim().length > 0;
    const emailUserOk = (emailUserEl?.value || '').trim().length > 0;
    const rawDomain = (emailDomainEl?.value || '').trim();
    const emailDomainOk = (rawDomain.length === 0) || (rawDomain.includes('.') && !rawDomain.includes(' '));
        const typeOk = !!(typeEl?.value);
        const budgetOk = !!(budgetEl?.value);
        const timeOk = !!(timeEl?.value);
        const msgOk = (msgEl2?.value || '').trim().length > 0;
    const valid = (nameOk && emailUserOk && emailDomainOk && typeOk && budgetOk && timeOk && msgOk);
    if (isCooldownActive()) {
        copyReqBtn.disabled = true;
        updateCooldownUI();
    } else {
        copyReqBtn.disabled = !valid;
    }
    }

    nameEl?.addEventListener('input', updateSubmitEnabled);
    emailUserEl?.addEventListener('input', updateSubmitEnabled);
    emailDomainEl?.addEventListener('input', updateSubmitEnabled);
    typeEl?.addEventListener('change', updateSubmitEnabled);
    budgetEl?.addEventListener('change', updateSubmitEnabled);
    timeEl?.addEventListener('change', updateSubmitEnabled);
    msgEl2?.addEventListener('input', updateSubmitEnabled);
     updateSubmitEnabled();
    updateCooldownUI();

    const resetContactForm = () => {
        if (nameEl) nameEl.value = '';
        if (emailUserEl) emailUserEl.value = '';
        if (emailDomainEl) emailDomainEl.value = '';
        if (typeEl) { typeEl.value = ''; typeEl.dispatchEvent(new Event('change', { bubbles: true })); }
        if (budgetEl) { budgetEl.disabled = false; budgetEl.value = ''; budgetEl.dispatchEvent(new Event('change', { bubbles: true })); }
        if (timeEl) { timeEl.disabled = false; timeEl.value = ''; timeEl.dispatchEvent(new Event('change', { bubbles: true })); }
        if (msgEl2) msgEl2.value = '';
        const counter = document.getElementById('cf-counter');
        if (counter) counter.textContent = '(0/1000)';
        updateSubmitEnabled();
    };

    if (copyReqBtn) {
        copyReqBtn.addEventListener('click', async () => {
            if (isCooldownActive()) { updateCooldownUI(); return; }
            const nameOk = (nameEl?.value || '').trim().length > 0;
            const emailUserOk = (emailUserEl?.value || '').trim().length > 0;
            const rawDomainClick = (emailDomainEl?.value || '').trim();
            const emailDomainOk = (rawDomainClick.length === 0) || (rawDomainClick.includes('.') && !rawDomainClick.includes(' '));
            const typeOk = !!(typeEl?.value);
            const budgetOk = !!(budgetEl?.value);
            const timeOk = !!(timeEl?.value);
            const msgOk = (msgEl2?.value || '').trim().length > 0;
            if (!(nameOk && emailUserOk && emailDomainOk && typeOk && budgetOk && timeOk && msgOk)) {
                const prev = copyReqBtn.textContent;
                copyReqBtn.textContent = (window.i18n?.t('contact.submitFillAll')) || 'Fill every field';
                setTimeout(() => { copyReqBtn.textContent = prev; updateSubmitEnabled(); }, 1200);
                return;
            }
            const name = document.getElementById('cf-name')?.value?.trim() || '—';
            const emailUser = emailUserEl?.value?.trim() || '';
            let emailDomain = emailDomainEl?.value?.trim() || '';
            if (!emailDomain) {
                emailDomain = 'gmail.com';
            }
            const emailFull = (emailUser && emailDomain) ? `${emailUser}@${emailDomain}` : '—';
            const type = document.getElementById('cf-type')?.value || '—';
            const budget = document.getElementById('cf-budget')?.value || '—';
            const time = document.getElementById('cf-time')?.value || '—';
            const msg = document.getElementById('cf-message')?.value?.trim() || '—';

            const summary = `Richiesta:\nNome Discord: ${name}\nEmail: ${emailFull}\nTipo: ${type}\nBudget: ${budget}\nTempo: ${time}\nDettagli: ${msg}`;

            const webhook = (copyReqBtn.dataset.webhook || '').trim();
            const now = new Date();
            const dd = String(now.getDate()).padStart(2, '0');
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const yy = String(now.getFullYear()).slice(-2);
            const hh = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            const when = `${dd}/${mm}/${yy} ${hh}:${mins}`;

            const optKey = (selEl) => selEl?.selectedOptions?.[0]?.getAttribute('data-i18n') || '';
            const tEn = (key, fallback) => (key ? (window.i18n?.t(key, 'en')) : null) || fallback;
            const typeEn   = tEn(optKey(typeEl),   type);
            const budgetEn = tEn(optKey(budgetEl), budget);
            const timeEn   = tEn(optKey(timeEl),   time);
            const langCode = (window.i18n?.lang) || 'en';
            const langNameMap = { en: 'English', it: 'Italian', fr: 'French', es: 'Spanish' };
            const langName = `${langNameMap[langCode] || langCode} (${langCode})`;

            const payload = {
                content: '<@779084859548368937>',
                embeds: [
                    {
                        title: 'New Request',
                        description: 'A new portfolio request has been submitted. Details below:',
                        color: 0x5865F2,
                        fields: [
                            { name: 'Language', value: langName, inline: false },
                            { name: 'Discord name', value: name || '—', inline: false },
                            { name: 'Email', value: emailFull || '—', inline: false },
                            { name: '\u200B', value: '\u200B', inline: false },
                            { name: 'Type', value: typeEn || '—', inline: true },
                            { name: 'Budget', value: budgetEn || '—', inline: true },
                            { name: 'Time', value: timeEn || '—', inline: true },
                            { name: '\u200B', value: '\u200B', inline: false },
                            { name: 'Details', value: (msg && msg.length > 0 ? msg : '—'), inline: false }
                        ],
                        footer: { text: `Sent from the portfolio • ${when}` }
                    }
                ],
                allowed_mentions: { users: ['779084859548368937'] }
            };

            copyReqBtn.disabled = true;
            const originalLabel = copyReqBtn.textContent;
            copyReqBtn.textContent = (window.i18n?.t('contact.submitSending')) || 'Sending...';

            let sent = false;
            if (webhook) {
                try {
                    const res = await fetch(webhook, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    sent = res.ok;
                } catch (_) {
                    sent = false;
                }
            }

            if (sent) {
                copyReqBtn.textContent = (window.i18n?.t('contact.submitSent')) || 'Sent!';
            } else {
                const ok = await copyToClipboard(summary);
                copyReqBtn.textContent = ok ? (window.i18n?.t('contact.submitClipboard') || 'Copied to clipboard (fallback)') : (window.i18n?.t('contact.submitError') || 'Send error');
            }
            resetContactForm();
            startCooldown();
            updateCooldownUI();
        });
    }

    const msgEl = document.getElementById('cf-message');
    const counter = document.getElementById('cf-counter');
    if (msgEl && counter) {
        const updateCount = () => {
            const len = (msgEl.value || '').length;
            counter.textContent = `(${len}/1000)`;
        };
        msgEl.addEventListener('input', updateCount);
        updateCount();
    }

    function syncMiniButtons() {
        if (!mini.btnPlay || !mini.btnPause) return;
        if (audio.paused) {
            mini.btnPlay.style.display = 'inline-flex';
            mini.btnPause.style.display = 'none';
        } else {
            mini.btnPlay.style.display = 'none';
            mini.btnPause.style.display = 'inline-flex';
        }
        const t = document.getElementById('songTitle')?.textContent?.trim() || '—';
        if (mini.title) mini.title.textContent = t;
    const bg = document.getElementById('albumCover')?.style?.backgroundImage || '';
    if (mini.cover) mini.cover.style.backgroundImage = bg || "url('png/hero.png')";
        if (mini.btnPrev) {
            if (lastPlayedSongs.length <= 1) mini.btnPrev.classList.add('disabled');
            else mini.btnPrev.classList.remove('disabled');
        }
    }

    mini.btnPlay?.addEventListener('click', () => {
        document.getElementById('playBtn')?.click();
        syncMiniButtons();
    });
    mini.btnPause?.addEventListener('click', () => {
        document.getElementById('pauseBtn')?.click();
        syncMiniButtons();
    });
    mini.btnNext?.addEventListener('click', () => {
        document.getElementById('nextBtn')?.click();
        syncMiniButtons();
    });
    mini.btnPrev?.addEventListener('click', () => {
        document.getElementById('prevBtn')?.click();
        syncMiniButtons();
    });

    audio.addEventListener('play', syncMiniButtons);
    audio.addEventListener('pause', syncMiniButtons);
    audio.addEventListener('loadedmetadata', syncMiniButtons);
    audio.addEventListener('loadeddata', syncMiniButtons);
    audio.addEventListener('ended', syncMiniButtons);

    const origUpdatePrev = updatePrevButtonState;
    if (typeof origUpdatePrev === 'function') {
        window.updatePrevButtonState = function() {
            origUpdatePrev();
            syncMiniButtons();
        }
    }

    syncMiniButtons();

    if (mini.root) {
        let dragging = false;
        let startX = 0, startY = 0;
        let startLeft = 0, startTop = 0;

    const onPointerDown = (e) => {
            if (e.target.closest('.mini-btn')) return;
            dragging = true;
            mini.root.classList.add('dragging');
            mini.root.setPointerCapture?.(e.pointerId);
            const rect = mini.root.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;
        };

        const onPointerMove = (e) => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let newLeft = startLeft + dx;
            let newTop = startTop + dy;
            const vpW = window.innerWidth;
            const vpH = window.innerHeight;
            const rect = mini.root.getBoundingClientRect();
            const footer = document.querySelector('.simple-footer');
            const footerH = footer ? footer.getBoundingClientRect().height : 60;
            newLeft = Math.max(8, Math.min(vpW - rect.width - 8, newLeft));
            newTop = Math.max(8, Math.min(vpH - rect.height - footerH - 8, newTop));
            mini.root.style.left = newLeft + 'px';
            mini.root.style.top = newTop + 'px';
            mini.root.style.right = 'auto';
            mini.root.style.bottom = 'auto';
        };

        const onPointerUp = (e) => {
            if (!dragging) return;
            dragging = false;
            mini.root.classList.remove('dragging');
            mini.root.releasePointerCapture?.(e.pointerId);
        };

        mini.root.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    }

    ['cf-type','cf-budget','cf-time'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const refreshColor = () => {
            if (el.disabled) {
                el.style.color = 'rgba(220,220,220,0.6)';
            } else if (el.value) {
                el.style.color = '#e5e5e5';
            } else {
                el.style.color = 'rgba(255,255,255,0.6)';
            }
        };
        refreshColor();
        el.addEventListener('change', refreshColor);
    });

    const typeSel = document.getElementById('cf-type');
    const budgetSel = document.getElementById('cf-budget');
    const timeSel = document.getElementById('cf-time');
    if (typeSel && budgetSel && timeSel) {
        const updateSelectColor = (el) => {
            if (!el) return;
            if (el.disabled) el.style.color = 'rgba(220,220,220,0.6)';
            else if (el.value) el.style.color = '#e5e5e5';
            else el.style.color = 'rgba(255,255,255,0.6)';
        };
        const applyConstraints = () => {
            const isPortfolio = typeSel.value === 'Portfolio';
            if (isPortfolio) {
                if (budgetSel.value !== '5-10€+') budgetSel.value = '5-10€+';
                budgetSel.disabled = true;
                if (timeSel.value !== 'Normale') timeSel.value = 'Normale';
                timeSel.disabled = true;
            } else {
                budgetSel.disabled = false;
                if (budgetSel.value === 'Gratis') {
                    if (timeSel.value !== 'Flessibile') timeSel.value = 'Flessibile';
                    timeSel.disabled = true;
                } else {
                    timeSel.disabled = false;
                }
            }
            updateSelectColor(budgetSel);
            updateSelectColor(timeSel);
            timeSel.dispatchEvent(new Event('change', { bubbles: true }));
        };
        typeSel.addEventListener('change', applyConstraints);
        budgetSel.addEventListener('change', applyConstraints);
        applyConstraints();
    }
});

window.onLangChange = async function(newLang) {
    const wasPlaying = !audio.paused;
    try { audio.pause(); } catch(_) {}
    lastPlayedSongs = [];
    currentSong = 0;
    await loadSongsForLang(newLang);
    if (songs.length > 0) {
        currentSong = Math.floor(Math.random() * songs.length);
        lastPlayedSongs.push(currentSong);
        loadSong(currentSong);
        audio.currentTime = 0;
        if (wasPlaying) {
            try { await audio.play(); } catch(_) {}
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
        } else {
            playBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
        }
    }
    updatePrevButtonState();
    const t = document.getElementById('songTitle')?.textContent?.trim() || '—';
    const miniTitle = document.getElementById('miniTitle');
    if (miniTitle) miniTitle.textContent = t;
    const bg = document.getElementById('albumCover')?.style?.backgroundImage || '';
    const miniCover = document.getElementById('miniCover');
    if (miniCover) miniCover.style.backgroundImage = bg || "url('png/hero.png')";
};

(function settingsInit(){
    const fab = document.getElementById('settingsFab');
    const modal = document.getElementById('settingsModal');
    const btnClose = document.getElementById('settingsClose');
    const bgVideo = document.getElementById('bgVideo');
    const chkBgVideo = document.getElementById('settingBgVideo');
    const chkMiniOut = document.getElementById('settingMiniOut');

    if (!fab || !modal || !btnClose || !bgVideo || !chkBgVideo || !chkMiniOut) return;

    const open = () => { modal.setAttribute('aria-hidden','false'); };
    const close = () => { modal.setAttribute('aria-hidden','true'); };
    fab.addEventListener('click', open);
    btnClose.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close(); });

    const storedBg = localStorage.getItem('setting:bgVideo');
    const showBg = storedBg === null ? true : storedBg === 'true';
    chkBgVideo.checked = showBg;
    bgVideo.style.display = showBg ? 'block' : 'none';
    document.body.classList.toggle('bg-off', !showBg);

    const storedMini = localStorage.getItem('setting:miniOut');
    const allowMini = storedMini === null ? true : storedMini === 'true';
    chkMiniOut.checked = allowMini;

    chkBgVideo.addEventListener('change', () => {
    const visible = chkBgVideo.checked;
    bgVideo.style.display = visible ? 'block' : 'none';
    document.body.classList.toggle('bg-off', !visible);
        localStorage.setItem('setting:bgVideo', String(visible));
    });
    chkMiniOut.addEventListener('change', () => {
        const allow = chkMiniOut.checked;
        localStorage.setItem('setting:miniOut', String(allow));
    const isHome = currentSection === 'home';
    setMiniVisible(!isHome && allow);
    });
})();

const overlayContent = document.querySelector('.overlay-content');
overlayContent.addEventListener('click', (e) => {
    e.stopPropagation();
    const tryPlay = songs.length > 0 ? audio.play() : Promise.resolve();
    tryPlay.catch(error => {
        console.error((window.i18n?.t('dynamic.audio.playErr') || 'Playback error:'), error);
    }).finally(() => {
        if (!audio.paused) {
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
        } else {
            playBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
        }
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        mainContent.style.filter = 'none';
        setTimeout(() => {
            document.querySelector('.glass-radio-group').classList.remove('blurred');
        }, 300);
        const bgv = document.getElementById('bgVideo');
        if (bgv) bgv.style.filter = 'brightness(0.6)';
    });
});

overlay.addEventListener('click', (e) => {
    e.preventDefault();
});

pauseBtn.style.display = 'none';

function loadSong(index) {
    const song = songs[index];
    audio.pause();
    playBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
    audio.src = song.src;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    albumCover.style.backgroundImage = `url('${song.cover}')`;
    audio.load();
}

audio.addEventListener('ended', () => {
    nextSong();
});

function togglePlay() {
    if (audio.paused) {
        audio.play().catch(error => {
            console.error((window.i18n?.t('dynamic.audio.playErr') || 'Playback error:'), error);
            songTitle.textContent = (window.i18n?.t('player.errorTitle')) || 'Load error';
            songArtist.textContent = (window.i18n?.t('player.errorArtist')) || 'File not found';
        });
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
    } else {
        audio.pause();
        playBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
    }
}

function nextSong() {
    currentSong = getRandomSong();
    loadSong(currentSong);
    audio.play().catch(console.error);
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
    updatePrevButtonState();
}

function updatePrevButtonState() {
    if (lastPlayedSongs.length <= 1) {
        prevBtn.classList.add('disabled');
    } else {
        prevBtn.classList.remove('disabled');
    }
}

function prevSong() {
    if (lastPlayedSongs.length > 1) {
        lastPlayedSongs.pop();
        currentSong = lastPlayedSongs[lastPlayedSongs.length - 1];
        loadSong(currentSong);
        audio.play().catch(console.error);
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
    }
    updatePrevButtonState();
}

function skipForward5() {
    if (audio.duration) {
        audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
    }
}

function skipBackward5() {
    if (audio.duration) {
        audio.currentTime = Math.max(audio.currentTime - 5, 0);
    }
}

playBtn.onclick = togglePlay;
pauseBtn.onclick = togglePlay;
nextBtn.onclick = nextSong;
prevBtn.onclick = prevSong;
forward5Btn.onclick = skipForward5;
rewind5Btn.onclick = skipBackward5;

const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

function formatTime(sec) {
    if (isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
}

audio.ontimeupdate = () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = audio.duration ? `${percent}%` : '0%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
};

const progressBarContainer = document.querySelector('.progress-bar.compact');
progressBarContainer.addEventListener('click', (e) => {
    const rect = progressBarContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    const newTime = percentage * audio.duration;
    audio.currentTime = newTime;
});

      audio.onerror = function(e) {
          console.error((window.i18n?.t('dynamic.audio.loadErr') || 'Audio error:'), e);
          songTitle.textContent = (window.i18n?.t('player.errorTitle')) || 'Load error';
          songArtist.textContent = (window.i18n?.t('player.errorArtist')) || 'File not found';
          playBtn.style.display = 'block';
          pauseBtn.style.display = 'none';
      };

window.updateDiscordLang = function() {
    const el = document.getElementById('discord-status');
    const tip = document.getElementById('statusTip');
    if (!el) return;
    const status = (window.__lastDiscordStatus) || (el.classList.contains('online') ? 'online' : el.classList.contains('idle') ? 'idle' : el.classList.contains('dnd') ? 'dnd' : 'offline');
    const titlePrefix = (window.i18n?.t('dynamic.discord.titlePrefix')) || 'Discord status: ';
    const stText = (window.i18n?.t(`dynamic.discord.status.${status}`)) || status;
    el.setAttribute('title', `${titlePrefix}${stText}`);
    if (tip) tip.textContent = (window.i18n?.t(`dynamic.discord.tooltip.${status}`)) || (window.i18n?.t('profile.statusTooltip') || 'Discord status');
};