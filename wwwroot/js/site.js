/* =====================================================
   site.js — IQAir AirVisual Clone
   Handles: Scroll animations, Chart.js, counters
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* =====================================================
       1. HEADER: Add "scrolled" class on scroll
       ===================================================== */
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });


    /* =====================================================
       2. SCROLL ANIMATIONS (IntersectionObserver)
       ===================================================== */
    const animElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, parseInt(delay));
                animObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animElements.forEach(el => animObserver.observe(el));


    /* =====================================================
       3. COUNT-UP ANIMATION for stats
       ===================================================== */
    function animateCounter(el, target, duration = 2000) {
        const start = 0;
        const range = target - start;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + range * eased);

            if (target >= 10000) {
                el.textContent = (current / 1000).toFixed(0) + 'K';
            } else {
                el.textContent = current.toLocaleString('vi-VN');
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (target >= 10000) {
                    el.textContent = (target / 1000).toFixed(0) + 'K';
                } else {
                    el.textContent = target.toLocaleString('vi-VN');
                }
            }
        }

        requestAnimationFrame(update);
    }

    // Trigger counter when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const nums = document.querySelectorAll('.iq-stat-number[data-target]');
                nums.forEach(num => {
                    const target = parseInt(num.dataset.target);
                    animateCounter(num, target);
                });
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsBar = document.querySelector('.iq-stats-bar');
    if (statsBar) statsObserver.observe(statsBar);


    /* =====================================================
       4. MINI CHART in hero phone mockup
       ===================================================== */
    const miniCtx = document.getElementById('miniChart');
    if (miniCtx) {
        new Chart(miniCtx, {
            type: 'line',
            data: {
                labels: ['', '', '', '', '', '', '', ''],
                datasets: [{
                    data: [42, 38, 55, 48, 35, 40, 42, 38],
                    borderColor: '#00E400',
                    borderWidth: 1.5,
                    pointRadius: 0,
                    fill: true,
                    backgroundColor: 'rgba(0,228,0,0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                animation: { duration: 1000 }
            }
        });
    }


    /* =====================================================
       5. MAIN AQI CHART (Chart.js) — 7-day view
       ===================================================== */
    const aqiCtx = document.getElementById('aqiChart');
    if (aqiCtx) {
        // Sample 7-day AQI data for Đà Nẵng
        const data7d = {
            labels: ['T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7', 'CN'],
            pm25: [8.2, 12.4, 9.8, 14.1, 11.2, 7.6, 8.9],
            aqi: [42, 58, 48, 67, 54, 36, 44],
        };

        const data30d = {
            labels: Array.from({ length: 30 }, (_, i) => `${i + 1}/3`),
            aqi: Array.from({ length: 30 }, () => Math.floor(Math.random() * 70 + 30))
        };

        // AQI color per value
        function getAqiColor(val) {
            if (val <= 50) return 'rgba(0,228,0,0.8)';
            if (val <= 100) return 'rgba(255,255,0,0.8)';
            if (val <= 150) return 'rgba(255,126,0,0.8)';
            if (val <= 200) return 'rgba(255,0,0,0.8)';
            return 'rgba(143,63,151,0.8)';
        }

        const aqiChart = new Chart(aqiCtx, {
            type: 'bar',
            data: {
                labels: data7d.labels,
                datasets: [
                    {
                        label: 'AQI US',
                        data: data7d.aqi,
                        backgroundColor: data7d.aqi.map(getAqiColor),
                        borderRadius: 6,
                        borderSkipped: false,
                        order: 2
                    },
                    {
                        label: 'PM2.5 (µg/m³)',
                        data: data7d.pm25,
                        type: 'line',
                        borderColor: '#42A5F5',
                        backgroundColor: 'rgba(66,165,245,0.1)',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: '#42A5F5',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y1',
                        order: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'rgba(255,255,255,0.7)',
                            font: { size: 12, family: "'Source Sans 3', sans-serif" },
                            boxWidth: 12,
                            boxHeight: 12,
                            padding: 16
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10,39,68,0.95)',
                        titleColor: '#fff',
                        bodyColor: 'rgba(255,255,255,0.8)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } }
                    },
                    y: {
                        position: 'left',
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } },
                        title: {
                            display: true,
                            text: 'AQI',
                            color: 'rgba(255,255,255,0.4)',
                            font: { size: 11 }
                        }
                    },
                    y1: {
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#42A5F5', font: { size: 11 } },
                        title: {
                            display: true,
                            text: 'PM2.5',
                            color: '#42A5F5',
                            font: { size: 11 }
                        }
                    }
                }
            }
        });

        // Chart tab switching
        document.querySelectorAll('.iq-chart-tab').forEach(tab => {
            tab.addEventListener('click', function () {
                document.querySelectorAll('.iq-chart-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const period = this.dataset.period;
                if (period === '7d') {
                    aqiChart.data.labels = data7d.labels;
                    aqiChart.data.datasets[0].data = data7d.aqi;
                    aqiChart.data.datasets[0].backgroundColor = data7d.aqi.map(getAqiColor);
                    aqiChart.data.datasets[1].data = data7d.pm25;
                } else if (period === '30d') {
                    const aqi30 = Array.from({ length: 30 }, () => Math.floor(Math.random() * 70 + 30));
                    const pm30 = Array.from({ length: 30 }, () => (Math.random() * 20 + 5).toFixed(1) * 1);
                    aqiChart.data.labels = Array.from({ length: 30 }, (_, i) => `${i + 1}/3`);
                    aqiChart.data.datasets[0].data = aqi30;
                    aqiChart.data.datasets[0].backgroundColor = aqi30.map(getAqiColor);
                    aqiChart.data.datasets[1].data = pm30;
                } else {
                    const aqi12 = Array.from({ length: 12 }, () => Math.floor(Math.random() * 80 + 35));
                    const pm12 = Array.from({ length: 12 }, () => (Math.random() * 25 + 8).toFixed(1) * 1);
                    aqiChart.data.labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
                    aqiChart.data.datasets[0].data = aqi12;
                    aqiChart.data.datasets[0].backgroundColor = aqi12.map(getAqiColor);
                    aqiChart.data.datasets[1].data = pm12;
                }
                aqiChart.update('active');
            });
        });
    }


    /* =====================================================
       6. SHOWCASE MINI CHART
       ===================================================== */
    const showcaseCtx = document.getElementById('showcaseChart');
    if (showcaseCtx) {
        new Chart(showcaseCtx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 24 }, (_, i) => i),
                datasets: [{
                    data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50 + 60)),
                    borderColor: '#FFFF00',
                    borderWidth: 1.5,
                    pointRadius: 0,
                    fill: true,
                    backgroundColor: 'rgba(255,255,0,0.08)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: { x: { display: false }, y: { display: false } }
            }
        });
    }


    /* =====================================================
       7. POLLUTANT BAR ANIMATION
       ===================================================== */
    const pollFills = document.querySelectorAll('.iq-poll-fill');
    const pollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                pollFills.forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0';
                    setTimeout(() => { fill.style.width = width; }, 100);
                });
                pollObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const pollSection = document.querySelector('.iq-pollutants');
    if (pollSection) pollObserver.observe(pollSection);


    /* =====================================================
       8. SMOOTH NAV LINK ACTIVE state on scroll
       ===================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.iq-nav-menu .nav-link[href^="#"]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.style.color = 'var(--iq-blue)';
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));

    console.log('✅ IQAir AirVisual Clone — site.js loaded');
});
