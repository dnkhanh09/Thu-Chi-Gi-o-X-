/**
 * Định dạng tiền tệ VNĐ
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount).replace('₫', 'đ');
}

/**
 * Định dạng số nguyên có dấu chấm ngăn cách hàng nghìn
 */
export function formatNumber(amount: number): string {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat('vi-VN').format(amount);
}

/**
 * Định dạng ngày YYYY-MM-DD sang DD/MM/YYYY
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

/**
 * Định dạng ngày chi tiết phong cách văn bản hành chính Giáo hội
 * Ví dụ: "ngày 19 tháng 08 năm 2026"
 */
export function formatDateLong(dateString?: string): string {
  const d = dateString ? new Date(dateString) : new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `ngày ${day} tháng ${month} năm ${year}`;
}

/**
 * Chuyển đổi số tiền thành chữ tiếng Việt (dùng cho Phiếu Thu / Phiếu Chi)
 */
const defaultNumbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function readThreeDigits(threeDigits: number, showZeroHundred: boolean): string {
  let hundreds = Math.floor(threeDigits / 100);
  let tens = Math.floor((threeDigits % 100) / 10);
  let units = threeDigits % 10;
  let result = '';

  if (hundreds > 0 || showZeroHundred) {
    result += defaultNumbers[hundreds] + ' trăm ';
  }

  if (tens > 1) {
    result += defaultNumbers[tens] + ' mươi ';
    if (units === 1) {
      result += 'mốt ';
    } else if (units === 5) {
      result += 'lăm ';
    } else if (units > 0) {
      result += defaultNumbers[units] + ' ';
    }
  } else if (tens === 1) {
    result += 'mười ';
    if (units === 5) {
      result += 'lăm ';
    } else if (units > 0) {
      result += defaultNumbers[units] + ' ';
    }
  } else if (tens === 0 && units > 0) {
    if (hundreds > 0 || showZeroHundred) {
      result += 'lẻ ';
    }
    result += defaultNumbers[units] + ' ';
  }

  return result;
}

export function numberToVietnameseWords(amount: number): string {
  if (amount === 0) return 'Không đồng chẵn.';
  if (amount < 0) return 'Âm ' + numberToVietnameseWords(Math.abs(amount)).toLowerCase();

  const unitsScale = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
  let strAmount = Math.floor(amount).toString();
  let groups: number[] = [];

  while (strAmount.length > 0) {
    groups.push(parseInt(strAmount.slice(-3), 10));
    strAmount = strAmount.slice(0, -3);
  }

  let textResult = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    let groupVal = groups[i];
    if (groupVal > 0) {
      let isFirst = i === groups.length - 1;
      let groupText = readThreeDigits(groupVal, !isFirst);
      textResult += groupText + unitsScale[i] + ' ';
    }
  }

  textResult = textResult.trim();
  if (!textResult) return 'Không đồng chẵn.';

  // Viết hoa chữ cái đầu tiên
  textResult = textResult.charAt(0).toUpperCase() + textResult.slice(1) + ' đồng chẵn.';
  return textResult;
}

/**
 * Sinh số phiếu tự động dạng PT-YYYYMM-001 hoặc PC-YYYYMM-001
 */
export function generateVoucherCode(
  type: 'income' | 'expense',
  date: string,
  existingTransactions: { voucherNumber: string }[]
): string {
  const prefix = type === 'income' ? 'PT' : 'PC';
  const cleanDate = (date || new Date().toISOString().slice(0, 10)).replace(/-/g, '').slice(0, 6);
  const pattern = `${prefix}-${cleanDate}-`;

  const currentMonthTransactions = existingTransactions.filter(
    (t) => t.voucherNumber && t.voucherNumber.startsWith(pattern)
  );

  let maxNum = 0;
  currentMonthTransactions.forEach((t) => {
    const numPart = t.voucherNumber.replace(pattern, '');
    const parsed = parseInt(numPart, 10);
    if (!isNaN(parsed) && parsed > maxNum) {
      maxNum = parsed;
    }
  });

  const nextNum = (maxNum + 1).toString().padStart(3, '0');
  return `${pattern}${nextNum}`;
}
