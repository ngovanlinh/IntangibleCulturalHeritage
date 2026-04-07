const scenesData = {    
    "dinhvinhphong_01": {      
        "title": "Lễ kỳ yên Đình Vĩnh Phong",
        "panorama": "assets/panoramas/dinhvinhphong_01.webp",           
        "maxPitch": 70,
        "minPitch": -50,
        "autoRotate": -1.5,
        "hotSpots": [
            {
                "pitch": 0,
                "yaw": 150,
                "cssClass": "pulse-hotspot",
                "createTooltipFunc": hotspotHTML,
                "createTooltipArgs": "Xem Đội Tế Lễ",               
                "type": "scene",
                "text": "Vào chánh điện",
                "sceneId": "chuanoi_01"
            },
            {
                "pitch": 5,
                "yaw": 45,
                "type": "info",
                "text": "Xem video Đội Tế Lễ",
                "clickHandlerFunc": openInfo,
                "clickHandlerArgs": {
                    "title": "Nghi thức Tế Lễ",
                    "video": "",
                    "desc": "Các bô lão đang thực hiện nghi thức..."
                }
            }
        ],
        "autoLoad": true
    },
    "chuanoi_01": {       
        "title": "Cổng chùa nổi",
        "panorama": "assets/panoramas/chuanoi_01.webp",
        "maxPitch": 80,
        "minPitch": -80,
        "autoRotate": -1.5,
        "hotSpots": [
            {
                "pitch": -5,
                "yaw": 10,
                "type": "scene",
                "text": "Tiến vào Chánh Điện",
                "sceneId": "chanh_dien"
            },
            {
                "pitch": -10,
                "yaw": 190,
                "type": "scene",
                "text": "Quay ra Cổng",
                "sceneId": "cong_dinh"
            },   
            {
                "pitch": 5,
                "yaw": 45,
                "type": "info",
                "text": "Xem video Đội Tế Lễ",
                "clickHandlerFunc": openInfo,
                "clickHandlerArgs": {
                    "title": "Nghi thức Tế Lễ",
                    "video": "",
                    "desc": "Các bô lão đang thực hiện nghi thức..."
                }
            }
        ]
    }
};

const viewer = pannellum.viewer('panorama-container', {
    "default": {
        "firstScene": "dinhvinhphong_01",
        "author": "Sở Văn hóa thể thao và Du lịch",
        "autoRotate": -2,
        "autoRotateInactivityDelay": 3000,
        "autoRotateStopDelay": 0,
        "autoLoad": true,
        "sceneFadeDuration": 1000
    },
    "scenes": scenesData
});

viewer.on('render', function () {
    const yaw = viewer.getYaw();
    const pointer = document.getElementById('compass-pointer');
    if (pointer) pointer.style.transform = `rotate(${-yaw}deg)`;
});
// Đợi Pannellum khởi tạo xong rồi mới chèn nút
viewer.on('load', function () {
    // 1. Tìm container chứa các nút điều khiển của Pannellum
    const controlContainer = document.querySelector('.pnlm-controls-container');

    // 2. Kiểm tra xem nút đã tồn tại chưa (tránh tạo trùng khi chuyển scene)
    if (!document.querySelector('.pnlm-slideshow-control')) {

        // 3. Tạo thẻ div cho nút mới
        const slideshowBtn = document.createElement('div');
        slideshowBtn.className = 'pnlm-slideshow-control pnlm-control';
        slideshowBtn.title = 'Xem danh mục di sản'; // Hiện chữ khi di chuột vào

        // 4. Gán sự kiện click để mở Popup Slideshow (hàm đã viết ở bước trước)
        slideshowBtn.onclick = function () {
            openHeritagePopup();
        };

        // 5. Chèn nút vào thanh điều khiển (thường nằm dưới nút Fullscreen)
        controlContainer.prepend(slideshowBtn); 
        loadJson();
    }
});

viewer.on('scenechange', function (sceneId) {
    document.querySelectorAll('.map-dot').forEach(dot => dot.classList.remove('active'));
    const activeDot = document.getElementById('dot-' + sceneId.replace('_', '-'));
    if (activeDot) activeDot.classList.add('active');
    updateActiveDot(sceneId);    
});

