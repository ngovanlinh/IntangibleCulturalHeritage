import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function AddHeritage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [activeTab, setActiveTab] = useState('basic'); // Quản lý tab hiện tại
    const [form, setForm] = useState({
        alias: '', name: '', cat: '', loc: '', desc: '', lat: '', lng: '', img: '',
        videos: [{ title: '', url: '' }], 
        galleries: [{ url: '', caption: '' }]
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (isEditMode) {
            axios.get(`/heritages/${id}`)
                .then(res => setForm(res.data))
                .catch(err => alert("Không thể tải dữ liệu di sản!"));
        }
    }, [id, isEditMode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const validVideos = form.videos.filter(v => v.url && v.url.trim() !== '');
        const validGalleries = form.galleries.filter(g => g.url && g.url.trim() !== '');
        const submitData = {
            ...form,
            lat: form.lat ? parseFloat(form.lat) : null,
            lng: form.lng ? parseFloat(form.lng) : null,
            videos: validVideos,
            galleries: validGalleries
        };
        if (isEditMode) {
            // Gọi API Put để cập nhật
            axios.put(`/heritages/${id}`, submitData)
                .then(() => { alert('Cập nhật thành công!'); navigate('/heritages'); })
                .catch(err => alert('Lỗi: ' + err.message));
        } else {
            axios.post('/heritages', submitData)
                .then(() => {
                    alert('Thêm di sản thành công!');
                    navigate('/heritages');
                })
                .catch(err => {
                    alert('Có lỗi xảy ra: ' + (err.response?.data?.message || err.message));
                });
        }
    };
    const handleArrayChange = (e, index, field, arrayName) => {
        const newArray = [...form[arrayName]];
        newArray[index][field] = e.target.value;
        setForm({ ...form, [arrayName]: newArray });
    };

    const addArrayItem = (arrayName, emptyItem) => {
        setForm({ ...form, [arrayName]: [...form[arrayName], emptyItem] });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">THÔNG TIN DI SẢN</h2>

            {/* Thanh điều hướng giữa các Tab */}
            <div className="flex border-b border-gray-200 mb-6">
                <button type="button" onClick={() => setActiveTab('basic')} className={`py-2 px-4 font-semibold text-sm border-b-2 transition-all ${activeTab === 'basic' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    1. Thông tin cơ bản
                </button>
                <button type="button" onClick={() => setActiveTab('map')} className={`py-2 px-4 font-semibold text-sm border-b-2 transition-all ${activeTab === 'map' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    2. Tọa độ & Bản đồ
                </button>
                <button type="button" onClick={() => setActiveTab('media')} className={`py-2 px-4 font-semibold text-sm border-b-2 transition-all ${activeTab === 'media' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    3. Tài nguyên số & Media
                </button>
            </div>

            {/* Nội dung chi tiết của từng Tab */}
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* TAB 1: THÔNG TIN CƠ BẢN */}
                {activeTab === 'basic' && (
                    <div className="space-y-4 animate-fadeIn">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên di sản</label>
                                <input type="text" name="name" value={form.name} required onChange={handleChange} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Đường dẫn tĩnh (Alias)</label>
                                <input type="text" name="alias" value={form.alias} required onChange={handleChange} placeholder="vd: don-ca-tai-tu" className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Danh mục (Cat)</label>
                                <input type="text" name="cat" value={form.cat} onChange={handleChange} placeholder="vd: Nghệ thuật dân gian" className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa điểm (Loc)</label>
                                <input type="text" name="loc" value={form.loc} onChange={handleChange} placeholder="vd: Tây Ninh" className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Đường dẫn ảnh bìa (Image URL)</label>
                            <input type="text" name="img" value={form.img} onChange={handleChange} placeholder="vd: /images/di-san.jpg" className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mô tả tóm tắt</label>
                            <textarea name="desc" rows="3" value={form.desc} onChange={handleChange} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg" placeholder="Nhập mô tả ngắn..."></textarea>
                        </div>
                    </div>
                )}

                {/* TAB 2: TỌA ĐỘ BẢN ĐỒ */}
                {activeTab === 'map' && (
                    <div className="space-y-4 animate-fadeIn">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vĩ độ (Latitude - Lat)</label>
                                <input type="number" step="any" name="lat" value={form.lat} onChange={handleChange} placeholder="vd: 11.3000" className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kinh độ (Longitude - Lng)</label>
                                <input type="number" step="any" name="lng" value={form.lng} onChange={handleChange} placeholder="vd: 106.1000" className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 italic">* Tọa độ định vị chính xác vị trí của di sản trên bản đồ số hệ thống Leaflet.</p>
                    </div>
                )}

                {/* TAB 3: TÀI NGUYÊN MEDIA */}
                {activeTab === 'media' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* QUẢN LÝ VIDEO */}
                        <div>
                            <h3 className="font-bold text-gray-700 mb-2">Danh sách Video</h3>
                            {form.videos.map((vid, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input className="mt-1 block p-2.5 border border-gray-300 rounded-lg" placeholder="Tiêu đề" value={vid.title} onChange={(e) => handleArrayChange(e, idx, 'title', 'videos')} />
                                    <input className="mt-1 block p-2.5 w-full border border-gray-300 rounded-lg" placeholder="URL" value={vid.url} onChange={(e) => handleArrayChange(e, idx, 'url', 'videos')} />
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayItem('videos', { title: '', url: '' })} className="text-blue-600 text-sm">+ Thêm Video</button>
                        </div>

                        {/* QUẢN LÝ ẢNH (GALLERY) */}
                        <div>
                            <h3 className="font-bold text-gray-700 mb-2">Thư viện ảnh</h3>
                            {form.galleries.map((img, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input className="mt-1 block p-2.5 border border-gray-300 rounded-lg" placeholder="URL ảnh" value={img.url} onChange={(e) => handleArrayChange(e, idx, 'url', 'galleries')} />
                                    <input className="mt-1 block p-2.5 w-full border border-gray-300 rounded-lg" placeholder="Chú thích" value={img.caption} onChange={(e) => handleArrayChange(e, idx, 'caption', 'galleries')} />
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayItem('galleries', { url: '', caption: '' })} className="text-blue-600 text-sm">+ Thêm Ảnh</button>
                        </div>
                    </div>
                )}

                {/* Thanh điều hướng chân trang (Hủy / Lưu) */}
                <div className="flex justify-between border-t border-gray-100 pt-4 mt-6">
                    <button type="button" onClick={() => navigate('/heritages')} className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-5 py-2 rounded-lg font-medium transition-all">
                        Quay lại
                    </button>
                    <button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg font-medium shadow-md transition-all">
                        Lưu vào hệ thống
                    </button>
                </div>
            </form>
        </div>
    );
}