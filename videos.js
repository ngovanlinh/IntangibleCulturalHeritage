$(document).ready(async function () {
    try {
        const response = await fetch('data/videos.json');
        if (!response.ok) throw new Error("Lỗi nạp dữ liệu JSON");

        const heritageVideos = await response.json();
        renderVideoCatalog(heritageVideos);

    } catch (error) {
        console.error("Quá trình tải dữ liệu video bị lỗi:", error);
        $('#video-catalog-container').html('<p class="text-center text-[#A52A2A]">Không thể tải dữ liệu tư liệu video lúc này.</p>');
    }
    // --- THÊM LOGIC MOBILE MENU TẠI ĐÂY ---
    $('#mobile-menu-btn').on('click', function () {
        $('#mobile-menu').removeClass('translate-x-full');
        $('body').css('overflow', 'hidden'); // Khóa cuộn trang nền
    });

    $('#close-menu-btn, .mobile-link').on('click', function () {
        $('#mobile-menu').addClass('translate-x-full');
        $('body').css('overflow', ''); // Mở khóa cuộn trang nền
    });
});

// Hàm hiển thị danh mục video
function renderVideoCatalog(data) {
    const $container = $('#video-catalog-container');
    $container.empty();

    data.forEach(heritage => {
        // Tạo khối tiêu đề cho di sản
        let heritageBlock = `
            <div class="heritage-video-section">
                <div class="mb-6 md:mb-8 border-l-4 border-[#A52A2A] pl-4">
                    <h2 class="serif text-2xl md:text-3xl font-bold text-gray-900">${heritage.heritage_name}</h2>
                    <p class="text-gray-500 text-sm mt-2">${heritage.description}</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        `;

        // Render từng video trong mảng của di sản đó
        heritage.videos.forEach(video => {
            heritageBlock += `
                <div class="video-card group cursor-pointer flex flex-col gap-3" 
                     onclick="openVideoModal('${video.url}', '${video.title.replace(/'/g, "\\'")}')">
                    
                    <div class="relative w-full aspect-video rounded-[16px] overflow-hidden bg-gray-100 shadow-md">
                        <img src="${video.thumbnail}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${video.title}">
                        
                        <div class="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                            <div class="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 group-hover:bg-[#A52A2A]/90 transition-all shadow-lg">
                                <i class="fas fa-play text-white text-lg md:text-xl ml-1"></i>
                            </div>
                        </div>
                    </div>
                    
                    <h3 class="font-semibold text-gray-800 text-sm md:text-base group-hover:text-[#A52A2A] transition-colors line-clamp-2">
                        ${video.title}
                    </h3>
                </div>
            `;
        });

        heritageBlock += `</div></div>`;
        $container.append(heritageBlock);
    });
}

// Hàm mở Modal Video
window.openVideoModal = function (url, title) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');

    // Cập nhật tiêu đề và URL cho iframe
    document.getElementById('video-modal-title').innerText = title;

    // Thêm tham số autoplay để video tự động phát khi bật lên
    const autoplayUrl = url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
    iframe.src = autoplayUrl;

    // Hiển thị modal và khóa nền
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
    document.body.style.overflow = 'hidden';
};

// Hàm đóng Modal Video
window.closeVideoModal = function () {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-iframe');

    // Tạo hiệu ứng mờ dần
    modal.classList.add('opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';

        // CỰC KỲ QUAN TRỌNG: Xóa src để dừng phát video & giải phóng băng thông
        iframe.src = '';
    }, 300);
};