import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  PieChart as PieIcon,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GroupSummary, MonthlyFinancialRecord } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface FinancialChartsProps {
  monthlyData: MonthlyFinancialRecord[];
  incomeGroups: GroupSummary[];
  expenseGroups: GroupSummary[];
  year: number;
  totalIncome: number;
  totalExpense: number;
  timeRangeTitle: string;
}

const COLORS = [
  '#059669', // Emerald
  '#0284c7', // Sky
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#db2777', // Pink
  '#ea580c', // Orange
  '#dc2626', // Red
  '#475569', // Slate
];

export const FinancialCharts: React.FC<FinancialChartsProps> = ({
  monthlyData,
  incomeGroups,
  expenseGroups,
  year,
  totalIncome,
  totalExpense,
  timeRangeTitle,
}) => {
  // Chart data for Income groups
  const incomePieData = incomeGroups.map((g, idx) => ({
    name: g.groupName,
    value: g.totalAmount,
    color: COLORS[idx % COLORS.length],
  }));

  // Chart data for Expense groups
  const expensePieData = expenseGroups.map((g, idx) => ({
    name: g.groupName,
    value: g.totalAmount,
    color: COLORS[(idx + 2) % COLORS.length],
  }));

  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000000) {
      return `${(tickItem / 1000000).toFixed(0)} tr`;
    }
    if (tickItem >= 1000) {
      return `${(tickItem / 1000).toFixed(0)} k`;
    }
    return String(tickItem);
  };

  return (
    <div className="space-y-6">
      {/* Chart 1: Diễn biến thu chi 12 tháng trong năm */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Diễn Biến Thu Chi 12 Tháng Năm {year}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              So sánh tổng dòng tiền thu và chi từng tháng trong năm tài chính
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
              Tổng Thu: {formatCurrency(monthlyData.reduce((s, m) => s + m.income, 0))}
            </span>
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-3 h-3 rounded-xs bg-rose-600 inline-block" />
              Tổng Chi: {formatCurrency(monthlyData.reduce((s, m) => s + m.expense, 0))}
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="monthLabel" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fill: '#64748b', fontSize: 11 }}
                width={55}
              />
              <Tooltip
                formatter={(value: any) => [formatCurrency(Number(value)), '']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend
                formatter={(val) => (val === 'income' ? 'Khoản Thu (VNĐ)' : 'Khoản Chi (VNĐ)')}
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
              <Bar dataKey="income" fill="#059669" name="income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#e11d48" name="expense" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2 & 3: Cơ cấu nguồn thu & Cơ cấu khoản chi (Doughnut / Pie) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cơ cấu nguồn Thu */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Cơ Cấu Nguồn Thu ({timeRangeTitle})</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {formatCurrency(totalIncome)}
              </span>
            </div>

            {incomePieData.length === 0 ? (
              <div className="h-60 flex items-center justify-center text-xs text-slate-400 italic">
                Chưa có dữ liệu thu trong kỳ này
              </div>
            ) : (
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {incomePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(Number(val)), '']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Legend Table */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
            {incomeGroups.slice(0, 5).map((grp, idx) => (
              <div key={grp.groupName} className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="truncate">{grp.groupName}</span>
                </div>
                <div className="font-semibold text-slate-900 shrink-0 font-mono">
                  {formatCurrency(grp.totalAmount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cơ cấu khoản Chi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-600" />
                <span>Cơ Cấu Khoản Chi ({timeRangeTitle})</span>
              </h3>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {formatCurrency(totalExpense)}
              </span>
            </div>

            {expensePieData.length === 0 ? (
              <div className="h-60 flex items-center justify-center text-xs text-slate-400 italic">
                Chưa có dữ liệu chi trong kỳ này
              </div>
            ) : (
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expensePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(Number(val)), '']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Legend Table */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
            {expenseGroups.slice(0, 5).map((grp, idx) => (
              <div key={grp.groupName} className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[(idx + 2) % COLORS.length] }}
                  />
                  <span className="truncate">{grp.groupName}</span>
                </div>
                <div className="font-semibold text-slate-900 shrink-0 font-mono">
                  {formatCurrency(grp.totalAmount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
