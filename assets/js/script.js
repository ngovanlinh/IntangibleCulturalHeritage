const scenesData = {    
    "dinhvinhphong_01": {      
        "title": "Đình Vĩnh Phong",
        "panorama": "assets/panoramas/dinhvinhphong_01.webp",           
        "maxPitch": 70,
        "minPitch": -50,
        "autoRotate": -1.5,
        "hotSpots": [
            {
                "pitch": 0, //toa do doc
                "yaw": 150, //toa do ngang
                "type": "scene",
                "text": "Vào chánh điện",
                "sceneId": "chuanoi_01",
                "targetYaw": 0,
                "targetPitch": 0
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

viewer.on('scenechange', function (sceneId) {
    document.querySelectorAll('.map-dot').forEach(dot => dot.classList.remove('active'));
    const activeDot = document.getElementById('dot-' + sceneId.replace('_', '-'));
    if (activeDot) activeDot.classList.add('active');
});

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