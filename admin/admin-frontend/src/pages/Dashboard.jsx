import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get('/heritages/stats', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => setStats(res.data))
            .catch(err => console.error("Lỗi lấy dữ liệu:", err));
    }, []);

    if (!stats) return <div className="p-8">Đang tải dữ liệu...</div>;

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold">Tổng quan hệ thống</h1>

            {/* Cards thống kê */}
            <div className="grid grid-cols-4 gap-6">
                <StatCard title="Tổng Di sản" value={stats.cards.totalHeritages} color="bg-blue-600" />
                <StatCard title="Media & Ảnh" value={stats.cards.totalMedia} color="bg-green-600" />
                <StatCard title="Thành viên" value={stats.cards.totalUsers} color="bg-purple-600" />
                <StatCard title="Tổng Mô hình" value={stats.cards.totalModels} color="bg-orange-600" />
            </div>

            {/* Biểu đồ */}
            <div className="grid grid-cols-2 gap-8 h-80">
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h3 className="font-bold mb-4">Mật độ di sản (Địa phương)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.locStats} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [value, "Số lượng"]}
                                labelStyle={{ color: '#333' }}
                            />
                            <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h3 className="font-bold mb-4">Cơ cấu danh mục</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={stats.categoryStats} dataKey="value" nameKey="name" outerRadius={80} label>
                                {stats.categoryStats.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color }) {
    return (
        <div className={`${color} p-6 rounded-xl text-white shadow-lg`}>
            <p className="text-sm opacity-80">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}