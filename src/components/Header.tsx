import {
  Building2,
  ChevronDown,
  Church,
  Download,
  FileSpreadsheet,
  FolderTree,
  KeyRound,
  LogOut,
  Plus,
  PlusCircle,
  Printer,
  Receipt,
  Settings,
  Shield,
  TrendingDown,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import React, { useState } from 'react';
import { Parish, ParishInfo, UserAccount } from '../types';

interface HeaderProps {
  parishInfo: ParishInfo;
  parishes: Parish[];
  activeParishId: string;
  currentUser: UserAccount | null;
  activeTab: 'journal' | 'reports' | 'charts' | 'funds';
  setActiveTab: (tab: 'journal' | 'reports' | 'charts' | 'funds') => void;
  onOpenNewTransaction: (type: 'income' | 'expense') => void;
  onOpenCategoryManager: () => void;
  onOpenSettings: () => void;
  onExportExcel: () => void;
  onPrintReport: () => void;
  onSwitchParish: (parishId: string) => void;
  onOpenAuthModal: () => void;
  onOpenParishManager: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  parishInfo,
  parishes,
  activeParishId,
  currentUser,
  activeTab,
  setActiveTab,
  onOpenNewTransaction,
  onOpenCategoryManager,
  onOpenSettings,
  onExportExcel,
  onPrintReport,
  onSwitchParish,
  onOpenAuthModal,
  onOpenParishManager,
  onLogout,
}) => {
  const [isParishDropdownOpen, setIsParishDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case 'admin':
        return { label: '👑 Quản Trị Hệ Thống', color: 'bg-amber-500/30 text-amber-300 border-amber-400/50' };
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

  const roleInfo = getRoleDisplay(currentUser?.role);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      {/* Top Banner with Parish & User Info */}
      <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs font-medium tracking-wide flex justify-between items-center border-b border-slate-800">
        {/* Left: Diocese & Parish Quick Switcher */}
        <div className="relative flex items-center space-x-2">
          <Church className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="font-semibold uppercase tracking-wider text-slate-100 hidden sm:inline">
            {parishInfo.dioceseName}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          
          {/* Parish Selector Trigger */}
          <div className="relative">
            <button
              id="btn-parish-dropdown-trigger"
              onClick={() => {
                setIsParishDropdownOpen(!isParishDropdownOpen);
                setIsUserDropdownOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-md border border-slate-700 transition-colors font-bold text-xs"
              title="Đổi Giáo Xứ đang làm việc"
            >
              <span className="truncate max-w-[180px] sm:max-w-[240px] text-blue-300">
                {parishInfo.parishName}
              </span>
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-normal">
                {parishes.length} xứ
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Parish Dropdown Menu */}
            {isParishDropdownOpen && (
              <div
                className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-fadeIn"
                onClick={() => setIsParishDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                  <span>Chuyển Đổi Giáo Xứ</span>
                  <span className="text-blue-600 font-normal">Tổng: {parishes.length}</span>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {parishes.map((p) => {
                    const isSelected = p.id === activeParishId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => onSwitchParish(p.id)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-blue-50/80 font-bold text-blue-700' : 'text-slate-700'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="truncate font-semibold">{p.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{p.dioceseName}</p>
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="pt-1.5 border-t border-slate-100 px-2 space-y-1">
                  <button
                    id="btn-header-open-parish-mgr"
                    onClick={onOpenParishManager}
                    className="w-full py-1.5 px-2.5 text-left text-xs text-blue-600 hover:bg-blue-50 rounded-lg font-semibold flex items-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Quản Lý / Thêm Giáo Xứ Mới &rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: User Account Menu */}
        <div className="relative flex items-center space-x-3 text-xs">
          {currentUser ? (
            <div className="relative">
              <button
                id="btn-user-dropdown-trigger"
                onClick={() => {
                  setIsUserDropdownOpen(!isUserDropdownOpen);
                  setIsParishDropdownOpen(false);
                }}
                className="flex items-center gap-2 hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser.saintName ? currentUser.saintName.charAt(0) : currentUser.fullName.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-slate-100 font-semibold text-xs leading-none">
                    {currentUser.fullName}
                  </span>
                  <span className={`text-[10px] font-medium mt-0.5 px-1.5 py-0.2 rounded border ${roleInfo.color} inline-block w-fit`}>
                    {roleInfo.label}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-fadeIn"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                    <p className="text-[11px] text-slate-500">@{currentUser.username} • {currentUser.email}</p>
                    <span className="mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                      {roleInfo.label}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      id="btn-header-profile"
                      onClick={onOpenAuthModal}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Hồ Sơ & Đổi Tài Khoản</span>
                    </button>
                    <button
                      id="btn-header-parish-manager"
                      onClick={onOpenParishManager}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Danh Sách Giáo Xứ ({parishes.length})</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      id="btn-header-logout"
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng Xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="btn-header-login"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Đăng Nhập / Tạo Tài Khoản</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-lg tracking-tight shrink-0">
            GX
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                {parishInfo.parishName}
              </h1>
              <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                Sổ Thu Chi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Chánh xứ: <strong>{parishInfo.pastorName}</strong> • {parishInfo.dioceseName}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-add-income"
            onClick={() => onOpenNewTransaction('income')}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-xs"
            title="Tạo phiếu thu mới"
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            <span>+ Lập Phiếu Thu</span>
          </button>

          <button
            id="btn-add-expense"
            onClick={() => onOpenNewTransaction('expense')}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-xs"
            title="Tạo phiếu chi mới"
          >
            <TrendingDown className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
            <span>+ Lập Phiếu Chi</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

          <button
            id="btn-export-excel"
            onClick={onExportExcel}
            className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Xuất bảng kê sổ thu chi ra Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          <button
            id="btn-print-report"
            onClick={onPrintReport}
            className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="In ấn báo cáo tài chính"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
            <span>In Báo Cáo</span>
          </button>

          <button
            id="btn-category-mgr"
            onClick={onOpenCategoryManager}
            className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Quản lý mã thu chi, quỹ & giáo khu"
          >
            <FolderTree className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            <span>Mã Thu Chi</span>
          </button>

          <button
            id="btn-parish-manager-trigger"
            onClick={onOpenParishManager}
            className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
            title="Quản lý danh sách các Giáo Xứ"
          >
            <Building2 className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            <span>Giáo Xứ ({parishes.length})</span>
          </button>

          <button
            id="btn-settings"
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
            title="Cài đặt thông tin giáo xứ & Sao lưu"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 border-t border-slate-200">
        <button
          id="tab-journal"
          onClick={() => setActiveTab('journal')}
          className={`py-2.5 px-3.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'journal'
              ? 'border-blue-600 text-blue-600 font-semibold bg-blue-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${activeTab === 'journal' ? 'bg-blue-600' : 'bg-slate-400'}`} />
          <Receipt className="w-3.5 h-3.5" />
          <span>Danh Sách Thu Chi</span>
        </button>

        <button
          id="tab-reports"
          onClick={() => setActiveTab('reports')}
          className={`py-2.5 px-3.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'border-blue-600 text-blue-600 font-semibold bg-blue-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${activeTab === 'reports' ? 'bg-blue-600' : 'bg-slate-400'}`} />
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Báo Cáo Tháng / Năm</span>
        </button>

        <button
          id="tab-charts"
          onClick={() => setActiveTab('charts')}
          className={`py-2.5 px-3.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'charts'
              ? 'border-blue-600 text-blue-600 font-semibold bg-blue-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${activeTab === 'charts' ? 'bg-blue-600' : 'bg-slate-400'}`} />
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Biểu Đồ & Thống Kê</span>
        </button>

        <button
          id="tab-funds"
          onClick={() => setActiveTab('funds')}
          className={`py-2.5 px-3.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'funds'
              ? 'border-blue-600 text-blue-600 font-semibold bg-blue-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${activeTab === 'funds' ? 'bg-blue-600' : 'bg-slate-400'}`} />
          <Church className="w-3.5 h-3.5" />
          <span>Đối Soát & Sổ Quỹ</span>
        </button>
      </div>
    </header>
  );
};
