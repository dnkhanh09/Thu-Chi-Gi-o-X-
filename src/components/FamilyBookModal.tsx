import { BookOpen, Home, MapPin, Phone, Save, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ParishFamily, Parishioner, ParishZone } from '../types';

interface FamilyBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyToEdit?: ParishFamily | null;
  parishZones: ParishZone[];
  parishioners: Parishioner[];
  onSave: (data: Omit<ParishFamily, 'id' | 'createdAt' | 'parishId'>) => void;
}

export const FamilyBookModal: React.FC<FamilyBookModalProps> = ({
  isOpen,
  onClose,
  familyToEdit,
  parishZones,
  parishioners,
  onSave,
}) => {
  const [familyCode, setFamilyCode] = useState('');
  const [headName, setHeadName] = useState('');
  const [headSaintName, setHeadSaintName] = useState('Giuse');
  const [parishZoneId, setParishZoneId] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  useEffect(() => {
    if (familyToEdit) {
      setFamilyCode(familyToEdit.familyCode || '');
      setHeadName(familyToEdit.headName || '');
      setHeadSaintName(familyToEdit.headSaintName || 'Giuse');
      setParishZoneId(familyToEdit.parishZoneId || parishZones[0]?.id || '');
      setAddress(familyToEdit.address || '');
      setPhone(familyToEdit.phone || '');
      setNotes(familyToEdit.notes || '');
      setSelectedMemberIds(familyToEdit.memberIds || []);
    } else {
      const genCode = `GĐ-KHU${Math.floor(Math.random() * 4) + 1}-${String(Math.floor(Math.random() * 900) + 100)}`;
      setFamilyCode(genCode);
      setHeadName('');
      setHeadSaintName('Giuse');
      setParishZoneId(parishZones[0]?.id || '');
      setAddress('');
      setPhone('');
      setNotes('');
      setSelectedMemberIds([]);
    }
  }, [familyToEdit, isOpen, parishZones]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headName.trim()) {
      alert('Vui lòng nhập tên chủ hộ gia đình!');
      return;
    }

    const selectedZone = parishZones.find((z) => z.id === parishZoneId);

    const payload: Omit<ParishFamily, 'id' | 'createdAt' | 'parishId'> = {
      familyCode: familyCode.trim() || `GĐ-${Date.now().toString().slice(-4)}`,
      headName: headName.trim(),
      headSaintName: headSaintName.trim() || 'Giuse',
      parishZoneId,
      parishZoneName: selectedZone?.name || '',
      address: address.trim(),
      phone: phone.trim(),
      memberCount: selectedMemberIds.length,
      memberIds: selectedMemberIds,
      notes: notes.trim(),
    };

    onSave(payload);
    onClose();
  };

  const toggleMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {familyToEdit ? 'Chỉnh Sửa Sổ Gia Đình Công Giáo' : 'Lập Sổ Gia Đình Công Giáo Mới'}
              </h3>
              <p className="text-xs text-slate-400">
                Quản lý thông tin hộ gia đình, chủ hộ và các thành viên trong sổ gia đình
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex-1 space-y-4">
          {/* Row 1: Code & Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mã Số Sổ Gia Đình <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={familyCode}
                onChange={(e) => setFamilyCode(e.target.value)}
                placeholder="VD: GĐ-KHU1-001"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Thuộc Giáo Khu / Họ <span className="text-red-500">*</span>
              </label>
              <select
                value={parishZoneId}
                onChange={(e) => setParishZoneId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {parishZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Head of Family */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên Thánh Chủ Hộ
              </label>
              <input
                type="text"
                required
                value={headSaintName}
                onChange={(e) => setHeadSaintName(e.target.value)}
                placeholder="Giuse, Phêrô..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-blue-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và Tên Chủ Hộ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={headName}
                onChange={(e) => setHeadName(e.target.value)}
                placeholder="Nguyễn Văn Hùng"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold uppercase text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 3: Address & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Địa Chỉ Nhà
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="VD: 124 Hoàng Sa, Q.1"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Điện Thoại Liên Hệ
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="090..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Select Members from Parishioners list */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Chọn Thành Viên Trong Sổ Hộ ({selectedMemberIds.length} người)</span>
              <span className="text-[11px] text-slate-500">Tích chọn để thêm/bớt</span>
            </label>
            <div className="border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-1.5 bg-slate-50">
              {parishioners.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Chưa có dữ liệu giáo dân.</p>
              ) : (
                parishioners.map((p) => {
                  const isChecked = selectedMemberIds.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all border ${
                        isChecked
                          ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-semibold'
                          : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleMember(p.id)}
                          className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500"
                        />
                        <span>
                          <strong className="text-blue-950 font-bold">{p.saintName}</strong> {p.fullName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {p.code} • {p.parishZoneName}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ghi Chú Về Gia Đình
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú về hoàn cảnh, đóng góp của gia đình..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Hủy
            </button>
            <button
              id="btn-save-family"
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{familyToEdit ? 'Lưu Sổ Gia Đình' : 'Tạo Sổ Gia Đình Mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
