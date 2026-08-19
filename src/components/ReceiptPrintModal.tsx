import { Church, Download, Printer, X } from 'lucide-react';
import React from 'react';
import { ParishInfo, Transaction } from '../types';
import { formatCurrency, formatDate, formatDateLong, numberToVietnameseWords } from '../utils/formatters';

interface ReceiptPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  parishInfo: ParishInfo;
}

export const ReceiptPrintModal: React.FC<ReceiptPrintModalProps> = ({
  isOpen,
  onClose,
  transaction,
  parishInfo,
}) => {
  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === 'income';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Controls (No print) */}
        <div className="p-3 bg-slate-900 text-white flex justify-between items-center no-print">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Xem Trước Bản In Chứng Từ Gốc</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              In Chứng Từ (A4 / A5)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Paper */}
        <div className="p-8 sm:p-10 text-black bg-white select-text" id="printable-receipt">
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-300">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {parishInfo.dioceseName}
              </div>
              <div className="text-sm font-black uppercase text-slate-950 tracking-tight">
                {parishInfo.parishName}
              </div>
              <div className="text-[11px] text-slate-600">
                {parishInfo.deaneryName} • Ban Tài Chính
              </div>
              <div className="text-[10px] text-slate-500">{parishInfo.address}</div>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-slate-800">
                Mẫu số: {isIncome ? '01 - TT' : '02 - TC'}
              </div>
              <div className="font-mono text-xs text-slate-900 mt-0.5">
                Số Phiếu: <strong className="text-sm font-bold">{transaction.voucherNumber}</strong>
              </div>
              <div className="text-[11px] text-slate-600">
                Mã Mục: <strong>{transaction.categoryCode}</strong>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-6">
            <h2 className="text-2xl font-black tracking-wider uppercase text-slate-950">
              {isIncome ? 'PHIẾU THU' : 'PHIẾU CHI'}
            </h2>
            <p className="text-xs text-slate-600 italic mt-1">
              {formatDateLong(transaction.date)}
            </p>
          </div>

          {/* Main Voucher Body */}
          <div className="space-y-3 text-xs leading-relaxed border-t border-b border-slate-200 py-4">
            <div className="flex">
              <span className="w-44 text-slate-700 font-medium shrink-0">
                {isIncome ? 'Họ và tên người nộp tiền:' : 'Họ và tên người nhận tiền:'}
              </span>
              <span className="font-bold text-slate-950 flex-1 border-b border-dotted border-slate-400 pb-0.5">
                {transaction.payerReceiver}
              </span>
            </div>

            <div className="flex">
              <span className="w-44 text-slate-700 font-medium shrink-0">
                Thuộc Giáo khu / Giáo họ:
              </span>
              <span className="text-slate-900 flex-1 border-b border-dotted border-slate-400 pb-0.5">
                {transaction.parishZoneName || 'Toàn xứ / Ân nhân ngoại xứ'}
              </span>
            </div>

            <div className="flex">
              <span className="w-44 text-slate-700 font-medium shrink-0">
                {isIncome ? 'Lý do thu (Mục đích):' : 'Lý do chi (Mục đích):'}
              </span>
              <span className="text-slate-900 flex-1 border-b border-dotted border-slate-400 pb-0.5 font-medium">
                [{transaction.categoryName}] - {transaction.description}
              </span>
            </div>

            <div className="flex">
              <span className="w-44 text-slate-700 font-medium shrink-0">
                Ghi nhận vào Quỹ:
              </span>
              <span className="font-semibold text-slate-900 flex-1 border-b border-dotted border-slate-400 pb-0.5">
                {transaction.fundName}
              </span>
            </div>

            <div className="flex items-baseline">
              <span className="w-44 text-slate-700 font-medium shrink-0">Số tiền:</span>
              <span className="text-base font-black font-mono text-slate-950 flex-1 border-b border-dotted border-slate-400 pb-0.5">
                {formatCurrency(transaction.amount)}
              </span>
            </div>

            <div className="flex">
              <span className="w-44 text-slate-700 font-medium shrink-0">Viết bằng chữ:</span>
              <span className="font-bold italic text-slate-950 flex-1 border-b border-dotted border-slate-400 pb-0.5">
                {numberToVietnameseWords(transaction.amount)}
              </span>
            </div>

            <div className="flex">
              <span className="w-44 text-slate-700 font-medium shrink-0">Chứng từ gốc kèm theo:</span>
              <span className="text-slate-800 flex-1 border-b border-dotted border-slate-400 pb-0.5">
                01 chứng từ
              </span>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-8">
            <div className="text-right text-[11px] italic text-slate-600 mb-2">
              Lập tại Giáo Xứ, {formatDateLong(transaction.date)}
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs mt-4">
              <div>
                <div className="font-bold text-slate-900">
                  {isIncome ? 'Người Nộp Tiền' : 'Người Nhận Tiền'}
                </div>
                <div className="text-[10px] text-slate-500 italic mt-0.5">(Ký & ghi rõ họ tên)</div>
                <div className="h-16 flex items-end justify-center font-semibold text-slate-800 text-[11px]">
                  {transaction.payerReceiver}
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-900">Thủ Quỹ</div>
                <div className="text-[10px] text-slate-500 italic mt-0.5">(Ký & ghi rõ họ tên)</div>
                <div className="h-16 flex items-end justify-center font-semibold text-slate-800 text-[11px]">
                  {parishInfo.treasurerName}
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-900">Kế Toán Lập Phiếu</div>
                <div className="text-[10px] text-slate-500 italic mt-0.5">(Ký & ghi rõ họ tên)</div>
                <div className="h-16 flex items-end justify-center font-semibold text-slate-800 text-[11px]">
                  {transaction.creator || parishInfo.accountantName}
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-900">Linh Mục Chánh Xứ</div>
                <div className="text-[10px] text-slate-500 italic mt-0.5">(Ký duyệt & đóng dấu)</div>
                <div className="h-16 flex items-end justify-center font-semibold text-slate-800 text-[11px]">
                  {parishInfo.pastorName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
