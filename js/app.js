// app.js — behaviour only. Reads window.WC (data) + window.FLAGS (assets)
// and renders the group grid for whichever World Cup the slider points at.
// No data or markup lives here; edit data.js / index for those.

(function () {
  "use strict";

  const tournaments = (window.WC && window.WC.tournaments) || [];
  const FLAGS = window.FLAGS || {};
  const FALLBACK = "cl"; // Chile — last-resort fallback if a code is ever missing

  const els = {
    grid:   document.getElementById("wc-grid"),
    year:   document.getElementById("wc-year"),
    meta:   document.getElementById("wc-meta"),
    slider: document.getElementById("wc-slider"),
    labels: document.getElementById("wc-labels"),
  };

  // --- helpers ---------------------------------------------------------------

  const flagSVG = (code) => {
    if (FLAGS[code]) return FLAGS[code];
    console.warn(`[flags] no SVG for "${code}" — using ${FALLBACK} fallback`);
    return FLAGS[FALLBACK] || "";
  };

  const flag = (code, name) =>
    `<span class="flag block w-7 h-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/5"
           role="img" aria-label="${name} flag">${flagSVG(code)}</span>`;

  const teamRow = (name, flagOf) => `
    <div class="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-neutral-50">
      ${flag(flagOf[name], name)}
      <span class="truncate text-[13px] text-neutral-800 sm:text-sm">${name}</span>
    </div>`;

  const groupCard = (group, flagOf) => {
    const header = group.label
      ? `<div class="px-4 pb-2 pt-3">
           <h3 class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">${group.label}</h3>
         </div>`
      : `<div class="px-4 pb-2 pt-3">
           <h3 class="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Qualified</h3>
         </div>`;
    const rows = group.teams.map((t) => teamRow(t, flagOf)).join("");
    return `<div class="overflow-hidden rounded-lg border border-neutral-200/80 bg-white shadow-sm">
              ${header}<div class="divide-y divide-neutral-100">${rows}</div>
            </div>`;
  };

  const metaLine = (t) => {
    const structure =
      t.format === "knockout"
        ? "single-elimination · no group stage"
        : `${t.groups.length} groups`;
    return `${t.host} &middot; ${t.teams} teams &middot; ${structure}`;
  };

  // --- render ----------------------------------------------------------------

  function render(index) {
    const t = tournaments[index];
    if (!t) return;
    const flagOf = window.WC.flagOf;

    els.year.textContent = t.year;
    els.meta.innerHTML = metaLine(t);

    els.grid.innerHTML = t.groups.map((g) => groupCard(g, flagOf)).join("");
    markActive(index);
  }

  // --- year ticks under the slider ------------------------------------------
  // The browser insets the thumb by its radius at each end; mirror that so each
  // tick centres under its stop. Ticks are clickable; alternate ones hide on
  // small screens (the active tick is forced visible).

  function buildLabels() {
    const trackW = els.slider.offsetWidth;
    const thumbR = 9; // keep in sync with the thumb width in the <style> block
    const n = tournaments.length;

    els.labels.innerHTML = tournaments
      .map((t, i) => {
        const px = thumbR + (i / (n - 1)) * (trackW - thumbR * 2);
        const pct = (px / trackW) * 100;
        const sparse = i % 2 === 1 ? "hidden sm:block" : "";
        return `<button type="button" data-index="${i}"
                      class="wc-tick absolute -translate-x-1/2 cursor-pointer appearance-none border-0 bg-transparent p-0 leading-none text-[10px] tabular-nums text-neutral-400 transition-colors hover:text-neutral-700 ${sparse}"
                      style="left:${pct}%">${t.year}</button>`;
      })
      .join("");
    markActive(Number(els.slider.value));
  }

  function markActive(index) {
    els.labels.querySelectorAll(".wc-tick").forEach((b) => {
      const on = Number(b.dataset.index) === index;
      b.classList.toggle("text-rose-500", on);
      b.classList.toggle("font-semibold", on);
      b.classList.toggle("text-neutral-400", !on);
      b.classList.toggle("!block", on); // keep the active year visible on mobile
    });
  }

  function goTo(index) {
    els.slider.value = String(index);
    render(index);
  }

  // --- init ------------------------------------------------------------------

  function init() {
    if (!tournaments.length) {
      els.grid.innerHTML =
        `<p class="col-span-full text-center text-sm text-neutral-500">No tournament data loaded.</p>`;
      return;
    }
    els.slider.max = String(tournaments.length - 1);
    buildLabels();
    render(Number(els.slider.value));

    els.slider.addEventListener("input", () => render(Number(els.slider.value)));
    els.labels.addEventListener("click", (e) => {
      const btn = e.target.closest(".wc-tick");
      if (btn) goTo(Number(btn.dataset.index));
    });
    window.addEventListener("resize", buildLabels);
  }

  document.addEventListener("DOMContentLoaded", init);
})();