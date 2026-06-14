/* ── 1. DATA ─────────────────────────────────────────────────────────────── */

const COUNTRIES = {
  "DZ": { name: "Algeria",                conf: "CAF",      rank: 47  },
  "AR": { name: "Argentina",              conf: "CONMEBOL", rank: 1   },
  "AU": { name: "Australia",              conf: "AFC",      rank: 23  },
  "AT": { name: "Austria",               conf: "UEFA",     rank: 24  },
  "BE": { name: "Belgium",               conf: "UEFA",     rank: 3   },
  "BA": { name: "Bosnia and Herzegovina", conf: "UEFA",     rank: 63  },
  "BR": { name: "Brazil",                conf: "CONMEBOL", rank: 5   },
  "CA": { name: "Canada",                conf: "CONCACAF", rank: 47  },
  "CV": { name: "Cape Verde",            conf: "CAF",      rank: 72  },
  "CO": { name: "Colombia",              conf: "CONMEBOL", rank: 10  },
  "HR": { name: "Croatia",               conf: "UEFA",     rank: 10  },
  "CW": { name: "Curaçao",               conf: "CONCACAF", rank: 88  },
  "CZ": { name: "Czech Republic",        conf: "UEFA",     rank: 34  },
  "CD": { name: "DR Congo",              conf: "CAF",      rank: 78  },
  "DK": { name: "Denmark",               conf: "UEFA",     rank: 21  },
  "EC": { name: "Ecuador",               conf: "CONMEBOL", rank: 31  },
  "EG": { name: "Egypt",                 conf: "CAF",      rank: 36  },
  "FR": { name: "France",                conf: "UEFA",     rank: 2   },
  "DE": { name: "Germany",               conf: "UEFA",     rank: 13  },
  "GH": { name: "Ghana",                 conf: "CAF",      rank: 66  },
  "HT": { name: "Haiti",                 conf: "CONCACAF", rank: 104 },
  "HN": { name: "Honduras",              conf: "CONCACAF", rank: 90  },
  "IR": { name: "Iran",                  conf: "AFC",      rank: 25  },
  "IQ": { name: "Iraq",                  conf: "AFC",      rank: 62  },
  "CI": { name: "Ivory Coast",           conf: "CAF",      rank: 57  },
  "JP": { name: "Japan",                 conf: "AFC",      rank: 22  },
  "JO": { name: "Jordan",                conf: "AFC",      rank: 74  },
  "KZ": { name: "Kazakhstan",            conf: "UEFA",     rank: 88  },
  "KR": { name: "South Korea",           conf: "AFC",      rank: 23  },
  "MX": { name: "Mexico",                conf: "CONCACAF", rank: 16  },
  "MA": { name: "Morocco",               conf: "CAF",      rank: 14  },
  "NZ": { name: "New Zealand",           conf: "OFC",      rank: 98  },
  "NO": { name: "Norway",                conf: "UEFA",     rank: 27  },
  "PA": { name: "Panama",                conf: "CONCACAF", rank: 82  },
  "PY": { name: "Paraguay",              conf: "CONMEBOL", rank: 65  },
  "PT": { name: "Portugal",              conf: "UEFA",     rank: 6   },
  "QA": { name: "Qatar",                 conf: "AFC",      rank: 39  },
  "SA": { name: "Saudi Arabia",          conf: "AFC",      rank: 60  },
  "SN": { name: "Senegal",               conf: "CAF",      rank: 20  },
  "ZA": { name: "South Africa",          conf: "CAF",      rank: 64  },
  "ES": { name: "Spain",                 conf: "UEFA",     rank: 3   },
  "SE": { name: "Sweden",                conf: "UEFA",     rank: 25  },
  "CH": { name: "Switzerland",           conf: "UEFA",     rank: 19  },
  "TN": { name: "Tunisia",               conf: "CAF",      rank: 43  },
  "TR": { name: "Turkey",                conf: "UEFA",     rank: 40  },
  "US": { name: "United States",         conf: "CONCACAF", rank: 14  },
  "UY": { name: "Uruguay",               conf: "CONMEBOL", rank: 18  },
  "UZ": { name: "Uzbekistan",            conf: "AFC",      rank: 68  },
  // NOTE: England and Scotland are NOT in this object.
  // They share the SVG's id="GB" path (ISO 3166-1 has no separate code for
  // either nation). They are handled via GB_SHARED below.
};

const CONF_COLORS = {
  "UEFA":     "#3b82f6",
  "CONMEBOL": "#22c55e",
  "CONCACAF": "#f59e0b",
  "CAF":      "#ef4444",
  "AFC":      "#a855f7",
  "OFC":      "#06b6d4",
};

