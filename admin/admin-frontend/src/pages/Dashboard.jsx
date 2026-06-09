import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// 1. Dữ liệu giả định phục vụ vẽ biểu đồ thống kê
const dataByLocation = [
    { name: 'Tây Ninh', count: 5 },
    { name: 'Đà Nẵng', count: 3 },
    { name: 'Hà Nội', count: 8 },
    { name: 'Bắc Ninh', count: 6 },
    { name: 'An Giang', count: 4 },
];

const dataByCategory = [
    { name: 'Nghệ thuật trình diễn', value: 40 },
    { name: 'Nghề thủ công', value: 30 },
    { name: 'Lễ hội truyền thống', value: 20 },
    { name: 'Tập quán xã hội', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Trung Tâm Điều Hành Hệ Thống</h1>

            {/* Khối Thống Kê Nhanh (Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                    <p className="text-sm text-gray-500 uppercase font-bold">Tổng số Di sản</p>
                    <p className="text-3xl font-extrabold text-gray-800 mt-2">26</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-teal-500">
                    <p className="text-sm text-gray-500 uppercase font-bold">Không gian VR 360</p>
                    <p className="text-3xl font-extrabold text-gray-800 mt-2">12</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-500 uppercase font-bold">Tài nguyên Media & 3D</p>
                    <p className="text-3xl font-extrabold text-gray-800 mt-2">148</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
                    <p className="text-sm text-gray-500 uppercase font-bold">Thành viên điều hành</p>
                    <p className="text-3xl font-extrabold text-gray-800 mt-2">5</p>
                </div>
            </div>

            {/* Khu vực Biểu đồ nằm song song */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Biểu đồ hình cột */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Mật độ Di sản theo Địa phương</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataByLocation}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" name="Số lượng di sản" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Biểu đồ hình tròn */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Cơ cấu Danh mục Di sản (%)</h3>
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={dataByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                    {dataByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}