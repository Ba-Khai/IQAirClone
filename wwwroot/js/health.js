/* health.js — Trang Sức khỏe */
'use strict';
document.addEventListener('DOMContentLoaded', function () {

    // ===== DỮ LIỆU 7 NGÀY =====
    const days = ['T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7', 'CN'];
    const trendData = {
        hanoi: [92, 85, 97, 88, 79, 87, 91],
        hcm: [105, 118, 112, 125, 108, 115, 112],
        danang: [38, 42, 45, 40, 36, 42, 44],
    };

    // ===== CHART XU HƯỚNG 7 NGÀY =====
    const trendCtx = document.getElementById('healthTrendChart');
    let trendChart = null;

    function buildTrendChart(cityKey) {
        const d = trendData[cityKey];
        const colors = { hanoi: '#F5A623', hcm: '#E8622A', danang: '#2DC653' };
        const color = colors[cityKey];
        if (trendChart) trendChart.destroy();

        const ctx2d = trendCtx.getContext('2d');
        const grad = ctx2d.createLinearGradient(0, 0, 0, 200);
        grad.addColorStop(0, color + '33'); grad.addColorStop(1, color + '00');

        trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'AQI',
                    data: d,
                    borderColor: color, borderWidth: 2.5,
                    backgroundColor: grad, fill: true, tension: 0.4,
                    pointRadius: 5, pointBackgroundColor: color,
                    pointBorderColor: '#fff', pointBorderWidth: 2,
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(11,37,69,.92)', titleColor: 'rgba(255,255,255,.6)',
                        bodyColor: '#fff', padding: 10, cornerRadius: 8,
                        callbacks: {
                            label: ctx => ' AQI: ' + ctx.raw,
                            afterLabel: ctx => ' → ' + getStatusText(ctx.raw),
                        }
                    }
                },
                scales: {
                    x: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { color: '#8BAAB8', font: { size: 11 } } },
                    y: {
                        grid: { color: 'rgba(0,0,0,.04)' }, ticks: { color: '#8BAAB8', font: { size: 11 } },
                        min: 0, max: 160,
                    }
                },
                // Vẽ đường ngưỡng AQI
                plugins: [{
                    afterDraw(chart) {
                        const { ctx, chartArea: { left, right }, scales: { y } } = chart;
                        [[50, '#2DC653'], [100, '#F5A623'], [150, '#E8622A']].forEach(([val, col]) => {
                            const yPos = y.getPixelForValue(val);
                            ctx.save();
                            ctx.strokeStyle = col + '66'; ctx.lineWidth = 1;
                            ctx.setLineDash([5, 4]);
                            ctx.beginPath(); ctx.moveTo(left, yPos); ctx.lineTo(right, yPos); ctx.stroke();
                            ctx.restore();
                        });
                    }
                }]
            }
        });
    }

    if (trendCtx) buildTrendChart('hanoi');

    // Tab switch
    document.querySelectorAll('.health-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.health-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            buildTrendChart(this.dataset.city);
        });
    });

    // ===== CHART PM2.5 THEO GIỜ =====
    const hourlyCtx = document.getElementById('healthHourlyChart');
    if (hourlyCtx) {
        const hours = Array.from({ length: 24 }, (_, i) => i + ':00');
        const pm25 = [18, 16, 14, 12, 10, 9, 11, 15, 22, 28, 31, 29, 27, 25, 24, 26, 28, 32, 35, 33, 30, 27, 24, 21];
        const hColors = pm25.map(v => v <= 12 ? '#2DC653' : v <= 35 ? '#F5A623' : '#E8622A');

        new Chart(hourlyCtx, {
            type: 'bar',
            data: {
                labels: hours,
                datasets: [{
                    label: 'PM2.5 (µg/m³)',
                    data: pm25,
                    backgroundColor: hColors,
                    borderRadius: 4,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(11,37,69,.92)', bodyColor: '#fff',
                        titleColor: 'rgba(255,255,255,.5)', padding: 8, cornerRadius: 8,
                        callbacks: { label: ctx => ' PM2.5: ' + ctx.raw + ' µg/m³' }
                    }
                },
                scales: {
                    x: { ticks: { color: '#8BAAB8', font: { size: 9 }, maxRotation: 0, maxTicksLimit: 8 }, grid: { display: false } },
                    y: { ticks: { color: '#8BAAB8', font: { size: 10 } }, grid: { color: 'rgba(0,0,0,.04)' } }
                }
            }
        });
    }

    // ===== INDEX BARS ANIMATION =====
    const fills = document.querySelectorAll('.health-idx-fill');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const w = e.target.style.width;
                e.target.style.width = '0';
                setTimeout(() => { e.target.style.width = w; }, 100);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });
    fills.forEach(f => obs.observe(f));

    function getStatusText(aqi) {
        if (aqi <= 50) return 'Tốt';
        if (aqi <= 100) return 'Trung bình';
        if (aqi <= 150) return 'Kém';
        return 'Có hại';
    }

    console.log('✅ health.js loaded');
});
