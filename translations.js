 (function(){
  const SUPPORTED = ['en','it','fr','es'];
  const dictionaries = {
    en: {
      nav: { home: 'Home', contact: 'Contact', misc: 'Misc.' },
      overlay: { clickToEnter: 'Click to enter' },
      profile: { photoAlt: 'Discord profile photo', statusTooltip: 'Discord status', heroAlt: 'novee image' },
      intro: { about: "Hello, I’m Nove, I'm 16 yo and I'm a passionate Web Developer, Minecraft Stack Developer and Java Developer. In my free time I make cool websites, I create plugins, and I own two projects: Italian Practice and Nexa Development; I’m also Manager at the Italian Vanilla Tierlist." },
      player: {
        currentTrack: 'Current track',
        loadingTitle: 'Loading...', loadingArtist: 'Loading...',
        rewind5: 'Rewind 5 seconds', prev: 'Previous', play: 'Play', pause: 'Pause', next: 'Next', forward5: 'Forward 5 seconds', volume: 'Volume',
        errorTitle: 'Load error', errorArtist: 'File not found',
        noSongs: 'No songs found', addMp3: 'Add mp3 files into the mp3 folder'
      },
      contact: {
        heading: 'Contact me', writeMe: 'Write me!', discordName: 'Discord name', discordNamePh: 'Your Discord name',
        email: 'Email', emailUserPh: 'name', emailDomainPh: 'gmail.com',
        type: { label: 'Request type', portfolio: 'Portfolio', plugin: 'Custom plugin', other: 'Other' },
        budget: { label: 'Budget', free: 'Free', b5_10: '5-10€+', b10_25: '10-25€+', b25_50: '25-50€+' },
        time: { label: 'Time', fast: 'Fast (1-2 weeks)', normal: 'Normal (1 month)', flexible: 'Flexible (1+ months)' },
        details: 'Details', detailsPh: 'Write the request details here...', selectPrompt: 'Click to choose',
        sendDiscord: 'Send to Discord', dmWarning: 'Not recommended, my DMs are closed; tag me in servers only if I’m online →', copyDiscordId: 'Copy Discord ID',
        lanyardAlt: 'Discord Presence Badge',
        submitFillAll: 'Fill every field', submitSending: 'Sending...', submitSent: 'Sent!', submitClipboard: 'Copied to clipboard (fallback)', submitError: 'Send error',
        embed: {
          title: 'New request',
          discordName: 'Discord name', email: 'Email', type: 'Type', budget: 'Budget', time: 'Time', details: 'Details',
          footer: 'Sent from the portfolio'
        }
      },
      misc: {
        obs: { title: 'OBS Renders', desc: 'All kinds of renders for OBS Studio', alt: 'OBS Renders preview' },
        smoothie: { title: 'Smoothie', alt: 'Smoothie preview' },
        soon: 'Release soon...'
      },
      obs: {
        title: 'OBS Renders',
        pageDesc: 'Page dedicated to OBS renders',
        back: 'Go back',
        loading: 'Loading...',
        credit: 'Credits to {author} for the clip',
        note: 'All videos were recorded using the Open Broadcaster Software (aka OBS) app and then exported to VEGAS Pro 18-22.0.',
  '4k240tech': 'Resolution 3840 x 2160 both input and output, 240 FPS - Encoder settings QuickSync AV1 (Intel Arc B580) CQP 13, TU7 & Latency ultra low. Depending on your encoder: for Nvidia GPUs use NVENC, for AMD use AMF.',
  '180tech': 'Resolution 1920 x 1080 both input and output, 180 FPS - Encoder settings QuickSync AV1 (Intel Arc B580) CQP 14-18, TU7 & Latency ultra low. Depending on your encoder: for Nvidia GPUs use NVENC, for AMD use AMF.',
  '180desc': 'Clip made by me',
  '120tech': 'Resolution 1920 x 1080 both input and output, 120 FPS - Encoder settings QuickSync AV1 (Intel Arc B580) CQP 18, TU5 & Latency ultra low. Depending on your encoder: for Nvidia GPUs use NVENC, for AMD use AMF.',
      },
      vegas: { title: 'Vegas Renders', pageDesc: 'Page dedicated to Vegas Renders. Content coming soon.' },
      smoothie: { title: 'Smoothie', pageDesc: 'Smoothie recipies (Interpolation)' },
      settings: { title: 'Settings', close: 'Close', bgVideo: 'Show background video', miniOut: 'Show audio player outside Home' },
      footer: { earlyAccess: 'Get early access' },
      language: { title: 'Language' },
      dynamic: {
        discord: {
          titlePrefix: 'Discord status: ',
          status: { online: 'Online', idle: 'Idle', dnd: 'Do not disturb', offline: 'Offline' },
          tooltip: { online: "I'm online", idle: "I'm away from the PC!", dnd: "I'm busy.", offline: "I'm not online :c" },
          fetchError: 'Error fetching Discord status:'
        },
        copy: { ok: 'Copied! (novee7)', fail: 'Copy failed', reset: 'Copy Discord ID' },
        audio: { playErr: 'Playback error:', autoErr: 'Autoplay error:', loadErr: 'Audio error:' }
      }
    },
    it: {
      nav: { home: 'Home', contact: 'Contattami', misc: 'Misc.' },
      overlay: { clickToEnter: 'Clicca per entrare' },
      profile: { photoAlt: 'Foto profilo Discord', statusTooltip: 'Stato Discord', heroAlt: 'immagine novee' },
      intro: { about: 'Ciao, sono Nove, ho 16 anni, e sono un appassionato Web Developer, Minecraft Stack Developer e Java Developer. Nel tempo libero faccio siti carini, faccio plugin su commissione (anche gratis), e gestisco due progetti: Italian Practice e Nexa Development; sono anche Manager nella Italian Vanilla Tierlist.' },
      player: {
        currentTrack: 'Traccia corrente', loadingTitle: 'Caricamento...', loadingArtist: 'Caricamento...',
        rewind5: 'Indietro di 5 secondi', prev: 'Precedente', play: 'Riproduci', pause: 'Pausa', next: 'Successiva', forward5: 'Avanti di 5 secondi', volume: 'Volume',
        errorTitle: 'Errore nel caricamento', errorArtist: 'File non trovato',
        noSongs: 'Nessuna canzone trovata', addMp3: 'Aggiungi file mp3 nella cartella mp3'
      },
      contact: {
        heading: 'Contattami', writeMe: 'Scrivimi!', discordName: 'Nome Discord', discordNamePh: 'Il tuo nome Discord',
        email: 'Email', emailUserPh: 'nome', emailDomainPh: 'gmail.com',
        type: { label: 'Tipo di richiesta', portfolio: 'Portfolio', plugin: 'Custom plugin', other: 'Altro' },
        budget: { label: 'Budget', free: 'Gratis', b5_10: '5-10€+', b10_25: '10-25€+', b25_50: '25-50€+' },
        time: { label: 'Tempo', fast: 'Veloce (1-2 settimane)', normal: 'Normale (1 mese)', flexible: 'Flessibile (1+ mesi)' },
        details: 'Dettagli', detailsPh: 'Scrivi qui i dettagli della richiesta...', selectPrompt: 'Clicca per scegliere',
        sendDiscord: 'Invia su Discord', dmWarning: 'Sconsigliato, ho i DM chiusi; taggami nei server solo se sono online →', copyDiscordId: 'Copia ID Discord',
        lanyardAlt: 'Badge presenza Discord',
        submitFillAll: 'Compila tutti i campi', submitSending: 'Invio...', submitSent: 'Inviato!', submitClipboard: 'Incollato negli appunti (fallback)', submitError: 'Errore invio',
        embed: {
          title: 'Nuova richiesta',
          discordName: 'Nome Discord', email: 'Email', type: 'Tipo', budget: 'Budget', time: 'Tempo', details: 'Dettagli',
          footer: 'Inviato dal portfolio'
        }
      },
      misc: {
        obs: { title: 'OBS Renders', desc: 'Render di ogni tipo per OBS Studio', alt: 'Anteprima OBS Renders' },
        vegas: { title: 'Vegas Renders', alt: 'Anteprima Vegas Renders' },
        smoothie: { title: 'Smoothie', alt: 'Anteprima Smoothie' },
        soon: 'In arrivo...'
      },
      obs: {
        title: 'OBS Renders',
        pageDesc: 'Pagina dedicata ai render OBS',
        back: 'Torna indietro',
        loading: 'Caricamento...',
        credit: 'Crediti a {author} per la clip',
        note: 'Tutti i video sono stati registrati con Open Broadcaster Software (OBS) e poi esportati su VEGAS Pro 18-22.0.',
  '4k240tech': 'Risoluzione 3840 x 2160 sia in entrata che in uscita, 240 FPS - Encoder settings QuickSync AV1 (Intel Arc B580) CQP 13, TU7 & Latency ultra low, dipende dal tipo di encoder che usate, nel caso di GPU Nvidia usate NVENC e AMD, AMF.',
  '180tech': 'Risoluzione 1920 x 1080 sia in entrata che in uscita, 180 FPS - Encoder settings QuickSync AV1 (Intel Arc B580) CQP 14-18, TU7 & Latency ultra low, dipende dal tipo di encoder che usate, nel caso di GPU Nvidia usate NVENC e AMD, AMF.',
  '180desc': 'Clip fatta da me',
  '120tech': 'Risoluzione 1920 x 1080 sia in entrata che in uscita, 120 FPS - Encoder settings QuickSync AV1 (Intel Arc B580) CQP 18, TU5 & Latency ultra low, dipende dal tipo di encoder che usate, nel caso di GPU Nvidia usate NVENC e AMD, AMF.',
      },
      vegas: { title: 'Vegas Renders', pageDesc: 'Pagina dedicata ai Vegas Renders. Contenuti in arrivo.' },
      smoothie: { title: 'Smoothie', pageDesc: 'Smoothie recipies (Interpolazione)' },
      settings: { title: 'Impostazioni', close: 'Chiudi', bgVideo: 'Mostra video di sfondo', miniOut: 'Mostra player audio fuori da Home' },
      footer: { earlyAccess: 'Ottieni l’accesso BETA' },
      language: { title: 'Lingua' },
      dynamic: {
        discord: {
          titlePrefix: 'Stato Discord: ',
          status: { online: 'Online', idle: 'Inattivo', dnd: 'Non disturbare', offline: 'Offline' },
          tooltip: { online: 'Sono online', idle: 'Non sono al PC!', dnd: 'Sto facendo altro.', offline: 'Non sono online :c' },
          fetchError: 'Errore nel recupero dello stato Discord:'
        },
        copy: { ok: 'Copiato! (novee7)', fail: 'Copia non riuscita', reset: 'Copia ID Discord' },
        audio: { playErr: 'Errore durante la riproduzione:', autoErr: 'Errore durante la riproduzione automatica:', loadErr: 'Errore audio:' }
      }
    },
    fr: {
      nav: { home: 'Accueil', contact: 'Contact', misc: 'Divers' },
      overlay: { clickToEnter: 'Cliquer pour entrer' },
      profile: { photoAlt: 'Photo de profil Discord', statusTooltip: 'Statut Discord', heroAlt: 'image novee' },
      intro: { about: 'Salut, je suis Nove, 16 ans, développeur web passionné, développeur Minecraft Stack et développeur Java. Pendant mon temps libre je construis des sites sympas, je réalise des plugins (même gratuitement), et je gère deux projets : Italian Practice et Nexa Development ; je suis aussi manager de l’Italian Vanilla Tierlist.' },
      player: {
        currentTrack: 'Piste en cours', loadingTitle: 'Chargement...', loadingArtist: 'Chargement...',
        rewind5: 'Reculer de 5 secondes', prev: 'Précédent', play: 'Lecture', pause: 'Pause', next: 'Suivant', forward5: 'Avancer de 5 secondes', volume: 'Volume',
        errorTitle: 'Erreur de chargement', errorArtist: 'Fichier introuvable',
        noSongs: 'Aucune chanson trouvée', addMp3: 'Ajoutez des fichiers mp3 dans le dossier mp3'
      },
      contact: {
        heading: 'Contactez-moi', writeMe: 'Écris-moi !', discordName: 'Nom Discord', discordNamePh: 'Votre nom Discord',
        email: 'Email', emailUserPh: 'nom', emailDomainPh: 'gmail.com',
        type: { label: 'Type de demande', portfolio: 'Portfolio', plugin: 'Custom plugin', other: 'Autre' },
        budget: { label: 'Budget', free: 'Gratuit', b5_10: '5-10€+', b10_25: '10-25€+', b25_50: '25-50€+' },
        time: { label: 'Délai', fast: 'Rapide (1-2 semaines)', normal: 'Normal (1 mois)', flexible: 'Flexible (1+ mois)' },
        details: 'Détails', detailsPh: 'Écrivez ici les détails de la demande...', selectPrompt: 'Cliquez pour choisir',
        sendDiscord: 'Envoyer sur Discord', dmWarning: 'Déconseillé, mes MP sont fermés ; mentionnez-moi sur les serveurs seulement si je suis en ligne →', copyDiscordId: 'Copier l’ID Discord',
        lanyardAlt: 'Badge de présence Discord',
        submitFillAll: 'Remplissez tous les champs', submitSending: 'Envoi...', submitSent: 'Envoyé !', submitClipboard: 'Copié dans le presse-papiers (fallback)', submitError: 'Erreur d’envoi',
        embed: {
          title: 'Nouvelle demande',
          discordName: 'Nom Discord', email: 'Email', type: 'Type', budget: 'Budget', time: 'Délai', details: 'Détails',
          footer: 'Envoyé depuis le portfolio'
        }
      },
      misc: {
        obs: { title: 'Rendus OBS', desc: 'Toutes sortes de rendus pour OBS Studio', alt: 'Aperçu OBS Renders' },
        vegas: { title: 'Rendus Vegas', alt: 'Aperçu Vegas Renders' },
        smoothie: { title: 'Smoothie', alt: 'Aperçu Smoothie' },
        soon: 'Bientôt disponible...'
      },
      obs: {
        title: 'Rendus OBS',
        pageDesc: 'Page dédiée aux rendus OBS',
        back: 'Retour',
        loading: 'Chargement...',
        credit: 'Crédits à {author} pour le clip',
        note: 'Toutes les vidéos ont été enregistrées avec Open Broadcaster Software (OBS) puis exportées vers VEGAS Pro 18-22.0.',
  '4k240tech': 'Résolution 3840 x 2160 en entrée et en sortie, 240 FPS - Paramètres de l’encodeur QuickSync AV1 (Intel Arc B580) CQP 13, TU7 & Latence ultra basse. Selon votre encodeur : pour les GPU Nvidia utilisez NVENC, pour AMD utilisez AMF.',
  '180tech': 'Résolution 1920 x 1080 en entrée et en sortie, 180 FPS - Paramètres de l’encodeur QuickSync AV1 (Intel Arc B580) CQP 14-18, TU7 & Latence ultra basse. Selon votre encodeur : pour les GPU Nvidia utilisez NVENC, pour AMD utilisez AMF.',
  '180desc': 'Clip faite par moi',
  '120tech': 'Résolution 1920 x 1080 en entrée et en sortie, 120 FPS - Paramètres de l’encodeur QuickSync AV1 (Intel Arc B580) CQP 18, TU5 & Latence ultra basse. Selon votre encodeur : pour les GPU Nvidia utilisez NVENC, pour AMD utilisez AMF.',
      },
      vegas: { title: 'Rendus Vegas', pageDesc: 'Page dédiée aux rendus Vegas. Contenu bientôt disponible.' },
      smoothie: { title: 'Smoothie', pageDesc: 'Smoothie recipies (Interpolation)' },
      settings: { title: 'Paramètres', close: 'Fermer', bgVideo: 'Afficher la vidéo de fond', miniOut: 'Afficher le lecteur audio hors Accueil' },
      footer: { earlyAccess: 'Accès anticipé' },
      language: { title: 'Langue' },
      dynamic: {
        discord: {
          titlePrefix: 'Statut Discord : ',
          status: { online: 'En ligne', idle: 'Inactif', dnd: 'Ne pas déranger', offline: 'Hors ligne' },
          tooltip: { online: 'Je suis en ligne', idle: 'Je suis loin du PC !', dnd: 'Je suis occupé.', offline: "Je ne suis pas en ligne :c" },
          fetchError: 'Erreur lors de la récupération du statut Discord :'
        },
        copy: { ok: 'Copié ! (novee7)', fail: 'Échec de la copie', reset: 'Copier l’ID Discord' },
        audio: { playErr: 'Erreur de lecture :', autoErr: 'Erreur de lecture automatique :', loadErr: 'Erreur audio :' }
      }
    },
    es: {
      nav: { home: 'Inicio', contact: 'Contacto', misc: 'Varios' },
      overlay: { clickToEnter: 'Clic para entrar' },
      profile: { photoAlt: 'Foto de perfil de Discord', statusTooltip: 'Estado de Discord', heroAlt: 'imagen de novee' },
      intro: { about: 'Hola, soy Nove, 16, un apasionado desarrollador web, desarrollador de pila de Minecraft y desarrollador Java. En mi tiempo libre construyo sitios web, hago plugins por encargo (incluso gratis), y dirijo dos proyectos: Italian Practice y Nexa Development; también soy gerente en la Italian Vanilla Tierlist.' },
      player: {
        currentTrack: 'Pista actual', loadingTitle: 'Cargando...', loadingArtist: 'Cargando...',
        rewind5: 'Rebobinar 5 segundos', prev: 'Anterior', play: 'Reproducir', pause: 'Pausa', next: 'Siguiente', forward5: 'Avanzar 5 segundos', volume: 'Volumen',
        errorTitle: 'Error de carga', errorArtist: 'Archivo no encontrado',
        noSongs: 'No se encontraron canciones', addMp3: 'Agrega archivos mp3 en la carpeta mp3'
      },
      contact: {
        heading: 'Contáctame', writeMe: '¡Escríbeme!', discordName: 'Nombre de Discord', discordNamePh: 'Tu nombre de Discord',
        email: 'Email', emailUserPh: 'nombre', emailDomainPh: 'gmail.com',
        type: { label: 'Tipo de solicitud', portfolio: 'Portafolio', plugin: 'Custom plugin', other: 'Otro' },
        budget: { label: 'Presupuesto', free: 'Gratis', b5_10: '5-10€+', b10_25: '10-25€+', b25_50: '25-50€+' },
        time: { label: 'Tiempo', fast: 'Rápido (1-2 semanas)', normal: 'Normal (1 mes)', flexible: 'Flexible (1+ meses)' },
        details: 'Detalles', detailsPh: 'Escribe los detalles de la solicitud aquí...', selectPrompt: 'Haz clic para elegir',
        sendDiscord: 'Enviar a Discord', dmWarning: 'No recomendado, mis MD están cerrados; etiquétame en servidores solo si estoy en línea →', copyDiscordId: 'Copiar ID de Discord',
        lanyardAlt: 'Insignia de presencia de Discord',
        submitFillAll: 'Rellena todos los campos', submitSending: 'Enviando...', submitSent: '¡Enviado!', submitClipboard: 'Copiado al portapapeles (fallback)', submitError: 'Error al enviar',
        embed: {
          title: 'Nueva solicitud',
          discordName: 'Nombre de Discord', email: 'Email', type: 'Tipo', budget: 'Presupuesto', time: 'Tiempo', details: 'Detalles',
          footer: 'Enviado desde el portafolio'
        }
      },
      misc: {
        obs: { title: 'Renders de OBS', desc: 'Todo tipo de renders para OBS Studio', alt: 'Vista previa de OBS Renders' },
        vegas: { title: 'Renders de Vegas', alt: 'Vista previa de Vegas Renders' },
        smoothie: { title: 'Smoothie', alt: 'Vista previa de Smoothie' },
        soon: 'Próximamente...'
      },
      obs: {
        title: 'Renders de OBS',
        pageDesc: 'Página dedicada a los renders de OBS',
        back: 'Volver',
        loading: 'Cargando...',
        credit: 'Créditos a {author} por el clip',
        note: 'Todos los vídeos fueron grabados con Open Broadcaster Software (OBS) y luego exportados a VEGAS Pro 18-22.0.',
  '4k240tech': 'Resolución 3840 x 2160 tanto de entrada como de salida, 240 FPS - Ajustes del codificador QuickSync AV1 (Intel Arc B580) CQP 13, TU7 y latencia ultrabaja. Según el codificador: para Nvidia usa NVENC, para AMD usa AMF.',
  '180tech': 'Resolución 1920 x 1080 tanto de entrada como de salida, 180 FPS - Ajustes del codificador QuickSync AV1 (Intel Arc B580) CQP 14-18, TU7 y latencia ultrabaja. Según el codificador: para Nvidia usa NVENC, para AMD usa AMF.',
  '180desc': 'Clip hecha por mí',
  '120tech': 'Resolución 1920 x 1080 tanto de entrada como de salida, 120 FPS - Ajustes del codificador QuickSync AV1 (Intel Arc B580) CQP 18, TU5 y latencia ultrabaja. Según el codificador: para Nvidia usa NVENC, para AMD usa AMF.',
      },
      vegas: { title: 'Renders de Vegas', pageDesc: 'Página dedicada a los Renders de Vegas. Contenido próximamente.' },
      smoothie: { title: 'Smoothie', pageDesc: 'Smoothie recipies (Interpolation)' },
      settings: { title: 'Ajustes', close: 'Cerrar', bgVideo: 'Mostrar video de fondo', miniOut: 'Mostrar reproductor fuera de Inicio' },
      footer: { earlyAccess: 'Acceso anticipado' },
      language: { title: 'Idioma' },
      dynamic: {
        discord: {
          titlePrefix: 'Estado de Discord: ',
          status: { online: 'En línea', idle: 'Ausente', dnd: 'No molestar', offline: 'Desconectado' },
          tooltip: { online: 'Estoy en línea', idle: '¡Estoy lejos del PC!', dnd: 'Estoy ocupado.', offline: 'No estoy en línea :c' },
          fetchError: 'Error al obtener el estado de Discord:'
        },
        copy: { ok: '¡Copiado! (novee7)', fail: 'Error al copiar', reset: 'Copiar ID de Discord' },
        audio: { playErr: 'Error de reproducción:', autoErr: 'Error de reproducción automática:', loadErr: 'Error de audio:' }
      }
    }
  };

  function get(obj, path) {
    return path.split('.').reduce((o,k)=> (o && o[k] != null ? o[k] : undefined), obj);
  }

  function t(key, lang) {
    const l = lang || i18n.lang;
    const dict = dictionaries[l] || dictionaries.en;
    const str = get(dict, key);
    if (typeof str === 'string') return str;
    return get(dictionaries.en, key) || key;
  }

  function applyTranslations(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val != null) el.textContent = val;
      // handle templated credit with author
      if (key === 'obs.credit') {
        const author = el.getAttribute('data-credit-author') || '—';
        const tpl = t('obs.credit');
        el.textContent = (tpl || '').replace('{author}', author);
      }
    });
    scope.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = t(key);
      if (val != null) el.setAttribute('title', val);
    });
    scope.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      const val = t(key);
      if (val != null) el.setAttribute('aria-label', val);
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = t(key);
      if (val != null) el.setAttribute('placeholder', val);
    });
    scope.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      const val = t(key);
      if (val != null) el.setAttribute('alt', val);
    });
  }

  function setLang(lang) {
    i18n.lang = SUPPORTED.includes(lang) ? lang : 'en';
    localStorage.setItem('i18n:lang', i18n.lang);
    document.documentElement.setAttribute('lang', i18n.lang);
    applyTranslations();
    // Update dynamic strings that are not in DOM attributes
    if (window.updateDiscordLang) window.updateDiscordLang();
  // Notify app about language change (e.g., to reload language-specific assets)
  if (window.onLangChange) try { window.onLangChange(i18n.lang); } catch(_) {}
  }

  // Pick best language based on: saved preference -> browser -> country -> default
  async function detectBestLanguage() {
    // 1) Browser preferences (navigator.languages / navigator.language)
    const navLangs = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || ''];
    for (const l of navLangs) {
      const base = String(l || '').slice(0,2).toLowerCase();
      if (SUPPORTED.includes(base)) return base;
    }

    // 2) Country lookup via IP API
    try {
      const r = await fetch('https://ipapi.co/json/');
      const j = await r.json();
      // Prefer reported languages if any
      const langs = (j && j.languages) ? String(j.languages) : '';
      if (langs) {
        const first = langs.split(',')[0].trim().slice(0,2).toLowerCase();
        if (SUPPORTED.includes(first)) return first;
      }
      const cc = (j && j.country_code ? String(j.country_code).toUpperCase() : '');
      if (cc === 'IT') return 'it';
      if (cc === 'FR') return 'fr';
      if (['ES','MX','AR','CL','CO','PE','VE','UY','PY','BO','EC','DO','GT','HN','SV','NI','CR','PA','PR','CU'].includes(cc)) return 'es';
    } catch(_) { /* ignore network errors */ }

    // 3) Fallback
    return 'en';
  }

  // Detect best language synchronously if possible, else fallback to en
  let initialLang = 'en';
  (function syncDetect() {
    // Try browser languages first
    const navLangs = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || ''];
    for (const l of navLangs) {
      const base = String(l || '').slice(0,2).toLowerCase();
      if (SUPPORTED.includes(base)) { initialLang = base; break; }
    }
  })();

  window.i18n = { t, setLang, applyTranslations, lang: initialLang, dicts: dictionaries };

  document.addEventListener('DOMContentLoaded', () => {
    setLang(initialLang);
    // Now refine with IP geolocation (async, may update after paint)
    detectBestLanguage().then(best => { if (best && best !== i18n.lang) setLang(best); });
    // Language FAB menu
    const fab = document.getElementById('langFab');
    const menu = document.getElementById('langMenu');
    if (fab && menu) {
      const positionMenu = () => {
        if (menu.getAttribute('aria-hidden') === 'true') return;
        // Reset constraints to allow measuring
        menu.style.right = 'auto';
        menu.style.bottom = 'auto';
        // Measure after ensured visible
        const fabRect = fab.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const gap = 8;
        let left = fabRect.left + (fabRect.width / 2) - (menuRect.width / 2);
        let top = fabRect.top - menuRect.height - gap;
        // Clamp inside viewport
        left = Math.max(8, Math.min(window.innerWidth - menuRect.width - 8, left));
        top = Math.max(8, top);
        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
        menu.style.position = 'fixed';
      };
      const toggle = () => {
        const open = menu.getAttribute('aria-hidden') !== 'false';
        menu.setAttribute('aria-hidden', open ? 'false' : 'true');
        fab.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
          // Wait a tick so it's painted, then position
          requestAnimationFrame(() => positionMenu());
        }
      };
      fab.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
      document.addEventListener('click', (e) => {
        if (menu.getAttribute('aria-hidden') === 'false') {
          if (!menu.contains(e.target) && e.target !== fab) {
            menu.setAttribute('aria-hidden','true');
            fab.setAttribute('aria-expanded','false');
          }
        }
      });
      window.addEventListener('resize', () => { positionMenu(); });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.getAttribute('aria-hidden') === 'false') {
          menu.setAttribute('aria-hidden','true');
          fab.setAttribute('aria-expanded','false');
        }
      });
      menu.querySelectorAll('.lang-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const lang = btn.getAttribute('data-lang');
          setLang(lang);
          // Save only for this session, not for reload
          try { localStorage.removeItem('i18n:lang'); } catch(_) {}
          menu.setAttribute('aria-hidden','true');
          fab.setAttribute('aria-expanded','false');
        });
      });
    }
  });

  // Expose helpers for dynamic components
  window.i18nFormat = function(key, params) {
    let str = t(key);
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, (_,k) => params[k] ?? `{${k}}`);
  };
})();
