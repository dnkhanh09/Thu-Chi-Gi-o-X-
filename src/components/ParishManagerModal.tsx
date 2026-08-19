import {
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Church,
  Edit2,
  FolderPlus,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { Parish, UserAccount } from '../types';

interface ParishManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  parishes: Parish[];
  activeParishId: string;
  currentUser: UserAccount | null;
  onSwitchParish: (parishId: string) => void;
  onCreateParish: (parishData: Omit<Parish, 'id' | 'createdAt'>) => Parish;
  onUpdateParish: (parishId: string, data: Partial<Parish>) => void;
  onDeleteParish: (parishId: string) => void;
}

export const ParishManagerModal: React.FC<ParishManagerModalProps> = ({
  isOpen,
  onClose,
  parishes,
  activeParishId,
  currentUser,
  onSwitchParish,
  onCreateParish,
  onUpdateParish,
  onDeleteParish,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingParishId, setEditingParishId] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [dioceseName, setDioceseName] = useState('');
  const [deaneryName, setDeaneryName] = useState('');
  const [address, setAddress] = useState('');
  const [pastorName, setPastorName] = useState('');
  const [committeeLeaderName, setCommitteeLeaderName] = useState('');
  const [accountantName, setAccountantName] = useState('');
  const [treasurerName, setTreasurerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleOpenCreate = () => {
    setCode(`GX-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    setName('');
    setDioceseName('TỔNG GIÁO PHẬN SÀI GÒN - TP.HCM');
    setDeaneryName('Giáo Hạt Tân Định');
    setAddress('');
    setPastorName(currentUser?.role === 'pastor' ? currentUser.fullName : 'Lm. ');
    setCommitteeLeaderName('Ông ');
    setAccountantName(currentUser?.role === 'accountant' ? currentUser.fullName : 'Bà ');
    setTreasurerName('Ông ');
    setPhone('');
    setEmail('');
    setEstablishedYear(`${new Date().getFullYear()}`);
    setDescription('');
    setViewMode('create');
  };

  const handleOpenEdit = (parish: Parish) => {
    setEditingParishId(parish.id);
    setCode(parish.code);
    setName(parish.name);
    setDioceseName(parish.dioceseName);
    setDeaneryName(parish.deaneryName);
    setAddress(parish.address);
    setPastorName(parish.pastorName);
    setCommitteeLeaderName(parish.committeeLeaderName);
    setAccountantName(parish.accountantName);
    setTreasurerName(parish.treasurerName);
    setPhone(parish.phone);
    setEmail(parish.email);
    setEstablishedYear(parish.establishedYear || '');
    setDescription(parish.description || '');
    setViewMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (viewMode === 'create') {
      const created = onCreateParish({
        code: code.trim() || `GX-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        name: name.trim(),
        dioceseName: dioceseName.trim(),
        deaneryName: deaneryName.trim(),
        address: address.trim(),
        pastorName: pastorName.trim(),
        committeeLeaderName: committeeLeaderName.trim(),
        accountantName: accountantName.trim(),
        treasurerName: treasurerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        establishedYear: establishedYear.trim(),
        description: description.trim(),
      });
      onSwitchParish(created.id);
      setViewMode('list');
    } else if (viewMode === 'edit' && editingParishId) {
      onUpdateParish(editingParishId, {
        code: code.trim(),
        name: name.trim(),
        dioceseName: dioceseName.trim(),
        deaneryName: deaneryName.trim(),
        address: address.trim(),
        pastorName: pastorName.trim(),
        committeeLeaderName: committeeLeaderName.trim(),
        accountantName: accountantName.trim(),
        treasurerName: treasurerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        establishedYear: establishedYear.trim(),
        description: description.trim(),
      });
      setViewMode('list');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Quản Lý Danh Sách Các Giáo Xứ
              </h2>
              <p className="text-xs text-slate-400">
                Hệ thống hỗ trợ nhiều Giáo xứ hoạt động độc lập trên cùng nền tảng
              </p>
            </div>
          </div>
          <button
            id="btn-close-parish-manager"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {viewMode === 'list' ? (
            <div className="space-y-4">
              {/* Top Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Danh Sách Giáo Xứ Trên Hệ Thống ({parishes.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chọn một giáo xứ để chuyển đổi sổ sách thu chi ngay lập tức
                  </p>
                </div>
                <button
                  id="btn-open-create-parish"
                  type="button"
                  onClick={handleOpenCreate}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>+ Thêm Giáo Xứ Mới</span>
                </button>
              </div>

              {/* Parish Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parishes.map((p) => {
                  const isActive = p.id === activeParishId;
                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isActive
                          ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                            }`}>
                              <Church className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                {p.name}
                              </h4>
                              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                                {p.dioceseName}
                              </p>
                            </div>
                          </div>
                          {isActive && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Đang chọn
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 space-y-1 my-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <p className="flex items-center gap-1.5 truncate">
                            <span className="text-slate-400 font-normal">Hạt:</span>
                            <span className="font-medium text-slate-800">{p.deaneryName || 'Chưa cập nhật'}</span>
                          </p>
                          <p className="flex items-center gap-1.5 truncate">
                            <span className="text-slate-400 font-normal">Chánh xứ:</span>
                            <span className="font-semibold text-slate-900">{p.pastorName}</span>
                          </p>
                          <p className="flex items-center gap-1.5 truncate">
                            <span className="text-slate-400 font-normal">Kế toán:</span>
                            <span className="font-medium text-slate-800">{p.accountantName}</span>
                          </p>
                          {p.address && (
                            <p className="flex items-center gap-1.5 truncate text-[11px] text-slate-500">
                              <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                              <span className="truncate">{p.address}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            id={`btn-edit-parish-${p.id}`}
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs transition-colors"
                            title="Sửa thông tin giáo xứ"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {parishes.length > 1 && (
                            <button
                              id={`btn-delete-parish-${p.id}`}
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Bạn có chắc chắn muốn xóa "${p.name}" khỏi hệ thống?`)) {
                                  onDeleteParish(p.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs transition-colors"
                              title="Xóa giáo xứ này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {!isActive ? (
                          <button
                            id={`btn-select-parish-${p.id}`}
                            type="button"
                            onClick={() => {
                              onSwitchParish(p.id);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                          >
                            <span>Chọn Giáo Xứ Này</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-blue-700">
                            Sổ sách đang kích hoạt
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* CREATE / EDIT FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Church className="w-4 h-4 text-blue-600" />
                  {viewMode === 'create' ? 'Tạo Giáo Xứ Mới' : `Chỉnh Sửa: ${name}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  &larr; Quay lại danh sách
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên Giáo Xứ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-parish-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Giáo Xứ Đức Mẹ Vô Nhiễm"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã Giáo Xứ
                  </label>
                  <input
                    id="input-parish-code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="VD: GX-VONHIEM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thuộc Giáo Phận
                  </label>
                  <input
                    id="input-parish-diocese"
                    type="text"
                    value={dioceseName}
                    onChange={(e) => setDioceseName(e.target.value)}
                    placeholder="VD: GIÁO PHẬN XUÂN LỘC"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Thuộc Giáo Hạt
                  </label>
                  <input
                    id="input-parish-deanery"
                    type="text"
                    value={deaneryName}
                    onChange={(e) => setDeaneryName(e.target.value)}
                    placeholder="VD: Giáo Hạt Long Thành"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa Chỉ Nhà Xứ / Thánh Đường
                </label>
                <input
                  id="input-parish-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, đường, xã/phường, quận/huyện, tỉnh..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Ban Hành Giáo Section */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  Ban Điều Hành & Ký Duyệt Thu Chi
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Linh Mục Chánh Xứ / Quản Xứ
                    </label>
                    <input
                      id="input-parish-pastor"
                      type="text"
                      value={pastorName}
                      onChange={(e) => setPastorName(e.target.value)}
                      placeholder="Lm. Giuse..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Trưởng Ban Hành Giáo
                    </label>
                    <input
                      id="input-parish-leader"
                      type="text"
                      value={committeeLeaderName}
                      onChange={(e) => setCommitteeLeaderName(e.target.value)}
                      placeholder="Ông Gioan B..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Kế Toán Ban Tài Chính
                    </label>
                    <input
                      id="input-parish-accountant"
                      type="text"
                      value={accountantName}
                      onChange={(e) => setAccountantName(e.target.value)}
                      placeholder="Bà Maria..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Thủ Quỹ Ban Tài Chính
                    </label>
                    <input
                      id="input-parish-treasurer"
                      type="text"
                      value={treasurerName}
                      onChange={(e) => setTreasurerName(e.target.value)}
                      placeholder="Ông Phêrô..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số Điện Thoại Nhà Xứ
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="028.3888.xxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Liên Hệ
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="giaoxu@gmail.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Năm Thành Lập
                  </label>
                  <input
                    type="text"
                    value={establishedYear}
                    onChange={(e) => setEstablishedYear(e.target.value)}
                    placeholder="1975"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {viewMode === 'create' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Khi tạo mới, hệ thống sẽ tự động cấu hình các Quỹ thu chi chuẩn (Quỹ Phổ Thông, Quỹ Xây Dựng, Quỹ Caritas Bác Ái) và 20+ mã danh mục thu/chi cho Giáo xứ này.
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  id="btn-save-parish-form"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{viewMode === 'create' ? 'Tạo Giáo Xứ Ngay' : 'Lưu Thay Đổi'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
