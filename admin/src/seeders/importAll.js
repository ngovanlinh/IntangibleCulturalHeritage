const { Heritage, Video, Gallery, Event } = require('../models');
const fs = require('fs');
const path = require('path');

const importAll = async () => {
    try {
        const dataDir = path.join(__dirname, '../../../data');
        const heritages = JSON.parse(fs.readFileSync(path.join(dataDir, 'heritages.json'), 'utf8'));
        const videos = JSON.parse(fs.readFileSync(path.join(dataDir, 'videos.json'), 'utf8'));
        const galleries = JSON.parse(fs.readFileSync(path.join(dataDir, 'galleries.json'), 'utf8'));
        const events = JSON.parse(fs.readFileSync(path.join(dataDir, 'events.json'), 'utf8'));

        // 1. Nạp Events
        for (const e of events) { await Event.create(e); }

        // 2. Nạp Heritages và Media liên quan
        for (const h of heritages) {
            const newHeritage = await Heritage.create(h);
            const heritageId = newHeritage.id;

            // Nạp Videos
            const relatedVideos = videos.find(v => v.alias === h.alias);
            if (relatedVideos) {
                for (const vid of relatedVideos.videos) {
                    await Video.create({ ...vid, heritageId });
                }
            }

            // Nạp Ảnh
            const relatedGalleries = galleries.find(g => g.alias === h.alias);
            if (relatedGalleries) {
                for (const img of relatedGalleries.images) {
                    await Gallery.create({ ...img, heritageId });
                }
            }
        }
        console.log('✅ Nạp toàn bộ dữ liệu từ thư mục /data thành công!');
        process.exit();
    } catch (error) {
        console.error('❌ Lỗi khi nạp dữ liệu:', error);
        process.exit(1);
    }
};
importAll();