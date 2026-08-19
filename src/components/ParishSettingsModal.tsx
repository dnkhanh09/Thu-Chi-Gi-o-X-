import {
  Church,
  Download,
  FileJson,
  HelpCircle,
  RefreshCw,
  Save,
  Settings,
  Upload,
  UserCheck,
  X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { ParishInfo } from '../types';

interface ParishSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  parishInfo: ParishInfo;
  onSaveInfo: (info: ParishInfo) => void;
  onExportBackup: () => void;
  onImportBackup: (content: string) => { success: boolean; message: string };
  onResetSampleData: () => void;
}

export const ParishSettingsModal: React.FC<ParishSettingsModalProps> = ({
  isOpen,
  onClose,
  parishInfo,
  onSaveInfo,
  onExportBackup,
  onImportBackup,
  onResetSampleData,
}) => {
  const [formData, setFormData] = useState<ParishInfo>(parishInfo);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleChange = (field: keyof ParishInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveInfo(formData);
    alert('Đã cập nhật thông tin Giáo Xứ thành công!');
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = onImportBackup(content);
        setImportStatus(res.message);
        if (res.success) {
          alert('Đã phục hồi dữ liệu sao lưu thành công!');
          onClose();
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
              <Church className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Cài Đặt Hệ Thống & Sao Lưu</h3>
              <p className="text-xs text-slate-400">
                Thông tin tiêu ngữ Giáo phận, Ban Hành Giáo và dữ liệu sao lưu
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

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Form Thông tin Giáo Xứ */}
          <form onSubmit={handleSave} className="space-y-4">
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Church className="w-4 h-4 text-blue-600" />
              <span>Thông Tin Giáo Xứ & Ban Điều Hành</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên Giáo Phận (Tiêu Ngữ In)
                </label>
                <input
                  type="text"
                  value={formData.dioceseName}
                  onChange={(e) => handleChange('dioceseName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên Giáo Hạt</label>
                <input
                  type="text"
                  value={formData.deaneryName}
                  onChange={(e) => handleChange('deaneryName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên Giáo Xứ</label>
                <input
                  type="text"
                  value={formData.parishName}
                  onChange={(e) => handleChange('parishName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa Chỉ Giáo Xứ</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Linh Mục Chánh Xứ (Quản Xứ)
                </label>
                <input
                  type="text"
                  value={formData.pastorName}
                  onChange={(e) => handleChange('pastorName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Trưởng Ban Hành Giáo
                </label>
                <input
                  type="text"
                  value={formData.committeeLeaderName}
                  onChange={(e) => handleChange('committeeLeaderName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kế Toán Ban Tài Chính
                </label>
                <input
                  type="text"
                  value={formData.accountantName}
                  onChange={(e) => handleChange('accountantName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Thủ Quỹ Ban Tài Chính
                </label>
                <input
                  type="text"
                  value={formData.treasurerName}
                  onChange={(e) => handleChange('treasurerName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu Thông Tin Giáo Xứ</span>
              </button>
            </div>
          </form>

          {/* Backup & Restore Section */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
              <FileJson className="w-4 h-4 text-emerald-600" />
              <span>Sao Lưu & Phục Hồi Dữ Liệu An Toàn</span>
            </h4>
            <p className="text-slate-500 text-[11px]">
              Dữ liệu được lưu trữ tự động trên trình duyệt. Bạn nên xuất file sao lưu định kỳ ra máy
              tính để bảo toàn sổ sách tài chính.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onExportBackup}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-3 text-left transition-colors"
              >
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Xuất Bản Sao Lưu (JSON)</div>
                  <div className="text-[10px] text-slate-500">Tải về toàn bộ chứng từ & danh mục</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-3 text-left transition-colors"
              >
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Nhập Dữ Liệu Từ File</div>
                  <div className="text-[10px] text-slate-500">Phục hồi lại sổ sách từ file đã lưu</div>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {importStatus && (
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200 text-blue-900 text-xs">
                {importStatus}
              </div>
            )}
          </div>

          {/* Developer Attribution Card */}
          <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                DN
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Phần Mềm Quản Lý Thu Chi Giáo Xứ
                </p>
                <p className="text-[11px] text-slate-600">
                  Tác giả & Phát triển bởi: <strong className="text-blue-900">DN Khánh</strong>
                </p>
              </div>
            </div>
            <a
              href="https://www.Khang.Top"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
            >
              <span>www.Khang.Top</span>
            </a>
          </div>

          {/* Reset to sample data */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 text-xs">Dữ Liệu Mẫu Giáo Xứ</div>
              <div className="text-[11px] text-slate-500">
                Nạp lại bộ dữ liệu thu chi mẫu ban đầu để tham khảo
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    'Bạn có chắc chắn muốn nạp lại dữ liệu mẫu giáo xứ? Các dữ liệu tự tạo chưa sao lưu có thể bị ghi đè.'
                  )
                ) {
                  onResetSampleData();
                  alert('Đã khôi phục dữ liệu mẫu thành công!');
                  onClose();
                }
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200 text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Nạp Dữ Liệu Mẫu</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
