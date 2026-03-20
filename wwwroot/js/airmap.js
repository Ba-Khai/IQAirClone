/* airmap.js — Bản đồ không khí Việt Nam */
'use strict';
document.addEventListener('DOMContentLoaded', function () {
    const data = window.MAP_DATA || [];
    let gaugeInstance = null;

    // Map city name từ SVG data-city → data object
    const cityMap = {};
    data.forEach(d => { cityMap[d.city] = d; });

    // ===== GAUGE vẽ trong detail panel =====
    function drawDetailGauge(aqi, color) {
        const c = document.getElementById('detailGaugeCanvas');
        if (!c) return;
        const ctx = c.getContext('2d');
        const cx = 40, cy = 40, r = 32, lw = 8;
        const pct = Math.min(aqi / 300, 1);
        const start = Math.PI * 0.75;
        const sweep = Math.PI * 1.5;
        ctx.clearRect(0, 0, 80, 80);
        ctx.beginPath(); ctx.arc(cx, cy, r, start, start + sweep);
        ctx.strokeStyle = '#E2EDF4'; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, r, start, start + sweep * pct);
        ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
    }

    // ===== CLICK vào province =====
    document.querySelectorAll('.map-province').forEach(el => {
        el.style.cursor = 'pointer';
        el.style.transition = 'opacity 0.2s, transform 0.2s';

        el.addEventListener('mouseenter', function () {
            this.style.opacity = '0.8';
            // Show tooltip
            const tt = document.getElementById('mapTooltip');
            const aqi = parseInt(this.dataset.aqi);
            const color = getAqiColor(aqi);
            tt.style.display = 'block';
            document.getElementById('ttCity').textContent = this.dataset.city;
            document.getElementById('ttProvince').textContent = this.dataset.province;
            document.getElementById('ttAqi').textContent = 'AQI: ' + aqi;
            document.getElementById('ttAqi').style.color = color;
            document.getElementById('ttStatus').textContent = getAqiStatus(aqi).text;
            document.getElementById('ttStatus').style.color = color;
        });

        el.addEventListener('mousemove', function (e) {
            const tt = document.getElementById('mapTooltip');
            const rect = document.getElementById('vnMap').getBoundingClientRect();
            tt.style.left = (e.clientX - rect.left + 12) + 'px';
            tt.style.top = (e.clientY - rect.top + 12) + 'px';
        });

        el.addEventListener('mouseleave', function () {
            this.style.opacity = '1';
            document.getElementById('mapTooltip').style.display = 'none';
        });

        el.addEventListener('click', function () {
            const cityName = this.dataset.city;
            const aqi = parseInt(this.dataset.aqi);
            const province = this.dataset.province;
            const color = getAqiColor(aqi);
            const status = getAqiStatus(aqi);

            // Highlight selected
            document.querySelectorAll('.map-province').forEach(p => p.style.strokeWidth = '1.5');
            this.style.strokeWidth = '3';

            // Update detail panel
            document.getElementById('detailCity').textContent = cityName;
            document.getElementById('detailProvince').textContent = province;
            document.getElementById('detailAqiNum').textContent = aqi;
            document.getElementById('detailAqiNum').style.color = color;
            document.getElementById('detailStatusEmoji').textContent = status.emoji;
            document.getElementById('detailStatusText').textContent = status.text;
            document.getElementById('detailStatusBar').style.background = color + '18';
            document.getElementById('detailStatusBar').style.color = color;

            drawDetailGauge(aqi, color);

            // Show/hide pollutant rows
            document.getElementById('detailPollsDefault').style.display = 'none';
            document.querySelectorAll('.map-dp-item').forEach(item => {
                item.style.display = item.dataset.city === cityName ? 'block' : 'none';
            });

            // If not in data, show default
            const found = data.find(d => d.city === cityName);
            if (!found) {
                document.getElementById('detailPollsDefault').style.display = 'flex';
            }
        });
    });

    // ===== HELPERS =====
    function getAqiColor(aqi) {
        if (aqi <= 50) return '#2DC653';
        if (aqi <= 100) return '#F5A623';
        if (aqi <= 150) return '#E8622A';
        if (aqi <= 200) return '#D93B3B';
        return '#8B3FBE';
    }

    function getAqiStatus(aqi) {
        if (aqi <= 50) return { text: 'Tốt', emoji: '😊' };
        if (aqi <= 100) return { text: 'Trung bình', emoji: '🙂' };
        if (aqi <= 150) return { text: 'Kém', emoji: '😐' };
        if (aqi <= 200) return { text: 'Có hại', emoji: '😷' };
        return { text: 'Nguy hiểm', emoji: '🤢' };
    }

    // ===== REFRESH BUTTON =====
    document.getElementById('mapRefreshBtn')?.addEventListener('click', function () {
        this.style.transform = 'rotate(360deg)';
        this.style.transition = 'transform 0.6s ease';
        setTimeout(() => { this.style.transform = ''; this.style.transition = ''; }, 700);
    });

    console.log('✅ airmap.js loaded');
});
