import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Church,
  ExternalLink,
  Eye,
  EyeOff,
  FolderPlus,
  Heart,
  KeyRound,
  Lock,
  Mail,
  Plus,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import React, { useState } from 'react';
import { initialUsers } from '../data/initialData';
import { Parish, UserAccount, UserRole } from '../types';

interface AuthViewProps {
  parishes: Parish[];
  onLogin: (
    username: string,
    password?: string,
    targetParishId?: string
  ) => { success: boolean; message: string; user?: UserAccount };
  onQuickLogin: (userId: string, targetParishId?: string) => void;
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
}

export const AuthView: React.FC<AuthViewProps> = ({
  parishes,
  onLogin,
  onQuickLogin,
  onRegisterUser,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
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
  const [newDioceseName, setNewDioceseName] = useState('TỔNG GIÁO PHẬN SÀI GÒN - TP.HCM');
  const [newDeaneryName, setNewDeaneryName] = useState('');
  const [newAddress, setNewAddress] = useState('');

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
    } else {
      setAuthError(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!regFullName.trim() || !regUsername.trim() || !regEmail.trim()) {
      setAuthError('Vui lòng điền đầy đủ Họ tên, Tên đăng nhập và Email!');
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
    } else {
      setAuthError(res.message);
    }
  };

  const roleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: 'Quản Trị Hệ Thống (Toàn Quyền)', color: 'bg-amber-500/20 text-amber-200 border-amber-400/30' };
      case 'pastor':
        return { label: 'Linh Mục Chánh Xứ', color: 'bg-purple-500/20 text-purple-200 border-purple-400/30' };
      case 'accountant':
        return { label: 'Kế Toán Ban Tài Chính', color: 'bg-blue-500/20 text-blue-200 border-blue-400/30' };
      case 'treasurer':
        return { label: 'Thủ Quỹ Ban Tài Chính', color: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' };
      case 'council_leader':
        return { label: 'Ban Hành Giáo', color: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30' };
      default:
        return { label: 'Thành Viên', color: 'bg-slate-500/20 text-slate-200 border-slate-400/30' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Background Subtle Gradient & Accents */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.25),rgba(255,255,255,0))]" />

      {/* Top Brand Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 font-bold">
            <Church className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <span>Hệ Thống Thu Chi Giáo Xứ</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Đa Giáo Xứ
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Quản trị tài chính, sổ quỹ & báo cáo thu chi Công Giáo
            </p>
          </div>
        </div>

        {/* Creator Attribution Badge Top Right */}
        <div className="flex items-center gap-2">
          <a
            href="https://www.Khang.Top"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition-all shadow-xs"
            title="Tác giả phần mềm: DN Khánh"
          >
            <span className="text-[11px] text-slate-400">Tác giả:</span>
            <span className="font-bold text-blue-400 group-hover:text-blue-300">DN Khánh</span>
            <span className="text-slate-500 text-[10px] font-mono">(www.Khang.Top)</span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white ml-0.5" />
          </a>
        </div>
      </header>

      {/* Main Login / Register Center Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-4">
        <div className="bg-slate-900/90 border border-slate-800 shadow-2xl rounded-2xl w-full max-w-xl overflow-hidden backdrop-blur-md">
          {/* Header Banner */}
          <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-slate-800 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-3 shadow-inner">
              <Church className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Đăng Nhập Quản Trị Sổ Thu Chi
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Vui lòng chọn Giáo xứ và đăng nhập để truy cập dữ liệu chứng từ tài chính
            </p>

            {/* Tab Switches */}
            <div className="flex bg-slate-950/70 p-1 rounded-xl border border-slate-800/80 mt-5">
              <button
                id="btn-tab-login"
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
              <button
                id="btn-tab-register"
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tạo Tài Khoản / Thêm Giáo Xứ</span>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Error & Success Messages */}
            {authError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2.5 animate-fadeIn">
                <Shield className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* 1. CHỌN GIÁO XỨ (Mandatory Field) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Chọn Giáo Xứ Đang Làm Việc</span>
                      <span className="text-rose-400">*</span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {parishes.length} giáo xứ trên hệ thống
                    </span>
                  </label>

                  <select
                    id="select-login-parish"
                    value={selectedParishId}
                    onChange={(e) => setSelectedParishId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="all">
                      👑 Toàn Quyền Quản Trị Hệ Thống (DN Khánh / Tất Cả Giáo Xứ)
                    </option>
                    {parishes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.dioceseName} ({p.deaneryName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. TÊN ĐĂNG NHẬP / EMAIL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tên đăng nhập hoặc Email</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="input-login-username"
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="VD: admin, chaxu, ketoan, thuquy hoặc dnkhanh09@gmail.com..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                  />
                </div>

                {/* 3. MẬT KHẨU */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mật khẩu</span>
                      <span className="text-rose-400">*</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Mẫu mặc định: 123
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="input-login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Nhập mật khẩu (mặc định: 123)..."
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="btn-login-submit"
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Đăng Nhập Vào Sổ Thu Chi Giáo Xứ</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* TAB REGISTER & CREATE PARISH */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tên Thánh & Họ Tên <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="input-reg-fullname"
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="VD: Giuse Nguyễn Văn A"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tên Thánh (Bổn Mạng)
                    </label>
                    <input
                      id="input-reg-saintname"
                      type="text"
                      value={regSaintName}
                      onChange={(e) => setRegSaintName(e.target.value)}
                      placeholder="VD: Giuse, Maria, Phêrô..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tên đăng nhập <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="input-reg-username"
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="VD: ketoan_moi, cha_xu..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mật khẩu
                    </label>
                    <input
                      id="input-reg-password"
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="input-reg-email"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="email@giaoxu.vn"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Chức Vụ / Quyền Hạn Trong Xứ
                    </label>
                    <select
                      id="select-reg-role"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-blue-300">
                      Chọn Giáo Xứ Hoạt Động
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Hỗ trợ nhiều giáo xứ độc lập
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-300">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="parishMode"
                        checked={regParishMode === 'existing'}
                        onChange={() => setRegParishMode('existing')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Chọn Giáo xứ có sẵn ({parishes.length})</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="parishMode"
                        checked={regParishMode === 'new'}
                        onChange={() => setRegParishMode('new')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>+ Thêm Giáo xứ mới ngay</span>
                    </label>
                  </div>

                  {regParishMode === 'existing' ? (
                    <div>
                      <select
                        id="select-reg-parish"
                        value={regParishId}
                        onChange={(e) => setRegParishId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        id="input-new-parish-name"
                        type="text"
                        required
                        value={newParishName}
                        onChange={(e) => setNewParishName(e.target.value)}
                        placeholder="Tên Giáo Xứ (VD: Giáo Xứ Fatima Bình Triệu)..."
                        className="w-full px-3 py-2 bg-slate-900 border border-blue-500/40 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-white"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newDioceseName}
                          onChange={(e) => setNewDioceseName(e.target.value)}
                          placeholder="Tên Giáo Phận..."
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={newDeaneryName}
                          onChange={(e) => setNewDeaneryName(e.target.value)}
                          placeholder="Tên Giáo Hạt..."
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Địa chỉ nhà xứ..."
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <button
                  id="btn-register-submit"
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Hoàn Tất Tạo Tài Khoản & Vào Hệ Thống</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer with Creator Attribution */}
      <footer className="relative z-10 border-t border-slate-800/80 py-5 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Church className="w-4 h-4 text-blue-400" />
            <span>Phần Mềm Quản Lý Thu Chi & Tài Chính Giáo Xứ (Công Giáo)</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span>Phát triển & Sáng lập bởi</span>
            <a
              href="https://www.Khang.Top"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-400 hover:text-blue-300 underline underline-offset-2 flex items-center gap-0.5"
            >
              <span>DN Khánh</span>
              <span className="font-normal text-slate-400 text-[11px]">(www.Khang.Top)</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
