// ===== DATA: 48 nations, domestic vs abroad =====
const COUNTRY_STATS = [{"Country":"Algeria","total":26,"domestic":3,"abroad":23,"pct_domestic":11.5},{"Country":"Argentina","total":26,"domestic":2,"abroad":24,"pct_domestic":7.7},{"Country":"Australia","total":26,"domestic":5,"abroad":21,"pct_domestic":19.2},{"Country":"Austria","total":25,"domestic":3,"abroad":22,"pct_domestic":12.0},{"Country":"Belgium","total":26,"domestic":3,"abroad":23,"pct_domestic":11.5},{"Country":"BIH","total":26,"domestic":1,"abroad":25,"pct_domestic":3.8},{"Country":"Brazil","total":26,"domestic":7,"abroad":19,"pct_domestic":26.9},{"Country":"Canada","total":25,"domestic":2,"abroad":23,"pct_domestic":8.0},{"Country":"Cape Verde","total":26,"domestic":0,"abroad":26,"pct_domestic":0.0},{"Country":"Colombia","total":26,"domestic":1,"abroad":25,"pct_domestic":3.8},{"Country":"Croatia","total":26,"domestic":2,"abroad":24,"pct_domestic":7.7},{"Country":"Curaçao","total":26,"domestic":0,"abroad":26,"pct_domestic":0.0},{"Country":"Czech Rep.","total":26,"domestic":17,"abroad":9,"pct_domestic":65.4},{"Country":"DR Congo","total":26,"domestic":0,"abroad":26,"pct_domestic":0.0},{"Country":"Ecuador","total":26,"domestic":2,"abroad":24,"pct_domestic":7.7},{"Country":"Egypt","total":26,"domestic":17,"abroad":9,"pct_domestic":65.4},{"Country":"England","total":26,"domestic":21,"abroad":5,"pct_domestic":80.8},{"Country":"France","total":26,"domestic":8,"abroad":18,"pct_domestic":30.8},{"Country":"Germany","total":26,"domestic":19,"abroad":7,"pct_domestic":73.1},{"Country":"Ghana","total":26,"domestic":1,"abroad":25,"pct_domestic":3.8},{"Country":"Haiti","total":26,"domestic":1,"abroad":25,"pct_domestic":3.8},{"Country":"Iran","total":26,"domestic":17,"abroad":9,"pct_domestic":65.4},{"Country":"Iraq","total":26,"domestic":10,"abroad":16,"pct_domestic":38.5},{"Country":"Ivory Coast","total":26,"domestic":0,"abroad":26,"pct_domestic":0.0},{"Country":"Japan","total":26,"domestic":3,"abroad":23,"pct_domestic":11.5},{"Country":"Jordan","total":26,"domestic":11,"abroad":15,"pct_domestic":42.3},{"Country":"Mexico","total":26,"domestic":12,"abroad":14,"pct_domestic":46.2},{"Country":"Morocco","total":26,"domestic":2,"abroad":24,"pct_domestic":7.7},{"Country":"Netherlands","total":26,"domestic":2,"abroad":24,"pct_domestic":7.7},{"Country":"New Zealand","total":26,"domestic":8,"abroad":18,"pct_domestic":30.8},{"Country":"Norway","total":26,"domestic":4,"abroad":22,"pct_domestic":15.4},{"Country":"Panama","total":26,"domestic":2,"abroad":24,"pct_domestic":7.7},{"Country":"Paraguay","total":26,"domestic":3,"abroad":23,"pct_domestic":11.5},{"Country":"Portugal","total":26,"domestic":5,"abroad":21,"pct_domestic":19.2},{"Country":"Qatar","total":26,"domestic":25,"abroad":1,"pct_domestic":96.2},{"Country":"Saudi Arabia","total":26,"domestic":25,"abroad":1,"pct_domestic":96.2},{"Country":"Scotland","total":26,"domestic":8,"abroad":18,"pct_domestic":30.8},{"Country":"Senegal","total":26,"domestic":0,"abroad":26,"pct_domestic":0.0},{"Country":"South Africa","total":26,"domestic":19,"abroad":7,"pct_domestic":73.1},{"Country":"South Korea","total":26,"domestic":7,"abroad":19,"pct_domestic":26.9},{"Country":"Spain","total":26,"domestic":17,"abroad":9,"pct_domestic":65.4},{"Country":"Sweden","total":26,"domestic":3,"abroad":23,"pct_domestic":11.5},{"Country":"Switzerland","total":26,"domestic":2,"abroad":24,"pct_domestic":7.7},{"Country":"Tunisia","total":26,"domestic":6,"abroad":20,"pct_domestic":23.1},{"Country":"Turkey","total":26,"domestic":15,"abroad":11,"pct_domestic":57.7},{"Country":"United States","total":26,"domestic":7,"abroad":19,"pct_domestic":26.9},{"Country":"Uruguay","total":26,"domestic":0,"abroad":26,"pct_domestic":0.0},{"Country":"Uzbekistan","total":26,"domestic":15,"abroad":11,"pct_domestic":57.7}];
 
