import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddHeritage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('basic'); // Quản lý tab hiện tại
    const [form, setForm] = useState({
        alias: '', name: '', cat: '', loc: '', desc: '', lat: '', lng: '', img: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...form,
            lat: form.lat ? parseFloat(form.lat) : null,
            lng: form.lng ? parseFloat(form.lng) : null
        };

        axios.post('http://localhost:5000/api/heritages', submitData)
            .then(() => {
                alert('Thêm di sản thành công!');
                navigate('/heritages');
            })
            .catch(err => {
                alert('Có lỗi xảy ra: ' + (err.response?.data?.message || err.message));
            });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Thêm Di sản Văn hóa Mới</h2>

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
                                <input type="text" name="name" value={form.name} required onChange={handleChange} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Đường dẫn tĩnh (Alias)</label>
                                <input type="text" name="alias" value={form.alias} required onChange={handleChange} placeholder="vd: don-ca-tai-tu" className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mô tả tóm tắt di sản</label>
                            <textarea name="desc" rows="4" value={form.desc} onChange={handleChange} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Nhập phần tóm tắt hiển thị ở thẻ tra cứu nhanh..."></textarea>
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
                    <div className="space-y-4 animate-fadeIn">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Danh mục phân loại</label>
                                <input type="text" name="cat" value={form.cat} required onChange={handleChange} placeholder="vd: Nghệ thuật trình diễn dân gian" className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa điểm / Tỉnh thành</label>
                                <input type="text" name="loc" value={form.loc} onChange={handleChange} placeholder="vd: Tây Ninh" className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Đường dẫn ảnh bìa chính (Image URL)</label>
                            <input type="text" name="img" value={form.img} onChange={handleChange} placeholder="vd: images/don-ca-tai-tu.jpg" className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
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