document.getElementById('toggle-map').onclick = function () {
    const content = document.querySelector('.map-relative');
    if (content.style.display === "none") {
        content.style.display = "block";
        this.innerText = "—";        
    } else {
        content.style.display = "none";
        this.innerText = "+";        
    }
};

// Hàm khởi tạo bản đồ từ dữ liệu JSON
function setupMiniMap(data) {
    const mapWrapper = document.getElementById('map-wrapper');
    if (!mapWrapper) return;

    data.forEach(item => {
        const dot = document.createElement('div');
        dot.className = 'map-dot';
        dot.id = `dot-${item.id}`;
        dot.setAttribute('data-scene', item.id);

        // Tọa độ lấy từ file JSON
        dot.style.left = `${item.map_x}%`;
        dot.style.top = `${item.map_y}%`;

        // Cấu trúc HTML bao gồm hiệu ứng Pulse và Tooltip
        dot.innerHTML = `
            <span class="dot-pulse"></span>
            <div class="tooltip">${item.title}</div>
        `;

        dot.onclick = () => {
            viewer.loadScene(item.id);
        };

        mapWrapper.appendChild(dot);
    });

    // Cập nhật trạng thái ban đầu
    updateActiveDot(viewer.getScene());
}

// Hàm cập nhật trạng thái Active (Chấm đỏ nhấp nháy)
function updateActiveDot(sceneId) {
    document.querySelectorAll('.map-dot').forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-scene') === sceneId) {
            dot.classList.add('active');
        }
    });
}

function hotspotHTML(hotSpotDiv, args) {
    hotSpotDiv.classList.add('pnlm-tooltip');
    var span = document.createElement('span');
    span.innerHTML = args;
    hotSpotDiv.appendChild(span);
    span.style.width = span.scrollWidth + 'px';
    span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth - 120) / 2 + 'px';
    span.style.marginTop = "-80px";
}
function openInfo(event, data) {
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-description').innerText = data.desc;

    let mediaHTML = '';
    if (data.video !== '') {
        if (data.video.includes('youtube')) {
            mediaHTML = `<iframe width="100%" height="315" src="${data.video}" frameborder="0" allowfullscreen></iframe>`;
        } else {
            mediaHTML = `<video controls width="100%"><source src="${data.video}" type="video/mp4"></video>`;
        }
        document.getElementById('modal-media').innerHTML = mediaHTML;
    }
    document.getElementById('info-modal').style.display = 'block';
}

document.querySelector('.close-btn').onclick = function () {
    document.getElementById('info-modal').style.display = 'none';
    document.getElementById('modal-media').innerHTML = '';
};


let slideIndex = 1;
let heritageData = [];

async function loadJson() {
    if (heritageData.length === 0) {
        try {
            const response = await fetch('assets/data/heritages.json');
            heritageData = await response.json();
            renderSlides();
            setupMiniMap(heritageData);
            slideIndex = 1;
            showSlides(slideIndex);
        } catch (error) {
            console.error("Không tải được JSON", error);
        }
    }
}
// 1. Hàm mở Popup và tải dữ liệu JSON
function openHeritagePopup() {
    document.getElementById("heritagePopup").style.display = "block";

    loadJson();
    if (heritageData.length > 0)
        showSlides(slideIndex);
}

// 2. Hàm dựng HTML từ dữ liệu JSON
function renderSlides() {
    const inner = document.getElementById("slideshow-inner");
    inner.innerHTML = heritageData.map((item, index) => `
        <div class="mySlides fade">
            <img src="${item.thumbnail}" class="slide-img">
            <div class="heritage-info">
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                <div class="group-btns">
                    <button class="btn-visit" onclick="goToScene('${item.id}')">THAM QUAN 360</button>
                    <button class="btn-info" onclick="goToDetail('${item.id}')">XEM GIỚI THIỆU</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Hàm chuyển hướng đến trang chi tiết
function goToDetail(id) {
    window.location.href = `details.html?id=${id}`;
}

// 3. Hàm chuyển Scene trong Pannellum
function goToScene(sceneId) {
    viewer.loadScene(sceneId); // Chuyển cảnh
    closeHeritagePopup();      // Đóng popup
}

// 4. Các hàm điều hướng Slideshow
function closeHeritagePopup() { document.getElementById("heritagePopup").style.display = "none"; }

function plusSlides(n) { showSlides(slideIndex += n); }

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}