// World Cup 2026 groups
const GROUPS = {
  "A": ["Czech Republic", "Mexico", "South Africa", "South Korea", "Bosnia and Herzegovina"],
  "B": ["Bosnia and Herzegovina", "Canada", "Qatar", "Switzerland"],
  "C": ["Brazil", "Haiti", "Morocco", "Scotland"],
  "D": ["Australia", "Paraguay", "Turkey", "United States"],
  "E": ["Curaçao", "Ecuador", "Germany", "Ivory Coast"],
  "F": ["Japan", "Netherlands", "Sweden", "Tunisia"],
  "G": ["Belgium", "Egypt", "Iran", "New Zealand"],
  "H": ["Cape Verde", "Saudi Arabia", "Spain", "Uruguay"],
  "I": ["France", "Iraq", "Norway", "Senegal"],
  "J": ["Algeria", "Argentina", "Austria", "Jordan"],
  "K": ["Colombia", "DR Congo", "Portugal", "Uzbekistan"],
  "L": ["Croatia", "England", "Ghana", "Panama"],
};

// Reverse lookup: country name → group letter
const countryGroup = {};
Object.entries(GROUPS).forEach(([g, nations]) => {
  nations.forEach(n => { countryGroup[n] = g; });
});

// England and Scotland share the SVG's GB path but are separate FIFA members
const GB_SHARED = [
  { name: "England",  conf: "UEFA", rank: 5,  group: countryGroup["England"]  || "—" },
  { name: "Scotland", conf: "UEFA", rank: 39, group: countryGroup["Scotland"] || "—" },
];


/* ── 2. FETCH SVG + BOOT ─────────────────────────────────────────────────── */

// Why fetch() + innerHTML rather than <img>, <object>, or <iframe>?
// Those approaches load the SVG as a separate document or opaque image,
// meaning JS cannot reach the inner .country paths with querySelector.
// fetch() downloads the SVG text and injects it directly into the DOM,
// so every .country path is a real element the rest of this script can use.

fetch("https://pab-ns.github.io/WC26/assets/map.svg")
  .then(r => {
    if (!r.ok) throw new Error("Could not load world-map.svg — HTTP " + r.status);
    return r.text();
  })
  .then(svgText => {
    const wrap = document.getElementById("map-svg-wrap");
    wrap.innerHTML = svgText;

    // Make SVG fill its container
    const svg = wrap.querySelector("svg");
    if (svg) {
      svg.style.width   = "100%";
      svg.style.height  = "100%";
      svg.style.display = "block";
    }

    // Remove the loading placeholder
    document.getElementById("map-loading")?.remove();

    initMap();
  })
  .catch(err => {
    const el = document.getElementById("map-loading");
    if (el) {
      el.textContent = "Map failed to load. " + err.message;
      el.classList.add("text-red-400");
    }
    console.error(err);
  });


/* ── 3. MAP LOGIC (called after SVG is in the DOM) ──────────────────────── */

