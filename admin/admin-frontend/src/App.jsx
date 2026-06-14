import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HeritageList from './pages/HeritageList';
import AddHeritage from './pages/AddHeritage';
import UserList from './pages/UserList';

// Định nghĩa component AdminRoute để bọc các trang dành riêng cho quản trị viên
const AdminRoute = ({ children }) => {
    const role = localStorage.getItem('role');

    // Nếu chưa đăng nhập hoặc không phải admin, chuyển hướng về trang chủ
    if (role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
};

// Component bảo vệ route: Nếu chưa đăng nhập, chuyển hướng về /login
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

const handleLogout = () => {
    // Xóa token và role khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Chuyển hướng người dùng về trang đăng nhập
    window.location.href = '/login';
};

// Thành phần SidebarMenu
function SidebarMenu() {
    const location = useLocation();
    const role = localStorage.getItem('role');

    // Nếu đang ở trang login, không hiển thị sidebar
    if (location.pathname === '/login') return null;

    return (
        <div className="w-64 bg-slate-900 text-gray-300 min-h-screen flex flex-col border-r border-slate-800">
            {/* Logo */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-center">
                <span className="text-lg font-black tracking-wider text-cyan-400">HERITAGE 3D - PANEL</span>
            </div>

            <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Nhóm Nội dung */}
                <div>
                    <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quản lý nội dung</p>
                    <div className="space-y-1">
                        <Link to="/" className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname === '/' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-800'}`}>
                            📊 &nbsp; Tổng quan (Dashboard)
                        </Link>
                        <Link to="/heritages" className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname === '/heritages' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-800'}`}>
                            📦 &nbsp; Quản lý Di sản
                        </Link>
                        <span className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed">
                            🌐 &nbsp; Quản lý VR 360
                        </span>
                        <span className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed">
                            🎬 &nbsp; Quản lý Media
                        </span>
                    </div>
                </div>

                {/* Nhóm Quản trị (Admin) */}
                {role === 'admin' && (
                    <div>
                        <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hệ thống (Admin)</p>
                        <div className="space-y-1">
                            <Link to="/users" className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname === '/users' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-800'}`}>👥 &nbsp; Tài khoản thành viên</Link>
                            <Link to="/roles" className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${location.pathname === '/roles' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-800'}`}>🔐 &nbsp; Phân quyền</Link>
                        </div>
                    </div>
                )}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                >
                    <span className="mr-2">🚪</span> Đăng xuất
                </button>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
                <SidebarMenu />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-end px-6 shadow-sm">
                        <div className="text-sm text-gray-500 font-medium">
                            Chào mừng quay trở lại, <span className="text-gray-800 font-semibold">Admin Panel v1.0</span>
                        </div>
                    </header>

                    <main className="flex-1 overflow-x-hidden overflow-y-auto">
                        <Routes>
                            <Route path="/login" element={<Login />} />

                            {/* Các route yêu cầu đăng nhập */}
                            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                            <Route path="/heritages" element={<PrivateRoute><HeritageList /></PrivateRoute>} />
                            <Route path="/add" element={<PrivateRoute><AddHeritage /></PrivateRoute>} />
                            <Route path="/edit/:id" element={<PrivateRoute><AddHeritage /></PrivateRoute>} />
                            <Route path="/users" element={
                                <PrivateRoute>
                                    <AdminRoute>
                                        <UserList />
                                    </AdminRoute>
                                </PrivateRoute>
                            } />
                            {/* Redirect mặc định */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}