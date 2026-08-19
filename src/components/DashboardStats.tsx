import {
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  PiggyBank,
  ReceiptText,
  Scale,
  Wallet,
} from 'lucide-react';
import React from 'react';
import { FundBalanceSummary, Transaction } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface DashboardStatsProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  totalParishBalance: number;
  fundSummaries: FundBalanceSummary[];
  timeRangeTitle: string;
  filteredTransactions: Transaction[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalIncome,
  totalExpense,
  netBalance,
  totalParishBalance,
  fundSummaries,
  timeRangeTitle,
  filteredTransactions,
}) => {
  const incomeCount = filteredTransactions.filter((t) => t.type === 'income').length;
  const expenseCount = filteredTransactions.filter((t) => t.type === 'expense').length;

  return (
    <div className="space-y-4 no-print">
      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng Thu */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Tổng Thu ({timeRangeTitle})
            </p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ArrowUpRight className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-emerald-600 tracking-tight font-mono">
              {formatCurrency(totalIncome)}
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <ReceiptText className="w-3.5 h-3.5 mr-0.5 text-emerald-600" />
              <span>{formatNumber(incomeCount)} phiếu thu ghi nhận</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tổng Chi */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Tổng Chi ({timeRangeTitle})
            </p>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <ArrowDownRight className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-rose-600 tracking-tight font-mono">
              ({formatCurrency(totalExpense)})
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-rose-600 font-medium">
              <ReceiptText className="w-3.5 h-3.5 mr-0.5 text-rose-600" />
              <span>{formatNumber(expenseCount)} phiếu chi đã duyệt</span>
            </div>
          </div>
        </div>

        {/* Card 3: Tồn Quỹ Hiện Tại */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Tồn Quỹ Toàn Xứ
            </p>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <Landmark className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
              {formatCurrency(totalParishBalance)}
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Wallet className="w-3.5 h-3.5 mr-0.5 text-slate-400" />
              <span>Gồm {fundSummaries.length} quỹ chuyên biệt</span>
            </div>
          </div>
        </div>

        {/* Card 4: Chênh Lệch & Số Giao Dịch */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Cân Đối Dòng Tiền
            </p>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                netBalance >= 0
                  ? 'bg-blue-50 text-blue-600 border-blue-100'
                  : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}
            >
              <Scale className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div
              className={`text-2xl font-bold tracking-tight font-mono ${
                netBalance >= 0 ? 'text-blue-600' : 'text-amber-600'
              }`}
            >
              {netBalance > 0 ? '+' : ''}
              {formatCurrency(netBalance)}
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-blue-600 font-medium">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${netBalance >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {netBalance >= 0 ? 'Đã cân đối (+)' : 'Thâm hụt kỳ'}
              </span>
              <span className="text-slate-500">• {filteredTransactions.length} giao dịch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fund balances quick row */}
      <div className="bg-slate-100/80 rounded-xl p-3 border border-slate-200">
        <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-blue-600" />
            <span>Chi tiết số dư các quỹ phụng vụ & công ích:</span>
          </span>
          <span className="text-[11px] text-slate-500 font-normal">
            (Bao gồm số dư ban đầu + phát sinh)
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {fundSummaries.map((f) => (
            <div
              key={f.fundId}
              className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between"
            >
              <div className="text-xs font-medium text-slate-600 truncate" title={f.fundName}>
                {f.fundName}
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900 font-mono">
                {formatCurrency(f.currentBalance)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
