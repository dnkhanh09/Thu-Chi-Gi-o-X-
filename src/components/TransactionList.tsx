import {
  CheckSquare,
  Edit,
  Eye,
  FileText,
  PlusCircle,
  Printer,
  Square,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onBatchDelete: (ids: string[]) => void;
  onPrintReceipt: (transaction: Transaction) => void;
  onOpenNewTransaction: (type: 'income' | 'expense') => void;
  timeRangeTitle: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  onBatchDelete,
  onPrintReceipt,
  onOpenNewTransaction,
  timeRangeTitle,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedIds.length === transactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(transactions.map((t) => t.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchDelete = () => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedIds.length} chứng từ thu chi đã chọn không?`
      )
    ) {
      onBatchDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Sổ Nhật Ký Thu Chi</span>
            <span className="text-xs font-medium text-slate-500">
              ({timeRangeTitle} • {transactions.length} chứng từ)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Danh sách phiếu thu và phiếu chi đã lập theo trình tự thời gian
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 text-xs text-blue-900 font-medium animate-in fade-in">
              <span>Đã chọn {selectedIds.length} mục</span>
              <button
                onClick={handleBatchDelete}
                className="text-rose-600 hover:text-rose-800 font-semibold underline ml-1 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xóa đã chọn
              </button>
            </div>
          )}

          <button
            onClick={() => onOpenNewTransaction('income')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            + Thu Mới
          </button>
          <button
            onClick={() => onOpenNewTransaction('expense')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            <TrendingDown className="w-3.5 h-3.5 mr-1 text-rose-600" />
            + Chi Mới
          </button>
        </div>
      </div>

      {/* Empty State */}
      {transactions.length === 0 ? (
        <div className="py-16 text-center px-4">
          <div className="w-14 h-14 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            Không có chứng từ thu chi nào trong kỳ lọc này
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Hãy thử chọn tháng/năm khác, xóa bớt điều kiện lọc hoặc tạo phiếu thu/chi mới.
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => onOpenNewTransaction('income')}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              Lập Phiếu Thu
            </button>
            <button
              onClick={() => onOpenNewTransaction('expense')}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              Lập Phiếu Chi
            </button>
          </div>
        </div>
      ) : (
        /* Responsive Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider text-[11px] font-semibold sticky top-0">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <button
                    onClick={handleSelectAll}
                    className="text-slate-400 hover:text-slate-700 inline-flex items-center"
                    title="Chọn tất cả"
                  >
                    {selectedIds.length === transactions.length && transactions.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3">Số Phiếu & Ngày</th>
                <th className="py-3 px-3">Mục Thu / Chi</th>
                <th className="py-3 px-3">Người Nộp / Nhận</th>
                <th className="py-3 px-3">Giáo Khu / Họ</th>
                <th className="py-3 px-3">Quỹ Tiền Tệ</th>
                <th className="py-3 px-3 text-right">Số Tiền (VNĐ)</th>
                <th className="py-3 px-3 min-w-[200px]">Diễn Giải</th>
                <th className="py-3 px-3 text-center w-28">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const isSelected = selectedIds.includes(tx.id);

                return (
                  <tr
                    key={tx.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleSelect(tx.id)}
                        className="text-slate-400 hover:text-slate-700 inline-flex items-center"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Số phiếu & Ngày */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900 font-mono">{tx.voucherNumber}</div>
                      <div className="text-[11px] text-slate-500">{formatDate(tx.date)}</div>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isIncome ? 'Thu' : 'Chi'}
                      </span>
                    </td>

                    {/* Mục Thu / Chi & Mã */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700 font-semibold">
                          {tx.categoryCode}
                        </span>
                        <span>{tx.categoryName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{tx.categoryGroup}</div>
                    </td>

                    {/* Người Nộp / Nhận */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{tx.payerReceiver}</div>
                    </td>

                    {/* Giáo Khu / Họ */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200 font-medium">
                        {tx.parishZoneName || 'Khác'}
                      </span>
                    </td>

                    {/* Quỹ Tiền Tệ */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-slate-700 font-medium">{tx.fundName}</div>
                    </td>

                    {/* Số Tiền */}
                    <td className="py-3 px-3 text-right whitespace-nowrap font-mono">
                      <div
                        className={`text-sm font-bold ${
                          isIncome ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </div>
                    </td>

                    {/* Diễn Giải */}
                    <td className="py-3 px-3 text-slate-600 text-xs">
                      <div className="line-clamp-2" title={tx.description}>
                        {tx.description}
                      </div>
                      {tx.approver && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Duyệt bởi: {tx.approver}
                        </div>
                      )}
                    </td>

                    {/* Thao Tác */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onPrintReceipt(tx)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Xem & In Phiếu Thu / Phiếu Chi"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(tx)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Chỉnh sửa chứng từ"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Bạn có chắc chắn muốn xóa chứng từ ${tx.voucherNumber} (${tx.categoryName}) không?`
                              )
                            ) {
                              onDelete(tx.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Xóa chứng từ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
