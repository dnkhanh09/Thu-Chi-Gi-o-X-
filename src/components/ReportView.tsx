import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Calendar,
  CheckCircle2,
  Church,
  Download,
  FileSpreadsheet,
  Layers,
  PiggyBank,
  Printer,
  Scale,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import {
  FundBalanceSummary,
  GroupSummary,
  ParishInfo,
  ParishZone,
  Transaction,
} from '../types';
import { exportSummaryReportToExcel, exportTransactionsToExcel } from '../utils/excelExport';
import { formatCurrency, formatDate, formatDateLong, formatNumber } from '../utils/formatters';

interface ReportViewProps {
  transactions: Transaction[];
  incomeGroups: GroupSummary[];
  expenseGroups: GroupSummary[];
  fundSummaries: FundBalanceSummary[];
  parishZones: ParishZone[];
  parishInfo: ParishInfo;
  timeRangeTitle: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  totalParishBalance: number;
}

export const ReportView: React.FC<ReportViewProps> = ({
  transactions,
  incomeGroups,
  expenseGroups,
  fundSummaries,
  parishZones,
  parishInfo,
  timeRangeTitle,
  totalIncome,
  totalExpense,
  netBalance,
  totalParishBalance,
}) => {
  const [reportType, setReportType] = useState<'balance' | 'zones' | 'funds' | 'journal'>('balance');

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (reportType === 'journal') {
      exportTransactionsToExcel(transactions, parishInfo, timeRangeTitle);
    } else {
      exportSummaryReportToExcel(
        incomeGroups,
        expenseGroups,
        fundSummaries,
        parishInfo,
        timeRangeTitle,
        totalIncome,
        totalExpense
      );
    }
  };

  // Compute Parish Zone donation summary
  const zoneSummaries = parishZones.map((zone) => {
    const zoneTxs = transactions.filter((t) => t.parishZoneId === zone.id);
    const income = zoneTxs
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = zoneTxs
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      leader: zone.leader,
      txCount: zoneTxs.length,
      totalDonation: income,
      totalAssistance: expense,
      net: income - expense,
    };
  });

  return (
    <div className="space-y-4">
      {/* Top Report Toolbar (No Print) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 no-print">
        {/* Report Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setReportType('balance')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              reportType === 'balance'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Bảng Cân Đối Tổng Hợp</span>
          </button>

          <button
            onClick={() => setReportType('zones')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              reportType === 'zones'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Báo Cáo Giáo Khu / Họ</span>
          </button>

          <button
            onClick={() => setReportType('funds')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              reportType === 'funds'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5 text-blue-600" />
            <span>Tình Hình Các Quỹ</span>
          </button>

          <button
            onClick={() => setReportType('journal')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              reportType === 'journal'
                ? 'bg-white text-blue-600 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
            <span>Sổ Nhật Ký Kê Chi Tiết</span>
          </button>
        </div>

        {/* Export & Print CTAs */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Xuất Excel (.xlsx)
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            In Báo Cáo / PDF
          </button>
        </div>
      </div>

      {/* Main Printable Accounting Report Paper */}
      <div
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm print-container select-text"
        id="financial-report-paper"
      >
        {/* Church Letterhead */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-300">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {parishInfo.dioceseName}
            </div>
            <div className="text-base font-bold uppercase text-slate-900 tracking-tight">
              {parishInfo.parishName}
            </div>
            <div className="text-xs text-slate-600">{parishInfo.deaneryName}</div>
            <div className="text-[11px] text-slate-400">{parishInfo.address}</div>
          </div>

          <div className="text-right text-xs">
            <div className="font-bold text-slate-900">HỘI ĐỒNG MỤC VỤ GIÁO XỨ</div>
            <div className="text-slate-600 font-semibold">BAN TÀI CHÍNH QUẢN TRỊ</div>
            <div className="text-[11px] text-slate-500 italic mt-0.5">
              Thời gian: <strong className="text-slate-800">{timeRangeTitle}</strong>
            </div>
          </div>
        </div>

        {/* Report Main Title */}
        <div className="text-center my-6">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-slate-900">
            {reportType === 'balance' && 'BÁO CÁO CÂN ĐỐI TỔNG HỢP THU CHI'}
            {reportType === 'zones' && 'BÁO CÁO ĐÓNG GÓP & TRỢ CẤP THEO GIÁO KHU'}
            {reportType === 'funds' && 'BÁO CÁO TÌNH HÌNH BIẾN ĐỘNG CÁC QUỸ GIÁO XỨ'}
            {reportType === 'journal' && 'SỔ NHẬT KÝ CHI TIẾT THU CHI'}
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            KỲ BÁO CÁO: <span className="uppercase text-blue-600 font-bold">{timeRangeTitle}</span>
          </p>
        </div>

        {/* Summary Highlights */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center mb-6 text-xs">
          <div>
            <div className="text-slate-500 font-medium">Tổng Thu Trong Kỳ (A)</div>
            <div className="text-base font-bold text-emerald-600 font-mono mt-0.5">
              {formatCurrency(totalIncome)}
            </div>
          </div>
          <div>
            <div className="text-slate-500 font-medium">Tổng Chi Trong Kỳ (B)</div>
            <div className="text-base font-bold text-rose-600 font-mono mt-0.5">
              {formatCurrency(totalExpense)}
            </div>
          </div>
          <div>
            <div className="text-slate-500 font-medium">Chênh Lệch Dòng Tiền (A - B)</div>
            <div
              className={`text-base font-bold font-mono mt-0.5 ${
                netBalance >= 0 ? 'text-blue-600' : 'text-amber-600'
              }`}
            >
              {netBalance > 0 ? '+' : ''}
              {formatCurrency(netBalance)}
            </div>
          </div>
        </div>

        {/* TAB 1: BẢNG CÂN ĐỐI TỔNG HỢP THEO NHÓM MỤC */}
        {reportType === 'balance' && (
          <div className="space-y-6 text-xs">
            {/* Section I: Thu */}
            <div>
              <div className="bg-emerald-800 text-white font-bold px-3 py-2 rounded-t-lg flex justify-between items-center text-xs uppercase tracking-wide">
                <span>I. TỔNG HỢP CÁC KHOẢN THU THEO NHÓM MỤC ĐÍCH</span>
                <span>TỔNG THU: {formatCurrency(totalIncome)}</span>
              </div>
              <table className="w-full border-collapse border border-stone-300">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-300">
                  <tr>
                    <th className="border border-stone-300 py-2 px-2 text-center w-12">Mã</th>
                    <th className="border border-stone-300 py-2 px-3 text-left">Nhóm & Mục Thu</th>
                    <th className="border border-stone-300 py-2 px-2 text-center w-16">Số Lần</th>
                    <th className="border border-stone-300 py-2 px-3 text-right w-36">Số Tiền (VNĐ)</th>
                    <th className="border border-stone-300 py-2 px-2 text-center w-20">Tỷ Lệ (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeGroups.map((grp) => (
                    <React.Fragment key={grp.groupName}>
                      <tr className="bg-stone-50/80 font-bold text-stone-900">
                        <td className="border border-stone-300 py-1.5 px-2 text-center">📁</td>
                        <td className="border border-stone-300 py-1.5 px-3 uppercase text-[11px] text-amber-950">
                          {grp.groupName}
                        </td>
                        <td className="border border-stone-300 py-1.5 px-2 text-center">
                          {grp.count}
                        </td>
                        <td className="border border-stone-300 py-1.5 px-3 text-right font-mono text-emerald-800">
                          {formatCurrency(grp.totalAmount)}
                        </td>
                        <td className="border border-stone-300 py-1.5 px-2 text-center">
                          {totalIncome > 0
                            ? ((grp.totalAmount / totalIncome) * 100).toFixed(1)
                            : 0}
                          %
                        </td>
                      </tr>
                      {grp.categories.map((cat) => (
                        <tr key={cat.categoryId} className="hover:bg-amber-50/20 text-stone-700">
                          <td className="border border-stone-300 py-1.5 px-2 text-center font-mono text-[10px] text-stone-500">
                            {cat.categoryCode}
                          </td>
                          <td className="border border-stone-300 py-1.5 px-3 pl-6">
                            - {cat.categoryName}
                          </td>
                          <td className="border border-stone-300 py-1.5 px-2 text-center text-stone-500">
                            {cat.count}
                          </td>
                          <td className="border border-stone-300 py-1.5 px-3 text-right font-mono">
                            {formatCurrency(cat.totalAmount)}
                          </td>
                          <td className="border border-stone-300 py-1.5 px-2 text-center text-stone-500">
                            {cat.percentage.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  {incomeGroups.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-stone-500 italic">
                        Không có khoản thu nào trong kỳ này.
                      </td>
                    </tr>
                  )}
                  <tr className="bg-emerald-50 font-black text-emerald-950 border-t-2 border-emerald-700">
                    <td colSpan={3} className="border border-stone-300 py-2 px-3 text-right uppercase">
                      TỔNG CỘNG CÁC KHOẢN THU (A):
                    </td>
                    <td className="border border-stone-300 py-2 px-3 text-right font-mono text-emerald-800 text-sm">
                      {formatCurrency(totalIncome)}
                    </td>
                    <td className="border border-stone-300 py-2 px-2 text-center">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section II: Chi */}
            <div>
              <div className="bg-rose-800 text-white font-bold px-3 py-2 rounded-t-lg flex justify-between items-center text-xs uppercase tracking-wide">
                <span>II. TỔNG HỢP CÁC KHOẢN CHI THEO NHÓM MỤC ĐÍCH</span>
                <span>TỔNG CHI: {formatCurrency(totalExpense)}</span>
              </div>
              <table className="w-full border-collapse border border-stone-300">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-300">
                  <tr>
                    <th className="border border-stone-300 py-2 px-2 text-center w-12">Mã</th>
                    <th className="border border-stone-300 py-2 px-3 text-left">Nhóm & Mục Chi</th>
                    <th className="border border-stone-300 py-2 px-2 text-center w-16">Số Lần</th>
                    <th className="border border-stone-300 py-2 px-3 text-right w-36">Số Tiền (VNĐ)</th>
                    <th className="border border-stone-300 py-2 px-2 text-center w-20">Tỷ Lệ (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseGroups.map((grp) => (
                    <React.Fragment key={grp.groupName}>
                      <tr className="bg-stone-50/80 font-bold text-stone-900">
                        <td className="border border-stone-300 py-1.5 px-2 text-center">📁</td>
                        <td className="border border-stone-300 py-1.5 px-3 uppercase text-[11px] text-amber-950">
                          {grp.groupName}
                        </td>
                        <td className="border border-stone-300 py-1.5 px-2 text-center">
                          {grp.count}
                        </td>
                        <td className="border border-stone-300 py-1.5 px-3 text-right font-mono text-rose-800">
                          {formatCurrency(grp.totalAmount)}
                        </td>
                        <td className="border border-stone-300 py-1.5 px-2 text-center">
                          {totalExpense > 0
                            ? ((grp.totalAmount / totalExpense) * 100).toFixed(1)
                            : 0}
                          %
                        </td>
                      </tr>
                      {grp.categories.map((cat) => (
                        <tr key={cat.categoryId} className="hover:bg-amber-50/20 text-stone-700">
                          <td className="border border-stone-300 py-1.5 px-2 text-center font-mono text-[10px] text-stone-500">
                            {cat.categoryCode}
                          </td>
                          <td className="border border-stone-300 py-1.5 px-3 pl-6">
                            - {cat.categoryName}
                          </td>
                          <td className="border border-stone-300 py-1.5 px-2 text-center text-stone-500">
                            {cat.count}
                          </td>
                          <td className="border border-stone-300 py-1.5 px-3 text-right font-mono">
                            {formatCurrency(cat.totalAmount)}
                          </td>
                          <td className="border border-stone-300 py-1.5 px-2 text-center text-stone-500">
                            {cat.percentage.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  {expenseGroups.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-stone-500 italic">
                        Không có khoản chi nào trong kỳ này.
                      </td>
                    </tr>
                  )}
                  <tr className="bg-rose-50 font-black text-rose-950 border-t-2 border-rose-700">
                    <td colSpan={3} className="border border-stone-300 py-2 px-3 text-right uppercase">
                      TỔNG CỘNG CÁC KHOẢN CHI (B):
                    </td>
                    <td className="border border-stone-300 py-2 px-3 text-right font-mono text-rose-800 text-sm">
                      {formatCurrency(totalExpense)}
                    </td>
                    <td className="border border-stone-300 py-2 px-2 text-center">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section III: Cân Đối Quỹ */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-300">
              <h4 className="font-bold text-stone-900 uppercase text-xs mb-3">
                III. KẾT LUẬN CÂN ĐỐI TÀI CHÍNH TRONG KỲ
              </h4>
              <div className="space-y-1.5 text-xs text-stone-800">
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span>1. Tổng các nguồn thu thực nhận trong kỳ:</span>
                  <span className="font-bold text-emerald-800 font-mono">
                    {formatCurrency(totalIncome)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span>2. Tổng các chi phí và xuất quỹ trong kỳ:</span>
                  <span className="font-bold text-rose-800 font-mono">
                    {formatCurrency(totalExpense)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-sm bg-white px-2 rounded border border-stone-200">
                  <span>3. Chênh lệch thu chi (Tồn ròng phát sinh):</span>
                  <span
                    className={`font-mono ${
                      netBalance >= 0 ? 'text-emerald-800' : 'text-rose-800'
                    }`}
                  >
                    {netBalance > 0 ? '+' : ''}
                    {formatCurrency(netBalance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BÁO CÁO ĐÓNG GÓP THEO GIÁO KHU */}
        {reportType === 'zones' && (
          <div className="space-y-4 text-xs">
            <table className="w-full border-collapse border border-stone-300">
              <thead className="bg-stone-100 text-stone-800 font-bold">
                <tr>
                  <th className="border border-stone-300 py-2.5 px-3 text-left">Giáo Khu / Họ Đạo</th>
                  <th className="border border-stone-300 py-2.5 px-3 text-left">Trưởng Khu / Phụ Trách</th>
                  <th className="border border-stone-300 py-2.5 px-2 text-center">Số Lần Nộp</th>
                  <th className="border border-stone-300 py-2.5 px-3 text-right">Tổng Đóng Góp (Thu)</th>
                  <th className="border border-stone-300 py-2.5 px-3 text-right">Trợ Cấp / Nhận Chi</th>
                  <th className="border border-stone-300 py-2.5 px-3 text-right">Cân Đối Ròng</th>
                </tr>
              </thead>
              <tbody>
                {zoneSummaries.map((z) => (
                  <tr key={z.zoneId} className="hover:bg-stone-50 text-stone-800">
                    <td className="border border-stone-300 py-2 px-3 font-semibold text-stone-900">
                      {z.zoneName}
                    </td>
                    <td className="border border-stone-300 py-2 px-3 text-stone-600">
                      {z.leader || 'Ban Trị Sự'}
                    </td>
                    <td className="border border-stone-300 py-2 px-2 text-center text-stone-600">
                      {z.txCount}
                    </td>
                    <td className="border border-stone-300 py-2 px-3 text-right font-mono text-emerald-800 font-semibold">
                      {formatCurrency(z.totalDonation)}
                    </td>
                    <td className="border border-stone-300 py-2 px-3 text-right font-mono text-rose-800 font-semibold">
                      {formatCurrency(z.totalAssistance)}
                    </td>
                    <td className="border border-stone-300 py-2 px-3 text-right font-mono font-bold text-stone-900">
                      {formatCurrency(z.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: TÌNH HÌNH BIẾN ĐỘNG CÁC QUỸ */}
        {reportType === 'funds' && (
          <div className="space-y-4 text-xs">
            <table className="w-full border-collapse border border-stone-300">
              <thead className="bg-stone-100 text-stone-800 font-bold">
                <tr>
                  <th className="border border-stone-300 py-2.5 px-3 text-left">Tên Quỹ</th>
                  <th className="border border-stone-300 py-2.5 px-2 text-center">Mã Quỹ</th>
                  <th className="border border-stone-300 py-2.5 px-3 text-right">Số Dư Ban Đầu</th>
                  <th className="border border-stone-300 py-2.5 px-3 text-right">Tổng Thu</th>
                  <th className="border border-stone-300 py-2.5 px-3 text-right">Tổng Chi</th>
                  <th className="border border-stone-300 py-2.5 px-3 text-right">Số Dư Hiện Tại</th>
                </tr>
              </thead>
              <tbody>
                {fundSummaries.map((f) => (
                  <tr key={f.fundId} className="hover:bg-stone-50 text-stone-800">
                    <td className="border border-stone-300 py-2.5 px-3 font-semibold text-stone-900">
                      {f.fundName}
                    </td>
                    <td className="border border-stone-300 py-2.5 px-2 text-center font-mono text-[10px] text-stone-500">
                      {f.fundCode}
                    </td>
                    <td className="border border-stone-300 py-2.5 px-3 text-right font-mono text-stone-600">
                      {formatCurrency(f.initialBalance)}
                    </td>
                    <td className="border border-stone-300 py-2.5 px-3 text-right font-mono text-emerald-800 font-medium">
                      +{formatCurrency(f.totalIncome)}
                    </td>
                    <td className="border border-stone-300 py-2.5 px-3 text-right font-mono text-rose-800 font-medium">
                      -{formatCurrency(f.totalExpense)}
                    </td>
                    <td className="border border-stone-300 py-2.5 px-3 text-right font-mono font-bold text-amber-950 text-sm">
                      {formatCurrency(f.currentBalance)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-amber-50/80 font-black text-stone-900 border-t-2 border-stone-400">
                  <td colSpan={2} className="border border-stone-300 py-2.5 px-3 text-right uppercase">
                    TỔNG TỒN TẤT CẢ CÁC QUỸ GIÁO XỨ:
                  </td>
                  <td className="border border-stone-300 py-2.5 px-3 text-right font-mono">
                    {formatCurrency(fundSummaries.reduce((s, f) => s + f.initialBalance, 0))}
                  </td>
                  <td className="border border-stone-300 py-2.5 px-3 text-right font-mono text-emerald-800">
                    +{formatCurrency(fundSummaries.reduce((s, f) => s + f.totalIncome, 0))}
                  </td>
                  <td className="border border-stone-300 py-2.5 px-3 text-right font-mono text-rose-800">
                    -{formatCurrency(fundSummaries.reduce((s, f) => s + f.totalExpense, 0))}
                  </td>
                  <td className="border border-stone-300 py-2.5 px-3 text-right font-mono text-amber-950 text-sm">
                    {formatCurrency(totalParishBalance)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: SỔ NHẬT KÝ CHI TIẾT */}
        {reportType === 'journal' && (
          <div className="space-y-4 text-xs">
            <table className="w-full border-collapse border border-stone-300">
              <thead className="bg-stone-100 text-stone-800 font-bold">
                <tr>
                  <th className="border border-stone-300 py-2 px-2 text-center w-10">STT</th>
                  <th className="border border-stone-300 py-2 px-2 text-left">Số Phiếu</th>
                  <th className="border border-stone-300 py-2 px-2 text-center">Ngày</th>
                  <th className="border border-stone-300 py-2 px-3 text-left">Mục & Diễn Giải</th>
                  <th className="border border-stone-300 py-2 px-3 text-left">Người Nộp / Nhận</th>
                  <th className="border border-stone-300 py-2 px-3 text-right">Thu (VNĐ)</th>
                  <th className="border border-stone-300 py-2 px-3 text-right">Chi (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => {
                  const isInc = tx.type === 'income';
                  return (
                    <tr key={tx.id} className="hover:bg-stone-50 text-stone-800">
                      <td className="border border-stone-300 py-1.5 px-2 text-center text-stone-500">
                        {idx + 1}
                      </td>
                      <td className="border border-stone-300 py-1.5 px-2 font-mono font-bold text-stone-900">
                        {tx.voucherNumber}
                      </td>
                      <td className="border border-stone-300 py-1.5 px-2 text-center whitespace-nowrap text-stone-600">
                        {formatDate(tx.date)}
                      </td>
                      <td className="border border-stone-300 py-1.5 px-3">
                        <div className="font-semibold text-stone-900">
                          [{tx.categoryCode}] {tx.categoryName}
                        </div>
                        <div className="text-[11px] text-stone-500">{tx.description}</div>
                      </td>
                      <td className="border border-stone-300 py-1.5 px-3">
                        <div>{tx.payerReceiver}</div>
                        <div className="text-[10px] text-stone-400">{tx.parishZoneName}</div>
                      </td>
                      <td className="border border-stone-300 py-1.5 px-3 text-right font-mono text-emerald-800">
                        {isInc ? formatCurrency(tx.amount) : '-'}
                      </td>
                      <td className="border border-stone-300 py-1.5 px-3 text-right font-mono text-rose-800">
                        {!isInc ? formatCurrency(tx.amount) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Official Catholic Parish Signatures */}
        <div className="mt-12 pt-4 border-t border-stone-300">
          <div className="text-right text-xs italic text-stone-600 mb-3">
            Lập báo cáo tại Giáo Xứ, {formatDateLong()}
          </div>

          <div className="grid grid-cols-4 gap-4 text-center text-xs mt-6">
            <div>
              <div className="font-bold text-stone-900">Kế Toán Ban Tài Chính</div>
              <div className="text-[10px] text-stone-500 italic mt-0.5">(Ký & ghi rõ họ tên)</div>
              <div className="h-20 flex items-end justify-center font-semibold text-stone-800 text-xs">
                {parishInfo.accountantName}
              </div>
            </div>

            <div>
              <div className="font-bold text-stone-900">Thủ Quỹ Ban Tài Chính</div>
              <div className="text-[10px] text-stone-500 italic mt-0.5">(Ký & ghi rõ họ tên)</div>
              <div className="h-20 flex items-end justify-center font-semibold text-stone-800 text-xs">
                {parishInfo.treasurerName}
              </div>
            </div>

            <div>
              <div className="font-bold text-stone-900">Trưởng Ban Hành Giáo</div>
              <div className="text-[10px] text-stone-500 italic mt-0.5">(Ký & ghi rõ họ tên)</div>
              <div className="h-20 flex items-end justify-center font-semibold text-stone-800 text-xs">
                {parishInfo.committeeLeaderName}
              </div>
            </div>

            <div>
              <div className="font-bold text-stone-900">Linh Mục Chánh Xứ</div>
              <div className="text-[10px] text-stone-500 italic mt-0.5">
                (Duyệt, chuẩn y & đóng dấu)
              </div>
              <div className="h-20 flex items-end justify-center font-bold text-stone-950 text-xs">
                {parishInfo.pastorName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
