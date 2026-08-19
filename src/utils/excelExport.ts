import * as XLSX from 'xlsx';
import { CategorySummary, FundBalanceSummary, GroupSummary, ParishInfo, Transaction } from '../types';
import { formatDate, formatNumber } from './formatters';

/**
 * Xuất danh sách giao dịch ra Excel (Sổ Nhật Ký Thu Chi)
 */
export function exportTransactionsToExcel(
  transactions: Transaction[],
  parishInfo: ParishInfo,
  timeTitle: string
) {
  const wb = XLSX.utils.book_new();

  // Dữ liệu dòng tiêu đề và thông tin Giáo xứ
  const headerData = [
    [parishInfo.dioceseName.toUpperCase()],
    [parishInfo.parishName.toUpperCase()],
    [''],
    [`SỔ NHẬT KÝ THU CHI GIÁO XỨ - ${timeTitle.toUpperCase()}`],
    [`Ngày xuất báo cáo: ${new Date().toLocaleDateString('vi-VN')}`],
    [''],
    [
      'STT',
      'Số Phiếu',
      'Ngày',
      'Loại',
      'Mã Mục',
      'Mục Thu/Chi',
      'Nhóm Mục Đích',
      'Người Nộp / Nhận',
      'Giáo Khu / Ân Nhân',
      'Quỹ Tiền Tệ',
      'Thu (VNĐ)',
      'Chi (VNĐ)',
      'Nội Dung Diễn Giải',
      'Người Lập Phiếu',
      'Người Duyệt',
    ],
  ];

  let totalIncome = 0;
  let totalExpense = 0;

  const rows = transactions.map((t, index) => {
    const isIncome = t.type === 'income';
    if (isIncome) {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }

    return [
      index + 1,
      t.voucherNumber,
      formatDate(t.date),
      isIncome ? 'Thu' : 'Chi',
      t.categoryCode,
      t.categoryName,
      t.categoryGroup,
      t.payerReceiver,
      t.parishZoneName || 'Khác',
      t.fundName,
      isIncome ? t.amount : 0,
      !isIncome ? t.amount : 0,
      t.description,
      t.creator,
      t.approver || '',
    ];
  });

  const summaryRow = [
    '',
    'TỔNG CỘNG',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    totalIncome,
    totalExpense,
    `Chênh lệch (Tồn ròng): ${formatNumber(totalIncome - totalExpense)} đ`,
    '',
    '',
  ];

  const signatures = [
    [''],
    [''],
    [
      '',
      'Kế Toán',
      '',
      'Thủ Quỹ',
      '',
      '',
      'Trưởng Ban Hành Giáo',
      '',
      '',
      'Linh Mục Chánh Xứ',
    ],
    [
      '',
      `(Ký & ghi rõ họ tên)`,
      '',
      `(Ký & ghi rõ họ tên)`,
      '',
      '',
      `(Ký & ghi rõ họ tên)`,
      '',
      '',
      `(Duyệt & đóng dấu)`,
    ],
    ['', parishInfo.accountantName, '', parishInfo.treasurerName, '', '', parishInfo.committeeLeaderName, '', '', parishInfo.pastorName],
  ];

  const fullData = [...headerData, ...rows, summaryRow, ...signatures];
  const ws = XLSX.utils.aoa_to_sheet(fullData);

  // Thiết lập độ rộng cột
  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 16 }, // Số Phiếu
    { wch: 12 }, // Ngày
    { wch: 8 },  // Loại
    { wch: 14 }, // Mã Mục
    { wch: 32 }, // Tên Mục
    { wch: 28 }, // Nhóm Mục
    { wch: 30 }, // Người nộp/nhận
    { wch: 25 }, // Giáo khu
    { wch: 28 }, // Quỹ
    { wch: 16 }, // Thu
    { wch: 16 }, // Chi
    { wch: 45 }, // Diễn giải
    { wch: 20 }, // Lập phiếu
    { wch: 20 }, // Duyệt
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'So_Nhat_Ky_Thu_Chi');
  const filename = `So_Thu_Chi_${parishInfo.parishName.replace(/\s+/g, '_')}_${timeTitle.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Xuất Báo Cáo Tổng Hợp Thu Chi theo Nhóm Mục & Mã (Bảng Cân Đối Tài Chính)
 */
export function exportSummaryReportToExcel(
  incomeGroups: GroupSummary[],
  expenseGroups: GroupSummary[],
  fundSummaries: FundBalanceSummary[],
  parishInfo: ParishInfo,
  timeTitle: string,
  totalIncome: number,
  totalExpense: number
) {
  const wb = XLSX.utils.book_new();

  const reportData = [
    [parishInfo.dioceseName.toUpperCase()],
    [parishInfo.parishName.toUpperCase()],
    [''],
    [`BÁO CÁO TỔNG HỢP THU CHI GIÁO XỨ - ${timeTitle.toUpperCase()}`],
    [`Ngày lập: ${new Date().toLocaleDateString('vi-VN')}`],
    [''],
    ['I. TỔNG HỢP CÁC KHOẢN THU (DOANH THU QUỸ)'],
    ['Mã Số', 'Mục Thu Chi', 'Nhóm Mục', 'Số Lần', 'Số Tiền (VNĐ)', 'Tỷ Lệ (%)'],
  ];

  incomeGroups.forEach((grp) => {
    reportData.push([
      '',
      `[NHÓM] ${grp.groupName.toUpperCase()}`,
      '',
      String(grp.count),
      String(grp.totalAmount),
      totalIncome > 0 ? ((grp.totalAmount / totalIncome) * 100).toFixed(1) + '%' : '0%',
    ]);

    grp.categories.forEach((cat) => {
      reportData.push([
        cat.categoryCode,
        `  - ${cat.categoryName}`,
        grp.groupName,
        String(cat.count),
        String(cat.totalAmount),
        totalIncome > 0 ? ((cat.totalAmount / totalIncome) * 100).toFixed(1) + '%' : '0%',
      ]);
    });
  });

  reportData.push([
    '',
    'TỔNG CỘNG THU (A)',
    '',
    '',
    String(totalIncome),
    '100%',
  ]);

  reportData.push(['']);
  reportData.push(['II. TỔNG HỢP CÁC KHOẢN CHI (CHI PHÍ HOẠT ĐỘNG & XÂY DỰNG)']);
  reportData.push(['Mã Số', 'Mục Thu Chi', 'Nhóm Mục', 'Số Lần', 'Số Tiền (VNĐ)', 'Tỷ Lệ (%)']);

  expenseGroups.forEach((grp) => {
    reportData.push([
      '',
      `[NHÓM] ${grp.groupName.toUpperCase()}`,
      '',
      String(grp.count),
      String(grp.totalAmount),
      totalExpense > 0 ? ((grp.totalAmount / totalExpense) * 100).toFixed(1) + '%' : '0%',
    ]);

    grp.categories.forEach((cat) => {
      reportData.push([
        cat.categoryCode,
        `  - ${cat.categoryName}`,
        grp.groupName,
        String(cat.count),
        String(cat.totalAmount),
        totalExpense > 0 ? ((cat.totalAmount / totalExpense) * 100).toFixed(1) + '%' : '0%',
      ]);
    });
  });

  reportData.push([
    '',
    'TỔNG CỘNG CHI (B)',
    '',
    '',
    String(totalExpense),
    '100%',
  ]);

  reportData.push(['']);
  reportData.push(['III. CÂN ĐỐI VÀ TỒN QUỸ']);
  reportData.push(['Nội Dung', 'Số Tiền (VNĐ)']);
  reportData.push(['Tổng Thu trong kỳ (A)', String(totalIncome)]);
  reportData.push(['Tổng Chi trong kỳ (B)', String(totalExpense)]);
  reportData.push(['Chênh Lệch Thu Chi (A - B)', String(totalIncome - totalExpense)]);

  reportData.push(['']);
  reportData.push(['IV. CHI TIẾT SỐ DƯ THEO CÁC QUỸ']);
  reportData.push(['Tên Quỹ', 'Mã Quỹ', 'Tồn Đầu Kỳ', 'Tổng Thu', 'Tổng Chi', 'Tồn Hiện Tại']);
  fundSummaries.forEach((f) => {
    reportData.push([
      f.fundName,
      f.fundCode,
      String(f.initialBalance),
      String(f.totalIncome),
      String(f.totalExpense),
      String(f.currentBalance),
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(reportData);
  ws['!cols'] = [
    { wch: 14 },
    { wch: 38 },
    { wch: 30 },
    { wch: 10 },
    { wch: 20 },
    { wch: 14 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Bao_Cao_Tong_Hop');
  const filename = `Bao_Cao_Tong_Hop_${parishInfo.parishName.replace(/\s+/g, '_')}_${timeTitle.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, filename);
}
