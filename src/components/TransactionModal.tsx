import {
  Calendar,
  DollarSign,
  FileSpreadsheet,
  FolderTree,
  PiggyBank,
  Receipt,
  User,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Category, CategoryGroup, Fund, ParishInfo, ParishZone, Transaction, TransactionType } from '../types';
import { formatCurrency, generateVoucherCode, numberToVietnameseWords } from '../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, tx: Partial<Transaction>) => void;
  editingTransaction?: Transaction | null;
  initialType?: TransactionType;
  categories: Category[];
  categoryGroups: CategoryGroup[];
  funds: Fund[];
  parishZones: ParishZone[];
  parishInfo: ParishInfo;
  allTransactions: Transaction[];
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingTransaction,
  initialType = 'income',
  categories,
  categoryGroups,
  funds,
  parishZones,
  parishInfo,
  allTransactions,
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [voucherNumber, setVoucherNumber] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [fundId, setFundId] = useState<string>('');
  const [parishZoneId, setParishZoneId] = useState<string>('');
  const [payerReceiver, setPayerReceiver] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [description, setDescription] = useState<string>('');
  const [creator, setCreator] = useState<string>(parishInfo.accountantName);
  const [approver, setApprover] = useState<string>(parishInfo.pastorName);
  const [note, setNote] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filter categories by selected type
  const availableCategories = categories.filter((c) => c.type === type);

  // Grouped categories for nice select optgroup
  const groupedCategories = categoryGroups
    .filter((g) => g.type === type)
    .map((g) => ({
      groupName: g.name,
      items: availableCategories.filter((c) => c.group === g.name),
    }))
    .filter((g) => g.items.length > 0);

  // Reset or initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingTransaction) {
        setType(editingTransaction.type);
        setDate(editingTransaction.date);
        setVoucherNumber(editingTransaction.voucherNumber);
        setCategoryId(editingTransaction.categoryId);
        setFundId(editingTransaction.fundId);
        setParishZoneId(editingTransaction.parishZoneId || '');
        setPayerReceiver(editingTransaction.payerReceiver);
        setAmount(editingTransaction.amount);
        setDescription(editingTransaction.description);
        setCreator(editingTransaction.creator || parishInfo.accountantName);
        setApprover(editingTransaction.approver || parishInfo.pastorName);
        setNote(editingTransaction.note || '');
      } else {
        const newType: TransactionType = initialType === 'expense' ? 'expense' : 'income';
        const todayStr = new Date().toISOString().slice(0, 10);
        setType(newType);
        setDate(todayStr);
        setVoucherNumber(generateVoucherCode(newType, todayStr, allTransactions));

        // Default category for that type
        const firstCat = categories.find((c) => c.type === newType);
        setCategoryId(firstCat ? firstCat.id : '');

        // Default fund
        const defaultFund = funds.find((f) => f.code === 'QUY-CHUNG') || funds[0];
        setFundId(defaultFund ? defaultFund.id : '');

        // Default zone
        setParishZoneId(parishZones[0]?.id || '');

        setPayerReceiver('');
        setAmount('');
        setDescription('');
        setCreator(parishInfo.accountantName);
        setApprover(parishInfo.pastorName);
        setNote('');
      }
      setErrors({});
    }
  }, [isOpen, editingTransaction, initialType]);

  // When type or date changes (in create mode), regenerate voucher code
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (!editingTransaction) {
      setVoucherNumber(generateVoucherCode(newType, date, allTransactions));
      const firstCat = categories.find((c) => c.type === newType);
      if (firstCat) setCategoryId(firstCat.id);
    }
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (!editingTransaction) {
      setVoucherNumber(generateVoucherCode(type, newDate, allTransactions));
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!voucherNumber.trim()) newErrors.voucherNumber = 'Vui lòng nhập số chứng từ';
    if (!date) newErrors.date = 'Vui lòng chọn ngày ghi sổ';
    if (!categoryId) newErrors.categoryId = 'Vui lòng chọn mục thu/chi';
    if (!fundId) newErrors.fundId = 'Vui lòng chọn quỹ tiền tệ';
    if (!payerReceiver.trim()) newErrors.payerReceiver = 'Vui lòng nhập họ tên người nộp / nhận';
    if (!amount || Number(amount) <= 0) newErrors.amount = 'Vui lòng nhập số tiền lớn hơn 0';
    if (!description.trim()) newErrors.description = 'Vui lòng nhập nội dung diễn giải';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);
    const selectedFund = funds.find((f) => f.id === fundId);
    const selectedZone = parishZones.find((z) => z.id === parishZoneId);

    const transactionData = {
      voucherNumber: voucherNumber.trim(),
      type,
      categoryId,
      categoryCode: selectedCategory?.code || '',
      categoryName: selectedCategory?.name || '',
      categoryGroup: selectedCategory?.group || '',
      fundId,
      fundName: selectedFund?.name || 'Quỹ Phổ Thông',
      amount: Number(amount),
      date,
      payerReceiver: payerReceiver.trim(),
      parishZoneId: parishZoneId || undefined,
      parishZoneName: selectedZone?.name || undefined,
      description: description.trim(),
      creator: creator.trim() || parishInfo.accountantName,
      approver: approver.trim() || undefined,
      note: note.trim() || undefined,
    };

    if (editingTransaction && onUpdate) {
      onUpdate(editingTransaction.id, transactionData);
    } else {
      onSave(transactionData);
    }

    onClose();
  };

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {editingTransaction
                  ? 'Chỉnh Sửa Chứng Từ'
                  : type === 'income'
                  ? 'Lập Phiếu Thu Giáo Xứ'
                  : 'Lập Phiếu Chi Giáo Xứ'}
              </h3>
              <p className="text-xs text-slate-400">
                {parishInfo.parishName} • Ban Tài Chính Giáo Xứ
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Type Toggle (Thu / Chi) */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🟢 Phiếu Thu (Nhận Tiền)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔴 Phiếu Chi (Xuất Quỹ)</span>
            </button>
          </div>

          {/* Row 1: Số phiếu & Ngày */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Phiếu / Mã Chứng Từ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={voucherNumber}
                onChange={(e) => setVoucherNumber(e.target.value)}
                placeholder="PT-202608-001"
                className={`w-full px-3 py-2 text-xs font-mono font-bold bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.voucherNumber ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                }`}
              />
              {errors.voucherNumber && (
                <p className="text-[11px] text-rose-600 mt-0.5">{errors.voucherNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Ngày Ghi Sổ <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.date ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                }`}
              />
              {errors.date && <p className="text-[11px] text-rose-600 mt-0.5">{errors.date}</p>}
            </div>
          </div>

          {/* Row 2: Mục Thu/Chi & Mã mục */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <FolderTree className="w-3.5 h-3.5 text-blue-600" />
                Mục Thu / Chi & Mã Mục Đích <span className="text-rose-500">*</span>
              </span>
              {selectedCategoryObj && (
                <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Mã: {selectedCategoryObj.code}
                </span>
              )}
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.categoryId ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
              }`}
            >
              <option value="">-- Chọn mục thu / chi phù hợp --</option>
              {groupedCategories.map((group) => (
                <optgroup key={group.groupName} label={`--- ${group.groupName.toUpperCase()} ---`}>
                  {group.items.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      [{cat.code}] {cat.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-[11px] text-rose-600 mt-0.5">{errors.categoryId}</p>
            )}
            {selectedCategoryObj?.description && (
              <p className="text-[11px] text-slate-500 mt-1 italic">
                ℹ {selectedCategoryObj.description}
              </p>
            )}
          </div>

          {/* Row 3: Số Tiền & Chuyển sang chữ */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                Số Tiền (VNĐ) <span className="text-rose-500">*</span>
              </span>
              {typeof amount === 'number' && amount > 0 && (
                <span className="text-xs font-bold text-emerald-600 font-mono">
                  {formatCurrency(amount)}
                </span>
              )}
            </label>
            <input
              type="number"
              min="1000"
              step="1000"
              placeholder="Nhập số tiền VNĐ (ví dụ: 5000000)"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
              className={`w-full px-3 py-2 text-sm font-mono font-bold bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.amount ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
              }`}
            />
            {errors.amount && <p className="text-[11px] text-rose-600 mt-0.5">{errors.amount}</p>}

            {/* Vietnamese Words preview */}
            {typeof amount === 'number' && amount > 0 && (
              <div className="mt-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 italic">
                <span className="font-semibold text-slate-900 not-italic">Bằng chữ: </span>
                {numberToVietnameseWords(amount)}
              </div>
            )}
          </div>

          {/* Row 4: Người nộp/nhận & Giáo khu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {type === 'income' ? 'Họ Tên Người Nộp / Ân Nhân' : 'Họ Tên Người Nhận / Đơn Vị'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder={
                  type === 'income'
                    ? 'Ví dụ: Ông Giuse Nguyễn Văn A, Khu 1...'
                    : 'Ví dụ: Nhà sách Phaolô, Cơ sở hoa tươi...'
                }
                value={payerReceiver}
                onChange={(e) => setPayerReceiver(e.target.value)}
                className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.payerReceiver ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                }`}
              />
              {errors.payerReceiver && (
                <p className="text-[11px] text-rose-600 mt-0.5">{errors.payerReceiver}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                Thuộc Giáo Khu / Giáo Họ
              </label>
              <select
                value={parishZoneId}
                onChange={(e) => setParishZoneId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Không xác định / Toàn xứ / Ngoại xứ --</option>
                {parishZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Quỹ Tiền Tệ */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <PiggyBank className="w-3.5 h-3.5 text-blue-600" />
              Nạp Vào / Xuất Từ Quỹ <span className="text-rose-500">*</span>
            </label>
            <select
              value={fundId}
              onChange={(e) => setFundId(e.target.value)}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.fundId ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
              }`}
            >
              {funds.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.code})
                </option>
              ))}
            </select>
            {errors.fundId && <p className="text-[11px] text-rose-600 mt-0.5">{errors.fundId}</p>}
          </div>

          {/* Row 6: Diễn giải chi tiết */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nội Dung Diễn Giải Chi Tiết <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ghi rõ lý do thu/chi, số lượng, nội dung công việc hoặc sự kiện..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.description ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 mt-0.5">{errors.description}</p>
            )}
          </div>

          {/* Row 7: Người lập & Người duyệt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Người Lập Phiếu (Kế Toán / Thủ Quỹ)
              </label>
              <input
                type="text"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Người Duyệt (Linh Mục Chánh Xứ / Trưởng Ban)
              </label>
              <input
                type="text"
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-colors ${
                type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {editingTransaction
                ? 'Cập Nhật Chứng Từ'
                : type === 'income'
                ? 'Lưu Phiếu Thu'
                : 'Lưu Phiếu Chi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
