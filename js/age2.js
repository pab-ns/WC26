   (function () {
     // Age distribution: number of players at each age across all 48 squads (1,246 players)
     const ageDist = [
       {"Age": 17, "count": 1},  {"Age": 18, "count": 12}, {"Age": 19, "count": 9},
       {"Age": 20, "count": 26}, {"Age": 21, "count": 37}, {"Age": 22, "count": 70},
       {"Age": 23, "count": 79}, {"Age": 24, "count": 87}, {"Age": 25, "count": 105},
       {"Age": 26, "count": 114},{"Age": 27, "count": 125},{"Age": 28, "count": 102},
       {"Age": 29, "count": 104},{"Age": 30, "count": 81}, {"Age": 31, "count": 68},
       {"Age": 32, "count": 68}, {"Age": 33, "count": 48}, {"Age": 34, "count": 38},
       {"Age": 35, "count": 29}, {"Age": 36, "count": 13}, {"Age": 37, "count": 11},
       {"Age": 38, "count": 8},  {"Age": 39, "count": 4},  {"Age": 40, "count": 5},
       {"Age": 41, "count": 1},  {"Age": 43, "count": 1}
     ];
 
     // Match Tailwind's default font-sans stack
     Chart.defaults.font.family =
       'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
 
     const isMobile = window.matchMedia('(max-width: 767px)').matches;
 
     // On mobile: age on the vertical (y) axis, count on the horizontal (x) axis.
     // On desktop: age on x, count on y (original layout).
     const bubbleData = ageDist.map(d => ({
       x: isMobile ? d.count : d.Age,
       y: isMobile ? d.Age : d.count,
       age: d.Age,
       count: d.count,
       r: Math.sqrt(d.count) * 2.2
     }));
 
     const fillFor = a =>
       a <= 22 ? 'rgba(34,197,94,0.7)'  :
       a <= 30 ? 'rgba(251,191,36,0.7)' :
       a <= 35 ? 'rgba(249,115,22,0.7)' :
                 'rgba(239,68,68,0.7)';
 
     const borderFor = a =>
       a <= 22 ? 'rgb(34,197,94)'  :
       a <= 30 ? 'rgb(251,191,36)' :
       a <= 35 ? 'rgb(249,115,22)' :
                 'rgb(239,68,68)';
 
     new Chart(document.getElementById('bubble-chart').getContext('2d'), {
       type: 'bubble',
       data: {
         datasets: [{
           label: 'Players',
           data: bubbleData,
           backgroundColor: bubbleData.map(d => fillFor(d.age)),
           borderColor: bubbleData.map(d => borderFor(d.age)),
           borderWidth: 1.5
         }]
       },
       options: {
         responsive: true,
         maintainAspectRatio: false,
         plugins: {
           legend: { display: false },
           tooltip: {
             displayColors: false,
             backgroundColor: '#ffffff',
             bodyColor: '#000000',
             borderColor: 'rgba(0,0,0,0.15)',
             borderWidth: 1,
             padding: 10,
             callbacks: {
               label: ctx => `Age ${ctx.raw.age} — ${ctx.raw.count} players`
             }
           }
         },
         scales: isMobile ? {
           y: {
             reverse: true,
             title: { display: true, text: 'Age', color: 'rgb(71,85,105)', font: { size: 12 } },
             grid: { display: false },
             ticks: { color: 'rgb(100,116,139)', font: { size: 11 }, stepSize: 1, autoSkip: false }
           },
           x: {
             display: false,
             beginAtZero: true,
             grid: { display: false }
           }
         } : {
           x: {
             title: { display: true, text: 'Age', color: 'rgb(71,85,105)', font: { size: 12 } },
             grid: { display: false },
             ticks: { color: 'rgb(100,116,139)', font: { size: 11 }, stepSize: 1, autoSkip: false }
           },
           y: {
             display: false,
             beginAtZero: true,
             grid: { display: false }
           }
         }
       }
     });
   })();