function initMap() {

  // ── 3a. Confederation counts (for any #cnt-* badges in the HTML) ─────────
  const confCounts = {};
  Object.values(COUNTRIES).forEach(c => {
    confCounts[c.conf] = (confCounts[c.conf] || 0) + 1;
  });
  Object.entries(confCounts).forEach(([conf, count]) => {
    const el = document.getElementById("cnt-" + conf);
    if (el) el.textContent = count;
  });


  // ── 3b. Colour qualified countries ───────────────────────────────────────
  const qualifiedIds = new Set(Object.keys(COUNTRIES));

  document.querySelectorAll(".country").forEach(path => {
    if (qualifiedIds.has(path.id)) {
      path.classList.add("qualified");
      path.style.fill = CONF_COLORS[COUNTRIES[path.id].conf] || "#888";
    }
  });

  // GB (United Kingdom) covers both England and Scotland — always UEFA blue
  const gbPath = document.getElementById("GB");
  if (gbPath) {
    gbPath.classList.add("qualified");
    gbPath.style.fill = CONF_COLORS["UEFA"];
  }


  // ── 3c. Host-nation glow (USA, Canada, Mexico) ───────────────────────────
  ["US", "CA", "MX"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.filter = "drop-shadow(0 0 4px rgba(240,180,41,0.6))";
  });


  // ── 3d. Tooltip ──────────────────────────────────────────────────────────
  const tooltip  = document.getElementById("tooltip");
  const tipInner = tooltip.querySelector(".bg-white");

  // Standard single-country tooltip markup (restored before each single use,
  // since showGBTooltip replaces tipInner content with a two-row layout)
  const SINGLE_TOOLTIP_HTML = `
    <div class="px-4 py-3 border-b border-black/[0.07]">
      <div id="tip-country" class="text-lg font-bold leading-none tracking-wide text-black"></div>
      <div class="flex items-center gap-2 mt-2">
        <div id="tip-conf-dot" class="w-2 h-2 rounded-full shrink-0"></div>
        <div id="tip-conf" class="text-[0.6rem] tracking-widest uppercase font-semibold"></div>
      </div>
    </div>
    <div class="px-4 py-3 flex items-center justify-between gap-6">
      <div>
        <div class="text-[0.57rem] tracking-widest uppercase text-black/40 mb-1">FIFA Ranking</div>
        <div id="tip-rank" class="text-lg font-bold leading-none text-black"></div>
      </div>
      <div class="text-right">
        <div class="text-[0.57rem] tracking-widest uppercase text-black/40 mb-1">Group</div>
        <div id="tip-group" class="text-lg font-bold leading-none text-black"></div>
      </div>
    </div>
  `;

  function showSingleTooltip(data, e) {
    tipInner.innerHTML = SINGLE_TOOLTIP_HTML;

    const grp = countryGroup[data.name] || "—";

    document.getElementById("tip-country").textContent       = data.name;
    document.getElementById("tip-conf").textContent          = data.conf;
    document.getElementById("tip-conf-dot").style.background = CONF_COLORS[data.conf];
    document.getElementById("tip-conf").style.color          = CONF_COLORS[data.conf];
    document.getElementById("tip-rank").textContent          = "#" + data.rank;
    document.getElementById("tip-group").textContent         = grp;

    tooltip.style.display = "block";
    positionTooltip(e);
  }

  function showGBTooltip(e) {
    // Two-row layout — one row per nation
    tipInner.innerHTML = `
      <div class="px-4 py-2.5 border-b border-black/[0.07]">
        <div class="text-[0.6rem] tracking-widest uppercase font-semibold text-slate-400">
          Two nations, one map shape
        </div>
      </div>
      <div class="divide-y divide-black/[0.06]">
        ${GB_SHARED.map(c => `
          <div class="px-4 py-2.5 flex items-center justify-between gap-6">
            <div>
              <div class="text-base font-bold leading-none text-black mb-1">${c.name}</div>
              <div class="flex items-center gap-1.5">
                <span class="inline-block w-2 h-2 rounded-full shrink-0"
                      style="background:${CONF_COLORS[c.conf]}"></span>
                <span class="text-[0.6rem] tracking-widest uppercase font-semibold"
                      style="color:${CONF_COLORS[c.conf]}">${c.conf}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-[0.57rem] tracking-widest uppercase text-black/40 mb-0.5">FIFA Ranking</div>
              <div class="text-2xl font-bold leading-none text-black">#${c.rank}</div>
            </div>
            <div class="text-right">
              <div class="text-[0.57rem] tracking-widest uppercase text-black/40 mb-0.5">Group</div>
              <div class="text-2xl font-bold leading-none text-black">${c.group}</div>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    tooltip.style.display = "block";
    positionTooltip(e);
  }

  function positionTooltip(e) {
    const tw = 240, th = 150;
    let x = e.clientX + 16;
    let y = e.clientY - 10;
    if (x + tw > window.innerWidth  - 10) x = e.clientX - tw - 12;
    if (y + th > window.innerHeight - 10) y = e.clientY - th - 8;
    tooltip.style.left = x + "px";
    tooltip.style.top  = y + "px";
  }

  document.querySelectorAll(".country.qualified").forEach(path => {
    path.addEventListener("mouseenter", function(e) {
      if (this.id === "GB") {
        showGBTooltip(e);
        return;
      }
      const data = COUNTRIES[this.id];
      if (data) showSingleTooltip(data, e);
    });

    path.addEventListener("mousemove", positionTooltip);

    path.addEventListener("mouseleave", function() {
      tooltip.style.display = "none";
    });
  });


  // ── 3e. Confederation filter ──────────────────────────────────────────────
  document.querySelectorAll(".conf-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const activeFilter = this.dataset.conf;

      // Reset all button styles, then highlight the clicked one
      document.querySelectorAll(".conf-btn").forEach(b => {
        b.style.background  = "";
        b.style.color       = "";
        b.style.borderColor = "";
      });

      const color = CONF_COLORS[activeFilter];
      if (color) {
        this.style.background  = color;
        this.style.color       = "#000";
        this.style.borderColor = color;
      } else {
        // "All" button
        this.style.background  = "#333";
        this.style.color       = "#ccc";
        this.style.borderColor = "#555";
      }

      // Dim/show map paths
      document.querySelectorAll(".country.qualified").forEach(path => {
        // GB is always UEFA
        if (path.id === "GB") {
          const visible = activeFilter === "ALL" || activeFilter === "UEFA";
          path.classList.toggle("dimmed", !visible);
          if (visible) path.style.fill = CONF_COLORS["UEFA"];
          return;
        }

        const data = COUNTRIES[path.id];
        if (!data) return;

        const visible = activeFilter === "ALL" || data.conf === activeFilter;
        path.classList.toggle("dimmed", !visible);
        if (visible) path.style.fill = CONF_COLORS[data.conf];
      });

      // Dim/show legend items
      document.querySelectorAll(".legend-item").forEach(item => {
        const visible = activeFilter === "ALL" || item.dataset.conf === activeFilter;
        item.classList.toggle("dimmed", !visible);
      });
    });
  });


  // ── 3f. Legend click → trigger matching filter button ────────────────────
  document.querySelectorAll(".legend-item").forEach(item => {
    item.addEventListener("click", function() {
      const btn = document.querySelector(`.conf-btn[data-conf="${this.dataset.conf}"]`);
      if (btn) btn.click();
    });
  });

}
