import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, UserPlus, Edit3, X, Key } from 'lucide-react';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'editor', newPassword: '' });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) { alert('Lỗi tải danh sách!'); }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openModal = (user = null) => {
        setCurrentUser(user);
        setFormData(user ? { username: user.username, role: user.role } : { username: '', password: '', role: 'editor' });
        setIsModalOpen(true);
    };

    const openChangePasswordModal = (user) => {
        setCurrentUser(user);
        setFormData({ newPassword: '' });
        setIsPasswordModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            if (currentUser) {
                await axios.put(`/users/${currentUser.id}`, formData, config);
            } else {
                await axios.post('/users', formData, config);
            }
            fetchUsers();
            setIsModalOpen(false);
        } catch (err) { alert('Lỗi thực hiện!'); }
    };

    const handlePasswordChange = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/users/${currentUser.id}/password`,
                { newPassword: formData.newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Đổi mật khẩu thành công!');
            setIsPasswordModalOpen(false);
        } catch (err) { alert('Lỗi đổi mật khẩu!'); }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsPasswordModalOpen(false); // Đóng luôn cả modal đổi mật khẩu nếu cần
        setCurrentUser(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa thành viên này?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchUsers(); // Tải lại danh sách sau khi xóa thành công
            } catch (err) {
                alert('Lỗi khi xóa thành viên!');
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Quản lý thành viên</h1>
                <button onClick={() => openModal()} className="bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <UserPlus size={18} /> Thêm thành viên
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Username</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700">Vai trò</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{user.username}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex gap-3 justify-end items-center">
                                        <button onClick={() => openModal(user)} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-lg transition-all">
                                            <Edit3 size={18} />
                                        </button>
                                        <button onClick={() => openChangePasswordModal(user)} className="text-purple-600 hover:text-purple-800 p-2 hover:bg-purple-100 rounded-lg transition-all">
                                            <Key size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Sửa/Thêm */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={closeModal} // Click vào nền là đóng
                >
                    <div
                        className="bg-white p-6 rounded-lg w-96 shadow-xl"
                        onClick={(e) => e.stopPropagation()} // Chặn click lan ra nền để không bị đóng khi click vào trong form
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">{currentUser ? 'Sửa thông tin' : 'Thêm thành viên'}</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="username" placeholder="Username" className="w-full border p-2" onChange={handleChange} value={formData.username} />
                            {!currentUser && <input name="password" type="password" placeholder="Mật khẩu" className="w-full border p-2" onChange={handleChange} />}
                            <select name="role" className="w-full border p-2" onChange={handleChange} value={formData.role}>
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Lưu lại</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Đổi mật khẩu */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Đổi mật khẩu cho {currentUser?.username}</h2>
                        <input type="password" placeholder="Mật khẩu mới" className="w-full border p-2 mb-4" onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} />
                        <div className="flex gap-2">
                            <button onClick={() => setIsPasswordModalOpen(false)} className="flex-1 bg-gray-200 py-2 rounded">Hủy</button>
                            <button onClick={handlePasswordChange} className="flex-1 bg-purple-600 text-white py-2 rounded">Lưu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}