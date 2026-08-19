import {
  FolderPlus,
  FolderTree,
  Landmark,
  Pencil,
  PiggyBank,
  Plus,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { Category, CategoryGroup, Fund, ParishZone, TransactionType } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  categoryGroups: CategoryGroup[];
  funds: Fund[];
  parishZones: ParishZone[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (id: string, category: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
  onAddFund: (fund: Omit<Fund, 'id'>) => void;
  onUpdateFund: (id: string, fund: Partial<Fund>) => void;
  onDeleteFund: (id: string) => void;
  onAddParishZone: (zone: Omit<ParishZone, 'id'>) => void;
  onUpdateParishZone: (id: string, zone: Partial<ParishZone>) => void;
  onDeleteParishZone: (id: string) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  categoryGroups,
  funds,
  parishZones,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddFund,
  onUpdateFund,
  onDeleteFund,
  onAddParishZone,
  onUpdateParishZone,
  onDeleteParishZone,
}) => {
  const [activeTab, setActiveTab] = useState<'income_cat' | 'expense_cat' | 'funds' | 'zones'>('income_cat');

  // New Category State
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatGroup, setNewCatGroup] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // New Fund State
  const [newFundName, setNewFundName] = useState('');
  const [newFundCode, setNewFundCode] = useState('');
  const [newFundBalance, setNewFundBalance] = useState<number | ''>('');
  const [newFundDesc, setNewFundDesc] = useState('');

  // New Zone State
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneLeader, setNewZoneLeader] = useState('');

  if (!isOpen) return null;

  const handleAddCategorySubmit = (type: TransactionType) => {
    if (!newCatCode.trim() || !newCatName.trim() || !newCatGroup) {
      alert('Vui lòng nhập đầy đủ mã, tên mục và nhóm mục đích');
      return;
    }
    onAddCategory({
      code: newCatCode.trim().toUpperCase(),
      name: newCatName.trim(),
      type,
      group: newCatGroup,
      description: newCatDesc.trim(),
    });
    setNewCatCode('');
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleAddFundSubmit = () => {
    if (!newFundName.trim() || !newFundCode.trim()) {
      alert('Vui lòng nhập tên quỹ và mã quỹ');
      return;
    }
    onAddFund({
      name: newFundName.trim(),
      code: newFundCode.trim().toUpperCase(),
      initialBalance: Number(newFundBalance) || 0,
      description: newFundDesc.trim(),
    });
    setNewFundName('');
    setNewFundCode('');
    setNewFundBalance('');
    setNewFundDesc('');
  };

  const handleAddZoneSubmit = () => {
    if (!newZoneName.trim()) {
      alert('Vui lòng nhập tên giáo khu / giáo họ');
      return;
    }
    onAddParishZone({
      name: newZoneName.trim(),
      leader: newZoneLeader.trim(),
    });
    setNewZoneName('');
    setNewZoneLeader('');
  };

  const incomeCategories = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeGroups = categoryGroups.filter((g) => g.type === 'income');
  const expenseGroups = categoryGroups.filter((g) => g.type === 'expense');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Quản Lý Danh Mục, Mã Thu Chi & Quỹ Giáo Xứ
              </h3>
              <p className="text-xs text-slate-400">
                Tùy chỉnh các mã mục thu, mục chi, quỹ tiền tệ và danh sách giáo khu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 text-xs font-semibold gap-2">
          <button
            onClick={() => {
              setActiveTab('income_cat');
              setNewCatGroup(incomeGroups[0]?.name || '');
            }}
            className={`py-2.5 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'income_cat'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-lg font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Mã Mục Thu ({incomeCategories.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('expense_cat');
              setNewCatGroup(expenseGroups[0]?.name || '');
            }}
            className={`py-2.5 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'expense_cat'
                ? 'border-rose-600 text-rose-700 bg-white rounded-t-lg font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>Mã Mục Chi ({expenseCategories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('funds')}
            className={`py-2.5 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'funds'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5 text-blue-600" />
            <span>Quỹ Tiền Tệ ({funds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('zones')}
            className={`py-2.5 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'zones'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Giáo Khu / Họ ({parishZones.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* TAB 1: MÃ MỤC THU */}
          {activeTab === 'income_cat' && (
            <div className="space-y-6">
              {/* Form thêm mã thu mới */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FolderPlus className="w-4 h-4 text-emerald-600" />
                  <span>Thêm Mã & Mục Thu Mới</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mã Thu (Code)</label>
                    <input
                      type="text"
                      placeholder="THU-LE03, THU-KEN..."
                      value={newCatCode}
                      onChange={(e) => setNewCatCode(e.target.value)}
                      className="w-full bg-white px-2.5 py-1.5 font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Tên Mục Thu</label>
                    <input
                      type="text"
                      placeholder="Thu tiền hoa viên thánh đường..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full bg-white px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Thuộc Nhóm Mục</label>
                    <select
                      value={newCatGroup || incomeGroups[0]?.name}
                      onChange={(e) => setNewCatGroup(e.target.value)}
                      className="w-full bg-white px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {incomeGroups.map((g) => (
                        <option key={g.id} value={g.name}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => handleAddCategorySubmit('income')}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Mục Thu</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Danh sách mã thu */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-28">Mã Số</th>
                      <th className="py-2.5 px-3">Tên Mục Thu</th>
                      <th className="py-2.5 px-3">Nhóm Mục Đích</th>
                      <th className="py-2.5 px-3">Mô Tả Chi Tiết</th>
                      <th className="py-2.5 px-3 text-center w-16">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {incomeCategories.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                          {c.code}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{c.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{c.group}</td>
                        <td className="py-2.5 px-3 text-slate-500 italic text-[11px]">
                          {c.description || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa mã ${c.code} không?`)) {
                                onDeleteCategory(c.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: MÃ MỤC CHI */}
          {activeTab === 'expense_cat' && (
            <div className="space-y-6">
              {/* Form thêm mã chi mới */}
              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200">
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FolderPlus className="w-4 h-4 text-rose-600" />
                  <span>Thêm Mã & Mục Chi Mới</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mã Chi (Code)</label>
                    <input
                      type="text"
                      placeholder="CHI-PL04, CHI-AMTHANH..."
                      value={newCatCode}
                      onChange={(e) => setNewCatCode(e.target.value)}
                      className="w-full bg-white px-2.5 py-1.5 font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Tên Mục Chi</label>
                    <input
                      type="text"
                      placeholder="Sửa chữa hệ thống chuông thánh đường..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full bg-white px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Thuộc Nhóm Mục</label>
                    <select
                      value={newCatGroup || expenseGroups[0]?.name}
                      onChange={(e) => setNewCatGroup(e.target.value)}
                      className="w-full bg-white px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {expenseGroups.map((g) => (
                        <option key={g.id} value={g.name}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => handleAddCategorySubmit('expense')}
                      className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Mục Chi</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Danh sách mã chi */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-28">Mã Số</th>
                      <th className="py-2.5 px-3">Tên Mục Chi</th>
                      <th className="py-2.5 px-3">Nhóm Mục Đích</th>
                      <th className="py-2.5 px-3">Mô Tả Chi Tiết</th>
                      <th className="py-2.5 px-3 text-center w-16">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expenseCategories.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-mono font-bold text-rose-700">{c.code}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{c.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{c.group}</td>
                        <td className="py-2.5 px-3 text-slate-500 italic text-[11px]">
                          {c.description || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa mã ${c.code} không?`)) {
                                onDeleteCategory(c.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: QUỸ TIỀN TỆ */}
          {activeTab === 'funds' && (
            <div className="space-y-6">
              {/* Form thêm quỹ */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <PiggyBank className="w-4 h-4 text-blue-600" />
                  <span>Tạo Quỹ Tiền Tệ Mới Cho Giáo Xứ</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mã Quỹ</label>
                    <input
                      type="text"
                      placeholder="QUY-MAIAM, QUY-DAT..."
                      value={newFundCode}
                      onChange={(e) => setNewFundCode(e.target.value)}
                      className="w-full bg-white px-2.5 py-1.5 font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Tên Quỹ</label>
                    <input
                      type="text"
                      placeholder="Quỹ Mái Ấm Tình Thương..."
                      value={newFundName}
                      onChange={(e) => setNewFundName(e.target.value)}
                      className="w-full bg-white px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Số Dư Ban Đầu (VNĐ)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newFundBalance}
                      onChange={(e) =>
                        setNewFundBalance(e.target.value ? Number(e.target.value) : '')
                      }
                      className="w-full bg-white px-2.5 py-1.5 font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddFundSubmit}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Quỹ</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Danh sách các quỹ */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Tên Quỹ Tiền Tệ</th>
                      <th className="py-2.5 px-3 w-28">Mã Quỹ</th>
                      <th className="py-2.5 px-3 text-right">Số Dư Ban Đầu</th>
                      <th className="py-2.5 px-3">Ghi Chú Mục Đích</th>
                      <th className="py-2.5 px-3 text-center w-16">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {funds.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{f.name}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                          {f.code}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(f.initialBalance)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 italic text-[11px]">
                          {f.description || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa quỹ ${f.name} không?`)) {
                                onDeleteFund(f.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: GIÁO KHU / HỌ */}
          {activeTab === 'zones' && (
            <div className="space-y-6">
              {/* Form thêm khu họ */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Thêm Giáo Khu / Giáo Họ / Đoàn Thể</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Tên Giáo Khu / Họ</label>
                    <input
                      type="text"
                      placeholder="Giáo khu Thánh Máctinô (Khu 5)..."
                      value={newZoneName}
                      onChange={(e) => setNewZoneName(e.target.value)}
                      className="w-full bg-white px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Trưởng Khu / Phụ Trách</label>
                    <input
                      type="text"
                      placeholder="Ông Giuse Nguyễn Văn B..."
                      value={newZoneLeader}
                      onChange={(e) => setNewZoneLeader(e.target.value)}
                      className="w-full bg-white px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddZoneSubmit}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Giáo Khu</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Danh sách giáo khu */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Tên Giáo Khu / Giáo Họ</th>
                      <th className="py-2.5 px-3">Trưởng Khu / Đại Diện</th>
                      <th className="py-2.5 px-3 text-center w-16">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parishZones.map((z) => (
                      <tr key={z.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{z.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{z.leader || '-'}</td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa ${z.name} không?`)) {
                                onDeleteParishZone(z.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            Đóng Cửa Sổ
          </button>
        </div>
      </div>
    </div>
  );
};
