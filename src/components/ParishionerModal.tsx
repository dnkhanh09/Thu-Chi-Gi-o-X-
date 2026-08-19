import {
  Award,
  BookOpen,
  Calendar,
  Check,
  Church,
  FileText,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FamilyRole, ParishFamily, Parishioner, ParishionerStatus, ParishZone } from '../types';

const COMMON_SAINT_NAMES = [
  'Giuse',
  'Maria',
  'Phêrô',
  'Phaolô',
  'Anna',
  'Têrêsa',
  'Gioan Baotixita',
  'Anrê',
  'Phanxicô Xaviê',
  'Đaminh',
  'Mácta',
  'Antôn',
  'Têrêsa Hài Đồng Giêsu',
  'Inhaxiô',
  'Luxia',
  'Cêcilia',
  'Tôma',
  'Matthêu',
  'Giacôbê',
  'Vinh Sơn',
  'Micae',
  'Gabriel',
  'Raphael',
  'Tađêô',
  'Báctôlômêô',
];

interface ParishionerModalProps {
  isOpen: boolean;
  onClose: () => void;
  parishionerToEdit?: Parishioner | null;
  parishZones: ParishZone[];
  parishFamilies: ParishFamily[];
  onSave: (data: Omit<Parishioner, 'id' | 'createdAt' | 'parishId'>) => void;
}

