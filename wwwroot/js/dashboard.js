/* =====================================================
   dashboard.js — BreatheairMind Vietnam Dashboard
   Thêm vào wwwroot/js/ của project IQAirClone
   ===================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', function () {

    /* Lấy dữ liệu từ Razor Page (window.DB_LOCATIONS) */
    const locations = window.DB_LOCATIONS || [];
    const charts = {};

    /* =====================================================
       VẼ GAUGE DONUT cho mỗi card
    ===================================================== */
    function drawGauge(i, aqi, color) {
        const c = document.getElementById('dbGauge_' + i);
        if (!c) return;
        const ctx = c.getContext('2d');
        const cx = 34, cy = 34, r = 28, lw = 7;
        const pct = Math.min(aqi / 300, 1);
        const start = Math.PI * 0.75;
        const sweep = Math.PI * 1.5;
        ctx.clearRect(0, 0, 68, 68);
        // Track
        ctx.beginPath(); ctx.arc(cx, cy, r, start, start + sweep);
        ctx.strokeStyle = '#E2EDF4'; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
        // Fill
        if (pct > 0) {
            ctx.beginPath(); ctx.arc(cx, cy, r, start, start + sweep * pct);
            ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
        }
    }

    /* =====================================================
       TẠO DỮ LIỆU DỰ BÁO giả lập (12 khung giờ)
    ===================================================== */
    function genForecast(base) {
        return Array.from({ length: 12 }, (_, i) =>
            Math.max(5, Math.round(base + (Math.random() - .5) * 22 + Math.sin(i * .7) * 12))
        );
    }

    /* =====================================================
       VẼ MINI FORECAST CHART (Chart.js)
    ===================================================== */
    function drawChart(i, base, color) {
        const c = document.getElementById('dbChart_' + i);
        if (!c) return;
        if (charts[i]) charts[i].destroy();

        const data = genForecast(base);
        const maxIdx = data.indexOf(Math.max(...data));
        const ctx2d = c.getContext('2d');
        const grad = ctx2d.createLinearGradient(0, 0, 0, 58);
        grad.addColorStop(0, color + '44');
        grad.addColorStop(1, color + '00');

        charts[i] = new Chart(ctx2d, {
            type: 'line',
            data: {
                labels: ['04:00', '05:00', '06:00', '07:00', '08:00', '09:00',
                    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
                datasets: [{
                    data,
                    borderColor: color, borderWidth: 1.5,
                    pointRadius: data.map((_, j) => j === maxIdx ? 4 : 0),
                    pointBackgroundColor: color,
                    pointBorderColor: '#fff', pointBorderWidth: 1.5,
                    fill: true, backgroundColor: grad, tension: 0.4,
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                animation: { duration: 600, delay: i * 50 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(11,37,69,.92)',
                        titleColor: 'rgba(255,255,255,.5)',
                        bodyColor: '#fff', padding: 8, cornerRadius: 8,
                        titleFont: { size: 10 },
                        bodyFont: { size: 11, weight: '700', family: "'DM Mono',monospace" },
                        callbacks: { label: ctx => ' AQI ' + ctx.raw }
                    }
                },
                scales: {
                    x: {
                        display: true, grid: { display: false }, border: { display: false },
                        ticks: { color: '#8BAAB8', font: { size: 8.5 }, maxRotation: 0, maxTicksLimit: 6 }
                    },
                    y: {
                        display: false,
                        min: Math.max(0, Math.min(...data) - 15),
                        max: Math.max(...data) + 15
                    }
                }
            }
        });
    }

    /* =====================================================
       KHỞI TẠO TẤT CẢ GAUGES + CHARTS
    ===================================================== */
    requestAnimationFrame(() => {
        locations.forEach((loc, i) => {
            drawGauge(i, loc.aqi, loc.color);
            drawChart(i, loc.aqi, loc.color);
        });
    });

    /* =====================================================
       FILTER PANEL
    ===================================================== */
    const overlay = document.getElementById('dbFilterOverlay');
    const btnOpen = document.getElementById('dbFilterBtn');
    const btnClose = document.getElementById('dbFilterClose');
    const btnApply = document.getElementById('dbFilterApply');

    btnOpen?.addEventListener('click', () => overlay?.classList.add('open'));
    btnClose?.addEventListener('click', () => overlay?.classList.remove('open'));
    btnApply?.addEventListener('click', () => overlay?.classList.remove('open'));
    overlay?.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

    /* Filter tabs */
    document.querySelectorAll('.db-filter-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.db-filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    /* Region chips toggle */
    document.querySelectorAll('.db-chip').forEach(chip => {
        chip.addEventListener('click', function () { this.classList.toggle('active'); });
    });

    /* Range slider — cập nhật gradient */
    const rangeEl = document.getElementById('dbRange');
    rangeEl?.addEventListener('input', function () {
        const p = (this.value / this.max) * 100;
        this.style.background =
            `linear-gradient(90deg, var(--db-blue) ${p}%, var(--db-border) ${p}%)`;
    });

    console.log('✅ dashboard.js loaded —', locations.length, 'địa điểm VN');
});
