import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Church,
  Download,
  Edit2,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Heart,
  Home,
  MapPin,
  MoreVertical,
  Phone,
  Plus,
  Printer,
  Search,
  Sparkles,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  ParishFamily,
  ParishInfo,
  Parishioner,
  ParishionerStatus,
  ParishZone,
} from '../types';
import { FamilyBookModal } from './FamilyBookModal';
import { ParishionerModal } from './ParishionerModal';
import { SacramentExtractModal } from './SacramentExtractModal';

interface ParishionerManagerViewProps {
  parishioners: Parishioner[];
  parishFamilies: ParishFamily[];
  parishZones: ParishZone[];
  parishInfo: ParishInfo;
  onAddParishioner: (data: Omit<Parishioner, 'id' | 'createdAt' | 'parishId'>) => void;
  onUpdateParishioner: (id: string, data: Partial<Parishioner>) => void;
  onDeleteParishioner: (id: string) => void;
  onBatchDeleteParishioners: (ids: string[]) => void;
  onAddParishFamily: (data: Omit<ParishFamily, 'id' | 'createdAt' | 'parishId'>) => void;
  onUpdateParishFamily: (id: string, data: Partial<ParishFamily>) => void;
  onDeleteParishFamily: (id: string) => void;
}

export const ParishionerManagerView: React.FC<ParishionerManagerViewProps> = ({
  parishioners,
  parishFamilies,
  parishZones,
  parishInfo,
  onAddParishioner,
  onUpdateParishioner,
  onDeleteParishioner,
  onBatchDeleteParishioners,
  onAddParishFamily,
  onUpdateParishFamily,
  onDeleteParishFamily,
}) => {
  const [subTab, setSubTab] = useState<'list' | 'families' | 'stats'>('list');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSacrament, setSelectedSacrament] = useState<string>('all');

  // Selection for batch actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isParishionerModalOpen, setIsParishionerModalOpen] = useState(false);
  const [editingParishioner, setEditingParishioner] = useState<Parishioner | null>(null);

  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<ParishFamily | null>(null);

  const [isExtractModalOpen, setIsExtractModalOpen] = useState(false);
  const [extractParishioner, setExtractParishioner] = useState<Parishioner | null>(null);

  // Filtered Parishioners
  const filteredParishioners = useMemo(() => {
    return parishioners.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          p.code.toLowerCase().includes(q) ||
          p.saintName.toLowerCase().includes(q) ||
          p.fullName.toLowerCase().includes(q) ||
          (p.phone && p.phone.includes(q)) ||
          (p.address && p.address.toLowerCase().includes(q)) ||
          (p.parishZoneName && p.parishZoneName.toLowerCase().includes(q)) ||
          (p.fatherName && p.fatherName.toLowerCase().includes(q)) ||
          (p.motherName && p.motherName.toLowerCase().includes(q)) ||
          (p.familyCode && p.familyCode.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // 2. Zone
      if (selectedZone !== 'all' && p.parishZoneId !== selectedZone) return false;

      // 3. Gender
      if (selectedGender !== 'all' && p.gender !== selectedGender) return false;

      // 4. Status
      if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;

      // 5. Sacrament
      if (selectedSacrament !== 'all') {
        if (selectedSacrament === 'baptism' && !p.sacraments?.baptism?.received) return false;
        if (selectedSacrament === 'communion' && !p.sacraments?.firstCommunion?.received) return false;
        if (selectedSacrament === 'confirmation' && !p.sacraments?.confirmation?.received) return false;
        if (selectedSacrament === 'matrimony' && !p.sacraments?.matrimony?.received) return false;
      }

      return true;
    });
  }, [parishioners, searchQuery, selectedZone, selectedGender, selectedStatus, selectedSacrament]);

  // Statistics
  const stats = useMemo(() => {
    const total = parishioners.length;
    const male = parishioners.filter((p) => p.gender === 'male').length;
    const female = parishioners.filter((p) => p.gender === 'female').length;
    const active = parishioners.filter((p) => p.status === 'active').length;
    const temporary = parishioners.filter((p) => p.status === 'temporary').length;
    const familiesCount = parishFamilies.length;

    const baptismCount = parishioners.filter((p) => p.sacraments?.baptism?.received).length;
    const communionCount = parishioners.filter((p) => p.sacraments?.firstCommunion?.received).length;
    const confirmCount = parishioners.filter((p) => p.sacraments?.confirmation?.received).length;
    const matrimonyCount = parishioners.filter((p) => p.sacraments?.matrimony?.received).length;

    // Age groups
    const nowYear = new Date().getFullYear();
    let children = 0; // 0-14
    let youth = 0; // 15-30
    let adult = 0; // 31-59
    let senior = 0; // 60+

    parishioners.forEach((p) => {
      if (p.birthDate) {
        const bYear = parseInt(p.birthDate.split('-')[0], 10);
        const age = nowYear - bYear;
        if (age <= 14) children++;
        else if (age <= 30) youth++;
        else if (age <= 59) adult++;
        else senior++;
      }
    });

    return {
      total,
      male,
      female,
      active,
      temporary,
      familiesCount,
      baptismCount,
      communionCount,
      confirmCount,
      matrimonyCount,
      ageGroups: { children, youth, adult, senior },
    };
  }, [parishioners, parishFamilies]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredParishioners.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa ${selectedIds.length} hồ sơ giáo dân đã chọn không? Thao tác này không thể hoàn tác!`
      )
    ) {
      onBatchDeleteParishioners(selectedIds);
      setSelectedIds([]);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Mã GD',
      'Tên Thánh',
      'Họ và Tên',
      'Giới Tính',
      'Ngày Sinh',
      'Giáo Khu',
      'Mã Sổ Gia Đình',
      'Vai Trò',
      'Số Điện Thoại',
      'Địa Chỉ',
      'Tình Trạng',
      'Rửa Tội',
      'Thêm Sức',
      'Hôn Phối',
    ];

    const rows = filteredParishioners.map((p) => [
      `"${p.code}"`,
      `"${p.saintName}"`,
      `"${p.fullName}"`,
      `"${p.gender === 'male' ? 'Nam' : 'Nữ'}"`,
      `"${p.birthDate || ''}"`,
      `"${p.parishZoneName || ''}"`,
      `"${p.familyCode || ''}"`,
      `"${p.familyRole || ''}"`,
      `"${p.phone || ''}"`,
      `"${p.address || ''}"`,
      `"${p.status}"`,
      `"${p.sacraments?.baptism?.received ? 'Đã nhận' : 'Chưa'}"`,
      `"${p.sacraments?.confirmation?.received ? 'Đã nhận' : 'Chưa'}"`,
      `"${p.sacraments?.matrimony?.received ? 'Đã nhận' : 'Chưa'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Danh_Sach_Giao_Dan_${parishInfo.parishName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (st: ParishionerStatus) => {
    switch (st) {
      case 'active':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Thường Trú
          </span>
        );
      case 'temporary':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Tạm Trú
          </span>
        );
      case 'moved':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Đã Chuyển Xứ
          </span>
        );
      case 'deceased':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800 border border-slate-300">
            Đã Qua Đời ✝
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleLabel = (r?: string) => {
    switch (r) {
      case 'head':
        return 'Chủ hộ';
      case 'spouse':
        return 'Vợ/Chồng';
      case 'child':
        return 'Con';
      case 'parent':
        return 'Cha/Mẹ';
      default:
        return 'Thành viên';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-bold uppercase tracking-wider">
              {parishInfo.parishName}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Hệ Thống Quản Lý Giáo Dân & Sổ Gia Đình Công Giáo
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Quản lý cơ sở dữ liệu nhân danh giáo dân, theo dõi các bí tích (Rửa tội, Rước lễ, Thêm
            sức, Hôn phối), lập sổ gia đình Công giáo và trích lục văn khố chính thức.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-add-parishioner-top"
            onClick={() => {
              setEditingParishioner(null);
              setIsParishionerModalOpen(true);
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Giáo Dân Mới</span>
          </button>
          <button
            id="btn-add-family-top"
            onClick={() => {
              setEditingFamily(null);
              setIsFamilyModalOpen(true);
            }}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Lập Sổ Gia Đình</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tổng Giáo Dân
          </p>
          <p className="text-xl font-bold text-slate-900 mt-1">{stats.total.toLocaleString()} <span className="text-xs font-normal text-slate-500">người</span></p>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
            <span>Nam: <strong>{stats.male}</strong></span>
            <span>•</span>
            <span>Nữ: <strong>{stats.female}</strong></span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Sổ Hộ Gia Đình
          </p>
          <p className="text-xl font-bold text-blue-900 mt-1">{stats.familiesCount} <span className="text-xs font-normal text-slate-500">hộ</span></p>
          <p className="text-[10px] text-slate-500 mt-1">Đã cấp sổ gia đình</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            Đã Rửa Tội
          </p>
          <p className="text-xl font-bold text-slate-900 mt-1">{stats.baptismCount} <span className="text-xs font-normal text-slate-500">({Math.round((stats.baptismCount / (stats.total || 1)) * 100)}%)</span></p>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">Bí tích khai tâm</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Rước Lễ Lần Đầu
          </p>
          <p className="text-xl font-bold text-slate-900 mt-1">{stats.communionCount} <span className="text-xs font-normal text-slate-500">người</span></p>
          <p className="text-[10px] text-slate-500 mt-1">Bí tích Thánh Thể</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            Đã Thêm Sức
          </p>
          <p className="text-xl font-bold text-slate-900 mt-1">{stats.confirmCount} <span className="text-xs font-normal text-slate-500">người</span></p>
          <p className="text-[10px] text-slate-500 mt-1">Trưởng thành đức tin</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            Đã Hôn Phối
          </p>
          <p className="text-xl font-bold text-slate-900 mt-1">{stats.matrimonyCount} <span className="text-xs font-normal text-slate-500">người</span></p>
          <p className="text-[10px] text-slate-500 mt-1">Thành hôn Công giáo</p>
        </div>
      </div>

      {/* Sub Tab Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 rounded-xl shadow-xs">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setSubTab('list')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Danh Sách Giáo Dân ({filteredParishioners.length})</span>
          </button>

          <button
            onClick={() => setSubTab('families')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'families'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Sổ Gia Đình Công Giáo ({parishFamilies.length})</span>
          </button>

          <button
            onClick={() => setSubTab('stats')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              subTab === 'stats'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Thống Kê & Báo Cáo Dân Số</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'list' && (
            <>
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Xuất Excel/CSV</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer no-print"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Danh Sách</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* TAB 1: PARISHIONER LIST */}
      {subTab === 'list' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tên thánh, họ tên, mã GD, SĐT, cha mẹ..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Zone Filter */}
              <div>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="all">Tất cả Giáo Khu / Họ</option>
                  {parishZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sacrament Filter */}
              <div>
                <select
                  value={selectedSacrament}
                  onChange={(e) => setSelectedSacrament(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="all">Tất cả Bí Tích</option>
                  <option value="baptism">Đã Rửa Tội</option>
                  <option value="communion">Đã Rước Lễ</option>
                  <option value="confirmation">Đã Thêm Sức</option>
                  <option value="matrimony">Đã Hôn Phối</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="all">Tất cả Tình Trạng</option>
                  <option value="active">Thường Trú</option>
                  <option value="temporary">Tạm Trú</option>
                  <option value="moved">Đã Chuyển Xứ</option>
                  <option value="deceased">Đã Qua Đời</option>
                </select>
              </div>
            </div>

            {/* Batch Action Bar */}
            {selectedIds.length > 0 && (
              <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-xs animate-fadeIn">
                <span className="font-bold text-blue-900">
                  Đã chọn <strong>{selectedIds.length}</strong> giáo dân
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedIds([])}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-semibold border border-slate-200"
                  >
                    Bỏ chọn
                  </button>
                  <button
                    onClick={handleBatchDelete}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa {selectedIds.length} hồ sơ</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredParishioners.length > 0 &&
                          selectedIds.length === filteredParishioners.length
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500"
                      />
                    </th>
                    <th className="p-3.5">Mã GD</th>
                    <th className="p-3.5">Tên Thánh & Họ Tên</th>
                    <th className="p-3.5">Giới Tính / Tuổi</th>
                    <th className="p-3.5">Giáo Khu / Họ</th>
                    <th className="p-3.5">Sổ Gia Đình / Vai Trò</th>
                    <th className="p-3.5">Các Bí Tích</th>
                    <th className="p-3.5">Liên Hệ</th>
                    <th className="p-3.5">Tình Trạng</th>
                    <th className="p-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredParishioners.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="font-semibold text-xs text-slate-600">
                          Không tìm thấy hồ sơ giáo dân phù hợp
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Thử thay đổi bộ lọc hoặc thêm giáo dân mới vào sổ.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredParishioners.map((p) => {
                      const isSelected = selectedIds.includes(p.id);
                      const birthYear = p.birthDate ? parseInt(p.birthDate.split('-')[0], 10) : null;
                      const age = birthYear ? new Date().getFullYear() - birthYear : null;

                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-blue-50/40 transition-colors ${
                            isSelected ? 'bg-blue-50/60' : ''
                          }`}
                        >
                          <td className="p-3.5 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectOne(p.id)}
                              className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-500 text-[11px]">
                            {p.code}
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span className="text-blue-900">{p.saintName}</span>
                              <span className="uppercase">{p.fullName}</span>
                            </div>
                            {p.occupation && (
                              <p className="text-[10px] text-slate-500">{p.occupation}</p>
                            )}
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  p.gender === 'male'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-pink-50 text-pink-700 border border-pink-200'
                                }`}
                              >
                                {p.gender === 'male' ? 'Nam' : 'Nữ'}
                              </span>
                              {age !== null && (
                                <span className="text-slate-600 text-[11px] font-medium">
                                  {age} tuổi
                                </span>
                              )}
                            </div>
                            {p.birthDate && (
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {p.birthDate.split('-').reverse().join('/')}
                              </p>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-slate-800">
                              {p.parishZoneName || 'Chưa phân khu'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            {p.familyCode ? (
                              <div>
                                <span className="font-mono font-semibold text-blue-800 text-[11px]">
                                  {p.familyCode}
                                </span>
                                <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 font-medium">
                                  {getRoleLabel(p.familyRole)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">Chưa vào sổ hộ</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1">
                              {p.sacraments?.baptism?.received && (
                                <span
                                  title={`Rửa tội: ${p.sacraments.baptism.date || ''}`}
                                  className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[9px] font-bold"
                                >
                                  RT
                                </span>
                              )}
                              {p.sacraments?.firstCommunion?.received && (
                                <span
                                  title={`Rước lễ: ${p.sacraments.firstCommunion.date || ''}`}
                                  className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[9px] font-bold"
                                >
                                  RL
                                </span>
                              )}
                              {p.sacraments?.confirmation?.received && (
                                <span
                                  title={`Thêm sức: ${p.sacraments.confirmation.date || ''}`}
                                  className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded text-[9px] font-bold"
                                >
                                  TS
                                </span>
                              )}
                              {p.sacraments?.matrimony?.received && (
                                <span
                                  title={`Hôn phối: ${p.sacraments.matrimony.date || ''}`}
                                  className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded text-[9px] font-bold"
                                >
                                  HP
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5">
                            {p.phone && (
                              <p className="font-mono text-[11px] text-slate-700">{p.phone}</p>
                            )}
                            {p.address && (
                              <p className="text-[10px] text-slate-400 truncate max-w-[140px]" title={p.address}>
                                {p.address}
                              </p>
                            )}
                          </td>
                          <td className="p-3.5">{getStatusBadge(p.status)}</td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Print sacrament extract */}
                              <button
                                title="In Trích Lục Bí Tích"
                                onClick={() => {
                                  setExtractParishioner(p);
                                  setIsExtractModalOpen(true);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Award className="w-4 h-4" />
                              </button>

                              {/* Edit */}
                              <button
                                title="Chỉnh sửa hồ sơ"
                                onClick={() => {
                                  setEditingParishioner(p);
                                  setIsParishionerModalOpen(true);
                                }}
                                className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                title="Xóa giáo dân"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Bạn có chắc muốn xóa giáo dân "${p.saintName} ${p.fullName}" khỏi sổ?`
                                    )
                                  ) {
                                    onDeleteParishioner(p.id);
                                  }
                                }}
                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PARISH FAMILIES */}
      {subTab === 'families' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Danh Sách Sổ Hộ Gia Đình Công Giáo ({parishFamilies.length} Hộ)
            </h3>
            <button
              onClick={() => {
                setEditingFamily(null);
                setIsFamilyModalOpen(true);
              }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Lập Sổ Gia Đình Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parishFamilies.length === 0 ? (
              <div className="col-span-full p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
                <Home className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="font-semibold text-xs text-slate-600">Chưa có sổ gia đình nào</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Nhấn "Lập Sổ Gia Đình Mới" để tạo sổ hộ cho các gia đình trong giáo xứ.
                </p>
              </div>
            ) : (
              parishFamilies.map((f) => {
                const members = parishioners.filter((p) => f.memberIds.includes(p.id));

                return (
                  <div
                    key={f.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Family Header */}
                      <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-mono text-[10px] font-bold">
                            {f.familyCode}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-1.5">
                            Hộ: <span className="text-blue-900">{f.headSaintName}</span> {f.headName}
                          </h4>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Church className="w-3 h-3 text-slate-400" />
                            {f.parishZoneName}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            title="Sửa sổ gia đình"
                            onClick={() => {
                              setEditingFamily(f);
                              setIsFamilyModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            title="Xóa sổ gia đình"
                            onClick={() => {
                              if (
                                confirm(`Bạn có chắc muốn xóa sổ gia đình "${f.familyCode}" không?`)
                              ) {
                                onDeleteParishFamily(f.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Contact & Address */}
                      <div className="text-xs text-slate-600 space-y-1">
                        {f.address && (
                          <p className="flex items-start gap-1.5 text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{f.address}</span>
                          </p>
                        )}
                        {f.phone && (
                          <p className="flex items-center gap-1.5 text-[11px]">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono">{f.phone}</span>
                          </p>
                        )}
                      </div>

                      {/* Member list in family */}
                      <div className="pt-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Thành viên trong sổ ({members.length} người)
                        </p>
                        <div className="space-y-1">
                          {members.map((m) => (
                            <div
                              key={m.id}
                              className="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg text-xs"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-blue-950 text-[11px]">
                                  {m.saintName}
                                </span>
                                <span className="text-slate-800 text-[11px]">{m.fullName}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-medium">
                                {getRoleLabel(m.familyRole)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {f.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-3 pt-2 border-t border-slate-100">
                        {f.notes}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STATS & DEMOGRAPHICS */}
      {subTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* By Parish Zones */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Church className="w-4 h-4 text-blue-600" />
                <span>Phân Bổ Giáo Dân Theo Giáo Khu / Giáo Họ</span>
              </h4>

              <div className="space-y-3">
                {parishZones.map((z) => {
                  const countInZone = parishioners.filter((p) => p.parishZoneId === z.id).length;
                  const percent = stats.total > 0 ? (countInZone / stats.total) * 100 : 0;

                  return (
                    <div key={z.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-800">{z.name}</span>
                        <span className="font-bold text-slate-900">
                          {countInZone} người ({Math.round(percent)}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Age Groups & Sacraments */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Cơ Cấu Độ Tuổi & Tình Trạng Bí Tích</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <p className="text-[11px] font-bold text-blue-900">Thiếu Nhi (0 - 14t)</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {stats.ageGroups.children} <span className="text-xs font-normal text-slate-500">em</span>
                  </p>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <p className="text-[11px] font-bold text-emerald-900">Giới Trẻ (15 - 30t)</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {stats.ageGroups.youth} <span className="text-xs font-normal text-slate-500">bạn</span>
                  </p>
                </div>
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <p className="text-[11px] font-bold text-indigo-900">Trưởng Thành (31 - 59t)</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {stats.ageGroups.adult} <span className="text-xs font-normal text-slate-500">người</span>
                  </p>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                  <p className="text-[11px] font-bold text-amber-900">Cao Niên (60t trở lên)</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {stats.ageGroups.senior} <span className="text-xs font-normal text-slate-500">cụ</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-700">Tỷ lệ hoàn tất các Bí tích:</p>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Bí tích Rửa Tội:</span>
                    <strong>
                      {stats.baptismCount}/{stats.total} (
                      {Math.round((stats.baptismCount / (stats.total || 1)) * 100)}%)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Bí tích Thêm Sức:</span>
                    <strong>
                      {stats.confirmCount}/{stats.total} (
                      {Math.round((stats.confirmCount / (stats.total || 1)) * 100)}%)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Bí tích Hôn Phối:</span>
                    <strong>{stats.matrimonyCount} người</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ParishionerModal
        isOpen={isParishionerModalOpen}
        onClose={() => {
          setIsParishionerModalOpen(false);
          setEditingParishioner(null);
        }}
        parishionerToEdit={editingParishioner}
        parishZones={parishZones}
        parishFamilies={parishFamilies}
        onSave={(data) => {
          if (editingParishioner) {
            onUpdateParishioner(editingParishioner.id, data);
          } else {
            onAddParishioner(data);
          }
        }}
      />

      <FamilyBookModal
        isOpen={isFamilyModalOpen}
        onClose={() => {
          setIsFamilyModalOpen(false);
          setEditingFamily(null);
        }}
        familyToEdit={editingFamily}
        parishZones={parishZones}
        parishioners={parishioners}
        onSave={(data) => {
          if (editingFamily) {
            onUpdateParishFamily(editingFamily.id, data);
          } else {
            onAddParishFamily(data);
          }
        }}
      />

      <SacramentExtractModal
        isOpen={isExtractModalOpen}
        onClose={() => {
          setIsExtractModalOpen(false);
          setExtractParishioner(null);
        }}
        parishioner={extractParishioner}
        parishInfo={parishInfo}
      />
    </div>
  );
};
