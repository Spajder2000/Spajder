/* ============================================================
   PMT dla branży gamingowej — interakcje strony
   ============================================================ */
(function () {
  "use strict";

  /* ---------- nagłówek: tło po przewinięciu ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- menu mobilne ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  mainNav.addEventListener("click", (e) => {
    if (e.target.matches("a")) {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- animacje wejścia przy scrollu ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- animowane liczniki ---------- */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        if (prefersReducedMotion) {
          el.textContent = target;
          return;
        }
        const duration = 1200;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".count").forEach((el) => countObserver.observe(el));

  /* ---------- mapa rynków + karta rynku ---------- */
  const COUNTRIES = {
    us: {
      name: "USA",
      tagline: "Największa gospodarka świata i stabilny rynek",
      potential: "Wysoki potencjał",
      market: "amerykański",
      potentialPoints: [
        "Największy rynek konsumencki na świecie",
        "Wysoka siła nabywcza i gotowość do płacenia za jakość i innowacje",
        "Dynamiczny rozwój e-commerce i sprzedaży online",
        "Ogromne możliwości w sektorach B2B i technologicznych",
      ],
      clients:
        "Wysoka jakość, niezawodność, certyfikaty i zgodność z normami amerykańskimi (FDA, UL, ISO), szybka realizacja i doskonała obsługa posprzedażowa.",
      success:
        "Polskie firmy z branży meblarskiej, maszynowej, kosmetycznej i IT skutecznie rozwijają sprzedaż w USA, budując długotrwałe relacje z partnerami biznesowymi.",
    },
    cn: {
      name: "Chiny",
      tagline: "Gigantyczny rynek i ogromny potencjał wzrostu",
      potential: "Bardzo wysoki potencjał",
      market: "chiński",
      potentialPoints: [
        "Druga największa gospodarka świata",
        "Ogromna klasa średnia i rosnąca siła nabywcza",
        "Wysoki popyt na innowacyjne i wysokiej jakości produkty z zagranicy",
        "Dynamiczny rozwój e-commerce i kanałów cyfrowych",
      ],
      clients:
        "Wysoka jakość, niezawodność, bezpieczeństwo, nowoczesny design, prestiż marki oraz dopasowanie do lokalnych potrzeb i trendów.",
      success:
        "Polskie marki z branży kosmetycznej, spożywczej i meblarskiej zdobywają rosnące uznanie wśród chińskich konsumentów i dystrybutorów.",
    },
    gb: {
      name: "Wielka Brytania",
      tagline: "Stabilny, dojrzały rynek bliski kulturowo i prawnie",
      potential: "Wysoki potencjał",
      market: "brytyjski",
      potentialPoints: [
        "6. co do wielkości gospodarka świata",
        "Silny popyt na innowacyjne i wysokiej jakości produkty",
        "Dostęp do rynku Commonwealth i dalszych rynków międzynarodowych",
        "Bliskość geograficzna i kulturowa – łatwiejsze relacje biznesowe",
      ],
      clients:
        "Jakości, trwałości, certyfikatów, przejrzystej komunikacji, szybkich dostaw oraz zgodności z normami i regulacjami.",
      success:
        "Polskie marki meblarskie, kosmetyczne, spożywcze i technologiczne skutecznie budują rozpoznawalność i zwiększają sprzedaż w Wielkiej Brytanii.",
    },
    jp: {
      name: "Japonia",
      tagline: "Innowacyjny rynek ceniony za jakość i technologie",
      potential: "Wysoki potencjał",
      market: "japoński",
      potentialPoints: [
        "3. największa gospodarka świata",
        "Wysoka siła nabywcza i stabilne otoczenie biznesowe",
        "Duże zapotrzebowanie na innowacyjne i wysokiej jakości produkty",
        "Rosnący import w sektorach technologicznych, medycznych i ekologicznych",
      ],
      clients:
        "Jakości, niezawodności, precyzji, bezpieczeństwa, dbałości o detale oraz certyfikatów i zgodności z normami japońskimi.",
      success:
        "Polskie firmy z branży maszynowej, meblarskiej i kosmetycznej skutecznie rozwijają sprzedaż w Japonii.",
    },
  };

  const ccFlag = document.getElementById("ccFlag");
  const ccName = document.getElementById("ccName");
  const ccTagline = document.getElementById("ccTagline");
  const ccPotentialText = document.getElementById("ccPotentialText");
  const ccPotList = document.getElementById("ccPotList");
  const ccClients = document.getElementById("ccClients");
  const ccSuccess = document.getElementById("ccSuccess");
  const ccAmount = document.getElementById("ccAmount");
  const switchButtons = document.querySelectorAll(".country-switch button");
  const markers = document.querySelectorAll(".map-marker");

  function selectCountry(code) {
    const data = COUNTRIES[code];
    if (!data) return;
    ccFlag.innerHTML =
      '<svg viewBox="0 0 28 20" aria-hidden="true"><use href="#flag-' + code + '"/></svg>';
    ccName.textContent = data.name;
    ccTagline.textContent = data.tagline;
    ccPotentialText.textContent = data.potential;
    ccClients.textContent = data.clients;
    ccSuccess.textContent = data.success;
    ccAmount.textContent = "na działania wspierające wejście na rynek " + data.market + ".";
    ccPotList.innerHTML = data.potentialPoints
      .map(
        (p) =>
          '<li><svg aria-hidden="true"><use href="#i-check"/></svg><span>' + p + "</span></li>"
      )
      .join("");

    switchButtons.forEach((b) => {
      const active = b.dataset.country === code;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", String(active));
    });
    markers.forEach((m) => m.classList.toggle("is-active", m.dataset.country === code));
    document
      .querySelectorAll(".map-target")
      .forEach((p) => p.classList.toggle("is-active", p.dataset.country === code));
  }

  switchButtons.forEach((b) =>
    b.addEventListener("click", () => selectCountry(b.dataset.country))
  );
  markers.forEach((m) => m.addEventListener("click", () => selectCountry(m.dataset.country)));
  document.querySelectorAll(".map-target").forEach((p) => {
    p.addEventListener("click", () => selectCountry(p.dataset.country));
  });
  selectCountry("us");

  /* ---------- kalendarz rezerwacji ---------- */
  const MONTHS = [
    "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec",
    "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień",
  ];
  const DOWS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
  const SLOT_TIMES = ["09:00", "11:00", "13:00", "15:00"];

  const calTitle = document.getElementById("calTitle");
  const calGrid = document.getElementById("calGrid");
  const calPrev = document.getElementById("calPrev");
  const calNext = document.getElementById("calNext");
  const slotsBox = document.getElementById("slotsBox");
  const slotsDate = document.getElementById("slotsDate");
  const slotGrid = document.getElementById("slotGrid");
  const bookingSummary = document.getElementById("bookingSummary");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  const maxView = new Date(today.getFullYear(), today.getMonth() + 3, 1);
  let selectedDate = null;
  let selectedSlot = null;

  // deterministyczny "hash" — te same dni/godziny są zajęte przy każdym renderze
  function seeded(y, m, d, extra) {
    let h = y * 31 + m * 12 + d * 7 + (extra || 0) * 3;
    h = (h * 2654435761) % 4294967296;
    return (h >>> 8) / 16777216;
  }

  function isBookable(date) {
    const dow = date.getDay();
    if (dow === 0 || dow === 6) return false; // weekendy
    if (date <= today) return false; // przeszłość i dziś
    // symulacja obłożenia: ok. 1/4 dni roboczych zajęta
    return seeded(date.getFullYear(), date.getMonth(), date.getDate()) > 0.25;
  }

  function formatDate(date) {
    return (
      date.getDate() + " " +
      ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca",
       "sierpnia", "września", "października", "listopada", "grudnia"][date.getMonth()] +
      " " + date.getFullYear()
    );
  }

  function renderCalendar() {
    calTitle.textContent = MONTHS[viewMonth] + " " + viewYear;
    calGrid.innerHTML = "";
    DOWS.forEach((d) => {
      const el = document.createElement("span");
      el.className = "dow";
      el.textContent = d;
      calGrid.appendChild(el);
    });

    const first = new Date(viewYear, viewMonth, 1);
    const offset = (first.getDay() + 6) % 7; // poniedziałek jako pierwszy dzień
    for (let i = 0; i < offset; i++) calGrid.appendChild(document.createElement("span"));

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-day";
      btn.textContent = d;
      const free = isBookable(date);
      if (date.getTime() === today.getTime()) btn.classList.add("is-today");
      if (free) {
        btn.classList.add("is-free");
        btn.setAttribute("aria-label", formatDate(date) + " — dostępne terminy");
        if (selectedDate && date.getTime() === selectedDate.getTime()) {
          btn.classList.add("is-selected");
        }
        btn.addEventListener("click", () => {
          selectedDate = date;
          selectedSlot = null;
          renderCalendar();
          renderSlots();
        });
      } else {
        btn.disabled = true;
      }
      calGrid.appendChild(btn);
    }

    const prevBoundary = new Date(viewYear, viewMonth, 1);
    calPrev.disabled = prevBoundary <= new Date(today.getFullYear(), today.getMonth(), 1);
    calNext.disabled = new Date(viewYear, viewMonth + 1, 1) > maxView;
  }

  function renderSlots() {
    if (!selectedDate) {
      slotsBox.hidden = true;
      return;
    }
    slotsBox.hidden = false;
    slotsDate.textContent = formatDate(selectedDate);
    slotGrid.innerHTML = "";
    SLOT_TIMES.forEach((time, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot";
      btn.textContent = time;
      const taken =
        seeded(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), i + 1) < 0.3;
      if (taken) {
        btn.disabled = true;
        btn.setAttribute("aria-label", time + " — termin zajęty");
      } else {
        if (selectedSlot === time) btn.classList.add("is-selected");
        btn.addEventListener("click", () => {
          selectedSlot = time;
          renderSlots();
          updateSummary();
        });
      }
      slotGrid.appendChild(btn);
    });
    updateSummary();
  }

  function updateSummary() {
    if (selectedDate && selectedSlot) {
      bookingSummary.classList.add("is-visible");
      bookingSummary.innerHTML =
        "Wybrany termin: <strong>" + formatDate(selectedDate) +
        ", godz. " + selectedSlot + "</strong>";
    } else {
      bookingSummary.classList.remove("is-visible");
    }
  }

  calPrev.addEventListener("click", () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });
  calNext.addEventListener("click", () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });
  renderCalendar();

  /* ---------- formularz rezerwacji ---------- */
  const bookingForm = document.getElementById("bookingForm");
  const bookingSuccess = document.getElementById("bookingSuccess");
  const successDetails = document.getElementById("successDetails");

  function validateField(input, check) {
    const field = input.closest(".field");
    const ok = check(input.value.trim());
    field.classList.toggle("has-error", !ok);
    return ok;
  }

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("bfName");
    const email = document.getElementById("bfEmail");
    const company = document.getElementById("bfCompany");

    const okName = validateField(name, (v) => v.length >= 3);
    const okEmail = validateField(email, (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    const okCompany = validateField(company, (v) => v.length >= 2);

    if (!selectedDate || !selectedSlot) {
      bookingSummary.classList.add("is-visible");
      bookingSummary.innerHTML =
        "<strong>Wybierz dzień i godzinę</strong> w kalendarzu powyżej, aby dokończyć rezerwację.";
      slotsBox.hidden && calGrid.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!(okName && okEmail && okCompany)) {
      const firstError = bookingForm.querySelector(".has-error input");
      if (firstError) firstError.focus();
      return;
    }

    // DEMO: w wersji produkcyjnej podepnij tu backend / Calendly / Cal.com
    // (patrz komentarz "INTEGRACJA Z KALENDARZEM" w index.html).
    bookingForm.hidden = true;
    slotsBox.hidden = true;
    calGrid.parentElement.querySelector(".cal-head").style.display = "none";
    calGrid.style.display = "none";
    successDetails.innerHTML =
      "<strong>" + formatDate(selectedDate) + ", godz. " + selectedSlot + "</strong><br>" +
      name.value.trim() + " · " + company.value.trim();
    bookingSuccess.classList.add("is-visible");
    bookingSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* ---------- FAQ: zawsze tylko jedno otwarte ---------- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) faqItems.forEach((o) => { if (o !== item) o.open = false; });
    });
  });

  /* ---------- rok w stopce ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