// ===== Chart.js defaults: Tailwind's default sans stack =====
Chart.defaults.font.family = 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
 
const chartBox = document.getElementById('domestic-chart-box');
const ctxDom = document.getElementById('domestic-chart-canvas').getContext('2d');
let domesticData = [...COUNTRY_STATS];
let domesticChart;
 
// ===== Sorting =====
function sortDomestic(by) {
  if (by === 'abroad') domesticData.sort((a, b) => (b.abroad / b.total) - (a.abroad / a.total));
  else if (by === 'domestic') domesticData.sort((a, b) => b.pct_domestic - a.pct_domestic);
  else domesticData.sort((a, b) => a.Country.localeCompare(b.Country));
  renderDomesticChart();
}
 
// ===== Render =====
function renderDomesticChart() {
  const labels = domesticData.map(d => d.Country);
  const domPct = domesticData.map(d => d.pct_domestic);
  const abrPct = domesticData.map(d => parseFloat((100 - d.pct_domestic).toFixed(1)));
 
  // Size the wrapper before (re)creating the chart: ~22px per country row
  chartBox.style.height = (domesticData.length * 20 + 60) + 'px';
 
  if (domesticChart) domesticChart.destroy();
  domesticChart = new Chart(ctxDom, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Domestic', data: domPct, backgroundColor: 'rgba(34,197,94,0.85)', borderRadius: 2 },
        { label: 'Abroad',   data: abrPct, backgroundColor: 'rgba(234,179,8,0.85)',  borderRadius: 2 }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          borderColor: '#0f172a',
          borderWidth: 1,
          titleColor: '#000000',
          bodyColor: '#000000',
          titleFont: { size: 13, weight: '700' },
          bodyFont: { size: 12 },
          displayColors: false,
          callbacks: {
            title: (items) => {
              const c = domesticData[items[0].dataIndex];
              return c.Country + ' - (' + items[0].dataset.label + ')';
            },
            label: (ctx) => {
              const c = domesticData[ctx.dataIndex];
              if (ctx.dataset.label === 'Domestic') {
                return c.domestic + ' of ' + c.total + ' players \u00b7 ' + c.pct_domestic + '%';
              }
              return c.abroad + ' of ' + c.total + ' players \u00b7 ' + (100 - c.pct_domestic).toFixed(1) + '%';
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true, max: 100,
          grid: { color: 'rgba(15,23,42,0.06)' },
          ticks: { color: '#64748b', font: { size: 10 }, callback: v => v + '%' }
        },
        y: {
          stacked: true,
          grid: { display: false },
          ticks: { color: '#1e293b', font: { size: 10.5 } }
        }
      }
    }
  });
}
 
// ===== Button active state (Tailwind classes toggled in JS - no custom CSS) =====
const ACTIVE = ['bg-neutral-800', 'text-white', 'border-neutral-600'];
const INACTIVE = ['bg-transparent', 'text-slate-500', 'border-slate-300', 'hover:bg-neutral-500', 'hover:text-white', 'hover:border-neutral-600'];
const buttons = document.querySelectorAll('.domestic-btn');
 
function setActive(btn) {
  buttons.forEach(b => { b.classList.remove(...ACTIVE); b.classList.add(...INACTIVE); });
  btn.classList.remove(...INACTIVE);
  btn.classList.add(...ACTIVE);
}
 
buttons.forEach(btn => {
  btn.addEventListener('click', function () {
    setActive(this);
    sortDomestic(this.dataset.sort);
  });
});
 
// ===== Init: default sort = most abroad =====
setActive(document.querySelector('[data-sort="abroad"]'));
sortDomestic('abroad');