export const ParishionerModal: React.FC<ParishionerModalProps> = ({
  isOpen,
  onClose,
  parishionerToEdit,
  parishZones,
  parishFamilies,
  onSave,
}) => {
  const [tab, setTab] = useState<'info' | 'sacraments' | 'family'>('info');

  // Form states
  const [code, setCode] = useState('');
  const [saintName, setSaintName] = useState('Giuse');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [status, setStatus] = useState<ParishionerStatus>('active');
  const [parishZoneId, setParishZoneId] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [familyRole, setFamilyRole] = useState<FamilyRole>('head');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [notes, setNotes] = useState('');

  // Sacraments state
  const [baptismReceived, setBaptismReceived] = useState(true);
  const [baptismDate, setBaptismDate] = useState('');
  const [baptismPlace, setBaptismPlace] = useState('');
  const [baptismMinister, setBaptismMinister] = useState('');
  const [baptismGodparent, setBaptismGodparent] = useState('');
  const [baptismCert, setBaptismCert] = useState('');

  const [communionReceived, setCommunionReceived] = useState(false);
  const [communionDate, setCommunionDate] = useState('');
  const [communionPlace, setCommunionPlace] = useState('');
  const [communionMinister, setCommunionMinister] = useState('');

  const [confirmReceived, setConfirmReceived] = useState(false);
  const [confirmDate, setConfirmDate] = useState('');
  const [confirmPlace, setConfirmPlace] = useState('');
  const [confirmMinister, setConfirmMinister] = useState('');
  const [confirmGodparent, setConfirmGodparent] = useState('');
  const [confirmCert, setConfirmCert] = useState('');

  const [matrimonyReceived, setMatrimonyReceived] = useState(false);
  const [matrimonyDate, setMatrimonyDate] = useState('');
  const [matrimonyPlace, setMatrimonyPlace] = useState('');
  const [matrimonyMinister, setMatrimonyMinister] = useState('');
  const [matrimonySpouseName, setMatrimonySpouseName] = useState('');
  const [matrimonySpouseSaint, setMatrimonySpouseSaint] = useState('Maria');
  const [matrimonyCert, setMatrimonyCert] = useState('');

  // Quick Saint Name filter
  const [saintFilter, setSaintFilter] = useState('');
  const [showSaintSuggestions, setShowSaintSuggestions] = useState(false);

  useEffect(() => {
    if (parishionerToEdit) {
      setCode(parishionerToEdit.code || '');
      setSaintName(parishionerToEdit.saintName || '');
      setFullName(parishionerToEdit.fullName || '');
      setGender(parishionerToEdit.gender || 'male');
      setBirthDate(parishionerToEdit.birthDate || '');
      setBirthPlace(parishionerToEdit.birthPlace || '');
      setPhone(parishionerToEdit.phone || '');
      setEmail(parishionerToEdit.email || '');
      setAddress(parishionerToEdit.address || '');
      setOccupation(parishionerToEdit.occupation || '');
      setStatus(parishionerToEdit.status || 'active');
      setParishZoneId(parishionerToEdit.parishZoneId || parishZones[0]?.id || '');
      setFamilyId(parishionerToEdit.familyId || '');
      setFamilyRole(parishionerToEdit.familyRole || 'head');
      setFatherName(parishionerToEdit.fatherName || '');
      setMotherName(parishionerToEdit.motherName || '');
      setNotes(parishionerToEdit.notes || '');

      // Sacraments
      const s = parishionerToEdit.sacraments || {};
      setBaptismReceived(!!s.baptism?.received);
      setBaptismDate(s.baptism?.date || '');
      setBaptismPlace(s.baptism?.place || '');
      setBaptismMinister(s.baptism?.minister || '');
      setBaptismGodparent(s.baptism?.godparent || '');
      setBaptismCert(s.baptism?.certificateNumber || '');

      setCommunionReceived(!!s.firstCommunion?.received);
      setCommunionDate(s.firstCommunion?.date || '');
      setCommunionPlace(s.firstCommunion?.place || '');
      setCommunionMinister(s.firstCommunion?.minister || '');

      setConfirmReceived(!!s.confirmation?.received);
      setConfirmDate(s.confirmation?.date || '');
      setConfirmPlace(s.confirmation?.place || '');
      setConfirmMinister(s.confirmation?.minister || '');
      setConfirmGodparent(s.confirmation?.godparent || '');
      setConfirmCert(s.confirmation?.certificateNumber || '');

      setMatrimonyReceived(!!s.matrimony?.received);
      setMatrimonyDate(s.matrimony?.date || '');
      setMatrimonyPlace(s.matrimony?.place || '');
      setMatrimonyMinister(s.matrimony?.minister || '');
      setMatrimonySpouseName(s.matrimony?.spouseName || '');
      setMatrimonySpouseSaint(s.matrimony?.spouseSaintName || 'Maria');
      setMatrimonyCert(s.matrimony?.certificateNumber || '');
    } else {
      // Default new
      const genCode = `GD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
      setCode(genCode);
      setSaintName('Giuse');
      setFullName('');
      setGender('male');
      setBirthDate('1995-01-01');
      setBirthPlace('');
      setPhone('');
      setEmail('');
      setAddress('');
      setOccupation('');
      setStatus('active');
      setParishZoneId(parishZones[0]?.id || '');
      setFamilyId('');
      setFamilyRole('head');
      setFatherName('');
      setMotherName('');
      setNotes('');

      // Sacraments
      setBaptismReceived(true);
      setBaptismDate('');
      setBaptismPlace('');
      setBaptismMinister('');
      setBaptismGodparent('');
      setBaptismCert('');

      setCommunionReceived(false);
      setCommunionDate('');
      setCommunionPlace('');
      setCommunionMinister('');

      setConfirmReceived(false);
      setConfirmDate('');
      setConfirmPlace('');
      setConfirmMinister('');
      setConfirmGodparent('');
      setConfirmCert('');

      setMatrimonyReceived(false);
      setMatrimonyDate('');
      setMatrimonyPlace('');
      setMatrimonyMinister('');
      setMatrimonySpouseName('');
      setMatrimonySpouseSaint('Maria');
      setMatrimonyCert('');
    }
  }, [parishionerToEdit, isOpen, parishZones]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Vui lòng nhập họ và tên giáo dân!');
      return;
    }

    const selectedZone = parishZones.find((z) => z.id === parishZoneId);
    const selectedFamily = parishFamilies.find((f) => f.id === familyId);

    const payload: Omit<Parishioner, 'id' | 'createdAt' | 'parishId'> = {
      code: code.trim() || `GD-${Date.now().toString().slice(-4)}`,
      saintName: saintName.trim() || 'Giuse',
      fullName: fullName.trim(),
      gender,
      birthDate,
      birthPlace,
      phone,
      email,
      address: address || selectedFamily?.address || '',
      occupation,
      status,
      parishZoneId,
      parishZoneName: selectedZone?.name || '',
      familyId: familyId || undefined,
      familyCode: selectedFamily?.familyCode || undefined,
      familyRole,
      fatherName,
      motherName,
      notes,
      sacraments: {
        baptism: baptismReceived
          ? {
              received: true,
              date: baptismDate,
              place: baptismPlace,
              minister: baptismMinister,
              godparent: baptismGodparent,
              certificateNumber: baptismCert,
            }
          : undefined,
        firstCommunion: communionReceived
          ? {
              received: true,
              date: communionDate,
              place: communionPlace,
              minister: communionMinister,
            }
          : undefined,
        confirmation: confirmReceived
          ? {
              received: true,
              date: confirmDate,
              place: confirmPlace,
              minister: confirmMinister,
              godparent: confirmGodparent,
              certificateNumber: confirmCert,
            }
          : undefined,
        matrimony: matrimonyReceived
          ? {
              received: true,
              date: matrimonyDate,
              place: matrimonyPlace,
              minister: matrimonyMinister,
              spouseName: matrimonySpouseName,
              spouseSaintName: matrimonySpouseSaint,
              certificateNumber: matrimonyCert,
            }
          : undefined,
      },
    };

    onSave(payload);
    onClose();
  };

  const filteredSaints = COMMON_SAINT_NAMES.filter((s) =>
    s.toLowerCase().includes(saintName.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {parishionerToEdit ? 'Chỉnh Sửa Hồ Sơ Giáo Dân' : 'Thêm Giáo Dân Mới Vào Sổ'}
              </h3>
              <p className="text-xs text-slate-400">
                Quản lý nhân khẩu giáo dân, các bí tích và liên kết hộ gia đình
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            type="button"
            onClick={() => setTab('info')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              tab === 'info'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Thông Tin Cá Nhân
          </button>
          <button
            type="button"
            onClick={() => setTab('sacraments')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              tab === 'sacraments'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Các Bí Tích
          </button>
          <button
            type="button"
            onClick={() => setTab('family')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              tab === 'family'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Gia Đình & Giáo Khu
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex-1 space-y-4">
          {tab === 'info' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Row 1: Code & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã Giáo Dân <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="VD: GD-2026-001"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tình Trạng Cư Trú
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ParishionerStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="active">Thường trú (Chính thức)</option>
                    <option value="temporary">Tạm trú (Sinh hoạt tạm)</option>
                    <option value="moved">Đã chuyển xứ</option>
                    <option value="deceased">Đã qua đời (Về nhà Cha)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Saint Name & Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Tên Thánh</span>
                    <span className="text-[10px] text-blue-600 font-normal">Gợi ý nhanh</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={saintName}
                    onFocus={() => setShowSaintSuggestions(true)}
                    onChange={(e) => {
                      setSaintName(e.target.value);
                      setShowSaintSuggestions(true);
                    }}
                    placeholder="VD: Giuse, Maria..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-blue-900 focus:ring-2 focus:ring-blue-500"
                  />
                  {showSaintSuggestions && filteredSaints.length > 0 && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 max-h-36 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg p-1 grid grid-cols-2 gap-1 text-xs">
                      {filteredSaints.slice(0, 12).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setSaintName(s);
                            setShowSaintSuggestions(false);
                          }}
                          className="px-2 py-1 text-left rounded-md hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-medium truncate"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn Hùng"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold uppercase text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 3: Gender, Birth Date, Birth Place */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Giới Tính</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        gender === 'male'
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                          : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Nam
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        gender === 'female'
                          ? 'bg-pink-50 border-pink-600 text-pink-700 shadow-xs'
                          : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Nữ
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ngày Sinh</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nơi Sinh</label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    placeholder="VD: Sài Gòn, Đồng Nai..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 4: Phone, Email, Occupation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số Điện Thoại</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="090..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nghề Nghiệp</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="VD: Kỹ sư, Bác sĩ, Học sinh..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 5: Parents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên Thánh & Họ Tên Cha
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="VD: Phêrô Nguyễn Văn Thành"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên Thánh & Họ Tên Mẹ
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="VD: Maria Trần Thị Mai"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi Chú / Chức Vụ Giáo Xứ
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú về ban ngành đoàn thể, ca đoàn, giáo lý viên, giúp lễ..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {tab === 'sacraments' && (
            <div className="space-y-4 animate-fadeIn">
              {/* 1. RỬA TỘI */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-blue-900">
                    <input
                      type="checkbox"
                      checked={baptismReceived}
                      onChange={(e) => setBaptismReceived(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500"
                    />
                    <span>1. Bí Tích Rửa Tội (Thánh Tẩy)</span>
                  </label>
                  <span className="text-[10px] text-blue-700 font-semibold uppercase">Căn bản</span>
                </div>

                {baptismReceived && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Ngày Rửa Tội
                      </label>
                      <input
                        type="date"
                        value={baptismDate}
                        onChange={(e) => setBaptismDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nơi Rửa Tội (Giáo Xứ)
                      </label>
                      <input
                        type="text"
                        value={baptismPlace}
                        onChange={(e) => setBaptismPlace(e.target.value)}
                        placeholder="VD: Giáo Xứ Tân Định"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Linh Mục Rửa Tội
                      </label>
                      <input
                        type="text"
                        value={baptismMinister}
                        onChange={(e) => setBaptismMinister(e.target.value)}
                        placeholder="Lm. Giuse..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Người Đỡ Đầu
                      </label>
                      <input
                        type="text"
                        value={baptismGodparent}
                        onChange={(e) => setBaptismGodparent(e.target.value)}
                        placeholder="Tên Thánh & Họ Tên..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Số Vào Sổ Bí Tích
                      </label>
                      <input
                        type="text"
                        value={baptismCert}
                        onChange={(e) => setBaptismCert(e.target.value)}
                        placeholder="VD: RT-1995-012"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. RƯỚC LỄ LẦN ĐẦU */}
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-amber-900">
                    <input
                      type="checkbox"
                      checked={communionReceived}
                      onChange={(e) => setCommunionReceived(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded-md focus:ring-amber-500"
                    />
                    <span>2. Bí Tích Thánh Thể (Xưng Tội & Rước Lễ Lần Đầu)</span>
                  </label>
                </div>

                {communionReceived && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Ngày Rước Lễ
                      </label>
                      <input
                        type="date"
                        value={communionDate}
                        onChange={(e) => setCommunionDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nơi Nhận
                      </label>
                      <input
                        type="text"
                        value={communionPlace}
                        onChange={(e) => setCommunionPlace(e.target.value)}
                        placeholder="Giáo xứ..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Linh Mục
                      </label>
                      <input
                        type="text"
                        value={communionMinister}
                        onChange={(e) => setCommunionMinister(e.target.value)}
                        placeholder="Lm. ..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. THÊM SỨC */}
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-indigo-900">
                    <input
                      type="checkbox"
                      checked={confirmReceived}
                      onChange={(e) => setConfirmReceived(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
                    />
                    <span>3. Bí Tích Thêm Sức</span>
                  </label>
                </div>

                {confirmReceived && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Ngày Thêm Sức
                      </label>
                      <input
                        type="date"
                        value={confirmDate}
                        onChange={(e) => setConfirmDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nơi Nhận
                      </label>
                      <input
                        type="text"
                        value={confirmPlace}
                        onChange={(e) => setConfirmPlace(e.target.value)}
                        placeholder="Giáo xứ..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Đấng Ban Bí Tích (Đức Giám Mục)
                      </label>
                      <input
                        type="text"
                        value={confirmMinister}
                        onChange={(e) => setConfirmMinister(e.target.value)}
                        placeholder="Đức Cha..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Người Đỡ Đầu
                      </label>
                      <input
                        type="text"
                        value={confirmGodparent}
                        onChange={(e) => setConfirmGodparent(e.target.value)}
                        placeholder="Tên Thánh & Họ Tên..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Số Vào Sổ
                      </label>
                      <input
                        type="text"
                        value={confirmCert}
                        onChange={(e) => setConfirmCert(e.target.value)}
                        placeholder="VD: TS-2005-045"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. HÔN PHỐI */}
              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-rose-900">
                    <input
                      type="checkbox"
                      checked={matrimonyReceived}
                      onChange={(e) => setMatrimonyReceived(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded-md focus:ring-rose-500"
                    />
                    <span>4. Bí Tích Hôn Phối (Thành Hôn)</span>
                  </label>
                </div>

                {matrimonyReceived && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Ngày Kết Hôn
                      </label>
                      <input
                        type="date"
                        value={matrimonyDate}
                        onChange={(e) => setMatrimonyDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Tên Thánh Phối Ngẫu
                      </label>
                      <input
                        type="text"
                        value={matrimonySpouseSaint}
                        onChange={(e) => setMatrimonySpouseSaint(e.target.value)}
                        placeholder="Maria, Giuse..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Họ Tên Phối Ngẫu
                      </label>
                      <input
                        type="text"
                        value={matrimonySpouseName}
                        onChange={(e) => setMatrimonySpouseName(e.target.value)}
                        placeholder="Họ và tên vợ/chồng..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nơi Kết Hôn (Giáo Xứ)
                      </label>
                      <input
                        type="text"
                        value={matrimonyPlace}
                        onChange={(e) => setMatrimonyPlace(e.target.value)}
                        placeholder="Giáo xứ..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Linh Mục Chứng Hôn
                      </label>
                      <input
                        type="text"
                        value={matrimonyMinister}
                        onChange={(e) => setMatrimonyMinister(e.target.value)}
                        placeholder="Lm. ..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Số Sổ Hôn Phối
                      </label>
                      <input
                        type="text"
                        value={matrimonyCert}
                        onChange={(e) => setMatrimonyCert(e.target.value)}
                        placeholder="VD: HP-2015-008"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'family' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Parish Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thuộc Giáo Khu / Giáo Họ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={parishZoneId}
                    onChange={(e) => setParishZoneId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {parishZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} {z.leaderName ? `(Trưởng: ${z.leaderName})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Liên Kết Sổ Gia Đình Công Giáo
                  </label>
                  <select
                    value={familyId}
                    onChange={(e) => setFamilyId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Chưa liên kết sổ gia đình --</option>
                    {parishFamilies.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.familyCode} - Hộ: {f.headSaintName} {f.headName} ({f.parishZoneName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Family Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vai Trò Trong Gia Đình
                  </label>
                  <select
                    value={familyRole}
                    onChange={(e) => setFamilyRole(e.target.value as FamilyRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="head">Chủ hộ (Gia trưởng)</option>
                    <option value="spouse">Vợ / Chồng</option>
                    <option value="child">Con</option>
                    <option value="parent">Cha / Mẹ</option>
                    <option value="other">Thành viên khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Địa Chỉ Cư Trú
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="VD: 124 Hoàng Sa, P. Đa Kao, Q.1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

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
              id="btn-save-parishioner"
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{parishionerToEdit ? 'Lưu Thay Đổi' : 'Thêm Vào Sổ Giáo Dân'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
