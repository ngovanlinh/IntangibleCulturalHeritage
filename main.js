// --- 1. KHAI BÁO BIẾN TOÀN CỤC & HÀM ĐỌC JSON ---
async function readJSON(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

let swiperInstance;
let isAudioEnabled = false;

// Khai báo biến heritages ra ngoài để dùng cho cả logic Filter
let heritages = [];

// --- 2. KHỞI TẠO ỨNG DỤNG (Thêm 'async' vào đây) ---
$(document).ready(async function () {
    
    try {
        const [fetchedHeritages, events, galleryImages] = await Promise.all([
            readJSON('../data/heritages.json'),
            readJSON('../data/events.json'),
            readJSON('../data/galleries.json')
        ]);

        // Gán dữ liệu lấy được vào biến toàn cục
        heritages = fetchedHeritages;

        // --- 1. MOBILE MENU LOGIC ---
        $('#mobile-menu-btn').on('click', function () {
            $('#mobile-menu').removeClass('translate-x-full');
            $('body').css('overflow', 'hidden');
        });

        $('#close-menu-btn, .mobile-link').on('click', function () {
            $('#mobile-menu').addClass('translate-x-full');
            $('body').css('overflow', 'auto');
        });

        // --- 2. PARTICLES JS ---
        const particleCount = window.innerWidth < 768 ? 20 : 40;
        particlesJS('particles-js', {
            particles: {
                number: { value: particleCount }, color: { value: '#A52A2A' }, shape: { type: 'circle' },
                opacity: { value: 0.2 }, size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#A52A2A', opacity: 0.15, width: 1 },
                move: { enable: true, speed: 1.2 }
            }
        });

        // --- 3. RENDER FILTERS ---
        const cats = ['Tất cả', ...new Set(heritages.map(h => h.cat))];
        const $filterBox = $('#cat-filters');
        cats.forEach((c, index) => {
            const isActive = index === 0 ? 'active' : '';
            $filterBox.append(`
                <button class="btn-filter ${isActive} whitespace-nowrap px-5 md:px-6 py-2 rounded-full border border-gray-300 text-[10px] md:text-xs font-semibold text-gray-600 hover:border-maroon hover:text-maroon transition" data-cat="${c}">
                    ${c}
                </button>
            `);
        });

        $(document).on('click', '.btn-filter', function () {
            $('.btn-filter').removeClass('active');
            $(this).addClass('active');
            const selectedCat = $(this).data('cat');
            const filteredData = selectedCat === 'Tất cả' ? heritages : heritages.filter(h => h.cat === selectedCat);
            renderSwiperSlides(filteredData);
        });

        // --- 4. RENDER GALLERY & EVENTS ---
        const $galleryBox = $('#gallery-container');
        galleryImages.forEach(img => {
            $galleryBox.append(`
                <div class="gallery-item relative aspect-[4/5] cursor-pointer group">
                    <img src="${img}" class="w-full h-full object-cover" alt="Tư liệu di sản">
                    <div class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md">
                        <i class="fas fa-expand-alt text-maroon text-xs"></i>
                    </div>
                </div>
            `);
        });

        const $eventGrid = $('#events-grid');
        events.forEach(e => {
            const statusColor = (e.status === 'Sắp diễn ra') ? 'bg-maroon/10 text-maroon border-maroon/20' : 'bg-gray-100 text-gray-500 border-gray-200';
            $eventGrid.append(`
                <div class="event-card p-6 md:p-8 group cursor-pointer">
                    <div class="flex justify-between items-start mb-4 md:mb-6">
                        <div class="text-maroon serif text-3xl md:text-4xl font-bold group-hover:text-maroon-dark transition">${e.date}</div>
                        <span class="text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${statusColor}">${e.status}</span>
                    </div>
                    <h4 class="serif text-xl md:text-2xl text-gray-900 mb-2 md:mb-3 font-semibold group-hover:text-maroon transition">${e.name}</h4>
                    <div class="flex justify-between items-center text-[10px] md:text-xs font-medium text-gray-500 border-t border-gray-100 pt-3 md:pt-4 mt-2">
                        <span><i class="fas fa-map-marker-alt mr-1 md:mr-2 text-maroon/70"></i>${e.loc}</span>
                    </div>
                </div>
            `);
        });

        // --- 5. INIT MAP & SLIDER ---
        const map = L.map('map', { scrollWheelZoom: false }).setView([10.603805917564152, 106.40340327439057], window.innerWidth < 768 ? 5 : 10);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

        heritages.forEach(h => {
            if (h.lat && h.lng) {
                L.marker([h.lat, h.lng]).addTo(map).bindPopup(`
                    <div class="text-center p-1">
                        <img src="${h.img}" class="object-cover rounded-md mx-auto">
                        <strong class="text-maroon text-sm">${h.name}</strong><br >
                        <span class="text-small"><i class="fas fa-map-marker-alt text-maroon text-muted"></i>  ${h.loc}</span>
                    </div>
                `);
            }
        });

        $(window).on('resize', function () { map.invalidateSize(); });

        renderSwiperSlides(heritages);

        // --- 6. AUDIO LOGIC ---
        const bgAudio = document.getElementById('bg-audio');
        $('#music-toggle').on('click', function () {
            isAudioEnabled = true;
            if (bgAudio.paused) {
                bgAudio.play();
                $(this).html('<i class="fas fa-volume-up text-sm md:text-base"></i>').removeClass('bg-maroon text-white').addClass('text-maroon bg-maroon/10');
            } else {
                bgAudio.pause();
                $(this).html('<i class="fas fa-volume-mute text-sm md:text-base"></i>').removeClass('bg-maroon text-white').addClass('text-maroon bg-maroon/10');
            }
        });

    } catch (error) {
        console.error("Quá trình tải JSON bị lỗi:", error);
    }
});

// --- 3. HÀM RENDER ---
function renderSwiperSlides(data) {
    const $container = $('#heritage-container');
    $container.empty();

    data.forEach(h => {
        $container.append(`
            <div class="swiper-slide bg-white rounded-[24px] md:rounded-[30px] p-3 md:p-4 flex flex-col shadow-xl border border-gray-100 tilt-card" data-tilt data-tilt-max="5" data-tilt-speed="400">
                <div class="h-1/2 w-full rounded-[16px] md:rounded-[20px] overflow-hidden relative layer-3d">
                     <img src="${h.img}" class="w-full h-full object-cover rounded-[16px] md:rounded-[20px] layer-back" alt="${h.name}">
                     <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent layer-front"></div>
                     <div class="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold text-maroon shadow-sm layer-front">${h.cat}</div>
                </div>
                <div class="p-4 md:p-6 layer-front flex-grow flex flex-col justify-between">
                    <div>
                        <h3 class="serif text-xl md:text-2xl text-gray-900 mb-1 md:mb-2 font-bold">${h.name}</h3>
                        <p class="text-gray-500 text-xs md:text-sm flex items-center gap-2"><i class="fas fa-map-marker-alt text-maroon"></i> ${h.loc}</p>
                        <p>${h.desc}</p>
                    </div>
                    <div class="flex gap-2 mt-3 md:mt-4">
                        <button class="flex-1 py-2 md:py-3 bg-maroon/10 border border-maroon/20 rounded-xl text-[10px] md:text-xs font-semibold text-maroon hover:bg-maroon transition cursor-pointer">
                            <i class="fas fa-info-circle mr-1"></i> <a href="details.html?alias=${h.alias}">Chi tiết</a>
                        </button>
                        <button class="w-10 md:w-12 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-100 transition" title="VR 360">
                            <i class="fas fa-vr-cardboard text-gray-600"></i>
                        </button>
                    </div>
                </div>
            </div>
        `);
    });

    if (swiperInstance) swiperInstance.destroy(true, true);

    swiperInstance = new Swiper(".heritage-swiper", {
        effect: "coverflow", grabCursor: true, centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: { rotate: 0, stretch: 0, depth: window.innerWidth < 768 ? 60 : 100, modifier: 2.5, slideShadows: false }
    });

    if (window.innerWidth >= 768) {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"));
    }
}