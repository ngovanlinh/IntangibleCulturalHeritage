import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, Trash2, Edit3, Filter } from 'lucide-react'; // Import icons

export default function HeritageList() {
    const [heritages, setHeritages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCat, setSelectedCat] = useState('Tất cả');

    useEffect(() => {
        axios.get('/heritages')
            .then(res => setHeritages(res.data))
            .catch(err => console.error("Lỗi lấy dữ liệu:", err));
    }, []);

    const categories = useMemo(() => {
        const cats = heritages.map(item => item.cat);
        return ['Tất cả', ...new Set(cats)];
    }, [heritages]);

    const filteredHeritages = heritages.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = selectedCat === 'Tất cả' || item.cat === selectedCat;
        return matchesSearch && matchesCat;
    });

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa di sản này?")) {
            axios.delete(`/heritages/${id}`)
                .then(() => setHeritages(heritages.filter(item => item.id !== id)))
                .catch(err => alert("Lỗi khi xóa: " + err.message));
        }
    };   

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">DANH MỤC DI SẢN VĂN HÓA PHI VẬT THỂ</h1>
                <Link to="/add" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                    <Plus size={20} /> Thêm mới
                </Link>
            </div>

            {/* Thanh tìm kiếm & bộ lọc */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm di sản..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <select
                        className="pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                        onChange={(e) => setSelectedCat(e.target.value)}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            {/* Bảng dữ liệu hiện đại */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tên Di sản</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Địa điểm</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredHeritages.map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                                        {item.cat}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.loc}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        <Link
                                            to={`/edit/${item.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-all inline-flex items-center"
                                        >
                                            <Edit3 size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all inline-flex items-center"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}