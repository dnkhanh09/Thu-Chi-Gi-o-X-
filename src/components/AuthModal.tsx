import {
  Building2,
  CheckCircle2,
  Church,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Plus,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { initialUsers } from '../data/initialData';
import { Parish, UserAccount, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  parishes: Parish[];
  onLogin: (
    username: string,
    password?: string,
    targetParishId?: string
  ) => { success: boolean; message: string; user?: UserAccount };
  onQuickLogin: (userId: string, targetParishId?: string) => void;
  onLogout: () => void;
  onRegisterUser: (data: {
    username: string;
    fullName: string;
    saintName?: string;
    email: string;
    phone?: string;
    password?: string;
    role: UserRole;
    parishId?: string;
    newParishData?: Partial<Parish>;
  }) => { success: boolean; message: string; user?: UserAccount };
  onOpenParishManager?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  parishes,
  onLogin,
  onQuickLogin,
  onLogout,
  onRegisterUser,
  onOpenParishManager,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'profile'>(
    currentUser ? 'profile' : 'login'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Login Form State
  const [selectedParishId, setSelectedParishId] = useState<string>(parishes[0]?.id || 'all');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regSaintName, setRegSaintName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('accountant');
  const [regParishMode, setRegParishMode] = useState<'existing' | 'new'>('existing');
  const [regParishId, setRegParishId] = useState<string>(parishes[0]?.id || 'parish-01');

  // New Parish Details during registration
  const [newParishName, setNewParishName] = useState('');
  const [newDioceseName, setNewDioceseName] = useState('');
  const [newDeaneryName, setNewDeaneryName] = useState('');
  const [newAddress, setNewAddress] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!loginIdentifier.trim()) {
      setAuthError('Vui lòng nhập tên đăng nhập hoặc email!');
      return;
    }

    const res = onLogin(loginIdentifier, loginPassword, selectedParishId);
    if (res.success) {
      setAuthSuccess(res.message);
      setTimeout(() => {
        onClose();
        setAuthSuccess(null);
      }, 600);
    } else {
      setAuthError(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!regFullName.trim() || !regUsername.trim() || !regEmail.trim()) {
      setAuthError('Vui lòng điền đầy đủ Tên, Tên đăng nhập và Email!');
      return;
    }

    if (regParishMode === 'new' && !newParishName.trim()) {
      setAuthError('Vui lòng nhập Tên Giáo Xứ mới!');
      return;
    }

    const res = onRegisterUser({
      username: regUsername,
      fullName: regFullName,
      saintName: regSaintName,
      email: regEmail,
      phone: regPhone,
      password: regPassword || '123456',
      role: regRole,
      parishId: regParishMode === 'existing' ? regParishId : undefined,
      newParishData:
        regParishMode === 'new'
          ? {
              name: newParishName,
              dioceseName: newDioceseName || 'GIÁO PHẬN MỚI',
              deaneryName: newDeaneryName || 'Giáo Hạt Mới',
              address: newAddress,
            }
          : undefined,
    });

    if (res.success) {
      setAuthSuccess(res.message);
      setTimeout(() => {
        onClose();
        setAuthSuccess(null);
      }, 1000);
    } else {
      setAuthError(res.message);
    }
  };

  const roleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: 'Quản Trị Hệ Thống', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'pastor':
        return { label: 'Linh Mục Chánh Xứ', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'accountant':
        return { label: 'Kế Toán Ban Tài Chính', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'treasurer':
        return { label: 'Thủ Quỹ Ban Tài Chính', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'council_leader':
        return { label: 'Trưởng Ban Hành Giáo', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'viewer':
      default:
        return { label: 'Giám Sát / Thành Viên', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Church className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                {currentUser ? 'Tài Khoản & Quyền Quản Trị' : 'Đăng Nhập / Tạo Tài Khoản'}
              </h2>
              <p className="text-xs text-slate-400">
                Hệ thống Quản Trị Thu Chi Giáo Xứ (Đa Giáo Xứ)
              </p>
            </div>
          </div>
          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          {currentUser ? (
            <>
              <button
                id="tab-auth-profile"
                onClick={() => setActiveTab('profile')}
                className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Hồ Sơ Cá Nhân
              </button>
              <button
                id="tab-auth-switch"
                onClick={() => setActiveTab('login')}
                className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'login'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                Đổi Tài Khoản
              </button>
              <button
                id="tab-auth-register"
                onClick={() => setActiveTab('register')}
                className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'register'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Thêm Tài Khoản Mới
              </button>
            </>
          ) : (
            <>
              <button
                id="tab-auth-login"
                onClick={() => setActiveTab('login')}
                className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'login'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                Đăng Nhập
              </button>
              <button
                id="tab-auth-register"
                onClick={() => setActiveTab('register')}
                className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'register'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Tạo Tài Khoản Mới / Thêm Giáo Xứ
              </button>
            </>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Notification Alerts */}
          {authError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* TAB 1: Profile (When user is logged in) */}
          {activeTab === 'profile' && currentUser && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-white">
                  {currentUser.role === 'admin' ? '👑' : currentUser.saintName ? currentUser.saintName.charAt(0) : currentUser.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">
                      {currentUser.fullName}
                    </h3>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${roleBadge(currentUser.role).color}`}>
                      {roleBadge(currentUser.role).label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    @{currentUser.username} • {currentUser.email}
                  </p>
                  {currentUser.phone && (
                    <p className="text-xs text-slate-500">
                      Thông tin: {currentUser.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Parishes Access List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  Các Giáo Xứ Bạn Có Quyền Truy Cập ({parishes.filter(p => currentUser.role === 'admin' || currentUser.role === 'pastor' || currentUser.parishIds.includes(p.id)).length})
                </h4>
                <div className="space-y-2">
                  {parishes
                    .filter((p) => currentUser.role === 'admin' || currentUser.role === 'pastor' || currentUser.parishIds.includes(p.id))
                    .map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Church className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{p.name}</p>
                            <p className="text-[11px] text-slate-500">{p.dioceseName} • {p.deaneryName}</p>
                          </div>
                        </div>
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                          {p.code}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Creator Attribution Info */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Phát triển phần mềm: </span>
                  <strong className="text-blue-900">DN Khánh</strong>
                </div>
                <a
                  href="https://www.Khang.Top"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>www.Khang.Top</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                {onOpenParishManager && (
                  <button
                    id="btn-profile-manage-parishes"
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenParishManager();
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    Quản Lý Danh Sách Giáo Xứ &rarr;
                  </button>
                )}

                <button
                  id="btn-auth-logout"
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Đăng Xuất Tài Khoản
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Login Form */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Chọn Giáo Xứ Đang Làm Việc <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedParishId}
                    onChange={(e) => setSelectedParishId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="all">👑 Toàn Quyền Quản Trị Hệ Thống (DN Khánh / Tất Cả)</option>
                    {parishes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.dioceseName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tên đăng nhập hoặc Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-username-modal"
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="VD: admin, chaxu, ketoan, thuquy hoặc email..."
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mật khẩu (Mặc định: 123)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-password-modal"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Mặc định: 123"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-submit-login-modal"
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  Đăng Nhập Vào Hệ Thống
                </button>
              </form>

              {/* Quick 1-Click Demo Accounts */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Đăng Nhập Nhanh (Tài Khoản Mẫu)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {initialUsers.map((u) => {
                    const badge = roleBadge(u.role);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          onQuickLogin(u.id, selectedParishId);
                          setAuthSuccess(`Đã đăng nhập: ${u.fullName}`);
                          setTimeout(() => {
                            onClose();
                            setAuthSuccess(null);
                          }, 500);
                        }}
                        className={`p-2.5 text-left rounded-xl border transition-all flex items-center gap-2.5 group cursor-pointer ${
                          u.role === 'admin'
                            ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500'
                            : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          u.role === 'admin' ? 'bg-amber-500 text-slate-900' : 'bg-slate-200 group-hover:bg-blue-600 group-hover:text-white text-slate-700'
                        }`}>
                          {u.role === 'admin' ? '👑' : u.saintName ? u.saintName.charAt(0) : u.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-700">
                            {u.fullName}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {badge.label} • @{u.username}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên Thánh & Họ Tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="VD: Giuse Nguyễn Văn A"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên Thánh (Bổn Mạng)
                  </label>
                  <input
                    type="text"
                    value={regSaintName}
                    onChange={(e) => setRegSaintName(e.target.value)}
                    placeholder="VD: Giuse, Maria, Phêrô..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên đăng nhập <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="VD: ketoan_moi, cha_xu..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@giaoxu.vn"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chức Vụ / Quyền Hạn Trong Xứ
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="pastor">Linh Mục Chánh Xứ / Quản Xứ (Toàn quyền)</option>
                    <option value="accountant">Kế Toán Ban Tài Chính (Lập chứng từ & Báo cáo)</option>
                    <option value="treasurer">Thủ Quỹ Ban Tài Chính (Quản lý Sổ quỹ & Thu chi)</option>
                    <option value="council_leader">Trưởng Ban Hành Giáo (Giám sát & Duyệt)</option>
                    <option value="viewer">Hội Đồng Mục Vụ / Giám Sát (Chỉ xem)</option>
                  </select>
                </div>
              </div>

              {/* Parish Selection / Creation */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
                <label className="block text-xs font-bold text-blue-900">
                  Chọn Giáo Xứ Hoạt Động
                </label>

                <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="parishModeModal"
                      checked={regParishMode === 'existing'}
                      onChange={() => setRegParishMode('existing')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Tham gia Giáo xứ có sẵn ({parishes.length})</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="parishModeModal"
                      checked={regParishMode === 'new'}
                      onChange={() => setRegParishMode('new')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>+ Tạo Giáo xứ mới ngay</span>
                  </label>
                </div>

                {regParishMode === 'existing' ? (
                  <div>
                    <select
                      value={regParishId}
                      onChange={(e) => setRegParishId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      {parishes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.dioceseName} ({p.deaneryName})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      required
                      value={newParishName}
                      onChange={(e) => setNewParishName(e.target.value)}
                      placeholder="Tên Giáo Xứ (VD: Giáo Xứ Fatima Bình Triệu)..."
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-800"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newDioceseName}
                        onChange={(e) => setNewDioceseName(e.target.value)}
                        placeholder="Tên Giáo Phận..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newDeaneryName}
                        onChange={(e) => setNewDeaneryName(e.target.value)}
                        placeholder="Tên Giáo Hạt..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Hoàn Tất Tạo Tài Khoản & Vào Hệ Thống
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
