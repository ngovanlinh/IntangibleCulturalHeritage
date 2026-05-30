// --- 1. KHAI BÁO BIẾN TOÀN CỤC & HÀM ĐỌC JSON ---
async function readJSON(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
}

let swiperInstance;
let isAudioEnabled = false;
let scene, camera, renderer, controls, animationId;

let heritages = [];
window.globalGalleries = []; // Kho lưu trữ dữ liệu Gallery tổng thể

// --- 2. KHỞI TẠO ỨNG DỤNG ---
$(document).ready(async function () {
    try {
        const [fetchedHeritages, events, galleryImages] = await Promise.all([
            readJSON('data/heritages.json'),
            readJSON('data/events.json'),
            readJSON('data/galleries.json')
        ]);

        heritages = fetchedHeritages;
        window.globalGalleries = galleryImages;

        // --- MOBILE MENU LOGIC ---
        $('#mobile-menu-btn').on('click', function () {
            $('#mobile-menu').removeClass('translate-x-full');
            $('body').css('overflow', 'hidden');
        });

        $('#close-menu-btn, .mobile-link').on('click', function () {
            $('#mobile-menu').addClass('translate-x-full');
            $('body').css('overflow', '');
        });

        // --- PARTICLES JS ---
        const particleCount = window.innerWidth < 768 ? 20 : 40;
        particlesJS('particles-js', {
            particles: {
                number: { value: particleCount }, color: { value: '#A52A2A' }, shape: { type: 'circle' },
                opacity: { value: 0.2 }, size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#A52A2A', opacity: 0.15, width: 1 },
                move: { enable: true, speed: 1.2 }
            }
        });

        // --- RENDER FILTERS ---
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

        // --- RENDER GALLERY & EVENTS ---
        const $galleryBox = $('#gallery-container');

        // Định nghĩa cấu trúc HTML chung cho 1 item Thư viện ảnh
        const createGalleryItem = (gallery, realIndex) => `
            <div class="gallery-item relative aspect-[4/5] cursor-pointer group" onclick="openGalleryModal(${realIndex})">
                <img src="${gallery.thumbnail}" class="w-full h-full object-cover" alt="${gallery.title}">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5">
                    <h3 class="serif text-white text-lg font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400">${gallery.title}</h3>
                    <p class="text-white/70 text-xs mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400 delay-75">${gallery.images.length} hình ảnh</p>
                </div>
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md">
                    <i class="fas fa-expand-alt text-maroon text-xs"></i>
                </div>
            </div>
        `;

        const initialLimit = 4;

        // Chỉ hiển thị tối đa 4 di sản ban đầu
        galleryImages.slice(0, initialLimit).forEach((gallery, index) => {
            $galleryBox.append(createGalleryItem(gallery, index));
        });

        // Xử lý sự kiện "Xem toàn bộ"
        const $btnViewAll = $('#btn-view-all-gallery');
        const $actionContainer = $('#gallery-action-container');

        if (galleryImages.length <= initialLimit) {
            $actionContainer.hide();
        } else {
            $btnViewAll.on('click', function () {
                const remainingItems = galleryImages.slice(initialLimit);

                remainingItems.forEach((gallery, idx) => {
                    const realIndex = initialLimit + idx; // Giữ đúng chỉ số mảng gốc cho Popup Modal
                    const $item = $(createGalleryItem(gallery, realIndex)).hide();
                    $galleryBox.append($item);
                    $item.fadeIn(600); // Hiệu ứng hiển thị mượt mà
                });

                $actionContainer.slideUp(400); // Ẩn vùng chứa nút sau khi load hết
            });
        }

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

        // --- INIT MAP ---
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

        // --- AUDIO LOGIC ---
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

// --- 3. HÀM RENDER SWIPER ---
function renderSwiperSlides(data) {
    const $container = $('#heritage-container');
    $container.empty();

    data.forEach(h => {
        $container.append(`
            <div class="swiper-slide bg-white rounded-[24px] md:rounded-[30px] p-3 md:p-4 flex flex-col shadow-xl border border-gray-100 tilt-card" data-tilt data-tilt-max="5" data-tilt-speed="400">
                <div class="h-1/2 w-full rounded-[16px] md:rounded-[20px] overflow-hidden relative">
                     <img src="${h.img}" class="w-full h-full object-cover rounded-[16px] md:rounded-[20px]" alt="${h.name}">
                     <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                     <div class="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold text-maroon shadow-sm">${h.cat}</div>
                </div>
                <div class="p-4 md:p-6 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 class="serif text-xl md:text-2xl text-gray-900 mb-1 md:mb-2 font-bold">${h.name}</h3>
                        <p class="text-gray-500 text-xs md:text-sm flex items-center gap-2"><i class="fas fa-map-marker-alt text-maroon"></i> ${h.loc}</p>
                        <p class="text-sm mt-2 line-clamp-3 text-gray-600">${h.desc}</p>
                    </div>
                    <div class="flex gap-2 mt-3 md:mt-4">
                        <button class="flex-1 py-2 md:py-3 bg-maroon/10 border border-maroon/20 rounded-xl text-[10px] md:text-xs font-semibold text-maroon hover:bg-maroon transition cursor-pointer">
                            <a href="details.html?alias=${h.alias}"><i class="fas fa-info-circle mr-1"></i> Chi tiết</a>
                        </button>
                        <button class="w-10 md:w-12 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-100 transition" title="VR 360">
                            <a href="vr360.html?alias=${h.alias}"><i class="fas fa-vr-cardboard text-gray-600"></i></a>
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

// --- 4. LOGIC ĐIỀU KHIỂN GALLERY MODAL ---
let modalSwiperInstance;

window.openGalleryModal = function (index) {
    const modal = document.getElementById('gallery-modal');
    const data = window.globalGalleries[index];
    if (!data) return;

    document.getElementById('gallery-modal-title').innerText = data.title;
    const $wrapper = $('#modal-gallery-wrapper');
    $wrapper.empty();

    data.images.forEach(img => {
        $wrapper.append(`
            <div class="swiper-slide flex flex-col items-center justify-center relative">
                <img src="${img.url}" class="max-w-full max-h-full object-contain p-2 md:p-8" alt="Tư liệu di sản">
                ${img.caption ? `
                    <div class="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/90 to-transparent text-center">
                        <p class="text-white/90 text-xs md:text-sm max-w-3xl mx-auto font-light leading-relaxed">${img.caption}</p>
                    </div>
                ` : ''}
            </div>
        `);
    });

    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');

    // Khóa cuộn màn hình nền tuyệt đối
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        if (modalSwiperInstance) modalSwiperInstance.destroy(true, true);
        modalSwiperInstance = new Swiper('.modal-gallery-swiper', {
            slidesPerView: 1, spaceBetween: 30, loop: true,
            keyboard: { enabled: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true },
            effect: 'fade', fadeEffect: { crossFade: true }
        });
    }, 100);
};

window.closeGalleryModal = function () {
    const modal = document.getElementById('gallery-modal');
    modal.classList.add('opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Mở khóa cuộn nền
        if (modalSwiperInstance) {
            modalSwiperInstance.destroy(true, true);
            modalSwiperInstance = null;
        }
    }, 300);
};

// --- 5. LOGIC KHỞI TẠO VÀ ĐIỀU KHIỂN VIEWER 3D ---
function init3DViewer(fbxPath) {
    const container = document.getElementById('3d-canvas-container');
    const loading = document.getElementById('loading-3d');
    loading.style.display = 'flex';

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    camera = new THREE.PerspectiveCamera(40, 1, 0.1, 5000);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;

    const oldCanvas = container.querySelector('canvas');
    if (oldCanvas) container.removeChild(oldCanvas);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    const loader = new THREE.FBXLoader();
    loader.load(fbxPath, (object) => {
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.6;

        camera.position.set(0, 0, cameraZ);
        scene.add(object);

        if (controls) controls.dispose();
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        loading.style.display = 'none';
        animate();
    }, undefined, (error) => {
        console.error("Lỗi 3D:", error);
        loading.innerHTML = '<p class="text-maroon text-[9px]">Lỗi nạp mô hình</p>';
    });
}

function animate() {
    animationId = requestAnimationFrame(animate);
    if (controls) controls.update();
    renderer.render(scene, camera);
}

window.open3DModal = function (path, title) {
    const modal = document.getElementById('modal-3d');
    document.getElementById('modal-title').innerText = title;

    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');

    document.body.style.overflow = 'hidden';

    init3DViewer(path);

    setTimeout(() => {
        if (renderer) {
            const container = document.getElementById('3d-canvas-container');
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }, 100);
};

window.close3DModal = function () {
    const modal = document.getElementById('modal-3d');
    modal.classList.add('opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';

        if (renderer) {
            cancelAnimationFrame(animationId);
            renderer.dispose();
            scene.clear();
        }
    }, 300);
};

window.addEventListener('resize', () => {
    if (renderer && camera && !document.getElementById('modal-3d').classList.contains('hidden')) {
        const container = document.getElementById('3d-canvas-container');
        camera.aspect = 1;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
});