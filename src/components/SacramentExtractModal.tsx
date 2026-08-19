import {
  Award,
  CheckCircle2,
  Church,
  Download,
  FileText,
  Heart,
  Printer,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { ParishInfo, Parishioner } from '../types';

interface SacramentExtractModalProps {
  isOpen: boolean;
  onClose: () => void;
  parishioner: Parishioner | null;
  parishInfo: ParishInfo;
}

export const SacramentExtractModal: React.FC<SacramentExtractModalProps> = ({
  isOpen,
  onClose,
  parishioner,
  parishInfo,
}) => {
  const [extractType, setExtractType] = useState<'all' | 'baptism' | 'confirmation' | 'matrimony'>(
    'all'
  );

  if (!isOpen || !parishioner) return null;

  const handlePrint = () => {
    window.print();
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} tuổi`;
  };

  const formatDate = (dStr?: string) => {
    if (!dStr) return '...';
    try {
      const [y, m, d] = dStr.split('-');
      return `ngày ${d} tháng ${m} năm ${y}`;
    } catch {
      return dStr;
    }
  };

  const formatShortDate = (dStr?: string) => {
    if (!dStr) return '—';
    try {
      const [y, m, d] = dStr.split('-');
      return `${d}/${m}/${y}`;
    } catch {
      return dStr;
    }
  };

  const currentDate = new Date();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Header - Hidden on Print */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 no-print">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Chứng Nhận & Trích Lục Bí Tích
              </h3>
              <p className="text-xs text-slate-400">
                In giấy chứng nhận các bí tích Công Giáo chính thức của Giáo xứ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-print-sacrament-extract"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Bản Giấy</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Type Selector - Hidden on Print */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border-b border-slate-200 text-xs no-print">
          <span className="font-semibold text-slate-600">Loại văn bản:</span>
          <button
            onClick={() => setExtractType('all')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              extractType === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Trích Lục Toàn Bộ Bí Tích
          </button>
          <button
            onClick={() => setExtractType('baptism')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              extractType === 'baptism'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Bí Tích Rửa Tội
          </button>
          <button
            onClick={() => setExtractType('confirmation')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              extractType === 'confirmation'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Bí Tích Thêm Sức
          </button>
          <button
            onClick={() => setExtractType('matrimony')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              extractType === 'matrimony'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Bí Tích Hôn Phối
          </button>
        </div>

        {/* Printable Document Area */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white text-slate-900 font-serif printable-content">
          <div className="border-4 border-double border-slate-800 p-8 sm:p-10 rounded-sm relative">
            {/* Top Church Heading */}
            <div className="flex justify-between items-start border-b border-slate-300 pb-4 mb-6">
              <div className="text-left font-sans">
                <div className="text-xs uppercase font-bold tracking-wider text-slate-600">
                  {parishInfo.dioceseName}
                </div>
                <div className="text-xs uppercase font-semibold text-slate-500">
                  GIÁO HẠT {parishInfo.deaneryName}
                </div>
                <div className="text-base uppercase font-bold text-blue-900 mt-1">
                  {parishInfo.parishName}
                </div>
                <div className="text-[11px] text-slate-500 font-serif italic mt-0.5">
                  ĐC: {parishInfo.address}
                </div>
              </div>

              <div className="text-right font-sans">
                <div className="text-[11px] text-slate-500">
                  Mã Giáo Dân: <strong>{parishioner.code}</strong>
                </div>
                <div className="text-[11px] text-slate-500">
                  Giáo Khu: <strong>{parishioner.parishZoneName}</strong>
                </div>
                {parishioner.familyCode && (
                  <div className="text-[11px] text-slate-500">
                    Sổ Gia Đình: <strong>{parishioner.familyCode}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center my-6 space-y-1">
              <div className="text-xs uppercase tracking-widest font-sans font-semibold text-slate-500">
                TÒA TỔNG GIÁM MỤC / VĂN PHÒNG NHÀ XỨ
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-slate-900 pt-1">
                {extractType === 'all' && 'BẢN TRÍCH LỤC CÁC BÍ TÍCH'}
                {extractType === 'baptism' && 'CHỨNG NHẬN BÍ TÍCH RỬA TỘI'}
                {extractType === 'confirmation' && 'CHỨNG NHẬN BÍ TÍCH THÊM SỨC'}
                {extractType === 'matrimony' && 'CHỨNG NHẬN BÍ TÍCH HÔN PHỐI'}
              </h2>
              <p className="text-xs italic text-slate-500 font-serif">
                (Trích lục từ sổ lưu giữ văn khố Giáo Xứ {parishInfo.parishName})
              </p>
            </div>

            {/* Personal Information */}
            <div className="space-y-3.5 my-6 text-sm text-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-dashed border-slate-200">
                <div>
                  <span className="text-slate-500 italic">Tên Thánh: </span>
                  <strong className="text-base text-blue-950 font-bold ml-1">
                    {parishioner.saintName}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 italic">Họ và tên: </span>
                  <strong className="text-base text-slate-950 font-bold uppercase ml-1">
                    {parishioner.fullName}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2 border-b border-dashed border-slate-200">
                <div>
                  <span className="text-slate-500 italic">Giới tính: </span>
                  <strong className="ml-1">{parishioner.gender === 'male' ? 'Nam' : 'Nữ'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 italic">Sinh ngày: </span>
                  <strong className="ml-1">{formatShortDate(parishioner.birthDate)}</strong>
                </div>
                <div>
                  <span className="text-slate-500 italic">Nơi sinh: </span>
                  <strong className="ml-1">{parishioner.birthPlace || 'Tại gia'}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-dashed border-slate-200">
                <div>
                  <span className="text-slate-500 italic">Họ tên Cha: </span>
                  <strong className="ml-1">{parishioner.fatherName || '—'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 italic">Họ tên Mẹ: </span>
                  <strong className="ml-1">{parishioner.motherName || '—'}</strong>
                </div>
              </div>

              <div>
                <span className="text-slate-500 italic">Địa chỉ thường trú: </span>
                <span className="ml-1">{parishioner.address || 'Thuộc Giáo xứ'}</span>
              </div>
            </div>

            {/* SACRAMENT DETAILS */}
            <div className="my-6 space-y-4">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-blue-900 border-b border-slate-400 pb-1 flex items-center gap-1.5">
                <span>Chi Tiết Các Bí Tích Đã Lãnh Nhận</span>
              </h4>

              {/* 1. RỬA TỘI */}
              {(extractType === 'all' || extractType === 'baptism') && (
                <div className="p-3.5 bg-slate-50/80 rounded-sm border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-sans">
                    <span className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1">
                      <span>1. BÍ TÍCH RỬA TỘI (Rửa Tội / Thánh Tẩy)</span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Số sổ: <strong>{parishioner.sacraments?.baptism?.certificateNumber || '—'}</strong>
                    </span>
                  </div>
                  {parishioner.sacraments?.baptism?.received ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                      <div>
                        - Lãnh nhận ngày:{' '}
                        <strong>{formatDate(parishioner.sacraments.baptism.date)}</strong>
                      </div>
                      <div>
                        - Tại:{' '}
                        <strong>{parishioner.sacraments.baptism.place || parishInfo.parishName}</strong>
                      </div>
                      <div>
                        - Người cử hành:{' '}
                        <strong>{parishioner.sacraments.baptism.minister || parishInfo.pastorName}</strong>
                      </div>
                      <div>
                        - Người đỡ đầu:{' '}
                        <strong>{parishioner.sacraments.baptism.godparent || '—'}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="italic text-slate-500">Chưa ghi nhận trong sổ bí tích</div>
                  )}
                </div>
              )}

              {/* 2. RƯỚC LỄ LẦN ĐẦU */}
              {extractType === 'all' && (
                <div className="p-3.5 bg-slate-50/80 rounded-sm border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-sans">
                    <span className="font-bold text-slate-900 uppercase text-[11px]">
                      2. BÍ TÍCH THÁNH THỂ (Xưng Tội & Rước Lễ Lần Đầu)
                    </span>
                  </div>
                  {parishioner.sacraments?.firstCommunion?.received ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                      <div>
                        - Lãnh nhận ngày:{' '}
                        <strong>{formatDate(parishioner.sacraments.firstCommunion.date)}</strong>
                      </div>
                      <div>
                        - Tại:{' '}
                        <strong>{parishioner.sacraments.firstCommunion.place || parishInfo.parishName}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="italic text-slate-500">Chưa ghi nhận trong sổ bí tích</div>
                  )}
                </div>
              )}

              {/* 3. THÊM SỨC */}
              {(extractType === 'all' || extractType === 'confirmation') && (
                <div className="p-3.5 bg-slate-50/80 rounded-sm border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-sans">
                    <span className="font-bold text-slate-900 uppercase text-[11px]">
                      3. BÍ TÍCH THÊM SỨC
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Số sổ: <strong>{parishioner.sacraments?.confirmation?.certificateNumber || '—'}</strong>
                    </span>
                  </div>
                  {parishioner.sacraments?.confirmation?.received ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                      <div>
                        - Lãnh nhận ngày:{' '}
                        <strong>{formatDate(parishioner.sacraments.confirmation.date)}</strong>
                      </div>
                      <div>
                        - Tại:{' '}
                        <strong>{parishioner.sacraments.confirmation.place || parishInfo.parishName}</strong>
                      </div>
                      <div>
                        - Đấng ban bí tích:{' '}
                        <strong>{parishioner.sacraments.confirmation.minister || 'Đức Giám Mục Giáo Phận'}</strong>
                      </div>
                      <div>
                        - Người đỡ đầu:{' '}
                        <strong>{parishioner.sacraments.confirmation.godparent || '—'}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="italic text-slate-500">Chưa ghi nhận trong sổ bí tích</div>
                  )}
                </div>
              )}

              {/* 4. HÔN PHỐI */}
              {(extractType === 'all' || extractType === 'matrimony') && (
                <div className="p-3.5 bg-slate-50/80 rounded-sm border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-sans">
                    <span className="font-bold text-slate-900 uppercase text-[11px]">
                      4. BÍ TÍCH HÔN PHỐI
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Số sổ: <strong>{parishioner.sacraments?.matrimony?.certificateNumber || '—'}</strong>
                    </span>
                  </div>
                  {parishioner.sacraments?.matrimony?.received ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                      <div>
                        - Kết hôn ngày:{' '}
                        <strong>{formatDate(parishioner.sacraments.matrimony.date)}</strong>
                      </div>
                      <div>
                        - Tại:{' '}
                        <strong>{parishioner.sacraments.matrimony.place || parishInfo.parishName}</strong>
                      </div>
                      <div>
                        - Với:{' '}
                        <strong className="text-blue-900">
                          {parishioner.sacraments.matrimony.spouseSaintName}{' '}
                          {parishioner.sacraments.matrimony.spouseName}
                        </strong>
                      </div>
                      <div>
                        - Linh mục chứng hôn:{' '}
                        <strong>{parishioner.sacraments.matrimony.minister || parishInfo.pastorName}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="italic text-slate-500">Chưa thành hôn (hoặc Độc thân)</div>
                  )}
                </div>
              )}
            </div>

            {/* Date & Signature Section */}
            <div className="pt-6 mt-6 border-t border-slate-300 grid grid-cols-2 text-center text-xs font-sans">
              <div>
                <div className="font-bold uppercase text-slate-700">NGƯỜI LẬP BẢN TRÍCH LỤC</div>
                <div className="text-[11px] italic text-slate-500">(Ký, ghi rõ họ tên)</div>
                <div className="h-20" />
                <div className="font-semibold text-slate-800">
                  {parishInfo.accountantName || 'Văn phòng Giáo xứ'}
                </div>
              </div>

              <div>
                <div className="text-slate-600 italic">
                  Lập tại {parishInfo.parishName}, ngày {currentDate.getDate()} tháng{' '}
                  {currentDate.getMonth() + 1} năm {currentDate.getFullYear()}
                </div>
                <div className="font-bold uppercase text-slate-900 mt-1">
                  LINH MỤC CHÁNH XỨ
                </div>
                <div className="text-[11px] italic text-slate-500">(Ký tên và đóng dấu)</div>
                <div className="h-20" />
                <div className="font-bold text-base text-slate-950">
                  {parishInfo.pastorName}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500">
            Hệ thống Quản Trị Giáo Dân & Sổ Bí Tích • <strong>DN Khánh</strong> (www.Khang.Top)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
