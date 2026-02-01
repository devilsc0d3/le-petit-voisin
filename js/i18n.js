(async function() {
  const supported = ['fr', 'en'];
  const defaultLang = 'fr';

  function getStoredLang() {
    const stored = localStorage.getItem('lang');
    if (stored && supported.includes(stored)) return stored;
    const nav = (navigator.language || navigator.userLanguage || defaultLang).split('-')[0];
    return supported.includes(nav) ? nav : defaultLang;
  }

  let currentLang = getStoredLang();

  // Embedded fallback translations (used when fetch fails, e.g., file:// or missing server)
  const embedded = {
    fr: {
      "nav": {"about":"À propos","happy":"Happy Hour","hours":"Horaires","cocktail":"Cocktail","gallery":"Galerie","location":"Localisation","contact":"Contact","brand":"Le Petit Voisin","tag":"Bière · Café · Cocktail · Tapas","lang": {"fr":"FR","en":"EN"}},
      "hero": {"eyebrow":"Bienvenue à Toulouse","title":"Le Petit<br><em>Voisin</em>","desc":"Cocktails créatifs, bières locales et soirées live — un endroit chaleureux pour partager un verre entre amis, au cœur de la ville.","cta":"Menu des boissons","more":"En savoir plus"},
      "about": {"label":"À propos","title":"Un endroit où<br>se sentir <em>chez soi</em>","desc":"Le Petit Voisin vous accueille chaleureusement au cœur de Toulouse. Savourez une cuisine maison — tapas, sandwichs et crêpes sucrées — préparée avec soin par notre équipe. Accompagnez-la d'une boisson rafraîchissante ou d'un cocktail signature. Profitez d'une ambiance conviviale, musique live et happy hours réguliers pour des soirées mémorables.","stats":{"rating":"4.5 étoiles sur Google","cocktails":"Cocktails<br>signatures","wines":"Sirops<br>différents","nights":"Soirées<br>mémorables"}},
      "hours": {"label":"Horaires","title":"Nos <em>ouvertures</em>","weekTitle":"Semaine","weekendTitle":"Week-end","days":{"monday":"Lundi","tuesday":"Mardi","wednesday":"Mercredi","thursday":"Jeudi","friday":"Vendredi","saturday":"Samedi","sunday":"Dimanche"},"closed":"Fermé"},
      "cocktail": {"label":"Chaque semaine","title":"Cocktail<br><em>Surprise</em>","desc":"Demandez un cocktail surprise : laissez le barman vous surprendre entièrement, ou choisissez la base d’alcool (gin, rhum, vodka…) et nous créerons une recette sur‑mesure pour vous.","tag":"Nouvelle création cette semaine"},
      "happy": {"label":"Happy Hour","title":"Happy<br><em>Hour</em>","desc":"  Servie avec cacahuètes.","items":{"kro":"Pinte de Kro — 3 €","ricard":"Ricard — 1 €"}},
      "location": {"label":"Où nous trouver","title":"Notre<br><em>adresse</em>","desc":"Situés à proximité des principaux quartiers animés de Toulouse, nous vous attendons.","address":"<span>37 Rue Peyrolières</span> · 31000 Toulouse"},
      "contact": {"label":"Contact","title":"Restons en<br><em>touch</em>","phoneTitle":"Téléphone","phoneDesc":"Réservations et informations sur les événements.","addressTitle":"Adresse","addressDesc":"37 Rue Peyrolières<br>31000 Toulouse, France","socialTitle":"Suivez-nous","instagram":"Instagram","facebook":"Facebook"},
      "gallery": {"label":"Galerie","title":"Nos <em>instants</em>","desc":"Quelques moments capturés au bar — ambiance, cocktails et soirées."},
      "footer": {"reservation":"Réservation : <a href=\"tel:+33561000000\">+33 5 61 00 00 00</a>"}
    },
    en: {
      "nav": {"about":"About","happy":"Happy Hour","hours":"Hours","cocktail":"Cocktail","gallery":"Gallery","location":"Location","contact":"Contact","brand":"Le Petit Voisin","tag":"Beer · Coffee · Cocktail · Tapas","lang": {"fr":"FR","en":"EN"}},
      "hero": {"eyebrow":"Welcome to Toulouse","title":"Le Petit<br><em>Voisin</em>","desc":"Creative cocktails, local beers and live music nights — a warm spot to share a drink with friends in the heart of the city.","cta":"Drinks menu","more":"Learn more"},
      "about": {"label":"About","title":"A place to<br>feel <em>at home</em>","desc":"Le Petit Voisin welcomes you warmly in the heart of Toulouse. Enjoy homemade dishes — tapas, sandwiches and sweet crêpes — carefully prepared by our team. Pair them with refreshing drinks or one of our signature cocktails. Relax in a friendly atmosphere with live music and regular happy hours for memorable evenings.","stats":{"rating":"4.5 stars on Google","cocktails":"Signature<br>cocktails","wines":"Different<br>syrups","nights":"Memorable<br>nights"}},
      "cocktail": {"label":"Every week","title":"Cocktail<br><em>Surprise</em>","desc":"Ask for a surprise cocktail: either let the bartender surprise you completely, or choose your alcohol base (gin, rum, vodka…) and we'll craft a custom drink just for you.","tag":"New creation this week"},
      "happy": {"label":"Happy Hour","title":"Happy<br><em>Hour</em>","desc":"Served with peanuts.","items":{"kro":"Pint of Kro — €3","ricard":"Ricard — €1"}},
      "location": {"label":"Where to find us","title":"Our<br><em>address</em>","desc":"Located near the main lively neighborhoods of Toulouse, we look forward to welcoming you.","address":"<span>37 Rue Peyrolières</span> · 31000 Toulouse"},
      "contact": {"label":"Contact","title":"Stay in<br><em>touch</em>","phoneTitle":"Phone","phoneDesc":"Reservations and event information.","addressTitle":"Address","addressDesc":"37 Rue Peyrolières<br>31000 Toulouse, France","socialTitle":"Follow us","instagram":"Instagram","facebook":"Facebook"},
      "gallery": {"label":"Gallery","title":"Our <em>moments</em>","desc":"Some moments captured at the bar — atmosphere, cocktails and nights out."},
      "footer": {"reservation":"Reservation : <a href=\"tel:+33561000000\">+33 5 61 00 00 00</a>"}
    }
  };

  async function load(lang) {
    try {
      const url = new URL(`../js/i18n/${lang}.json`, location.href).href;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Translations not found: ' + url);
      const t = await res.json();
      applyTranslations(t);
    } catch (e) {
      console.warn('i18n load failed, using embedded fallback', e);
      if (embedded && embedded[lang]) {
        applyTranslations(embedded[lang]);
      } else {
        console.error('No embedded translations for', lang);
        return;
      }
    }

    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false'));
  }

  function applyTranslations(t) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = key.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, t);
      if (val !== undefined && val !== null) {
        if (/</.test(val)) el.innerHTML = val;
        else el.textContent = val;
      }
    });
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;
      load(lang);

      const links = document.querySelector('.nav__links');
      const toggle = document.querySelector('.nav__toggle');
      if (links && links.classList.contains('open')) {
        links.classList.remove('open');
        if (toggle) toggle.classList.remove('open');
        document.body.classList.remove('no-scroll');
      }
    });
  });

  // initial load
  load(currentLang);
})();