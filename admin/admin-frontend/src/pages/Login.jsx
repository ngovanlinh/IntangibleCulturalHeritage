import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
            // Lưu Token vào localStorage để trình duyệt ghi nhớ phiên đăng nhập
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            alert('Đăng nhập thành công!');
            navigate('/'); // Chuyển về Dashboard
        } catch (err) {
            alert('Đăng nhập thất bại: ' + err.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập Admin</h2>
                <input
                    type="text" placeholder="Tên đăng nhập"
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full p-2 mb-4 border rounded" required
                />
                <input
                    type="password" placeholder="Mật khẩu"
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full p-2 mb-6 border rounded" required
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Đăng nhập
                </button>
            </form>
        </div>
    );
}