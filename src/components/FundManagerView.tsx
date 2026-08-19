import {
  ArrowDownRight,
  ArrowUpRight,
  Church,
  FileSpreadsheet,
  Landmark,
  PiggyBank,
  Receipt,
  Wallet,
} from 'lucide-react';
import React, { useState } from 'react';
import { FundBalanceSummary, Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface FundManagerViewProps {
  funds: FundBalanceSummary[];
  transactions: Transaction[];
  onOpenNewTransaction: (type: 'income' | 'expense') => void;
  onPrintReceipt: (transaction: Transaction) => void;
}

export const FundManagerView: React.FC<FundManagerViewProps> = ({
  funds,
  transactions,
  onOpenNewTransaction,
  onPrintReceipt,
}) => {
  const [selectedFundId, setSelectedFundId] = useState<string>(funds[0]?.fundId || '');

  const activeFund = funds.find((f) => f.fundId === selectedFundId) || funds[0];
  const activeFundTransactions = transactions.filter((t) => t.fundId === activeFund?.fundId);

  return (
    <div className="space-y-6">
      {/* Funds Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {funds.map((f) => {
          const isSelected = f.fundId === activeFund?.fundId;
          return (
            <div
              key={f.fundId}
              onClick={() => setSelectedFundId(f.fundId)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-600 shadow-sm ring-1 ring-blue-600'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {f.fundCode}
                </span>
                <PiggyBank
                  className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}
                />
              </div>

              <h4 className="font-bold text-sm text-slate-900 mt-2 line-clamp-1" title={f.fundName}>
                {f.fundName}
              </h4>

              <div className="mt-3">
                <div className="text-xs text-slate-500 font-medium">Số Dư Khả Dụng:</div>
                <div className="text-lg font-bold text-slate-950 font-mono tracking-tight">
                  {formatCurrency(f.currentBalance)}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-600 font-semibold font-mono">
                  +{formatCurrency(f.totalIncome)}
                </span>
                <span className="text-rose-600 font-semibold font-mono">
                  -{formatCurrency(f.totalExpense)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fund Ledger Detail */}
      {activeFund && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Sổ Quỹ: {activeFund.fundName}
                </h3>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {activeFund.fundCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Số dư ban đầu: {formatCurrency(activeFund.initialBalance)} • Hiện có{' '}
                {activeFundTransactions.length} giao dịch qua quỹ này
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenNewTransaction('income')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                + Thu Nạp Vào Quỹ
              </button>
              <button
                onClick={() => onOpenNewTransaction('expense')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                - Chi Xuất Quỹ
              </button>
            </div>
          </div>

          {/* Table */}
          {activeFundTransactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 italic">
              Chưa có chứng từ thu chi nào thuộc quỹ này.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Số Phiếu & Ngày</th>
                    <th className="py-2.5 px-3">Mục Thu / Chi</th>
                    <th className="py-2.5 px-3">Đối Tượng Nộp / Nhận</th>
                    <th className="py-2.5 px-3">Nội Dung Diễn Giải</th>
                    <th className="py-2.5 px-3 text-right">Thu Vào</th>
                    <th className="py-2.5 px-3 text-right">Chi Ra</th>
                    <th className="py-2.5 px-3 text-center w-20">In Phiếu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeFundTransactions.map((tx) => {
                    const isInc = tx.type === 'income';
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-900">
                            {tx.voucherNumber}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {formatDate(tx.date)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-800">
                            [{tx.categoryCode}] {tx.categoryName}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">
                          {tx.payerReceiver}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={tx.description}>
                          {tx.description}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">
                          {isInc ? `+${formatCurrency(tx.amount)}` : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600 whitespace-nowrap">
                          {!isInc ? `-${formatCurrency(tx.amount)}` : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => onPrintReceipt(tx)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors"
                            title="In phiếu"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
