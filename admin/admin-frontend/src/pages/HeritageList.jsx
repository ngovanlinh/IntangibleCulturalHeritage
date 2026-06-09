import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function HeritageList() {
    const [heritages, setHeritages] = useState([]);

    useEffect(() => {
        // Gọi API lấy danh sách di sản từ Backend
        axios.get('http://localhost:5000/api/heritages')
            .then(res => setHeritages(res.data))
            .catch(err => console.error("Lỗi lấy dữ liệu:", err));
    }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Di sản Văn hóa</h1>
                <Link to="/add" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                    + Thêm Di sản Mới
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 text-left text-sm uppercase font-semibold">
                            <th className="px-5 py-3">Tên Di sản</th>
                            <th className="px-5 py-3">Danh mục</th>
                            <th className="px-5 py-3">Địa điểm</th>
                            <th className="px-5 py-3">Đường dẫn (Alias)</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {heritages.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-5 py-5 text-center text-gray-500">
                                    Chưa có di sản nào. Hãy bấm nút thêm mới!
                                </td>
                            </tr>
                        ) : (
                            heritages.map((item) => (
                                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-5 py-4 font-medium">{item.name}</td>
                                    <td className="px-5 py-4">{item.cat}</td>
                                    <td className="px-5 py-4">{item.loc}</td>
                                    <td className="px-5 py-4 text-blue-600">`{item.alias}`</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}