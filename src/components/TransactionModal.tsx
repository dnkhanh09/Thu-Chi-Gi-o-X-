import {
  Calendar,
  Check,
  ChevronDown,
  DollarSign,
  FileSpreadsheet,
  FolderTree,
  PiggyBank,
  Receipt,
  Search,
  Sparkles,
  Tag,
  User,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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

  // Quick Autocomplete & Search state for Categories
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter categories by selected transaction type
  const availableCategories = useMemo(() => {
    return categories.filter((c) => c.type === type);
  }, [categories, type]);

  // Fast live filtered suggestions based on search input (matching 1+ character)
  const filteredCategorySuggestions = useMemo(() => {
    const query = categorySearchQuery.trim().toLowerCase();
    if (!query) {
      return availableCategories;
    }
    return availableCategories.filter((cat) => {
      const codeMatch = cat.code.toLowerCase().includes(query);
      const nameMatch = cat.name.toLowerCase().includes(query);
      const groupMatch = cat.group.toLowerCase().includes(query);
      const descMatch = cat.description ? cat.description.toLowerCase().includes(query) : false;
      return codeMatch || nameMatch || groupMatch || descMatch;
    });
  }, [availableCategories, categorySearchQuery]);

  // Grouped categories for standard browsing
  const groupedCategories = useMemo(() => {
    return categoryGroups
      .filter((g) => g.type === type)
      .map((g) => ({
        groupName: g.name,
        color: g.color,
        items: availableCategories.filter((c) => c.group === g.name),
      }))
      .filter((g) => g.items.length > 0);
  }, [categoryGroups, availableCategories, type]);

  const selectedCategoryObj = useMemo(() => {
    return categories.find((c) => c.id === categoryId);
  }, [categories, categoryId]);

  // Handle outside click for category dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        const curCat = categories.find((c) => c.id === editingTransaction.categoryId);
        setCategorySearchQuery(curCat ? `[${curCat.code}] ${curCat.name}` : '');
      } else {
        const newType: TransactionType = initialType === 'expense' ? 'expense' : 'income';
        const todayStr = new Date().toISOString().slice(0, 10);
        setType(newType);
        setDate(todayStr);
        setVoucherNumber(generateVoucherCode(newType, todayStr, allTransactions));

        // Default category for that type
        const firstCat = categories.find((c) => c.type === newType);
        if (firstCat) {
          setCategoryId(firstCat.id);
          setCategorySearchQuery(`[${firstCat.code}] ${firstCat.name}`);
        } else {
          setCategoryId('');
          setCategorySearchQuery('');
        }

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
      setIsCategoryDropdownOpen(false);
    }
  }, [isOpen, editingTransaction, initialType]);

  // When type or date changes (in create mode), regenerate voucher code
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (!editingTransaction) {
      setVoucherNumber(generateVoucherCode(newType, date, allTransactions));
      const firstCat = categories.find((c) => c.type === newType);
      if (firstCat) {
        setCategoryId(firstCat.id);
        setCategorySearchQuery(`[${firstCat.code}] ${firstCat.name}`);
      } else {
        setCategoryId('');
        setCategorySearchQuery('');
      }
    } else {
      const firstCat = categories.find((c) => c.type === newType);
      if (firstCat) {
        setCategoryId(firstCat.id);
        setCategorySearchQuery(`[${firstCat.code}] ${firstCat.name}`);
      }
    }
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (!editingTransaction) {
      setVoucherNumber(generateVoucherCode(type, newDate, allTransactions));
    }
  };

  const handleSelectCategory = (cat: Category) => {
    setCategoryId(cat.id);
    setCategorySearchQuery(`[${cat.code}] ${cat.name}`);
    setIsCategoryDropdownOpen(false);
    if (errors.categoryId) {
      setErrors((prev) => ({ ...prev, categoryId: '' }));
    }
    // Auto-suggest description if currently blank
    if (!description.trim()) {
      setDescription(cat.name);
    }
  };

  // Keyboard navigation for suggestions
  const handleKeyDownCategory = (e: React.KeyboardEvent) => {
    if (!isCategoryDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsCategoryDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCategorySuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCategorySuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCategorySuggestions[highlightedIndex]) {
        handleSelectCategory(filteredCategorySuggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsCategoryDropdownOpen(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!voucherNumber.trim()) newErrors.voucherNumber = 'Vui lòng nhập số chứng từ';
    if (!date) newErrors.date = 'Vui lòng chọn ngày ghi sổ';
    if (!categoryId) newErrors.categoryId = 'Vui lòng chọn mục thu/chi hoặc mã mục đích';
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

          {/* Row 2: Mục Thu/Chi & Mã mục đích (SMART LIVE SEARCH & AUTOCOMPLETE) */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-blue-600" />
                <span>Mục Thu / Chi & Mã Mục Đích <span className="text-rose-500">*</span></span>
              </label>
              <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Gõ 1 ký tự mã/nội dung để gợi ý
              </span>
            </div>

            {/* Smart Search Combobox Input */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex items-center gap-1 pointer-events-none">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={categorySearchQuery}
                onFocus={() => {
                  setIsCategoryDropdownOpen(true);
                  setHighlightedIndex(0);
                }}
                onChange={(e) => {
                  setCategorySearchQuery(e.target.value);
                  setIsCategoryDropdownOpen(true);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDownCategory}
                placeholder="Nhập mã (VD: THU, CHI, LE, XD, PL) hoặc tên mục thu chi..."
                className={`w-full pl-9 pr-10 py-2.5 text-xs bg-white border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.categoryId ? 'border-rose-500 bg-rose-50' : 'border-slate-300'
                }`}
              />

              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                tabIndex={-1}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Autocomplete Dropdown List */}
            {isCategoryDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 max-h-72 overflow-y-auto z-50 animate-fadeIn"
              >
                <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>
                    Gợi ý mục thu chi ({filteredCategorySuggestions.length} kết quả)
                  </span>
                  <span className="text-blue-600 text-[10px]">
                    Dùng phím ↑ ↓ Enter để chọn nhanh
                  </span>
                </div>

                {filteredCategorySuggestions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Không tìm thấy mục nào khớp với "{categorySearchQuery}".
                  </div>
                ) : (
                  <div className="p-1 space-y-1">
                    {filteredCategorySuggestions.map((cat, idx) => {
                      const isSelected = cat.id === categoryId;
                      const isHighlighted = idx === highlightedIndex;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleSelectCategory(cat)}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-blue-50 text-blue-900 font-semibold'
                              : isHighlighted
                              ? 'bg-slate-100 text-slate-900'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                                {cat.code}
                              </span>
                              <span className="font-semibold text-slate-900 truncate">
                                {cat.name}
                              </span>
                              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                {cat.group}
                              </span>
                            </div>
                            {cat.description && (
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {cat.description}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {errors.categoryId && (
              <p className="text-[11px] text-rose-600 mt-0.5">{errors.categoryId}</p>
            )}

            {/* Selected Category Preview Tag */}
            {selectedCategoryObj && (
              <div className="mt-2 p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                    {selectedCategoryObj.code}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedCategoryObj.name}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-[11px] text-slate-600">
                    Nhóm: {selectedCategoryObj.group}
                  </span>
                </div>
              </div>
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
