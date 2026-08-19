import {
  Calendar,
  Filter,
  Layers,
  PiggyBank,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react';
import React from 'react';
import { Category, CategoryGroup, FilterState, Fund, ParishZone } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categoryGroups: CategoryGroup[];
  categories: Category[];
  funds: Fund[];
  parishZones: ParishZone[];
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  categoryGroups,
  categories,
  funds,
  parishZones,
  totalResults,
}) => {
  const years = [2027, 2026, 2025, 2024, 2023];

  const handleResetFilters = () => {
    const d = new Date();
    setFilters({
      timeMode: 'month',
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      quarter: Math.ceil((d.getMonth() + 1) / 3),
      startDate: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`,
      endDate: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-31`,
      type: 'all',
      categoryGroupId: 'all',
      categoryId: 'all',
      fundId: 'all',
      parishZoneId: 'all',
      searchQuery: '',
    });
  };

  // Filtered categories based on selected group or type
  const availableCategories = categories.filter((c) => {
    if (filters.type !== 'all' && c.type !== filters.type) return false;
    if (filters.categoryGroupId !== 'all' && c.group !== filters.categoryGroupId) return false;
    return true;
  });

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3.5 no-print">
      {/* Top Filter Controls: Time Presets & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-slate-100">
        {/* Time Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, timeMode: 'month' }))}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filters.timeMode === 'month'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Theo Tháng
          </button>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, timeMode: 'quarter' }))}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filters.timeMode === 'quarter'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Theo Quý
          </button>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, timeMode: 'year' }))}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filters.timeMode === 'year'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Theo Năm
          </button>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, timeMode: 'custom' }))}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filters.timeMode === 'custom'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Khoảng Ngày Tùy Chọn
          </button>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, timeMode: 'all' }))}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filters.timeMode === 'all'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất Cả Thời Gian
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo số phiếu, người nộp/nhận, mã thu chi..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Second Row: Specific Time & Category Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 items-center text-xs">
        {/* Dynamic Time controls */}
        {filters.timeMode === 'month' && (
          <>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tháng</label>
              <select
                value={filters.month}
                onChange={(e) => setFilters((prev) => ({ ...prev, month: Number(e.target.value) }))}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Năm</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters((prev) => ({ ...prev, year: Number(e.target.value) }))}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {filters.timeMode === 'quarter' && (
          <>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Quý</label>
              <select
                value={filters.quarter}
                onChange={(e) => setFilters((prev) => ({ ...prev, quarter: Number(e.target.value) }))}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value={1}>Quý I (T1-T3)</option>
                <option value={2}>Quý II (T4-T6)</option>
                <option value={3}>Quý III (T7-T9)</option>
                <option value={4}>Quý IV (T10-T12)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Năm</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters((prev) => ({ ...prev, year: Number(e.target.value) }))}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {filters.timeMode === 'year' && (
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Chọn Năm</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters((prev) => ({ ...prev, year: Number(e.target.value) }))}
              className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  Cả năm {y}
                </option>
              ))}
            </select>
          </div>
        )}

        {filters.timeMode === 'custom' && (
          <>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>
          </>
        )}

        {/* Filter Type: Thu / Chi */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Loại Thu / Chi
          </label>
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                type: e.target.value as 'all' | 'income' | 'expense',
                categoryId: 'all',
              }))
            }
            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
          >
            <option value="all">Tất cả (Thu & Chi)</option>
            <option value="income">🟢 Chỉ Khoản Thu</option>
            <option value="expense">🔴 Chỉ Khoản Chi</option>
          </select>
        </div>

        {/* Category Group */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" />
            Nhóm Mục Đích
          </label>
          <select
            value={filters.categoryGroupId}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                categoryGroupId: e.target.value,
                categoryId: 'all',
              }))
            }
            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="all">Tất cả các nhóm mục</option>
            {categoryGroups
              .filter((g) => filters.type === 'all' || g.type === filters.type)
              .map((g) => (
                <option key={g.id} value={g.name}>
                  {g.type === 'income' ? '[Thu]' : '[Chi]'} {g.name}
                </option>
              ))}
          </select>
        </div>

        {/* Specific Category */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">Mã / Mục Cụ Thể</label>
          <select
            value={filters.categoryId}
            onChange={(e) => setFilters((prev) => ({ ...prev, categoryId: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium truncate"
          >
            <option value="all">Tất cả các mục ({availableCategories.length})</option>
            {availableCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fund Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <PiggyBank className="w-3 h-3 text-slate-400" />
            Quỹ Tiền Tệ
          </label>
          <select
            value={filters.fundId}
            onChange={(e) => setFilters((prev) => ({ ...prev, fundId: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium truncate"
          >
            <option value="all">Tất cả các quỹ</option>
            {funds.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Parish Zone Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            Giáo Khu / Họ
          </label>
          <select
            value={filters.parishZoneId}
            onChange={(e) => setFilters((prev) => ({ ...prev, parishZoneId: e.target.value }))}
            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium truncate"
          >
            <option value="all">Tất cả khu họ</option>
            {parishZones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter summary status & reset */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div>
          Hiển thị: <strong className="text-slate-900">{totalResults}</strong> giao dịch phù hợp
        </div>
        <button
          onClick={handleResetFilters}
          className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors"
        >
          <RefreshCw className="w-3 h-3 mr-1 text-slate-400" />
          Đặt lại bộ lọc mặc định
        </button>
      </div>
    </div>
  );
};
